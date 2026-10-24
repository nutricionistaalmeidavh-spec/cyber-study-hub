import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { resolve, extname, join, sep } from 'node:path';
import { createPlatformHandler } from './platform.mjs';
import { sendWithLocalMta } from './send-email.mjs';
import { registrationEnabled } from '../src/auth/registration-policy.mjs';
import { protectedPath, canonicalAssetPath } from '../src/worker/course-access.mjs';
import { stripAcademyPath } from '../src/lib/academyRouting.mjs';

const port=Number(process.env.PORT || 8788);
const origin=process.env.HUB_ORIGIN || 'http://localhost:8788';
const dataDir=resolve(process.env.HUB_DATA_DIR || './.hub-data');
await mkdir(dataDir,{recursive:true,mode:0o700});
const app=createPlatformHandler({
  dbPath:join(dataDir,'platform.sqlite'),
  origin,
  bootstrapKey:process.env.HUB_BOOTSTRAP_KEY,
  openRegistration:registrationEnabled(process.env.HUB_OPEN_REGISTRATION),
  artisysConnectorSecret:process.env.HUB_ARTISYS_CONNECTOR_SECRET || '',
  emailFrom:process.env.HUB_EMAIL_FROM || '',
  sendResetMail:process.env.HUB_EMAIL_FROM ? message=>sendWithLocalMta(message,process.env.HUB_SENDMAIL_PATH||'/usr/sbin/sendmail') : null
});
const dist=resolve('./dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp',
  '.jpg':'image/jpeg','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8','.md':'text/markdown; charset=utf-8'};
const server=createServer(async(req,res)=>{
  const publicPath=new URL(req.url,origin).pathname;
  const route=stripAcademyPath(publicPath);
  if(route.startsWith('/api/')){
    if(route!==publicPath){const url=new URL(req.url,origin);url.pathname=route;req.url=url.pathname+url.search;req.headers['x-academy-path']='true';}
    return app.handle(req,res);
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
  if(protectedPath(route)){
    const result=app.authorize(req,route);
    if(!result.ok){res.writeHead(result.status,{'Cache-Control':'no-store','Content-Type':'text/plain; charset=utf-8'});res.end('Acesso não autorizado.');return;}
    if(!canonicalAssetPath(route)){res.writeHead(404);res.end();return;}
  }
  try{
    const relative=decodeURIComponent(route);
    if(relative.includes('\0')||relative.includes('\\'))throw Error('Invalid path');
    const target=resolve(dist,'.'+relative);
    if(target!==dist&&!target.startsWith(dist+sep))throw Error('Invalid path');
    let file=target;
    try{
      const s=await stat(file);
      if(!s.isFile())file=join(dist,'index.html');
    }catch{
      if(extname(relative))throw Error('No such asset');
      file=join(dist,'index.html');
    }
    const bytes=await readFile(file);
    res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream',
      'X-Content-Type-Options':'nosniff','Cache-Control':protectedPath(route)?'private, no-store':extname(file)==='.html'?'no-store':'public, max-age=300'});
    res.end(req.method==='HEAD'?undefined:bytes);
  }catch{
    res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Recurso indisponível.');
  }
});
server.listen(port,()=>console.log('Cyber Study Hub (self-hosted) on '+origin));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{
  server.close(()=>{app.close();process.exit(0);});
});
