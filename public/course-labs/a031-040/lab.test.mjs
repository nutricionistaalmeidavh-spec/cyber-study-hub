import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeScope, inventoryOwnApp, triageSignal, assessImpact, validateFinding, modelThreat, safeProfilePatch, categorizeScanner, releaseGate, capstone } from './models.mjs';

test('031 autorização: host e tempo autorizados, negar terceiros e expiração', () => {
 const scope={origin:'http://127.0.0.1:9000',expiresAt:1900000000,allowedPaths:['/','/health']};
 assert.equal(authorizeScope(scope,'http://127.0.0.1:9000/health',1800000000),true);
 assert.equal(authorizeScope(scope,'http://127.0.0.1:9000/admin',1800000000),false);
 assert.equal(authorizeScope(scope,'http://127.0.0.1:9001/health',1800000000),false);
 assert.equal(authorizeScope(scope,'http://127.0.0.1:9000/health',2000000000),false);
});
test('032 inventário de superfície ocorre apenas no serviço criado em loopback', async () => {
 const records=await inventoryOwnApp();
 assert.deepEqual(records.map(r=>r.path),['/','/health','/api/notes']);
 assert.deepEqual(records.map(r=>r.status),[200,200,401]);
 assert.ok(records.every(r=>r.local===true));
});
test('033 pista não se transforma em vulnerabilidade sem prova comparativa',()=>{
 assert.equal(triageSignal({kind:'banner',value:'http/1.1'}),'INFO');
 assert.equal(triageSignal({kind:'object-access',differentUser:true,observed:200,baseline:200,repeatable:false}),'HIPOTESE');
 assert.equal(triageSignal({kind:'object-access',differentUser:true,observed:200,baseline:200,repeatable:true,proof:'OWN-LAB'}),'CONFIRMADO');
 assert.equal(triageSignal({kind:'object-access',differentUser:true,observed:403,baseline:200,repeatable:true,proof:'OWN-LAB'}),'CONTROLADO');
});
test('034 evidência e sensibilidade precedem priorização qualitativa',()=>{
 assert.equal(assessImpact({confirmed:false,sensitive:true,exposedObjects:12}).level,'NAO_DETERMINADO');
 assert.equal(assessImpact({confirmed:true,sensitive:true,exposedObjects:12}).level,'ALTO');
 assert.equal(assessImpact({confirmed:true,sensitive:false,exposedObjects:1}).level,'BAIXO');
});
test('035 finding exige contexto e reteste consistente sem segredos',()=>{
 const finding={id:'LAB-1',scope:'loopback',asset:'/api/notes',expected:403,observed:200,evidence:'OWN-LAB',fix:'owner check',retest:{observed:403,legitimate:200}};
 assert.equal(validateFinding(finding).ok,true);
 assert.equal(validateFinding({...finding,evidence:'Bearer very-secret'}).ok,false);
 assert.equal(validateFinding({...finding,retest:{observed:403,legitimate:403}}).ok,false);
});
test('036 STRIDE vincula fluxo, ameaça, controle e positivo/negativo',()=>{
 assert.equal(modelThreat({flow:'API->store',principal:'download-only',operation:'delete'}).category,'Elevation of Privilege');
 assert.equal(modelThreat({flow:'browser->API',actorFromClient:true}).category,'Spoofing');
});
test('037 endpoint de perfil permite nome e nunca aceita role do body',()=>{
 assert.deepEqual(safeProfilePatch({name:'Ana',role:'reader'},{name:'Ana Maria',role:'admin'}),{name:'Ana Maria',role:'reader'});
});
test('038 ferramentas têm classes distintas e segredo de teste não pode ser token real',()=>{
 assert.equal(categorizeScanner({source:'lockfile',kind:'dependency'}),'SCA');
 assert.equal(categorizeScanner({source:'code',kind:'tainted-sink'}),'SAST');
 assert.equal(categorizeScanner({source:'http',kind:'response'}),'DAST');
 assert.equal(categorizeScanner({source:'code',kind:'dummy-secret'}),'SECRET');
});
test('039 gate interrompe entrega com teste quebrado ou risco confirmado alto',()=>{
 assert.equal(releaseGate({testsPassing:true,verifiedHighRisks:0,artifactBuilt:true}),true);
 assert.equal(releaseGate({testsPassing:false,verifiedHighRisks:0,artifactBuilt:true}),false);
 assert.equal(releaseGate({testsPassing:true,verifiedHighRisks:1,artifactBuilt:true}),false);
});
test('040 capstone: do escopo ao reteste em sistema fictício sem rede externa',async()=>{
 const result=await capstone();
 assert.equal(result.scope,true);
 assert.equal(result.inventory.length,3);
 assert.equal(result.before,'CONFIRMADO');
 assert.equal(result.after,'CONTROLADO');
 assert.equal(result.report.ok,true);
 assert.equal(result.release,true);
});
