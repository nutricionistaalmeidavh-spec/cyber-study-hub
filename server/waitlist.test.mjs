import assert from 'node:assert/strict';
import {afterEach,test} from 'node:test';
import {createServer} from 'node:http';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createPlatformHandler} from './platform.mjs';

const running=[];
afterEach(async()=>{for(const {server,app,dir} of running.splice(0)){
  await new Promise(resolve=>server.close(resolve));app.close();rmSync(dir,{recursive:true,force:true});
}});
async function start(){
  const dir=mkdtempSync(join(tmpdir(),'academy-waitlist-'));
  const app=createPlatformHandler({dbPath:join(dir,'platform.db'),origin:'http://127.0.0.1',bootstrapKey:'waitlist-bootstrap-secret'});
  const server=createServer(app.handle);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  running.push({server,app,dir});
  const base='http://127.0.0.1:'+server.address().port;
  return async(path,{method='GET',data,cookie,origin='http://127.0.0.1'}={})=>{
    const response=await fetch(base+path,{method,headers:{
      ...(data!==undefined?{'Content-Type':'application/json'}:{}),
      ...(method!=='GET'?{Origin:origin}:{}),
      ...(cookie?{Cookie:cookie}:{})
    },...(data!==undefined?{body:JSON.stringify(data)}:{})});
    return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};
  };
}
const applicant={name:'Ana Silva',email:' Ana@Example.test ',courseId:'desenvolvimento-com-ia',consent:true,website:''};
async function admin(request){
  const result=await request('/api/auth/bootstrap',{method:'POST',data:{
    name:'Admin',email:'admin@example.test',password:'StrongPassword123!',bootstrapKey:'waitlist-bootstrap-secret'
  }});
  assert.equal(result.status,201);
  return result.cookie;
}
test('lista de espera grava por ID canônico sem criar conta ou liberar conteúdo',async()=>{
  const request=await start();
  const first=await request('/api/waitlist',{method:'POST',data:applicant});
  assert.equal(first.status,201);
  assert.equal(first.data.ok,true);
  assert.equal((await request('/api/me')).status,401);
  assert.equal((await request('/api/content/trail/ai-dev')).status,401);
  const cookie=await admin(request);
  const list=await request('/api/admin/waitlist',{cookie});
  assert.equal(list.status,200);
  assert.equal(list.data.total,1);
  assert.equal(list.data.entries[0].courseId,'desenvolvimento-com-ia');
  assert.equal(list.data.entries[0].email,'ana@example.test');
  assert.equal(list.data.entries[0].name,'Ana Silva');
});
test('envio repetido é idempotente, inclusive e-mail com maiúsculas, e por curso',async()=>{
  const request=await start();
  assert.equal((await request('/api/waitlist',{method:'POST',data:applicant})).status,201);
  assert.equal((await request('/api/waitlist',{method:'POST',data:{...applicant,email:'ana@example.test'}})).status,200);
  assert.equal((await request('/api/waitlist',{method:'POST',data:{...applicant,courseId:'academy'}})).status,201);
  const cookie=await admin(request);
  assert.equal((await request('/api/admin/waitlist',{cookie})).data.total,2);
  assert.equal((await request('/api/admin/waitlist?courseId=academy',{cookie})).data.total,1);
});
test('consentimento, curso, nome e e-mail são validados e honeypot não persiste',async()=>{
  const request=await start();
  for(const data of [
    {...applicant,consent:false},
    {...applicant,courseId:'fake-course'},
    {...applicant,name:'A'},
    {...applicant,email:'not-an-email'}
  ])assert.equal((await request('/api/waitlist',{method:'POST',data})).status,400);
  assert.equal((await request('/api/waitlist',{method:'POST',data:{...applicant,website:'https://spam.test'}})).status,200);
  const cookie=await admin(request);
  assert.equal((await request('/api/admin/waitlist',{cookie})).data.total,0);
});
test('somente administrador lista e exclui inscrições; CSRF é bloqueado',async()=>{
  const request=await start();
  const cookie=await admin(request);
  const student=await request('/api/auth/register',{method:'POST',data:{
    name:'Estudante',email:'student@example.test',password:'StrongPassword123!'
  }});
  await request('/api/waitlist',{method:'POST',data:applicant});
  assert.equal((await request('/api/admin/waitlist')).status,401);
  assert.equal((await request('/api/admin/waitlist',{cookie:student.cookie})).status,403);
  assert.equal((await request('/api/waitlist',{method:'POST',origin:'https://evil.test',data:applicant})).status,403);
  const id=(await request('/api/admin/waitlist',{cookie})).data.entries[0].id;
  assert.equal((await request('/api/admin/waitlist/'+id,{method:'DELETE',cookie:student.cookie})).status,403);
  assert.equal((await request('/api/admin/waitlist/'+id,{method:'DELETE',cookie})).status,200);
  assert.equal((await request('/api/admin/waitlist',{cookie})).data.total,0);
});
test('limita inscrições anônimas por endereço IP',async()=>{
  const request=await start();
  let throttled=false;
  for(let i=0;i<12;i++){
    const result=await request('/api/waitlist',{method:'POST',data:{...applicant,email:`lead${i}@example.test`}});
    if(result.status===429){throttled=true;break;}
  }
  assert.equal(throttled,true);
});
