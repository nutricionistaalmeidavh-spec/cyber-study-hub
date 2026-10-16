import { useEffect, useRef, useState } from 'react';
import { useAcademyMotion } from './useAcademyMotion';
import './academy.css';
import './academy-motion.css';
import AcademyBrand from './AcademyBrand';
import AcademyWaitlist from './AcademyWaitlist';
import { studyInventory } from '../lib/studyInventory';
import { waitlistCatalogCourses } from '../curriculum/courseOfferings';
import AcademyCourseCards from './AcademyCourseCards';

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
  const [waitlistCourseId,setWaitlistCourseId] = useState(()=>{
    const requested = new URLSearchParams(window.location.search).get('curso');
    return waitlistCatalogCourses.some(course=>course.id===requested) ? String(requested) : 'academy';
  });
  const [monthlyPrice,setMonthlyPrice] = useState<number|null>(null);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'ArtiSys Academy — Aprenda tecnologia na prática';
    // Link externo com hash deve pousar na seção após React renderizar a landing.
    if(window.location.hash==='#lista-de-espera')requestAnimationFrame(()=>
      document.getElementById('lista-de-espera')?.scrollIntoView({block:'start'}));
    let active=true;
    void fetch('/api/subscription/offer',{cache:'no-store'}).then(async response=>{
      if(!response.ok)throw Error('Configuração indisponível');
      return await response.json() as {priceCents?:unknown};
    }).then(data=>{
      if(active&&Number.isSafeInteger(data.priceCents)&&Number(data.priceCents)>=100)
        setMonthlyPrice(Number(data.priceCents));
    }).catch(()=>{/* Vitrine mantém valor indefinido até configuração do servidor. */});
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
          <a href="/roadmap">Votar melhorias</a>
        </nav>
        <div className="academy-header-actions">
          <a className="academy-login" href="/">Já sou aluno</a>
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
            <a href="/roadmap">Votar em melhorias</a>
            <a href="/?register=1">Criar minha conta</a><a href="/">Entrar no hub</a>
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
            <a className="academy-button academy-button-primary" href="#lista-de-espera">Entrar na lista de espera <Arrow /></a>
            <a className="academy-button academy-button-outline" href="#metodo">Como funciona <span aria-hidden="true">↓</span></a>
          </div>
          <div className="academy-hero-proof">
            <span><b>{waitlistCatalogCourses.length}</b> formações na vitrine</span>
            <span className="academy-proof-divider" aria-hidden="true"/>
            <span>Formações práticas e projetos reais</span>
            <span className="academy-proof-divider" aria-hidden="true"/>
            <span><b>{studyInventory.totalSteps}</b> etapas de estudo no Hub</span>
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
          <p>Conheça as formações e toque no + de cada card para visualizar seus módulos. Engenharia Reversa com IA aparece como prévia para lista de espera; a participação não libera aulas.</p>
        </div>
        <AcademyCourseCards onChoose={setWaitlistCourseId} />

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
          <p>Curso individual e assinatura completa estão em lista de espera. O administrador define o valor mensal da assinatura.</p>
        </div>
        <div className="academy-plans-notice" data-reveal role="status"><span aria-hidden="true">◷</span><div><strong>Inscrições em lista de espera</strong><p>O preço exibido é informativo. A contratação online ainda não está disponível nesta página e não há cobrança ao se cadastrar.</p></div></div>
        <div className="academy-plan-grid">
          <article className="academy-plan-card" data-reveal>
            <div className="academy-plan-top"><span>ACESSO POR TEMA</span><span className="academy-plan-status">Lista de espera</span></div>
            <h3>Curso individual</h3><p>Inscreva seu interesse em uma formação específica para receber novidades da abertura de vagas.</p>
            <div className="academy-plan-price">Valores a definir</div>
            <ul><li>Foco em uma trilha de estudo</li><li>Organização por módulos e aulas</li><li>Atividades e recursos da trilha</li></ul>
            <a className="academy-button academy-button-outline" href="#lista-de-espera">Entrar na lista de espera <Arrow /></a>
          </article>
          <article className="academy-plan-card academy-plan-featured" data-reveal>
            <div className="academy-plan-top"><span>VISÃO COMPLETA</span><span className="academy-plan-status">Planejado</span></div>
            <h3>Assinatura mensal</h3><p>Acesso a todos os cursos publicados e atualizações durante a vigência.</p>
            <div className="academy-plan-price">{monthlyPrice===null?'Valor mensal a definir':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(monthlyPrice/100)+' / mês'}</div>
            <ul><li>Todos os cursos publicados</li><li>Novos cursos e atualizações durante a assinatura</li><li>Progresso individual preservado</li></ul>
            <a className="academy-button academy-button-primary" href="#lista-de-espera">Entrar na lista de espera <Arrow /></a>
          </article>
        </div>
      </section>

      <AcademyWaitlist selectedCourseId={waitlistCourseId} />

      <section className="academy-section academy-faq-band" id="perguntas" aria-labelledby="academy-faq-title">
        <div className="academy-container academy-faq-layout">
          <div data-reveal><span className="academy-section-index">05 / PERGUNTAS FREQUENTES</span><h2 id="academy-faq-title"><KineticText leading="Antes de" accent="começar." /></h2><p>Informações sobre o formato de estudo e a disponibilidade comercial da plataforma.</p></div>
          <div className="academy-faq-items">
            <details data-reveal><summary>Já posso contratar uma assinatura?<span aria-hidden="true">+</span></summary><p>Os planos de assinatura ainda estão em preparação. Esta página apresenta a plataforma e os formatos de acesso previstos, sem contratação ou cobrança ativa.</p></details>
            <details data-reveal><summary>Preciso pagar uma ferramenta de IA?<span aria-hidden="true">+</span></summary><p>Sem API paga obrigatória: a trilha de desenvolvimento com IA pode ser concluída com alternativas gratuitas e locais. Você pode usar assistentes disponíveis, estudar sem IA ou optar por IA local se tiver hardware adequado. Alguns serviços externos oferecem planos pagos opcionais.</p></details>
            <details data-reveal><summary>Consigo estudar pelo celular?<span aria-hidden="true">+</span></summary><p>Sim. O ambiente de estudos funciona no navegador de dispositivos móveis e pode ser instalado como aplicativo web progressivo em dispositivos compatíveis.</p></details>
            <details data-reveal><summary>É preciso criar uma conta para participar da lista de espera?<span aria-hidden="true">+</span></summary><p>Não. Para receber as novidades, basta informar seu nome, e-mail, curso de interesse e concordar com o contato. A lista de espera não libera cursos nem gera compromisso de compra.</p></details>
            <details data-reveal><summary>Como entro na plataforma?<span aria-hidden="true">+</span></summary><p>O ambiente de estudos utiliza conta individual. Alunos podem criar a própria conta sem convite e sem código por e-mail. Professores e administradores recebem convite da equipe. Ter uma conta não libera automaticamente cursos pagos.</p></details>
          </div>
        </div>
      </section>

      <section className="academy-container academy-last-cta" data-reveal aria-labelledby="academy-end-title">
        <span className="academy-section-index">ARTISYS ACADEMY</span>
        <h2 id="academy-end-title"><KineticText leading="Sua próxima habilidade" accent="começa com um passo." /></h2>
        <p>Explore o conteúdo, escolha uma direção e transforme curiosidade em conhecimento aplicado.</p>
        <div className="academy-hero-actions"><a className="academy-button academy-button-primary" href="#lista-de-espera">Participar da lista de espera <Arrow /></a><a className="academy-button academy-button-outline" href="/">Acessar meus estudos <Arrow /></a></div>
      </section>
    </main>

    <footer className="academy-footer"><div className="academy-container academy-footer-inner"><a href="#inicio"><Brand /></a><p>Aprendizado com propósito. Tecnologia na prática.</p><div><a href="https://artisys.dev/" target="_blank" rel="noopener noreferrer">Conheça a ArtiSys <Arrow diagonal /></a><a href="/roadmap">Roadmap e novidades <Arrow /></a><a href="/">Área do aluno <Arrow /></a></div><small>© 2026 ArtiSys · Academy</small></div></footer>
  </div>;
}
