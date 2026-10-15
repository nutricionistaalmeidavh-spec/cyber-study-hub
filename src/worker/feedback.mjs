/* Feedback API contract shared by Cloudflare Durable Objects and self-hosted Node SQLite. */
export const FEEDBACK_SCHEMA=[
  "CREATE TABLE IF NOT EXISTS feedback_reports (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,client_nonce TEXT NOT NULL,category TEXT NOT NULL,title TEXT NOT NULL,description TEXT NOT NULL,context_path TEXT NOT NULL,context_label TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new',priority TEXT NOT NULL DEFAULT 'normal',attachment TEXT,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,UNIQUE(user_id,client_nonce))",
  "CREATE INDEX IF NOT EXISTS feedback_reports_owner ON feedback_reports(user_id,created_at)",
  "CREATE INDEX IF NOT EXISTS feedback_reports_recent ON feedback_reports(created_at)",
  "CREATE TABLE IF NOT EXISTS feedback_messages (id TEXT PRIMARY KEY,feedback_id TEXT NOT NULL,user_id TEXT NOT NULL,body TEXT NOT NULL,created_at TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS feedback_messages_parent ON feedback_messages(feedback_id,created_at)",
  "CREATE TABLE IF NOT EXISTS feedback_events (id TEXT PRIMARY KEY,feedback_id TEXT NOT NULL,user_id TEXT NOT NULL,kind TEXT NOT NULL,value TEXT NOT NULL,created_at TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS feedback_events_parent ON feedback_events(feedback_id,created_at)"
];
const CATEGORIES=['bug','content','idea','other'];
const STATUSES=['new','in_review','planned','resolved','closed'];
const PRIORITIES=['low','normal','high','critical'];
const uuidRe=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const imageRe=/^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/]+={0,2}$/i;
const reportFields='f.id,f.user_id,f.category,f.title,f.description,f.context_path AS contextPath,f.context_label AS contextLabel,f.status,f.priority,f.created_at AS createdAt,f.updated_at AS updatedAt,u.name AS authorName,u.email AS authorEmail';
const reportSelect='SELECT '+reportFields+' FROM feedback_reports f LEFT JOIN users u ON u.id=f.user_id';
const validText=(value,min,max)=>typeof value==='string'&&value.trim().length>=min&&value.trim().length<=max;
export function feedbackRoute(path){
  return path==='/api/feedback'||path.startsWith('/api/feedback/')||
    path==='/api/admin/feedback'||path.startsWith('/api/admin/feedback/');
}
/*
 * The host supplies its existing authenticated session, SQL methods and response/error
 * builders. There is deliberately no third-party analytics, storage or mail service.
 */
export async function handleFeedback({
  path,method,url,readBody,requireUser,requireAdmin,one,all,run,reply,fail,uuid
}){
  const adminPath=path.startsWith('/api/admin/feedback');
  const actor=await (adminPath?requireAdmin():requireUser());
  const now=()=>new Date().toISOString();
  const reject=(status,message)=>{throw fail(status,message);};
  const owner=(id)=>{
    const item=one(reportSelect+' WHERE f.id=?',id);
    if(!item||(actor.role!=='admin'&&item.user_id!==actor.id))reject(404,'Feedback não encontrado.');
    return item;
  };
  const listing=(adminPath&&path==='/api/admin/feedback')||(!adminPath&&path==='/api/feedback');
  if(listing&&method==='GET'){
    const pageRaw=Number(new URL(url).searchParams.get('page')||'0');
    const page=Number.isSafeInteger(pageRaw)?Math.max(0,Math.min(1000,pageRaw)):0;
    const where=adminPath?'':' WHERE f.user_id=?';
    const params=adminPath?[]:[actor.id];
    const count=one('SELECT count(*) AS n FROM feedback_reports f'+where,...params).n;
    const reports=all(reportSelect+where+' ORDER BY f.created_at DESC,f.id DESC LIMIT 30 OFFSET ?',...params,page*30);
    return reply(200,{feedback:reports,total:count,page,hasMore:(page+1)*30<count});
  }
  if(path==='/api/feedback'&&method==='POST'){
    const b=await readBody(300000);
    if(!uuidRe.test(b.clientNonce??''))reject(400,'Identificador de envio inválido.');
    if(!CATEGORIES.includes(b.category)||!validText(b.title,5,120)||!validText(b.description,10,4000))
      reject(400,'Informe uma categoria, um título e uma descrição válidos.');
    const contextPath=b.contextPath??'#dashboard',contextLabel=b.contextLabel??'HubEstudos';
    if(typeof contextPath!=='string'||!contextPath.startsWith('#')||contextPath.length>300||
       !validText(contextLabel,1,120))reject(400,'Contexto da tela inválido.');
    const attachment=b.attachment??null;
    if(attachment!==null&&(typeof attachment!=='string'||attachment.length>220000||!imageRe.test(attachment)))
      reject(400,'Imagem inválida. Use PNG, JPEG ou WebP de até 160 KB.');
    const previous=one('SELECT id FROM feedback_reports WHERE user_id=? AND client_nonce=?',actor.id,b.clientNonce);
    if(previous)return reply(200,{feedback:{id:previous.id},alreadySubmitted:true});
    const recent=one('SELECT count(*) AS n FROM feedback_reports WHERE user_id=? AND created_at>?',actor.id,new Date(Date.now()-3600000).toISOString());
    if(recent.n>=10)reject(429,'Limite temporário de envios atingido. Tente novamente mais tarde.');
    const id=uuid(),created=now();
    try{
      run('INSERT INTO feedback_reports(id,user_id,client_nonce,category,title,description,context_path,context_label,status,priority,attachment,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
        id,actor.id,b.clientNonce,b.category,b.title.trim(),b.description.trim(),contextPath,contextLabel.trim(),'new','normal',attachment,created,created);
    }catch(e){
      if(String(e).includes('UNIQUE')){
        const duplicate=one('SELECT id FROM feedback_reports WHERE user_id=? AND client_nonce=?',actor.id,b.clientNonce);
        if(duplicate)return reply(200,{feedback:{id:duplicate.id},alreadySubmitted:true});
      }
      throw e;
    }
    return reply(201,{feedback:{id,status:'new',createdAt:created}});
  }
  const detail=/^\/api\/feedback\/([0-9a-f-]{36})(?:\/(attachment|messages))?$/.exec(path);
  if(detail){
    const id=detail[1],item=owner(id);
    if(!detail[2]&&method==='GET'){
      const messages=all('SELECT m.id,m.body,m.created_at AS createdAt,u.name AS authorName,u.role AS authorRole FROM feedback_messages m JOIN users u ON u.id=m.user_id WHERE m.feedback_id=? ORDER BY m.created_at ASC',id);
      const history=all('SELECT e.kind,e.value,e.created_at AS createdAt,u.name AS authorName FROM feedback_events e JOIN users u ON u.id=e.user_id WHERE e.feedback_id=? ORDER BY e.created_at ASC',id);
      return reply(200,{feedback:item,messages,history,hasAttachment:one('SELECT attachment FROM feedback_reports WHERE id=?',id)?.attachment!==null});
    }
    if(detail[2]==='attachment'&&method==='GET'){
      const attachment=one('SELECT attachment FROM feedback_reports WHERE id=?',id)?.attachment;
      if(!attachment)reject(404,'Este feedback não possui anexo.');
      return reply(200,{dataUrl:attachment});
    }
    if(detail[2]==='messages'&&method==='POST'){
      const b=await readBody();
      if(!validText(b.body,2,2000))reject(400,'Escreva uma resposta de 2 a 2000 caracteres.');
      const recent=one('SELECT count(*) AS n FROM feedback_messages WHERE user_id=? AND created_at>?',actor.id,new Date(Date.now()-3600000).toISOString());
      if(recent.n>=20)reject(429,'Limite temporário de mensagens atingido.');
      const created=now();
      run('INSERT INTO feedback_messages(id,feedback_id,user_id,body,created_at) VALUES(?,?,?,?,?)',uuid(),id,actor.id,b.body.trim(),created);
      run('UPDATE feedback_reports SET updated_at=? WHERE id=?',created,id);
      return reply(201,{ok:true,createdAt:created});
    }
  }
  const patch=/^\/api\/admin\/feedback\/([0-9a-f-]{36})$/.exec(path);
  if(patch&&method==='PATCH'){
    const item=owner(patch[1]),b=await readBody();
    if((b.status!==undefined&&!STATUSES.includes(b.status))||
       (b.priority!==undefined&&!PRIORITIES.includes(b.priority))||
       (b.status===undefined&&b.priority===undefined))
      reject(400,'Situação ou prioridade inválida.');
    const status=b.status??item.status,priority=b.priority??item.priority,updated=now();
    run('UPDATE feedback_reports SET status=?,priority=?,updated_at=? WHERE id=?',status,priority,updated,item.id);
    if(status!==item.status)run('INSERT INTO feedback_events(id,feedback_id,user_id,kind,value,created_at) VALUES(?,?,?,?,?,?)',uuid(),item.id,actor.id,'status',status,updated);
    if(priority!==item.priority)run('INSERT INTO feedback_events(id,feedback_id,user_id,kind,value,created_at) VALUES(?,?,?,?,?,?)',uuid(),item.id,actor.id,'priority',priority,updated);
    return reply(200,{feedback:{...item,status,priority,updatedAt:updated}});
  }
  return reject(404,'Rota não encontrada.');
}
