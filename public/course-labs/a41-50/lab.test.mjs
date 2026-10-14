import test from 'node:test';
import assert from 'node:assert/strict';
import {
  renderGreeting, parsePreferences, resolveGraphqlProfile, authorizeWsMessage,
  validateHttpFraming, sharedAssetCache, cacheDeceptionPolicy, safePreferencesMerge,
  resetLink, safeDomText, acceptPostMessage, runLesson
} from './models.mjs';

test('041: nome normal renderiza e expressão de template não executa', () => {
  assert.equal(renderGreeting('Ana'), 'Olá, Ana!');
  assert.equal(renderGreeting('{{7*7}}'), 'Olá, {{7*7}}!');
});
test('041: escape HTML preserva texto sem criar marcação', () => {
  assert.equal(renderGreeting('<b>'), 'Olá, &lt;b&gt;!');
  assert.throws(() => renderGreeting({}), /nome inválido/);
});
test('042: esquema JSON aceita apenas atributos e valores esperados', () => {
  assert.deepEqual(parsePreferences('{"theme":"dark","locale":"pt-BR"}'), { theme: 'dark', locale: 'pt-BR' });
  assert.throws(() => parsePreferences('{"theme":"dark","locale":"pt-BR","role":"admin"}'), /chave não permitida/);
});
test('042: rejeita propriedades especiais e tipos impróprios', () => {
  assert.throws(() => parsePreferences('{"theme":"light","locale":"pt-BR","__proto__":{}}'), /chave não permitida/);
  assert.throws(() => parsePreferences('{"theme":"dark","locale":42}'), /esquema/);
});
test('043: resolver só devolve projeção do próprio objeto', () => {
  const target = { id: 'ana', tenant: 'escola-1', displayName: 'Ana', secret: 'não retornar' };
  assert.deepEqual(resolveGraphqlProfile({ id: 'ana', tenant: 'escola-1' }, target), { id: 'ana', displayName: 'Ana' });
  assert.throws(() => resolveGraphqlProfile({ id: 'bia', tenant: 'escola-1' }, target), /negado/);
});
test('043: admin não atravessa tenants', () => {
  assert.throws(() => resolveGraphqlProfile({ id: 'x', tenant: 'escola-2', role: 'tenant-admin' }, { id: 'y', tenant: 'escola-1' }), /negado/);
});
test('044: autorização por mensagem válida após handshake', () => {
  const s = { tenant: 't1', rooms: [7], expiresAt: 100, revoked: false };
  assert.deepEqual(authorizeWsMessage(s, { action: 'subscribe', tenant: 't1', roomId: 7 }, 20), { event: 'subscribed', roomId: 7 });
  assert.throws(() => authorizeWsMessage(s, { action: 'subscribe', tenant: 't1', roomId: 8 }, 20), /proibido/);
});
test('044: sessão expirada ou revogada interrompe acesso', () => {
  const s = { tenant: 't1', rooms: [7], expiresAt: 100, revoked: false };
  assert.throws(() => authorizeWsMessage(s, { action: 'subscribe', tenant: 't1', roomId: 7 }, 100), /expirada/);
  assert.throws(() => authorizeWsMessage({ ...s, revoked: true }, { action: 'subscribe', tenant: 't1', roomId: 7 }, 10), /expirada/);
});
test('045: framing inequívoco aceita body limitado', () => {
  assert.equal(validateHttpFraming([['Content-Length', '5']]).mode, 'length');
  assert.equal(validateHttpFraming([['Transfer-Encoding', 'chunked']]).mode, 'chunked');
});
test('045: framing conflitante ou duplicado é rejeitado', () => {
  assert.throws(() => validateHttpFraming([['Content-Length', '5'], ['Transfer-Encoding', 'chunked']]), /ambíguo/);
  assert.throws(() => validateHttpFraming([['Content-Length', '5'], ['content-length', '7']]), /ambíguo/);
  assert.throws(() => validateHttpFraming([['Content-Length', '-4']]), /inválido/);
});
test('046: duas variantes de idioma têm cache keys distintas', () => {
  const a = sharedAssetCache({ method: 'GET', path: '/assets/help.css', locale: 'pt-BR' });
  const b = sharedAssetCache({ method: 'GET', path: '/assets/help.css', locale: 'en-US' });
  assert.equal(a.cache, true);
  assert.notEqual(a.key, b.key);
});
test('046: conteúdo privado não entra na cache key pública', () => {
  assert.equal(sharedAssetCache({ method: 'GET', path: '/account', cookie: 's=1' }).cache, false);
  assert.equal(sharedAssetCache({ method: 'POST', path: '/assets/help.css' }).cache, false);
});
test('047: resposta privada com sufixo CSS continua fora do cache compartilhado', () => {
  assert.equal(cacheDeceptionPolicy({ method: 'GET', path: '/account/profile.css', cookie: 'alice' }, { cacheControl: 'public' }).cache, false);
  assert.equal(cacheDeceptionPolicy({ method: 'GET', path: '/assets/app.css' }, { cacheControl: 'private' }).cache, false);
});
test('047: asset explicitamente público mantém cache útil', () => {
  assert.equal(cacheDeceptionPolicy({ method: 'GET', path: '/assets/app.css' }, { cacheControl: 'public, max-age=60' }).cache, true);
});
test('048: merge defensivo materializa apenas campos próprios permitidos', () => {
  const result = safePreferencesMerge({ theme: 'dark', density: 'compact' });
  assert.equal(Object.getPrototypeOf(result), null);
  assert.equal(result.theme, 'dark');
  assert.equal({}.isAdmin, undefined);
});
test('048: propriedade especial e campo arbitrário são rejeitados', () => {
  const malicious = JSON.parse('{"theme":"dark","density":"compact","__proto__":{"isAdmin":true}}');
  assert.throws(() => safePreferencesMerge(malicious), /não permitido/);
  assert.throws(() => safePreferencesMerge({ theme: 'dark', density: 'compact', role: 'admin' }), /não permitido/);
});
test('049: Host e Forwarded-Host fornecidos pelo cliente não alteram link absoluto', () => {
  assert.equal(resetLink('external.example.test', 'ana-1'), 'https://accounts.example.test/reset?user=ana-1');
  assert.equal(resetLink('accounts.example.test', 'ana-1'), 'https://accounts.example.test/reset?user=ana-1');
});
test('049: ID não validado é recusado', () => {
  assert.throws(() => resetLink('external.example.test', 'ana/../bob'), /id inválido/);
});
test('050: sink de texto preserva string como texto', () => {
  assert.deepEqual(safeDomText('<img src=x>'), { sink: 'textContent', value: '<img src=x>' });
  assert.throws(() => safeDomText({ html: '<img>' }), /inválido/);
});
test('050: postMessage somente de origem exata e payload previsto', () => {
  assert.deepEqual(acceptPostMessage('https://portal.example.test', { type: 'notice', text: 'Oi' }), { sink: 'textContent', value: 'Oi' });
  assert.throws(() => acceptPostMessage('https://portal.example.test.evil.test', { type: 'notice', text: 'Oi' }), /origem/);
});
test('todos os modelos têm cenário positivo e negativo verificável', () => {
  for (let id = 41; id <= 50; id++) {
    const output = runLesson(id);
    assert.ok(output.normal, 'Aula ' + id + ' sem controle legítimo');
    assert.ok(output.hostile, 'Aula ' + id + ' sem controle negativo');
  }
});
