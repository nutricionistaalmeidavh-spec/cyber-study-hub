import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { createServer } from 'node:http';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPlatformHandler } from './platform.mjs';

const sessions = [];
afterEach(async () => {
  while (sessions.length) {
    const { server, app, dir } = sessions.pop();
    await new Promise(resolve => server.close(resolve));
    app.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

async function start({ openRegistration = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'study-hub-auth-'));
  const origin = 'http://127.0.0.1';
  const app = createPlatformHandler({
    dbPath: join(dir, 'platform.db'),
    origin,
    bootstrapKey: 'this-is-a-one-time-secret-123456789',
    openRegistration
  });
  const server = createServer(app.handle);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const endpoint = 'http://127.0.0.1:' + server.address().port;
  sessions.push({ server, app, dir });
  const request = async (path, { method = 'GET', data, cookie, originHeader = origin } = {}) => {
    const response = await fetch(endpoint + path, {
      method,
      headers: {
        ...(data !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(method !== 'GET' ? { Origin: originHeader } : {}),
        ...(cookie ? { Cookie: cookie } : {})
      },
      ...(data !== undefined ? { body: JSON.stringify(data) } : {})
    });
    const payload = await response.json();
    return { status: response.status, payload, cookie: response.headers.get('set-cookie')?.split(';')[0] ?? '' };
  };
  return request;
}

const admin = { name: 'Admin Demo', email: 'admin@example.test', password: 'GoodPassword1234!' };
async function boot(request) {
  const created = await request('/api/auth/bootstrap', {
    method: 'POST',
    data: { ...admin, bootstrapKey: 'this-is-a-one-time-secret-123456789' }
  });
  assert.equal(created.status, 201);
  assert.equal(created.payload.user.role, 'admin');
  return created.cookie;
}

test('setup is fail-closed, one-use, and requires bootstrap key', async () => {
  const request = await start();
  assert.equal((await request('/api/auth/bootstrap', { method: 'POST', data: { ...admin, bootstrapKey: 'wrong' } })).status, 403);
  await boot(request);
  assert.equal((await request('/api/auth/bootstrap', { method: 'POST', data: { ...admin, bootstrapKey: 'this-is-a-one-time-secret-123456789' } })).status, 409);
});

test('secure cookie session: unauthenticated denied, login works, logout revokes', async () => {
  const request = await start();
  assert.equal((await request('/api/me')).status, 401);
  await boot(request);
  assert.equal((await request('/api/auth/login', { method: 'POST', data: { email: admin.email, password: 'incorrect' } })).status, 401);
  const login = await request('/api/auth/login', { method: 'POST', data: { email: admin.email, password: admin.password } });
  assert.equal(login.status, 200);
  assert.match(login.cookie, /^hub_session=/);
  assert.equal((await request('/api/me', { cookie: login.cookie })).payload.user.email, admin.email);
  assert.equal((await request('/api/auth/logout', { method: 'POST', cookie: login.cookie })).status, 200);
  assert.equal((await request('/api/me', { cookie: login.cookie })).status, 401);
});

test('o administrador pode fechar o cadastro e exigir convite (opt-out)', async () => {
  const request = await start({openRegistration:false});
  const adminCookie = await boot(request);
  assert.equal((await request('/api/auth/register', { method: 'POST', data: { name:'No Invite', email:'x@example.test', password:'GoodPassword1234!' } })).status, 403);
  const inv = await request('/api/admin/invitations', { method:'POST', cookie:adminCookie, data:{ email:'student@example.test',role:'student' } });
  assert.equal(inv.status, 201);
  const student = await request('/api/auth/register', { method:'POST', data:{ name:'Student', password:'GoodPassword1234!', inviteToken:inv.payload.token } });
  assert.equal(student.status, 201);
  assert.equal(student.payload.user.role, 'student');
  assert.equal((await request('/api/auth/register', { method:'POST', data:{ name:'Again', password:'GoodPassword1234!', inviteToken:inv.payload.token } })).status, 403);
});

test('admin-only actions enforce RBAC, users cannot read another user state', async () => {
  const request = await start();
  const adminCookie = await boot(request);
  const inv = await request('/api/admin/invitations', { method:'POST', cookie:adminCookie, data:{ email:'student@example.test',role:'student' } });
  const student = await request('/api/auth/register', { method:'POST', data:{ name:'Student', password:'GoodPassword1234!', inviteToken:inv.payload.token } });
  assert.equal((await request('/api/admin/users', { cookie:student.cookie })).status, 403);
  const key = 'cyber-study-lessons-v1';
  assert.equal((await request('/api/me/state', { method:'PUT', cookie:student.cookie, data:{ key, value:'{"47":{"completed":true}}' } })).status, 200);
  assert.equal((await request('/api/me/state', { cookie:adminCookie })).payload.state[key], undefined);
  assert.equal((await request('/api/me/state', { cookie:student.cookie })).payload.state[key], '{"47":{"completed":true}}');
  assert.equal((await request('/api/admin/users', { cookie:adminCookie })).payload.users.length, 2);
  assert.equal((await request('/api/admin/users/' + student.payload.user.id, { method:'PATCH', cookie:adminCookie, data:{ status:'suspended' } })).status, 200);
  assert.equal((await request('/api/me', { cookie:student.cookie })).status, 401);
});

test('reject forged origins, weak passwords and invalid progress keys', async () => {
  const request = await start({openRegistration:true});
  await boot(request);
  assert.equal((await request('/api/auth/register', { method:'POST', data:{ name:'Test', email:'bad@example.test', password:'abc' } })).status, 400);
  assert.equal((await request('/api/auth/login', { method:'POST', originHeader:'https://evil.test', data:{ email:admin.email, password:admin.password } })).status, 403);
  const login = await request('/api/auth/login', { method:'POST', data:{ email:admin.email, password:admin.password } });
  assert.equal((await request('/api/me/state', { method:'PUT', cookie:login.cookie, data:{key:'another-key',value:'{}'} })).status, 400);
});

test('removing a progress key deletes only that user state',async()=>{
  const request=await start();
  const cookie=await boot(request);
  const key='cyber-study-learning-v2';
  assert.equal((await request('/api/me/state',{method:'PUT',cookie,data:{key,value:'{"1":{"completed":true}}'}})).status,200);
  assert.equal((await request('/api/me/state',{method:'DELETE',cookie,data:{key}})).status,200);
  assert.equal((await request('/api/me/state',{cookie})).payload.state[key],undefined);
});


test('HTTP course payload: unauthorized, granted, revoked and subscription scenarios',async()=>{
  const request=await start({openRegistration:true});
  const adminCookie=await boot(request);
  const student=await request('/api/auth/register',{method:'POST',data:{name:'Aluno Teste',email:'curso-aluno@example.test',password:'GoodPassword1234!'}});
  assert.equal(student.status,201);
  const lesson='/api/content/lesson/43';
  assert.equal((await request(lesson)).status,401);
  assert.equal((await request(lesson,{cookie:student.cookie})).status,403);
  assert.equal((await request(lesson,{cookie:adminCookie})).payload.lesson.id,43);
  assert.equal((await request('/api/content/trail/ai-dev',{cookie:student.cookie})).status,403);
  assert.equal((await request('/api/content/games',{cookie:student.cookie})).status,403);
  const userId=student.payload.user.id;
  assert.equal((await request('/api/admin/access/grants',{method:'POST',cookie:adminCookie,data:{userId,courseId:'trilha-aplicacoes-cloud-ia'}})).status,200);
  const opened=await request(lesson,{cookie:student.cookie});
  assert.equal(opened.status,200);
  assert.equal(opened.payload.kind,'legacy');
  assert.equal(opened.payload.lesson.id,43);
  assert.equal((await request('/api/content/lesson/47',{cookie:student.cookie})).payload.kind,'native');
  assert.equal((await request('/api/content/trail/ai-dev',{cookie:student.cookie})).status,403);
  assert.equal((await request('/api/admin/access/grants',{method:'DELETE',cookie:adminCookie,data:{userId,courseId:'trilha-aplicacoes-cloud-ia'}})).status,200);
  assert.equal((await request(lesson,{cookie:student.cookie})).status,403);
  assert.equal((await request('/api/admin/access/subscriptions',{method:'POST',cookie:adminCookie,data:{userId,validDays:30}})).status,200);
  assert.equal((await request('/api/content/trail/channel-dark',{cookie:student.cookie})).payload.modules.length,8);
  assert.equal((await request('/api/content/games',{cookie:student.cookie})).payload.reviewPacks.length,9);
  assert.equal((await request('/api/admin/access/subscriptions',{method:'DELETE',cookie:adminCookie,data:{userId}})).status,200);
  assert.equal((await request('/api/content/trail/channel-dark',{cookie:student.cookie})).status,403);
});

test('cadastro público cria somente estudante e não exige convite nem código de e-mail',async()=>{
 const request=await start();
 assert.deepEqual((await request('/api/auth/config')).payload,{ready:false,openRegistration:true});
 assert.equal((await request('/api/auth/register',{method:'POST',data:{name:'Intruso',email:'unconfigured@example.test',password:'GoodPassword1234!'}})).status,403);
 const rootCookie=await boot(request);
 assert.equal((await request('/api/auth/config')).payload.openRegistration,true);
 const signup=await request('/api/auth/register',{method:'POST',data:{
   name:'Estudante novo',email:'novo-aluno@example.test',password:'GoodPassword1234!',role:'admin'
 }});
 assert.equal(signup.status,201);
 assert.equal(signup.payload.user.role,'student');
 assert.equal(signup.payload.user.email,'novo-aluno@example.test');
 assert.match(signup.cookie,/hub_session=/);
 assert.equal((await request('/api/me',{cookie:signup.cookie})).payload.user.role,'student');
 assert.deepEqual((await request('/api/access/me',{cookie:signup.cookie})).payload.courseIds,[]);
 assert.equal((await request('/api/admin/users',{cookie:signup.cookie})).status,403);
 assert.equal((await request('/api/auth/register',{method:'POST',data:{
   name:'Duplicado',email:'NOVO-ALUNO@EXAMPLE.TEST',password:'GoodPassword1234!'
 }})).status,409);
 assert.equal((await request('/api/admin/users',{cookie:rootCookie})).payload.users.length,2);
});

test('público não cria professor; convite administrativo continua autorizando apenas a função definida',async()=>{
 const request=await start();
 const adminCookie=await boot(request);
 const forged=await request('/api/auth/register',{method:'POST',data:{
   name:'Tentativa',email:'fake@academy.example',password:'GoodPassword1234!',role:'teacher',status:'active'
 }});
 assert.equal(forged.status,201);
 assert.equal(forged.payload.user.role,'student');
 assert.equal((await request('/api/admin/invitations',{method:'POST',cookie:forged.cookie,data:{email:'x@example.test',role:'admin'}})).status,403);
 const invite=await request('/api/admin/invitations',{method:'POST',cookie:adminCookie,data:{email:'prof@example.test',role:'teacher'}});
 assert.equal(invite.status,201);
 const teacher=await request('/api/auth/register',{method:'POST',data:{name:'Professor',password:'GoodPassword1234!',inviteToken:invite.payload.token,email:'other@example.test',role:'admin'}});
 assert.equal(teacher.status,201);
 assert.equal(teacher.payload.user.role,'teacher');
 assert.equal(teacher.payload.user.email,'prof@example.test');
 assert.equal((await request('/api/auth/register',{method:'POST',data:{
  name:'Intruso',email:'another@example.test',password:'GoodPassword1234!',inviteToken:'X'.repeat(32)
 }})).status,403);
});

test('cadastro aberto limita tentativas por IP sem alterar login do administrador',async()=>{
 const request=await start();
 const adminCookie=await boot(request);
 for(let i=0;i<10;i++){
  const created=await request('/api/auth/register',{method:'POST',data:{
   name:'Aluno '+i,email:'signup'+i+'@example.test',password:'GoodPassword1234!'
  }});
  assert.equal(created.status,201,'cadastro '+i);
 }
 const denied=await request('/api/auth/register',{method:'POST',data:{
  name:'Excesso',email:'too-many@example.test',password:'GoodPassword1234!'
 }});
 assert.equal(denied.status,429);
 assert.equal((await request('/api/me',{cookie:adminCookie})).status,200);
});
