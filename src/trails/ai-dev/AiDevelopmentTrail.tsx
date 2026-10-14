import { useEffect, useState } from 'react';
import manifest from './manifest.json';
import pilot from './pilot.json';
import './ai-dev.css';

type PilotProgress = { completed: number[]; plan: string; checked: number[] };
const emptyProgress: PilotProgress = { completed: [], plan: '', checked: [] };

function stored(userId: string): PilotProgress {
  try {
    const parsed = JSON.parse(localStorage.getItem('hub-ai-dev-pilot:' + userId) || 'null');
    if (parsed && Array.isArray(parsed.completed) && Array.isArray(parsed.checked) && typeof parsed.plan === 'string') {
      return { completed: parsed.completed.filter((id: unknown) => Number.isInteger(id) && Number(id) >= 1 && Number(id) <= 4), checked: parsed.checked.filter((id: unknown) => Number.isInteger(id)), plan: parsed.plan.slice(0, 3000) };
    }
  } catch { /* armazenamento local indisponível */ }
  return emptyProgress;
}

export default function AiDevelopmentTrail({ userId }: { userId: string }) {
  const [progress, setProgress] = useState<PilotProgress>(() => stored(userId));
  const [selected, setSelected] = useState(1);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [mode, setMode] = useState<'chatgpt' | 'claude' | 'local' | 'offline'>('chatgpt');
  const [copied, setCopied] = useState(false);
  const [referenceRead, setReferenceRead] = useState(false);
  const [reviewed, setReviewed] = useState<number[]>([]);

  useEffect(() => {
    try { localStorage.setItem('hub-ai-dev-pilot:' + userId, JSON.stringify(progress)); }
    catch { /* a trilha pode ser estudada mesmo com armazenamento bloqueado */ }
  }, [progress, userId]);

  const lesson = pilot.lessons[selected - 1];
  const done = new Set(progress.completed);
  const isComplete = done.has(selected);
  const ready = selected === 1
    ? quizChecked && quizAnswer === pilot.lessons[0].challenge?.answer
    : selected === 2 ? reviewed.length === 3
    : selected === 3 ? referenceRead
    : progress.plan.trim().length >= 100 && progress.checked.length === 4;

  const mark = () => {
    if (!ready && !isComplete) return;
    setProgress(previous => ({
      ...previous,
      completed: isComplete ? previous.completed : [...new Set([...previous.completed, selected])]
    }));
    if (selected < 4) setSelected(selected + 1);
  };

  const copyPrompt = async () => {
    const prompt = lesson.prompt;
    if (!prompt) return;
    try { await navigator.clipboard.writeText(prompt); setCopied(true); }
    catch { setCopied(false); }
  };

  const pick = (step: number) => {
    setSelected(step);
    setCopied(false);
    setQuizAnswer(null);
    setQuizChecked(false);
    setReviewed([]);
    setReferenceRead(false);
  };

  return <div className="page ai-track">
    <div className="ai-hero">
      <div>
        <span className="eyebrow">NOVA TRILHA · PILOTO MÓDULO 01</span>
        <h1>Desenvolvimento de sistemas com IA</h1>
        <p>Aprenda a construir o Meu Gestor desde a ideia. Trabalhe com ChatGPT ou Claude pelo navegador, verifique cada resultado e use IA local apenas se desejar.</p>
        <div className="ai-pills"><span>R$ 0 obrigatório</span><span>Sem chave de API</span><span>8 módulos · 32 etapas</span></div>
      </div>
      <div className="ai-meter" aria-label={String(done.size) + ' de 4 etapas do piloto concluídas'}>
        <strong>{done.size}/4</strong><span>etapas do piloto</span>
        <div className="progress"><i style={{ width: String(done.size * 25) + '%' }} /></div>
      </div>
    </div>

    <section className="ai-roadmap" aria-label="Módulos da trilha">
      {manifest.modules.map(module => <div className={'ai-module ' + (module.id === 1 ? 'available' : 'planned')} key={module.id}>
        <span className="ai-module-number">{String(module.id).padStart(2, '0')}</span>
        <div><strong>{module.title}</strong><small>{module.duration} · {module.id === 1 ? '4 etapas disponíveis' : 'conteúdo em produção'}</small></div>
        <span className="ai-status">{module.id === 1 ? 'Piloto' : 'Em breve'}</span>
      </div>)}
    </section>

    <div className="ai-section-heading">
      <span className="eyebrow">MÓDULO 01 · PRIMEIROS PASSOS</span>
      <h2>{pilot.objective}</h2>
      <p>Comece com conceitos, pratique uma conversa orientada com IA, aprofunde na aula original e finalize um laboratório com evidência verificável.</p>
    </div>

    <div className="ai-learning-layout">
      <nav className="ai-steps" aria-label="Etapas do módulo 1">
        {pilot.lessons.map((step, index) => <button
          type="button" key={step.stepId}
          className={'ai-step ' + (selected === step.stepId ? 'selected ' : '') + (done.has(step.stepId) ? 'completed' : '')}
          onClick={() => pick(step.stepId)}
          aria-current={selected === step.stepId ? 'step' : undefined}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div><strong>{step.title}</strong><small>{step.durationMin} min · {done.has(step.stepId) ? 'Concluída' : 'Disponível'}</small></div>
        </button>)}
      </nav>

      <article className="ai-lesson panel">
        <div className="ai-lesson-top"><span className="eyebrow">ETAPA {String(selected).padStart(2, '0')} / 04</span><span>{lesson.durationMin} min</span></div>
        <h2>{lesson.title}</h2>
        <p className="ai-lead">{lesson.lead}</p>

        {'sections' in lesson && Array.isArray(lesson.sections) && lesson.sections.map((section, index) => <section className="ai-reading" key={index}>
          <h3>{section.heading}</h3><p>{section.body}</p>
        </section>)}

        {selected === 1 && pilot.lessons[0].challenge && <section className="ai-exercise">
          <span className="eyebrow">CHECAGEM DE APRENDIZAGEM</span>
          <h3>{pilot.lessons[0].challenge.question}</h3>
          {pilot.lessons[0].challenge.options.map((option, index) => <label key={option} className="ai-answer">
            <input type="radio" name="ai-pilot-concept" checked={quizAnswer === index} onChange={() => { setQuizAnswer(index); setQuizChecked(false); }} />
            <span>{option}</span>
          </label>)}
          <button type="button" className="button ghost" disabled={quizAnswer === null} onClick={() => setQuizChecked(true)}>Verificar resposta</button>
          {quizChecked && <p role="status" className={quizAnswer === pilot.lessons[0].challenge.answer ? 'ai-success' : 'ai-warning'}>
            {quizAnswer === pilot.lessons[0].challenge.answer ? pilot.lessons[0].challenge.feedback : 'Revise a diferença entre uma regra testável e um detalhe visual. Tente novamente.'}
          </p>}
        </section>}

        {(selected === 2 || selected === 4) && <section className="ai-exercise">
          <span className="eyebrow">ASSISTENTE DE IA · SEM API</span>
          <h3>Escolha como deseja estudar</h3>
          <div className="ai-choices">
            {([['chatgpt', 'ChatGPT'], ['claude', 'Claude'], ['local', 'IA local (opcional)'], ['offline', 'Sem IA']] as const).map(([value, label]) =>
              <button key={value} type="button" className={mode === value ? 'ai-choice active' : 'ai-choice'} onClick={() => setMode(value)} aria-pressed={mode === value}>{label}</button>)}
          </div>
          {mode === 'chatgpt' && <p>Use o <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">ChatGPT no navegador ↗</a>. Acesso gratuito pode ter limites; não exige API ou assinatura para seguir o roteiro.</p>}
          {mode === 'claude' && <p>Use o <a href="https://claude.ai/" target="_blank" rel="noopener noreferrer">Claude no navegador ↗</a>. Disponibilidade gratuita e limites dependem do serviço e da região.</p>}
          {mode === 'local' && <p>Opcional: use Ollama com modelo compatível com seu computador. Não é pré-requisito e não há garantia de que um modelo leve consiga gerar código completo.</p>}
          {mode === 'offline' && <p>Leia o exemplo, resolva as perguntas e siga o roteiro do laboratório sem IA. Os critérios de conclusão são os mesmos.</p>}
          <label htmlFor="ai-prompt" className="ai-field-label">Prompt sugerido — revise antes de enviar</label>
          <textarea id="ai-prompt" className="ai-prompt" readOnly value={lesson.prompt || ''} rows={8} />
          <button type="button" className="button ghost" onClick={() => void copyPrompt()}>{copied ? 'Prompt copiado' : 'Copiar prompt'}</button>
          <p className="ai-privacy">Não cole senhas, tokens, dados reais de clientes/pacientes ou conteúdo confidencial. O HubEstudos não envia suas respostas a nenhum provedor de IA.</p>
        </section>}

        {selected === 2 && 'reviewQuestions' in lesson && Array.isArray(lesson.reviewQuestions) && <section className="ai-exercise">
          <h3>Revise a resposta por conta própria</h3>
          <p>Marque os três itens após revisar uma resposta de IA ou o roteiro sem IA.</p>
          {lesson.reviewQuestions.map((question, index) => <label className="ai-check" key={question}>
            <input type="checkbox" checked={reviewed.includes(index)} onChange={event => setReviewed(previous => event.target.checked ? [...previous, index] : previous.filter(x => x !== index))} />
            <span>{question}</span>
          </label>)}
          <details><summary>Exemplo de conclusão sem IA</summary><p>Uma resposta adequada descreve só clientes, ordens e estados, inclui a regra de estado inicial pendente e rejeita clientes inexistentes. Nunca aceite código sem verificar os exemplos.</p></details>
        </section>}

        {selected === 3 && <section className="ai-exercise">
          <span className="eyebrow">BIBLIOTECA EXISTENTE · SEM DUPLICAÇÃO</span>
          <h3>LOG-01 — Algoritmos e decomposição de problemas</h3>
          <p>Abra a aula canônica, resolva o exercício de decomposição e retorne ao piloto. Pré-requisito recomendado, não bloqueio técnico.</p>
          <a href="#course/parallel/LOG-01" className="button ghost">Abrir aula LOG-01 ↗</a>
          <p>{'challengeText' in lesson ? lesson.challengeText : ''}</p>
          <label className="ai-check"><input type="checkbox" checked={referenceRead} onChange={e => setReferenceRead(e.target.checked)} /><span>Li a referência e consigo explicar o caso inválido sem copiar uma resposta.</span></label>
        </section>}

        {selected === 4 && <section className="ai-exercise">
          <span className="eyebrow">LABORATÓRIO 01 · PROJETO MEU GESTOR</span>
          <h3>Seu primeiro artefato</h3>
          {'brief' in lesson && Array.isArray(lesson.brief) && <ul>{lesson.brief.map(item => <li key={item}>{item}</li>)}</ul>}
          <div className="ai-actions"><a href="/course-labs/ai-dev-meu-gestor/starter.html" target="_blank" rel="noopener noreferrer" className="button primary">Abrir prévia do Meu Gestor ↗</a><a href="/course-labs/ai-dev-meu-gestor/README.md" target="_blank" rel="noopener noreferrer" className="button ghost">Instruções e código-base ↗</a></div>
          <p className="ai-privacy">Esta prévia funciona sem conta, API, instalação ou dados reais. Ao atualizar a página, os estados retornam aos valores fictícios iniciais.</p>
          <label htmlFor="ai-plan" className="ai-field-label">Registre seu plano: usuário, problema, funcionalidades e regras (mínimo 100 caracteres)</label>
          <textarea id="ai-plan" className="ai-notes" rows={7} maxLength={3000} placeholder="Ex.: O responsável pela oficina precisa acompanhar ordens... Uma ordem recém-criada começa pendente..." value={progress.plan} onChange={event => setProgress(previous => ({ ...previous, plan: event.target.value }))} />
          <small className="muted">{progress.plan.trim().length}/100 caracteres mínimos · salvo neste dispositivo</small>
          <h3>Critérios de aceitação</h3>
          {'acceptance' in lesson && Array.isArray(lesson.acceptance) && lesson.acceptance.map((item, index) => <label className="ai-check" key={item}>
            <input type="checkbox" checked={progress.checked.includes(index)} onChange={event => setProgress(previous => ({ ...previous, checked: event.target.checked ? [...previous.checked, index] : previous.checked.filter(x => x !== index) }))} />
            <span>{item}</span>
          </label>)}
        </section>}

        <div className="ai-lesson-footer">
          {isComplete ? <p className="ai-success" role="status">Etapa registrada como concluída neste dispositivo.</p> : <p className="muted">Conclusão exige a atividade de verificação desta etapa. É um registro do aluno, não uma certificação automática.</p>}
          <button type="button" className="button primary" disabled={!ready && !isComplete} onClick={isComplete && selected < 4 ? () => pick(selected + 1) : mark}>
            {isComplete ? (selected < 4 ? 'Próxima etapa →' : 'Módulo concluído') : 'Registrar conclusão e avançar →'}
          </button>
        </div>
      </article>
    </div>
    <p className="ai-disclaimer">Progresso do piloto armazenado apenas neste dispositivo, separado das 543 unidades do currículo original. Não há sincronização entre dispositivos nesta versão.</p>
  </div>;
}
