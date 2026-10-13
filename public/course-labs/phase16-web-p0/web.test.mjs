import test from 'node:test';
import assert from 'node:assert/strict';
import { register, authenticate, validatePassword } from './passwords.mjs';
import { issueSession, legacyAccepts, validCsrf, changeEmail } from './csrf.mjs';
import { experiment as ssrf } from './ssrf.mjs';
import { experiment as paths } from './paths.mjs';
import { createLab } from './oauth.mjs';
import { demo as csrfHttp } from './csrf-http.mjs';

test('CSRF por HTTP real: cookie mantém identidade, token permite alteração', async () => {
  assert.deepEqual(await csrfHttp(), { session: 201, absent: 403, unchanged: 'alice@example.invalid', accepted: 200, changed: 'novo@example.invalid' });
});

test('bcrypt: salts independentes, senha correta/incorreta e limite UTF-8', async () => {
  const a = await register('senha fictícia'), b = await register('senha fictícia');
  assert.notEqual(a, b); assert.equal(await authenticate('senha fictícia', a), true);
  assert.equal(await authenticate('incorreta', a), false);
  assert.equal(validatePassword('é'.repeat(36)).length, 36);
  assert.throws(() => validatePassword('é'.repeat(37)), /72_BYTES/);
});
test('CSRF: ausente/errado/outra sessão não alteram estado; legítimo funciona', () => {
  assert.equal(legacyAccepts(undefined, undefined), true);
  assert.equal(validCsrf(undefined, undefined), false);
  const alice = issueSession('alice'), bob = issueSession('bob');
  for (const token of [undefined, '', 'z'.repeat(64), bob.csrfToken]) {
    assert.equal(changeEmail(alice, { csrfToken: token, email: 'novo@example.invalid' }).status, 403);
    assert.equal(alice.email, 'alice@example.invalid');
  }
  assert.equal(changeEmail(null, {}).status, 401);
  assert.equal(changeEmail(alice, { csrfToken: alice.csrfToken, email: 'novo@example.invalid' }).status, 200);
  assert.equal(alice.email, 'novo@example.invalid');
});
test('SSRF: redirect cruza fronteira antiga; correção preserva recurso público sem hits internos', async () => {
  const r = await ssrf();
  assert.equal(r.happy, 'CATALOGO_PUBLICO'); assert.equal(r.legacy, 'DADO_INTERNO_FICTICIO');
  assert.equal(r.redirectDenied, true); assert.equal(r.arbitraryDenied, true);
  assert.equal(r.internalHits, 1); assert.equal(r.internalHitsAfterFix, 0);
});
test('paths: symlink ilude normalização; realpath rejeita saída e preserva arquivo legítimo', async () => {
  const r = await paths();
  assert.equal(r.happy, 'RELATORIO_PUBLICO'); assert.equal(r.legacy, 'DADO_EXTERNO_FICTICIO');
  assert.deepEqual(r.rejected.map(x => x.reason), ['FORA_DA_RAIZ', 'FORA_DA_RAIZ', 'FORA_DA_RAIZ', 'NOME_INVALIDO']);
});
test('OAuth/OIDC: PKCE, state, nonce, uso único, assinatura e finalidade dos tokens', () => {
  let now = 1000; const l = createLab(() => now), p = l.begin(), response = l.authorize(p);
  assert.throws(() => l.authorize(p, 'http://127.0.0.1:3120/callback/extra'), /REDIRECT_INVALIDO/);
  assert.throws(() => l.callback(p, { code: response.code }), /STATE_INVALIDO/);
  assert.throws(() => l.callback(p, { ...response, state: 'outro' }), /STATE_INVALIDO/);
  assert.throws(() => l.exchange(response.code, 'verifier-incorreto'), /PKCE_INVALIDO/);
  const r = l.callback(p, response); assert.equal(r.user, 'alice');
  assert.deepEqual(l.apiMe(r.accessToken), { user: 'alice' });
  assert.throws(() => l.apiMe(r.idToken), /ACCESS_TOKEN_INVALIDO/);
  assert.throws(() => l.exchange(response.code, p.verifier), /CODE_INVALIDO/);
  assert.throws(() => l.validateIdToken(r.idToken, 'outro'), /NONCE_INVALIDO/);
  const [h, encoded, s] = r.idToken.split('.');
  const changed = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(encoded, 'base64url')), sub: 'bob' })).toString('base64url');
  assert.throws(() => l.validateIdToken(`${h}.${changed}.${s}`, p.nonce), /ASSINATURA_INVALIDA/);
  now = 1300; assert.throws(() => l.validateIdToken(r.idToken, p.nonce), /CLAIMS_INVALIDAS/);
  assert.throws(() => l.apiMe(r.accessToken), /ACCESS_TOKEN_INVALIDO/);
});
