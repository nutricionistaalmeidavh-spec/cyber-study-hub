// Modelos determinísticos e defensivos: sem rede, sem secrets, sem pacotes pagos.
// Estes modelos NÃO são substitutos de um template engine, servidor GraphQL, CDN ou navegador reais.
const fail = message => { throw new Error(message); };

export function renderGreeting(name) {
  if (typeof name !== 'string' || name.length > 100) fail('nome inválido');
  const escaped = name.replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  return 'Olá, ' + escaped + '!';
}

export function parsePreferences(json) {
  const obj = JSON.parse(json);
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) fail('formato inválido');
  const allowed = ['theme', 'locale'];
  for (const key of Object.keys(obj)) if (!allowed.includes(key)) fail('chave não permitida: ' + key);
  if (!['light', 'dark'].includes(obj.theme) || !['pt-BR', 'en-US'].includes(obj.locale))
    fail('valores fora do esquema');
  return { theme: obj.theme, locale: obj.locale };
}

export function resolveGraphqlProfile(viewer, target) {
  if (!viewer || !target || viewer.tenant !== target.tenant) fail('acesso negado');
  if (viewer.id !== target.id && viewer.role !== 'tenant-admin') fail('acesso negado');
  return { id: target.id, displayName: target.displayName };
}

export function authorizeWsMessage(session, message, now) {
  if (!session || session.revoked || now >= session.expiresAt) fail('sessão expirada');
  if (!message || message.action !== 'subscribe' || !Number.isInteger(message.roomId)) fail('mensagem inválida');
  if (session.tenant !== message.tenant || !session.rooms.includes(message.roomId)) fail('canal proibido');
  return { event: 'subscribed', roomId: message.roomId };
}

export function validateHttpFraming(pairs) {
  const headers = pairs.map(([k, v]) => [String(k).toLowerCase(), String(v).trim()]);
  const lengths = headers.filter(([k]) => k === 'content-length').map(([, v]) => v);
  const encodings = headers.filter(([k]) => k === 'transfer-encoding').map(([, v]) => v.toLowerCase());
  if (lengths.length > 1 || encodings.length > 1 || (lengths.length && encodings.length)) fail('framing ambíguo');
  if (lengths.length && (!/^(0|[1-9]\d*)$/.test(lengths[0]) || Number(lengths[0]) > 1048576))
    fail('content-length inválido');
  if (encodings.length && encodings[0] !== 'chunked') fail('transfer-encoding não suportado');
  return { accepted: true, mode: lengths.length ? 'length' : encodings.length ? 'chunked' : 'none' };
}

export function sharedAssetCache(req) {
  if (req.method !== 'GET' || req.authorization || req.cookie || !req.path.startsWith('/assets/'))
    return { cache: false, reason: 'bypass' };
  const locale = req.locale === 'en-US' ? 'en-US' : 'pt-BR';
  return { cache: true, key: '/assets:' + req.path + ':locale=' + locale };
}

export function cacheDeceptionPolicy(req, response) {
  const cc = String(response.cacheControl || '').toLowerCase();
  if (req.method !== 'GET' || req.cookie || req.authorization || !req.path.startsWith('/assets/'))
    return { cache: false, reason: 'contexto privado ou rota não pública' };
  if (!cc.includes('public') || cc.includes('private') || cc.includes('no-store'))
    return { cache: false, reason: 'diretiva sem permissão pública' };
  return { cache: true, reason: 'asset explicitamente público' };
}

export function safePreferencesMerge(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) fail('preferências inválidas');
  for (const key of Object.keys(data)) if (!['theme', 'density'].includes(key))
    fail('campo não permitido: ' + key);
  if (!['light', 'dark'].includes(data.theme) || !['compact', 'comfortable'].includes(data.density))
    fail('valores de preferência inválidos');
  const result = Object.create(null);
  result.theme = data.theme;
  result.density = data.density;
  return result;
}

export function resetLink(_requestHost, userId) {
  if (!/^[a-z0-9-]{1,32}$/.test(userId)) fail('id inválido');
  const url = new URL('/reset', 'https://accounts.example.test');
  url.searchParams.set('user', userId);
  return url.toString();
}

export function safeDomText(fragment) {
  if (typeof fragment !== 'string' || fragment.length > 200) fail('fragmento inválido');
  return { sink: 'textContent', value: fragment };
}

export function acceptPostMessage(origin, payload) {
  if (origin !== 'https://portal.example.test') fail('origem não autorizada');
  if (!payload || payload.type !== 'notice' || typeof payload.text !== 'string')
    fail('mensagem inválida');
  return safeDomText(payload.text);
}

function outcome(fn) { try { return fn(); } catch (e) { return { rejected: e.message }; } }

export function runLesson(id) {
  switch (id) {
    case 41: return { normal: renderGreeting('Ana'), hostile: renderGreeting('{{7*7}}'), html: renderGreeting('<b>Ana</b>') };
    case 42: return { normal: parsePreferences('{"theme":"dark","locale":"pt-BR"}'), hostile: outcome(() => parsePreferences('{"theme":"dark","locale":"pt-BR","role":"admin"}')) };
    case 43: {
      const target = { id: 'ana', tenant: 'escola-1', displayName: 'Ana' };
      return { normal: resolveGraphqlProfile({ id: 'ana', tenant: 'escola-1' }, target),
        hostile: outcome(() => resolveGraphqlProfile({ id: 'bia', tenant: 'escola-1' }, target)) };
    }
    case 44: {
      const session = { tenant: 'sala-1', rooms: [7], expiresAt: 100, revoked: false };
      return { normal: authorizeWsMessage(session, { action: 'subscribe', tenant: 'sala-1', roomId: 7 }, 50),
        hostile: outcome(() => authorizeWsMessage(session, { action: 'subscribe', tenant: 'sala-1', roomId: 7 }, 101)) };
    }
    case 45: return { normal: validateHttpFraming([['Content-Length', '5']]),
      hostile: outcome(() => validateHttpFraming([['Content-Length', '5'], ['Transfer-Encoding', 'chunked']])) };
    case 46: return { normal: sharedAssetCache({ method: 'GET', path: '/assets/help.css', locale: 'pt-BR' }),
      variant: sharedAssetCache({ method: 'GET', path: '/assets/help.css', locale: 'en-US' }),
      hostile: sharedAssetCache({ method: 'GET', path: '/account', cookie: 'session=example' }) };
    case 47: return { normal: cacheDeceptionPolicy({ method: 'GET', path: '/assets/app.css' }, { cacheControl: 'public, max-age=60' }),
      hostile: cacheDeceptionPolicy({ method: 'GET', path: '/account/profile.css', cookie: 'session=alice' }, { cacheControl: 'public, max-age=60' }) };
    case 48: return { normal: safePreferencesMerge({ theme: 'dark', density: 'compact' }),
      hostile: outcome(() => safePreferencesMerge(JSON.parse('{"theme":"dark","density":"compact","__proto__":{"isAdmin":true}}'))) };
    case 49: return { normal: resetLink('accounts.example.test', 'ana-1'), hostile: resetLink('external.example.test', 'ana-1') };
    case 50: return { normal: acceptPostMessage('https://portal.example.test', { type: 'notice', text: 'Olá' }),
      hostile: outcome(() => acceptPostMessage('https://outro.example.test', { type: 'notice', text: '<img>' })),
      text: safeDomText('<img src=x>') };
    default: fail('Aula fora do escopo 041–050');
  }
}
