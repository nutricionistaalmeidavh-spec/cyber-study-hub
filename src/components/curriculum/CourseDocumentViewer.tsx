import { resolveCourseLink, parsePipeRow, isTableSeparator } from './markdownSupport';
import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import catalogData from '../../curriculum/catalog.json';
import type {
  CurriculumCatalog,
  MainCurriculumItem,
  ParallelCurriculumItem
} from '../../curriculum/types';
import { ReferencePanel } from '../references/ReferencePanel';
import './curriculum.css';

const catalog = catalogData as CurriculumCatalog;

type Props =
  | { kind: 'main'; id: number }
  | { kind: 'parallel'; code: string };

export function CourseDocumentViewer(props: Props) {
  const item = useMemo(() => {
    if (props.kind === 'main') {
      return catalog.main.find(candidate => candidate.id === props.id);
    }
    return catalog.parallel.find(candidate => candidate.code === props.code);
  }, [props]);

  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!item) {
      setError('Unidade não encontrada no catálogo.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');
    setMarkdown('');

    fetch(item.contentPath, { cache: 'force-cache' })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(text => {
        if (!cancelled) setMarkdown(text);
      })
      .catch(reason => {
        if (!cancelled) {
          setError(`Não foi possível carregar o conteúdo: ${String(reason)}`);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [item]);

  if (!item) {
    return (
      <div className="page">
        <section className="panel"><h1>Unidade não encontrada</h1></section>
      </div>
    );
  }

  const navigation = getNavigation(item);

  return (
    <div className="page course-document-page">
      <header className="course-document-topbar">
        <a href="#lessons">← Currículo</a>
        <span>{item.kind === 'main' ? `Aula ${item.id}` : item.code}</span>
      </header>

      <section className="course-document-hero">
        <span className="eyebrow">
          {item.kind === 'main' ? item.track : item.track}
        </span>
        <h1>{item.title}</h1>
        <p>
          Conteúdo editorial carregado sob demanda a partir do MASTER. Esta rota
          serve como acesso completo durante a migração gradual para experiências
          interativas V2.
        </p>
        {item.kind === 'main' && item.id >= 43 && item.id <= 100 && (
          <a className="button primary" href={`#lesson/${item.id}`}>
            Abrir experiência interativa
          </a>
        )}
      </section>

      <div className="course-document-layout">
        <main className="course-document-content">
          {loading && <p className="muted">Carregando conteúdo…</p>}
          {error && <div className="feedback bad">{error}</div>}
          {!loading && !error && <MarkdownDocument markdown={markdown} />}
        </main>

        <aside className="course-document-aside">
          <ReferencePanel curriculumItem={item} />
        </aside>
      </div>

      <nav className="course-document-nav">
        {navigation.previous ? (
          <a href={hrefFor(navigation.previous)}>← {shortLabel(navigation.previous)}</a>
        ) : <span />}
        <a href="#lessons">Currículo</a>
        {navigation.next ? (
          <a href={hrefFor(navigation.next)}>{shortLabel(navigation.next)} →</a>
        ) : <span />}
      </nav>
    </div>
  );
}

function MarkdownDocument({ markdown }: { markdown: string }) {
  const blocks = useMemo(() => parseMarkdown(markdown), [markdown]);
  return <article className="markdown-document">{blocks}</article>;
}

function parseMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const nodes: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      nodes.push(<DocumentCode key={`code-${index}`} language={language} code={code.join('\n')} />);
      continue;
    }

    // Tabelas precisam ser reconhecidas antes do parser genérico de parágrafos.
    if (index + 1 < lines.length && lines[index].includes('|') && isTableSeparator(lines[index + 1])) {
      const headers = parsePipeRow(lines[index]);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trim() && lines[index].includes('|')) {
        const cells = parsePipeRow(lines[index]);
        if (cells.length !== headers.length) break;
        rows.push(cells);
        index += 1;
      }
      nodes.push(
        <div className="markdown-table-scroll" key={`table-${index}`} tabIndex={0} aria-label="Tabela da aula, rolável horizontalmente">
          <table><thead><tr>{headers.map((c, i) => <th key={i}>{renderInline(c)}</th>)}</tr></thead>
            <tbody>{rows.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j}>{renderInline(c)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const content = renderInline(heading[2]);
      const key = `h-${index}`;
      if (level === 1) nodes.push(<h1 key={key}>{content}</h1>);
      else if (level === 2) nodes.push(<h2 key={key}>{content}</h2>);
      else if (level === 3) nodes.push(<h3 key={key}>{content}</h3>);
      else nodes.push(<h4 key={key}>{content}</h4>);
      index += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      nodes.push(<hr key={`hr-${index}`} />);
      index += 1;
      continue;
    }

    if (line.startsWith('>')) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].startsWith('>')) {
        quote.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }
      nodes.push(<blockquote key={`q-${index}`}>{renderInline(quote.join(' '))}</blockquote>);
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*-\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*-\s+/, ''));
        index += 1;
      }
      nodes.push(
        <ul key={`ul-${index}`}>
          {items.map((item, itemIndex) => {
            const checkbox = /^\[([ xX])\]\s+(.+)$/.exec(item);
            if (checkbox) {
              return (
                <li key={itemIndex} className="markdown-check">
                  <input type="checkbox" checked={checkbox[1].toLowerCase() === 'x'} readOnly />
                  <span>{renderInline(checkbox[2])}</span>
                </li>
              );
            }
            return <li key={itemIndex}>{renderInline(item)}</li>;
          })}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+\.\s+/, ''));
        index += 1;
      }
      nodes.push(
        <ol key={`ol-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraph: string[] = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,4})\s+/.test(lines[index]) &&
      !lines[index].startsWith('```') &&
      !lines[index].startsWith('>') &&
      !/^\s*-\s+/.test(lines[index]) &&
      !/^\s*\d+\.\s+/.test(lines[index]) &&
      !/^---+$/.test(lines[index].trim())
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }

    nodes.push(<p key={`p-${index}`}>{renderInline(paragraph.join(' '))}</p>);
  }

  return nodes;
}

function renderInline(text: string) {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^\)]+\))/g;
  const chunks = text.split(pattern).filter(Boolean);

  return chunks.map((chunk, index) => {
    if (chunk.startsWith('**') && chunk.endsWith('**')) {
      return <strong key={index}>{chunk.slice(2, -2)}</strong>;
    }
    if (chunk.startsWith('`') && chunk.endsWith('`')) {
      return <code key={index}>{chunk.slice(1, -1)}</code>;
    }
    const link = /^\[([^\]]+)\]\(([^\)]+)\)$/.exec(chunk);
    if (link) {
      const target = resolveCourseLink(link[2]);
      return target ? (
        <a key={index} href={target.href} target="_blank" rel="noopener noreferrer">{link[1]}</a>
      ) : <Fragment key={index}>{link[1]}</Fragment>;
    }
    return <Fragment key={index}>{chunk}</Fragment>;
  });
}

function DocumentCode({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="document-code">
      <div><span>{language || 'text'}</span><button onClick={copy}>{copied ? '✓ Copiado' : 'Copiar'}</button></div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function getNavigation(item: MainCurriculumItem | ParallelCurriculumItem) {
  if (item.kind === 'main') {
    const index = catalog.main.findIndex(candidate => candidate.id === item.id);
    return {
      previous: catalog.main[index - 1] ?? null,
      next: catalog.main[index + 1] ?? null
    };
  }

  const sameTrack = catalog.parallel.filter(candidate => candidate.trackCode === item.trackCode);
  const index = sameTrack.findIndex(candidate => candidate.code === item.code);
  return {
    previous: sameTrack[index - 1] ?? null,
    next: sameTrack[index + 1] ?? null
  };
}

function hrefFor(item: MainCurriculumItem | ParallelCurriculumItem) {
  return item.kind === 'main'
    ? `#course/main/${item.id}`
    : `#course/parallel/${item.code}`;
}

function shortLabel(item: MainCurriculumItem | ParallelCurriculumItem) {
  return item.kind === 'main' ? `Aula ${item.id}` : item.code;
}
