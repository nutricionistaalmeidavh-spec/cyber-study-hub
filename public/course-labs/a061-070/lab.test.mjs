import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectLinux,inspectWindows,linuxPrivilegePath,windowsServiceRisk,secureService,identifyLoopback,scanFinding,matchAdvisory,validatePocPlan,adEffectiveGroups} from './models.mjs';

test('061 Linux: enumeração aponta write excessivo sem chamar SUID isolado de exploração',()=>{
 const rows=inspectLinux([{path:'/opt/backup/job.sh',mode:0o777,owner:'root',usedBy:'root-cron'},{path:'/usr/bin/passwd',mode:0o4755,owner:'root',usedBy:'interactive'}]);
 assert.equal(rows[0].risk,'HIGH');
 assert.equal(rows[1].risk,'REVIEW');
 assert.ok(rows[0].reason.includes('gravável'));
});
test('062 Windows: serviço SYSTEM com modificação por Users é prioridade, leitura não',()=>{
 const report=inspectWindows([{name:'Updater',runsAs:'LocalSystem',imageAcl:['Users:Modify']},{name:'Reporter',runsAs:'LocalService',imageAcl:['Users:Read']}]);
 assert.equal(report[0].risk,'HIGH');
 assert.equal(report[1].risk,'LOW');
});
test('063 Linux: delegação sudo gravável alcança principal privilegiado; permissão neutra não',()=>{
 assert.equal(linuxPrivilegePath({writer:'deploy',commandOwner:'root',commandWritableBy:['deploy'],delegated:true}).risk,'HIGH');
 assert.equal(linuxPrivilegePath({writer:'deploy',commandOwner:'root',commandWritableBy:[],delegated:true}).risk,'LOW');
});
test('064 Windows: path sem aspas exige prefixo gravável e contexto privilegiado para risco confirmado na fixture',()=>{
 assert.equal(windowsServiceRisk({path:'C:\\Program Files\\Vendor App\\svc.exe',quoted:false,writablePrefixes:['C:\\Program.exe'],runsAs:'LocalSystem'}).risk,'HIGH');
 assert.equal(windowsServiceRisk({path:'C:\\Program Files\\Vendor App\\svc.exe',quoted:false,writablePrefixes:[],runsAs:'LocalSystem'}).risk,'REVIEW');
 assert.equal(windowsServiceRisk({path:'C:\\Program Files\\Vendor App\\svc.exe',quoted:true,writablePrefixes:['C:\\Program.exe'],runsAs:'LocalSystem'}).risk,'LOW');
});
test('065 endurecimento mantém leitura de serviço legítimo e remove escrita genérica',()=>{
 const result=secureService({name:'report-service',acl:['Service:Read','Everyone:Write','Admin:Modify']});
 assert.ok(result.acl.includes('Service:Read'));
 assert.ok(!result.acl.includes('Everyone:Write'));
 assert.ok(result.retest.legitimate);
 assert.ok(result.retest.unauthorizedDenied);
});
test('066 fingerprint HTTP é hipótese da versão, jamais confirmação de CVE',async()=>{
 const r=await identifyLoopback();
 assert.equal(r.local,true);
 assert.equal(r.httpStatus,200);
 assert.equal(r.versionStatus,'HYPOTHESIS');
 assert.equal(r.productBanner,'TeachingService/2.0');
});
test('067 scanner: distingue falso positivo, suspeita e confirmação com prova',()=>{
 assert.equal(scanFinding({signatureMatch:true,installedVersionVerified:false,behaviorEvidence:false}).status,'POSSIBLE');
 assert.equal(scanFinding({signatureMatch:true,installedVersionVerified:true,behaviorEvidence:true,ownedLab:true}).status,'CONFIRMED_LAB');
 assert.equal(scanFinding({signatureMatch:true,installedVersionVerified:true,behaviorEvidence:false,fixedVersion:true}).status,'FALSE_POSITIVE');
});
test('068 CVE não é CWE nem prioridade: advisory requer produto e versão exatos',()=>{
 const advisory={id:'CVE-2099-0101',product:'example-agent',fixedIn:'2.4.0',cwe:'CWE-862',cvss:8.1};
 assert.equal(matchAdvisory(advisory,{product:'example-agent',version:'2.3.9'}).affected,true);
 assert.equal(matchAdvisory(advisory,{product:'example-agent',version:'2.4.0'}).affected,false);
 assert.equal(matchAdvisory(advisory,{product:'other',version:'2.0.0'}).affected,false);
 assert.equal(matchAdvisory(advisory,{product:'example-agent',version:'dev'}).status,'NEEDS_REVIEW');
});
test('069 PoC: rejeita execução destrutiva, escopo externo e falta de snapshot',()=>{
 const safe={ownedLab:true,isolated:true,snapshot:true,attempts:1,action:'read-fixture'};
 assert.equal(validatePocPlan(safe).allowed,true);
 assert.equal(validatePocPlan({...safe,action:'delete-records'}).allowed,false);
 assert.equal(validatePocPlan({...safe,ownedLab:false}).allowed,false);
 assert.equal(validatePocPlan({...safe,snapshot:false}).allowed,false);
});
test('070 AD: grupos aninhados resolvidos mesmo com ciclo; OU não concede papel de grupo',()=>{
 const groups={Readers:['joao'],Reviewers:['Readers'],Auditors:['Reviewers','Auditors']};
 const effective=adEffectiveGroups('joao',groups);
 assert.deepEqual(effective,['Auditors','Readers','Reviewers']);
 assert.deepEqual(adEffectiveGroups('joao',{IT:[],Finance:[]}),[]);
});
