import test from 'node:test';
import assert from 'node:assert/strict';
import { invoice, decideRead, makeAuditEvent, detectionRule } from './model.mjs';
const result=(actor,mode='corrected')=>decideRead({actor,mode});
test('AULA-211: inventário da fixture e escopo têm identidade estável',()=>{
 assert.deepEqual(invoice,{id:'F001',owner:'alice',amountCents:15000});
 assert.equal(result('alice').status,200);
 assert.equal(result('bob').status,403);
});
test('AULA-212: hipóteses predefinidas permitem prova e contraprova',()=>{
 assert.deepEqual(['alice','bob','mallory'].map(actor=>result(actor,'vulnerable').status),[200,200,404]);
 assert.deepEqual(['alice','bob','mallory'].map(actor=>result(actor).status),[200,403,404]);
});
test('AULA-213: prova mínima de impacto diferencia apenas o modo',()=>{
 const before=result('bob','vulnerable'),after=result('bob');
 assert.equal(before.status,200);
 assert.equal(after.status,403);
 assert.equal(result('alice').status,200);
 assert.equal(before.body.id,'F001');
});
test('AULA-214: timeline UTC e metadados distinguem acesso e bloqueio',()=>{
 const a=makeAuditEvent({actor:'bob',mode:'vulnerable',result:result('bob','vulnerable'),at:'2026-10-15T12:00:00.000Z'});
 const b=makeAuditEvent({actor:'bob',mode:'corrected',result:result('bob'),at:'2026-10-15T12:00:01.000Z'});
 assert.ok(a.timestamp<b.timestamp);
 assert.equal(a.status,200);assert.equal(b.status,403);
 assert.equal(a.action,'read:F001'); assert.equal(b.classification,'denied');
 assert.equal(a.classification,'observed'); // observed NÃO atesta autorização
 assert.equal(JSON.stringify([a,b]).includes('amountCents'),false);
});
test('AULA-215: detecção alerta somente leitura indevida simulada, sem bloquear Alice',()=>{
 const mk=(actor,mode)=>makeAuditEvent({actor,mode,result:result(actor,mode)});
 assert.equal(detectionRule(mk('bob','vulnerable')),'UNAUTHORIZED_READ_DEMO');
 assert.equal(detectionRule(mk('bob','corrected')),null);
 assert.equal(detectionRule(mk('alice','corrected')),null);
});
test('AULA-216: remediação no owner evita bloqueio indiscriminado',()=>{
 assert.equal(result('alice','corrected').status,200);
 assert.equal(result('bob','corrected').status,403);
 assert.equal(result('bob','vulnerable').status,200);
});
test('AULA-217: reteste preserva todos os oráculos H1–H4',()=>{
 assert.equal(result('alice').status,200);
 assert.equal(result('bob').status,403);
 assert.equal(result('mallory').status,404);
 assert.equal(result('bob','vulnerable').status,200);
});
test('AULA-218: sumário técnico e executivo não amplia evidência',()=>{
 const before=result('bob','vulnerable'),after=result('bob'),ok=result('alice');
 const summary={scope:'synthetic-local',before:before.status,after:after.status,allowed:ok.status,
 alert:detectionRule(makeAuditEvent({actor:'bob',mode:'vulnerable',result:before})),
 productionAssessed:false};
 assert.deepEqual(summary,{scope:'synthetic-local',before:200,after:403,allowed:200,alert:'UNAUTHORIZED_READ_DEMO',productionAssessed:false});
});
