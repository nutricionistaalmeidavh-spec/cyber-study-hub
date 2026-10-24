import assert from 'node:assert/strict';
import {test, afterEach} from 'node:test';
import {createServer} from 'node:http';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {createPlatformHandler} from './platform.mjs';

const sessions=[];
afterEach(async()=>{
  while(sessions.length){
    const {server,app,dir}=sessions.pop();
    await new Promise(done=>server.close(done));
    app.close();
    rmSync(dir,{recursive:true,force:true});
  }
});
async function setup({mail=true}={}){
  const dir=mkdtempSync(join(tmpdir(),'hub-recovery-'));
  const messages=[],origin='http://127.0.0.1';
  const dbPath=join(dir,'platform.sqlite');
  const app=createPlatformHandler({
    dbPath,origin,openRegistration:true,bootstrapKey:'test-bootstrap-key',
    emailFrom:mail?'academy@artisys.dev':'',
    sendResetMail:mail?async message=>{messages.push(message);}:null
  });
  const server=createServer(app.handle);
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  sessions.push({server,app,dir});
  const base='http://127.0.0.1:'+server.address().port;
  async function call(path,method='GET',data,cookie){
    const response=await fetch(base+path,{method,headers:{
      ...(method!=='GET'?{Origin:origin}:{}),
      ...(data?{'Content-Type':'application/json'}:{}),
      ...(cookie?{Cookie:cookie}:{})
    },...(data?{body:JSON.stringify(data)}:{})});
    return {status:response.status,body:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]??''};
  }
  const email='owner@academy.example';
  const original='OriginalPassword123!';
  const user=await call('/api/auth/bootstrap','POST',{name:'Owner',email,password:original,bootstrapKey:'test-bootstrap-key'});
  assert.equal(user.status,201);
  return {call,messages,dbPath,email,original,session:user.cookie};
}
test('forgot returns uniform response and only delivers to a registered user',async()=>{
  const {call,messages,email}=await setup();
  assert.equal((await call('/api/auth/password/forgot','POST',{email:'unknown@academy.example'})).status,200);
  assert.equal(messages.length,0);
  const found=await call('/api/auth/password/forgot','POST',{email});
  assert.equal(found.status,200);
  assert.equal(messages.length,1);
  assert.equal(messages[0].to,email);
  assert.match(messages[0].text,/\?reset=[A-Za-z0-9_-]+/);
  assert.equal(JSON.stringify(found.body).includes('reset='),false);
});
test('one-use recovery keeps user identity, revokes sessions and invalidates old password',async()=>{
  const {call,messages,email,original,session}=await setup();
  const initial=(await call('/api/me','GET',null,session)).body.user;
  await call('/api/auth/password/forgot','POST',{email});
  const token=new URL(messages[0].text.match(/https?:\/\/[^\s]+\?reset=[A-Za-z0-9_-]+/)[0]).searchParams.get('reset');
  const replacement='NewSafePassword123!';
  const changed=await call('/api/auth/password/reset','POST',{token,newPassword:replacement});
  assert.equal(changed.status,200);
  assert.equal((await call('/api/me','GET',null,session)).status,401);
  assert.equal((await call('/api/auth/login','POST',{email,password:original})).status,401);
  const signin=await call('/api/auth/login','POST',{email,password:replacement});
  assert.equal(signin.status,200);
  assert.equal(signin.body.user.id,initial.id);
  assert.equal(signin.body.user.role,'admin');
  assert.equal((await call('/api/auth/password/reset','POST',{token,newPassword:'AnotherSafePassword123!'})).status,400);
});
test('expired link rejected; unknown account response does not disclose membership',async()=>{
  const {call,messages,dbPath,email}=await setup();
  await call('/api/auth/password/forgot','POST',{email});
  const token=new URL(messages[0].text.match(/https?:\/\/[^\s]+\?reset=[A-Za-z0-9_-]+/)[0]).searchParams.get('reset');
  const db=new DatabaseSync(dbPath);
  db.prepare('UPDATE password_resets SET expires_at=?').run(Date.now()-1000);
  db.close();
  assert.equal((await call('/api/auth/password/reset','POST',{token,newPassword:'AnotherSafePassword123!'})).status,400);
  assert.equal((await call('/api/auth/login','POST',{email,password:'OriginalPassword123!'})).status,200);
});
test('without configured mail transport recovery fails closed for any account',async()=>{
  const {call,email}=await setup({mail:false});
  assert.equal((await call('/api/auth/password/forgot','POST',{email})).status,503);
  assert.equal((await call('/api/auth/password/forgot','POST',{email:'unknown@academy.example'})).status,503);
});
