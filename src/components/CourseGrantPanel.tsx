import { useEffect, useState } from 'react';
import { platformApi, type PlatformUser } from './PlatformGate';
import { publishedCourses } from '../curriculum/courseOfferings';

type Grant = { course_id:string; expires_at:number|null; revoked_at:number|null };
type Rights = {grants:Grant[];subscription:{expires_at:number;revoked_at:number|null}|null};
const empty:Rights={grants:[],subscription:null};

export function CourseGrantPanel({users}:{users:PlatformUser[]}) {
  const [userId,setUserId]=useState('');
  const [courseId,setCourseId]=useState(publishedCourses[0]?.id??'');
  const [days,setDays]=useState('0');
  const [rights,setRights]=useState<Rights>(empty);
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  const [revision,setRevision]=useState(0);
  useEffect(()=>{
    if(!userId){setRights(empty);return;}
    let active=true;
    platformApi<Rights>('/api/admin/access/grants?userId='+encodeURIComponent(userId))
      .then(x=>{if(active)setRights(x);})
      .catch(e=>{if(active)setMessage(String(e));});
    return()=>{active=false;};
  },[userId,revision]);
  const act=async(path:string,method:'POST'|'DELETE',payload:object,success:string)=>{
    if(!userId)return;
    setMessage('');setBusy(true);
    try{await platformApi(path,method,{userId,...payload});setRevision(n=>n+1);setMessage(success);}
    catch(e){setMessage(String(e).replace(/^Error: /,''));}
    finally{setBusy(false);}
  };
  const date=(expiresAt:number|null)=>expiresAt?new Date(expiresAt).toLocaleDateString('pt-BR'):'sem prazo definido';
  const active=rights.grants.filter(g=>g.revoked_at===null&&(g.expires_at===null||g.expires_at>Date.now()));
  const subscription=rights.subscription&&rights.subscription.revoked_at===null&&rights.subscription.expires_at>Date.now();
  return <section className="panel stack" aria-label="Concessões de cursos e assinaturas">
    <div className="section-head"><div><span className="eyebrow">ACESSO COMERCIAL</span><h2>Liberar cursos</h2></div></div>
    <p>Concessão manual pelo administrador, sem cobrança automática. Uma conta sem permissão não pode abrir os arquivos protegidos dos cursos.</p>
    <div className="platform-form">
      <label>Conta
        <select value={userId} onChange={e=>{setMessage('');setUserId(e.target.value);}}>
          <option value="">Selecione uma conta</option>
          {users.filter(u=>u.role==='student').map(u=><option key={u.id} value={u.id}>{u.name} · {u.email}</option>)}
        </select>
      </label>
      <label>Curso
        <select value={courseId} onChange={e=>setCourseId(e.target.value)}>
          {publishedCourses.map(c=><option value={c.id} key={c.id}>{c.title}</option>)}
        </select>
      </label>
      <label>Validade da liberação
        <select value={days} onChange={e=>setDays(e.target.value)}>
          <option value="0">Sem vencimento (compra individual)</option>
          <option value="30">30 dias</option>
          <option value="90">90 dias</option>
          <option value="365">365 dias</option>
        </select>
      </label>
      <div className="wrap">
        <button type="button" className="button primary" disabled={!userId||!courseId||busy} onClick={()=>void act('/api/admin/access/grants','POST',{courseId,...(days==='0'?{}:{validDays:Number(days)})},'Curso liberado.')}>Liberar curso</button>
        <button type="button" className="button ghost" disabled={!userId||!courseId||busy} onClick={()=>void act('/api/admin/access/grants','DELETE',{courseId},'Curso revogado.')}>Revogar curso</button>
        <button type="button" className="button ghost" disabled={!userId||busy} onClick={()=>void act('/api/admin/access/subscriptions','POST',{validDays:30},'Acesso total liberado por 30 dias.')}>Liberar assinatura por 30 dias</button>
        <button type="button" className="button ghost" disabled={!userId||busy} onClick={()=>void act('/api/admin/access/subscriptions','DELETE',{},'Assinatura revogada.')}>Revogar assinatura</button>
      </div>
    </div>
    {userId&&<div className="stack" aria-live="polite">
      <p><strong>Assinatura:</strong> {subscription?'Ativa até '+date(rights.subscription!.expires_at):'Sem assinatura ativa'}</p>
      <p><strong>Cursos liberados:</strong> {active.length?active.map(g=>publishedCourses.find(c=>c.id===g.course_id)?.title+' ('+date(g.expires_at)+')').join(' · '):'Nenhum'}</p>
    </div>}
    {message&&<p role="status">{message}</p>}
  </section>;
}