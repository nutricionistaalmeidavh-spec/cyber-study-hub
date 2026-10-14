// Modelos didáticos sintéticos, offline, sem acessar endpoints ou arquivos reais.
import {createHash} from 'node:crypto';
export function classifyObject({knownBad=false,signatureHit=false,heuristicScore=0,agentHealthy=true}={}){
 if(!agentHealthy)return {action:'degraded',reason:'agent_offline'};
 if(knownBad||signatureHit)return {action:'block',reason:knownBad?'known_bad':'signature'};
 if(heuristicScore>=80)return {action:'review',reason:'heuristic'};
 return {action:'allow_monitor',reason:'no_confirmed_indicator'};
}
export function fileDigestAssessment(content,expectedHash,sourceTrusted){
 const digest=createHash('sha256').update(content).digest('hex');
 if(!sourceTrusted)return {digest,status:'untrusted_reference'};
 if(typeof expectedHash!=='string'||!/^[0-9a-f]{64}$/.test(expectedHash))return {digest,status:'invalid_reference'};
 return {digest,status:digest===expectedHash?'verified_match':'mismatch'};
}
export function heuristicVerdict(signals={},threshold=70){
 const weights={macro:25,spawn:30,sensitiveWrite:45};
 const observed=Object.entries(weights).filter(([key])=>signals[key]===true);
 const unknown=Object.keys(weights).filter(key=>typeof signals[key]!=='boolean');
 const score=observed.reduce((sum,[key,weight])=>sum+weight,0);
 return {score,action:score>=threshold?'review':'monitor',reasons:observed.map(([key])=>key),missingSignals:unknown};
}
export function correlateSequence(events=[],windowSeconds=300){
 const order=['spawn','persistence','outbound'];
 for(const first of events.filter(e=>e.kind==='spawn'&&e.processGuid)){
  const related=events.filter(e=>e.processGuid===first.processGuid).sort((a,b)=>a.at-b.at);
  const middle=related.find(e=>e.kind===order[1]&&e.at>=first.at&&e.at-first.at<=windowSeconds);
  const last=related.find(e=>middle&&e.kind===order[2]&&e.at>=middle.at&&e.at-first.at<=windowSeconds);
  if(middle&&last)return {action:'investigate',processGuid:first.processGuid,events:[first,middle,last]};
 }
 return {action:'insufficient_chain',events:[]};
}
export function sandboxReadiness({isolated=false,snapshot=false,networkMode='bridged',telemetry=false,approved=false}={}){
 const gaps=[];
 if(!isolated)gaps.push('isolation');
 if(!snapshot)gaps.push('snapshot');
 if(networkMode!=='none'&&networkMode!=='host_only')gaps.push('network');
 if(!telemetry)gaps.push('telemetry');
 if(!approved)gaps.push('authorization');
 return {status:gaps.length?'not_ready':'ready',gaps};
}
export function mitigationGaps({nx=false,aslr=false,cfg=false,cfgSupported=false}={}){
 const gaps=[];
 if(!nx)gaps.push('NX');
 if(!aslr)gaps.push('ASLR');
 if(cfgSupported&&!cfg)gaps.push('CFG');
 return {status:gaps.length?'review':'baseline_present',gaps,cfgApplicable:Boolean(cfgSupported)};
}
export function edrCoverage(events=[],required=['processGuid','parentGuid','at','kind','hostId']){
 const missing=required.filter(key=>events.some(event=>event[key]===undefined||event[key]===null||event[key]===''));
 return {status:events.length===0?'no_telemetry':missing.length?'coverage_gap':'usable',missing,volume:events.length};
}
export function processAncestry(events=[],guid){
 const byGuid=new Map(events.map(e=>[e.guid,e]));
 const nodes=[],seen=new Set();
 let cursor=guid;
 while(cursor){
  if(seen.has(cursor))return {status:'cycle',chain:nodes};
  seen.add(cursor);
  const event=byGuid.get(cursor);
  if(!event)return {status:'orphan',chain:nodes};
  nodes.push({guid:event.guid,role:event.role});
  cursor=event.parentGuid;
 }
 return {status:'complete',chain:nodes.reverse()};
}
export function detectionMetrics(rows=[]){
 const m={tp:0,tn:0,fp:0,fn:0};
 for(const row of rows){
  if(typeof row.actual!=='boolean'||typeof row.alert!=='boolean')throw Error('Labels booleanos necessários');
  const key=row.actual?(row.alert?'tp':'fn'):(row.alert?'fp':'tn');m[key]++;
 }
 const precision=m.tp+m.fp?m.tp/(m.tp+m.fp):null;
 const recall=m.tp+m.fn?m.tp/(m.tp+m.fn):null;
 return {...m,precision,recall,total:rows.length};
}
export function testDetectionRule(event={}){
 for(const key of ['parentRole','childRole','approvedAutomation','sensorHealthy'])
  if(typeof event[key]==='undefined')return {action:'insufficient_data',reason:key};
 if(!event.sensorHealthy)return {action:'insufficient_data',reason:'sensor_offline'};
 if(event.parentRole==='document_editor'&&event.childRole==='script_runner'&&!event.approvedAutomation)
  return {action:'alert',reason:'unapproved_parent_child'};
 return {action:'no_alert',reason:event.approvedAutomation?'approved_context':'pattern_not_matched'};
}
