import { useEffect, useRef, useState, type CSSProperties } from 'react';
import catalogData from '../curriculum/catalog.json';
import type { CurriculumCatalog } from '../curriculum/types';
import { useAcademyMotion } from './useAcademyMotion';
import './academy.css';
import './academy-motion.css';
import AcademyBrand from './AcademyBrand';

const catalog = catalogData as CurriculumCatalog;

type CatalogMode = 'main' | 'parallel';
type ModulePreview = { title: string; count: number };
function groupModules(items: Array<{ block?: string; track?: string }>, field: 'block' | 'track'): ModulePreview[] {
  const grouped = new Map<string, number>();
  for (const item of items) {
    const title = item[field];
    if (title) grouped.set(title, (grouped.get(title) || 0) + 1);
  }
  return [...grouped].map(([title, count]) => ({ title, count }));
}
const principal = groupModules(catalog.main, 'block');
const paralelas = groupModules(catalog.parallel, 'track');

export function isAcademyPath(pathname: string) {
  return /^\/academy\/?$/.test(pathname);
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

function KineticText({ leading, accent }: { leading: string; accent: string }) {
  const words = (value: string) => value.split(' ').map((word, index) =>
    <span key={index} className="academy-kinetic-word">{word}{' '}</span>);
  return <span className="academy-kinetic" data-kinetic role="text" aria-label={leading + ' ' + accent}>
    <span aria-hidden="true">{words(leading)}<em>{words(accent)}</em></span>
  </span>;
}

function Brand() { return <AcademyBrand />; }

export default function AcademyLanding() {
  const rootRef = useRef<HTMLDivElement>(null);
  useAcademyMotion(rootRef);
  const [mode, setMode] = useState<CatalogMode>('main');
  const modules = mode === 'main' ? principal : paralelas;

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'ArtiSys Academy — Aprenda tecnologia na prática';
    return () => { document.title = originalTitle; };
  }, []);

  return <div className="academy-page" ref={rootRef} id="inicio">
    <a className="academy-skip-link" href="#conteudo">Ir para o conteúdo</a>
    <header className="academy-header">
      <div className="academy-header-inner">
        <a className="academy-brand-link" href="#inicio"><Brand /></a>
        <nav className="academy-desktop-nav" aria-label="Navegação principal">
          <a href="#trilhas">Trilhas</a>
          <a href="#metodo">Como funciona</a>
          <a href="#assinaturas">Assinaturas</a>
          <a href="#perguntas">Perguntas</a>
        </nav>
        <div className="academy-header-actions">
          <a className="academy-login" href="/">Já sou aluno</a>
          <a className="academy-button academy-button-primary academy-header-cta" href="#trilhas">Explorar trilhas <Arrow /></a>
        </div>
        <details className="academy-mobile-menu">
          <summary aria-label="Abrir menu">Menu <span aria-hidden="true">☰</span></summary>
          <nav aria-label="Navegação móvel">
            <a href="#trilhas">Trilhas e módulos</a>
            <a href="#metodo">Como funciona</a>
            <a href="#assinaturas">Assinaturas</a>
            <a href="#perguntas">Perguntas</a>
            <a href="/">Entrar no hub</a>
          </nav>
        </details>
      </div>
      <span className="academy-scroll-progress" data-scroll-progress aria-hidden="true" />
    </header>

    <main id="conteudo">
      <section className="academy-hero academy-container" aria-labelledby="academy-hero-title">
        <div className="academy-hero-glow" aria-hidden="true"/>
        <div className="academy-hero-copy">
          <span className="academy-kicker"><span className="academy-kicker-dot" /> UMA PLATAFORMA ARTISYS</span>
          <h1 id="academy-hero-title">O futuro se aprende <em>construindo.</em></h1>
          <p className="academy-hero-lead">Aprenda tecnologia. Desenvolva habilidades. Construa o futuro.</p>
          <p className="academy-hero-description">Trilhas de cibersegurança, programação e inteligência artificial, organizadas em módulos práticos. Estude no seu ritmo, aplique o conhecimento e acompanhe sua evolução.</p>
          <div className="academy-hero-actions">
            <a className="academy-button academy-button-primary" href="#trilhas">Conhecer as trilhas <Arrow /></a>
            <a className="academy-button academy-button-outline" href="#metodo">Como funciona <span aria-hidden="true">↓</span></a>
          </div>
          <div className="academy-hero-proof">
            <span><b>{principal.length}</b> módulos principais</span>
            <span className="academy-proof-divider" aria-hidden="true"/>
            <span><b>{paralelas.length}</b> trilhas paralelas</span>
            <span className="academy-proof-divider" aria-hidden="true"/>
            <span>Laboratórios e revisões</span>
          </div>
          <a className="academy-scroll-cue" href="#trilhas"><span aria-hidden="true">↓</span> Role para explorar</a>
        </div>
        <div className="academy-hero-visual" aria-label="Representação ilustrativa da experiência de aprendizado">
          <div className="academy-preview-shell">
            <div className="academy-preview-heading">
              <span className="academy-preview-dots" aria-hidden="true"><i/><i/><i/></span>
              <span>academy / meu aprendizado</span>
              <span className="academy-preview-live">PREVIEW</span>
            </div>
            <div className="academy-preview-body">
              <div className="academy-preview-overline">SUA JORNADA</div>
              <h2>Uma habilidade<br/>de cada vez<span>.</span></h2>
              <div className="academy-preview-path" aria-hidden="true">
                <div className="academy-path-card done"><span className="academy-path-icon">01</span><div><small>ETAPA 01</small><strong>Aprenda o conceito</strong></div><span className="academy-path-status">✓</span></div>
                <div className="academy-path-connector"/>
                <div className="academy-path-card active"><span className="academy-path-icon">02</span><div><small>ETAPA 02</small><strong>Pratique no laboratório</strong></div><span className="academy-path-status">↗</span></div>
                <div className="academy-path-connector"/>
                <div className="academy-path-card"><span className="academy-path-icon">03</span><div><small>ETAPA 03</small><strong>Revise e evolua</strong></div><span className="academy-path-status">○</span></div>
              </div>
              <div className="academy-preview-foot"><span>Aprender • Praticar • Revisar</span><span>ARTISYS / ACADEMY</span></div>
            </div>
          </div>
          <div className="academy-float-note"><span aria-hidden="true">✦</span> Estudo guiado. Evolução real.</div>
        </div>
      </section>

      <section className="academy-trust" aria-label="Diferenciais">
        <div className="academy-container academy-trust-inner" data-reveal>
          <span>APRENDIZADO QUE SE ADAPTA À SUA ROTINA</span>
          <p>Conteúdo por módulos <span>◆</span> Prática orientada <span>◆</span> Acesso pelo navegador e celular</p>
        </div>
      </section>

      <section className="academy-section academy-container" id="trilhas" aria-labelledby="academy-trails-title">
        <div className="academy-section-heading" data-reveal>
          <div><span className="academy-section-index">01 / EXPLORE AS FORMAÇÕES</span><h2 id="academy-trails-title"><KineticText leading="Seu próximo conhecimento" accent="começa aqui." /></h2></div>
          <p>Escolha um assunto, entre no módulo e avance aula por aula. O catálogo é organizado por temas, não por uma lista interminável de conteúdos.</p>
        </div>
        <div className="academy-catalog-panel" data-reveal>
          <div className="academy-catalog-top">
            <div className="academy-tabs" role="group" aria-label="Tipo de formação">
              <button type="button" className={mode === 'main' ? 'active' : ''} aria-pressed={mode === 'main'} onClick={() => setMode('main')}>Formação principal <span>{principal.length}</span></button>
              <button type="button" className={mode === 'parallel' ? 'active' : ''} aria-pressed={mode === 'parallel'} onClick={() => setMode('parallel')}>Trilhas paralelas <span>{paralelas.length}</span></button>
            </div>
            <span className="academy-catalog-count">{modules.length} {mode === 'main' ? 'módulos' : 'trilhas'} no catálogo</span>
          </div>
          <div className="academy-module-grid" key={mode}>
            {modules.slice(0, 6).map((module, index) => <a className="academy-module-card" key={module.title} style={{ '--academy-i': index } as CSSProperties}
              href={'/#lessons?mode=' + mode + '&module=' + encodeURIComponent(module.title)}>
              <span className="academy-module-top"><span className="academy-module-number">{String(index + 1).padStart(2, '0')}</span><span className="academy-module-arrow" aria-hidden="true">↗</span></span>
              <h3>{module.title}</h3>
              <div className="academy-module-bottom"><span>{module.count} {mode === 'main' ? 'aulas' : 'unidades'}</span><span>Explorar módulo <Arrow /></span></div>
            </a>)}
          </div>
          <div className="academy-catalog-footer">
            <p>Prévia do catálogo real. O acesso às aulas depende de uma conta na plataforma.</p>
            <a href="/">Entrar na plataforma <Arrow /></a>
          </div>
        </div>
        <a className="academy-ai-feature" data-reveal href="/#ai-dev">
          <div className="academy-ai-orb" aria-hidden="true">✳</div>
          <div><span>TRILHA EM DESTAQUE · IA APLICADA</span><h3>Desenvolva um sistema real com apoio de IA.</h3><p>Do planejamento à implementação, usando ChatGPT, Claude ou IA local opcional. Sem API paga obrigatória.</p></div>
          <strong>Conhecer a trilha <Arrow /></strong>
        </a>
      </section>

      <section className="academy-section academy-method-band" id="metodo" aria-labelledby="academy-method-title">
        <div className="academy-container">
          <div className="academy-section-heading" data-reveal>
            <div><span className="academy-section-index">02 / METODOLOGIA</span><h2 id="academy-method-title"><KineticText leading="Menos teoria solta." accent="Mais prática com direção." /></h2></div>
            <p>Uma jornada simples para aprender, testar o que entendeu e continuar de onde parou.</p>
          </div>
          <div className="academy-method-grid">
            <article data-reveal><span className="academy-method-numeral">01</span><div className="academy-method-icon" aria-hidden="true">▤</div><h3>Aprenda por módulos</h3><p>Explore temas organizados, objetivos claros e aulas em sequência, sem perder o contexto.</p></article>
            <article data-reveal><span className="academy-method-numeral">02</span><div className="academy-method-icon" aria-hidden="true">⌘</div><h3>Coloque em prática</h3><p>Consolide o conteúdo com exercícios, laboratórios e atividades para desenvolver autonomia.</p></article>
            <article data-reveal><span className="academy-method-numeral">03</span><div className="academy-method-icon" aria-hidden="true">◎</div><h3>Retome e evolua</h3><p>Use revisões e progresso individual para identificar o que já estudou e o próximo passo.</p></article>
          </div>
        </div>
      </section>

      <section className="academy-section academy-container" id="assinaturas" aria-labelledby="academy-plans-title">
        <div className="academy-section-heading" data-reveal>
          <div><span className="academy-section-index">03 / ACESSO E ASSINATURAS</span><h2 id="academy-plans-title"><KineticText leading="Uma plataforma." accent="O seu ritmo." /></h2></div>
          <p>Estamos preparando os formatos de assinatura. Conheça a proposta de acesso por trilha e ao catálogo completo.</p>
        </div>
        <div className="academy-plans-notice" data-reveal role="status"><span aria-hidden="true">◷</span><div><strong>Assinaturas em preparação</strong><p>Valores, condições comerciais e contratação ainda não estão disponíveis nesta página. Nenhuma cobrança é realizada aqui.</p></div></div>
        <div className="academy-plan-grid">
          <article className="academy-plan-card" data-reveal>
            <div className="academy-plan-top"><span>ACESSO POR TEMA</span><span className="academy-plan-status">Planejado</span></div>
            <h3>Trilha individual</h3><p>Para aprofundar uma área de conhecimento de cada vez.</p>
            <div className="academy-plan-price">Valores a definir</div>
            <ul><li>Foco em uma trilha de estudo</li><li>Organização por módulos e aulas</li><li>Atividades e recursos da trilha</li></ul>
            <a className="academy-button academy-button-outline" href="#trilhas">Conhecer trilhas <Arrow /></a>
          </article>
          <article className="academy-plan-card academy-plan-featured" data-reveal>
            <div className="academy-plan-top"><span>VISÃO COMPLETA</span><span className="academy-plan-status">Planejado</span></div>
            <h3>Academy completo</h3><p>Para quem quer explorar diferentes áreas e ampliar as possibilidades.</p>
            <div className="academy-plan-price">Valores a definir</div>
            <ul><li>Proposta de acesso ao catálogo completo</li><li>Trilhas principais e paralelas</li><li>Novos temas conforme publicação</li></ul>
            <a className="academy-button academy-button-primary" href="#perguntas">Tirar dúvidas <Arrow /></a>
          </article>
        </div>
      </section>

      <section className="academy-section academy-faq-band" id="perguntas" aria-labelledby="academy-faq-title">
        <div className="academy-container academy-faq-layout">
          <div data-reveal><span className="academy-section-index">04 / PERGUNTAS FREQUENTES</span><h2 id="academy-faq-title"><KineticText leading="Antes de" accent="começar." /></h2><p>Informações sobre o formato de estudo e a disponibilidade comercial da plataforma.</p></div>
          <div className="academy-faq-items">
            <details data-reveal><summary>Já posso contratar uma assinatura?<span aria-hidden="true">+</span></summary><p>Os planos de assinatura ainda estão em preparação. Esta página apresenta a plataforma e os formatos de acesso previstos, sem contratação ou cobrança ativa.</p></details>
            <details data-reveal><summary>Preciso pagar uma ferramenta de IA?<span aria-hidden="true">+</span></summary><p>Não há dependência de API paga para a trilha de desenvolvimento com IA. Você pode usar assistentes disponíveis, estudar sem IA ou optar por IA local se tiver hardware adequado. Alguns serviços externos oferecem planos pagos opcionais.</p></details>
            <details data-reveal><summary>Consigo estudar pelo celular?<span aria-hidden="true">+</span></summary><p>Sim. O ambiente de estudos funciona no navegador de dispositivos móveis e pode ser instalado como aplicativo web progressivo em dispositivos compatíveis.</p></details>
            <details data-reveal><summary>Como entro na plataforma?<span aria-hidden="true">+</span></summary><p>O ambiente de estudos utiliza conta individual. Neste momento, novos cadastros podem depender de convite do administrador. Se você já possui acesso, use o botão “Já sou aluno”.</p></details>
          </div>
        </div>
      </section>

      <section className="academy-container academy-last-cta" data-reveal aria-labelledby="academy-end-title">
        <span className="academy-section-index">ARTISYS ACADEMY</span>
        <h2 id="academy-end-title"><KineticText leading="Sua próxima habilidade" accent="começa com um passo." /></h2>
        <p>Explore o conteúdo, escolha uma direção e transforme curiosidade em conhecimento aplicado.</p>
        <div className="academy-hero-actions"><a className="academy-button academy-button-primary" href="#trilhas">Explorar as trilhas <Arrow /></a><a className="academy-button academy-button-outline" href="/">Acessar meus estudos <Arrow /></a></div>
      </section>
    </main>

    <footer className="academy-footer"><div className="academy-container academy-footer-inner"><a href="#inicio"><Brand /></a><p>Aprendizado com propósito. Tecnologia na prática.</p><div><a href="https://artisys.dev/" target="_blank" rel="noopener noreferrer">Conheça a ArtiSys <Arrow diagonal /></a><a href="/roadmap">Roadmap e novidades <Arrow /></a><a href="/">Área do aluno <Arrow /></a></div><small>© 2026 ArtiSys · Academy</small></div></footer>
  </div>;
}
