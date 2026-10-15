import catalogData from '../curriculum/catalog.json';
import type { CurriculumCatalog } from '../curriculum/types';
import { lessons } from '../data/lessons';
import { getLessonState, getGameProgress } from '../lib/storage';
import { getLearningProgress } from '../lib/learningProgress';
import { getReviewStats } from '../lib/reviewEngine';
import { getActiveParallelTracks } from '../lib/curriculumState';
import type { PlatformUser } from './PlatformGate';
import { listNativeV2LessonIds } from '../content/registry';
import './home.css';
import { getStudyVisits } from '../lib/studyProgress';
import { studySectionHref } from '../lib/studyNavigation';
import { lessonDurationLabel } from '../lib/courseStudyMetadata';
import ProgressSyncStatus from './ProgressSyncStatus';

const catalog = catalogData as CurriculumCatalog;
const interactiveIds = new Set([...lessons.map(lesson => lesson.id), ...listNativeV2LessonIds()]);
const interactiveLessons = catalog.main.filter(item => interactiveIds.has(item.id));
const mainById = new Map(catalog.main.map(item => [item.id, item]));
function hrefForLesson(id: number) {
  return interactiveIds.has(id) ? '#lesson/' + id : '#course/main/' + id;
}
export default function Dashboard({ user }: { user: PlatformUser }) {
  const lessonState = getLessonState();
  const learning = getLearningProgress();
  const games = getGameProgress();
  const reviews = getReviewStats();
  const activeParallel = new Set(getActiveParallelTracks());

  const studyVisits = getStudyVisits();
  const readIds = new Set(studyVisits.filter(visit => visit.read).map(visit => Number(visit.key)));
  const isCompleted = (id: number) => Boolean(lessonState[id]?.completed || learning[id]?.completed);
  const completedInteractive = interactiveLessons.filter(item => isCompleted(item.id)).length;
  const recent = Object.entries(learning)
    .map(([key, value]) => ({ id: Number(key), value }))
    .filter(({ id, value }) => Number.isInteger(id) && mainById.has(id) &&
      (value.completed || value.favorite || value.doubt ||
       value.visitedSectionIds?.length || value.completedActivityIds?.length ||
       value.completedLabStepIds?.length || value.quizHistory?.length))
    .sort((a, b) => (Date.parse(b.value.lastSeenAt || '') || 0) - (Date.parse(a.value.lastSeenAt || '') || 0));
  const unfinished = recent.find(item => !isCompleted(item.id) && !readIds.has(item.id));
  const nextInteractive = completedInteractive > 0 ? interactiveLessons.find(item => !isCompleted(item.id)) : undefined;
  const nextUnread = catalog.main.find(item => !readIds.has(item.id) && !isCompleted(item.id));
  const recommendedId = unfinished?.id ?? (readIds.size ? nextUnread?.id : nextInteractive?.id) ?? catalog.main[0]?.id;
  const recommended = mainById.get(recommendedId ?? 1) ?? catalog.main[0];
  const latest = studyVisits.find(visit => !visit.read && !(visit.kind === 'interactive' && isCompleted(Number(visit.key))));
  const resumeHref = latest ? latest.sectionId ? studySectionHref(latest.sectionId, latest.href) : latest.href : hrefForLesson(recommended.id);
  const isNewStudent = !latest && !recent.length && completedInteractive === 0;
  const activeLabels = [...activeParallel].map(code => {
    const item = catalog.parallel.find(candidate => candidate.trackCode === code);
    return item ? { code, name: item.track } : null;
  }).filter((item): item is {code:string;name:string} => item !== null);
  const firstName = user.name.trim().split(/\s+/)[0] || 'Estudante';
  const percent = interactiveLessons.length ? Math.round(completedInteractive / interactiveLessons.length * 100) : 0;
  const mainModuleCount = new Set(catalog.main.map(item => item.block)).size;
  const parallelModuleCount = new Set(catalog.parallel.map(item => item.track)).size;
  const totalModules = mainModuleCount + parallelModuleCount;
  return <div className={"page hub-home stack-lg" + (isNewStudent ? "" : " hub-home--returning")}>
    <header className="hub-home-topline">
      <div><span className="eyebrow">ARTISYS / SEU ESPAÇO DE ESTUDOS</span><h1>Olá, {firstName}.</h1><p>Uma formação organizada para aprender, praticar e evoluir.</p></div>
      <a className="hub-home-profile" href="#account" aria-label="Abrir minha conta">
        <span aria-hidden="true">{firstName.slice(0,1).toUpperCase()}</span><span>Minha conta</span>
      </a>
    </header>
    <section className="hub-focus" aria-labelledby="hub-next-title">
      <div className="hub-focus-copy">
        <span className="hub-focus-kicker">{isNewStudent ? 'SEU PONTO DE PARTIDA' : 'CONTINUE SEU ESTUDO'}</span>
        <h2 id="hub-next-title">{isNewStudent ? 'O próximo passo começa aqui.' : 'Continue de onde parou.'}</h2>
        <p>{isNewStudent
          ? 'A formação principal começa pela Aula 001. Você também pode explorar qualquer área, sem bloqueios.'
          : 'Seu próximo estudo leva em conta o progresso registrado nesta conta.'}</p>
        <div className="hub-focus-lesson">
          <span className="hub-focus-number">{latest?.kind === 'ai' ? 'IA' : latest?.key.startsWith('parallel:') ? '↗' : String(latest ? Number(latest.key) : recommended.id).padStart(3,'0')}</span>
          <div><small>{latest?.sectionLabel || (recommended.track + " · " + lessonDurationLabel(recommended))}</small><strong>{latest?.title || recommended.title}</strong></div>
        </div>
        <div className="hub-focus-actions">
          <a className="button primary" href={resumeHref}>{isNewStudent ? 'Começar pela aula 001' : 'Continuar estudo'} <span aria-hidden="true">→</span></a>
          <a className="button ghost" href="#lessons?mode=main">Explorar formação</a>
        </div>
      </div>
    </section>
    <ProgressSyncStatus />
    <a className="hub-ai-banner" href="#ai-dev">
      <span><small>FORMAÇÃO PRÁTICA · 8 MÓDULOS DISPONÍVEIS</small><strong>Construa o Meu Gestor com ChatGPT ou Claude</strong><em>32 etapas com laboratórios e provas independentes. IA local opcional, sem API paga obrigatória.</em></span>
      <b>Abrir trilha →</b>
    </a>
    <a className="hub-ai-banner" href="#channel-dark">
      <span><small>CANAL DARK · 8 MÓDULOS</small><strong>Automatize um canal com IA, do zero</strong><em>Steve AI, Pika, Google Flow, Kokoro, n8n e Modal como opções. Núcleo local gratuito em todas as etapas.</em></span>
      <b>Explorar trilha →</b>
    </a>
    <section className="hub-home-journeys" aria-labelledby="hub-journeys-title">
      <div className="hub-home-section-title">
        <div><span className="eyebrow">EXPLORE POR OBJETIVO</span><h2 id="hub-journeys-title">O que você quer estudar?</h2></div>
        <a href="#lessons" className="text-link">Ver todo o catálogo →</a>
      </div>
      <div className="hub-journey-grid">
        <a href="#lessons?mode=main" className="hub-journey">
          <span className="hub-journey-icon" aria-hidden="true">01</span>
          <div><strong>Formação principal</strong><p>{mainModuleCount} módulos · {catalog.main.length} aulas. Comece pelos fundamentos ou escolha uma área.</p><span>Explorar módulos <b aria-hidden="true">↗</b></span></div>
        </a>
        <a href="#lessons?mode=parallel" className="hub-journey">
          <span className="hub-journey-icon" aria-hidden="true">02</span>
          <div><strong>Trilhas paralelas</strong><p>{parallelModuleCount} trilhas · {catalog.parallel.length} unidades de lógica, programação e especialidades.</p><span>Explorar trilhas <b aria-hidden="true">↗</b></span></div>
        </a>
        <a href="#review" className="hub-journey">
          <span className="hub-journey-icon" aria-hidden="true">03</span>
          <div><strong>Revisar e fixar</strong><p>Retome conceitos com revisão espaçada e pratique o que já estudou.</p><span>Ir para revisão <b aria-hidden="true">↗</b></span></div>
        </a>
      </div>
    </section>
    <section className="hub-home-stats" aria-label="Seu painel de estudos">
      <a href="#lessons" className="hub-home-stat">
        <small>Módulos de estudo</small><strong>{totalModules}</strong>
        <span>{mainModuleCount} da formação principal + {parallelModuleCount} trilhas paralelas</span>
      </a>
      <a href="#lessons?mode=main" className="hub-home-stat">
        <small>Aulas interativas concluídas</small><strong>{completedInteractive}<em> / {interactiveLessons.length}</em></strong>
        <span className="hub-mini-progress" role="progressbar" aria-valuenow={completedInteractive} aria-valuemin={0} aria-valuemax={interactiveLessons.length} aria-label="Aulas interativas concluídas"><i style={{width: percent+'%'}} /></span>
        <span>{percent}% das aulas com conclusão interativa</span>
      </a>
      <a href="#review" className="hub-home-stat">
        <small>Revisões disponíveis</small><strong>{reviews.due}</strong>
        <span>{reviews.total ? 'Cartões prontos para revisar' : 'Liberadas conforme seu estudo V2'}</span>
      </a>
    </section>
    <section className="hub-home-bottom" aria-label="Atalhos de aprendizagem">
      <article className="hub-home-note">
        <span className="eyebrow">EM FOCO</span><h2>{activeLabels.length ? 'Suas trilhas em estudo' : 'Organize seus interesses'}</h2>
        {activeLabels.length ? <div className="hub-active-tracks">{activeLabels.slice(0,4).map(item =>
          <a href={'#lessons?mode=parallel&track='+encodeURIComponent(item.name)} key={item.code}>{item.name}<span aria-hidden="true">↗</span></a>
        )}</div> : <p>Marque uma trilha paralela como “em estudo” para encontrá-la facilmente aqui.</p>}
        <a href="#lessons?mode=parallel" className="text-link">{activeLabels.length ? 'Gerenciar trilhas →' : 'Escolher uma trilha →'}</a>
      </article>
      <article className="hub-home-note">
        <span className="eyebrow">PRÁTICA</span><h2>Cyber Games</h2>
        <p>{games.length
          ? 'Você tem '+games.length+' resultados registrados. Continue praticando para consolidar o aprendizado.'
          : 'Cruzadinhas, associação, ordenação e cenários para praticar o conteúdo.'}</p>
        <a href="#games" className="text-link">Abrir jogos →</a>
      </article>
    </section>
  </div>;
}
