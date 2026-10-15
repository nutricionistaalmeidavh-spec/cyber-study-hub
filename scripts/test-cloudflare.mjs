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
  assert.equal((await request('/api/content/lesson/43',{cookie:student.cookie})).status,403);
  assert.equal((await request('/api/content/lesson/43',{cookie:created.cookie})).payload.lesson.id,43);
  assert.equal((await request('/api/content/trail/ai-dev',{cookie:student.cookie})).status,403);
  assert.equal((await request('/api/admin/access/grants',{method:'POST',cookie:created.cookie,body:{userId:student.payload.user.id,courseId:'web-apis'}})).status,200);
  assert.equal((await request('/api/content/lesson/43',{cookie:student.cookie})).payload.kind,'legacy');
  assert.equal((await request('/api/content/trail/ai-dev',{cookie:student.cookie})).status,403);
  assert.equal((await request('/api/admin/access/grants',{method:'DELETE',cookie:created.cookie,body:{userId:student.payload.user.id,courseId:'web-apis'}})).status,200);
  assert.equal((await request('/api/content/lesson/43',{cookie:student.cookie})).status,403);
  assert.equal(student.payload.user.role,'student');
  assert.equal((await request('/api/auth/register',{method:'POST',
    body:{name:'Replay',password:'GoodPassword1234!',inviteToken:invitation.payload.token}})).status,403);
  assert.equal((await request('/api/admin/users',{cookie:student.cookie})).status,403);
  assert.equal((await request('/api/admin/users',{cookie:created.cookie})).payload.users.length,2);
  // P0/P1 feedback contract exercised against the real local Cloudflare Worker.
  const report={clientNonce:'f33d90a1-2cef-4b3a-894a-7c17608edfad',category:'bug',
    title:'Falha ao carregar vídeo',description:'A tela da aula permanece em branco após iniciar.',
    contextPath:'#course/main/047',contextLabel:'Aula principal 047'};
  assert.equal((await request('/api/feedback',{cookie:student.cookie})).status,200);
  const createdFeedback=await request('/api/feedback',{method:'POST',cookie:student.cookie,body:report});
  assert.equal(createdFeedback.status,201,createdFeedback.text);
  const feedbackId=createdFeedback.payload.feedback.id;
  assert.equal((await request('/api/feedback',{method:'POST',cookie:student.cookie,body:report})).payload.feedback.id,feedbackId);
  assert.equal((await request('/api/admin/feedback',{cookie:student.cookie})).status,403);
  assert.equal((await request('/api/admin/feedback',{cookie:created.cookie})).payload.total,1);
  const change=await request('/api/admin/feedback/'+feedbackId,{method:'PATCH',cookie:created.cookie,body:{status:'in_review',priority:'high'}});
  assert.equal(change.status,200,change.text);
  const answer=await request('/api/feedback/'+feedbackId+'/messages',{method:'POST',cookie:created.cookie,body:{body:'Investigação iniciada.'}});
  assert.equal(answer.status,201,answer.text);
  assert.equal((await request('/api/feedback',{cookie:student.cookie})).payload.feedback[0].hasUpdates,1);
  const feedbackDetail=await request('/api/feedback/'+feedbackId,{cookie:student.cookie});
  assert.equal(feedbackDetail.payload.messages[0].body,'Investigação iniciada.');
  assert.equal((await request('/api/feedback',{cookie:student.cookie})).payload.feedback[0].hasUpdates,0);
  // P2: verify the real Cloudflare Worker, not only self-hosted SQLite.
  assert.equal((await request('/api/roadmap')).payload.ideas.length,0);
  const suggested=await request('/api/feedback',{method:'POST',cookie:student.cookie,body:{
    clientNonce:'f83e0c9a-1d5b-48df-8f26-b9cd635d0b36',category:'idea',title:'Exercícios offline',
    description:'Gostaria de usar os exercícios quando estiver sem internet.',
    contextPath:'#lessons',contextLabel:'Aulas'
  }});
  assert.equal(suggested.status,201,suggested.text);
  const published=await request('/api/admin/feedback/'+suggested.payload.feedback.id+'/publish',{
    method:'POST',cookie:created.cookie,body:{title:'Exercícios disponíveis offline',summary:'Estudar exercícios sem conexão será mais simples.',stage:'planned'}
  });
  assert.equal(published.status,201,published.text);
  const ideaId=published.payload.idea.id;
  const publicRoadmap=await request('/api/roadmap');
  assert.equal(publicRoadmap.payload.ideas.length,1);
  assert.equal(publicRoadmap.payload.ideas[0].votes,0);
  assert.equal(JSON.stringify(publicRoadmap.payload).includes('student@example.test'),false);
  assert.equal((await request('/api/roadmap/ideas/'+ideaId+'/vote',{method:'POST'})).status,401);
  assert.equal((await request('/api/roadmap/ideas/'+ideaId+'/vote',{method:'POST',cookie:student.cookie})).payload.votes,1);
  assert.equal((await request('/api/roadmap/ideas/'+ideaId+'/vote',{method:'POST',cookie:student.cookie})).payload.votes,1);
  assert.equal((await request('/api/roadmap/ideas/'+ideaId+'/vote',{method:'DELETE',cookie:student.cookie})).payload.votes,0);
  assert.equal((await request('/api/admin/roadmap/ideas/'+ideaId,{method:'PATCH',cookie:student.cookie,body:{stage:'in_progress'}})).status,403);
  const release=await request('/api/admin/roadmap/releases',{method:'POST',cookie:created.cookie,body:{
    feedbackId:suggested.payload.feedback.id,title:'Prática offline liberada',
    summary:'Material para praticar sem internet disponibilizado.',clientNonce:'a33e11a9-c26d-48d9-a108-b976204b1eea'
  }});
  assert.equal(release.status,201,release.text);
  const repeatRelease=await request('/api/admin/roadmap/releases',{method:'POST',cookie:created.cookie,body:{
    feedbackId:suggested.payload.feedback.id,title:'Prática offline liberada',
    summary:'Material para praticar sem internet disponibilizado.',clientNonce:'a33e11a9-c26d-48d9-a108-b976204b1eea'
  }});
  assert.equal(repeatRelease.status,200,repeatRelease.text);
  assert.equal((await request('/api/roadmap')).payload.releases.length,1);
  assert.equal((await request('/api/roadmap')).payload.ideas[0].stage,'released');
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
