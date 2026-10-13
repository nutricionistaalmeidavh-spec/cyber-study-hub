import { useMemo, useState, type ChangeEvent } from 'react';
import catalogData from '../../curriculum/catalog.json';
import type {
  CurriculumCatalog,
  MainCurriculumItem,
  ParallelCurriculumItem
} from '../../curriculum/types';
import { lessons } from '../../data/lessons';
import { listNativeV2LessonIds } from '../../content/registry';
import {
  getActiveParallelTracks,
  setActiveParallelTracks
} from '../../lib/curriculumState';
import './curriculum.css';

const catalog = catalogData as CurriculumCatalog;

type ViewMode = 'main' | 'parallel';

export function CurriculumBrowser({ initialTrack }: { initialTrack?: string }) {
  const [mode, setMode] = useState<ViewMode>('main');
  const [query, setQuery] = useState('');
  const [mainTrack, setMainTrack] = useState(initialTrack || 'Todas');
  const [parallelTrack, setParallelTrack] = useState('Todas');
  const [activeParallel, setActiveParallel] = useState<Set<string>>(
    () => new Set(getActiveParallelTracks())
  );

  const nativeIds = useMemo(() => new Set(listNativeV2LessonIds()), []);
  const legacyIds = useMemo(() => new Set(lessons.map(lesson => lesson.id)), []);

  const mainTracks = useMemo(
    () => [
      'Todas',
      'Web',
      'Sistemas',
      'Active Directory',
      'Blue Team',
      'Antivírus/EDR',
      ...[...new Set(catalog.main.map(item => item.track))].filter(
        track => !['Sistemas', 'Active Directory', 'Blue Team', 'Antivírus/EDR'].includes(track)
      )
    ],
    []
  );
  const parallelTracks = useMemo(
    () => ['Todas', ...new Set(catalog.parallel.map(item => item.track))],
    []
  );

  const filteredMain = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return catalog.main.filter(item => {
      const matchesTrack = matchesMainTrack(item, mainTrack);
      const haystack = `${item.id} ${item.title} ${item.track} ${item.block}`.toLowerCase();
      return matchesTrack && (!normalized || haystack.includes(normalized));
    });
  }, [query, mainTrack]);

  const filteredParallel = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return catalog.parallel.filter(item => {
      const matchesTrack =
        parallelTrack === 'Todas' || item.track === parallelTrack;
      const haystack = `${item.code} ${item.title} ${item.track}`.toLowerCase();
      return matchesTrack && (!normalized || haystack.includes(normalized));
    });
  }, [query, parallelTrack]);

  const toggleParallelTrack = (trackCode: string) => {
    setActiveParallel(previous => {
      const next = new Set(previous);
      if (next.has(trackCode)) next.delete(trackCode);
      else next.add(trackCode);
      setActiveParallelTracks([...next]);
      return next;
    });
  };

  return (
    <div className="page curriculum-page stack-lg">
      <header className="curriculum-hero">
        <div>
          <span className="eyebrow">CURRÍCULO COMPLETO</span>
          <h1>Formação principal + trilhas paralelas</h1>
          <p>
            Navegue livremente. Pré-requisitos são recomendações de sequência,
            nunca bloqueios. O conteúdo completo fica disponível sob demanda para
            não inflar o carregamento inicial do app.
          </p>
        </div>
        <div className="curriculum-counts" aria-label="Resumo do currículo">
          <span><strong>218</strong>aulas principais</span>
          <span><strong>325</strong>unidades paralelas</span>
          <span><strong>543</strong>unidades totais</span>
        </div>
      </header>

      <section className="curriculum-toolbar">
        <div className="curriculum-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'main'}
            className={mode === 'main' ? 'active' : ''}
            onClick={() => setMode('main')}
          >
            Formação principal
          </button>
          <button
            role="tab"
            aria-selected={mode === 'parallel'}
            className={mode === 'parallel' ? 'active' : ''}
            onClick={() => setMode('parallel')}
          >
            Trilhas paralelas
          </button>
        </div>

        <input
          className="search"
          value={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
          placeholder="Buscar aula, conceito, trilha ou código…"
          aria-label="Buscar currículo"
        />
      </section>

      {mode === 'main' ? (
        <>
          <div className="curriculum-filter-strip">
            {mainTracks.map(track => (
              <button
                key={track}
                className={mainTrack === track ? 'active' : ''}
                onClick={() => setMainTrack(track)}
              >
                {track}
              </button>
            ))}
          </div>

          <section className="curriculum-list" aria-label="Formação principal">
            {filteredMain.map(item => (
              <MainItemCard
                key={item.id}
                item={item}
                native={nativeIds.has(item.id)}
                legacy={legacyIds.has(item.id)}
              />
            ))}
          </section>
        </>
      ) : (
        <>
          <div className="curriculum-filter-strip">
            {parallelTracks.map(track => (
              <button
                key={track}
                className={parallelTrack === track ? 'active' : ''}
                onClick={() => setParallelTrack(track)}
              >
                {track}
              </button>
            ))}
          </div>

          <section className="parallel-track-summary">
            <div>
              <span className="eyebrow">ESTUDO CONCORRENTE</span>
              <h2>Ative quantas trilhas quiser</h2>
              <p>
                Marcar uma trilha como “em estudo” organiza seu foco localmente,
                sem impedir acesso às demais.
              </p>
            </div>
            <strong>{activeParallel.size} ativa(s)</strong>
          </section>

          <section className="curriculum-list" aria-label="Trilhas paralelas">
            {filteredParallel.map(item => (
              <ParallelItemCard
                key={item.code}
                item={item}
                active={activeParallel.has(item.trackCode)}
                onToggle={() => toggleParallelTrack(item.trackCode)}
              />
            ))}
          </section>
        </>
      )}
    </div>
  );
}

function MainItemCard({
  item,
  native,
  legacy
}: {
  item: MainCurriculumItem;
  native: boolean;
  legacy: boolean;
}) {
  const interactive = native || legacy;
  const href = interactive ? `#lesson/${item.id}` : `#course/main/${item.id}`;
  const status = native
    ? 'Interativa V2'
    : legacy
      ? 'Interativa legado'
      : 'Leitura completa';

  return (
    <a className="curriculum-row" href={href}>
      <div className="curriculum-code">{String(item.id).padStart(3, '0')}</div>
      <div className="curriculum-row-body">
        <div className="curriculum-meta">
          <span>{item.track}</span>
          <span>{item.depth}</span>
          <span>{item.durationMin} min</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.block}</p>
      </div>
      <div className={`curriculum-status ${native ? 'native' : interactive ? 'legacy' : 'document'}`}>
        {status}
      </div>
    </a>
  );
}

function ParallelItemCard({
  item,
  active,
  onToggle
}: {
  item: ParallelCurriculumItem;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="curriculum-row parallel">
      <a href={`#course/parallel/${item.code}`} className="parallel-open">
        <div className="curriculum-code">{item.code}</div>
        <div className="curriculum-row-body">
          <div className="curriculum-meta"><span>{item.track}</span></div>
          <h3>{item.title}</h3>
          <p>Acesso livre · conteúdo completo carregado sob demanda</p>
        </div>
      </a>
      <button
        className={active ? 'parallel-toggle active' : 'parallel-toggle'}
        onClick={onToggle}
        aria-pressed={active}
      >
        {active ? '✓ Em estudo' : '+ Em estudo'}
      </button>
    </article>
  );
}

function matchesMainTrack(item: MainCurriculumItem, filter: string) {
  if (filter === 'Todas') return true;
  if (item.track === filter) return true;
  if (filter === 'Web') return item.track.includes('Web');
  if (filter === 'Sistemas') return item.track === 'Sistemas' || item.track === 'Sistemas & Redes';
  if (filter === 'Active Directory') return item.track === 'Active Directory';
  if (filter === 'Blue Team') return item.track === 'Blue Team';
  if (filter === 'Antivírus/EDR') return item.track === 'Antivírus/EDR';
  return false;
}
