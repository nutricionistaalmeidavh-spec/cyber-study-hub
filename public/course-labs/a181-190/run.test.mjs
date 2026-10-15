import test from 'node:test';import assert from 'node:assert/strict';
import {runWorkshop} from './run.mjs';
for(let id=181;id<=190;id++){
 test('AULA-'+id+' tem prova positiva, negativa e não executa ataque',()=>{
  const r=runWorkshop(id);assert.equal(r.id,id);assert.equal(r.noActiveActions,true);
  assert.notDeepEqual(r.positive,r.negative);
  if(id===181)assert.deepEqual([r.positive,r.negative],[true,false]);
  if(id===188)assert.equal(r.positive.complete,false);
  if(id===190){assert.equal(r.positive.review,2);assert.equal(r.positive.complete,false);assert.equal(r.negative.complete,true);}
 });
}
