import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openStore} from '../server/db.mjs';
import {startServer} from '../server/http.mjs';
test('SQLite persiste uma OS após reabrir arquivo',()=>{
 const dir=mkdtempSync(join(tmpdir(),'gestor-')),file=join(dir,'db.sqlite');
 try{const s=openStore(file),order=s.createOrder({clientId:'C-001',service:'Teste local'});s.close();const reopened=openStore(file);assert.ok(reopened.orders().some(o=>o.id===order.id));assert.equal(reopened.integrity().valid,true);reopened.close();}finally{rmSync(dir,{recursive:true,force:true});}
});
test('regras rejeitam inválidos sem mutação e impedem repetição',()=>{
 const s=openStore(':memory:');
 try{const before=s.orders().length;assert.throws(()=>s.createOrder({clientId:'C-999',service:'Teste'}),/inexistente/);assert.throws(()=>s.createOrder({clientId:'C-001',service:' '}),/Serviço/);assert.throws(()=>s.removeClient('C-001'),/vinculadas/);assert.equal(s.orders().length,before);s.advanceOrder('OS-002');s.advanceOrder('OS-002');assert.equal(s.advanceOrder('OS-002').status,'concluído');assert.equal(s.orders().filter(x=>x.status==='concluído').length,2);}finally{s.close();}
});
test('HTTP: contratos positivos e negativos com SQLite',async()=>{
 const app=await startServer({port:0});
 const req=async(path,method='GET',data)=>{const r=await fetch(app.url+'/api'+path,{method,headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});return{status:r.status,data:await r.json()};};
 try{
  assert.equal((await req('/health')).status,200);
  const client=await req('/clients','POST',{name:'Fictício C'});assert.equal(client.status,201);
  const order=await req('/orders','POST',{clientId:client.data.item.id,service:'Serviço criado'});assert.equal(order.status,201);
  const before=(await req('/orders')).data.items.length;
  assert.equal((await req('/orders','POST',{clientId:'C-999',service:'Teste'})).status,422);
  assert.equal((await req('/clients/'+client.data.item.id,'DELETE')).status,409);
  assert.equal((await req('/orders')).data.items.length,before);
  assert.equal((await req('/orders/'+order.data.item.id+'/advance','PATCH')).data.item.status,'em andamento');
  assert.equal((await req('/orders/'+order.data.item.id+'/advance','PATCH')).data.item.status,'concluído');
  assert.equal((await req('/orders/'+order.data.item.id+'/advance','PATCH')).data.item.status,'concluído');
  assert.equal((await req('/orders/OS-999','DELETE')).status,404);
  const invalid=await fetch(app.url+'/api/clients',{method:'POST',headers:{'Content-Type':'application/json'},body:'{erro'});assert.equal(invalid.status,400);
  assert.equal(app.store.integrity().valid,true);
 }finally{await app.close();}
});
test('não permite bind de internet',async()=>await assert.rejects(startServer({host:'0.0.0.0',port:0}),/loopback/));
