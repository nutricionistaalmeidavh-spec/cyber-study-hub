import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyObject,fileDigestAssessment,heuristicVerdict,correlateSequence,sandboxReadiness,mitigationGaps,edrCoverage,processAncestry,detectionMetrics,testDetectionRule} from './models.mjs';
test('091: indicador confirmado bloqueia, desconhecido legítimo não',()=>{
 assert.equal(classifyObject({knownBad:true,heuristicScore:2}).action,'block');
 assert.equal(classifyObject({heuristicScore:20}).action,'allow_monitor');
 assert.equal(classifyObject({agentHealthy:false}).action,'degraded');
});
test('092: hash comprova bytes e referência confiável, não autoria',()=>{
 const hash=fileDigestAssessment('arquivo A','',false).digest;
 assert.equal(fileDigestAssessment('arquivo A',hash,true).status,'verified_match');
 assert.equal(fileDigestAssessment('arquivo B',hash,true).status,'mismatch');
 assert.equal(fileDigestAssessment('arquivo A',hash,false).status,'untrusted_reference');
});
test('093: score explica combinação e dados faltantes',()=>{
 assert.equal(heuristicVerdict({macro:true,spawn:true,sensitiveWrite:true}).action,'review');
 const normal=heuristicVerdict({macro:true,spawn:false,sensitiveWrite:false});
 assert.equal(normal.action,'monitor');assert.equal(normal.missingSignals.length,0);
 assert.deepEqual(heuristicVerdict({}).missingSignals,['macro','spawn','sensitiveWrite']);
});
test('094: ordem, janela e processGuid são necessários',()=>{
 const events=[{kind:'spawn',processGuid:'p1',at:10},{kind:'persistence',processGuid:'p1',at:20},{kind:'outbound',processGuid:'p1',at:30}];
 assert.equal(correlateSequence(events).action,'investigate');
 assert.equal(correlateSequence([events[0],events[1],{...events[2],processGuid:'p2'}]).action,'insufficient_chain');
 assert.equal(correlateSequence([events[0],events[1],{...events[2],at:500}]).action,'insufficient_chain');
});
test('095: todas as pré-condições de isolamento são obrigatórias',()=>{
 const safe={isolated:true,snapshot:true,networkMode:'none',telemetry:true,approved:true};
 assert.equal(sandboxReadiness(safe).status,'ready');
 assert.equal(sandboxReadiness({...safe,networkMode:'bridged'}).status,'not_ready');
 assert.ok(sandboxReadiness({...safe,snapshot:false}).gaps.includes('snapshot'));
});
test('096: CFG depende de suporte, NX e ASLR continuam cobrados',()=>{
 assert.deepEqual(mitigationGaps({nx:true,aslr:true,cfg:false,cfgSupported:false}).gaps,[]);
 assert.ok(mitigationGaps({nx:false,aslr:true,cfg:true,cfgSupported:true}).gaps.includes('NX'));
 assert.ok(mitigationGaps({nx:true,aslr:true,cfg:false,cfgSupported:true}).gaps.includes('CFG'));
});
test('097: telemetria incompleta não equivale a cobertura',()=>{
 const full={processGuid:'g1',parentGuid:'root',at:1,kind:'process_start',hostId:'h1'};
 assert.equal(edrCoverage([full]).status,'usable');
 assert.equal(edrCoverage([{...full,parentGuid:undefined}]).status,'coverage_gap');
 assert.equal(edrCoverage([]).status,'no_telemetry');
});
test('098: ancestry usa GUID, acusa órfãos e ciclos',()=>{
 const tree=[{guid:'a',parentGuid:null,role:'shell'},{guid:'b',parentGuid:'a',role:'editor'},{guid:'c',parentGuid:'b',role:'runner'}];
 assert.deepEqual(processAncestry(tree,'c').chain.map(x=>x.guid),['a','b','c']);
 assert.equal(processAncestry(tree,'missing').status,'orphan');
 assert.equal(processAncestry([{guid:'a',parentGuid:'b'},{guid:'b',parentGuid:'a'}],'a').status,'cycle');
});
test('099: precisão e recall sem divisão por zero',()=>{
 const result=detectionMetrics([{actual:true,alert:true},{actual:false,alert:true},{actual:true,alert:false},{actual:false,alert:false}]);
 assert.deepEqual([result.tp,result.fp,result.fn,result.tn],[1,1,1,1]);
 assert.equal(result.precision,0.5);assert.equal(result.recall,0.5);
 assert.equal(detectionMetrics([{actual:false,alert:false}]).precision,null);
});
test('100: hipótese depende de cobertura e contexto permitido',()=>{
 const candidate={parentRole:'document_editor',childRole:'script_runner',approvedAutomation:false,sensorHealthy:true};
 assert.equal(testDetectionRule(candidate).action,'alert');
 assert.equal(testDetectionRule({...candidate,approvedAutomation:true}).action,'no_alert');
 assert.equal(testDetectionRule({...candidate,sensorHealthy:false}).action,'insufficient_data');
});
