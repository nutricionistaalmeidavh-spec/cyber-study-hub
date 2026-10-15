import test from 'node:test';import assert from 'node:assert/strict';
import {runAiLab} from './run.mjs';
for(let id=201;id<=208;id++){
 test('AULA-'+id+' — permissão, negativa e limite explícito',()=>{
  const r=runAiLab(id);assert.equal(r.id,id);assert.equal(r.modelInvoked,false);assert.equal(r.networkUsed,false);assert.notDeepEqual(r.positive,r.negative);
 });
}
test('ACL não pode ser sobrescrita por prompt injection',()=>{
 const r=runAiLab(202);assert.equal(r.negative.allowed,false);assert.equal(r.positive.allowed,true);
});
test('caminho de exportação requer aprovação, sem falsa permissão',()=>{
 const r=runAiLab(208);assert.equal(r.positive.decision,'allow');assert.equal(r.negative.decision,'deny');
});
