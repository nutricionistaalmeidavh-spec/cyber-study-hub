import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
import {makeOrderPdfPayload} from '../pdf/payload.mjs';
import {ordersToRows} from '../reporting/rows.mjs';
import {orderToTransaction} from '../finance/transaction.mjs';
const here=dirname(fileURLToPath(import.meta.url));
const require=createRequire(import.meta.url);
const {normalizeWeight}=require('../serial/scale-simulator.cjs');
const registry=JSON.parse(readFileSync(join(here,'../catalog.json'),'utf8'));
test('biblioteca: seis kits possuem origem, limites e entrada existente',()=>{
 assert.equal(registry.kits.length,6);const ids=new Set();
 for(const kit of registry.kits){assert.ok(!ids.has(kit.id));ids.add(kit.id);for(const prop of ['title','upstream','status','dependencies','simulation','source','entry','tests'])assert.ok(kit[prop],kit.id+' sem '+prop);assert.ok(existsSync(join(here,'..',kit.entry)),kit.id+' entrada inexistente');}
});
test('PDF: template validável, campos fictícios e estados controlados',()=>{
 const x=makeOrderPdfPayload({id:'OS-1',cliente:'Cliente Exemplo',servico:'Serviço fictício',status:'concluído'});
 assert.equal(x.template.schemas[0].length,5);assert.equal(x.inputs[0].ordem,'OS: OS-1');
 assert.throws(()=>makeOrderPdfPayload({id:'OS-1',cliente:'',servico:'Serviço',status:'pendente'}));
 assert.throws(()=>makeOrderPdfPayload({id:'OS-1',cliente:'Ana',servico:'Serviço',status:'admin'}));
});
test('CSV: preserva clientId, bloqueia OS órfã e neutraliza fórmula',()=>{
 const a=ordersToRows([{id:'OS-1',clientId:'C-1',service:'=1+1',status:'pendente'}],[{id:'C-1',name:'Teste'}]);
 assert.equal(a[0].servico,"'=1+1");assert.equal(a[0].cliente,'Teste');
 assert.throws(()=>ordersToRows([{id:'OS-1',clientId:'C-99',service:'X',status:'pendente'}],[{id:'C-1',name:'Teste'}]));
});
test('Financeiro: centavos inteiros e data exigida',()=>{
 const x=orderToTransaction({id:'1',accountId:'cx',date:'2026-10-15',description:'OS fictícia',amountCents:2500});
 assert.equal(x.amountCents,2500);assert.equal(x.direction,'credit');
 assert.throws(()=>orderToTransaction({id:'1',accountId:'cx',date:'2026-10-15',description:'OS',amountCents:0}));
 assert.throws(()=>orderToTransaction({id:'1',accountId:'cx',date:'hoje',description:'OS',amountCents:2500}));
});
test('Balança: simulada, vírgula e erros de medida',()=>{
 assert.deepEqual(normalizeWeight('1,250 kg'),{kg:1.25,unit:'kg',source:'simulated'});
 assert.throws(()=>normalizeWeight('peso desconhecido'));assert.throws(()=>normalizeWeight('-1 kg'));
});
test('UI: componente local sem dependência do private frontEnds',()=>{
 const code=readFileSync(join(here,'../ui/StatusCard.tsx'),'utf8');
 assert.match(code,/aria-live=.+polite/);assert.doesNotMatch(code,/frontEnds\\//);
});
