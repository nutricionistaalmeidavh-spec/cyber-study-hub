// ÚNICO host de escuta: 127.0.0.1. Identidade '?as=' é simulação, não sessão real.
import http from 'node:http';
import {decideRead,invoice,makeAuditEvent} from './model.mjs';
const mode=process.env.LAB_MODE==='vulnerable'?'vulnerable':'corrected';
const port=Number(process.env.LAB_PORT||4191);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Porta fora do intervalo didático');
http.createServer((req,res)=>{
 const url=new URL(req.url||'/', 'http://127.0.0.1');
 if(req.method!=='GET') {res.writeHead(405).end();return;}
 if(url.pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({ok:true,mode}));return;}
 if(url.pathname!=='/invoices/F001'){res.writeHead(404).end();return;}
 const actor=url.searchParams.get('as')||'unknown';const result=decideRead({actor,invoice,mode});
 const event=makeAuditEvent({actor,result,at:new Date().toISOString(),mode});
 console.log(JSON.stringify(event));
 res.writeHead(result.status,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(result.body));
}).listen(port,'127.0.0.1',()=>console.log('Laboratório local: http://127.0.0.1:'+port+' ['+mode+']'));
