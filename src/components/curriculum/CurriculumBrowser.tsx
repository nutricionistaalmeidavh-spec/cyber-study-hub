import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
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

export function CurriculumBrowser({ initialTrack, initialMode = 'main' }: { initialTrack?: string; initialMode?: ViewMode }) {
  const [mode, setMode] = useState<ViewMode>(initialMode);
  const [query, setQuery] = useState('');
  const [mainTrack, setMainTrack] = useState(initialMode === 'main' ? initialTrack || 'Todas' : 'Todas');
  const [parallelTrack, setParallelTrack] = useState(initialMode === 'parallel' ? initialTrack || 'Todas' : 'Todas');
  const [visibleCount, setVisibleCount] = useState(24);
  useEffect(() => {
    setMode(initialMode);
    if (initialMode === 'parallel') setParallelTrack(initialTrack || 'Todas');
    else setMainTrack(initialTrack || 'Todas');
    setVisibleCount(24);
  }, [initialMode, initialTrack]);
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

  const resultCount = mode === 'main' ? filteredMain.length : filteredParallel.length;
  const visibleMain = filteredMain.slice(0, visibleCount);
  const visibleParallel = filteredParallel.slice(0, visibleCount);
  const clearFilters = () => {
    setQuery('');
    setMainTrack('Todas');
    setParallelTrack('Todas');
    setVisibleCount(24);
  };
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
          <h1>Encontre sua próxima aula</h1>
          <p>
            Explore a formação principal ou escolha uma trilha paralela.
            Você pode começar pela aula 001 e avançar no seu ritmo, sem bloqueios.
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
            onClick={() => { setMode('main'); setQuery(''); setVisibleCount(24); }}
          >
            Formação principal
          </button>
          <button
            role="tab"
            aria-selected={mode === 'parallel'}
            className={mode === 'parallel' ? 'active' : ''}
            onClick={() => { setMode('parallel'); setQuery(''); setVisibleCount(24); }}
          >
            Trilhas paralelas
          </button>
        </div>

        <input
          className="search"
          value={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) => { setQuery(event.target.value); setVisibleCount(24); }}
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
                onClick={() => { setMainTrack(track); setVisibleCount(24); }}
              >
                {track}
              </button>
            ))}
          </div>

          <section className="curriculum-list" aria-label="Formação principal">
            {visibleMain.map(item => (
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
                onClick={() => { setParallelTrack(track); setVisibleCount(24); }}
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
            {visibleParallel.map(item => (
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
      <footer className="curriculum-pagination" aria-live="polite">
        <p>{resultCount === 0 ? 'Nenhuma unidade encontrada com estes filtros.' :
          'Mostrando ' + Math.min(visibleCount, resultCount) + ' de ' + resultCount + ' unidades'}</p>
        {resultCount === 0 && <button className="button ghost" onClick={clearFilters}>Limpar busca e filtros</button>}
        {resultCount > visibleCount && <button className="button ghost" onClick={() => setVisibleCount(count => count + 24)}>
          Carregar mais 24 unidades
        </button>}
      </footer>
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
