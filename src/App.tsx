import { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import { LessonList, LessonViewer } from './components/Lessons';
import { GamePlayer, GamesHub } from './components/Games';
import Review from './components/Review';
import type { GameType } from './types';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Route =
  | { page: 'dashboard' }
  | { page: 'lessons'; track?: string }
  | { page: 'lesson'; id: number }
  | { page: 'games' }
  | { page: 'game'; packId: number; type: GameType }
  | { page: 'review' };

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, '') || 'dashboard';
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
  if (raw === 'games') return { page: 'games' };
  if (raw === 'review') return { page: 'review' };
  return { page: 'dashboard' };
}

export default function App() {
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
        <Nav href="#lessons" active={route.page==='lessons'||route.page==='lesson'} icon="▤" label="Aulas" />
        <Nav href="#games" active={route.page==='games'||route.page==='game'} icon="◈" label="Cyber Games" />
        <Nav href="#review" active={route.page==='review'} icon="↻" label="Revisão" />
      </nav>
      {!isStandalone && <button className="install-card" onClick={install}><span>＋</span><div><strong>Instalar app</strong><small>Use como PWA</small></div></button>}
      <div className="sidebar-note"><small>LAB ÉTICO</small><p>Pratique apenas em ambientes próprios ou explicitamente autorizados.</p></div>
    </aside>

    <main className="main-content">
      {route.page==='dashboard' && <Dashboard />}
      {route.page==='lessons' && <LessonList initialTrack={route.track} />}
      {route.page==='lesson' && <LessonViewer id={route.id} onRefresh={refresh} />}
      {route.page==='games' && <GamesHub />}
      {route.page==='game' && <GamePlayer packId={route.packId} type={route.type} onRefresh={refresh} />}
      {route.page==='review' && <Review />}
    </main>

    <nav className="mobile-nav">
      <Nav href="#dashboard" active={route.page==='dashboard'} icon="⌂" label="Início" />
      <Nav href="#lessons" active={route.page==='lessons'||route.page==='lesson'} icon="▤" label="Aulas" />
      <Nav href="#games" active={route.page==='games'||route.page==='game'} icon="◈" label="Jogos" />
      <Nav href="#review" active={route.page==='review'} icon="↻" label="Revisão" />
    </nav>

    {showIos && <div className="modal-backdrop" onClick={()=>setShowIos(false)}><div className="modal" onClick={(e:any)=>e.stopPropagation()}><span className="eyebrow">INSTALAR NO IPHONE</span><h2>Adicionar à Tela de Início</h2><ol><li>Toque em <b>Compartilhar</b> no Safari.</li><li>Escolha <b>Adicionar à Tela de Início</b>.</li><li>Confirme em <b>Adicionar</b>.</li></ol><button className="button primary" onClick={()=>setShowIos(false)}>Entendi</button></div></div>}
  </div>;
}

function Nav({href,active,icon,label}:{href:string;active:boolean;icon:string;label:string}) {
  return <a href={href} className={active?'nav-item active':'nav-item'}><span>{icon}</span><b>{label}</b></a>;
}
