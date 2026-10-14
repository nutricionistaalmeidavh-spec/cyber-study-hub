import test from 'node:test';
import assert from 'node:assert/strict';
import {openStore} from '../server/db.mjs';
import {startServer} from '../server/http.mjs';
test('M07: edição não altera id, cliente vinculado nem status',()=>{
 const db=openStore(':memory:');
 try{const before=db.orders()[0];db.renameClient('C-001',{name:'Outro cliente fictício'});db.renameOrder('OS-001',{service:'Novo serviço fictício'});const after=db.orders()[0];assert.equal(after.id,before.id);assert.equal(after.clientId,before.clientId);assert.equal(after.status,before.status);assert.equal(db.integrity().valid,true);}finally{db.close();}
});
test('M07: remoção por id, não por índice filtrado',()=>{
 const db=openStore(':memory:');
 try{db.removeOrder('OS-002');assert.deepEqual(db.orders().map(x=>x.id),['OS-001','OS-003']);}finally{db.close();}
});
test('M07: constraints do SQLite recusam estado proibido e ordem órfã',()=>{
 const db=openStore(':memory:');
 try{
  assert.throws(()=>db.db.prepare('UPDATE orders SET status=? WHERE id=?').run('cancelado','OS-002'),/CHECK/);
  assert.throws(()=>db.db.prepare('INSERT INTO orders VALUES (?,?,?,?)').run('OS-099','C-999','Teste','pendente'),/FOREIGN KEY/);
  assert.equal(db.orders().length,3);assert.equal(db.integrity().valid,true);
 }finally{db.close();}
});
test('M07: contrato HTTP de edição, exclusão e erros',async()=>{
 const app=await startServer({port:0});
 const req=async(path,method='GET',data)=>{const r=await fetch(app.url+'/api'+path,{method,headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});return {status:r.status,data:await r.json()};};
 try{
  assert.equal((await req('/orders/OS-002','PATCH',{service:'Novo serviço'})).data.item.status,'pendente');
  assert.equal((await req('/orders/OS-002','PATCH',{service:' '})).status,422);
  assert.equal((await req('/clients/C-001','PATCH',{name:'Cliente renomeado'})).status,200);
  assert.equal((await req('/orders/OS-002','DELETE')).status,200);
  assert.equal((await req('/orders/OS-002','DELETE')).status,404);
  assert.equal((await req('/clients/C-001','DELETE')).status,409);
  assert.equal(app.store.integrity().valid,true);
 }finally{await app.close();}
});
