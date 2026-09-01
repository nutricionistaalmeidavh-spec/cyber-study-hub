import { useMemo, useState } from 'react';
import { lessons } from '../data/lessons';
import { getLessonState, updateLessonState } from '../lib/storage';
import type { Lesson, Track } from '../types';

export function LessonList({initialTrack}:{initialTrack?:string}) {
  const [query,setQuery]=useState('');
  const [track,setTrack]=useState(initialTrack || 'Todas');
  const state=getLessonState();
  const tracks=['Todas','Web','Sistemas','Active Directory','Blue Team','Antivírus/EDR'];
  const filtered=useMemo(()=>lessons.filter(l => (track==='Todas'||l.track===track) && (`${l.id} ${l.title} ${l.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))),[query,track]);
  return <div className="page stack-lg">
    <section className="page-title"><div><span className="eyebrow">AULAS 43–100</span><h1>Biblioteca de aulas</h1><p>Conteúdo curto, visual e conectado à prática defensiva.</p></div></section>
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

export function LessonViewer({id,onRefresh}:{id:number;onRefresh:()=>void}) {
  const lesson=lessons.find(l=>l.id===id) || lessons[0];
  const state=getLessonState()[lesson.id] || {completed:false,favorite:false,doubt:false,quizBest:0};
  const [quizIndex,setQuizIndex]=useState(0);
  const [selected,setSelected]=useState<number|null>(null);
  const [quizCorrect,setQuizCorrect]=useState(0);
  const [quizDone,setQuizDone]=useState(false);
  const [card,setCard]=useState(0);
  const [flipped,setFlipped]=useState(false);
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
  const notes=`Aula ${lesson.id} — ${lesson.title}\n\n${lesson.summary}\n\nDefesa: ${lesson.defend}\nDetecção: ${lesson.detect}`;

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

    <section className="panel stack">
      <div className="section-head"><div><span className="eyebrow">OBJETIVOS</span><h2>O que você precisa sair sabendo</h2></div></div>
      <div className="objective-grid">{lesson.objectives.map((o,i)=><div className="objective" key={o}><b>0{i+1}</b><span>{o}</span></div>)}</div>
    </section>

    <section className="panel stack">
      <span className="eyebrow">MAPA VISUAL</span><h2>Conceitos que se conectam</h2>
      <div className="concept-flow">{lesson.concepts.map((c,i)=><div className="concept-wrap" key={c.term}><div className="concept-card"><strong>{c.term}</strong><p>{c.definition}</p></div>{i<lesson.concepts.length-1&&<span className="flow-arrow">→</span>}</div>)}</div>
    </section>

    <section className="two-col">
      <div className="panel callout defend"><span className="eyebrow">COMO DEFENDER</span><h2>Reduza o risco</h2><p>{lesson.defend}</p></div>
      <div className="panel callout detect"><span className="eyebrow">COMO DETECTAR</span><h2>Procure evidências</h2><p>{lesson.detect}</p></div>
    </section>

    <section className="panel challenge"><div><span className="eyebrow">MINI DESAFIO</span><h2>Pense antes de revelar</h2><p>{lesson.challenge}</p></div><details><summary>Ver orientação</summary><p>Comece comparando definição, pré-condições e evidências observáveis. Depois escolha um controle que quebre a cadeia de risco.</p></details></section>

    <section className="two-col align-start">
      <div className="panel stack">
        <div className="section-head"><div><span className="eyebrow">QUIZ</span><h2>Checagem de compreensão</h2></div><span>{quizDone?lesson.quiz.length:quizIndex+1}/{lesson.quiz.length}</span></div>
        {quizDone ? <div className="result-card"><strong>{Math.round(quizCorrect/lesson.quiz.length*100)}%</strong><p>Melhor score salvo: {Math.max(state.quizBest||0,Math.round(quizCorrect/lesson.quiz.length*100))}%</p><button className="button ghost" onClick={()=>{setQuizIndex(0);setSelected(null);setQuizCorrect(0);setQuizDone(false)}}>Refazer quiz</button></div> : <>
          <h3>{q.q}</h3><div className="option-list">{q.options.map((op,i)=><button className={selected===i?'option selected':'option'} onClick={()=>setSelected(i)} key={op}>{op}</button>)}</div>
          {selected!==null&&<div className={selected===q.answer?'feedback ok':'feedback bad'}>{selected===q.answer?'Correto. ':'Ainda não. '}{q.why}</div>}
          <button className="button primary" disabled={selected===null} onClick={answer}>{quizIndex===lesson.quiz.length-1?'Finalizar':'Próxima'}</button>
        </>}
      </div>
      <div className="panel stack">
        <div className="section-head"><div><span className="eyebrow">FLASHCARDS</span><h2>Revisão rápida</h2></div><span>{card+1}/{lesson.flashcards.length}</span></div>
        <button className={`flashcard ${flipped?'flipped':''}`} onClick={()=>setFlipped(!flipped)}><small>{flipped?'RESPOSTA':'TERMO'}</small><strong>{flipped?lesson.flashcards[card].back:lesson.flashcards[card].front}</strong><span>toque para virar</span></button>
        <div className="flash-actions"><button className="button ghost" onClick={()=>{setCard((card-1+lesson.flashcards.length)%lesson.flashcards.length);setFlipped(false)}}>←</button><button className="button ghost" onClick={()=>{setCard((card+1)%lesson.flashcards.length);setFlipped(false)}}>→</button></div>
      </div>
    </section>

    <section className="lesson-nav">{prev?<a href={`#lesson/${prev.id}`}>← Aula {prev.id}</a>:<span/>}<a href="#games">Revisar em jogos</a>{next?<a href={`#lesson/${next.id}`}>Aula {next.id} →</a>:<span/>}</section>
  </div>;
}
