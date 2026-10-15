// Oficinas Red/Purple Team. Somente objetos e bytes sintéticos; nenhum alvo, rede,
// persistência, execução de processos, alteração de contas ou acesso a credenciais.
import {createHash} from 'node:crypto';
export const digest=(bytes)=>createHash('sha256').update(bytes).digest('hex');
const own=(v)=>typeof v==='string'&&v.length>0;
export function evaluateLesson(id,x){
 if(!x||typeof x!=='object'||Array.isArray(x))return {status:'INVALID_INPUT'};
 switch(id){
 case 181: {
  if(x.stop===true)return {status:'STOP',reason:'STOP_CONDITION'};
  return {status:['LAB01','LAB02'].includes(x.asset)&&['observe','read_log'].includes(x.action)&&x.approved===true?'ALLOW':'DENY',reason:'ROE_SCOPE_AND_APPROVAL'};
 }
 case 182: {
  if(![x.parentPid,x.childPpid].every(Number.isSafeInteger)||!own(x.parentHost)||!own(x.childHost))return {status:'INVALID_INPUT'};
  return {status:x.parentPid===x.childPpid&&x.parentHost===x.childHost&&x.childTime>=x.parentTime?'CHAIN_OK':'REVIEW_LINEAGE',maliciousProven:false};
 }
 case 183: {
  if(x.source!=='local-fixture'||typeof x.bytes!=='string'||!own(x.expectedSha256))return {status:'INVALID_INPUT'};
  const observedSha256=digest(Buffer.from(x.bytes,'utf8'));
  return {status:observedSha256===x.expectedSha256?'VALIDATED':'REVIEW_INTEGRITY',observedSha256,safeProven:false};
 }
 case 184: {
  if(!own(x.from)||!own(x.to))return {status:'INVALID_INPUT'};
  return {status:x.from==='reader'&&x.to==='analyst'&&x.approvedRole==='analyst'&&x.ticketApproved===true&&x.asset==='LAB01'?'AUTHORIZED':'REVIEW_CHANGE',privilegeChanged:false};
 }
 case 185: {
  if(!own(x.name)||!own(x.command)||!own(x.owner))return {status:'INVALID_INPUT'};
  return {status:x.name==='lab-healthcheck'&&x.command==='./lab/healthcheck.txt'&&x.owner==='lab_admin'&&x.rollbackDocumented===true?'BASELINE_OK':'REVIEW_AUTOSTART',taskCreated:false};
 }
 case 186: {
  if(x.marker!=='CSH-CANARY-186'||!own(x.actor))return {status:'INVALID_INPUT'};
  return {status:x.actor==='approved_scanner'&&x.ticket==='LAB-CANARY'?'EXPECTED_READ':'REVIEW_CANARY',credentialExposed:false};
 }
 case 187: {
  if(!own(x.source)||!own(x.target)||!own(x.account))return {status:'INVALID_INPUT'};
  return {status:x.source==='LAB01'&&x.target==='LAB02'&&x.account==='lab_user'&&x.approved===true?'AUTHORIZED_SESSION':'REVIEW_SESSION',connectionCreated:false};
 }
 case 188: {
  if(!Array.isArray(x.expected)||!Array.isArray(x.observed)||!x.expected.every(own)||!x.observed.every(own))return {status:'INVALID_INPUT'};
  const missing=[...new Set(x.expected)].filter(src=>!x.observed.includes(src));
  return {status:missing.length?'GAP_IDENTIFIED':'COVERED',missing,evasionProven:false};
 }
 case 189: {
  if(!Array.isArray(x.times)||x.times.length<3||!x.times.every(t=>Number.isFinite(t)))return {status:'INVALID_INPUT'};
  const gaps=x.times.slice(1).map((t,i)=>t-x.times[i]);
  if(gaps.some(t=>t<=0))return {status:'INVALID_INPUT'};
  const mean=gaps.reduce((a,b)=>a+b,0)/gaps.length;
  const maxDeviation=Math.max(...gaps.map(g=>Math.abs(g-mean)));
  const periodic=maxDeviation/mean<=0.15;
  return {status:periodic&&x.approved===true?'APPROVED_HEARTBEAT':periodic?'CONTEXT_REQUIRED':'INSUFFICIENT_SIGNAL',periodic,c2Proven:false};
 }
 case 190: {
  if(!Array.isArray(x.tests)||x.tests.length===0||!x.tests.every(t=>typeof t?.telemetry==='boolean'&&typeof t?.shouldAlert==='boolean'&&typeof t?.alerted==='boolean'&&typeof t?.triageable==='boolean'))return {status:'INVALID_INPUT'};
  const total=x.tests.length,telemetry=x.tests.filter(t=>t.telemetry).length;
  const truePositive=x.tests.filter(t=>t.shouldAlert&&t.alerted&&t.telemetry).length;
  const falsePositive=x.tests.filter(t=>!t.shouldAlert&&t.alerted).length;
  const triageable=x.tests.filter(t=>t.telemetry&&t.triageable).length;
  return {status:telemetry===total&&falsePositive===0&&x.tests.every(t=>t.alerted===t.shouldAlert&&t.triageable)?'COVERED':'GAP_IDENTIFIED',total,telemetry,truePositive,falsePositive,triageable,coverage:telemetry/total};
 }
 default: return {status:'INVALID_LESSON'};
 }
}
const exact183='CSH-183-FIXTURE';
const hash183=digest(Buffer.from(exact183,'utf8'));
export const fixtures={
 181:{positive:{asset:'LAB01',action:'observe',approved:true,stop:false},negative:{asset:'EXTERNAL01',action:'observe',approved:true,stop:false}},
 182:{positive:{parentPid:310,childPpid:310,parentHost:'LAB01',childHost:'LAB01',parentTime:10,childTime:11},negative:{parentPid:310,childPpid:999,parentHost:'LAB01',childHost:'LAB01',parentTime:10,childTime:11}},
 183:{positive:{source:'local-fixture',bytes:exact183,expectedSha256:hash183},negative:{source:'local-fixture',bytes:exact183+'-CHANGED',expectedSha256:hash183}},
 184:{positive:{from:'reader',to:'analyst',approvedRole:'analyst',ticketApproved:true,asset:'LAB01'},negative:{from:'reader',to:'admin',approvedRole:'analyst',ticketApproved:true,asset:'LAB01'}},
 185:{positive:{name:'lab-healthcheck',command:'./lab/healthcheck.txt',owner:'lab_admin',rollbackDocumented:true},negative:{name:'lab-healthcheck',command:'/tmp/unknown',owner:'lab_admin',rollbackDocumented:true}},
 186:{positive:{marker:'CSH-CANARY-186',actor:'approved_scanner',ticket:'LAB-CANARY'},negative:{marker:'CSH-CANARY-186',actor:'unknown_reader',ticket:''}},
 187:{positive:{source:'LAB01',target:'LAB02',account:'lab_user',approved:true},negative:{source:'LAB01',target:'EXTERNAL',account:'lab_user',approved:true}},
 188:{positive:{expected:['process','identity','file'],observed:['process','file']},negative:{expected:['process','identity','file'],observed:['process','identity','file']}},
 189:{positive:{times:[0,60,120,180],approved:true},negative:{times:[0,60,120,180],approved:false}},
 190:{positive:{tests:[{telemetry:true,shouldAlert:true,alerted:true,triageable:true},{telemetry:true,shouldAlert:true,alerted:true,triageable:true},{telemetry:true,shouldAlert:false,alerted:false,triageable:true},{telemetry:true,shouldAlert:false,alerted:false,triageable:true}]},negative:{tests:[{telemetry:true,shouldAlert:true,alerted:true,triageable:true},{telemetry:false,shouldAlert:true,alerted:false,triageable:false},{telemetry:true,shouldAlert:false,alerted:true,triageable:true},{telemetry:true,shouldAlert:false,alerted:false,triageable:true}]}}
};
export function runWorkshop(id){
 if(!Object.prototype.hasOwnProperty.call(fixtures,id))return {status:'INVALID_LESSON'};
 return {lesson:id,positive:evaluateLesson(id,fixtures[id].positive),negative:evaluateLesson(id,fixtures[id].negative)};
}
