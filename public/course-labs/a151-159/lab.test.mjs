import test from 'node:test';
import assert from 'node:assert/strict';
import {yaraFixtureMatch,sigmaEventMatch,assessDetectionRule,mapMitreEvidence,diffStartupEntries,assessExecution,assessPowerShellEvent,assessInjectionEvidence,correlateSiemTimeline} from './models.mjs';
test('151 YARA: marcador benigno, controle negativo e tamanho máximo',()=>{
 assert.equal(yaraFixtureMatch('CYBERLAB-DEMO-v1',120).matched,true);
 assert.equal(yaraFixtureMatch('CYBERLAB-SAFE',120).matched,false);
 assert.equal(yaraFixtureMatch('CYBERLAB-DEMO-v1',1100000).matched,false);
});
test('152 Sigma: evento estruturado e exceção aprovada',()=>{
 const e={eventId:1,parentRole:'document_editor',childRole:'script_runner',approved:false};
 assert.equal(sigmaEventMatch(e).decision,'alert');
 assert.equal(sigmaEventMatch({...e,approved:true}).decision,'no_alert');
 assert.equal(sigmaEventMatch({eventId:1,parentRole:'document_editor'}).decision,'insufficient_data');
});
test('153 Detection Rules: campo ausente não equivale a benigno',()=>{
 assert.equal(assessDetectionRule({signal:'startup_change',dataComplete:true,approved:false}).decision,'review');
 assert.equal(assessDetectionRule({signal:'startup_change',dataComplete:true,approved:true}).decision,'no_alert');
 assert.equal(assessDetectionRule({signal:'startup_change',dataComplete:false}).decision,'insufficient_data');
});
test('154 MITRE: mapear por comportamento com limite de atribuição',()=>{
 assert.equal(mapMitreEvidence({action:'scheduled_task_created',source:'task_audit'}).technique,'T1053.005');
 assert.equal(mapMitreEvidence({action:'login',source:'task_audit'}).technique,null);
 assert.equal(mapMitreEvidence({action:'scheduled_task_created',source:''}).status,'insufficient_data');
});
test('155 Persistence: diff distingue adição de manutenção aprovada',()=>{
 const before=[{id:'startup/A',digest:'abc'}];
 assert.deepEqual(diffStartupEntries(before,[...before,{id:'startup/B',digest:'def',approved:false}]).reviewIds,['startup/B']);
 assert.deepEqual(diffStartupEntries(before,[...before,{id:'startup/B',digest:'def',approved:true}]).reviewIds,[]);
 assert.deepEqual(diffStartupEntries(before,before).reviewIds,[]);
});
test('156 Suspicious Execution: contexto e saúde do sensor',()=>{
 const x={parentRole:'document_editor',childRole:'script_runner',approved:false,sensorHealthy:true};
 assert.equal(assessExecution(x).decision,'review');
 assert.equal(assessExecution({...x,approved:true}).decision,'no_alert');
 assert.equal(assessExecution({...x,sensorHealthy:false}).decision,'insufficient_data');
});
test('157 PowerShell: metadados suspeitos não provam intenção',()=>{
 assert.equal(assessPowerShellEvent({commandLine:'powershell -EncodedCommand DEMO',approved:false,sourceHealthy:true}).decision,'review');
 assert.equal(assessPowerShellEvent({commandLine:'powershell -EncodedCommand DEMO',approved:true,sourceHealthy:true}).decision,'no_alert');
 assert.equal(assessPowerShellEvent({commandLine:'powershell -NoProfile',approved:false,sourceHealthy:true}).decision,'no_alert');
 assert.equal(assessPowerShellEvent({commandLine:'',approved:false,sourceHealthy:false}).decision,'insufficient_data');
});
test('158 Injection: sinais correlacionados e contexto legítimo',()=>{
 const x={remoteWrite:true,remoteThread:true,sameTarget:true,authorizedTool:false,sensorHealthy:true};
 assert.equal(assessInjectionEvidence(x).decision,'investigate');
 assert.equal(assessInjectionEvidence({...x,authorizedTool:true}).decision,'no_alert');
 assert.equal(assessInjectionEvidence({...x,remoteWrite:false}).decision,'insufficient_chain');
 assert.equal(assessInjectionEvidence({...x,sensorHealthy:false}).decision,'insufficient_data');
});
test('159 SIEM: mesma identidade, sequência e janela obrigatórias',()=>{
 const events=[{host:'lab1',guid:'p',kind:'process_start',at:10},{host:'lab1',guid:'p',kind:'task_created',at:20}];
 assert.equal(correlateSiemTimeline(events,60).decision,'correlate');
 assert.equal(correlateSiemTimeline([events[0],{...events[1],guid:'q'}],60).decision,'no_chain');
 assert.equal(correlateSiemTimeline([events[0],{...events[1],at:1000}],60).decision,'no_chain');
});
