import { useMemo, useState } from 'react';
import { lessons } from '../data/lessons';
import { lessonDetails } from '../data/lessonDetails';
import { getLessonState, updateLessonState } from '../lib/storage';
import { CurriculumBrowser } from './curriculum/CurriculumBrowser';
import { hasNativeV2Lesson } from '../content/registry';
import { LessonViewerV2 } from './lesson-v2/LessonViewerV2';

export function LessonList(props:{initialTrack?:string;initialMode?:'main'|'parallel'}) {
  return <CurriculumBrowser {...props} />;
}

function LegacyLessonList({initialTrack}:{initialTrack?:string}) {
  const [query,setQuery]=useState('');
  const [track,setTrack]=useState(initialTrack || 'Todas');
  const state=getLessonState();
  const tracks=['Todas','Web','Sistemas','Active Directory','Blue Team','Antivírus/EDR'];
  const filtered=useMemo(()=>lessons.filter(l => (track==='Todas'||l.track===track) && (`${l.id} ${l.title} ${l.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))),[query,track]);
  return <div className="page stack-lg">
    <section className="page-title"><div><span className="eyebrow">AULAS 43–100</span><h1>Biblioteca de aulas</h1><p>Aulas completas com teoria, exemplos, código, laboratório, revisão e jogos.</p></div></section>
    <section className="filter-bar">
      <input className="search" placeholder="Buscar aula, termo ou número…" value={query} onChange={(e:any)=>setQuery(e.target.value)} />
      <div className="chips">{tracks.map(t=><button className={track===t?'chip active':'chip'} onClick={()=>setTrack(t)} key={t}>{t}</button>)}</div>
    </section>
    <section className="lesson-grid">
      {filtered.map(l=><a href={`#lesson/${l.id}`} className="lesson-card" key={l.id}>
        <div className="lesson-number">{l.id}</div>
        <div className="lesson-body"><div className="lesson-meta"><span>{l.track}</span>{l.pcPractice&&<b>Prática no PC</b>}</div><h3>{l.title}</h3><p>{l.summary}</p><div className="tags">{l.tags.slice(0,3).map(t=><span key={t}>{t}</span>)}</div></div>
        <div className={`status-dot ${state[l.id]?.completed?'done':''}`} title={state[l.id]?.completed?'Concluída':'Pendente'} />
      </a>)}
    </section>
  </div>;
}

export function LessonViewer(props:{id:number;onRefresh:()=>void}) {
  if (hasNativeV2Lesson(props.id)) {
    return <LessonViewerV2 {...props} />;
  }
  return <LegacyLessonViewer {...props} />;
}

function LegacyLessonViewer({id,onRefresh}:{id:number;onRefresh:()=>void}) {
  const lesson=lessons.find(l=>l.id===id) || lessons[0];
  const detail=lessonDetails[lesson.id];
  const state=getLessonState()[lesson.id] || {completed:false,favorite:false,doubt:false,quizBest:0};
  const [quizIndex,setQuizIndex]=useState(0);
  const [selected,setSelected]=useState<number|null>(null);
  const [quizCorrect,setQuizCorrect]=useState(0);
  const [quizDone,setQuizDone]=useState(false);
  const [copied,setCopied]=useState(false);
  const q=lesson.quiz[quizIndex];
  const prev=lessons.find(l=>l.id===lesson.id-1);
  const next=lessons.find(l=>l.id===lesson.id+1);

  const answer=()=>{
    if(selected===null) return;
    const correct=selected===q.answer;
    const total=quizCorrect+(correct?1:0);
    if(quizIndex===lesson.quiz.length-1){
      const score=Math.round(total/lesson.quiz.length*100);
      updateLessonState(lesson.id,{quizBest:Math.max(state.quizBest||0,score)});
      setQuizCorrect(total); setQuizDone(true); onRefresh();
    } else {
      if(correct) setQuizCorrect(x=>x+1);
      setQuizIndex(x=>x+1); setSelected(null);
    }
  };

  const toggle=(key:'completed'|'favorite'|'doubt')=>{ updateLessonState(lesson.id,{[key]:!state[key]}); onRefresh(); };
  const notes=`Aula ${lesson.id} — ${lesson.title}\n\n${lesson.summary}\n\nPor que importa: ${detail?.why || ''}\n\nDefesa: ${lesson.defend}\nDetecção: ${lesson.detect}`;

  const copyCode=async()=>{
    if(!detail) return;
    await navigator.clipboard?.writeText(detail.code);
    setCopied(true);
    setTimeout(()=>setCopied(false),1400);
  };

  return <div className="page lesson-view stack-lg">
    <section className="lesson-hero panel">
      <div className="lesson-kicker"><span>AULA {lesson.id}</span><span>{lesson.track}</span><span>{lesson.level}</span>{lesson.pcPractice&&<span className="pc-badge">Prática no PC</span>}</div>
      <h1>{lesson.title}</h1><p>{lesson.summary}</p>
      <div className="hero-actions wrap">
        <button className={state.completed?'button primary':'button ghost'} onClick={()=>toggle('completed')}>{state.completed?'✓ Concluída':'Marcar como concluída'}</button>
        <button className="button ghost" onClick={()=>toggle('favorite')}>{state.favorite?'★ Favorita':'☆ Favoritar'}</button>
        <button className="button ghost" onClick={()=>toggle('doubt')}>{state.doubt?'? Dúvida marcada':'Marcar dúvida'}</button>
        <button className="button ghost" onClick={()=>navigator.clipboard?.writeText(notes)}>Copiar resumo</button>
      </div>
    </section>

    <section className="panel lesson-outline">
      <span className="eyebrow">ROTEIRO DA AULA</span>
      <div className="outline-grid">
        <a href="#conteudo">1. Conteúdo</a><a href="#fluxo">2. Como funciona</a><a href="#codigo">3. Código</a><a href="#laboratorio">4. Laboratório</a><a href="#conceitos">5. Conceitos</a><a href="#revisao">6. Revisão</a>
      </div>
    </section>

    <section className="panel stack" id="conteudo">
      <div className="section-head"><div><span className="eyebrow">CONTEÚDO DA AULA</span><h2>Entenda antes de decorar</h2></div></div>
      <div className="lesson-reading">
        <p className="lead">{lesson.summary}</p>
        <div className="reading-block"><h3>Por que isso importa?</h3><p>{detail?.why}</p></div>
        <div className="reading-block"><h3>O raciocínio defensivo</h3><p>{lesson.defend}</p><p><strong>O que observar:</strong> {lesson.detect}</p></div>
      </div>
    </section>

    <section className="panel stack" id="fluxo">
      <span className="eyebrow">COMO FUNCIONA</span><h2>Fluxo mental da aula</h2>
      <div className="vertical-flow">{detail?.flow.map((step,i)=><div className="flow-step" key={step}><b>{String(i+1).padStart(2,'0')}</b><span>{step}</span></div>)}</div>
    </section>

    <section className="panel code-panel stack" id="codigo">
      <div className="code-head"><div><span className="eyebrow">EXEMPLO TÉCNICO</span><h2>{detail?.codeTitle}</h2></div><button className="button ghost" onClick={copyCode}>{copied?'✓ Copiado':'Copiar código'}</button></div>
      <div className="code-meta"><span>{detail?.language}</span><span>Exemplo educacional / ambiente autorizado</span></div>
      <pre className="code-block"><code>{detail?.code}</code></pre>
      <p className="code-note">{detail?.codeNote}</p>
    </section>

    <section className="panel lab-panel stack" id="laboratorio">
      <div className="lab-head"><div><span className="eyebrow">LABORATÓRIO GUIADO</span><h2>{detail?.labTitle}</h2></div><span className={`lab-mode ${detail?.labMode.includes('PC')?'pc':''}`}>{detail?.labMode}</span></div>
      <p>Faça somente em equipamento, VM, WSL, aplicação ou domínio que você controla e autorizou para estudo.</p>
      <ol className="lab-steps">{detail?.labSteps.map((step,i)=><li key={step}><b>{i+1}</b><span>{step}</span></li>)}</ol>
      <div className="expected-result"><span>RESULTADO ESPERADO</span><p>{detail?.expected}</p></div>
    </section>

    <section className="panel stack" id="conceitos">
      <span className="eyebrow">CONCEITOS-CHAVE</span><h2>Mapa legível, sem arrastar para o lado</h2>
      <div className="concept-list">{lesson.concepts.map((c,i)=><div className="concept-row" key={c.term}><b>{String(i+1).padStart(2,'0')}</b><div><strong>{c.term}</strong><p>{c.definition}</p></div></div>)}</div>
    </section>

    <section className="panel stack">
      <div className="section-head"><div><span className="eyebrow">OBJETIVOS</span><h2>O que você precisa sair sabendo</h2></div></div>
      <div className="objective-list">{lesson.objectives.map((o,i)=><div className="objective-row" key={o}><b>0{i+1}</b><span>{o}</span></div>)}</div>
    </section>

    <section className="two-col">
      <div className="panel callout defend"><span className="eyebrow">COMO DEFENDER</span><h2>Reduza o risco</h2><p>{lesson.defend}</p></div>
      <div className="panel callout detect"><span className="eyebrow">COMO DETECTAR</span><h2>Procure evidências</h2><p>{lesson.detect}</p></div>
    </section>

    <section className="panel challenge"><div><span className="eyebrow">MINI DESAFIO</span><h2>Pense antes de revelar</h2><p>{lesson.challenge}</p></div><details><summary>Ver orientação</summary><p>Comece comparando definição, pré-condições e evidências observáveis. Depois escolha um controle que quebre a cadeia de risco.</p></details></section>

    <section className="two-col align-start" id="revisao">
      <div className="panel stack">
        <div className="section-head"><div><span className="eyebrow">QUIZ</span><h2>Checagem de compreensão</h2></div><span>{quizDone?lesson.quiz.length:quizIndex+1}/{lesson.quiz.length}</span></div>
        {quizDone ? <div className="result-card"><strong>{Math.round(quizCorrect/lesson.quiz.length*100)}%</strong><p>Melhor score salvo: {Math.max(state.quizBest||0,Math.round(quizCorrect/lesson.quiz.length*100))}%</p><button className="button ghost" onClick={()=>{setQuizIndex(0);setSelected(null);setQuizCorrect(0);setQuizDone(false)}}>Refazer quiz</button></div> : <>
          <h3>{q.q}</h3><div className="option-list">{q.options.map((op,i)=><button className={selected===i?'option selected':'option'} onClick={()=>setSelected(i)} key={`${i}-${op}`}>{op}</button>)}</div>
          {selected!==null&&<div className={selected===q.answer?'feedback ok':'feedback bad'}>{selected===q.answer?'Correto. ':'Ainda não. '}{q.why}</div>}
          <button className="button primary" disabled={selected===null} onClick={answer}>{quizIndex===lesson.quiz.length-1?'Finalizar':'Próxima'}</button>
        </>}
      </div>
      <div className="panel stack">
        <div className="section-head"><div><span className="eyebrow">FLASHCARDS</span><h2>Revisão sem carrossel</h2></div><span>{lesson.flashcards.length} cartões</span></div>
        <div className="flashcard-list">{lesson.flashcards.map((fc,i)=><details className="flashcard-row" key={fc.front}><summary><b>{String(i+1).padStart(2,'0')}</b><span>{fc.front}</span><i>+</i></summary><p>{fc.back}</p></details>)}</div>
      </div>
    </section>

    <section className="lesson-nav">{prev?<a href={`#lesson/${prev.id}`}>← Aula {prev.id}</a>:<span/>}<a href="#games">Revisar em jogos</a>{next?<a href={`#lesson/${next.id}`}>Aula {next.id} →</a>:<span/>}</section>
  </div>;
}
