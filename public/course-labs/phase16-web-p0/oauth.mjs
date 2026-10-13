import { randomBytes, createHash, generateKeyPairSync, sign, verify } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const b64 = bytes => Buffer.from(bytes).toString('base64url');
const challenge = verifier => createHash('sha256').update(verifier).digest('base64url');
const encode = obj => b64(JSON.stringify(obj));
const clientId = 'study-client', issuer = 'https://idp.example.invalid';
const redirectUri = 'http://127.0.0.1:3120/callback';

// Simulador in-process de protocolo: a assinatura RSA é real; não é um IdP publicável.
export function createLab(clock = () => Math.floor(Date.now() / 1000)) {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const codes = new Map(), accessTokens = new Map();
  function begin() {
    const verifier = randomBytes(32).toString('base64url');
    return { verifier, challenge: challenge(verifier), state: b64(randomBytes(24)), nonce: b64(randomBytes(24)), used: false };
  }
  function authorize(pending, requestedRedirect = redirectUri) {
    if (requestedRedirect !== redirectUri) throw new Error('REDIRECT_INVALIDO');
    const code = b64(randomBytes(24));
    codes.set(code, { clientId, redirectUri, challenge: pending.challenge, nonce: pending.nonce, sub: 'alice', exp: clock() + 60 });
    return { code, state: pending.state };
  }
  function exchange(code, verifier, requestedRedirect = redirectUri) {
    const grant = codes.get(code);
    if (!grant || grant.exp <= clock()) throw new Error('CODE_INVALIDO_OU_EXPIRADO');
    if (grant.redirectUri !== requestedRedirect || grant.clientId !== clientId) throw new Error('CLIENTE_REDIRECT_INVALIDO');
    if (typeof verifier !== 'string' || challenge(verifier) !== grant.challenge) throw new Error('PKCE_INVALIDO');
    codes.delete(code); // uso único; esta seção síncrona representa operação atômica.
    const header = encode({ alg: 'RS256', typ: 'JWT' });
    const payload = encode({ iss: issuer, aud: clientId, sub: grant.sub, nonce: grant.nonce, iat: clock(), exp: clock() + 300 });
    const unsigned = `${header}.${payload}`;
    const idToken = `${unsigned}.${sign('RSA-SHA256', Buffer.from(unsigned), privateKey).toString('base64url')}`;
    const accessToken = b64(randomBytes(32));
    accessTokens.set(accessToken, { sub: grant.sub, aud: 'study-api', exp: clock() + 300 });
    return { idToken, accessToken };
  }
  function validateIdToken(token, nonce) {
    if (typeof token !== 'string' || token.length > 4096) throw new Error('TOKEN_INVALIDO');
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('TOKEN_INVALIDO');
    const [h, p, s] = parts;
    const header = JSON.parse(Buffer.from(h, 'base64url').toString());
    if (header.alg !== 'RS256' || !verify('RSA-SHA256', Buffer.from(`${h}.${p}`), publicKey, Buffer.from(s, 'base64url'))) throw new Error('ASSINATURA_INVALIDA');
    const claims = JSON.parse(Buffer.from(p, 'base64url').toString());
    if (claims.iss !== issuer || claims.aud !== clientId || typeof claims.exp !== 'number' || claims.exp <= clock() || claims.sub !== 'alice') throw new Error('CLAIMS_INVALIDAS');
    if (typeof nonce !== 'string' || !nonce || claims.nonce !== nonce) throw new Error('NONCE_INVALIDO');
    return claims;
  }
  function callback(pending, response) {
    if (!pending || pending.used || typeof response?.state !== 'string' || !response.state || response.state !== pending.state) throw new Error('STATE_INVALIDO');
    const tokens = exchange(response.code, pending.verifier);
    const claims = validateIdToken(tokens.idToken, pending.nonce);
    pending.used = true;
    return { ...tokens, user: claims.sub };
  }
  function apiMe(token) {
    const grant = accessTokens.get(token);
    if (!grant || grant.aud !== 'study-api' || grant.exp <= clock()) throw new Error('ACCESS_TOKEN_INVALIDO');
    return { user: grant.sub };
  }
  return { begin, authorize, exchange, validateIdToken, callback, apiMe };
}
export function demo() {
  const lab = createLab(), pending = lab.begin(), response = lab.authorize(pending), result = lab.callback(pending, response);
  const rejected = {};
  for (const [name, action] of [
    ['replay', () => lab.exchange(response.code, pending.verifier)],
    ['id_token_na_api', () => lab.apiMe(result.idToken)],
    ['nonce_errado', () => lab.validateIdToken(result.idToken, 'outro')]
  ]) { try { action(); } catch (e) { rejected[name] = e.message; } }
  return { login: result.user, api: lab.apiMe(result.accessToken), rejected };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(demo());
