import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openStore} from '../server/db.mjs';
test('não recria fixtures após banco existente ficar vazio',()=>{
 const dir=mkdtempSync(join(tmpdir(),'gestor-empty-')),file=join(dir,'db.sqlite');
 try{
  const first=openStore(file);
  for(const order of first.orders())first.removeOrder(order.id);
  for(const client of first.clients())first.removeClient(client.id);
  first.close();
  const again=openStore(file);
  assert.equal(again.orders().length,0);
  assert.equal(again.clients().length,0);
  assert.equal(again.integrity().valid,true);
  again.close();
 }finally{rmSync(dir,{recursive:true,force:true});}
});
