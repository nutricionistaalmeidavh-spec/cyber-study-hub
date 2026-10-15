import test from 'node:test';
import assert from 'node:assert/strict';
import {decideRead,makeAuditEvent,detectionRule} from './model.mjs';
test('escopo: cliente original continua lendo F001 corrigida',()=>{assert.equal(decideRead({actor:'alice'}).status,200);});
test('hipótese: Bob acessa indevidamente F001 na variante vulnerável fictícia',()=>{assert.equal(decideRead({actor:'bob',mode:'vulnerable'}).status,200);});
test('correção: Bob bloqueado e Alice preservada',()=>{assert.equal(decideRead({actor:'bob',mode:'corrected'}).status,403);assert.equal(decideRead({actor:'alice',mode:'corrected'}).status,200);});
test('caso negativo: identidade desconhecida não obtém dados',()=>{assert.equal(decideRead({actor:'mallory'}).status,404);});
test('rastreabilidade e detecção com logs fictícios',()=>{const before=makeAuditEvent({actor:'bob',mode:'vulnerable',result:decideRead({actor:'bob',mode:'vulnerable'})});const after=makeAuditEvent({actor:'bob',mode:'corrected',result:decideRead({actor:'bob'})});assert.equal(detectionRule(before),'UNAUTHORIZED_READ_DEMO');assert.equal(detectionRule(after),null);assert.ok(after.timestamp);});
