import { useEffect, useRef, useState, type FormEvent } from 'react';
import { platformApi, type PlatformUser } from '../PlatformGate';
import './feedback.css';

type Category='bug'|'content'|'idea'|'other';
type Status='new'|'in_review'|'planned'|'resolved'|'closed';
type Priority='low'|'normal'|'high'|'critical';
type Report={
  id:string;user_id:string;category:Category;title:string;description:string;
  contextPath:string;contextLabel:string;status:Status;priority:Priority;
  createdAt:string;updatedAt:string;hasUpdates:number;authorName:string;authorEmail:string;
};
type Message={id:string;body:string;createdAt:string;authorName:string;authorRole:string};
type History={kind:string;value:string;createdAt:string;authorName:string};
type Listing={feedback:Report[];total:number;page:number;hasMore:boolean};
type Detail={feedback:Report;messages:Message[];history:History[];hasAttachment:boolean};
const categories:Record<Category,string>={bug:'Problema técnico',content:'Erro no conteúdo',idea:'Sugestão de melhoria',other:'Outro assunto'};
const statuses:Record<Status,string>={new:'Novo',in_review:'Em análise',planned:'Planejado',resolved:'Resolvido',closed:'Encerrado'};
const priorities:Record<Priority,string>={low:'Baixa',normal:'Normal',high:'Alta',critical:'Crítica'};
const stamp=(value:string)=>new Date(value).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});
const errText=(value:unknown)=>value instanceof Error?value.message:String(value);

async function prepareImage(file:File):Promise<string>{
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8_000_000)
    throw Error('Selecione uma imagem PNG, JPEG ou WebP de até 8 MB.');
  const bitmap=await createImageBitmap(file);
  try{
    let scale=Math.min(1,1280/bitmap.width,1280/bitmap.height);
    for(let attempt=0;attempt<7;attempt++){
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(bitmap.width*scale));
      canvas.height=Math.max(1,Math.round(bitmap.height*scale));
      const ctx=canvas.getContext('2d');
      if(!ctx)throw Error('Não foi possível preparar a imagem.');
      ctx.fillStyle='#ffffff';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
      const encoded=canvas.toDataURL('image/jpeg',Math.max(0.35,0.78-attempt*0.08));
      if(encoded.length<=220000)return encoded;
      scale*=0.8;
    }
    throw Error('A imagem ainda ficou muito grande. Tente recortar antes de anexar.');
  }finally{bitmap.close();}
}

export function FeedbackComposer({context,onClose}:{context:{contextPath:string;contextLabel:string};onClose:()=>void}){
  const [category,setCategory]=useState<Category>('bug');
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [attachment,setAttachment]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  const [preparing,setPreparing]=useState(false);
  const [error,setError]=useState('');
  const [sentId,setSentId]=useState('');
  const nonce=useRef(crypto.randomUUID());
  const first=useRef<HTMLSelectElement>(null);
  useEffect(()=>{
    first.current?.focus();
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!busy)onClose();};
    window.addEventListener('keydown',key);
    return()=>window.removeEventListener('keydown',key);
  },[busy,onClose]);
  const chooseFile=async(file?:File)=>{
    if(!file)return;
    setPreparing(true);setError('');
    try{setAttachment(await prepareImage(file));}
    catch(e){setError(errText(e));}
    finally{setPreparing(false);}
  };
  const submit=async(event:FormEvent)=>{
    event.preventDefault();
    if(busy||preparing)return;
    setBusy(true);setError('');
    try{
      const result=await platformApi<{feedback:{id:string}}>('/api/feedback','POST',{
        clientNonce:nonce.current,category,title,description,attachment,
        contextPath:context.contextPath,contextLabel:context.contextLabel
      });
      setSentId(result.feedback.id);
    }catch(e){setError(errText(e));}
    finally{setBusy(false);}
  };
  return <div className="feedback-overlay" onMouseDown={e=>{if(e.target===e.currentTarget&&!busy)onClose();}}>
    <section className="feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="feedback-dialog-title">
      <header className="feedback-dialog-top">
        <div><span className="eyebrow">HUBESTUDOS</span><h2 id="feedback-dialog-title">{sentId?'Feedback registrado':'Enviar feedback'}</h2></div>
        <button type="button" className="feedback-close" onClick={onClose} aria-label="Fechar" disabled={busy}>×</button>
      </header>
      {sentId?<div className="feedback-success" role="status">
        <strong>Seu feedback foi salvo.</strong>
        <p>Você pode acompanhar a situação, conversar com a equipe e consultar as respostas a qualquer momento.</p>
        <div className="feedback-actions"><a className="button primary" href="#feedback" onClick={onClose}>Ver meus feedbacks</a><button className="button ghost" onClick={onClose}>Voltar aos estudos</button></div>
      </div>:<form className="feedback-form" onSubmit={submit}>
        <p className="feedback-intro">Conte o que aconteceu ou o que poderia melhorar. Você não precisa sair da aula.</p>
        <label>Tipo de feedback
          <select ref={first} value={category} onChange={e=>setCategory(e.target.value as Category)}>
            {Object.entries(categories).map(([value,label])=><option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label>Resumo<input required minLength={5} maxLength={120} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ex.: O exemplo da aula está incorreto"/></label>
        <label>Descreva seu feedback<textarea required minLength={10} maxLength={4000} rows={5} value={description} onChange={e=>setDescription(e.target.value)} placeholder="O que aconteceu? Como você esperava que funcionasse?"/></label>
        <div className="feedback-context"><strong>Contexto vinculado automaticamente</strong><span>{context.contextLabel}</span></div>
        <label>Captura de tela (opcional)
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>void chooseFile(e.target.files?.[0])}/>
        </label>
        {preparing&&<p role="status">Preparando a captura de tela…</p>}
        {attachment&&<div className="feedback-attachment"><img src={attachment} alt="Prévia do anexo selecionado"/><button type="button" className="button ghost" onClick={()=>setAttachment(null)}>Remover imagem</button></div>}
        <p className="feedback-privacy">Evite incluir senhas, tokens, documentos pessoais ou dados de terceiros na descrição e na imagem.</p>
        {error&&<p className="feedback-error" role="alert">{error}</p>}
        <div className="feedback-actions"><button className="button ghost" type="button" onClick={onClose} disabled={busy}>Cancelar</button><button className="button primary" disabled={busy||preparing}>{busy?'Enviando…':'Enviar feedback'}</button></div>
      </form>}
    </section>
  </div>;
}

function FeedbackDetail({id,admin,onClose,onUpdate}:{id:string;admin:boolean;onClose:()=>void;onUpdate:()=>void}){
  const [detail,setDetail]=useState<Detail|null>(null);
  const [text,setText]=useState('');
  const [attachment,setAttachment]=useState('');
  const [busy,setBusy]=useState(false);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const reload=async()=>{
    const r=await platformApi<Detail>('/api/feedback/'+encodeURIComponent(id));
    setDetail(r);
  };
  useEffect(()=>{
    let active=true;setLoading(true);setError('');setAttachment('');
    void platformApi<Detail>('/api/feedback/'+encodeURIComponent(id))
      .then(r=>{if(active)setDetail(r);}).catch(e=>{if(active)setError(errText(e));})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[id]);
  const patch=async(fields:{status?:Status;priority?:Priority})=>{
    if(busy)return;
    setBusy(true);setError('');
    try{await platformApi('/api/admin/feedback/'+encodeURIComponent(id),'PATCH',fields);await reload();onUpdate();}
    catch(e){setError(errText(e));}
    finally{setBusy(false);}
  };
  const reply=async(e:FormEvent)=>{
    e.preventDefault();if(busy)return;
    setBusy(true);setError('');
    try{await platformApi('/api/feedback/'+encodeURIComponent(id)+'/messages','POST',{body:text});setText('');await reload();onUpdate();}
    catch(e){setError(errText(e));}
    finally{setBusy(false);}
  };
  const showAttachment=async()=>{
    setError('');
    try{const r=await platformApi<{dataUrl:string}>('/api/feedback/'+encodeURIComponent(id)+'/attachment');setAttachment(r.dataUrl);}
    catch(e){setError(errText(e));}
  };
  return <div className="feedback-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <section className="feedback-dialog feedback-detail" role="dialog" aria-modal="true" aria-labelledby="feedback-detail-title">
      <header className="feedback-dialog-top"><div><span className="eyebrow">ACOMPANHAMENTO</span><h2 id="feedback-detail-title">{detail?.feedback.title??'Detalhes do feedback'}</h2></div><button type="button" className="feedback-close" onClick={onClose} aria-label="Fechar">×</button></header>
      {loading&&<p role="status">Carregando relato…</p>}
      {detail&&<div className="feedback-form">
        <div className="feedback-meta"><span className={'feedback-status status-'+detail.feedback.status}>{statuses[detail.feedback.status]}</span><span>{categories[detail.feedback.category]}</span><span>{stamp(detail.feedback.createdAt)}</span></div>
        {admin&&<p className="feedback-author">{detail.feedback.authorName} · {detail.feedback.authorEmail}</p>}
        <p className="feedback-description">{detail.feedback.description}</p>
        <div className="feedback-context"><strong>Onde ocorreu</strong><span>{detail.feedback.contextLabel}</span><a href={detail.feedback.contextPath} onClick={onClose}>Abrir contexto da aula ↗</a></div>
        {detail.hasAttachment&&(attachment?<img className="feedback-detail-image" src={attachment} alt="Captura de tela anexada pelo autor"/>:<button className="button ghost" type="button" onClick={()=>void showAttachment()}>Exibir captura anexada</button>)}
        {admin&&<div className="feedback-admin-controls">
          <label>Situação<select disabled={busy} value={detail.feedback.status} onChange={e=>void patch({status:e.target.value as Status})}>{Object.entries(statuses).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
          <label>Prioridade<select disabled={busy} value={detail.feedback.priority} onChange={e=>void patch({priority:e.target.value as Priority})}>{Object.entries(priorities).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
        </div>}
        <section className="feedback-conversation"><h3>Conversa e atualizações</h3>
          {!detail.messages.length&&!detail.history.length&&<p className="muted">Nenhuma atualização ainda.</p>}
          {[...detail.messages.map(m=>({...m,kind:'message',value:m.body})),...detail.history.map((h,i)=>({...h,id:'history-'+i,kind:h.kind}))].sort((a,b)=>a.createdAt.localeCompare(b.createdAt)).map(m=><div key={m.id} className="feedback-message">
            <div><strong>{m.authorName}</strong><small>{stamp(m.createdAt)}</small></div>
            <p>{m.kind==='message'?m.value:m.kind==='status'?'Situação alterada para '+statuses[m.value as Status]:'Prioridade alterada para '+priorities[m.value as Priority]}</p>
          </div>)}
        </section>
        <form onSubmit={reply} className="feedback-response-form"><label>{admin?'Responder ao aluno':'Adicionar informação'}<textarea required rows={3} minLength={2} maxLength={2000} value={text} onChange={e=>setText(e.target.value)}/></label><button className="button primary" disabled={busy}>{busy?'Salvando…':'Enviar mensagem'}</button></form>
      </div>}
      {error&&<p className="feedback-error" role="alert">{error}</p>}
    </section>
  </div>;
}

export function FeedbackBoard({user,admin=false}:{user:PlatformUser;admin?:boolean}){
  const [items,setItems]=useState<Report[]>([]);
  const [page,setPage]=useState(0);
  const [total,setTotal]=useState(0);
  const [more,setMore]=useState(false);
  const [status,setStatus]=useState<'all'|Status>('all');
  const [selected,setSelected]=useState('');
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const endpoint=admin?'/api/admin/feedback':'/api/feedback';
  const load=async()=>{
    const r=await platformApi<Listing>(endpoint+'?page='+page+(admin?'&status='+status:''));
    setItems(r.feedback);setTotal(r.total);setMore(r.hasMore);
  };
  useEffect(()=>{
    let active=true;
    setLoading(true);setError('');
    void platformApi<Listing>(endpoint+'?page='+page+(admin?'&status='+status:''))
      .then(r=>{if(active){setItems(r.feedback);setTotal(r.total);setMore(r.hasMore);}})
      .catch(e=>{if(active)setError(errText(e));})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[endpoint,page,admin,status]);
  return <div className="page stack-lg feedback-page">
    <section className="page-title"><span className="eyebrow">{admin?'ADMINISTRAÇÃO':'CENTRAL DE FEEDBACK'}</span><h1>{admin?'Feedback dos alunos':'Meus feedbacks'}</h1><p>{admin?'Acompanhe problemas, sugestões e correções solicitadas pelos alunos.':'Acompanhe seus relatos, veja o andamento e converse com a equipe.'}</p></section>
    <section className="panel feedback-board">
      <div className="feedback-board-head"><h2>{admin?'Relatos recebidos':'Histórico de envios'} <span className="feedback-counter">{total}</span></h2>{admin&&<label className="feedback-filter">Filtrar situação<select value={status} onChange={e=>{setPage(0);setStatus(e.target.value as typeof status);}}><option value="all">Todas</option>{Object.entries(statuses).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>}</div>
      {loading?<p role="status">Carregando feedbacks…</p>:!items.length?<div className="feedback-empty"><strong>{error?'Não foi possível consultar':'Nenhum feedback nesta lista'}</strong><p>{error||'Os relatos aparecerão aqui assim que forem enviados.'}</p><button className="button ghost" onClick={()=>void load().catch(e=>setError(errText(e)))}>Atualizar</button></div>:<div className="feedback-list">
        {items.map(item=><button key={item.id} type="button" className="feedback-item" onClick={()=>setSelected(item.id)}>
          <span className="feedback-item-main"><strong>{item.title}</strong><small>{categories[item.category]} · {item.contextLabel}{admin?' · '+item.authorName:''}</small><small>{stamp(item.createdAt)}</small>{!admin&&Boolean(item.hasUpdates)&&<small className="feedback-unread">Nova atualização disponível</small>}</span><span className={'feedback-status status-'+item.status}>{statuses[item.status]}</span>
        </button>)}
      </div>}
      {total>30&&<div className="feedback-pagination"><button className="button ghost" onClick={()=>setPage(x=>Math.max(0,x-1))} disabled={page===0||loading}>Anterior</button><span>Página {page+1}</span><button className="button ghost" onClick={()=>setPage(x=>x+1)} disabled={!more||loading}>Próxima</button></div>}
    </section>
    {admin&&<p className="muted">Apenas administradores podem consultar todos os relatos, definir prioridades e alterar situações.</p>}
    {selected&&<FeedbackDetail id={selected} admin={admin&&user.role==='admin'} onClose={()=>setSelected('')} onUpdate={()=>void load().catch(e=>setError(errText(e)))}/>}
  </div>;
}
