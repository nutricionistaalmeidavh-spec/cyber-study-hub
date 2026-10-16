import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useAcademyMotion } from './useAcademyMotion';
import './academy.css';
import './academy-motion.css';
import AcademyBrand from './AcademyBrand';
import AcademyWaitlist from './AcademyWaitlist';
import { waitlistCatalogCourses } from '../curriculum/courseOfferings';

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
  const [waitlistCourseId, setWaitlistCourseId] = useState(() => {
    if (typeof window === 'undefined') return 'academy';
    const selected = new URLSearchParams(window.location.search).get('curso');
    return waitlistCatalogCourses.some(course => course.id === selected) ? String(selected) : 'academy';
  });
  const [monthlyPrice,setMonthlyPrice] = useState<number|null>(null);
  const chooseWaitlistCourse = (event: MouseEvent<HTMLAnchorElement>, courseId: string) => {
    event.preventDefault();
    setWaitlistCourseId(courseId);
    window.history.replaceState(null, '', '/academy?curso=' + encodeURIComponent(courseId) + '#lista-de-espera');
    document.getElementById('lista-de-espera')?.scrollIntoView({behavior:'smooth',block:'start'});
  };

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'ArtiSys Academy — Lista de espera da próxima turma';
    // Âncoras externas funcionam mesmo após a montagem assíncrona da SPA.
    if (window.location.hash === '#lista-de-espera')
      requestAnimationFrame(() => document.getElementById('lista-de-espera')?.scrollIntoView({block:'start'}));
    let active=true;
    void fetch('/api/subscription/offer',{cache:'no-store'}).then(async response=>{
      if(!response.ok)throw Error('Configuração indisponível');
      return await response.json() as {priceCents?:unknown};
    }).then(data=>{
      if(active&&typeof data.priceCents==='number'&&Number.isSafeInteger(data.priceCents)&&data.priceCents>=100)
        setMonthlyPrice(data.priceCents);
    }).catch(()=>{/* Exibir valor a definir se o backend não estiver disponível. */});
    return () => { active=false; document.title = originalTitle; };
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
          <a href="#lista-de-espera">Lista de espera</a>
          <a href="#perguntas">Perguntas</a>
          <a href="/academy/roadmap">Votar melhorias</a>
        </nav>
        <div className="academy-header-actions">
          <a className="academy-login" href="/academy/study">Já sou aluno</a>
          <a className="academy-button academy-button-primary academy-header-cta" href="#lista-de-espera">Lista de espera <Arrow /></a>
        </div>
        <details className="academy-mobile-menu">
          <summary aria-label="Abrir menu">Menu <span aria-hidden="true">☰</span></summary>
          <nav aria-label="Navegação móvel">
            <a href="#trilhas">Trilhas e módulos</a>
            <a href="#metodo">Como funciona</a>
            <a href="#assinaturas">Assinaturas</a>
            <a href="#lista-de-espera">Lista de espera</a>
            <a href="#perguntas">Perguntas</a>
            <a href="/academy/roadmap">Votar em melhorias</a>
            <a href="/academy/study?register=1">Criar minha conta</a><a href="/academy/study">Entrar no hub</a>
          </nav>
        </details>
      </div>
      <span className="academy-scroll-progress" data-scroll-progress aria-hidden="true" />
    </header>

    <main id="conteudo">
      <section className="academy-hero academy-container" aria-labelledby="academy-hero-title">
        <div className="academy-hero-glow" aria-hidden="true"/>
        <div className="academy-hero-copy">
          <span className="academy-kicker"><span className="academy-kicker-dot" /> ÚLTIMA TURMA ENCERRADA · LISTA DE ESPERA ABERTA</span>
          <h1 id="academy-hero-title">A última turma encerrou. <em>Não perca a próxima.</em></h1>
          <p className="academy-hero-lead">Entre na lista de espera da próxima turma da ArtiSys Academy.</p>
          <p className="academy-hero-description">Escolha uma formação, deixe seu e-mail e receba o aviso quando as novas inscrições abrirem. O cadastro é gratuito.</p>
          <div className="academy-hero-actions">
            <a className="academy-button academy-button-primary" href="#lista-de-espera">Entrar na lista de espera <Arrow /></a>
            <a className="academy-button academy-button-outline" href="#metodo">Como funciona <span aria-hidden="true">↓</span></a>
          </div>
          <div className="academy-hero-proof">
            <span><b>{waitlistCatalogCourses.length}</b> formações para explorar</span>
            <span className="academy-proof-divider" aria-hidden="true"/>
            <span>Aulas práticas e projetos reais</span>
            <span className="academy-proof-divider" aria-hidden="true"/>
            <span>Estude pelo computador ou celular</span>
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
          <p>Descubra o que você pode aprender na próxima turma. Toque no + para conhecer os módulos de cada formação.</p>
        </div>
        <div className="academy-courses-grid" aria-label="Cursos publicados">
          {waitlistCatalogCourses.map(course => <details className="academy-course-card" key={course.id} data-reveal name="academy-courses" id={'curso-' + course.id}>
            <summary className="academy-course-summary">
              <span className="academy-course-card-top">
                <span className="academy-course-type">{course.status==='draft'?'PRÓXIMA TURMA · LISTA DE ESPERA':course.type==='trail'?'TRILHA PRÁTICA':'CURSO COMPLETO'}</span>
                <span className="academy-course-toggle" aria-hidden="true" />
              </span>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <span className="academy-course-card-bottom">
                <span>{course.modules.length} módulos</span>
                <span className="academy-course-expand-label">
                  <span className="academy-course-label-closed">Ver módulos</span>
                  <span className="academy-course-label-open">Ocultar módulos</span>
                  <Arrow />
                </span>
              </span>
            </summary>
            <div className="academy-course-expanded">
              <h4>Módulos desta formação</h4>
              <ol className="academy-course-modules">
                {course.modules.map((module, index) => <li className="academy-course-module" key={module.id}>
                  <span className="academy-course-module-index">{String(index + 1).padStart(2, '0')}</span>
                  <span>{module.title}</span>
                </li>)}
              </ol>
              {course.status==='draft'&&<p className="academy-course-preview-note">Gostou da formação? Entre na lista e saiba quando as novas vagas abrirem.</p>}
              <a className="academy-button academy-button-outline academy-course-waitlist"
                href={'/academy?curso=' + encodeURIComponent(course.id) + '#lista-de-espera'}
                onClick={event => chooseWaitlistCourse(event, course.id)}>
                Entrar na lista de espera <Arrow />
              </a>
            </div>
          </details>)}
        </div>

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
          <div><span className="academy-section-index">03 / ESCOLHA SEU ACESSO</span><h2 id="academy-plans-title"><KineticText leading="Seu jeito de aprender." accent="Sua próxima turma." /></h2></div>
          <p>Prefere uma formação específica ou o acesso completo? Escolha como quer estudar e entre na lista da próxima abertura.</p>
        </div>
        <div className="academy-plans-notice" data-reveal><span aria-hidden="true">◷</span><div><strong>Última turma encerrada · próxima abertura por lista de espera</strong><p>Cadastre-se gratuitamente para receber o aviso de novas vagas. Entrar na lista não gera cobrança nem garante a inscrição.</p></div></div>
        <div className="academy-plan-grid">
          <article className="academy-plan-card" data-reveal>
            <div className="academy-plan-top"><span>ACESSO POR TEMA</span><span className="academy-plan-status">Lista de espera</span></div>
            <h3>Curso individual</h3><p>Quer se aprofundar em um tema? Entre na lista da formação escolhida e receba o aviso da próxima turma.</p>
            <div className="academy-plan-price">Condições na próxima abertura</div>
            <ul><li>Foco em uma trilha de estudo</li><li>Organização por módulos e aulas</li><li>Atividades e recursos da trilha</li></ul>
            <a className="academy-button academy-button-outline" href="#lista-de-espera">Entrar na lista de espera <Arrow /></a>
          </article>
          <article className="academy-plan-card academy-plan-featured" data-reveal>
            <div className="academy-plan-top"><span>VISÃO COMPLETA</span><span className="academy-plan-status">Lista de espera</span></div>
            <h3>Assinatura mensal</h3><p>Para quem quer estudar várias formações com um único acesso, enquanto a assinatura estiver ativa.</p>
            <div className="academy-plan-price">{monthlyPrice===null?'Condições na próxima abertura':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(monthlyPrice/100)+' / mês'}</div>
            <ul><li>Todos os cursos publicados</li><li>Novos cursos e atualizações durante a assinatura</li><li>Progresso individual preservado</li></ul>
            <a className="academy-button academy-button-primary" href="#lista-de-espera">Entrar na lista de espera <Arrow /></a>
          </article>
        </div>
      </section>

      <AcademyWaitlist selectedCourseId={waitlistCourseId} />

      <section className="academy-section academy-faq-band" id="perguntas" aria-labelledby="academy-faq-title">
        <div className="academy-container academy-faq-layout">
          <div data-reveal><span className="academy-section-index">05 / DÚVIDAS FREQUENTES</span><h2 id="academy-faq-title"><KineticText leading="Tudo sobre" accent="a próxima turma." /></h2><p>Veja como funciona a lista de espera e o aviso de novas vagas.</p></div>
          <div className="academy-faq-items">
            <details data-reveal><summary>Como funciona a lista de espera?<span aria-hidden="true">+</span></summary><p>Você escolhe seu curso e deixa nome e e-mail. Quando a próxima turma abrir, entraremos em contato para avisar sobre as inscrições.</p></details>
            <details data-reveal><summary>Entrar na lista garante uma vaga?<span aria-hidden="true">+</span></summary><p>Não. A lista serve para avisar sobre a nova abertura. A vaga só é confirmada após a inscrição na turma.</p></details>
            <details data-reveal><summary>Preciso pagar agora?<span aria-hidden="true">+</span></summary><p>Não. Entrar na lista de espera é gratuito e não gera nenhuma cobrança.</p></details>
            <details data-reveal><summary>Quando recebo acesso às aulas?<span aria-hidden="true">+</span></summary><p>O acesso é liberado após a abertura da nova turma e a confirmação da sua inscrição.</p></details>
          </div>
        </div>
      </section>

      <section className="academy-container academy-last-cta" data-reveal aria-labelledby="academy-end-title">
        <span className="academy-section-index">ARTISYS ACADEMY</span>
        <h2 id="academy-end-title"><KineticText leading="A próxima turma." accent="Seu próximo passo." /></h2>
        <p>Não perca o aviso da próxima abertura. Escolha sua formação e entre na lista de espera.</p>
        <div className="academy-hero-actions"><a className="academy-button academy-button-primary" href="#lista-de-espera">Entrar na lista da próxima turma <Arrow /></a><a className="academy-button academy-button-outline" href="/academy/study">Acessar meus estudos <Arrow /></a></div>
      </section>
    </main>

    <footer className="academy-footer"><div className="academy-container academy-footer-inner"><a href="#inicio"><Brand /></a><p>Aprendizado com propósito. Tecnologia na prática.</p><div><a href="https://artisys.dev/" target="_blank" rel="noopener noreferrer">Conheça a ArtiSys <Arrow diagonal /></a><a href="/academy/roadmap">Roadmap e novidades <Arrow /></a><a href="/academy/study">Área do aluno <Arrow /></a></div><small>© 2026 ArtiSys · Academy</small></div></footer>
  </div>;
}
