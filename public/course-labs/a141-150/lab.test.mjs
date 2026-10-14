import test from 'node:test';
import assert from 'node:assert/strict';
import { processTree, diffArtifacts, correlateFlows, assessLabService,
 summarizeTraffic, filterPacketMetadata, assessBeaconing, inspectMemoryRegions,
 reconcilePluginViews, curateIOCs, runWorkshop } from './models.mjs';
test('141: vínculo parentKey com início distingue PID reciclado',()=>{
 const x=processTree([{pid:7,start:'t0',parentKey:null},{pid:8,start:'t1',parentKey:'7@t0'}]);
 assert.equal(x.linked,1);assert.equal(x.orphans.length,0);assert.equal(x.malwareProven,false);
 const orphan=processTree([{pid:7,start:'t2',parentKey:'9@t0'}]);
 assert.equal(orphan.orphans.length,1);
});
test('141: eventos sem identidade temporal são recusados',()=>assert.throws(()=>processTree([{pid:1}]),/início/));
test('142: diff preserva noção de autor e mudança autorizada',()=>{
 const x=diffArtifacts([{type:'file',path:'/lab/a',digest:'h1'}],[{type:'file',path:'/lab/a',digest:'h2'},{type:'registry',path:'HKCU\\Lab',digest:'v1'}]);
 assert.equal(x.changed.length,1);assert.equal(x.added.length,1);assert.equal(x.malwareProven,false);
});
test('142: entrada igual gera diff vazio',()=>assert.equal(diffArtifacts([{type:'file',path:'/lab/a',digest:'x'}],[{type:'file',path:'/lab/a',digest:'x'}]).changed.length,0));
test('143: correlacionar fluxo por PID e início; DNS isolado não comprova conexão',()=>{
 const a=correlateFlows([{pid:2,processStart:'t1',host:'lab.invalid',protocol:'dns'}],[{pid:2,start:'t1',name:'fixture'}]);
 assert.equal(a.matched.length,1);assert.equal(a.externalTrafficObserved,false);
 const b=correlateFlows([{pid:2,processStart:'t2',host:'lab.invalid',protocol:'dns'}],[{pid:2,start:'t1',name:'fixture'}]);
 assert.equal(b.unmatched.length,1);
});
test('144: rede host-only não prova isolamento, sem credenciais reais',()=>{
 assert.equal(assessLabService({egressBlocked:true,dnsRedirect:true,syntheticFixture:true,externalListeners:false,realCredentials:false}).ready,true);
 assert.equal(assessLabService({egressBlocked:false,dnsRedirect:true,syntheticFixture:true,externalListeners:false,realCredentials:false}).ready,false);
});
test('145: intervalos de fluxos não são prova de malware',()=>{
 const a=summarizeTraffic([{at:0,host:'lab.invalid'},{at:100,host:'lab.invalid'},{at:200,host:'lab.invalid'}]);
 assert.deepEqual(a.intervals,[100,100]);assert.equal(a.malwareProven,false);
});
test('146: filtragem de metadados não decodifica PCAP real',()=>{
 const a=filterPacketMetadata([{streamId:1,protocol:'dns',src:'127.0.0.1'},{streamId:2,protocol:'http',src:'127.0.0.1'}],{protocol:'dns'});
 assert.equal(a.packets.length,1);assert.equal(a.parsedPcap,false);
});
test('147: heartbeat autorizado pode ser periódico sem C2',()=>{
 const a=assessBeaconing([0,60,120,180],{approvedHeartbeat:true});
 assert.equal(a.periodicCandidate,true);assert.equal(a.c2Confirmed,false);
 assert.equal(assessBeaconing([0,12],{approvedHeartbeat:false}).periodicCandidate,false);
});
test('148: RWX sintético é motivo de triagem, não diagnóstico',()=>{
 const a=inspectMemoryRegions([{pid:3,access:'rwx',owner:'unknown'},{pid:4,access:'r-x',owner:'approved'}]);
 assert.equal(a.review.length,1);assert.equal(a.malwareProven,false);
});
test('149: pslist e netscan vinculados por identidade temporal',()=>{
 const a=reconcilePluginViews({pslist:[{pid:3,start:'t0'}],netscan:[{pid:3,start:'t0'}]});
 assert.equal(a.correlated.length,1);
 const b=reconcilePluginViews({pslist:[{pid:3,start:'t1'}],netscan:[{pid:3,start:'t0'}]});
 assert.equal(b.unmatched.length,1);
});
test('150: dedup de IOC, expiração e falsa equivalência',()=>{
 const a=curateIOCs([{type:'domain',value:'LAB.INVALID',expires:'2026-12-01',source:'fixture'},
 {type:'domain',value:'lab.invalid',expires:'2026-12-01',source:'fixture'}],{asOf:'2026-10-14'});
 assert.equal(a.active.length,1);assert.equal(a.malwareProven,false);
 const expired=curateIOCs([{type:'domain',value:'lab.invalid',expires:'2026-01-01',source:'fixture'}],{asOf:'2026-10-14'});
 assert.equal(expired.expired.length,1);
});
test('141–150: exercícios distintos entregam positivo, negativo e limite seguro',()=>{
 for(let n=141;n<=150;n++){
  const r=runWorkshop(n);assert.ok(r.allowed!==undefined,'positivo '+n);
  assert.ok(r.contrast!==undefined,'negativo '+n);
  assert.ok(r.limit?.length>45,'limites '+n);
  assert.equal(r.liveMalwareExecuted,false,'nenhum executável '+n);
 }
});