// Nove modelos defensivos didáticos. Dados sintéticos, sem rede, shell ou arquivos externos.
export function yaraFixtureMatch(text='',size=0){
 const matched=typeof text==='string'&&typeof size==='number'&&size>=0&&size<1024*1024&&text.includes('CYBERLAB-DEMO-v1');
 return {matched,reason:matched?'marker_and_size':'condition_not_met'};
}
export function sigmaEventMatch(event={}){
 for(const k of ['eventId','parentRole','childRole','approved'])if(event[k]===undefined)return {decision:'insufficient_data',missing:k};
 const isMatch=event.eventId===1&&event.parentRole==='document_editor'&&event.childRole==='script_runner';
 return {decision:isMatch&&!event.approved?'alert':'no_alert',rule:'synthetic_parent_child'};
}
export function assessDetectionRule(e={}){
 if(!e.dataComplete||!e.signal)return {decision:'insufficient_data'};
 if(e.signal==='startup_change'&&!e.approved)return {decision:'review'};
 return {decision:'no_alert'};
}
export function mapMitreEvidence(e={}){
 if(!e.source||!e.action)return {status:'insufficient_data',technique:null};
 if(e.action==='scheduled_task_created'&&e.source==='task_audit')return {status:'candidate_mapping',technique:'T1053.005',confidence:'behavior_only'};
 return {status:'not_mapped',technique:null};
}
export function diffStartupEntries(baseline=[],current=[]){
 const indexed=new Map(baseline.map(e=>[e.id,e.digest]));
 const changed=current.filter(e=>e.id&&(!indexed.has(e.id)||indexed.get(e.id)!==e.digest));
 return {addedOrChanged:changed.map(e=>e.id),reviewIds:changed.filter(e=>!e.approved).map(e=>e.id)};
}
export function assessExecution(e={}){
 if(e.sensorHealthy!==true)return {decision:'insufficient_data'};
 const match=e.parentRole==='document_editor'&&e.childRole==='script_runner';
 return {decision:match&&!e.approved?'review':'no_alert'};
}
export function assessPowerShellEvent(e={}){
 if(!e.sourceHealthy||typeof e.commandLine!=='string')return {decision:'insufficient_data'};
 const signal=/(?:-|\/)encodedcommand\b/i.test(e.commandLine);
 return {decision:signal&&!e.approved?'review':'no_alert',signal:'metadata_only'};
}
export function assessInjectionEvidence(e={}){
 if(!e.sensorHealthy)return {decision:'insufficient_data'};
 if(!(e.remoteWrite&&e.remoteThread&&e.sameTarget))return {decision:'insufficient_chain'};
 return {decision:e.authorizedTool?'no_alert':'investigate',evidence:'two_synthetic_signals'};
}
export function correlateSiemTimeline(events=[],maxSeconds=60){
 const valid=events.filter(x=>x.host&&x.guid&&Number.isFinite(x.at)).sort((a,b)=>a.at-b.at);
 for(const start of valid.filter(x=>x.kind==='process_start')){
  if(valid.some(x=>x.kind==='task_created'&&x.host===start.host&&x.guid===start.guid&&x.at>=start.at&&x.at-start.at<=maxSeconds))
   return {decision:'correlate',host:start.host,guid:start.guid};
 }
 return {decision:'no_chain'};
}
