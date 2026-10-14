import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mapDirectoryProtocols, inventoryAd, auditAdAcl, findPrivilegePath,
  reviewRemoteAccess, assessGpo, hardeningReadiness, correlateAdEvents,
  normalizeLogs, traceSysmon, runLesson
} from './models.mjs';

test('071: TGT, service ticket, NTLM e LDAP não são sinônimos', () => {
  const events = mapDirectoryProtocols([{eventId:4768},{eventId:4769},{eventId:4776},{eventId:'ldap-search'}]);
  assert.deepEqual(events.map(e => e.meaning), ['Kerberos TGT request','Kerberos service ticket request','NTLM credential validation','LDAP directory query']);
  assert.equal(events.filter(e=>e.legacy).length,1);
});
test('071: não confundir LDAP com NTLM nem inferir autenticação de consulta', () => {
  assert.equal(mapDirectoryProtocols([{eventId:'ldap-search'}])[0].legacy,false);
  assert.equal(mapDirectoryProtocols([{eventId:1234}])[0].meaning,'Unclassified event');
});
test('072: inventário AD com projeção read-only, SPN e membros de grupo', () => {
  const objects=[{id:'svc-report',type:'user',ou:'Services',spns:['HTTP/reports.lab.test'],memberOf:['Readers'],password:'secret-placeholder'},
  {id:'Operators',type:'group',ou:'Groups',spns:[],memberOf:[]}];
  const listing=inventoryAd(objects,{authorized:true});
  assert.deepEqual(listing[0],{id:'Operators',type:'group',ou:'Groups',spns:[],memberOf:[]});
  assert.equal(listing[1].password,undefined);
  assert.deepEqual(listing[1].spns,['HTTP/reports.lab.test']);
});
test('072: escopo e identidade de leitura são barreiras obrigatórias', () => {
  assert.throws(()=>inventoryAd([{id:'user'}],{authorized:false}),/autorizado/);
  assert.throws(()=>inventoryAd([{id:'user'}],{authorized:true}),/tipo inválido/);
});
test('073: ACL excessiva em objeto sensível exige revisão específica', () => {
  const result=auditAdAcl([{principal:'helpdesk',right:'WriteDACL',object:'OU=Admins',sensitive:true},
   {principal:'audit',right:'Read',object:'OU=Admins',sensitive:true}],['domain-admin']);
  assert.deepEqual(result.map(x=>x.principal),['helpdesk']);
});
test('073: delegação de leitura e autor de mudança aprovado não disparam achado crítico', () => {
  const result=auditAdAcl([{principal:'domain-admin',right:'GenericAll',object:'OU=Admins',sensitive:true},
   {principal:'audit',right:'Read',object:'OU=Admins',sensitive:true}],['domain-admin']);
  assert.deepEqual(result,[]);
});
test('074: caminho de permissão indireta chega ao grupo de alto privilégio', () => {
  const edges=[{from:'ana',to:'ops',relation:'memberOf'},{from:'ops',to:'admins',relation:'WriteDACL'}];
  assert.deepEqual(findPrivilegePath(edges,'ana','admins'),['ana','ops','admins']);
  assert.equal(findPrivilegePath(edges.filter(e=>e.relation!=='WriteDACL'),'ana','admins'),null);
});
test('074: ciclo no grafo não cria caminho falso', () => {
  assert.equal(findPrivilegePath([{from:'ana',to:'ops'},{from:'ops',to:'ana'}],'ana','admins'),null);
});
test('075: administração remota legítima continua possível e rota nova é investigada', () => {
  const sessions=[{actor:'ops',from:'jump',to:'server-a',logonType:3},
   {actor:'ops',from:'workstation',to:'server-b',logonType:10}];
  const r=reviewRemoteAccess(sessions,[{actor:'ops',from:'jump',to:'server-a'}]);
  assert.equal(r[0].status,'allowed');
  assert.equal(r[1].status,'review');
});
test('075: evento local não é rotulado como movimento lateral', () => {
  const r=reviewRemoteAccess([{actor:'ops',from:'server-a',to:'server-a',logonType:2}],[]);
  assert.equal(r[0].status,'local');
});
test('076: vínculo GPO, filtro de grupo e delegação são checagens separadas', () => {
  const gpo={linkedOu:'OU=Workstations',enabled:true,securityFilter:['Employees'],editors:['GPO-Admins','helpdesk']};
  const r=assessGpo(gpo,{ous:['OU=Workstations'],groups:['Employees']},['GPO-Admins']);
  assert.equal(r.applies,true);
  assert.deepEqual(r.unapprovedEditors,['helpdesk']);
});
test('076: grupo não contemplado não recebe GPO, sem falso positivo', () => {
  const gpo={linkedOu:'OU=Workstations',enabled:true,securityFilter:['Employees'],editors:['GPO-Admins']};
  const r=assessGpo(gpo,{ous:['OU=Workstations'],groups:['Guests']},['GPO-Admins']);
  assert.equal(r.applies,false);
  assert.deepEqual(r.unapprovedEditors,[]);
});
test('077: priorização de hardening requer fallback e não desliga NTLM indiscriminadamente', () => {
  const r=hardeningReadiness({laps:true,gmsa:false,tiering:true,ntlmInventory:false,rollbackTested:false});
  assert.deepEqual(r.gaps,['gMSA','NTLM inventory','rollback test']);
  assert.equal(r.readyForEnforcement,false);
});
test('077: cobertura completa permite planejar enforcement gradual', () => {
  const r=hardeningReadiness({laps:true,gmsa:true,tiering:true,ntlmInventory:true,rollbackTested:true});
  assert.deepEqual(r.gaps,[]);
  assert.equal(r.readyForEnforcement,true);
});
test('078: 4728 seguido de 4624 dentro de 10 min cria sinal para triagem', () => {
  const events=[{id:4728,at:'2026-10-13T13:00:00Z',member:'ana',group:'Domain Admins'},
   {id:4624,at:'2026-10-13T13:05:00Z',user:'ana',host:'dc-1'}];
  const r=correlateAdEvents(events);
  assert.equal(r.length,1);assert.equal(r[0].severity,'review');
});
test('078: mudança autorizada e eventos desconexos não geram alarme infundado', () => {
  const events=[{id:4728,at:'2026-10-13T13:00:00Z',member:'ana',group:'Domain Admins',ticket:'CHG-27'},
   {id:4624,at:'2026-10-13T13:05:00Z',user:'ana',host:'dc-1'},
   {id:4624,at:'2026-10-13T13:50:00Z',user:'bia',host:'dc-2'}];
  const r=correlateAdEvents(events);
  assert.equal(r.length,1);assert.equal(r[0].severity,'expected');
});
test('079: offsets Windows e Linux convergem para linha do tempo UTC ordenada', () => {
  const r=normalizeLogs([
    {source:'linux',at:'2026-10-13T10:05:00-03:00',detail:'sudo started'},
    {source:'windows',at:'2026-10-13T13:00:00Z',detail:'4624 logon'}]);
  assert.deepEqual(r.map(x=>x.atUtc),['2026-10-13T13:00:00.000Z','2026-10-13T13:05:00.000Z']);
});
test('079: horário sem fuso e timestamp inválido não são silenciosamente aceitos', () => {
  assert.throws(()=>normalizeLogs([{source:'windows',at:'2026-10-13T13:00:00',detail:'x'}]),/fuso/);
  assert.throws(()=>normalizeLogs([{source:'linux',at:'não-é-data',detail:'x'}]),/fuso/);
});
test('080: ProcessGuid correlaciona Sysmon Event 1 com Event 3', () => {
  const r=traceSysmon([{id:1,guid:'P-7',parentGuid:'P-1',image:'C:/Windows/System32/cmd.exe'},
    {id:3,guid:'P-7',destination:'192.0.2.10:443'}]);
  assert.equal(r.processes.length,1);
  assert.deepEqual(r.processes[0].connections,['192.0.2.10:443']);
  assert.deepEqual(r.unmatchedConnections,[]);
});
test('080: PID homônimo não substitui ProcessGuid, evento sem processo fica visível', () => {
  const r=traceSysmon([{id:1,guid:'P-7',pid:123,image:'cmd.exe'},
    {id:3,guid:'P-8',pid:123,destination:'192.0.2.10:443'}]);
  assert.deepEqual(r.processes[0].connections,[]);
  assert.deepEqual(r.unmatchedConnections,['192.0.2.10:443']);
});
test('071–080: cada oficina tem saída legítima, contraste e reteste', () => {
  for(let id=71;id<=80;id++){
    const r=runLesson(id);
    assert.ok(r.legitimate, 'Aula '+id+' sem caso legítimo');
    assert.ok(r.contrast, 'Aula '+id+' sem contraste');
    assert.ok(r.retest, 'Aula '+id+' sem reteste');
  }
});
