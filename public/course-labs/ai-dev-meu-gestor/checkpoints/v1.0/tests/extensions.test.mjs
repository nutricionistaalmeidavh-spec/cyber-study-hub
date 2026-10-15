import test from 'node:test';
import assert from 'node:assert/strict';
import {startServer} from '../server/http.mjs';
import {ordersToCsv,normalizeScale,financePreview,printableOrder} from '../src/extensions/core.ts';
const clients=[{id:'C-001',name:'Cliente Exemplo'}];
const orders=[{id:'OS-001',clientId:'C-001',service:'Serviço de laboratório',status:'pendente'}];
test('relatórios: CSV de fatos, escape e rejeição de OS órfã',()=>{
 const csv=ordersToCsv([{...orders[0],service:'=IMPORTXML(1)'}],clients);
 assert.match(csv,/'=IMPORTXML/);
 assert.match(csv,/OS-001/);
 assert.equal(csv.startsWith('\uFEFF'),true);
 assert.throws(()=>ordersToCsv([{...orders[0],clientId:'C-999'}],clients),/cliente/);
});
test('balança serial: simulador sem equipamento e input negativo',()=>{
 assert.deepEqual(normalizeScale('1,250 kg'),{kg:1.25,unit:'kg',source:'simulador'});
 assert.throws(()=>normalizeScale('-10 kg'),/Use um peso/);
 assert.throws(()=>normalizeScale('301 kg'),/faixa/);
});
test('financeiro: preview sem lançamento, moeda inteira e categorias controladas',()=>{
 assert.deepEqual(financePreview({id:'PREVIA-OS-001',amountCents:2500,category:'servico'}),{
 id:'PREVIA-OS-001',amountCents:2500,category:'servico',status:'PREVIA_SEM_LANCAMENTO',source:'demo-local'});
 assert.throws(()=>financePreview({id:'x',amountCents:0,category:'servico'}),/Centavos/);
 assert.throws(()=>financePreview({id:'x',amountCents:25.50,category:'servico'}),/Centavos/);
 assert.throws(()=>financePreview({id:'x',amountCents:250,category:'admin'}),/Categoria/);
});
test('PDF por impressão: identidade da OS, HTML protegido contra injeção',()=>{
 const doc=printableOrder({...orders[0],service:'<script>alert(1)</script>'},clients[0]);
 assert.match(doc,/&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
 assert.doesNotMatch(doc,/<script>/);
 assert.match(doc,/Salvar como PDF/);
 assert.throws(()=>printableOrder(orders[0],{id:'C-999',name:'Invalido'}),/correspondem/);
});
test('HTTP v1.0: integridade, documento OS e 404 respeitam loopback',async()=>{
 const app=await startServer({port:0});
 try{
  const q=await fetch(app.url+'/api/extensions/quality');
  assert.equal(q.status,200);
  const result=await q.json();
  assert.equal(result.ok,true);assert.equal(result.integrity.valid,true);
  assert.equal(result.counts.orders,3);
  const p=await fetch(app.url+'/api/extensions/orders/OS-001/print');
  assert.equal(p.status,200);
  assert.match(p.headers.get('content-type'),/text\/html/);
  assert.equal(p.headers.get('cache-control'),'no-store');
  assert.match(await p.text(),/Instalação fictícia/);
  assert.equal((await fetch(app.url+'/api/extensions/orders/OS-777/print')).status,404);
  assert.equal((await fetch(app.url+'/api/extensions/orders/OS-001/print',{method:'POST'})).status,404);
  assert.equal((await fetch(app.url+'/api/orders')).status,200);
 }finally{await app.close();}
});
