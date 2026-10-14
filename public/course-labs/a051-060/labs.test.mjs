import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  plannedProcess, acceptsDocument, makeJwt, verifyJwt, pkcePair,
  verifyAuthorizationResponse, updateCase, reserveOnce, corsPolicy,
  securityHeaders, assessChain
} from './models.mjs';

test('051: allowlist chooses fixed executable and argument list, rejecting injected action', () => {
  assert.deepEqual(plannedProcess('health'), { executable: 'node', args: ['--version'], shell: false });
  assert.throws(() => plannedProcess('health; echo injected'), /AÇÃO_NÃO_PERMITIDA/);
  assert.throws(() => plannedProcess('--inspect'), /AÇÃO_NÃO_PERMITIDA/);
});

test('053: validates size, MIME, signature and derives name in isolated storage', () => {
  const gif = Buffer.from('GIF89a\x01\x00\x01\x00', 'latin1');
  const accepted = acceptsDocument({ name: 'avatar.gif', mime: 'image/gif', bytes: gif });
  assert.match(accepted.storageId, /^[0-9a-f-]{36}$/);
  assert.equal(accepted.contentType, 'image/gif');
  assert.throws(() => acceptsDocument({name:'attack.html',mime:'image/gif',bytes:gif}), /EXTENSÃO_NÃO_PERMITIDA/);
  assert.throws(() => acceptsDocument({name:'avatar.gif',mime:'image/gif',bytes:Buffer.from('not a gif')}), /ASSINATURA_INVÁLIDA/);
  assert.throws(() => acceptsDocument({name:'avatar.gif',mime:'image/gif',bytes:Buffer.alloc(1025)}), /TAMANHO_INVÁLIDO/);
});

test('054: cryptographic JWT validation, issuer, audience, expiry and alg restriction', () => {
  const key = Buffer.from('laboratorio-privado-32-bytes-123456789');
  const now = 1900000000;
  const good = makeJwt({sub:'aluno',iss:'https://issuer.local',aud:'api-demo',exp:now+60},key);
  assert.equal(verifyJwt(good,key,{iss:'https://issuer.local',aud:'api-demo',now}).sub,'aluno');
  const parts=good.split('.');
  const tampered=Buffer.from(JSON.stringify({...JSON.parse(Buffer.from(parts[1],'base64url').toString()),sub:'admin'})).toString('base64url');
  assert.throws(()=>verifyJwt(`${parts[0]}.${tampered}.${parts[2]}`,key,{iss:'https://issuer.local',aud:'api-demo',now}), /ASSINATURA_INVÁLIDA/);
  assert.throws(()=>verifyJwt(good,key,{iss:'https://issuer.local',aud:'api-outro',now}), /AUDIENCE_INVÁLIDA/);
  assert.throws(()=>verifyJwt(good,key,{iss:'https://issuer.local',aud:'api-demo',now:now+61}), /TOKEN_EXPIRADO/);
  const algNone=Buffer.from(JSON.stringify({alg:'none',typ:'JWT'})).toString('base64url');
  assert.throws(()=>verifyJwt(`${algNone}.${parts[1]}.${parts[2]}`,key,{iss:'https://issuer.local',aud:'api-demo',now}), /ALGORITMO_INVÁLIDO/);
});

test('055: PKCE S256 binding, callback state + iss and single-use transaction', () => {
  const pair=pkcePair(Buffer.alloc(32,7));
  assert.equal(pair.challenge,crypto.createHash('sha256').update(pair.verifier).digest('base64url'));
  const pending = {state:'s-transacao-1',issuer:'https://oidc.local',redirectUri:'https://app.local/callback',used:false};
  const valid=verifyAuthorizationResponse(pending,{state:'s-transacao-1',issuer:'https://oidc.local',code:'codigo-ficticio'});
  assert.equal(valid.used,true);
  assert.throws(()=>verifyAuthorizationResponse(valid,{state:'s-transacao-1',issuer:'https://oidc.local',code:'codigo-2'}),/REPLAY/);
  assert.throws(()=>verifyAuthorizationResponse(pending,{state:'s-intruso',issuer:'https://oidc.local',code:'codigo'}),/STATE_INVÁLIDO/);
  assert.throws(()=>verifyAuthorizationResponse(pending,{state:'s-transacao-1',issuer:'https://outro.local',code:'codigo'}),/ISSUER_INVÁLIDO/);
});

test('056: object + function + field policy each rejects a different permission bug', () => {
  const record={owner:'alice',description:'original',approved:false};
  assert.deepEqual(updateCase({actor:'alice',role:'user',object:record,patch:{description:'novo'}}),{owner:'alice',description:'novo',approved:false});
  assert.throws(()=>updateCase({actor:'bob',role:'user',object:record,patch:{description:'x'}}),/BOLA/);
  assert.throws(()=>updateCase({actor:'alice',role:'user',object:record,operation:'approve',patch:{}}),/BFLA/);
  assert.throws(()=>updateCase({actor:'alice',role:'user',object:record,patch:{approved:true}}),/MASS_ASSIGNMENT/);
});

test('057: idempotency key prevents duplicate reservation, invariant never negative', () => {
  const initial={stock:1,reservations:new Set()};
  const first=reserveOnce(initial,{key:'k1',count:1});
  assert.deepEqual({stock:first.stock,recorded:first.reservations.has('k1')},{stock:0,recorded:true});
  assert.strictEqual(reserveOnce(first,{key:'k1',count:1}),first);
  assert.throws(()=>reserveOnce(first,{key:'k2',count:1}),/SEM_ESTOQUE/);
  assert.throws(()=>reserveOnce(initial,{key:'k1',count:2}),/SEM_ESTOQUE/);
});

test('058: CORS reflection disallowed; credentials cannot use wildcard; preflight explicit', () => {
  const allowed=corsPolicy('https://app.local',true);
  assert.equal(allowed['access-control-allow-origin'],'https://app.local');
  assert.equal(allowed['access-control-allow-credentials'],'true');
  assert.match(allowed.vary, /Origin/);
  assert.deepEqual(corsPolicy('https://evil.local',true),{vary:'Origin'});
  assert.deepEqual(corsPolicy('null',true),{vary:'Origin'});
});

test('059: browser policy includes specific CSP, nosniff and no framed app; HSTS only with HTTPS', () => {
  const headers=securityHeaders(true);
  assert.match(headers['content-security-policy'],/default-src 'none'/);
  assert.match(headers['content-security-policy'],/frame-ancestors 'none'/);
  assert.equal(headers['x-content-type-options'],'nosniff');
  assert.ok(headers['strict-transport-security']);
  assert.equal(securityHeaders(false)['strict-transport-security'],undefined);
});

test('060: break first transition reduces reachability without assuming exploitation', () => {
  const chain=[{id:'public',next:'read',requires:'exposure'},{id:'read',next:'modify',requires:'authorization'},{id:'modify',next:'impact',requires:'unsafe_write'}];
  assert.deepEqual(assessChain(chain,new Set()),['public','read','modify','impact']);
  assert.deepEqual(assessChain(chain,new Set(['authorization'])),['public','read']);
  assert.deepEqual(assessChain(chain,new Set(['exposure'])),['public']);
});
