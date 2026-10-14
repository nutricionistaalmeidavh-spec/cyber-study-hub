// Laboratórios educativos: apenas dados simulados, sem serviços externos nem segredos reais.
import { randomBytes, timingSafeEqual, createHmac } from 'node:crypto';

export function describeRequest(method, target, headers = {}) {
  const normalized = method.toUpperCase();
  const u = new URL(target, 'http://127.0.0.1:3000');
  if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(normalized)) return {status: 405, error:'metodo_nao_suportado'};
  const idValues = u.searchParams.getAll('id');
  if(idValues.length > 1) return {status:400, error:'parametro_ambiguo'};
  return {status:200,method:normalized,path:u.pathname,id:idValues[0]??null,queryCount:[...u.searchParams].length,contentType:headers['content-type']??null};
}

const PERMISSIONS = Object.freeze({admin: new Set(['read','edit','delete']), reader:new Set(['read']), editor:new Set(['read','edit'])});
export function decision(user, resource, action) {
  if (!user) return {status:401, allowed:false, reason:'sem_identidade'};
  if (!resource || !PERMISSIONS[user.role]?.has(action)) return {status:403, allowed:false, reason:'acao_nao_autorizada'};
  if (user.role !== 'admin' && resource.ownerId !== user.id) return {status:403, allowed:false, reason:'objeto_alheio'};
  return {status:200, allowed:true, reason:'permitido'};
}

export function createSessionStore() {
  const store = new Map();
  return {
    issue(id, nowMs, ttlMs = 300000) {
      if (!id) throw Error('identidade_obrigatoria');
      const sid=randomBytes(24).toString('hex');
      store.set(sid,{id,until:nowMs+ttlMs});return sid;
    },
    lookup(sid, nowMs) {
      const session=store.get(sid);return session && nowMs < session.until ? session.id : null;
    },
    revoke(sid) {return store.delete(sid);}
  };
}

export function sessionCookieHeader(sid, isHttps=true) {
  if (!/^[a-f0-9]{48}$/.test(sid)) throw Error('id_invalido');
  return `__Host-sid=${sid}; Path=/; HttpOnly; SameSite=Lax${isHttps?'; Secure':''}`;
}

export function signCompactJwt(payload, secret) {
  if (!secret || secret.length < 16) throw Error('segredo_curto');
  const header=Buffer.from(JSON.stringify({typ:'JWT',alg:'HS256'})).toString('base64url');
  const body=Buffer.from(JSON.stringify(payload)).toString('base64url');
  const unsigned=`${header}.${body}`;
  return `${unsigned}.${createHmac('sha256',secret).update(unsigned).digest('base64url')}`;
}
export function verifyCompactJwt(token, secret, nowSec, requiredAudience='a-002-008') {
  if(typeof token !== 'string' || token.length > 4096) return null;
  const parts=token.split('.');if(parts.length!==3) return null;
  try {
    const header=JSON.parse(Buffer.from(parts[0],'base64url').toString());
    if(header.alg!=='HS256' || header.typ!=='JWT') return null;
    const sig=createHmac('sha256',secret).update(`${parts[0]}.${parts[1]}`).digest();
    const got=Buffer.from(parts[2],'base64url');
    if(sig.length!==got.length || !timingSafeEqual(sig,got))return null;
    const p=JSON.parse(Buffer.from(parts[1],'base64url').toString());
    if(typeof p.sub!=='string'|| !Number.isInteger(p.exp)|| nowSec>=p.exp||p.aud!==requiredAudience) return null;
    return p;
  } catch { return null; }
}

export function encodeHtmlText(s) {
  const replacements={ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
  return String(s).replace(/[&<>"']/g,ch=>replacements[ch]);
}

// Demonstra uma escolha insegura SEM executar entrada em browser:
export function explainDomSink(sink) {
  return sink==='textContent' ? 'texto_literal' : sink==='innerHTML' ? 'interpretacao_html' : 'desconhecido';
}
