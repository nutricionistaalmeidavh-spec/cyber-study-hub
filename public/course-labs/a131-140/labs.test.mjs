import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {triageEvidence,classifyCapabilities,inspectFixture,createStaticReport,
 shannonEntropy,assessIsolation,chooseRemnuxWorkflow,correlateProcessEvents,
 compareAutorunBaselines,reviewDynamicTimeline,runWorkshop} from './models.mjs';

test('131: arquivo próprio com hash e proveniência não é automaticamente malicioso',()=>{
 const a=triageEvidence({kind:'own-app',sha256:'a'.repeat(64),trustedBuild:true,behaviorEvents:[]});
 assert.equal(a.verdict,'benign-lab-fixture');assert.equal(a.malwareProven,false);
});
test('131: evento suspeito isolado exige análise antes de afirmar malware',()=>{
 const a=triageEvidence({kind:'unknown',sha256:'b'.repeat(64),trustedBuild:false,behaviorEvents:['network']});
 assert.equal(a.verdict,'requires-corroboration');assert.equal(a.malwareProven,false);
});
test('131: hash incorreto não é admitido como evidência',()=>{
 assert.throws(()=>triageEvidence({kind:'unknown',sha256:'bad',trustedBuild:false,behaviorEvents:[]}),/SHA-256/);
});
test('132: classificação de propagação depende de evidência de auto-replicação',()=>{
 assert.deepEqual(classifyCapabilities({masquerades:false,selfReplicates:true,encryptsFiles:false,deliversPayload:false}).labels,['worm-like']);
});
test('132: distribuição por e-mail sem auto-replicação não demonstra worm',()=>{
 assert.deepEqual(classifyCapabilities({masquerades:true,selfReplicates:false,encryptsFiles:false,deliversPayload:false}).labels,['trojan-like']);
});
test('132: ransomware e loader são capacidades independentes e não provam infecção',()=>{
 const a=classifyCapabilities({masquerades:false,selfReplicates:false,encryptsFiles:true,deliversPayload:true});
 assert.deepEqual(a.labels,['ransomware-like','loader-like']);assert.equal(a.malwareProven,false);
});
test('133: bytes da fixture são classificados sem executar arquivo',()=>{
 const a=inspectFixture(Buffer.from('4d5a900000','hex'));
 assert.equal(a.format,'PE/MZ-header-candidate');assert.equal(a.executed,false);
});
test('133: MZ isolado não comprova PE válido',()=>{
 const a=inspectFixture(Buffer.from('4d5a','hex'));
 assert.equal(a.format,'PE/MZ-header-candidate');assert.equal(a.validPEProven,false);
});
test('133: entrada vazia e ELF são tratados sem side effects',()=>{
 assert.equal(inspectFixture(Buffer.alloc(0)).format,'empty');
 assert.equal(inspectFixture(Buffer.from('7f454c460102','hex')).format,'ELF-header-candidate');
});
test('134: relatório calcula SHA-256 do próprio conteúdo, sem tratar strings como IOC comprovado',()=>{
 const r=createStaticReport(Buffer.from('demo.local 2026'),{declaredImports:['KERNEL32.dll'],declaredSigner:'lab'});
 assert.equal(r.sha256,createHash('sha256').update('demo.local 2026').digest('hex'));
 assert.equal(r.networkContactObserved,false);assert.ok(r.printableStrings.includes('demo.local 2026'));
});
test('134: metadado declarado não prova assinatura confiável nem import executado',()=>{
 const r=createStaticReport(Buffer.from('plain'),{declaredImports:['WinHttp.dll'],declaredSigner:'lab'});
 assert.equal(r.signerTrustVerified,false);assert.equal(r.importExecutionObserved,false);
});
test('135: entropia 0 para bytes iguais e 1 para AABB',()=>{
 assert.equal(shannonEntropy(Buffer.from('AAAA')),0);
 assert.equal(shannonEntropy(Buffer.from('AABB')),1);
});
test('135: 256 bytes distintos têm 8 bits/byte apesar de sequência previsível',()=>{
 const x=Buffer.from(Array.from({length:256},(_,i)=>i));
 assert.equal(shannonEntropy(x),8);
});
test('135: vazio não é interpretado como malware e tem entropia definida zero',()=>{
 assert.equal(shannonEntropy(Buffer.alloc(0)),0);
});
test('136: snapshot e rede desligada permitem cenário de coleta local',()=>{
 const a=assessIsolation({network:'disabled',snapshot:true,sharedFolders:false,sharedClipboard:false,realCredentials:false});
 assert.equal(a.readyForSyntheticLab,true);assert.equal(a.safeForLiveMalware,false);
});
test('136: host-only não é equivalente a isolamento integral do host',()=>{
 const a=assessIsolation({network:'host-only',snapshot:true,sharedFolders:false,sharedClipboard:false,realCredentials:false});
 assert.equal(a.readyForSyntheticLab,false);
 assert.ok(a.findings.includes('host-accessible-network'));
});
test('136: pasta compartilhada ou credenciais reais impedem liberação',()=>{
 const a=assessIsolation({network:'disabled',snapshot:true,sharedFolders:true,sharedClipboard:false,realCredentials:true});
 assert.equal(a.readyForSyntheticLab,false);
});
test('137: plano de REMnux distingue análise de arquivo de eventos de rede',()=>{
 const a=chooseRemnuxWorkflow({artifact:'pcap',authorized:true});
 assert.deepEqual(a.steps,['verify-capture-provenance','inspect-offline-pcap','report-observations']);
 assert.equal(a.requiresRemnuxInstallation,false);
});
test('137: artefato sem autorização não deve ser enviado ou executado',()=>{
 const a=chooseRemnuxWorkflow({artifact:'document',authorized:false});
 assert.deepEqual(a.steps,['stop-and-request-authorization']);assert.equal(a.requiresRemnuxInstallation,false);
});
test('138: eventos de PIDs reciclados não são ligados sem início de processo',()=>{
 const e=[{pid:20,processStart:'10:00',operation:'CreateFile',path:'A'},{pid:20,processStart:'11:00',operation:'CreateFile',path:'B'}];
 assert.equal(correlateProcessEvents(e).sessions.length,2);
});
test('138: coleta mantém ordem cronológica por data observada, não pelo caminho',()=>{
 const e=[{pid:1,processStart:'10:00',timestamp:3,operation:'CloseFile',path:'a'},
 {pid:1,processStart:'10:00',timestamp:1,operation:'CreateFile',path:'a'}];
 assert.deepEqual(correlateProcessEvents(e).sessions[0].events.map(x=>x.timestamp),[1,3]);
});
test('139: baseline novo sem aprovação é mudança para investigar, não malware provado',()=>{
 const a=compareAutorunBaselines([{id:'app',publisher:'approved'}],[{id:'app',publisher:'approved'},{id:'new',publisher:'unknown'}]);
 assert.deepEqual(a.added,['new']);assert.equal(a.malwareProven,false);
});
test('139: entrada autorizada permanece e exclusão é explicitada',()=>{
 const a=compareAutorunBaselines([{id:'app',publisher:'approved'}],[{id:'app',publisher:'approved'}]);
 assert.deepEqual(a.added,[]);assert.deepEqual(a.removed,[]);
});
test('140: cronologia própria correlaciona criação e escrita sem alegar execução de malware',()=>{
 const r=reviewDynamicTimeline([{at:1,kind:'process-start',processId:'p1'}, {at:2,kind:'file-write',processId:'p1'}],{network:'disabled'});
 assert.equal(r.networkIsolationOk,true);assert.equal(r.malwareProven,false);
 assert.deepEqual(r.events.map(x=>x.kind),['process-start','file-write']);
});
test('140: saída de rede habilitada impede aprovação automática do capstone',()=>{
 const r=reviewDynamicTimeline([{at:1,kind:'network-request',processId:'p1'}],{network:'bridged'});
 assert.equal(r.networkIsolationOk,false);assert.equal(r.safeForLiveMalware,false);
});
test('131–140: as dez oficinas registram contraste e limitações',()=>{
 for(let n=131;n<=140;n++){
  const r=runWorkshop(n);
  assert.ok(r.allowed!==undefined,'positivo '+n);
  assert.ok(r.contrast!==undefined,'contraste '+n);
  assert.ok(r.limit?.length>35,'limite '+n);
  assert.equal(r.liveMalwareExecuted,false,'simulação apenas '+n);
 }
});
