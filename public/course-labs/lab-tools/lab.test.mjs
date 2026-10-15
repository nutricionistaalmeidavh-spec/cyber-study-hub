import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {assessToolLab,listToolLabs,runToolLab} from './model.mjs';
const scenarios=JSON.parse(readFileSync(new URL('./scenarios.json',import.meta.url),'utf8')).scenarios;
test('Trilha LAB preserva 30 oficinas com nomes únicos',()=>{assert.equal(scenarios.length,30);assert.equal(new Set(listToolLabs()).size,30);});
for(const item of scenarios){
 test(item.code+' — critério específico, caso negativo e entrada inválida',()=>{
  assert.equal(assessToolLab(item.code,item.positive).status,'EXPECTED_LOCAL_CASE');
  assert.equal(assessToolLab(item.code,item.negative).status,'REVIEW_NEGATIVE_CASE');
  assert.equal(assessToolLab(item.code,{}).status,'INVALID_INPUT');
  assert.equal(runToolLab(item.code).positive.toolExecuted,false);
  assert.notEqual(item.positive[item.field],item.negative[item.field]);
 });
}
