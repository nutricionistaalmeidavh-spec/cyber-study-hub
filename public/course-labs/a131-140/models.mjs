// A131–140: simulated malware triage for defenders; all bytes and events are inert fixtures.
import {createHash} from 'node:crypto';
export function triageEvidence({kind,sha256,trustedBuild,behaviorEvents=[]}){
 if(!/^[0-9a-f]{64}$/i.test(sha256??''))throw Error('SHA-256 válido é obrigatório');
 if(!Array.isArray(behaviorEvents))throw Error('eventos inválidos');
 return {verdict:kind==='own-app'&&trustedBuild===true&&behaviorEvents.length===0?'benign-lab-fixture':'requires-corroboration',
  malwareProven:false,sha256,observations:behaviorEvents.slice(),nextAction:'correlate-static-and-authorized-dynamic-evidence'};
}
export function classifyCapabilities({masquerades=false,selfReplicates=false,encryptsFiles=false,deliversPayload=false}){
 const labels=[];
 if(masquerades)labels.push('trojan-like');
 if(selfReplicates)labels.push('worm-like');
 if(encryptsFiles)labels.push('ransomware-like');
 if(deliversPayload)labels.push('loader-like');
 return {labels,malwareProven:false,note:'Categorias não são mutuamente exclusivas; exigem evidências de comportamento e intenção'};
}
export function inspectFixture(bytes){
 if(!Buffer.isBuffer(bytes))throw Error('bytes precisam ser Buffer');
 const magic=bytes.length>=4&&bytes.subarray(0,4).equals(Buffer.from([0x7f,0x45,0x4c,0x46]))
  ? 'ELF-header-candidate' : bytes.length>=2&&bytes[0]===0x4d&&bytes[1]===0x5a
  ? 'PE/MZ-header-candidate':bytes.length===0?'empty':'unknown';
 return {format:magic,sha256:createHash('sha256').update(bytes).digest('hex'),
  size:bytes.length,executed:false,validPEProven:false,validELFProven:false};
}
export function createStaticReport(bytes,{declaredImports=[],declaredSigner=''}={}){
 if(!Buffer.isBuffer(bytes)||bytes.length>1024*1024)throw Error('fixture inválida/maior que 1MiB');
 const strings=[...bytes.toString('latin1').matchAll(/[\x20-\x7e]{4,}/g)].map(x=>x[0]).slice(0,200);
 return {sha256:createHash('sha256').update(bytes).digest('hex'),size:bytes.length,
  format:inspectFixture(bytes).format,printableStrings:strings,declaredImports:[...declaredImports],
  declaredSigner,signerTrustVerified:false,importExecutionObserved:false,networkContactObserved:false};
}
export function shannonEntropy(data){
 if(!Buffer.isBuffer(data))throw Error('use Buffer de bytes');
 if(data.length===0)return 0;
 const counts=new Uint32Array(256);
 for(const byte of data)counts[byte]++;
 let h=0;
 for(const c of counts)if(c>0){const p=c/data.length;h-=p*Math.log2(p);}
 return Math.max(0,Math.min(8,Math.round(h*1000000)/1000000));
}
export function assessIsolation({network,snapshot,sharedFolders,sharedClipboard,realCredentials}){
 const findings=[];
 if(network==='host-only')findings.push('host-accessible-network');
 else if(network!=='disabled')findings.push('network-not-disabled');
 if(snapshot!==true)findings.push('missing-snapshot');
 if(sharedFolders!==false)findings.push('shared-folders-enabled');
 if(sharedClipboard!==false)findings.push('shared-clipboard-enabled');
 if(realCredentials!==false)findings.push('real-credentials-present');
 return {readyForSyntheticLab:findings.length===0,findings,safeForLiveMalware:false,
  note:'Checklist teórico não demonstra isolamento efetivo nem autoriza malware real.'};
}
export function chooseRemnuxWorkflow({artifact,authorized}){
 if(authorized!==true)return {steps:['stop-and-request-authorization'],requiresRemnuxInstallation:false};
 const options={
  pcap:['verify-capture-provenance','inspect-offline-pcap','report-observations'],
  file:['verify-hash-and-provenance','inspect-static-metadata','report-hypotheses'],
  document:['verify-hash-and-provenance','inspect-document-metadata-without-opening-active-content','report-hypotheses']
 };
 if(!Object.hasOwn(options,artifact))throw Error('tipo de artefato não suportado');
 return {steps:options[artifact],requiresRemnuxInstallation:false,
  note:'Roteiro de análise inerte; REMnux é alternativa opcional de ferramentas gratuitas.'};
}
export function correlateProcessEvents(events){
 if(!Array.isArray(events))throw Error('eventos inválidos');
 const sessions=new Map();
 for(const e of events){
  if(!Number.isInteger(e.pid)||!e.processStart)throw Error('PID e início obrigatórios');
  const key=e.pid+'@'+e.processStart;
  if(!sessions.has(key))sessions.set(key,{pid:e.pid,processStart:e.processStart,events:[]});
  sessions.get(key).events.push({...e});
 }
 for(const session of sessions.values())session.events.sort((a,b)=>(a.timestamp??0)-(b.timestamp??0));
 return {sessions:[...sessions.values()].sort((a,b)=>a.pid-b.pid||a.processStart.localeCompare(b.processStart)),
  note:'PID isolado pode ser reutilizado; exigir processStart e evidência corroborada'};
}
export function compareAutorunBaselines(before,after){
 const old=new Set(before.map(x=>x.id)),newSet=new Set(after.map(x=>x.id));
 return {added:[...newSet].filter(x=>!old.has(x)).sort(),
  removed:[...old].filter(x=>!newSet.has(x)).sort(),malwareProven:false,
  note:'Mudança de autorun pode ser instalação legítima; confirmar assinatura e proprietário antes de intervir'};
}
export function reviewDynamicTimeline(events,{network}){
 const sorted=[...events].sort((a,b)=>a.at-b.at);
 const networkIsolationOk=network==='disabled';
 const findings=sorted.filter(e=>e.kind==='network-request').length>0?
  ['synthetic-network-event-observed']: [];
 return {events:sorted,networkIsolationOk,findings,malwareProven:false,safeForLiveMalware:false,
  note:'Eventos são uma simulação estática, não capturas do sistema operacional'};
}
export function runWorkshop(n){
 switch(n){
 case 131:return {allowed:triageEvidence({kind:'own-app',sha256:'a'.repeat(64),trustedBuild:true}),
  contrast:triageEvidence({kind:'unknown',sha256:'b'.repeat(64),trustedBuild:false,behaviorEvents:['network']}),
  limit:'Sem sandbox, execução ou atribuição de autoria; um IOC isolado não estabelece infecção.',liveMalwareExecuted:false};
 case 132:return {allowed:classifyCapabilities({masquerades:false,selfReplicates:false,encryptsFiles:false}),
  contrast:classifyCapabilities({masquerades:true,selfReplicates:false,encryptsFiles:true}),
  limit:'Rótulos descrevem capacidades artificiais e não indicam intenção ou infecção de sistema.',liveMalwareExecuted:false};
 case 133:return {allowed:inspectFixture(Buffer.from('4d5a9000','hex')),
  contrast:inspectFixture(Buffer.from('000102','hex')),
  limit:'Magic bytes apenas sugerem formato; não validam estrutura PE/ELF nem executam binário.',liveMalwareExecuted:false};
 case 134:return {allowed:createStaticReport(Buffer.from('release demo.local'),{declaredImports:['KERNEL32.dll']}),
  contrast:createStaticReport(Buffer.from('release changed'),{declaredImports:['WinHttp.dll']}),
  limit:'Strings, hashes e imports declarados não comprovam comportamento de execução ou confiança em assinatura.',liveMalwareExecuted:false};
 case 135:return {allowed:{AABB:shannonEntropy(Buffer.from('AABB')),AAAA:shannonEntropy(Buffer.from('AAAA'))},
  contrast:{orderedBytes:shannonEntropy(Buffer.from(Array.from({length:256},(_,i)=>i)))},
  limit:'Entropia global ignora ordem e tamanho e não classifica automaticamente packing ou malware.',liveMalwareExecuted:false};
 case 136:return {allowed:assessIsolation({network:'disabled',snapshot:true,sharedFolders:false,sharedClipboard:false,realCredentials:false}),
  contrast:assessIsolation({network:'host-only',snapshot:true,sharedFolders:false,sharedClipboard:false,realCredentials:false}),
  limit:'Checklist de configuração não testa hipervisor, contenção real nem execução de amostras suspeitas.',liveMalwareExecuted:false};
 case 137:return {allowed:chooseRemnuxWorkflow({artifact:'file',authorized:true}),
  contrast:chooseRemnuxWorkflow({artifact:'document',authorized:false}),
  limit:'Não roda REMnux nem faz parsing de arquivos perigosos; só decide etapas e autorização.',liveMalwareExecuted:false};
 case 138:return {allowed:correlateProcessEvents([{pid:7,processStart:'10:00',timestamp:1,operation:'CreateFile',path:'own-app'}]),
  contrast:correlateProcessEvents([{pid:7,processStart:'10:00',timestamp:1,operation:'CreateFile',path:'a'},
   {pid:7,processStart:'11:00',timestamp:2,operation:'CreateFile',path:'b'}]),
  limit:'Eventos são fixtures; Process Monitor/Explorer reais exigem coleta autorizada, timestamps e contexto.',liveMalwareExecuted:false};
 case 139:return {allowed:compareAutorunBaselines([{id:'app'}],[{id:'app'}]),
  contrast:compareAutorunBaselines([{id:'app'}],[{id:'app'},{id:'unknown'}]),
  limit:'Autorun novo não implica persistência maliciosa; sem acesso ao registro, tarefas ou serviços reais.',liveMalwareExecuted:false};
 case 140:return {allowed:reviewDynamicTimeline([{at:1,kind:'process-start',processId:'own-app'},{at:2,kind:'file-write',processId:'own-app'}],{network:'disabled'}),
  contrast:reviewDynamicTimeline([{at:1,kind:'network-request',processId:'own-app'}],{network:'bridged'}),
  limit:'Não executa malware nem simula contenção de uma VM real, apenas ordena telemetria sintética.',liveMalwareExecuted:false};
 default:throw Error('aula fora de 131–140');
 }
}
