import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {doc,getDoc,setDoc,updateDoc,deleteDoc,collection,query,where,getDocs} from 'firebase/firestore';
// Não permite SDK atingir serviço real por falta de emulador.
assert.equal(process.env.FIRESTORE_EMULATOR_HOST,'127.0.0.1:8088');
const projectId='demo-course-platform';
const fixed=readFileSync(new URL('./firestore.rules',import.meta.url),'utf8');
const wide="rules_version = '2'; service cloud.firestore {match /databases/{d}/documents {match /notes/{n} {allow read, write: if true;}}}";
let env;
try {
 env=await initializeTestEnvironment({projectId,firestore:{host:'127.0.0.1',port:8088,rules:wide}});
 await env.clearFirestore();
 await env.withSecurityRulesDisabled(async ctx=>{
  const db=ctx.firestore();
  await setDoc(doc(db,'notes','a'),{owner:'alice',body:'nota A'});
  await setDoc(doc(db,'notes','b'),{owner:'bob',body:'nota B'});
 });
 await assertSucceeds(getDoc(doc(env.authenticatedContext('alice').firestore(),'notes','b')));
 console.log('BASELINE: Alice lê B com rules abertas');
 await env.cleanup();
 env=await initializeTestEnvironment({projectId,firestore:{host:'127.0.0.1',port:8088,rules:fixed}});
 const a=env.authenticatedContext('alice').firestore(),b=env.authenticatedContext('bob').firestore();
 const anon=env.unauthenticatedContext().firestore();
 assert.equal((await assertSucceeds(getDoc(doc(a,'notes','a')))).data().body,'nota A');
 await assertFails(getDoc(doc(a,'notes','b')));
 await assertFails(getDoc(doc(anon,'notes','a')));
 await assertSucceeds(setDoc(doc(a,'notes','c'),{owner:'alice',body:'nota C'}));
 await assertFails(setDoc(doc(a,'notes','d'),{owner:'bob',body:'indevida'}));
 await assertSucceeds(updateDoc(doc(a,'notes','a'),{body:'editada A'}));
 await assertFails(updateDoc(doc(a,'notes','a'),{owner:'bob'}));
 await assertFails(updateDoc(doc(a,'notes','b'),{body:'indevida'}));
 await assertFails(getDocs(collection(a,'notes')));
 assert.equal((await assertSucceeds(getDocs(query(collection(a,'notes'),where('owner','==','alice'))))).size,2);
 assert.equal((await assertSucceeds(getDoc(doc(b,'notes','b')))).data().body,'nota B');
 await assertFails(getDoc(doc(a,'notes','b')));
 await assertFails(setDoc(doc(a,'notes','long'),{owner:'alice',body:'x'.repeat(501)}));
 await assertFails(setDoc(doc(a,'notes','type'),{owner:'alice',body:123}));
 await assertFails(setDoc(doc(a,'notes','extra'),{owner:'alice',body:'nota',admin:true}));
 await assertFails(deleteDoc(doc(a,'notes','a')));
 assert.equal((await assertSucceeds(getDoc(doc(a,'notes','a')))).data().body,'editada A');
 console.log('PASS 17 checks: própria/alheia/anon/create/update/query/schema/delete/reteste');
} finally { if(env){await env.clearFirestore();await env.cleanup();} }
