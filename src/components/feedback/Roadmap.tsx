import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { platformApi } from '../PlatformGate';
import AcademyBrand from '../AcademyBrand';
import './feedback.css';
import './roadmap.css';

type Stage='under_review'|'planned'|'in_progress'|'released';
type Idea={id:string;feedbackId?:string;title:string;summary:string;stage:Stage;votes:number;voted?:boolean;publishedAt:string;updatedAt?:string};
type Release={id:string;feedbackId?:string;title:string;summary:string;publishedAt:string;sourceTitle?:string};
type PublicData={ideas:Idea[];releases:Release[];authenticated:boolean};
type AdminData={ideas:Idea[];releases:Release[]};
const stages:Record<Stage,string>={under_review:'Em avaliação',planned:'Planejado',in_progress:'Em desenvolvimento',released:'Entregue'};
const order:Stage[]=['in_progress','planned','under_review','released'];
const errorText=(e:unknown)=>e instanceof Error?e.message:String(e);
const date=(s:string)=>new Date(s).toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});

export function RoadmapPage({embedded=false}:{embedded?:boolean}){
  const [data,setData]=useState<PublicData|null>(null);
  const [busy,setBusy]=useState('');
  const [error,setError]=useState('');
  const [tab,setTab]=useState<'ideas'|'releases'>('ideas');
  const [sort,setSort]=useState<'progress'|'votes'>('progress');
  const reload=useCallback(async()=>{
    const result=await platformApi<PublicData>('/api/roadmap');
    setData(result);
  },[]);
  useEffect(()=>{
    let active=true;
    void platformApi<PublicData>('/api/roadmap').then(r=>{if(active)setData(r);}).catch(e=>{if(active)setError(errorText(e));});
    return()=>{active=false;};
  },[]);
  const vote=async(idea:Idea)=>{
    if(!data?.authenticated||busy)return;
    setError('');setBusy(idea.id);
    try{await platformApi('/api/roadmap/ideas/'+encodeURIComponent(idea.id)+'/vote',idea.voted?'DELETE':'POST');await reload();}
    catch(e){setError(errorText(e));}
    finally{setBusy('');}
  };
  const list=[...(data?.ideas??[])].sort((a,b)=>sort==='votes'?(b.votes-a.votes)||a.title.localeCompare(b.title):
    order.indexOf(a.stage)-order.indexOf(b.stage)||b.votes-a.votes);
  const content=<div className={'roadmap-shell hub-secondary '+(embedded?'roadmap-embedded':'roadmap-standalone')}>
    <header className="roadmap-heading">
      <span className="eyebrow">CONSTRUÍDO COM A COMUNIDADE</span>
      <h1>O que vem por aí no HubEstudos</h1>
      <p>Veja melhorias que estão sendo avaliadas, planejadas ou desenvolvidas, e as atualizações que já foram entregues. As sugestões publicadas foram revisadas pela equipe.</p>
      <div className="roadmap-actions"><button className={tab==='ideas'?'roadmap-tab active':'roadmap-tab'} aria-pressed={tab==='ideas'} onClick={()=>setTab('ideas')}>Roadmap</button><button className={tab==='releases'?'roadmap-tab active':'roadmap-tab'} aria-pressed={tab==='releases'} onClick={()=>setTab('releases')}>Novidades entregues</button></div>
    </header>
    {error&&<div className="feedback-error" role="alert">{error} <button type="button" onClick={()=>void reload().then(()=>setError('')).catch(e=>setError(errorText(e)))}>Tentar novamente</button></div>}
    {!data&&!error&&<p role="status">Carregando as melhorias da comunidade…</p>}
    {data&&tab==='ideas'&&<>
      <div className="roadmap-sort"><span>{data.ideas.length} {data.ideas.length===1?'sugestão publicada':'sugestões publicadas'}</span><label>Ordenar por <select value={sort} onChange={e=>setSort(e.target.value as typeof sort)}><option value="progress">Etapa</option><option value="votes">Mais apoiadas</option></select></label></div>
      {!list.length?<div className="panel roadmap-empty"><h2>Ainda não há sugestões publicadas.</h2><p>Quando as primeiras propostas forem revisadas, aparecerão aqui.</p><a className="button ghost" href={embedded?'#feedback':'/academy/study#feedback'}>Compartilhar uma ideia</a></div>:
      <div className="roadmap-grid">{list.map(idea=><article className="roadmap-idea" key={idea.id}>
        <div className="roadmap-idea-top"><span className={'roadmap-stage stage-'+idea.stage}>{stages[idea.stage]}</span><span className="roadmap-date">{date(idea.publishedAt)}</span></div>
        <h2>{idea.title}</h2><p>{idea.summary}</p>
        <div className="roadmap-card-footer"><span>{idea.votes} {idea.votes===1?'apoio':'apoios'}</span>
          {idea.stage==='released'?<span className="roadmap-delivered">Melhoria entregue</span>:
            data.authenticated?<button className={idea.voted?'button primary roadmap-vote supported':'button ghost roadmap-vote'} type="button" disabled={busy===idea.id} aria-pressed={Boolean(idea.voted)} aria-label={idea.voted?`Retirar apoio a ${idea.title}`:`Apoiar ${idea.title}`} onClick={()=>void vote(idea)}>{busy===idea.id?'Salvando…':idea.voted?'Apoiado · remover voto':'Apoiar sugestão'}</button>:
            <a className="button ghost roadmap-vote" href="/academy/study?next=roadmap">Entrar para apoiar</a>}
        </div>
      </article>)}</div>}
      <p className="roadmap-note">Apoiar uma sugestão sinaliza interesse, não garante prazo nem implementação. Você pode retirar seu apoio a qualquer momento.</p>
    </>}
    {data&&tab==='releases'&&<section aria-label="Novidades entregues" className="roadmap-changelog">
      {!data.releases.length?<div className="panel roadmap-empty"><h2>As novidades aparecerão aqui.</h2><p>A equipe publicará as melhorias entregues, com referência às sugestões recebidas.</p></div>:
      data.releases.map(item=><article className="roadmap-release" key={item.id}><div className="roadmap-release-marker" aria-hidden="true"/><div><span className="roadmap-date">{date(item.publishedAt)}</span><h2>{item.title}</h2><p>{item.summary}</p><small>Origem: {item.sourceTitle??'Feedback da comunidade'}</small></div></article>)}
    </section>}
  </div>;
  if(embedded)return <div className="page roadmap-page">{content}</div>;
  return <div className="roadmap-public-layout"><nav className="roadmap-public-nav"><a href="/academy" aria-label="Academy início"><AcademyBrand/></a><a className="button ghost" href="/academy/study">Entrar no Hub</a></nav><main>{content}</main><footer className="roadmap-public-footer"><a href="/academy">Conhecer a Academy</a><span>ArtiSys · HubEstudos</span></footer></div>;
}

export function RoadmapManager({revision=0}:{revision?:number}){
  const [data,setData]=useState<AdminData|null>(null);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState('');
  const reload=useCallback(async()=>setData(await platformApi<AdminData>('/api/admin/roadmap')),[]);
  useEffect(()=>{void reload().then(()=>setError('')).catch(e=>setError(errorText(e)));},[reload,revision]);
  const change=async(id:string,stage:Stage)=>{
    setBusy(id);setError('');
    try{await platformApi('/api/admin/roadmap/ideas/'+encodeURIComponent(id),'PATCH',{stage});await reload();}
    catch(e){setError(errorText(e));}
    finally{setBusy('');}
  };
  const remove=async(kind:'ideas'|'releases',id:string,title:string)=>{
    if(!window.confirm('Retirar "'+title+'" do público? Esta ação não apaga o feedback original.'))return;
    setBusy(id);setError('');
    try{await platformApi('/api/admin/roadmap/'+kind+'/'+encodeURIComponent(id),'DELETE');await reload();}
    catch(e){setError(errorText(e));}
    finally{setBusy('');}
  };
  return <section className="panel roadmap-management" aria-labelledby="roadmap-admin-title">
    <div className="section-head"><div><span className="eyebrow">CONTEÚDO PÚBLICO</span><h2 id="roadmap-admin-title">Roadmap e novidades publicadas</h2><p>Somente textos aprovados aparecem publicamente. O andamento do feedback privado e a etapa pública são estados diferentes; altere cada um conforme necessário.</p></div><a className="button ghost" href="/academy/roadmap" target="_blank" rel="noopener noreferrer">Ver página pública</a></div>
    {error&&<p className="feedback-error" role="alert">{error}</p>}
    {!data?(error?<button className="button ghost" onClick={()=>void reload().then(()=>setError('')).catch(e=>setError(errorText(e)))}>Recarregar publicações</button>:<p role="status">Carregando publicações…</p>):<>
      <h3>Sugestões públicas ({data.ideas.length})</h3>
      {!data.ideas.length&&<p className="muted">Abra uma sugestão na lista de feedbacks para publicá-la.</p>}
      <div className="roadmap-admin-list">{data.ideas.map(idea=><div className="roadmap-admin-row" key={idea.id}>
        <div><strong>{idea.title}</strong><small>{idea.votes} apoios · {idea.summary}</small></div>
        <label>Etapa<select disabled={busy===idea.id} aria-label={'Etapa de '+idea.title} value={idea.stage} onChange={e=>void change(idea.id,e.target.value as Stage)}>{Object.entries(stages).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
        <button className="button ghost" type="button" disabled={busy===idea.id} onClick={()=>void remove('ideas',idea.id,idea.title)}>Retirar</button>
      </div>)}</div>
      <h3>Changelog ({data.releases.length})</h3>
      {!data.releases.length&&<p className="muted">Ao entregar uma melhoria, abra o feedback correspondente para publicar uma nota.</p>}
      <div className="roadmap-admin-list">{data.releases.map(release=><div className="roadmap-admin-row" key={release.id}>
        <div><strong>{release.title}</strong><small>{date(release.publishedAt)} · {release.summary}</small></div>
        <button className="button ghost" type="button" disabled={busy===release.id} onClick={()=>void remove('releases',release.id,release.title)}>Retirar nota</button>
      </div>)}</div>
    </>}
  </section>;
}

export function FeedbackPublication({feedbackId,category,sourceTitle,onPublished}:{feedbackId:string;category:string;sourceTitle:string;onPublished:()=>void}){
  const [mode,setMode]=useState<'idle'|'idea'|'release'>('idle');
  const [title,setTitle]=useState('');
  const [summary,setSummary]=useState('');
  const [stage,setStage]=useState<Stage>('under_review');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [done,setDone]=useState('');
  const [nonce,setNonce]=useState(()=>crypto.randomUUID());
  const send=async(e:FormEvent)=>{
    e.preventDefault();if(busy)return;
    setBusy(true);setError('');setDone('');
    try{
      if(mode==='idea')await platformApi('/api/admin/feedback/'+encodeURIComponent(feedbackId)+'/publish','POST',{title,summary,stage});
      else await platformApi('/api/admin/roadmap/releases','POST',{feedbackId,title,summary,clientNonce:nonce});
      setDone(mode==='idea'?'Sugestão publicada no roadmap.':'Novidade publicada no changelog.');
      if(mode==='release')setNonce(crypto.randomUUID());
      onPublished();setMode('idle');setTitle('');setSummary('');
    }catch(err){setError(errorText(err));}
    finally{setBusy(false);}
  };
  return <section className="feedback-publication" aria-label="Publicação para comunidade">
    <h3>Comunidade e evolução</h3>
    <p>Relato de origem: <strong>{sourceTitle}</strong>. O título e a descrição públicos são escritos separadamente. Nunca copie dados pessoais, mensagens ou anexos.</p>
    <div className="feedback-publication-actions">{category==='idea'&&<button className="button ghost" type="button" onClick={()=>{setMode('idea');setDone('');setError('');}}>Publicar sugestão</button>}
      <button className="button ghost" type="button" onClick={()=>{setMode('release');setDone('');setError('');}}>Registrar melhoria entregue</button></div>
    {mode!=='idle'&&<form className="feedback-form roadmap-publish-form" onSubmit={send}>
      <p className="roadmap-public-warning">Estes textos ficarão visíveis publicamente, inclusive para pessoas sem conta.</p>
      <label>Título público<input required minLength={8} maxLength={120} placeholder="Título revisado, sem informações pessoais" value={title} onChange={e=>setTitle(e.target.value)}/></label>
      <label>{mode==='idea'?'Resumo da sugestão':'O que mudou'}<textarea required minLength={15} maxLength={mode==='idea'?500:800} rows={3} placeholder="Descreva apenas conteúdo apropriado para divulgação" value={summary} onChange={e=>setSummary(e.target.value)}/></label>
      {mode==='idea'&&<label>Etapa do roadmap<select value={stage} onChange={e=>setStage(e.target.value as Stage)}>{Object.entries(stages).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>}
      {mode==='release'&&<p className="roadmap-note">A nota ficará ligada a este feedback; se houver sugestão pública correspondente, ela será marcada como entregue.</p>}
      <div className="feedback-actions"><button className="button ghost" type="button" disabled={busy} onClick={()=>setMode('idle')}>Cancelar</button><button className="button primary" disabled={busy}>{busy?'Publicando…':'Confirmar publicação pública'}</button></div>
    </form>}
    {done&&<p className="roadmap-publish-ok" role="status">{done}</p>}
    {error&&<p className="feedback-error" role="alert">{error}</p>}
  </section>;
}
