import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import catalogData from '../../curriculum/catalog.json';
import type { CurriculumCatalog, MainCurriculumItem, ParallelCurriculumItem } from '../../curriculum/types';
import { lessons } from '../../data/lessons';
import { listNativeV2LessonIds } from '../../content/registry';
import { getActiveParallelTracks, setActiveParallelTracks } from '../../lib/curriculumState';
import './curriculum.css';

const catalog = catalogData as CurriculumCatalog;
type ViewMode = 'main' | 'parallel';
type ModuleGroup<T> = { name: string; items: T[] };

function groupBy<T>(items: T[], key: (item: T) => string): ModuleGroup<T>[] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const name = key(item);
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name)!.push(item);
  }
  return Array.from(groups, ([name, groupedItems]) => ({ name, items: groupedItems }));
}
const mainModules = groupBy(catalog.main, item => item.block);
const parallelModules = groupBy(catalog.parallel, item => item.track);

function moduleHref(mode: ViewMode, moduleName?: string) {
  const base = '#lessons?mode=' + mode;
  return moduleName ? base + '&module=' + encodeURIComponent(moduleName) : base;
}
function normalize(value: string) {
  return value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
function matches(value: string, normalized: string) {
  return normalize(value).includes(normalized);
}
function matchesMain(item: MainCurriculumItem, query: string) {
  return matches(item.code + ' ' + item.id + ' ' + item.title + ' ' + item.track + ' ' + item.block, query);
}
function matchesParallel(item: ParallelCurriculumItem, query: string) {
  return matches(item.code + ' ' + item.title + ' ' + item.track, query);
}

export function CurriculumBrowser({
  initialTrack, initialMode = 'main', initialModule
}: { initialTrack?: string; initialMode?: ViewMode; initialModule?: string }) {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const [activeParallel, setActiveParallel] = useState<Set<string>>(() => new Set(getActiveParallelTracks()));
  const nativeIds = useMemo(() => new Set(listNativeV2LessonIds()), []);
  const legacyIds = useMemo(() => new Set(lessons.map(lesson => lesson.id)), []);
  const selectedMain = initialMode === 'main'
    ? mainModules.find(group => group.name === initialModule)
      ?? (initialTrack ? mainModules.find(group => group.name === initialTrack || group.items.some(item => item.track === initialTrack)) : undefined)
    : undefined;
  const selectedParallel = initialMode === 'parallel'
    ? parallelModules.find(group => group.name === initialModule)
      ?? (initialTrack ? parallelModules.find(group => group.name === initialTrack) : undefined)
    : undefined;
  const selected = selectedMain ?? selectedParallel;
  const currentModules = initialMode === 'main' ? mainModules : parallelModules;
  const normalizedQuery = normalize(query);

  useEffect(() => {
    setQuery('');
    setVisibleCount(24);
  }, [initialMode, initialModule, initialTrack]);

  const visibleModules = useMemo(() => {
    if (initialMode === 'main') return mainModules.filter(group =>
      !normalizedQuery || matches(group.name, normalizedQuery) ||
      group.items.some(item => matchesMain(item, normalizedQuery)));
    return parallelModules.filter(group =>
      !normalizedQuery || matches(group.name, normalizedQuery) ||
      group.items.some(item => matchesParallel(item, normalizedQuery)));
  }, [initialMode, normalizedQuery]);

  const filteredMain = selectedMain?.items.filter(item => !normalizedQuery || matchesMain(item, normalizedQuery)) ?? [];
  const filteredParallel = selectedParallel?.items.filter(item => !normalizedQuery || matchesParallel(item, normalizedQuery)) ?? [];
  const resultCount = selected ? initialMode === 'main' ? filteredMain.length : filteredParallel.length : visibleModules.length;
  const visibleMain = filteredMain.slice(0, visibleCount);
  const visibleParallel = filteredParallel.slice(0, visibleCount);
  const detailIndex = selected ? currentModules.findIndex(group => group.name === selected.name) + 1 : -1;
  const activeCodes = selectedParallel ? [...new Set(selectedParallel.items.map(item => item.trackCode))] : [];
  const allActive = activeCodes.length > 0 && activeCodes.every(code => activeParallel.has(code));

  const clearFilters = () => { setQuery(''); setVisibleCount(24); };
  const toggleParallelCode = (code: string) => {
    setActiveParallel(previous => {
      const next = new Set(previous);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      setActiveParallelTracks([...next]);
      return next;
    });
  };
  const toggleModule = () => {
    setActiveParallel(previous => {
      const next = new Set(previous);
      for (const code of activeCodes) {
        if (allActive) next.delete(code);
        else next.add(code);
      }
      setActiveParallelTracks([...next]);
      return next;
    });
  };

  return <div className="page curriculum-page stack-lg">
    <header className="curriculum-hero curriculum-modules-hero">
      <div>
        <span className="eyebrow">BIBLIOTECA DE ESTUDOS</span>
        <h1>{selected ? selected.name : 'Escolha um módulo para estudar'}</h1>
        <p>{selected
          ? (initialMode === 'main'
            ? 'Módulo ' + String(detailIndex).padStart(2, '0') + ' da formação principal · ' + selected.items.length + ' aulas'
            : 'Trilha paralela · ' + selected.items.length + ' unidades')
          : mainModules.length + ' módulos principais · ' + parallelModules.length + ' trilhas paralelas. Escolha uma área para ver as aulas.'}</p>
      </div>
      {selected && <a className="curriculum-back-link" href={moduleHref(initialMode)}>← Voltar aos módulos</a>}
    </header>
    <nav className="curriculum-tabs" aria-label="Tipo de formação">
      <a href={moduleHref('main')} aria-current={initialMode === 'main' ? 'page' : undefined} className={initialMode === 'main' ? 'active' : ''}>
        Formação principal <small>{mainModules.length} módulos</small>
      </a>
      <a href={moduleHref('parallel')} aria-current={initialMode === 'parallel' ? 'page' : undefined} className={initialMode === 'parallel' ? 'active' : ''}>
        Trilhas paralelas <small>{parallelModules.length} trilhas</small>
      </a>
    </nav>
    <div className="curriculum-module-toolbar">
      <label className="curriculum-search-label" htmlFor="curriculum-module-search">
        {selected ? 'Buscar aula neste módulo' : 'Buscar módulo ou assunto'}
      </label>
      <input
        id="curriculum-module-search"
        className="search"
        value={query}
        onChange={(event: ChangeEvent<HTMLInputElement>) => { setQuery(event.target.value); setVisibleCount(24); }}
        placeholder={selected ? 'Nome, número ou conceito da aula…' : 'Ex.: Blue Team, Python, GraphQL…'}
        type="search"
      />
    </div>

    {!selected ? <>
      <div className="curriculum-module-count" role="status">
        Mostrando {visibleModules.length} de {currentModules.length} {initialMode === 'main' ? 'módulos' : 'trilhas'}
      </div>
      <section className="curriculum-module-grid" aria-label={initialMode === 'main' ? 'Módulos da formação principal' : 'Módulos paralelos'}>
        {initialMode === 'main'
          ? mainModules.filter(group => visibleModules.some(item => item.name === group.name)).map(group => {
              const ordinal = mainModules.findIndex(item => item.name === group.name) + 1;
              const first = group.items[0];
              const last = group.items[group.items.length - 1];
              return <ModuleCard key={group.name} name={group.name} href={moduleHref('main', group.name)}
                index={ordinal} count={group.items.length} unit="aulas"
                subtitle={first.track} start={String(first.id).padStart(3,'0') + '–' + String(last.id).padStart(3,'0')}
                example={first.title} />;
            })
          : parallelModules.filter(group => visibleModules.some(item => item.name === group.name)).map(group => {
              const ordinal = parallelModules.findIndex(item => item.name === group.name) + 1;
              const codes = [...new Set(group.items.map(item => item.trackCode))];
              return <ModuleCard key={group.name} name={group.name} href={moduleHref('parallel', group.name)}
                index={ordinal} count={group.items.length} unit="unidades"
                subtitle={codes.join(' · ')} example={group.items[0].title}
                studying={codes.some(code => activeParallel.has(code))} />;
            })}
      </section>
      {resultCount === 0 && <div className="curriculum-empty">
        <h2>Nenhum módulo encontrado</h2>
        <p>Tente outro assunto ou veja todos os módulos disponíveis.</p>
        <button className="button ghost" onClick={clearFilters}>Limpar busca e filtros</button>
      </div>}
    </> : <>
      <div className="curriculum-module-detail">
        <div>
          <span className="eyebrow">AULAS DO MÓDULO</span>
          <h2>{initialMode === 'main' ? 'Conteúdos deste módulo' : 'Conteúdos desta trilha'}</h2>
          <p>Abra qualquer unidade para estudar. O acesso não depende da conclusão das anteriores.</p>
        </div>
        {selectedParallel && <button type="button" className={allActive ? 'parallel-toggle active' : 'parallel-toggle'}
          onClick={toggleModule} aria-pressed={allActive}>
          {allActive ? '✓ Em estudo' : '+ Marcar trilha em estudo'}
        </button>}
      </div>
      <section className="curriculum-list" aria-label={'Aulas de ' + selected.name}>
        {initialMode === 'main' ? visibleMain.map(item =>
          <MainItemCard key={item.id} item={item} native={nativeIds.has(item.id)} legacy={legacyIds.has(item.id)} />
        ) : visibleParallel.map(item =>
          <ParallelItemCard key={item.code} item={item} active={activeParallel.has(item.trackCode)}
            onToggle={() => toggleParallelCode(item.trackCode)} />
        )}
      </section>
      <footer className="curriculum-pagination" aria-live="polite">
        <p>{resultCount === 0 ? 'Nenhuma aula encontrada neste módulo.' :
          'Mostrando ' + Math.min(visibleCount, resultCount) + ' de ' + resultCount + ' unidades'}</p>
        {resultCount === 0 && <button className="button ghost" onClick={clearFilters}>Limpar busca e filtros</button>}
        {resultCount > visibleCount && <button className="button ghost" onClick={() => setVisibleCount(count => count + 24)}>
          Carregar mais 24 unidades
        </button>}
      </footer>
    </>}
  </div>;
}

function ModuleCard({name, href, index, count, unit, subtitle, start, example, studying}:{
  name:string; href:string; index:number; count:number; unit:string;
  subtitle:string; start?:string; example:string; studying?:boolean
}) {
  return <a className="curriculum-module-card" href={href}>
    <div className="curriculum-module-top">
      <span className="curriculum-module-index">MÓDULO {String(index).padStart(2,'0')}</span>
      <span className="curriculum-module-arrow" aria-hidden="true">↗</span>
    </div>
    <h2>{name}</h2>
    <p className="curriculum-module-subtitle">{subtitle}</p>
    <p className="curriculum-module-example">Comece por: {example}</p>
    <div className="curriculum-module-footer">
      <strong>{count} {unit}</strong>
      {start && <span>Aulas {start}</span>}
      {studying && <span className="curriculum-module-active">Em estudo</span>}
    </div>
  </a>;
}

function MainItemCard({ item, native, legacy }:{
  item: MainCurriculumItem; native: boolean; legacy: boolean
}) {
  const interactive = native || legacy;
  const href = interactive ? '#lesson/' + item.id : '#course/main/' + item.id;
  return <a className="curriculum-row" href={href}>
    <div className="curriculum-code">{String(item.id).padStart(3, '0')}</div>
    <div className="curriculum-row-body">
      <div className="curriculum-meta"><span>{item.track}</span><span>{item.durationMin} min</span></div>
      <h3>{item.title}</h3>
      <p>{interactive ? 'Aula com atividades interativas' : 'Conteúdo de leitura'}</p>
    </div>
    <div className={'curriculum-status ' + (native ? 'native' : interactive ? 'legacy' : 'document')}>
      {interactive ? 'Interativa' : 'Leitura'}
    </div>
  </a>;
}

function ParallelItemCard({item, active, onToggle}:{
  item: ParallelCurriculumItem; active: boolean; onToggle: () => void
}) {
  return <article className="curriculum-row parallel">
    <a href={'#course/parallel/' + item.code} className="parallel-open">
      <div className="curriculum-code">{item.code}</div>
      <div className="curriculum-row-body">
        <div className="curriculum-meta"><span>{item.track}</span></div>
        <h3>{item.title}</h3>
        <p>Conteúdo completo disponível para leitura</p>
      </div>
    </a>
    <button className={active ? 'parallel-toggle active' : 'parallel-toggle'}
      type="button" onClick={onToggle} aria-pressed={active}>
      {active ? '✓ Em estudo' : '+ Em estudo'}
    </button>
  </article>;
}
