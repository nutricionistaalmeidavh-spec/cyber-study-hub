import test from 'node:test';import assert from 'node:assert/strict';import {existsSync} from 'node:fs';
import {runFinalStage} from './stage-runner.mjs';
for(let id=209;id<=218;id++){
 test('AULA-'+id+' — atividade própria, template, causalidade e reteste',()=>{
  const r=runFinalStage(id);
  assert.equal(r.id,id);assert.equal(r.canonical,'AULA-'+id);assert.equal(r.studentMustCompleteTemplate,true);
  assert.ok(r.exercise&&r.check&&r.requiredTemplates.length);
  for(const name of r.requiredTemplates)assert.ok(existsSync('public/course-labs/capstone-final/templates/'+name),name);
  assert.deepEqual([r.evidence.alice,r.evidence.bobVulnerable,r.evidence.bobFixed,r.evidence.unknown],[200,200,403,404]);
  assert.equal(r.evidence.detectionBefore,'UNAUTHORIZED_READ_DEMO');
  assert.equal(r.evidence.detectionAfter,null);
 });
}
test('ids desconhecidos não fabricam projeto',()=>assert.equal(runFinalStage(999).status,'UNKNOWN_STAGE'));
