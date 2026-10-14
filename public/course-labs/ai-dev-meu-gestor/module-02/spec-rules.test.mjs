import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlanOrder,removePlanClient,statuses} from './spec-rules.mjs';
const state=()=>({clients:[{id:'C-001',name:'Fictício A'}],orders:[]});
test('estado válido inicia pendente',()=>{const s=state();const result=createPlanOrder(s,'C-001','Instalar equipamento');assert.equal(result.ok,true);assert.equal(result.state.orders[0].status,'pendente');assert.equal(s.orders.length,0);});
test('cliente inexistente não altera dados',()=>{const s=state();const result=createPlanOrder(s,'C-999','Teste');assert.equal(result.ok,false);assert.equal(result.state,s);});
test('descrição vazia não cria OS',()=>{const s=state();const r=createPlanOrder(s,'C-001','  ');assert.equal(r.ok,false);assert.equal(r.state,s);});
test('exclusão de cliente vinculado é bloqueada',()=>{const s=createPlanOrder(state(),'C-001','Visita').state;const result=removePlanClient(s,'C-001');assert.equal(result.ok,false);assert.equal(result.state,s);});
test('modelo de estados é explícito',()=>{assert.deepEqual([...statuses],['pendente','em andamento','concluído']);});
