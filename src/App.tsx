import { useEffect, useMemo, useState } from 'react';
import { PlatformGate, type PlatformUser } from './components/PlatformGate';
import { PlatformProfile, PlatformUsers } from './components/PlatformAccount';
import Dashboard from './components/Dashboard';
import { LessonList, LessonViewer } from './components/Lessons';
import { GamePlayer, GamesHub } from './components/Games';
import Review from './components/Review';
import { MaterialsHub, MaterialViewer } from './components/Materials';
import type { GameType } from './types';
import { CourseDocumentViewer } from './components/curriculum/CourseDocumentViewer';
import AiDevelopmentTrail from './trails/ai-dev/AiDevelopmentTrail';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Route =
  | { page: 'dashboard' }
  | { page: 'account' }
  | { page: 'admin-users' }
  | { page: 'lessons'; track?: string }
  | { page: 'lesson'; id: number }
  | { page: 'course-main'; id: number }
  | { page: 'course-parallel'; code: string }
  | { page: 'games' }
  | { page: 'game'; packId: number; type: GameType }
  | { page: 'review' }
  | { page: 'materials' }
  | { page: 'ai-dev' }
  | { page: 'material'; id: string };

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, '') || 'dashboard';
  if (raw.startsWith('course/main/')) return { page: 'course-main', id: Number(raw.split('/')[2]) || 1 };
  if (raw.startsWith('course/parallel/')) return { page: 'course-parallel', code: decodeURIComponent(raw.split('/')[2] || 'LOG-01') };
  if (raw.startsWith('lesson/')) return { page: 'lesson', id: Number(raw.split('/')[1]) || 43 };
  if (raw.startsWith('game/')) {
    const [, pack, type] = raw.split('/');
    return { page: 'game', packId: Number(pack) || 1, type: (type || 'scenario') as GameType };
  }
  if (raw.startsWith('lessons')) {
    const query = raw.split('?')[1] || '';
    const track = new URLSearchParams(query).get('track') || undefined;
    return { page: 'lessons', track };
  }
  if (raw.startsWith('material/')) return { page: 'material', id: raw.split('/')[1] || 'appsec-01-40' };
  if (raw === 'account') return { page: 'account' };
  if (raw === 'admin/users') return { page: 'admin-users' };
  if (raw === 'materials') return { page: 'materials' };
  if (raw === 'ai-dev') return { page: 'ai-dev' };
  if (raw === 'games') return { page: 'games' };
  if (raw === 'review') return { page: 'review' };
  return { page: 'dashboard' };
}

export default function App() {
  return <PlatformGate>{(user, actions) => <Workspace key={user.id} user={user} actions={actions} />}</PlatformGate>;
}

function Workspace({ user, actions }: { user: PlatformUser; actions: { logout: () => Promise<void>; refresh: () => Promise<void> } }) {
  const [route, setRoute] = useState<Route>(() => parseHash());
  const [, setVersion] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const isIos = useMemo(() => /iphone|ipad|ipod/i.test(navigator.userAgent), []);
  const isStandalone = useMemo(() => window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & {standalone?:boolean}).standalone === true, []);

  useEffect(() => {
    const onHash = () => { setRoute(parseHash()); window.scrollTo({ top: 0, behavior: 'smooth' }); };
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
      <a className="brand" href="#dashboard"><span className="brand-mark">+</span><div><strong>Cyber Study</strong><small>Hub</small></div></a>
      <nav>
        <Nav href="#dashboard" active={route.page==='dashboard'} icon="⌂" label="Dashboard" />
        <Nav href="#lessons" active={route.page==='lessons'||route.page==='lesson'||route.page==='course-main'||route.page==='course-parallel'} icon="▤" label="Aulas" />
        <Nav href="#ai-dev" active={route.page==='ai-dev'} icon="✦" label="Desenvolver com IA" />
        <Nav href="#games" active={route.page==='games'||route.page==='game'} icon="◈" label="Cyber Games" />
        <Nav href="#materials" active={route.page==='materials'||route.page==='material'} icon="▣" label="Materiais" />
        <Nav href="#review" active={route.page==='review'} icon="↻" label="Revisão" />
        <Nav href="#account" active={route.page==='account'} icon="◎" label="Minha conta" />
        {user.role==='admin' && <Nav href="#admin/users" active={route.page==='admin-users'} icon="♙" label="Usuários" />}
      </nav>
      <div className="account-sidebar"><strong>{user.name}</strong><small>{user.email}</small><button onClick={() => void actions.logout()}>Sair da conta</button></div>
      {!isStandalone && <button className="install-card" onClick={install}><span>＋</span><div><strong>Instalar app</strong><small>Use como PWA</small></div></button>}
      <div className="sidebar-note"><small>LAB ÉTICO</small><p>Pratique apenas em ambientes próprios ou explicitamente autorizados.</p></div>
    </aside>

    <main className="main-content">
      {route.page==='dashboard' && <Dashboard />}
      {route.page==='account' && <PlatformProfile user={user} onUpdated={actions.refresh} onSignOut={actions.logout} />}
      {route.page==='admin-users' && (user.role==='admin' ? <PlatformUsers me={user} /> : <PlatformProfile user={user} onUpdated={actions.refresh} onSignOut={actions.logout} />)}
      {route.page==='lessons' && <LessonList initialTrack={route.track} />}
      {route.page==='lesson' && <LessonViewer id={route.id} onRefresh={refresh} />}
      {route.page==='course-main' && <CourseDocumentViewer kind="main" id={route.id} />}
      {route.page==='course-parallel' && <CourseDocumentViewer kind="parallel" code={route.code} />}
      {route.page==='ai-dev' && <AiDevelopmentTrail userId={user.id} />}
      {route.page==='games' && <GamesHub />}
      {route.page==='game' && <GamePlayer packId={route.packId} type={route.type} onRefresh={refresh} />}
      {route.page==='materials' && <MaterialsHub />}
      {route.page==='material' && <MaterialViewer id={route.id} />}
      {route.page==='review' && <Review />}
    </main>

    <nav className="mobile-nav">
      <Nav href="#dashboard" active={route.page==='dashboard'} icon="⌂" label="Início" />
      <Nav href="#lessons" active={route.page==='lessons'||route.page==='lesson'||route.page==='course-main'||route.page==='course-parallel'} icon="▤" label="Aulas" />
      <Nav href="#games" active={route.page==='games'||route.page==='game'} icon="◈" label="Jogos" />
      <Nav href="#materials" active={route.page==='materials'||route.page==='material'} icon="▣" label="Materiais" />
      <Nav href="#review" active={route.page==='review'} icon="↻" label="Revisão" />
      <Nav href="#account" active={route.page==='account'||route.page==='admin-users'} icon="◎" label="Conta" />
    </nav>

    {showIos && <div className="modal-backdrop" onClick={()=>setShowIos(false)}><div className="modal" onClick={(e:any)=>e.stopPropagation()}><span className="eyebrow">INSTALAR NO IPHONE</span><h2>Adicionar à Tela de Início</h2><ol><li>Toque em <b>Compartilhar</b> no Safari.</li><li>Escolha <b>Adicionar à Tela de Início</b>.</li><li>Confirme em <b>Adicionar</b>.</li></ol><button className="button primary" onClick={()=>setShowIos(false)}>Entendi</button></div></div>}
  </div>;
}

function Nav({href,active,icon,label}:{href:string;active:boolean;icon:string;label:string}) {
  return <a href={href} className={active?'nav-item active':'nav-item'}><span>{icon}</span><b>{label}</b></a>;
}
