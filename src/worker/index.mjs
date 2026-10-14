import { DurableObject } from 'cloudflare:workers';
import { passwordHash, passwordMatches } from './password-kdf.mjs';

const DAY = 86400000;
const KEYS = new Set([
  'cyber-study-lessons-v1','cyber-study-games-v1','cyber-study-recent-items-v1',
  'cyber-study-labs-v1','cyber-study-learning-v2','cyber-study-learning-v2-migration',
  'cyber-study-concept-mastery-v1','cyber-study-active-parallel-tracks-v1','cyber-study-fsrs-v1'
]);
const enc = new TextEncoder();
const hex = bytes => [...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,'0')).join('');
const bytes = value => Uint8Array.from(value.match(/.{2}/g).map(n=>parseInt(n,16)));
const sha = async value => hex(await crypto.subtle.digest('SHA-256',enc.encode(value)));
const emailOf = value => typeof value==='string'?value.trim().toLowerCase():'';
const validEmail = value => value.length<=254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const safeUser = u => ({id:u.id,email:u.email,name:u.name,role:u.role,status:u.status,createdAt:u.created_at});
const rand = () => crypto.randomUUID();
const randomToken = () => {
  const b=new Uint8Array(32);
  crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
};
class ApiError extends Error { constructor(status,message){super(message);this.status=status;} }
function checkPassword(value){
  if(typeof value!=='string'||value.length<12||value.length>128)
    throw new ApiError(400,'A senha precisa ter entre 12 e 128 caracteres.');
}
function response(status,payload,headers={}){
  return new Response(JSON.stringify(payload),{status,headers:{
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers
  }});
}
async function jsonBody(request){
  if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')??''))
    throw new ApiError(415,'Envie JSON.');
  if(Number(request.headers.get('content-length')||0)>200000)
    throw new ApiError(413,'Solicitação muito grande.');
  const text=await request.text();
  if(text.length>200000)throw new ApiError(413,'Solicitação muito grande.');
  try{
    const value=JSON.parse(text);
    if(!value||typeof value!=='object'||Array.isArray(value))throw Error();
    return value;
  }catch{throw new ApiError(400,'JSON inválido.');}
}
function cookie(token,secure,expired=false){
  return 'hub_session='+(expired?'':encodeURIComponent(token))+
    '; Path=/; HttpOnly; SameSite=Lax'+(secure?'; Secure':'')+
    (expired?'; Max-Age=0':'; Max-Age=604800');
}
function requestToken(request){
  const found=(request.headers.get('cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('hub_session='));
  if(!found)return '';
  try{return decodeURIComponent(found.slice('hub_session='.length));}catch{return '';}
}
export class HubAuthObject extends DurableObject {
  constructor(ctx,env){
    super(ctx,env);
    this.sql=ctx.storage.sql;
    for(const ddl of [
      "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('admin','teacher','student')),status TEXT NOT NULL DEFAULT 'active',password_hash TEXT NOT NULL,created_at TEXT NOT NULL)",
      "CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL,expires_at INTEGER NOT NULL)",
      "CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id)",
      "CREATE TABLE IF NOT EXISTS invitations (token_hash TEXT PRIMARY KEY,email TEXT NOT NULL,role TEXT NOT NULL,expires_at INTEGER NOT NULL,used_at INTEGER)",
      "CREATE TABLE IF NOT EXISTS login_attempts (key TEXT PRIMARY KEY,count INTEGER NOT NULL,reset_at INTEGER NOT NULL)",
      "CREATE TABLE IF NOT EXISTS user_state (user_id TEXT NOT NULL,key TEXT NOT NULL,value TEXT NOT NULL,updated_at TEXT NOT NULL,PRIMARY KEY(user_id,key))"
    ])this.sql.exec(ddl);
  }
  one(sql,...args){return this.sql.exec(sql,...args).toArray()[0];}
  all(sql,...args){return this.sql.exec(sql,...args).toArray();}
  async authenticated(request){
    const token=requestToken(request);
    if(!token||token.length>200)return null;
    return this.one("SELECT u.id,u.email,u.name,u.role,u.status,u.created_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status='active'",
      await sha(token),Date.now())||null;
  }
  async requireUser(request){
    const user=await this.authenticated(request);
    if(!user)throw new ApiError(401,'Faça login para continuar.');
    return user;
  }
  async requireAdmin(request){
    const user=await this.requireUser(request);
    if(user.role!=='admin')throw new ApiError(403,'Acesso exclusivo da administração.');
    return user;
  }
  async newUser({name,email,role,password},guard=null){
    const mail=emailOf(email);
    if(!validEmail(mail))throw new ApiError(400,'E-mail inválido.');
    if(typeof name!=='string'||name.trim().length<2||name.trim().length>100)
      throw new ApiError(400,'Nome inválido.');
    if(!['admin','teacher','student'].includes(role))throw new ApiError(400,'Perfil inválido.');
    const digest=await passwordHash(password);
    const u={id:rand(),email:mail,name:name.trim(),role,status:'active',created_at:new Date().toISOString()};
    // Race-free account creation: after asynchronous password hashing, guard and insert are synchronous.
    if(guard)guard();
    try{
      this.sql.exec('INSERT INTO users(id,email,name,role,status,password_hash,created_at) VALUES(?,?,?,?,?,?,?)',
        u.id,u.email,u.name,u.role,u.status,digest,u.created_at);
    }catch(err){
      if(String(err).includes('UNIQUE'))throw new ApiError(409,'E-mail já cadastrado.');
      throw err;
    }
    return u;
  }
  async startSession(u,secure,status=200){
    const token=randomToken();
    this.sql.exec('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)',
      await sha(token),u.id,Date.now()+7*DAY);
    return response(status,{user:safeUser(u)},{'Set-Cookie':cookie(token,secure)});
  }
  async fetch(request){
    try{
      const url=new URL(request.url),path=url.pathname,method=request.method,secure=url.protocol==='https:';
      if(method!=='GET'&&method!=='HEAD'&&request.headers.get('origin')!==url.origin)
        throw new ApiError(403,'Origem não permitida.');
      if(path==='/api/health'&&method==='GET')return response(200,{ok:true});
      if(path==='/api/auth/config'&&method==='GET')
        return response(200,{ready:this.one('SELECT COUNT(*) AS n FROM users').n>0,
          openRegistration:this.env.HUB_OPEN_REGISTRATION==='1'});
      if(path==='/api/auth/bootstrap'&&method==='POST'){
        const b=await jsonBody(request);
        if(this.one('SELECT COUNT(*) AS n FROM users').n)throw new ApiError(409,'Plataforma já inicializada.');
        const expected=this.env.HUB_BOOTSTRAP_KEY;
        if(typeof expected!=='string'||!expected.length)
          throw new ApiError(503,'Chave de instalação não configurada neste Worker.');
        const attemptKey=await sha('bootstrap:'+String(request.headers.get('cf-connecting-ip')||'unknown'));
        const previous=this.one('SELECT count,reset_at FROM login_attempts WHERE key=?',attemptKey);
        if(previous&&previous.reset_at>Date.now()&&previous.count>=5)
          throw new ApiError(429,'Muitas tentativas. Aguarde 15 minutos.');
        const candidate=typeof b.bootstrapKey==='string'&&b.bootstrapKey.length<=512?b.bootstrapKey:'';
        const wanted=await sha(expected),received=await sha(candidate);
        let mismatch=0;
        for(let i=0;i<wanted.length;i++)mismatch|=wanted.charCodeAt(i)^received.charCodeAt(i);
        if(!candidate||mismatch){
          const active=previous&&previous.reset_at>Date.now();
          this.sql.exec('INSERT INTO login_attempts(key,count,reset_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,reset_at=excluded.reset_at',
            attemptKey,active?previous.count+1:1,active?previous.reset_at:Date.now()+900000);
          throw new ApiError(403,'Chave de instalação inválida.');
        }
        this.sql.exec('DELETE FROM login_attempts WHERE key=?',attemptKey);
        const user=await this.newUser({...b,role:'admin'},()=>{
          if(this.one('SELECT COUNT(*) AS n FROM users').n)throw new ApiError(409,'Plataforma já inicializada.');
        });
        return this.startSession(user,secure,201);
      }
      if(path==='/api/auth/register'&&method==='POST'){
        const b=await jsonBody(request);
        if(!this.one('SELECT COUNT(*) AS n FROM users').n)
          throw new ApiError(403,'Plataforma não inicializada.');
        let email=b.email,role='student',invite=null,inviteHash=null;
        if(typeof b.inviteToken==='string'&&b.inviteToken.length>=24){
          inviteHash=await sha(b.inviteToken);
          invite=this.one('SELECT email,role,expires_at,used_at FROM invitations WHERE token_hash=?',inviteHash);
          if(!invite||invite.used_at||invite.expires_at<=Date.now())
            throw new ApiError(403,'Convite inválido ou expirado.');
          email=invite.email;role=invite.role;
        }else if(this.env.HUB_OPEN_REGISTRATION!=='1'){
          throw new ApiError(403,'Cadastro somente por convite.');
        }
        const user=await this.newUser({name:b.name,email,role,password:b.password},()=>{
          if(inviteHash){
            const fresh=this.one('SELECT expires_at,used_at FROM invitations WHERE token_hash=?',inviteHash);
            if(!fresh||fresh.used_at||fresh.expires_at<=Date.now())
              throw new ApiError(403,'Convite inválido ou expirado.');
          }
        });
        if(inviteHash)this.sql.exec('UPDATE invitations SET used_at=? WHERE token_hash=? AND used_at IS NULL',Date.now(),inviteHash);
        return this.startSession(user,secure,201);
      }
      if(path==='/api/auth/login'&&method==='POST'){
        const b=await jsonBody(request);
        const email=emailOf(b.email);
        const ip=request.headers.get('cf-connecting-ip')||'unknown';
        const key=await sha(ip+':'+email);
        const hit=this.one('SELECT count,reset_at FROM login_attempts WHERE key=?',key);
        if(hit&&hit.reset_at>Date.now()&&hit.count>=8)
          throw new ApiError(429,'Muitas tentativas. Tente novamente mais tarde.');
        const u=this.one('SELECT * FROM users WHERE email=?',email);
        if(!u||u.status!=='active'||!(await passwordMatches(b.password,u.password_hash))){
          const active=hit&&hit.reset_at>Date.now();
          this.sql.exec('INSERT INTO login_attempts(key,count,reset_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,reset_at=excluded.reset_at',
            key,active?hit.count+1:1,active?hit.reset_at:Date.now()+900000);
          throw new ApiError(401,'E-mail ou senha inválidos.');
        }
        this.sql.exec('DELETE FROM login_attempts WHERE key=?',key);
        return this.startSession(u,secure);
      }
      if(path==='/api/auth/logout'&&method==='POST'){
        const token=requestToken(request);
        if(token)this.sql.exec('DELETE FROM sessions WHERE token_hash=?',await sha(token));
        return response(200,{ok:true},{'Set-Cookie':cookie('',secure,true)});
      }
      if(path==='/api/me'&&method==='GET')
        return response(200,{user:safeUser(await this.requireUser(request))});
      if(path==='/api/me'&&method==='PATCH'){
        const u=await this.requireUser(request),b=await jsonBody(request);
        if(typeof b.name!=='string'||b.name.trim().length<2||b.name.trim().length>100)
          throw new ApiError(400,'Nome inválido.');
        this.sql.exec('UPDATE users SET name=? WHERE id=?',b.name.trim(),u.id);
        return response(200,{user:safeUser({...u,name:b.name.trim()})});
      }
      if(path==='/api/me/password'&&method==='PATCH'){
        const u=await this.requireUser(request),b=await jsonBody(request);
        const stored=this.one('SELECT password_hash FROM users WHERE id=?',u.id);
        if(!(await passwordMatches(b.currentPassword,stored.password_hash)))
          throw new ApiError(403,'Senha atual incorreta.');
        const digest=await passwordHash(b.newPassword);
        this.sql.exec('UPDATE users SET password_hash=? WHERE id=?',digest,u.id);
        this.sql.exec('DELETE FROM sessions WHERE user_id=?',u.id);
        return response(200,{ok:true,requiresLogin:true},{'Set-Cookie':cookie('',secure,true)});
      }
      if(path==='/api/me/state'&&method==='GET'){
        const u=await this.requireUser(request),state={};
        for(const row of this.all('SELECT key,value FROM user_state WHERE user_id=?',u.id))state[row.key]=row.value;
        return response(200,{state});
      }
      if(path==='/api/me/state'&&method==='PUT'){
        const u=await this.requireUser(request),b=await jsonBody(request);
        if(!KEYS.has(b.key)||typeof b.value!=='string'||b.value.length>150000)
          throw new ApiError(400,'Progresso inválido.');
        try{JSON.parse(b.value);}catch{throw new ApiError(400,'Progresso precisa ser JSON válido.');}
        this.sql.exec('INSERT INTO user_state(user_id,key,value,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id,key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at',
          u.id,b.key,b.value,new Date().toISOString());
        return response(200,{ok:true});
      }
      if(path==='/api/me/state'&&method==='DELETE'){
        const u=await this.requireUser(request),b=await jsonBody(request);
        if(!KEYS.has(b.key))throw new ApiError(400,'Chave de progresso inválida.');
        this.sql.exec('DELETE FROM user_state WHERE user_id=? AND key=?',u.id,b.key);
        return response(200,{ok:true});
      }
      if(path==='/api/admin/users'&&method==='GET'){
        await this.requireAdmin(request);
        return response(200,{users:this.all('SELECT id,email,name,role,status,created_at FROM users ORDER BY created_at DESC').map(safeUser)});
      }
      if(path==='/api/admin/invitations'&&method==='POST'){
        await this.requireAdmin(request);
        const b=await jsonBody(request),mail=emailOf(b.email),role=b.role??'student';
        if(!validEmail(mail)||!['admin','teacher','student'].includes(role))
          throw new ApiError(400,'Convite inválido.');
        if(this.one('SELECT id FROM users WHERE email=?',mail))throw new ApiError(409,'E-mail já cadastrado.');
        const token=randomToken();
        this.sql.exec('INSERT INTO invitations(token_hash,email,role,expires_at) VALUES(?,?,?,?)',
          await sha(token),mail,role,Date.now()+2*DAY);
        return response(201,{token,inviteUrl:url.origin+'/?invite='+encodeURIComponent(token),expiresInHours:48});
      }
      const match=/^\/api\/admin\/users\/([0-9a-f-]+)$/.exec(path);
      if(match&&method==='PATCH'){
        const admin=await this.requireAdmin(request),b=await jsonBody(request);
        const target=this.one('SELECT id,email,name,role,status,created_at FROM users WHERE id=?',match[1]);
        if(!target)throw new ApiError(404,'Usuário não encontrado.');
        if(target.id===admin.id)throw new ApiError(403,'Não altere seu próprio perfil administrativo.');
        const role=b.role??target.role,status=b.status??target.status;
        if(!['admin','teacher','student'].includes(role)||!['active','suspended'].includes(status))
          throw new ApiError(400,'Perfil ou situação inválida.');
        this.sql.exec('UPDATE users SET role=?,status=? WHERE id=?',role,status,target.id);
        if(status==='suspended')this.sql.exec('DELETE FROM sessions WHERE user_id=?',target.id);
        return response(200,{user:safeUser({...target,role,status})});
      }
      throw new ApiError(404,'Rota não encontrada.');
    }catch(e){
      if(e instanceof ApiError)return response(e.status,{error:e.message});
      console.error('Hub Auth Worker',String(e?.message??e));
      return response(500,{error:'Falha interna do servidor.'});
    }
  }
}
export default {
  fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==='/__worker/health' && (request.method==='GET'||request.method==='HEAD'))return response(200,{ok:true,runtime:'worker',phase:'accounts-active'});
    if(!url.pathname.startsWith('/api/'))return env.ASSETS.fetch(request);
    if(!env.HUB_AUTH)return response(503,{error:'Backend da plataforma não configurado.'});
    return env.HUB_AUTH.get(env.HUB_AUTH.idFromName('canonical-users')).fetch(request);
  }
};
