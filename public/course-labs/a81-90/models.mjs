// Aulas 081–090: modelos sintéticos determinísticos, sem rede, serviços ou chaves.
import { createHash } from 'node:crypto';
const fail = message => { throw new Error(message); };
export function filterPackets(packets, { protocol, stream } = {}) {
  if (!Array.isArray(packets)) fail('pacotes inválidos');
  return packets.filter(p => (!protocol || String(p.proto).toUpperCase() === protocol.toUpperCase()) &&
    (stream === undefined || p.stream === stream));
}
export function suricataAlerts(events) {
  if (!Array.isArray(events)) fail('eventos inválidos');
  return events.filter(e => e.proto === 'http' && e.method === 'GET' &&
    e.flow === 'to_server' && e.established === true)
    .map(e => ({ sid:1000001, action:'alert', flow_id:e.flow_id ?? null }));
}
export function correlateFailures(events, threshold=3, windowMinutes=5) {
  const groups = new Map();
  for(const e of events) {
    if (e.ok !== false || !e.user || !e.host || !Number.isFinite(e.minute)) continue;
    const key=e.user+'@'+e.host;
    groups.set(key,[...(groups.get(key) ?? []),e.minute]);
  }
  const found=[];
  for(const [key,times] of groups) {
    times.sort((a,b)=>a-b);
    const count=times.reduce((max,t,i)=>Math.max(max, times.slice(i).filter(x=>x>=t&&x<t+windowMinutes).length),0);
    if(count>=threshold){const pos=key.lastIndexOf('@');found.push({user:key.slice(0,pos),host:key.slice(pos+1),count});}
  }
  return found.sort((a,b)=>a.user.localeCompare(b.user));
}
const basename = s => String(s??'').split(/[\\/]/).pop().toLowerCase();
export function mapTechniqueEvidence(event) {
  if (event?.eventType==='process_start' && event.source==='Sysmon' &&
      basename(event.image)==='powershell.exe' && basename(event.parent)==='winword.exe')
    return {technique:'T1059.001', status:'hypothesis', source:'Sysmon'};
  return null;
}
export function triageIndicator(ind) {
  if (!ind || !['ioc','ioa','ttp'].includes(ind.kind)) fail('tipo inválido');
  if (ind.kind==='ioc' && (!ind.context || ind.now > ind.expiresAt)) return 'contextualizar';
  return ind.observed ? 'investigar' : 'insuficiente';
}
export function sigmaOfficePowerShell(event) {
  return event?.eventId===1 && basename(event.parentImage)==='winword.exe' &&
    basename(event.image)==='powershell.exe';
}
export function yaraTrainingMatch(sample) {
  if (typeof sample !== 'string' && !Buffer.isBuffer(sample)) fail('amostra inválida');
  const data=Buffer.isBuffer(sample)?sample.toString('utf8'):sample;
  return data.includes('LAB_MARKER_742') && data.includes('training');
}
export function huntOfficeShell(events) {
  const result=[];
  for(const e of events) {
    if (basename(e.process)!=='powershell.exe' || basename(e.parent)!=='winword.exe') continue;
    const parent=events.find(p=>p.host===e.host && basename(p.process)==='winword.exe' &&
      Number.isFinite(p.minute)&&Number.isFinite(e.minute)&&p.minute<=e.minute&&e.minute-p.minute<=5);
    if(parent) result.push({host:e.host,minute:e.minute,verdict:'investigate'});
  }
  return result;
}
const sequence=['preparacao','triagem','contencao','erradicacao','recuperacao','licoes'];
export function advanceIncident(from,to,details) {
  if (sequence.indexOf(to)!==sequence.indexOf(from)+1) fail('salto de fase');
  if (from==='triagem' && (!details?.evidenceRecorded || !details.owner)) fail('rastreabilidade obrigatória');
  return {stage:to,owner:details?.owner ?? 'responsável designado'};
}
export function verifyEvidence(original,copy) {
  const hash = v=>createHash('sha256').update(v).digest('hex');
  const sourceHash=hash(original),copyHash=hash(copy);
  return {sourceHash,copyHash,identical:sourceHash===copyHash};
}
export function runLesson(id) {
  const fixture=[
    {proto:'DNS',stream:null},{proto:'TCP',stream:7},{proto:'TCP',stream:7}
  ];
  switch(Number(id)){
    case 81: return {positive:filterPackets(fixture,{protocol:'TCP',stream:7}).length,negative:filterPackets(fixture,{protocol:'UDP'}).length};
    case 82: return {positive:suricataAlerts([{proto:'http',method:'GET',flow:'to_server',established:true}]),negative:suricataAlerts([{proto:'http',method:'POST',flow:'to_server',established:true}])};
    case 83: return {positive:correlateFailures([{user:'ana',host:'pc1',minute:0,ok:false},{user:'ana',host:'pc1',minute:1,ok:false},{user:'ana',host:'pc1',minute:3,ok:false}]),negative:correlateFailures([{user:'bia',host:'pc1',minute:0,ok:false}])};
    case 84: return {positive:mapTechniqueEvidence({eventType:'process_start',source:'Sysmon',parent:'WINWORD.EXE',image:'powershell.exe'}),negative:mapTechniqueEvidence({eventType:'login_failed',source:'Security'})};
    case 85: return {positive:triageIndicator({kind:'ioa',observed:true}),negative:triageIndicator({kind:'ioc',now:11,expiresAt:10,context:false,observed:true})};
    case 86: return {positive:sigmaOfficePowerShell({eventId:1,parentImage:'WINWORD.EXE',image:'powershell.exe'}),negative:sigmaOfficePowerShell({eventId:1,parentImage:'cmd.exe',image:'powershell.exe'})};
    case 87: return {positive:yaraTrainingMatch('LAB_MARKER_742 training'),negative:yaraTrainingMatch('LAB_MARKER_742 invoice')};
    case 88: return {positive:huntOfficeShell([{host:'a',minute:0,process:'WINWORD.EXE'},{host:'a',minute:2,process:'powershell.exe',parent:'WINWORD.EXE'}]),negative:huntOfficeShell([{host:'b',minute:2,process:'powershell.exe',parent:'cmd.exe'}])};
    case 89: return {positive:advanceIncident('triagem','contencao',{evidenceRecorded:true,owner:'SOC'}),negative:'A recuperação direta sem investigação é rejeitada'};
    case 90: return {positive:verifyEvidence('registro-lab-001','registro-lab-001'),negative:verifyEvidence('registro-lab-001','registro-lab-002')};
    default: fail('ID inválido');
  }
}
