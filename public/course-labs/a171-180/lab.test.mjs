import test from 'node:test';import assert from 'node:assert/strict';
import {cases,evaluateResearch,runResearch} from './models.mjs';
for(const [key,value] of Object.entries(cases)){
 const id=Number(key);
 test('Aula '+id+' — caso válido, negativo, interpretação e isolamento',()=>{
  assert.equal(evaluateResearch(id,value.ok).status,value.okStatus);
  assert.equal(evaluateResearch(id,value.bad).status,value.badStatus);
  assert.notEqual(value.okStatus,value.badStatus);
  assert.equal(evaluateResearch(id,{}).status,'INVALID_INPUT');
  assert.equal(runResearch(id).lesson,id);
 });
}
test('harness jamais executa rede nem exploração e preserva casos',()=>{
 assert.equal(evaluateResearch(172,cases[172].ok).libFuzzerExecuted,false);
 assert.equal(evaluateResearch(177,cases[177].ok).exploitExecuted,false);
 assert.equal(evaluateResearch(180,cases[180].ok).exploitationProven,false);
 assert.equal(evaluateResearch(179,cases[179].ok).confirmedVulnerability,false);
});
