import catalogData from '../curriculum/catalog.json';
import type { CurriculumCatalog } from '../curriculum/types';
const lessons=(catalogData as CurriculumCatalog).main.filter(l=>l.id>=43&&l.id<=100);
import { getGameProgress, getLessonState } from '../lib/storage';
import { LearningInsights } from './review/LearningInsights';

export default function Review() {
  const lessonState=getLessonState();
  const games=getGameProgress();
  const doubts=lessons.filter(l=>lessonState[l.id]?.doubt);
  const favorites=lessons.filter(l=>lessonState[l.id]?.favorite);
  const weak=[...new Set(games.flatMap(g=>g.weakConcepts||[]))].slice(0,12);
  const lowQuiz=lessons.filter(l=>lessonState[l.id]?.quizBest>0&&lessonState[l.id]?.quizBest<75);
  return <div className="page stack-lg">
    <section className="page-title"><div><span className="eyebrow">REVISÃO INTELIGENTE</span><h1>Volte onde houve atrito.</h1><p>Dúvidas, quizzes fracos e erros dos jogos aparecem aqui.</p></div></section>
    <LearningInsights />
    <section className="two-col align-start">
      <div className="panel stack"><span className="eyebrow">DÚVIDAS MARCADAS</span><h2>{doubts.length} aulas</h2>{doubts.length?doubts.map(l=><a className="review-link" href={`#lesson/${l.id}`} key={l.id}><b>{l.id}</b><span>{l.title}</span></a>):<p className="muted">Nenhuma dúvida marcada ainda.</p>}</div>
      <div className="panel stack"><span className="eyebrow">QUIZ &lt; 75%</span><h2>{lowQuiz.length} aulas</h2>{lowQuiz.length?lowQuiz.map(l=><a className="review-link" href={`#lesson/${l.id}`} key={l.id}><b>{lessonState[l.id].quizBest}%</b><span>{l.id} · {l.title}</span></a>):<p className="muted">Nenhum quiz abaixo do limiar.</p>}</div>
    </section>
    <section className="panel stack"><span className="eyebrow">CONCEITOS DOS GAMES</span><h2>Pontos que merecem outra passada</h2>{weak.length?<div className="tags large">{weak.map(w=><span key={w}>{w}</span>)}</div>:<p className="muted">Os jogos ainda não registraram conceitos fracos.</p>}</section>
    <section className="panel stack"><span className="eyebrow">FAVORITAS</span><h2>Referências rápidas</h2><div className="lesson-grid compact">{favorites.map(l=><a className="lesson-card" href={`#lesson/${l.id}`} key={l.id}><div className="lesson-number">{l.id}</div><div className="lesson-body"><h3>{l.title}</h3><p>{l.summary}</p></div></a>)}</div>{!favorites.length&&<p className="muted">Favorite aulas para mantê-las aqui.</p>}</section>
  </div>;
}
