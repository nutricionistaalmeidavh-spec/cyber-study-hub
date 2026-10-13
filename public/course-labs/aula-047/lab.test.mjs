import test from 'node:test';
import assert from 'node:assert/strict';
import { createOrigin } from './origin.mjs';
import { createVulnerableProxy } from './proxy-vulneravel.mjs';
import { createFixedProxy } from './proxy-corrigido.mjs';
import { storageTtl, TimedCache } from './cache-policy.mjs';
async function serve(app) {
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  return { server, url: `http://127.0.0.1:${server.address().port}` };
}
test('duas identidades: reproducer antigo, reteste e público preservado', async () => {
  const origin = await serve(createOrigin());
  const vulnerable = await serve(createVulnerableProxy(origin.url));
  const fixed = await serve(createFixedProxy(origin.url));
  async function read(base, path, headers = {}) {
    const r = await fetch(base.url + path, { headers });
    return { body: await r.text(), cache: r.headers.get('X-Lab-Cache'), status: r.status };
  }
  try {
    const alice = await read(vulnerable, '/account/profile.css', { 'X-Lab-User': 'alice' });
    const bob = await read(vulnerable, '/account/profile.css', { 'X-Lab-User': 'bob' });
    assert.equal(alice.cache, 'MISS'); assert.equal(bob.cache, 'HIT'); assert.equal(JSON.parse(bob.body).user, 'alice');
    for (const user of ['alice', 'bob']) {
      const r = await read(fixed, '/account/profile.css', { 'X-Lab-User': user });
      assert.equal(r.cache, 'BYPASS'); assert.equal(JSON.parse(r.body).user, user);
    }
    assert.equal((await read(fixed, '/assets/app.css')).cache, 'MISS');
    assert.equal((await read(fixed, '/assets/app.css')).cache, 'HIT');
    for (const headers of [{ 'X-Lab-User': 'alice' }, { Cookie: 'session=ficticia' }, { Authorization: 'Bearer ficticio' }]) {
      assert.equal((await read(fixed, '/assets/app.css', headers)).cache, 'BYPASS');
    }
    assert.equal((await read(fixed, '/assets/inexistente.css')).cache, 'BYPASS');
  } finally {
    await Promise.all([vulnerable, fixed, origin].map(({ server }) => new Promise((resolve,reject) => server.close(e => e ? reject(e) : resolve()))));
  }
});
test('TTL, Age, resposta privada e Set-Cookie', () => {
  let now = 1000; const c = new TimedCache(() => now);
  c.put('k', { body: 'publico' }, 2000); now = 2000; assert.equal(c.get('k').age, 1);
  now = 3000; assert.equal(c.get('k'), null);
  const req = { method: 'GET', path: '/assets/app.css', headers: {} };
  const response = headers => ({ status: 200, headers: new Headers(headers) });
  assert.equal(storageTtl(req, response({ 'cache-control': 'public, max-age=60' })), 60000);
  assert.equal(storageTtl(req, response({ 'cache-control': 'PUBLIC, PRIVATE="user", max-age=60' })), 0);
  assert.equal(storageTtl(req, response({ 'cache-control': 'public, max-age=60', 'set-cookie': 'a=b' })), 0);
  assert.equal(storageTtl(req, response({ 'cache-control': 'public, max-age=60', vary: 'Accept-Language' })), 0);
});
