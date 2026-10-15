import { useEffect, useMemo, useRef, useState } from 'react';
import AcademyLanding, { isAcademyPath } from './components/AcademyLanding';
import CourseCatalog from './components/curriculum/CourseCatalog';
import { publishedMainLessonIds, publishedParallelLessonCodes, publishedStandaloneLessonCodes, courseByLessonCode, publishedCourses } from './curriculum/courseOfferings';
import { PlatformGate, platformApi, type PlatformUser } from './components/PlatformGate';
import { PlatformProfile, PlatformUsers } from './components/PlatformAccount';
import Dashboard from './components/Dashboard';
import AcademyBrand from './components/AcademyBrand';
import { studyRouteHash, studySectionId, scrollStudySection } from './lib/studyNavigation';
import { LessonList, LessonViewer } from './components/SecureLessons';
import { GamePlayer, GamesHub } from './components/Games';
import Review from './components/Review';
import { MaterialsHub, MaterialViewer } from './components/Materials';
import type { GameType } from './types';
import { CourseDocumentViewer } from './components/curriculum/CourseDocumentViewer';
import AiDevelopmentTrail from './trails/ai-dev/AiDevelopmentTrail';
import ChannelAutomationTrail from './trails/channel-dark/ChannelAutomationTrail';
import ReverseAiTrail from './trails/reverse-ai/ReverseAiTrail';
import { FeedbackBoard, FeedbackComposer } from './components/feedback/FeedbackCenter';
import { RoadmapPage } from './components/feedback/Roadmap';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Route =
  | { page: 'dashboard' }
  | { page: 'courses'; courseId?: string }
  | { page: 'account' }
  | { page: 'admin-users' }
  | { page: 'admin-feedback' }
  | { page: 'feedback' }
  | { page: 'roadmap' }
  | { page: 'lessons'; track?: string; mode?: 'main' | 'parallel'; module?: string }
  | { page: 'lesson'; id: number }
  | { page: 'course-main'; id: number }
  | { page: 'course-parallel'; code: string }
  | { page: 'games' }
  | { page: 'game'; packId: number; type: GameType }
  | { page: 'review' }
  | { page: 'ai-dev' }
  | { page: 'channel-dark' }
  | { page: 'reverse-ai' }
  | { page: 'materials' }
  | { page: 'material'; id: string };

function parseHash(): Route {
  const raw = studyRouteHash(window.location.hash);
  if (raw === 'courses' || raw.startsWith('courses/')) return { page: 'courses', courseId: raw.split('/')[1] || undefined };
  if (raw.startsWith('course/main/')) return { page: 'course-main', id: Number(raw.split('/')[2]) || 1 };
  if (raw.startsWith('course/parallel/')) return { page: 'course-parallel', code: decodeURIComponent(raw.split('/')[2] || 'LOG-01') };
  if (raw.startsWith('lesson/')) return { page: 'lesson', id: Number(raw.split('/')[1]) || 43 };
  if (raw.startsWith('game/')) {
    const [, pack, type] = raw.split('/');
    return { page: 'game', packId: Number(pack) || 1, type: (type || 'scenario') as GameType };
  }
  if (raw.startsWith('lessons')) {
    const query = raw.split('?')[1] || '';
    const params = new URLSearchParams(query);
    const track = params.get('track') || undefined;
    const mode = params.get('mode') === 'parallel' ? 'parallel' : 'main';
    const module = params.get('module') || undefined;
    return { page: 'lessons', track, mode, module };
  }
  if (raw.startsWith('material/')) return { page: 'material', id: raw.split('/')[1] || 'appsec-01-40' };
  if (raw === 'feedback') return { page: 'feedback' };
  if (raw === 'roadmap') return { page: 'roadmap' };
  if (raw === 'admin/feedback'||(!window.location.hash&&window.location.pathname==='/admin/feedback')) return { page: 'admin-feedback' };
  if (raw === 'account') return { page: 'account' };
  if (raw === 'admin/users') return { page: 'admin-users' };
  if (raw.split('?')[0] === 'ai-dev') return { page: 'ai-dev' };
  if (raw.split('?')[0] === 'channel-dark') return { page: 'channel-dark' };
  if (raw.split('?')[0] === 'reverse-ai') return { page: 'reverse-ai' };
  if (raw === 'materials') return { page: 'materials' };
  if (raw === 'games') return { page: 'games' };
  if (raw === 'review') return { page: 'review' };
  return { page: 'dashboard' };
}

export default function App() {
  if (isAcademyPath(window.location.pathname)) return <AcademyLanding />;
  if (/^\/roadmap\/?$/.test(window.location.pathname)) return <RoadmapPage />;
  return <PlatformGate>{(user, actions) => <Workspace key={user.id} user={user} actions={actions} />}</PlatformGate>;
}

function Workspace({ user, actions }: { user: PlatformUser; actions: { logout: () => Promise<void>; refresh: () => Promise<void> } }) {
  const [route, setRoute] = useState<Route>(() => parseHash());
  const [, setVersion] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [access,setAccess] = useState<{courseIds:string[];subscriptionActive:boolean;staff:boolean}|null>(null);
  const [accessError,setAccessError] = useState('');
  useEffect(()=>{
    let active=true;
    void platformApi<{courseIds:string[];subscriptionActive:boolean;staff:boolean}>('/api/access/me')
      .then(result=>{if(active){setAccess(result);setAccessError('');}})
      .catch(reason=>{if(active){setAccess(null);setAccessError(String(reason));}});
    return()=>{active=false;};
  },[user.id]);
  const staff=user.role==='admin'||user.role==='teacher';
  const entitled=(courseId:string|undefined)=>staff||Boolean(courseId&&(access?.subscriptionActive||access?.courseIds.includes(courseId)));
  const canReadMain=(id:number)=>publishedMainLessonIds.has(id)&&entitled(courseByLessonCode.get('AULA-'+String(id).padStart(3,'0')));
  const canReadParallel=(code:string)=>(publishedParallelLessonCodes.has(code)||publishedStandaloneLessonCodes.has(code))&&entitled(code==='LOG-01'?'desenvolvimento-com-ia':courseByLessonCode.get(code));
  const hasAnyAccess=staff||Boolean(access?.subscriptionActive||access?.courseIds.length);
  const denied=<section className="page platform-page"><div className="panel stack" role="status">
    <span className="eyebrow">ACESSO AO CURSO</span>
    <h1>{accessError?'Não foi possível verificar seu acesso':access?'Curso não liberado nesta conta':'Verificando acesso ao curso…'}</h1>
    <p>{accessError?'Atualize a página para tentar novamente.':access?'Selecione uma formação disponível para sua conta. A compra avulsa e a assinatura ainda não são cobradas automaticamente.':'A consulta de permissões ocorre no servidor.'}</p>
    <a className="button ghost" href="#courses">Ver catálogo de cursos</a>
  </div></section>;
  const feedbackTrigger=useRef<HTMLButtonElement>(null);
  const closeFeedback=()=>{setFeedbackOpen(false);requestAnimationFrame(()=>feedbackTrigger.current?.focus());};
  const isIos = useMemo(() => /iphone|ipad|ipod/i.test(navigator.userAgent), []);
  const isStandalone = useMemo(() => window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & {standalone?:boolean}).standalone === true, []);

  useEffect(() => {
    let previous = studyRouteHash(window.location.hash);
    const onHash = () => {
      const next = studyRouteHash(window.location.hash);
      setRoute(parseHash());
      const section = studySectionId(window.location.hash);
      if (section) requestAnimationFrame(() => scrollStudySection(section));
      else if (next !== previous) window.scrollTo({ top: 0, behavior: 'instant' });
      previous = next;
    };
    const onInstall = (e: Event) => { e.preventDefault(); setInstallPrompt(e as InstallPromptEvent); };
    window.addEventListener('hashchange', onHash);
    window.addEventListener('beforeinstallprompt', onInstall);
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('beforeinstallprompt', onInstall); };
  }, []);

  const refresh = () => setVersion(v => v + 1);
  const install = async () => {
    if (installPrompt) { await installPrompt.prompt(); await installPrompt.userChoice; setInstallPrompt(null); }
    else if (isIos) setShowIos(true);
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#dashboard"><AcademyBrand /></a>
      <nav>
        <Nav href="#dashboard" active={route.page==='dashboard'} icon="home" label="Início" />
        <Nav href="#courses" active={route.page==='courses'} icon="book" label="Cursos" />
        {user.role==='admin' && <Nav href="#lessons" active={route.page==='lessons'||route.page==='lesson'||route.page==='course-main'||route.page==='course-parallel'} icon="book" label="Biblioteca editorial" />}
        <Nav href="#ai-dev" active={route.page==='ai-dev'} icon="ai" label="Desenvolver com IA" />
        <Nav href="#channel-dark" active={route.page==='channel-dark'} icon="ai" label="Canal Dark com IA" />
        {staff && <Nav href="#reverse-ai" active={route.page==='reverse-ai'} icon="ai" label="Engenharia Reversa com IA" />}
        <Nav href="#games" active={route.page==='games'||route.page==='game'} icon="games" label="Jogos" />
        <Nav href="#materials" active={route.page==='materials'||route.page==='material'} icon="materials" label="Materiais" />
        <Nav href="#review" active={route.page==='review'} icon="review" label="Revisão" />
        <Nav href="#account" active={route.page==='account'} icon="account" label="Minha conta" />
        <Nav href="#feedback" active={route.page==='feedback'} icon="feedback" label="Meus feedbacks" />
        <Nav href="#roadmap" active={route.page==='roadmap'} icon="roadmap" label="Roadmap público" />
        {user.role==='admin' && <Nav href="#admin/feedback" active={route.page==='admin-feedback'} icon="feedback" label="Central de feedback" />}
        {user.role==='admin' && <Nav href="#admin/users" active={route.page==='admin-users'} icon="users" label="Usuários" />}
      </nav>
      <div className="account-sidebar"><strong>{user.name}</strong><small>{user.email}</small><button onClick={() => void actions.logout()}>Sair da conta</button></div>
      {!isStandalone && <button className="install-card" onClick={install}><span>＋</span><div><strong>Instalar app</strong><small>Use como PWA</small></div></button>}
      <div className="sidebar-note"><small>LAB ÉTICO</small><p>Pratique apenas em ambientes próprios ou explicitamente autorizados.</p></div>
    </aside>

    <main className="main-content">
      <div className="feedback-global-action"><button ref={feedbackTrigger} type="button" className="button ghost" onClick={()=>setFeedbackOpen(true)}>
        {route.page==='lesson'||route.page==='course-main'||route.page==='course-parallel'?'⚑ Reportar problema nesta aula':'✎ Enviar feedback'}
      </button></div>
      {route.page==='dashboard' && <Dashboard user={user} />}
      {route.page==='courses' && <CourseCatalog courseId={route.courseId} admin={user.role==='admin'} userEmail={user.email} />}
      {route.page==='account' && <PlatformProfile user={user} onUpdated={actions.refresh} onSignOut={actions.logout} />}
      {route.page==='feedback' && <FeedbackBoard user={user} />}
      {route.page==='roadmap' && <RoadmapPage embedded />}
      {route.page==='admin-feedback' && (user.role==='admin'?<FeedbackBoard user={user} admin />:<FeedbackBoard user={user} />)}
      {route.page==='admin-users' && (user.role==='admin' ? <PlatformUsers me={user} /> : <PlatformProfile user={user} onUpdated={actions.refresh} onSignOut={actions.logout} />)}
      {route.page==='lessons' && (user.role==='admin' ? <LessonList initialTrack={route.track} initialMode={route.mode} initialModule={route.module} /> : <CourseCatalog />)}
      {route.page==='lesson' && (canReadMain(route.id) ? <LessonViewer key={route.id} id={route.id} onRefresh={refresh} /> : denied)}
      {route.page==='course-main' && (canReadMain(route.id) ? <CourseDocumentViewer key={"main-" + route.id} kind="main" id={route.id} /> : denied)}
      {route.page==='course-parallel' && (canReadParallel(route.code) ? <CourseDocumentViewer key={"parallel-" + route.code} kind="parallel" code={route.code} /> : denied)}
      {route.page==='ai-dev' && (entitled('desenvolvimento-com-ia')?<AiDevelopmentTrail userId={user.id}/>:denied)}
      {route.page==='channel-dark' && (entitled('automacao-canal-dark')?<ChannelAutomationTrail userId={user.id}/>:denied)}
      {route.page==='reverse-ai' && ((staff || (publishedCourses.some(course=>course.id==='engenharia-reversa-com-ia') && entitled('engenharia-reversa-com-ia')))?<ReverseAiTrail userId={user.id}/>:denied)}
      {route.page==='games' && (hasAnyAccess?<GamesHub/>:denied)}
      {route.page==='game' && (hasAnyAccess?<GamePlayer packId={route.packId} type={route.type} onRefresh={refresh}/>:denied)}
      {route.page==='materials' && (hasAnyAccess?<MaterialsHub/>:denied)}
      {route.page==='material' && (hasAnyAccess?<MaterialViewer id={route.id}/>:denied)}
      {route.page==='review' && <Review />}
    </main>

    <nav className="mobile-nav">
      <Nav href="#dashboard" active={route.page==='dashboard'} icon="home" label="Início" />
      <Nav href="#courses" active={route.page==='courses'||route.page==='lessons'||route.page==='lesson'||route.page==='course-main'||route.page==='course-parallel'} icon="book" label="Cursos" />
      <Nav href="#games" active={route.page==='games'||route.page==='game'} icon="games" label="Jogos" />
      <Nav href="#account" active={route.page==='account'||route.page==='admin-users'} icon="account" label="Conta" />
      <details key={route.page} className="mobile-nav-more">
        <summary className={'nav-item mobile-nav-more-trigger'+(['materials','material','review','feedback','roadmap','admin-feedback'].includes(route.page)?' active':'')} aria-label="Mais opções: materiais, revisão e comunidade">
          <span><NavIcon name="roadmap" /></span><b>Mais</b>
        </summary>
        <div className="mobile-nav-more-panel">
          <Nav href="#materials" active={route.page==='materials'||route.page==='material'} icon="materials" label="Materiais" />
          <Nav href="#review" active={route.page==='review'} icon="review" label="Revisão" />
          <div className="mobile-nav-more-divider" role="separator" />
          <Nav href="#feedback" active={route.page==='feedback'} icon="feedback" label="Meus feedbacks" />
          <Nav href="#roadmap" active={route.page==='roadmap'} icon="roadmap" label="Votar em melhorias" />
          {user.role==='admin' && <Nav href="#admin/feedback" active={route.page==='admin-feedback'} icon="feedback" label="Central de feedback" />}
        </div>
      </details>
    </nav>

    {feedbackOpen && <FeedbackComposer onClose={closeFeedback} context={{
      contextPath:window.location.hash||'#dashboard',
      contextLabel:route.page==='course-main'?'Aula principal '+String(route.id).padStart(3,'0'):
        route.page==='course-parallel'?'Trilha paralela · '+route.code:
        route.page==='lesson'?'Aula '+String(route.id).padStart(3,'0'):
        route.page==='ai-dev'?'Trilha Desenvolver com IA':
        route.page==='channel-dark'?'Trilha Canal Dark com IA':
        route.page==='reverse-ai'?'Trilha Engenharia Reversa com IA':
        route.page==='courses'?'Cursos '+(route.courseId??'· catálogo'):
        route.page==='lessons'?'Módulos '+(route.module??'· catálogo'):
        route.page==='material'?'Material '+route.id:route.page==='game'?'Jogo '+route.packId:
        route.page==='dashboard'?'Início do HubEstudos':route.page
    }}/>}
    {showIos && <div className="modal-backdrop" onClick={()=>setShowIos(false)}><div className="modal" onClick={(e:any)=>e.stopPropagation()}><span className="eyebrow">INSTALAR NO IPHONE</span><h2>Adicionar à Tela de Início</h2><ol><li>Toque em <b>Compartilhar</b> no Safari.</li><li>Escolha <b>Adicionar à Tela de Início</b>.</li><li>Confirme em <b>Adicionar</b>.</li></ol><button className="button primary" onClick={()=>setShowIos(false)}>Entendi</button></div></div>}
  </div>;
}

type NavIconName = 'home' | 'book' | 'ai' | 'games' | 'materials' | 'review' | 'account' | 'users' | 'feedback' | 'roadmap';
function NavIcon({ name }: { name: NavIconName }) {
  return <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name==='home' && <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>}
    {name==='book' && <><path d="M4 5.5C7 4 10 4 12 6v14c-2-2-5-2-8-.5z"/><path d="M20 5.5C17 4 14 4 12 6v14c2-2 5-2 8-.5z"/></>}
    {name==='ai' && <><path d="M12 3.5 13.8 10l6.7 2-6.7 2-1.8 6.5L10.2 14 3.5 12l6.7-2z"/><path d="M19 3v3m-1.5-1.5h3"/></>}
    {name==='games' && <><path d="M6 8h12a4 4 0 0 1 3.8 3l1 5a3 3 0 0 1-4.7 3L15 17H9l-3.1 2A3 3 0 0 1 1.2 16l1-5A4 4 0 0 1 6 8z"/><path d="M8 11v5M5.5 13.5h5"/><circle cx="16" cy="12" r=".7" fill="currentColor" stroke="none"/><circle cx="19" cy="14" r=".7" fill="currentColor" stroke="none"/></>}
    {name==='materials' && <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></>}
    {name==='review' && <><path d="M20 10a8 8 0 1 0 .1 4"/><path d="M20 4v6h-6"/></>}
    {name==='account' && <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>}
    {name==='roadmap' && <><path d="M4 19V5m0 14h16M8 15l4-4 3 2 5-7"/></>}
    {name==='feedback' && <><path d="M4 5h16v12H9l-5 4z"/><path d="M8 9h8M8 13h5"/></>}
    {name==='users' && <><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M17 5a3 3 0 0 1 0 6M17 15a6 6 0 0 1 4 5"/></>}
  </svg>;
}
function Nav({href,active,icon,label}:{href:string;active:boolean;icon:NavIconName;label:string}) {
  return <a href={href} aria-current={active?'page':undefined} className={active?'nav-item active':'nav-item'}><span className="nav-icon"><NavIcon name={icon}/></span><b>{label}</b></a>;
}
