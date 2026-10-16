import {test,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createPlatformHandler} from './platform.mjs';

const running=[];
afterEach(async()=>{while(running.length){
 const {server,app,dir}=running.pop();
 await new Promise(resolve=>server.close(resolve));
 app.close();rmSync(dir,{recursive:true,force:true});
}});
async function start(){
 const dir=mkdtempSync(join(tmpdir(),'hub-subscription-offer-'));
 const origin='http://127.0.0.1';
 const app=createPlatformHandler({dbPath:join(dir,'platform.db'),origin,bootstrapKey:'offer-test-bootstrap-key'});
 const server=createServer(app.handle);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 running.push({server,app,dir});
 const endpoint='http://127.0.0.1:'+server.address().port;
 return async(path,{method='GET',data,cookie,originHeader=origin}={})=>{
   const response=await fetch(endpoint+path,{method,headers:{
     ...(data!==undefined?{'Content-Type':'application/json'}:{}),
     ...(method!=='GET'?{Origin:originHeader}:{}),
     ...(cookie?{Cookie:cookie}:{})
   },...(data!==undefined?{body:JSON.stringify(data)}:{})});
   return {status:response.status,body:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};
 };
}
async function admin(req){
 const result=await req('/api/auth/bootstrap',{method:'POST',data:{
  name:'Administrador',email:'admin@example.test',password:'StrongPassword123!',
  bootstrapKey:'offer-test-bootstrap-key'
 }});
 assert.equal(result.status,201);
 return result.cookie;
}

test('somente admin configura preço em centavos, sem dependência de gateway',async()=>{
 const req=await start();
 assert.deepEqual((await req('/api/subscription/offer')).body,{
  priceCents:null,currency:'BRL',billingPeriod:'monthly',periodDays:30,updatedAt:null
 });
 assert.equal((await req('/api/admin/subscription/offer',{method:'PUT',data:{priceCents:4990}})).status,401);
 const cookie=await admin(req);
 for(const priceCents of [0,-1,1,99,10000001,49.9,'4990',undefined]){
  assert.equal((await req('/api/admin/subscription/offer',{method:'PUT',cookie,data:{priceCents}})).status,400);
 }
 assert.equal((await req('/api/admin/subscription/offer',{method:'PUT',cookie,originHeader:'https://other.test',data:{priceCents:4990}})).status,403);
 assert.equal((await req('/api/admin/subscription/offer',{method:'PUT',cookie,data:{priceCents:4990}})).status,200);
 assert.equal((await req('/api/subscription/offer')).body.priceCents,4990);
 assert.equal((await req('/api/admin/subscription/offer',{method:'PUT',cookie,data:{priceCents:null}})).status,200);
 assert.equal((await req('/api/subscription/offer')).body.priceCents,null);
});

test('preço não concede acesso; assinatura manual vale só durante a vigência',async()=>{
 const req=await start(),adminCookie=await admin(req);
 const student=await req('/api/auth/register',{method:'POST',data:{
  name:'Aluno',email:'aluno@example.test',password:'StrongPassword123!'
 }});
 assert.equal(student.status,201);
 assert.equal((await req('/api/admin/subscription/offer',{method:'PUT',cookie:student.cookie,data:{priceCents:3990}})).status,403);
 assert.equal((await req('/api/admin/subscription/offer',{method:'PUT',cookie:adminCookie,data:{priceCents:3990}})).status,200);
 assert.equal((await req('/api/access/me',{cookie:student.cookie})).body.subscriptionActive,false);
 assert.equal((await req('/api/content/trail/reverse-ai',{cookie:student.cookie})).status,403);
 const grant=await req('/api/admin/access/subscriptions',{method:'POST',cookie:adminCookie,data:{
  userId:student.body.user.id,validDays:30
 }});
 assert.equal(grant.status,200);
 assert.equal((await req('/api/access/me',{cookie:student.cookie})).body.subscriptionActive,true);
 // Mesmo assinantes não abrem prévias draft.
 assert.equal((await req('/api/content/trail/reverse-ai',{cookie:student.cookie})).status,403);
 assert.equal((await req('/api/admin/access/subscriptions',{method:'DELETE',cookie:adminCookie,data:{userId:student.body.user.id}})).status,200);
 assert.equal((await req('/api/access/me',{cookie:student.cookie})).body.subscriptionActive,false);
});
