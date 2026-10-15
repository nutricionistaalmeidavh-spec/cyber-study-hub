import {test} from 'node:test';
import assert from 'node:assert/strict';
import {classifyTicket} from './reference.mjs';
import {classifyCandidate} from './candidate.mjs';
import {inspectModule,scenarios} from './lab.mjs';
test('oito módulos executam casos reais positivos e controles negativos',()=>{
 for(let id=1;id<=8;id++){
  const result=inspectModule(id);
  assert.equal(result.moduleId,id);assert.equal(result.negativeControl.rejected,true);
  assert.equal(result.differentialMatch,true);
  assert.deepEqual(result.observed,result.candidate);
 }
 assert.equal(scenarios.length,8);
});
test('o limiar crítico é inclusivo: 22, enquanto 21 permanece alto',()=>{
 assert.deepEqual(classifyTicket({severity:8,impact:1,blocked:true}),{score:22,priority:'critical'});
 assert.deepEqual(classifyCandidate({severity:8,impact:0,blocked:true}),{score:21,priority:'high'});
});
test('valida tipos antes de cálculo e não aceita entradas fora do contrato',()=>{
 for(const input of [null,[],{severity:-1,impact:0,blocked:false},{severity:2,impact:11,blocked:false},
  {severity:1,impact:2,blocked:'true'},{severity:1.1,impact:2,blocked:false}]){
  assert.throws(()=>classifyTicket(input));
  assert.throws(()=>classifyCandidate(input));
 }
});
test('identidade do módulo não é índice solto',()=>{
 for(const invalid of [-1,0,9,1.5,NaN])assert.throws(()=>inspectModule(invalid),RangeError);
});
