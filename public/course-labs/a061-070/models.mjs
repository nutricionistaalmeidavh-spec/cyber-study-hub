// Fixtures sintéticas: este arquivo não executa comandos de enumeração no host do aluno.
import http from 'node:http';

export function inspectLinux(files){
 return files.map(f=>{
  const worldWritable=(f.mode&0o002)!==0;
  const suid=(f.mode&0o4000)!==0;
  if(worldWritable&&f.owner==='root'&&f.usedBy==='root-cron')return {...f,risk:'HIGH',reason:'script privilegiado gravável por todos; permissão e consumidor formam o caminho'};
  if(suid)return {...f,risk:'REVIEW',reason:'SUID exige revisão de dono, finalidade, versões e ACL; isoladamente não prova exploração'};
  return {...f,risk:'LOW',reason:'nenhum caminho privilegiado evidente na fixture'};
 });
}
export function inspectWindows(services){
 return services.map(s=>{
   const weak=s.imageAcl.some(v=>/^(Users|Everyone|Authenticated Users):(Modify|Write|FullControl)$/.test(v));
   return {...s,risk:weak&&s.runsAs==='LocalSystem'?'HIGH':weak?'REVIEW':'LOW',
    reason:weak?'modificação do binário permitida a identidade ampla':'ACL não indica escrita ampla'};
 });
}
export function linuxPrivilegePath({writer,commandOwner,commandWritableBy,delegated}){
 const risky=delegated===true&&commandOwner==='root'&&commandWritableBy.includes(writer);
 return {risk:risky?'HIGH':'LOW',reason:risky?'entrada controlada alcança operação delegada privilegiada':'não há ponte comprovada na fixture'};
}
export function windowsServiceRisk({path,quoted,writablePrefixes,runsAs}){
 const unquotedSpace=quoted===false&&/[\\/][^\\/]* [^\\/]*[\\/]/.test(path);
 if(!unquotedSpace)return {risk:'LOW',reason:'caminho citado ou sem espaço intermediário'};
 const writeCandidate=writablePrefixes.length>0;
 return {risk:writeCandidate&&runsAs==='LocalSystem'?'HIGH':'REVIEW',reason:writeCandidate?'candidato de interpretação com escrita e contexto privilegiado':'aspas ausentes sem escrita confirmada não bastam'};
}
export function secureService(service){
 const acl=service.acl.filter(entry=>!/^(Everyone|Users|Authenticated Users):(Write|Modify|FullControl)$/.test(entry));
 return {...service,acl,retest:{legitimate:acl.includes('Service:Read'),unauthorizedDenied:!acl.includes('Everyone:Write')}};
}
export async function identifyLoopback(){
 const srv=http.createServer((_req,res)=>{
   res.writeHead(200,{'Content-Type':'text/plain','Server':'TeachingService/2.0'});
   res.end('fixture ok');
 });
 await new Promise((resolve,reject)=>{srv.once('error',reject);srv.listen(0,'127.0.0.1',resolve);});
 try{
  const url='http://127.0.0.1:'+srv.address().port;
  const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(2500)});
  return {local:true,httpStatus:r.status,productBanner:r.headers.get('server'),versionStatus:'HYPOTHESIS'};
 }finally{await new Promise((resolve,reject)=>srv.close(err=>err?reject(err):resolve()));}
}
export function scanFinding(f){
 if(!f.signatureMatch)return {status:'NOT_OBSERVED'};
 if(f.fixedVersion===true&&!f.behaviorEvidence)return {status:'FALSE_POSITIVE'};
 if(f.installedVersionVerified&&f.behaviorEvidence&&f.ownedLab===true)return {status:'CONFIRMED_LAB'};
 return {status:'POSSIBLE'};
}
function version(s){
 if(!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(s))return null;
 return s.split('.').map(Number);
}
export function matchAdvisory(advisory,asset){
 const installed=version(asset.version),fixed=version(advisory.fixedIn);
 if(!installed||!fixed)return {status:'NEEDS_REVIEW',affected:null,reason:'versão ou release desconhecido'};
 if(asset.product!==advisory.product)return {status:'NOT_APPLICABLE',affected:false,reason:'produto diferente'};
 const less=installed.findIndex((n,i)=>n!==fixed[i]);
 const affected=less>=0?installed[less]<fixed[less]:false;
 return {status:affected?'POTENTIALLY_AFFECTED':'NOT_APPLICABLE',affected,reason:'comparação didática: versões estáveis somente; confirmar faixas e build real'};
}
export function validatePocPlan(p){
 const reasons=[];
 if(p.ownedLab!==true)reasons.push('sem autorização de laboratório próprio');
 if(p.isolated!==true)reasons.push('sem isolamento');
 if(p.snapshot!==true)reasons.push('sem snapshot');
 if(!Number.isInteger(p.attempts)||p.attempts<1||p.attempts>3)reasons.push('tentativas fora do limite');
 if(!['read-fixture','validate-condition'].includes(p.action))reasons.push('ação não permitida');
 return {allowed:reasons.length===0,reasons};
}
export function adEffectiveGroups(user,groups){
 const reachable=new Set([user]);
 let changed=true;
 while(changed){
  changed=false;
  for(const [group,members] of Object.entries(groups)){
   if(!Array.isArray(members))continue;
   if(!reachable.has(group)&&members.some(member=>reachable.has(member))){
    reachable.add(group);changed=true;
   }
  }
 }
 return [...reachable].filter(x=>x!==user).sort();
}
