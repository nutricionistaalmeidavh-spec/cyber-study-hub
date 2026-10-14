import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

// Integração: chaves existentes de qualquer tamanho devem ser comparadas literalmente.
const key='test-key11';
assert.ok(key.length<24);
const port=8879;
const origin='http://127.0.0.1:'+port;
const temp=await mkdtemp(join(tmpdir(),'hub-worker-test-'));
const child=spawn(process.execPath,[
  './node_modules/wrangler/bin/wrangler.js',
  'dev','--local','--ip','127.0.0.1','--port',String(port),
  '--persist-to',temp,'--var','HUB_BOOTSTRAP_KEY:'+key
],{stdio:['ignore','pipe','pipe'],env:{...process.env,CI:'true'}});
let logs='';
for(const stream of [child.stdout,child.stderr])stream.on('data',chunk=>{logs+=chunk.toString();});
const request=async(path,{method='GET',body,cookie}={})=>{
  const result=await fetch(origin+path,{
    method,headers:{...(method!=='GET'?{Origin:origin}:{}),
      ...(body?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},
    ...(body?{body:JSON.stringify(body)}:{})
  });
  const text=await result.text();
  let payload={};
  try{payload=JSON.parse(text);}catch{}
  return {status:result.status,payload,cookie:(result.headers.get('set-cookie')||'').split(';')[0],text};
};
async function ready(){
  for(let i=0;i<150;i++){
    if(child.exitCode!==null)throw Error('Wrangler terminou antes de servir requests: '+logs);
    try{if((await request('/api/health')).status===200)return;}catch{}
    await sleep(200);
  }
  throw Error('Timeout na inicialização do Worker. '+logs.slice(-5000));
}
try{
  await ready();
  assert.equal((await request('/api/auth/config')).payload.ready,false);
  assert.equal((await request('/api/me')).status,401);
  const admin={name:'Admin',email:'admin@example.test',password:'GoodPassword1234!',bootstrapKey:key};
  assert.equal((await request('/api/auth/bootstrap',{method:'POST',body:{...admin,bootstrapKey:'invalid'}})).status,403);
  const created=await request('/api/auth/bootstrap',{method:'POST',body:admin});
  assert.equal(created.status,201,created.text);
  assert.equal(created.payload.user.role,'admin');
  assert.equal((await request('/api/auth/bootstrap',{method:'POST',body:admin})).status,409);
  assert.equal((await request('/api/auth/config')).payload.ready,true);
  const rejected=await request('/api/auth/login',{method:'POST',body:{email:admin.email,password:'WrongPassword12!'}});
  assert.equal(rejected.status,401,rejected.text);
  const signin=await request('/api/auth/login',{method:'POST',body:{email:admin.email,password:admin.password}});
  assert.equal(signin.status,200,signin.text);
  assert.equal((await request('/api/me',{cookie:signin.cookie})).payload.user.email,admin.email);
  const invitation=await request('/api/admin/invitations',{method:'POST',cookie:created.cookie,
    body:{email:'student@example.test',role:'student'}});
  assert.equal(invitation.status,201,invitation.text);
  const student=await request('/api/auth/register',{method:'POST',
    body:{name:'Student',password:'GoodPassword1234!',inviteToken:invitation.payload.token}});
  assert.equal(student.status,201,student.text);
  assert.equal(student.payload.user.role,'student');
  assert.equal((await request('/api/auth/register',{method:'POST',
    body:{name:'Replay',password:'GoodPassword1234!',inviteToken:invitation.payload.token}})).status,403);
  assert.equal((await request('/api/admin/users',{cookie:student.cookie})).status,403);
  assert.equal((await request('/api/admin/users',{cookie:created.cookie})).payload.users.length,2);
  const keyProgress='cyber-study-lessons-v1';
  assert.equal((await request('/api/me/state',{method:'PUT',cookie:student.cookie,
    body:{key:keyProgress,value:'{"1":{"completed":true}}'}})).status,200);
  assert.equal((await request('/api/me/state',{cookie:created.cookie})).payload.state[keyProgress],undefined);
  assert.equal((await request('/api/me/state',{cookie:student.cookie})).payload.state[keyProgress],
    '{"1":{"completed":true}}');
  assert.equal((await request('/api/me/state',{method:'DELETE',cookie:student.cookie,
    body:{key:keyProgress}})).status,200);
  assert.equal((await request('/api/me/state',{cookie:student.cookie})).payload.state[keyProgress],undefined);
  assert.equal((await request('/api/admin/users/'+student.payload.user.id,{method:'PATCH',
    cookie:created.cookie,body:{status:'suspended'}})).status,200);
  assert.equal((await request('/api/me',{cookie:student.cookie})).status,401);
  assert.equal((await request('/api/auth/logout',{method:'POST',cookie:created.cookie})).status,200);
  assert.equal((await request('/api/me',{cookie:created.cookie})).status,401);
  const app=await fetch(origin+'/');
  assert.equal(app.status,200);
  console.log('Cloudflare Worker local: login, roles, progress isolation, suspend, logout, assets OK');
}catch(e){
  console.error('Worker integration failed: '+String(e));
  console.error('Worker last logs: '+logs.slice(-10000));
  process.exitCode=1;
}finally{
  child.kill('SIGTERM');
  await Promise.race([new Promise(resolve=>child.once('close',resolve)),sleep(2000)]);
  await rm(temp,{recursive:true,force:true});
}
