// EscolaLab: servidor de treinamento exclusivamente local e com dados fictícios.
// O parâmetro ?as= NÃO representa autenticação: não reutilize este servidor em produção.
import http from 'node:http';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {decideRead,invoice,makeAuditEvent,detectionRule} from './model.mjs';

const root=path.dirname(fileURLToPath(import.meta.url));
const assets=Object.freeze({
  '/': {file:'student-ui/index.html',type:'text/html; charset=utf-8'},
  '/app.js': {file:'student-ui/app.js',type:'text/javascript; charset=utf-8'},
  '/missions.js': {file:'student-ui/missions.js',type:'text/javascript; charset=utf-8'},
  '/style.css': {file:'student-ui/style.css',type:'text/css; charset=utf-8'}
});
const headers=Object.freeze({
  'Cache-Control':'no-store',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'X-Frame-Options':'DENY',
  'Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
});
export function createEscolaLabServer({mode=process.env.LAB_MODE==='vulnerable'?'vulnerable':'corrected',port=Number(process.env.LAB_PORT||4191)}={}){
  if(!['corrected','vulnerable'].includes(mode))throw Error('Modo inválido');
  if(!Number.isInteger(port)||port<0||port>65535||(port!==0&&port<1024))throw Error('Porta fora do intervalo didático');
  return http.createServer((req,res)=>{
    const response=(status,body,extra={})=>{res.writeHead(status,{...headers,...extra});res.end(body);};
    // Host check prevents accessing the deliberately vulnerable fixture through DNS rebinding.
    const host=req.headers.host;
    const expectedPort=port===0?req.socket.localPort:port;
    if(host!=='127.0.0.1:'+expectedPort) return response(403,'Host local obrigatório');
    if(req.headers.origin&&req.headers.origin!=='http://127.0.0.1:'+expectedPort)
      return response(403,'Origem externa bloqueada');
    if(req.headers['sec-fetch-site']&& !['same-origin','none'].includes(req.headers['sec-fetch-site']))
      return response(403,'Requisição externa bloqueada');
    if(req.method!=='GET'&&req.method!=='HEAD')return response(405,'Método não permitido',{'Allow':'GET, HEAD'});
    let url;
    try{url=new URL(req.url||'/', 'http://127.0.0.1:'+expectedPort);}catch{return response(400,'URL inválida');}
    const pathname=url.pathname;
    if(pathname==='/health'){
      return response(200,JSON.stringify({ok:true,mode,fixture:true,host:'127.0.0.1'}),{'Content-Type':'application/json; charset=utf-8'});
    }
    if(assets[pathname]){
      if(url.search)return response(400,'Requisição inválida');
      const asset=assets[pathname];
      try{
        const data=readFileSync(path.join(root,asset.file));
        res.writeHead(200,{...headers,'Content-Type':asset.type});
        res.end(req.method==='HEAD'?undefined:data);
      }catch{return response(500,'Arquivo de interface indisponível');}
      return;
    }
    if(pathname!=='/invoices/F001'&&pathname!=='/lab/api/invoices/F001')return response(404,'Não encontrado');
    if(req.method==='HEAD')return response(405,'Método não permitido',{'Allow':'GET'});
    const actor=url.searchParams.get('as')||'unknown';
    const requestedMode=url.searchParams.get('mode');
    // Versão dinâmica é permitida apenas na rota guiada e sempre permanece em loopback.
    if(requestedMode!==null&&(pathname!=='/lab/api/invoices/F001'||!['vulnerable','corrected'].includes(requestedMode)))
      return response(400,JSON.stringify({error:'Modo inválido'}),{'Content-Type':'application/json; charset=utf-8'});
    const selectedMode=requestedMode||mode;
    const result=decideRead({actor,invoice,mode:selectedMode});
    const event=makeAuditEvent({actor,result,at:new Date().toISOString(),mode:selectedMode});
    const signal=detectionRule(event);
    console.log(JSON.stringify({event,signal,local:true}));
    const body=pathname==='/lab/api/invoices/F001'
      ? {request:{path:pathname,actor,mode:selectedMode},response:{status:result.status,body:result.body},
          audit:event,detection:signal,fictional:true}
      :result.body;
    return response(result.status,JSON.stringify(body),{'Content-Type':'application/json; charset=utf-8'});
  });
}
export function startServer(){
  const port=Number(process.env.LAB_PORT||4191);
  const server=createEscolaLabServer({port});
  server.on('error',e=>{console.error('EscolaLab:',e.code==='EADDRINUSE'?'Porta '+port+' ocupada. Feche a sessão anterior ou altere LAB_PORT.':e.message);process.exitCode=1;});
  server.listen(port,'127.0.0.1',()=>{
    console.log('\n  EscolaLab — ArtiSys Academy\n  Abra no navegador: http://127.0.0.1:'+port+'\n  Ctrl+C encerra o laboratório.\n  Dados fictícios; nunca exponha o servidor à rede.\n');
  });
  return server;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))startServer();
