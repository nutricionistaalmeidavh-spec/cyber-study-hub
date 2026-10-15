import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, createHash, pbkdf2Sync, timingSafeEqual } from 'node:crypto';
import { FEEDBACK_SCHEMA, feedbackRoute, handleFeedback } from '../src/worker/feedback.mjs';

const DAY = 86400000;
const PROGRESS_KEYS = new Set([
  'cyber-study-lessons-v1', 'cyber-study-games-v1', 'cyber-study-recent-items-v1',
  'cyber-study-labs-v1', 'cyber-study-learning-v2', 'cyber-study-learning-v2-migration',
  'cyber-study-concept-mastery-v1', 'cyber-study-active-parallel-tracks-v1', 'cyber-study-fsrs-v1'
]);
class HttpError extends Error { constructor(status,message){super(message);this.status=status;} }
const sha = v => createHash('sha256').update(v).digest('hex');
const emailOf = v => typeof v==='string'?v.trim().toLowerCase():'';
const emailOk = v => v.length<=254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const safeUser = u => ({id:u.id,email:u.email,name:u.name,role:u.role,status:u.status,createdAt:u.created_at});

function checkPassword(p) {
  if (typeof p!=='string'||p.length<12||p.length>128) throw new HttpError(400,'Senha precisa ter de 12 a 128 caracteres.');
}
function passwordHash(p) {
  checkPassword(p);
  const salt=randomBytes(16).toString('hex'), count=600000;
  return 'pbkdf2-sha256$'+count+'$'+salt+'$'+
    pbkdf2Sync(p,Buffer.from(salt,'hex'),count,32,'sha256').toString('hex');
}
function passwordMatches(p,stored) {
  if(typeof p!=='string'||typeof stored!=='string')return false;
  const a=stored.split('$'), count=Number(a[1]);
  if(a.length!==4||a[0]!=='pbkdf2-sha256'||!Number.isSafeInteger(count)||count<100000||count>1000000)return false;
  const expected=Buffer.from(a[3],'hex');
  if(expected.length!==32)return false;
  return timingSafeEqual(expected,pbkdf2Sync(p,Buffer.from(a[2],'hex'),count,32,'sha256'));
}
function respond(res,code,payload,headers={}) {
  res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers});
  res.end(JSON.stringify(payload));
}
async function readJson(req,maxLength=200000) {
  if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']??'')) throw new HttpError(415,'Envie JSON.');
  let raw='';
  for await(const chunk of req) {
    raw+=chunk.toString('utf8');
    if(raw.length>maxLength)throw new HttpError(413,'Requisição muito grande.');
  }
  try {
    const b=JSON.parse(raw);
    if(!b||typeof b!=='object'||Array.isArray(b))throw Error();
    return b;
  }catch{throw new HttpError(400,'JSON inválido.');}
}
function cookie(token,secure,expired=false) {
  return 'hub_session='+(expired?'':encodeURIComponent(token))+
    '; Path=/; HttpOnly; SameSite=Lax'+(secure?'; Secure':'')+
    (expired?'; Max-Age=0':'; Max-Age=604800');
}
function readCookie(req) {
  const part=(req.headers.cookie??'').split(';').map(s=>s.trim()).find(s=>s.startsWith('hub_session='));
  try{return part?decodeURIComponent(part.slice('hub_session='.length)):'';}catch{return '';}
}
function init(db) {
  db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
  db.exec([
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('admin','teacher','student')),status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended')),password_hash TEXT NOT NULL,created_at TEXT NOT NULL);",
    'CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);',
    'CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);',
    "CREATE TABLE IF NOT EXISTS invitations (token_hash TEXT PRIMARY KEY,email TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('admin','teacher','student')),expires_at INTEGER NOT NULL,used_at INTEGER);",
    'CREATE TABLE IF NOT EXISTS login_attempts (key TEXT PRIMARY KEY,count INTEGER NOT NULL,reset_at INTEGER NOT NULL);',
    'CREATE TABLE IF NOT EXISTS user_state (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,key TEXT NOT NULL,value TEXT NOT NULL,updated_at TEXT NOT NULL,PRIMARY KEY (user_id,key));',
    ...FEEDBACK_SCHEMA.map(statement=>statement+';')
  ].join('\n'));
}
export function createPlatformHandler({dbPath,origin,bootstrapKey,openRegistration=false}) {
  if(!dbPath||!origin)throw Error('dbPath and HUB_ORIGIN are required');
  const canonicalOrigin=new URL(origin).origin, secure=canonicalOrigin.startsWith('https://');
  const db=new DatabaseSync(dbPath);
  init(db);
  const q=s=>db.prepare(s), now=()=>Date.now();
  function current(req) {
    const token=readCookie(req);
    if(!token||token.length>200)return null;
    return q("SELECT u.id,u.email,u.name,u.role,u.status,u.created_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status='active'")
      .get(sha(token),now())??null;
  }
  function mustUser(req) {
    const user=current(req);
    if(!user)throw new HttpError(401,'Faça login para continuar.');
    return user;
  }
  function mustAdmin(req) {
    const user=mustUser(req);
    if(user.role!=='admin')throw new HttpError(403,'Acesso exclusivo da administração.');
    return user;
  }
  function loginSession(res,u,status=200) {
    const token=randomBytes(32).toString('base64url');
    q('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(sha(token),u.id,now()+7*DAY);
    return respond(res,status,{user:safeUser(u)},{'Set-Cookie':cookie(token,secure)});
  }
  function newUser({name,email,role,password}) {
    const mail=emailOf(email);
    if(!emailOk(mail))throw new HttpError(400,'E-mail inválido.');
    if(typeof name!=='string'||name.trim().length<2||name.trim().length>100)throw new HttpError(400,'Nome inválido.');
    if(!['admin','teacher','student'].includes(role))throw new HttpError(400,'Perfil inválido.');
    const u={id:randomUUID(),email:mail,name:name.trim(),role,status:'active',created_at:new Date().toISOString()};
    const digest=passwordHash(password);
    try {
      q('INSERT INTO users(id,email,name,role,status,password_hash,created_at) VALUES(?,?,?,?,?,?,?)')
        .run(u.id,u.email,u.name,u.role,u.status,digest,u.created_at);
    }catch(e){
      if(String(e).includes('UNIQUE'))throw new HttpError(409,'E-mail já cadastrado.');
      throw e;
    }
    return u;
  }
  function limit(key) {
    const hit=q('SELECT count,reset_at FROM login_attempts WHERE key=?').get(key);
    if(hit&&hit.reset_at>now()&&hit.count>=8)throw new HttpError(429,'Muitas tentativas. Tente novamente mais tarde.');
  }
  function fail(key) {
    const hit=q('SELECT count,reset_at FROM login_attempts WHERE key=?').get(key);
    const valid=hit&&hit.reset_at>now();
    q('INSERT INTO login_attempts(key,count,reset_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,reset_at=excluded.reset_at')
      .run(key,valid?hit.count+1:1,valid?hit.reset_at:now()+900000);
  }
  async function handle(req,res) {
    try {
      const path=new URL(req.url,canonicalOrigin).pathname, method=req.method;
      if(path==='/api/health'&&method==='GET')return respond(res,200,{ok:true});
      if(!path.startsWith('/api/'))throw new HttpError(404,'Rota não encontrada.');
      if(method!=='GET'&&req.headers.origin!==canonicalOrigin)throw new HttpError(403,'Origem não permitida.');
      if(path==='/api/auth/config'&&method==='GET')
        return respond(res,200,{ready:q('SELECT count(*) AS n FROM users').get().n>0,openRegistration:Boolean(openRegistration)});
      if(path==='/api/auth/bootstrap'&&method==='POST') {
        const b=await readJson(req);
        if(q('SELECT count(*) AS n FROM users').get().n>0)throw new HttpError(409,'Plataforma já inicializada.');
        if(typeof bootstrapKey!=='string'||bootstrapKey.length===0||typeof b.bootstrapKey!=='string'||
           !timingSafeEqual(Buffer.from(sha(bootstrapKey),'hex'),Buffer.from(sha(b.bootstrapKey),'hex')))
          throw new HttpError(403,'Chave de instalação inválida.');
        return loginSession(res,newUser({...b,role:'admin'}),201);
      }
      if(path==='/api/auth/register'&&method==='POST') {
        const b=await readJson(req);
        if(!q('SELECT count(*) AS n FROM users').get().n)throw new HttpError(403,'Plataforma não inicializada.');
        let role='student',email=b.email,inv;
        if(typeof b.inviteToken==='string'&&b.inviteToken.length>=24){
          inv=q('SELECT email,role,expires_at,used_at FROM invitations WHERE token_hash=?').get(sha(b.inviteToken));
          if(!inv||inv.expires_at<=now()||inv.used_at)throw new HttpError(403,'Convite inválido ou expirado.');
          email=inv.email;role=inv.role;
        }else if(!openRegistration)throw new HttpError(403,'Cadastro somente por convite.');
        const user=newUser({name:b.name,email,role,password:b.password});
        if(inv)q('UPDATE invitations SET used_at=? WHERE token_hash=? AND used_at IS NULL').run(now(),sha(b.inviteToken));
        return loginSession(res,user,201);
      }
      if(path==='/api/auth/login'&&method==='POST') {
        const b=await readJson(req), mail=emailOf(b.email),key=sha((req.socket.remoteAddress??'unknown')+':'+mail);
        limit(key);
        const u=q('SELECT * FROM users WHERE email=?').get(mail);
        if(!u||u.status!=='active'||!passwordMatches(b.password,u.password_hash)){
          fail(key);throw new HttpError(401,'E-mail ou senha inválidos.');
        }
        q('DELETE FROM login_attempts WHERE key=?').run(key);
        return loginSession(res,u);
      }
      if(path==='/api/auth/logout'&&method==='POST') {
        const token=readCookie(req);
        if(token)q('DELETE FROM sessions WHERE token_hash=?').run(sha(token));
        return respond(res,200,{ok:true},{'Set-Cookie':cookie('',secure,true)});
      }
      if(path==='/api/me'&&method==='GET')return respond(res,200,{user:safeUser(mustUser(req))});
      if(path==='/api/me'&&method==='PATCH') {
        const u=mustUser(req), b=await readJson(req);
        if(typeof b.name!=='string'||b.name.trim().length<2||b.name.trim().length>100)throw new HttpError(400,'Nome inválido.');
        q('UPDATE users SET name=? WHERE id=?').run(b.name.trim(),u.id);
        return respond(res,200,{user:safeUser({...u,name:b.name.trim()})});
      }
      if(path==='/api/me/password'&&method==='PATCH') {
        const u=mustUser(req), b=await readJson(req);
        const digest=q('SELECT password_hash FROM users WHERE id=?').get(u.id).password_hash;
        if(!passwordMatches(b.currentPassword,digest))throw new HttpError(403,'Senha atual incorreta.');
        q('UPDATE users SET password_hash=? WHERE id=?').run(passwordHash(b.newPassword),u.id);
        q('DELETE FROM sessions WHERE user_id=?').run(u.id);
        return respond(res,200,{ok:true,requiresLogin:true},{'Set-Cookie':cookie('',secure,true)});
      }
      if(path==='/api/me/state'&&method==='GET') {
        const u=mustUser(req),state={};
        for(const row of q('SELECT key,value FROM user_state WHERE user_id=?').all(u.id))state[row.key]=row.value;
        return respond(res,200,{state});
      }
      if(path==='/api/me/state'&&method==='PUT') {
        const u=mustUser(req),b=await readJson(req);
        if(!PROGRESS_KEYS.has(b.key)||typeof b.value!=='string'||b.value.length>150000)
          throw new HttpError(400,'Progresso inválido.');
        try{JSON.parse(b.value);}catch{throw new HttpError(400,'Progresso precisa ser JSON válido.');}
        q('INSERT INTO user_state(user_id,key,value,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id,key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at')
          .run(u.id,b.key,b.value,new Date().toISOString());
        return respond(res,200,{ok:true});
      }
      if(path==='/api/me/state'&&method==='DELETE') {
        const u=mustUser(req),b=await readJson(req);
        if(!PROGRESS_KEYS.has(b.key))throw new HttpError(400,'Chave de progresso inválida.');
        q('DELETE FROM user_state WHERE user_id=? AND key=?').run(u.id,b.key);
        return respond(res,200,{ok:true});
      }
      if(feedbackRoute(path))return await handleFeedback({
        path,method,url:new URL(req.url,canonicalOrigin).href,
        readBody:limit=>readJson(req,limit),requireUser:()=>mustUser(req),requireAdmin:()=>mustAdmin(req),
        one:(sql,...args)=>q(sql).get(...args),all:(sql,...args)=>q(sql).all(...args),
        run:(sql,...args)=>q(sql).run(...args),reply:(status,data)=>respond(res,status,data),
        fail:(status,message)=>new HttpError(status,message),uuid:randomUUID
      });
      if(path==='/api/admin/users'&&method==='GET') {
        mustAdmin(req);
        return respond(res,200,{users:q('SELECT id,email,name,role,status,created_at FROM users ORDER BY created_at DESC').all().map(safeUser)});
      }
      if(path==='/api/admin/invitations'&&method==='POST') {
        mustAdmin(req);
        const b=await readJson(req), mail=emailOf(b.email),role=b.role??'student';
        if(!emailOk(mail)||!['admin','teacher','student'].includes(role))throw new HttpError(400,'Convite inválido.');
        if(q('SELECT id FROM users WHERE email=?').get(mail))throw new HttpError(409,'E-mail já cadastrado.');
        const token=randomBytes(32).toString('base64url');
        q('INSERT INTO invitations(token_hash,email,role,expires_at) VALUES(?,?,?,?)').run(sha(token),mail,role,now()+2*DAY);
        return respond(res,201,{token,inviteUrl:canonicalOrigin+'/?invite='+encodeURIComponent(token),expiresInHours:48});
      }
      const m=/^\/api\/admin\/users\/([0-9a-f-]+)$/.exec(path);
      if(m&&method==='PATCH') {
        const admin=mustAdmin(req),b=await readJson(req);
        const target=q('SELECT id,email,name,role,status,created_at FROM users WHERE id=?').get(m[1]);
        if(!target)throw new HttpError(404,'Usuário não encontrado.');
        if(target.id===admin.id)throw new HttpError(403,'Não altere seu próprio perfil administrativo.');
        const role=b.role??target.role,status=b.status??target.status;
        if(!['admin','teacher','student'].includes(role)||!['active','suspended'].includes(status))
          throw new HttpError(400,'Perfil ou status inválido.');
        q('UPDATE users SET role=?,status=? WHERE id=?').run(role,status,target.id);
        if(status==='suspended')q('DELETE FROM sessions WHERE user_id=?').run(target.id);
        return respond(res,200,{user:safeUser({...target,role,status})});
      }
      throw new HttpError(404,'Rota não encontrada.');
    }catch(e){
      if(e instanceof HttpError)return respond(res,e.status,{error:e.message});
      console.error('Platform error:',e?.message??String(e));
      return respond(res,500,{error:'Falha interna do servidor.'});
    }
  }
  return {handle,close:()=>db.close()};
}
