import {useEffect,useState} from 'react';
import {platformApi} from './PlatformGate';
import {courses} from '../curriculum/courseOfferings';
import './waitlist-admin.css';

type Entry={id:string;courseId:string;name:string;email:string;consentAt:string;createdAt:string};
type Result={total:number;entries:Entry[];limit:number;offset:number};
const courseName=(id:string)=>id==='academy'?'Academy · interesse geral':courses.find(course=>course.id===id)?.title||id;
const csvValue=(value:string)=>{
  const safe=/^[\s]*[=+@\-]/.test(value)?"'"+value:value;
  return '"'+safe.replace(/"/g,'""')+'"';
};
function csv(rows:Entry[]){
  return '\uFEFF'+'Nome,E-mail,Curso (ID canônico),Curso,Consentimento,Inscrição\r\n'+
    rows.map(row=>[row.name,row.email,row.courseId,courseName(row.courseId),row.consentAt,row.createdAt]
      .map(csvValue).join(',')).join('\r\n');
}
export default function WaitlistAdmin(){
  const [courseId,setCourseId]=useState('');
  const [page,setPage]=useState(0);
  const [result,setResult]=useState<Result|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [saving,setSaving]=useState(false);
  const [version,setVersion]=useState(0);
  useEffect(()=>{
    let mounted=true;setLoading(true);setError('');
    const params=new URLSearchParams({limit:'100',offset:String(page*100)});
    if(courseId)params.set('courseId',courseId);
    void platformApi<Result>('/api/admin/waitlist?'+params)
      .then(data=>{if(mounted)setResult(data);})
      .catch(err=>{if(mounted)setError(String(err).replace(/^Error: /,''));})
      .finally(()=>{if(mounted)setLoading(false);});
    return()=>{mounted=false;};
  },[page,courseId,version]);
  async function remove(entry:Entry){
    if(!window.confirm('Excluir permanentemente a inscrição de '+entry.email+'?'))return;
    setSaving(true);setError('');
    try{
      await platformApi('/api/admin/waitlist/'+entry.id,'DELETE');
      if(result?.entries.length===1&&page>0)setPage(n=>n-1);
      else setVersion(n=>n+1);
    }catch(err){setError(String(err).replace(/^Error: /,''));}
    finally{setSaving(false);}
  }
  async function download(){
    setSaving(true);setError('');
    try{
      const rows:Entry[]=[];
      let total=Infinity,offset=0;
      while(offset<total){
        const params=new URLSearchParams({limit:'100',offset:String(offset)});
        if(courseId)params.set('courseId',courseId);
        const data=await platformApi<Result>('/api/admin/waitlist?'+params);
        total=data.total;rows.push(...data.entries);
        if(!data.entries.length)break;
        offset+=data.entries.length;
      }
      const blob=new Blob([csv(rows)],{type:'text/csv;charset=utf-8;'});
      const url=URL.createObjectURL(blob);
      const link=document.createElement('a');
      link.href=url;link.download='artisys-academy-lista-espera-'+new Date().toISOString().slice(0,10)+'.csv';
      document.body.appendChild(link);link.click();link.remove();
      window.setTimeout(()=>URL.revokeObjectURL(url),1000);
    }catch(err){setError(String(err).replace(/^Error: /,''));}
    finally{setSaving(false);}
  }
  return <section className="page waitlist-admin" aria-labelledby="waitlist-admin-title">
    <div className="waitlist-admin-head">
      <div><span className="eyebrow">ARTISYS ACADEMY / GESTÃO</span>
        <h1 id="waitlist-admin-title">Lista de espera</h1>
        <p>Interessados em futuras vagas. Esta lista não é matrícula nem comprovação de compra.</p>
      </div>
      <button type="button" className="button primary" onClick={()=>void download()} disabled={saving||loading}>Exportar CSV</button>
    </div>
    <div className="panel waitlist-admin-panel">
      <div className="waitlist-admin-tools">
        <label>Filtrar por curso
          <select value={courseId} onChange={event=>{setCourseId(event.target.value);setPage(0);}}>
            <option value="">Todos os cursos</option>
            <option value="academy">Interesse geral na Academy</option>
            {courses.map(course=><option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
        </label>
        <strong aria-live="polite">{loading?'Consultando…':result?.total??0} inscrições</strong>
      </div>
      {error&&<p className="waitlist-admin-error" role="alert">{error}</p>}
      {loading?<p className="waitlist-admin-empty">Carregando lista…</p>:
        result?.entries.length?<div className="waitlist-admin-overflow"><table>
          <thead><tr><th>Nome e contato</th><th>Curso</th><th>Registrado em</th><th>Ação</th></tr></thead>
          <tbody>{result.entries.map(row=><tr key={row.id}>
            <td><strong>{row.name}</strong><a href={'mailto:'+row.email}>{row.email}</a></td>
            <td>{courseName(row.courseId)}<small>{row.courseId}</small></td>
            <td><time dateTime={row.createdAt}>{new Date(row.createdAt).toLocaleDateString('pt-BR')}</time></td>
            <td><button type="button" className="waitlist-admin-delete" disabled={saving} onClick={()=>void remove(row)} aria-label={'Excluir inscrição de '+row.email}>Excluir</button></td>
          </tr>)}</tbody>
        </table></div>:<p className="waitlist-admin-empty">Ainda não há inscrições para este filtro.</p>}
      {result&&result.total>100&&<div className="waitlist-admin-pages">
        <button type="button" className="button ghost" disabled={loading||page===0} onClick={()=>setPage(n=>n-1)}>Anterior</button>
        <span>Página {page+1} de {Math.ceil(result.total/100)}</span>
        <button type="button" className="button ghost" disabled={loading||(page+1)*100>=result.total} onClick={()=>setPage(n=>n+1)}>Próxima</button>
      </div>}
    </div>
    <p className="waitlist-admin-foot">Dados pessoais: use apenas para informar os interessados sobre a formação, sem repassar a terceiros. Exclua inscrições quando solicitado.</p>
  </section>;
}
