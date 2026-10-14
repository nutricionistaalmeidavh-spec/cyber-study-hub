import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {openStore} from '../server/db.mjs';
import {safeCopySqlite} from '../ops/backup.mjs';
test('M08: backup e restauração preservam registro e vínculos',async()=>{
 const folder=mkdtempSync(join(tmpdir(),'gestor-backup-'));
 const live=join(folder,'live.sqlite'),copy=join(folder,'copy.sqlite'),restored=join(folder,'restored.sqlite');
 try{
  const src=openStore(live);
  const added=src.createOrder({clientId:'C-001',service:'Nova OS fictícia'});
  src.close();
  const result=await safeCopySqlite(live,copy);
  assert.equal(result.integrity,true);assert.equal(result.orders,4);
  await assert.rejects(safeCopySqlite(live,copy),/já existe/);
  const recovery=await safeCopySqlite(copy,restored);
  assert.equal(recovery.orders,4);
  const reopened=openStore(restored,{seed:false});
  assert.ok(reopened.orders().some(o=>o.id===added.id));
  assert.equal(reopened.integrity().valid,true);
  reopened.close();
 }finally{rmSync(folder,{recursive:true,force:true});}
});
test('M08: cópia sobre a origem é proibida',async()=>{
 const folder=mkdtempSync(join(tmpdir(),'gestor-backup-')),live=join(folder,'live.sqlite');
 try{const db=openStore(live);db.close();await assert.rejects(safeCopySqlite(live,live),/coincidem/);}finally{rmSync(folder,{recursive:true,force:true});}
});
