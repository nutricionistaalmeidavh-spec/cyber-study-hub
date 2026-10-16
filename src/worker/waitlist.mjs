import {knownCourseIds} from './course-access.mjs';

// Contatos de interesse não são usuários, compras, convites ou permissões de cursos.
export const WAITLIST_SCHEMA=[
  "CREATE TABLE IF NOT EXISTS waitlist_entries (id TEXT PRIMARY KEY,course_id TEXT NOT NULL,email TEXT NOT NULL,name TEXT NOT NULL,consent_at TEXT NOT NULL,created_at TEXT NOT NULL,UNIQUE(course_id,email))",
  "CREATE INDEX IF NOT EXISTS idx_waitlist_entries_created ON waitlist_entries(created_at DESC)"
];
export const waitlistRoute=path=>path==='/api/waitlist'||path==='/api/admin/waitlist'||/^\/api\/admin\/waitlist\/[a-f0-9-]{36}$/.test(path);
const isCourse=id=>id==='academy'||knownCourseIds.has(id);
const emailOf=value=>typeof value==='string'?value.trim().toLowerCase():'';
const validEmail=email=>email.length<=254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function handleWaitlist({path,method,url,readBody,requireAdmin,one,all,run,reply,fail,uuid,rateKey,now=Date.now}){
  if(path==='/api/waitlist'&&method==='POST'){
    const data=await readBody(2048);
    // Campo oculto de baixa fricção: bots recebem sucesso sem gravação.
    if(typeof data.website==='string'&&data.website.trim())return reply(200,{ok:true});
    if(typeof rateKey!=='string'||!rateKey)throw fail(503,'Inscrições temporariamente indisponíveis.');
    const prior=one('SELECT count,reset_at FROM login_attempts WHERE key=?',rateKey);
    const timestamp=now(), active=Boolean(prior&&prior.reset_at>timestamp);
    if(active&&prior.count>=10)throw fail(429,'Muitas tentativas. Tente novamente em 15 minutos.');
    run('INSERT INTO login_attempts(key,count,reset_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,reset_at=excluded.reset_at',
      rateKey,active?prior.count+1:1,active?prior.reset_at:timestamp+900000);
    const email=emailOf(data.email);
    const name=typeof data.name==='string'?data.name.trim().replace(/\s+/g,' '):'';
    if(!validEmail(email))throw fail(400,'Informe um e-mail válido.');
    if(name.length<2||name.length>100)throw fail(400,'Informe seu nome (2 a 100 caracteres).');
    if(typeof data.courseId!=='string'||!isCourse(data.courseId))throw fail(400,'Selecione um curso válido.');
    if(data.consent!==true)throw fail(400,'Confirme o consentimento para receber o aviso.');
    const at=new Date(timestamp).toISOString();
    run('INSERT OR IGNORE INTO waitlist_entries(id,course_id,email,name,consent_at,created_at) VALUES(?,?,?,?,?,?)',
      uuid(),data.courseId,email,name,at,at);
    const inserted=Number(one('SELECT changes() AS n')?.n||0)>0;
    return reply(inserted?201:200,{ok:true,message:'Interesse registrado. Avisaremos sobre novidades e abertura de vagas.'});
  }
  if(path==='/api/admin/waitlist'&&method==='GET'){
    await requireAdmin();
    const query=new URL(url).searchParams;
    const courseId=query.get('courseId')||'';
    if(courseId&&!isCourse(courseId))throw fail(400,'Curso inválido.');
    const limitValue=Number(query.get('limit')||'100'),offsetValue=Number(query.get('offset')||'0');
    if(!Number.isInteger(limitValue)||limitValue<1||limitValue>100||
       !Number.isInteger(offsetValue)||offsetValue<0||offsetValue>1000000)
      throw fail(400,'Paginação inválida.');
    const where=courseId?' WHERE course_id=?':'';
    const args=courseId?[courseId]:[];
    const total=one('SELECT COUNT(*) AS n FROM waitlist_entries'+where,...args).n;
    const rows=all('SELECT id,course_id AS courseId,email,name,consent_at AS consentAt,created_at AS createdAt FROM waitlist_entries'+where+
      ' ORDER BY created_at DESC,id DESC LIMIT ? OFFSET ?',...args,limitValue,offsetValue);
    return reply(200,{total,entries:rows,limit:limitValue,offset:offsetValue});
  }
  const del=/^\/api\/admin\/waitlist\/([a-f0-9-]{36})$/.exec(path);
  if(del&&method==='DELETE'){
    await requireAdmin();
    run('DELETE FROM waitlist_entries WHERE id=?',del[1]);
    return reply(200,{ok:true});
  }
  throw fail(404,'Rota não encontrada.');
}
