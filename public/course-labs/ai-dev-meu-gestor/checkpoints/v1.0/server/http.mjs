import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {openStore,DomainError} from './db.mjs';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8'};
function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
async function jsonBody(req){
 let size=0;const chunks=[];
 for await(const chunk of req){size+=chunk.length;if(size>32768)throw new DomainError(413,'TOO_LARGE','Corpo muito grande');chunks.push(chunk);}
 let data;
 try{data=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new DomainError(400,'BAD_JSON','JSON inválido');}
 if(data===null||typeof data!=='object'||Array.isArray(data))throw new DomainError(400,'BAD_JSON','Objeto esperado');
 return data;
}
export async function startServer({dbFile=':memory:',port=4173,host='127.0.0.1',staticDir}={}){
 if(host!=='127.0.0.1')throw Error('Somente loopback é permitido');
 const store=openStore(dbFile),assets=staticDir?resolve(staticDir):null;
 const server=createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; connect-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'");
  try{
   const method=req.method||'GET',pathname=new URL(req.url||'/', 'http://127.0.0.1').pathname;
   if(pathname.startsWith('/api/')){
    if(method==='GET'&&pathname==='/api/health')return send(res,200,{ok:true,storage:'sqlite-local'});
    if(method==='GET'&&pathname==='/api/clients')return send(res,200,{items:store.clients()});
    if(method==='GET'&&pathname==='/api/orders')return send(res,200,{items:store.orders()});
    if(method==='POST'&&pathname==='/api/clients')return send(res,201,{item:store.createClient(await jsonBody(req))});
    if(method==='POST'&&pathname==='/api/orders')return send(res,201,{item:store.createOrder(await jsonBody(req))});
    const client=pathname.match(/^\/api\/clients\/(C-[0-9]+)$/);
    if(client){
     if(method==='PATCH')return send(res,200,{item:store.renameClient(client[1],await jsonBody(req))});
     if(method==='DELETE')return send(res,200,store.removeClient(client[1]));
    }
    const order=pathname.match(/^\/api\/orders\/(OS-[0-9]+)$/);
    if(order){
     if(method==='PATCH')return send(res,200,{item:store.renameOrder(order[1],await jsonBody(req))});
     if(method==='DELETE')return send(res,200,store.removeOrder(order[1]));
    }
    const advancing=pathname.match(/^\/api\/orders\/(OS-[0-9]+)\/advance$/);
    if(advancing&&method==='PATCH')return send(res,200,{item:store.advanceOrder(advancing[1])});
    return send(res,404,{error:'NOT_FOUND',message:'Rota não encontrada'});
   }
   if(method!=='GET'||!assets){res.writeHead(404);res.end('Not found');return;}
   const requested=decodeURIComponent(pathname);
   if(requested.includes('\0'))throw new DomainError(400,'BAD_PATH','Caminho inválido');
   const filename=resolve(assets,'.'+requested);
   if(filename!==assets&&!filename.startsWith(assets+sep))throw new DomainError(403,'FORBIDDEN','Caminho não permitido');
   let serving=filename;
   try{if(!(await stat(serving)).isFile())serving=resolve(assets,'index.html');}
   catch{if(extname(serving)){res.writeHead(404);res.end('Not found');return;}serving=resolve(assets,'index.html');}
   const binary=await readFile(serving);
   res.writeHead(200,{'Content-Type':mime[extname(serving)]||'application/octet-stream'});res.end(binary);
  }catch(err){
   if(err instanceof DomainError)return send(res,err.status,{error:err.code,message:err.message});
   return send(res,500,{error:'SERVER_ERROR',message:'Erro interno. Consulte o terminal local.'});
  }
 });
 try{await new Promise((ok,fail)=>{server.once('error',fail);server.listen(port,host,ok);});}
 catch(err){store.close();throw err;}
 const close=async()=>{await new Promise((ok,fail)=>server.close(err=>err?fail(err):ok()));store.close();};
 return {server,store,close,url:'http://'+host+':'+server.address().port};
}
