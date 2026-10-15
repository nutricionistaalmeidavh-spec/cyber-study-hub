/* Moderated public roadmap. Never project private feedback fields into public responses. */
export const ROADMAP_SCHEMA=[
  "CREATE TABLE IF NOT EXISTS feedback_public_ideas (id TEXT PRIMARY KEY,feedback_id TEXT NOT NULL UNIQUE,title TEXT NOT NULL,summary TEXT NOT NULL,stage TEXT NOT NULL,created_at TEXT NOT NULL,updated_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS feedback_idea_votes (idea_id TEXT NOT NULL,user_id TEXT NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(idea_id,user_id))",
  "CREATE INDEX IF NOT EXISTS feedback_votes_idea ON feedback_idea_votes(idea_id)",
  "CREATE TABLE IF NOT EXISTS feedback_releases (id TEXT PRIMARY KEY,feedback_id TEXT NOT NULL,title TEXT NOT NULL,summary TEXT NOT NULL,created_at TEXT NOT NULL,client_nonce TEXT UNIQUE)",
  "CREATE INDEX IF NOT EXISTS feedback_releases_latest ON feedback_releases(created_at)"
];
export const ROADMAP_STAGES=['under_review','planned','in_progress','released'];
const isId=value=>typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const valid=(s,min,max)=>typeof s==='string'&&s.trim().length>=min&&s.trim().length<=max;
export function roadmapRoute(path){
  return path==='/api/roadmap'||path.startsWith('/api/roadmap/')||
    path==='/api/admin/roadmap'||path.startsWith('/api/admin/roadmap/')||
    /^\/api\/admin\/feedback\/[0-9a-f-]{36}\/publish$/.test(path);
}
export async function handleRoadmap({path,method,url,readBody,requireUser,requireAdmin,getUser,one,all,run,reply,fail,uuid}){
  const reject=(status,message)=>{throw fail(status,message);};
  const now=()=>new Date().toISOString();
  const adminArea=path.startsWith('/api/admin/');
  const actor=adminArea?await requireAdmin():await getUser();
  const pubIdeas=()=>{
    const rows=all("SELECT i.id,i.title,i.summary,i.stage,i.created_at AS publishedAt,i.updated_at AS updatedAt,(SELECT COUNT(*) FROM feedback_idea_votes v WHERE v.idea_id=i.id) AS votes FROM feedback_public_ideas i ORDER BY CASE i.stage WHEN 'in_progress' THEN 0 WHEN 'planned' THEN 1 WHEN 'under_review' THEN 2 ELSE 3 END,i.updated_at DESC LIMIT 200");
    return rows.map(idea=>({...idea,voted:Boolean(actor&&one('SELECT 1 AS ok FROM feedback_idea_votes WHERE idea_id=? AND user_id=?',idea.id,actor.id))}));
  };
  const pubReleases=()=>all("SELECT r.id,r.title,r.summary,r.created_at AS publishedAt,CASE WHEN i.id IS NOT NULL THEN i.title ELSE 'Feedback da comunidade' END AS sourceTitle FROM feedback_releases r LEFT JOIN feedback_public_ideas i ON i.feedback_id=r.feedback_id ORDER BY r.created_at DESC,r.id DESC LIMIT 100");
  if(path==='/api/roadmap'&&method==='GET')return reply(200,{ideas:pubIdeas(),releases:pubReleases(),authenticated:Boolean(actor)});
  if(path==='/api/admin/roadmap'&&method==='GET'){
    const ideas=all('SELECT i.id,i.feedback_id AS feedbackId,i.title,i.summary,i.stage,i.created_at AS publishedAt,(SELECT COUNT(*) FROM feedback_idea_votes v WHERE v.idea_id=i.id) AS votes FROM feedback_public_ideas i ORDER BY i.created_at DESC LIMIT 200');
    const releases=all('SELECT id,feedback_id AS feedbackId,title,summary,created_at AS publishedAt FROM feedback_releases ORDER BY created_at DESC LIMIT 100');
    return reply(200,{ideas,releases});
  }
  const vote=/^\/api\/roadmap\/ideas\/([0-9a-f-]{36})\/vote$/.exec(path);
  if(vote&&(method==='POST'||method==='DELETE')){
    const user=await requireUser();
    const idea=one('SELECT id,stage FROM feedback_public_ideas WHERE id=?',vote[1]);
    if(!idea)reject(404,'Sugestão não encontrada no roadmap.');
    if(method==='POST'){
      if(idea.stage==='released')reject(409,'Esta melhoria já foi entregue.');
      run('INSERT OR IGNORE INTO feedback_idea_votes(idea_id,user_id,created_at) VALUES(?,?,?)',vote[1],user.id,now());
    } else run('DELETE FROM feedback_idea_votes WHERE idea_id=? AND user_id=?',vote[1],user.id);
    const count=one('SELECT COUNT(*) AS n FROM feedback_idea_votes WHERE idea_id=?',vote[1]).n;
    return reply(200,{votes:count,voted:method==='POST'});
  }
  const publish=/^\/api\/admin\/feedback\/([0-9a-f-]{36})\/publish$/.exec(path);
  if(publish&&method==='POST'){
    const report=one('SELECT id,category FROM feedback_reports WHERE id=?',publish[1]);
    if(!report)reject(404,'Feedback não encontrado.');
    if(report.category!=='idea')reject(400,'Somente sugestões podem aparecer no roadmap.');
    const b=await readBody();
    if(!valid(b.title,8,120)||!valid(b.summary,15,500)||!ROADMAP_STAGES.includes(b.stage??'under_review'))
      reject(400,'Informe título, descrição e etapa de publicação válidos.');
    const previous=one('SELECT id FROM feedback_public_ideas WHERE feedback_id=?',report.id);
    const id=previous?.id??uuid(),current=now();
    run('INSERT INTO feedback_public_ideas(id,feedback_id,title,summary,stage,created_at,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(feedback_id) DO UPDATE SET title=excluded.title,summary=excluded.summary,stage=excluded.stage,updated_at=excluded.updated_at',
      id,report.id,b.title.trim(),b.summary.trim(),b.stage??'under_review',current,current);
    return reply(previous?200:201,{idea:{id,title:b.title.trim(),summary:b.summary.trim(),stage:b.stage??'under_review'}});
  }
  const idea=/^\/api\/admin\/roadmap\/ideas\/([0-9a-f-]{36})$/.exec(path);
  if(idea&&(method==='PATCH'||method==='DELETE')){
    const current=one('SELECT id,feedback_id,stage,title,summary FROM feedback_public_ideas WHERE id=?',idea[1]);
    if(!current)reject(404,'Sugestão não encontrada.');
    if(method==='DELETE'){
      run('DELETE FROM feedback_idea_votes WHERE idea_id=?',idea[1]);
      run('DELETE FROM feedback_public_ideas WHERE id=?',idea[1]);
      return reply(200,{ok:true});
    }
    const b=await readBody();
    if((b.stage===undefined&&b.title===undefined&&b.summary===undefined)||
       (b.stage!==undefined&&!ROADMAP_STAGES.includes(b.stage))||
       (b.title!==undefined&&!valid(b.title,8,120))||
       (b.summary!==undefined&&!valid(b.summary,15,500)))
      reject(400,'Atualização de roadmap inválida.');
    const update={stage:b.stage??current.stage,title:b.title?.trim()??current.title,summary:b.summary?.trim()??current.summary};
    run('UPDATE feedback_public_ideas SET title=?,summary=?,stage=?,updated_at=? WHERE id=?',update.title,update.summary,update.stage,now(),idea[1]);
    return reply(200,{idea:{id:idea[1],...update}});
  }
  if(path==='/api/admin/roadmap/releases'&&method==='POST'){
    const b=await readBody();
    if(!isId(b.feedbackId)||!valid(b.title,8,120)||!valid(b.summary,15,800))
      reject(400,'Selecione o feedback de origem e descreva a atualização.');
    if(!one('SELECT id FROM feedback_reports WHERE id=?',b.feedbackId))reject(404,'Feedback de origem não encontrado.');
    if(b.clientNonce!==undefined&&!isId(b.clientNonce))reject(400,'Identificador de publicação inválido.');
    if(b.clientNonce){
      const existing=one('SELECT id FROM feedback_releases WHERE client_nonce=?',b.clientNonce);
      if(existing)return reply(200,{release:{id:existing.id},alreadyPublished:true});
    }
    const id=uuid(),timestamp=now();
    run('INSERT INTO feedback_releases(id,feedback_id,title,summary,created_at,client_nonce) VALUES(?,?,?,?,?,?)',id,b.feedbackId,b.title.trim(),b.summary.trim(),timestamp,b.clientNonce??null);
    const publicIdea=one('SELECT id,stage FROM feedback_public_ideas WHERE feedback_id=?',b.feedbackId);
    if(publicIdea&&publicIdea.stage!=='released')
      run("UPDATE feedback_public_ideas SET stage='released',updated_at=? WHERE id=?",timestamp,publicIdea.id);
    return reply(201,{release:{id,title:b.title.trim(),publishedAt:timestamp}});
  }
  const release=/^\/api\/admin\/roadmap\/releases\/([0-9a-f-]{36})$/.exec(path);
  if(release&&method==='DELETE'){
    const current=one('SELECT id FROM feedback_releases WHERE id=?',release[1]);
    if(!current)reject(404,'Atualização não encontrada.');
    run('DELETE FROM feedback_releases WHERE id=?',release[1]);
    return reply(200,{ok:true});
  }
  reject(404,'Rota não encontrada.');
}
