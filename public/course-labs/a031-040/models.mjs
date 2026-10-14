// Laboratório determinístico, apenas loopback e dados fictícios.
import http from 'node:http';
export function authorizeScope(scope,target,now) {
 try {
   const url=new URL(target);
   return Number.isFinite(scope.expiresAt)&&now<scope.expiresAt&&url.origin===scope.origin
     &&scope.allowedPaths.includes(url.pathname)&&!url.username&&!url.password&&!url.hash;
 } catch { return false; }
}
export async function inventoryOwnApp(){
 const server=http.createServer((req,res)=>{
  const routes={'/':200,'/health':200,'/api/notes':401};
  const status=routes[req.url]??404;
  res.writeHead(status,{'content-type':'application/json'});
  res.end(JSON.stringify({route:req.url,status,fixture:true}));
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 try{
  const origin='http://127.0.0.1:'+server.address().port;
  const paths=['/','/health','/api/notes'];
  const scope={origin,allowedPaths:paths,expiresAt:1900000000};
  const records=[];
  for(const p of paths){
   if(!authorizeScope(scope,origin+p,1800000000))throw Error('FORA_DO_ESCOPO');
   const r=await fetch(origin+p,{redirect:'manual',signal:AbortSignal.timeout(1500)});
   records.push({path:p,status:r.status,local:true});
  }
  return records;
 }finally{await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
}
export function triageSignal(s){
 if(s.kind==='banner')return 'INFO';
 if(s.kind==='object-access'&&s.differentUser===true){
   if(s.observed===403||s.observed===404)return 'CONTROLADO';
   if(s.observed===200 && s.baseline===200 && s.repeatable && s.proof==='OWN-LAB')return 'CONFIRMADO';
   return 'HIPOTESE';
 }
 return 'INFO';
}
export function assessImpact(f){
 if(f.confirmed!==true)return {level:'NAO_DETERMINADO',note:'Ainda falta evidência de consequência'};
 if(f.sensitive===true && f.exposedObjects>=1)return {level:'ALTO',note:'Exposição de objeto sensível confirmada em cenário fictício'};
 return {level:'BAIXO',note:'Sem evidência de dado sensível; avaliar contexto'};
}
export function validateFinding(f){
 const needed=['id','scope','asset','expected','observed','evidence','fix','retest'];
 const missing=needed.filter(k=>f?.[k]===undefined||f[k]===null||f[k]==='');
 const sensitive=/Bearer\s|authorization:|api[_-]?key|password|senha|secret/i.test(String(f?.evidence||''));
 const retest=Number.isInteger(f?.retest?.observed)&&f.retest.observed===f.expected&&f.retest.legitimate===200;
 return {ok:missing.length===0&&!sensitive&&retest,missing,redacted:sensitive};
}
export function modelThreat(t){
 if(t.flow==='API->store' && t.principal==='download-only' && t.operation==='delete')
  return {category:'Elevation of Privilege',asset:'documento',control:'IAM nega Delete',positive:'Get autorizado',negative:'Delete negado'};
 if(t.flow==='browser->API' && t.actorFromClient===true)
  return {category:'Spoofing',asset:'identidade',control:'principal derivado da sessão',positive:'Alice acessa Alice',negative:'Bob não vira Alice'};
 return {category:'Unclassified',asset:'indeterminado',control:'detalhar fluxo',positive:null,negative:null};
}
export function safeProfilePatch(user,body){
 const update={...user};
 if(typeof body?.name==='string'&&body.name.trim().length>0)update.name=body.name.trim();
 return update;
}
export function categorizeScanner(item){
 if(item.kind==='dummy-secret' && item.source==='code')return 'SECRET';
 if(item.source==='lockfile')return 'SCA';
 if(item.source==='code')return 'SAST';
 if(item.source==='http')return 'DAST';
 return 'REVISAO_MANUAL';
}
export function releaseGate(g){
 return g.testsPassing===true && g.artifactBuilt===true && g.verifiedHighRisks===0;
}
export async function capstone(){
 const scope=authorizeScope({origin:'http://127.0.0.1:9000',expiresAt:1900000000,allowedPaths:['/','/health']},'http://127.0.0.1:9000/health',1800000000);
 const inventory=await inventoryOwnApp();
 // A mesma fatura sintética só deve ser visível ao proprietário.
 const invoice={id:'F001',owner:'alice'};
 const access=(user,secure)=>(secure && user!==invoice.owner)?403:200;
 const before=triageSignal({kind:'object-access',differentUser:true,observed:access('bob',false),baseline:access('alice',false),repeatable:true,proof:'OWN-LAB'});
 const after=triageSignal({kind:'object-access',differentUser:true,observed:access('bob',true),baseline:access('alice',true),repeatable:true,proof:'OWN-LAB'});
 const report=validateFinding({id:'LAB-F001',scope:'loopback',asset:'/api/invoices/F001',expected:403,observed:200,evidence:'OWN-LAB',fix:'owner check',retest:{observed:access('bob',true),legitimate:access('alice',true)}});
 return {scope,inventory,before,after,report,release:releaseGate({testsPassing:after==='CONTROLADO'&&report.ok,verifiedHighRisks:0,artifactBuilt:true})};
}
