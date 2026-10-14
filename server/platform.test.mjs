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

async function start({ openRegistration = false, bootstrapKey = 'this-is-a-one-time-secret-123456789' } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'study-hub-auth-'));
  const origin = 'http://127.0.0.1';
  const app = createPlatformHandler({
    dbPath: join(dir, 'platform.db'),
    origin,
    bootstrapKey,
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

test('registration is invite-only by default and new accounts are students', async () => {
  const request = await start();
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

test('an exactly matching, shorter installed key can bootstrap once', async () => {
  const shortKey='ShortK_1234';
  const request=await start({bootstrapKey:shortKey});
  assert.equal((await request('/api/auth/config')).payload.bootstrapConfigured,true);
  const created=await request('/api/auth/bootstrap',{
    method:'POST',data:{...admin,bootstrapKey:shortKey}
  });
  assert.equal(created.status,201);
  assert.equal((await request('/api/auth/bootstrap',{
    method:'POST',data:{...admin,bootstrapKey:shortKey}
  })).status,409);
});
