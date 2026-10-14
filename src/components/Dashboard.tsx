import { lessons } from '../data/lessons';
import { reviewPacks } from '../data/games';
import { getGameProgress, getLessonState } from '../lib/storage';
import type { Track } from '../types';

const tracks: Track[] = ['Web', 'Sistemas', 'Active Directory', 'Blue Team', 'Antivírus/EDR'];

export default function Dashboard() {
  const state = getLessonState();
  const games = getGameProgress();
  const completed = lessons.filter(l => state[l.id]?.completed).length;
  const continueLesson = lessons.find(l => !state[l.id]?.completed) || lessons[lessons.length - 1];
  const avg = games.length ? Math.round(games.reduce((a, b) => a + b.bestScore, 0) / games.length) : 0;
  const best = games.length ? Math.max(...games.map(g => g.bestScore)) : 0;
  const packsDone = reviewPacks.filter(p => ['crossword','matching','ordering','scenario'].every(t => games.some(g => g.gameId === `pack-${p.id}` && g.gameType === t))).length;

  return <div className="page stack-lg">
    <section className="hero-card">
      <div>
        <span className="eyebrow">CYBER STUDY HUB</span>
        <h1>Estudo técnico sem parede de texto.</h1>
        <p>Aulas 43–100, revisão ativa e jogos que treinam raciocínio em segurança.</p>
        <div className="hero-actions">
          <a className="button primary" href={`#lesson/${continueLesson.id}`}>Continuar na aula {continueLesson.id}</a>
          <a className="button ghost" href="#games">Abrir Cyber Games</a>
        </div>
      </div>
      <div className="shield-visual" aria-hidden="true"><span>+</span></div>
    </section>

    <section className="panel ai-dashboard-cta">
      <span className="eyebrow">NOVA FORMAÇÃO · PILOTO DISPONÍVEL</span>
      <h2>Crie seu próprio sistema com ChatGPT ou Claude</h2>
      <p>Uma trilha prática de 8 módulos e 32 etapas. O primeiro módulo já tem duas microaulas, uma aula da biblioteca e um laboratório executável. IA local é opcional; nenhuma API paga é necessária.</p>
      <a className="button primary" href="#ai-dev">Começar Desenvolvimento com IA →</a>
    </section>

    <section className="metrics-grid">
      <Metric label="Aulas concluídas" value={`${completed}/${lessons.length}`} sub={`${Math.round(completed / lessons.length * 100)}% do ciclo`} />
      <Metric label="Jogos realizados" value={String(games.length)} sub={`melhor ${best}%`} />
      <Metric label="Média nos games" value={`${avg}%`} sub="melhor score por game" />
      <Metric label="Packs completos" value={`${packsDone}/${reviewPacks.length}`} sub="4 jogos por pack" />
    </section>

    <section className="panel stack">
      <div className="section-head"><div><span className="eyebrow">TRILHAS</span><h2>Progresso por área</h2></div><span className="muted">Aulas disponíveis: 43–100</span></div>
      <div className="track-grid">
        {tracks.map(track => {
          const ls = lessons.filter(l => l.track === track);
          const done = ls.filter(l => state[l.id]?.completed).length;
          const pct = Math.round(done / ls.length * 100);
          return <a className="track-card" href={`#lessons?track=${encodeURIComponent(track)}`} key={track}>
            <div className="track-top"><strong>{track}</strong><span>{done}/{ls.length}</span></div>
            <div className="progress"><i style={{width:`${pct}%`}} /></div>
            <small>{pct}% concluído</small>
          </a>;
        })}
      </div>
    </section>

    <section className="two-col">
      <div className="panel stack">
        <span className="eyebrow">PRÓXIMO PASSO</span>
        <h2>Aula {continueLesson.id}: {continueLesson.title}</h2>
        <p>{continueLesson.summary}</p>
        <a className="text-link" href={`#lesson/${continueLesson.id}`}>Abrir aula →</a>
      </div>
      <div className="panel stack">
        <span className="eyebrow">REVISÃO</span>
        <h2>Cyber Games</h2>
        <p>Cruzadinha para vocabulário, associação para relações, ordenação para processos e cenários para decisão.</p>
        <a className="text-link" href="#games">Escolher pack →</a>
      </div>
    </section>
  </div>;
}

function Metric({label,value,sub}:{label:string;value:string;sub:string}) {
  return <div className="metric-card"><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>;
}
