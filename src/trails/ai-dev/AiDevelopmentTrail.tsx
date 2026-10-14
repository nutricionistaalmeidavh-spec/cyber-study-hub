import { useEffect, useMemo, useState } from 'react';
import manifest from './manifest.json';
import learning from './modules.json';
import './ai-dev.css';

type Section = { heading: string; body: string; example?: string; counterexample?: string };
type Challenge = { question: string; options: string[]; answer: number; feedback: string };
type Lesson = { stepId: number; kind: string; durationMin: number; title: string; lead: string;
  sections?: Section[]; challenge?: Challenge; reviewQuestions?: string[]; prompt?: string;
  referenceCode?: string; referencePath?: string; challengeText?: string; brief?: string[];
  acceptance?: string[]; starterUrl?: string; starterSourceUrl?: string; assessmentPrompt?: string };
type Module = { moduleId: number; version: number; title: string; objective: string;
  learningOutcomes: string[]; lessons: Lesson[]; assessmentPath: string; answerKeyPath: string };
type Progress = { completed: number[]; notes: Record<number, string>; checked: Record<number, number[]> };
const modules = (learning as unknown as { modules: Module[] }).modules;
const modes = [
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { id: 'claude', name: 'Claude', url: 'https://claude.ai/' },
  { id: 'local', name: 'IA local (opcional)', url: '' },
  { id: 'offline', name: 'Sem IA', url: '' }
] as const;
type Mode = (typeof modes)[number]['id'];
const empty = (): Progress => ({ completed: [], notes: {}, checked: {} });
const progressKey = (userId: string) => 'hub-ai-dev-learning-v2:' + userId;
function initial(userId: string): Progress {
  try {
    const stored = JSON.parse(localStorage.getItem(progressKey(userId)) || 'null');
    if (stored && Array.isArray(stored.completed) && stored.notes && stored.checked)
      return { completed: stored.completed.filter((n: unknown) => Number.isInteger(n)), notes: stored.notes, checked: stored.checked };
    // A conclusão antiga é preservada como referência, sem promovê-la automaticamente.
  } catch { /* armazenamento desativado */ }
  return empty();
}

export default function AiDevelopmentTrail({ userId }: { userId: string }) {
  const [progress, setProgress] = useState<Progress>(() => initial(userId));
  const [moduleId, setModuleId] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checkedAnswer, setCheckedAnswer] = useState(false);
  const [referenceRead, setReferenceRead] = useState(false);
  const [mode, setMode] = useState<Mode>('chatgpt');
  const [copied, setCopied] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState('');
  const [keyRevealed, setKeyRevealed] = useState<Record<number, boolean>>({});
  const module = modules.find(m => m.moduleId === moduleId) || modules[0];
  const lesson = module.lessons[stepIndex];
  const complete = progress.completed.includes(lesson.stepId);
  const check = progress.checked[lesson.stepId] || [];
  const notes = progress.notes[lesson.stepId] || '';
  const doneInModule = module.lessons.filter(l => progress.completed.includes(l.stepId)).length;
  const allCount = useMemo(() => modules.flatMap(m => m.lessons).filter(l => progress.completed.includes(l.stepId)).length, [progress.completed]);

  useEffect(() => {
    try { localStorage.setItem(progressKey(userId), JSON.stringify(progress)); } catch { /* estudo permanece acessível */ }
  }, [userId, progress]);

  const choose = (m: number, i: number) => {
    setModuleId(m); setStepIndex(i); setAnswer(null); setCheckedAnswer(false); setCopied(false); setReferenceRead(false); setQuizAttempt('');
  };
  const toggleCheck = (n: number) => setProgress(p => {
    const old = p.checked[lesson.stepId] || [];
    const next = old.includes(n) ? old.filter(x => x !== n) : [...old, n];
    return { ...p, checked: { ...p.checked, [lesson.stepId]: next } };
  });
  const updateNotes = (value: string) => setProgress(p => ({ ...p, notes: { ...p.notes, [lesson.stepId]: value.slice(0, 4500) } }));
  const isValid = lesson.kind === 'microaula'
    ? checkedAnswer && answer === lesson.challenge?.answer
    : lesson.kind === 'microaula-ia' ? check.length >= (lesson.reviewQuestions?.length || 3)
    : lesson.kind === 'referencia' ? referenceRead && quizAttempt.trim().length >= 50
    : notes.trim().length >= 120 && check.length === (lesson.acceptance?.length || 5);
  const mark = () => {
    if (!complete && !isValid) return;
    if (!complete) setProgress(p => ({ ...p, completed: [...new Set([...p.completed, lesson.stepId])] }));
    if (stepIndex < 3) choose(moduleId, stepIndex + 1);
    else if (moduleId < modules.length) choose(moduleId + 1, 0);
  };
  const copyPrompt = async () => {
    if (!lesson.prompt) return;
    try { await navigator.clipboard.writeText(lesson.prompt); setCopied(true); } catch { setCopied(false); }
  };

  return <div className="page ai-track">
    <header className="ai-hero">
      <div><span className="eyebrow">FORMAÇÃO PRÁTICA · MEU GESTOR</span>
        <h1>Desenvolvimento de Sistemas com IA</h1>
        <p>Construa um sistema por etapas. Use ChatGPT ou Claude pelo navegador; IA local, apenas se o computador comportar. Laboratórios e explicações não exigem serviços pagos.</p>
        <div className="ai-pills"><span>R$ 0 obrigatório</span><span>Sem chave de API</span><span>8 módulos disponíveis</span><span>8 módulos · 32 etapas</span></div>
      </div>
      <div className="ai-meter"><strong>{allCount}/32</strong><span>etapas disponíveis registradas</span><div className="progress"><i style={{ width: allCount * 100 / 32 + '%' }} /></div></div>
    </header>

    <section className="ai-roadmap" aria-label="Módulos da formação">
      {manifest.modules.map(m => {
        const released = m.status === 'available';
        const count = released ? modules[m.id - 1].lessons.filter(s => progress.completed.includes(s.stepId)).length : 0;
        return released
          ? <button type="button" key={m.id} className={'ai-module available ' + (moduleId === m.id ? 'selected' : '')} aria-pressed={moduleId === m.id} onClick={() => choose(m.id, 0)}>
              <span className="ai-module-number">{String(m.id).padStart(2, '0')}</span><span className="ai-module-label"><strong>{m.title}</strong><small>{m.duration} · {count}/4 etapas</small></span><span className="ai-status">Estudar ↗</span>
            </button>
          : <div key={m.id} className="ai-module planned" aria-disabled="true"><span className="ai-module-number">{String(m.id).padStart(2, '0')}</span><span className="ai-module-label"><strong>{m.title}</strong><small>{m.duration}</small></span><span className="ai-status">Em breve</span></div>;
      })}
    </section>

    <section className="ai-section-heading">
      <span className="eyebrow">MÓDULO {String(moduleId).padStart(2, '0')} · {doneInModule}/4 ETAPAS REGISTRADAS</span>
      <h2>{module.title}</h2><p>{module.objective}</p>
      <details className="ai-objectives"><summary>O que você deverá saber fazer</summary><ul>{module.learningOutcomes.map(o => <li key={o}>{o}</li>)}</ul></details>
    </section>

    <div className="ai-learning-layout">
      <nav className="ai-steps" aria-label={'Etapas do módulo ' + moduleId}>
        {module.lessons.map((step, i) => <button key={step.stepId} type="button" className={'ai-step ' + (i === stepIndex ? 'selected ' : '') + (progress.completed.includes(step.stepId) ? 'completed' : '')} aria-current={i === stepIndex ? 'step' : undefined} onClick={() => choose(moduleId, i)}>
          <span>{String(i + 1).padStart(2, '0')}</span><span className="ai-step-label"><strong>{step.title}</strong><small>{step.durationMin} min · {progress.completed.includes(step.stepId) ? 'Registrada' : 'Disponível'}</small></span>
        </button>)}
      </nav>
      <article className="ai-lesson panel" aria-labelledby="ai-lesson-title">
        <div className="ai-lesson-top"><span className="eyebrow">ETAPA {String(lesson.stepId).padStart(2, '0')} / 32</span><span>{lesson.durationMin} min</span></div>
        <h2 id="ai-lesson-title">{lesson.title}</h2><p className="ai-lead">{lesson.lead}</p>
        {lesson.sections?.map((s, i) => <section className="ai-reading" key={i}>
          <h3>{s.heading}</h3><p>{s.body}</p>
          {s.example && <p><strong>Exemplo aplicável:</strong> {s.example}</p>}
          {s.counterexample && <p><strong>Erro comum:</strong> {s.counterexample}</p>}
        </section>)}
        {lesson.challenge && <section className="ai-exercise">
          <span className="eyebrow">VERIFIQUE UMA REGRA</span><h3>{lesson.challenge.question}</h3>
          {lesson.challenge.options.map((o, i) => <label key={o} className="ai-answer"><input type="radio" name={'ai-question-' + lesson.stepId} checked={answer === i} onChange={() => { setAnswer(i); setCheckedAnswer(false); }} /><span>{o}</span></label>)}
          <button type="button" className="button ghost" disabled={answer === null} onClick={() => setCheckedAnswer(true)}>Verificar</button>
          {checkedAnswer && <p role="status" className={answer === lesson.challenge.answer ? 'ai-success' : 'ai-warning'}>{answer === lesson.challenge.answer ? lesson.challenge.feedback : 'Releia o mecanismo e tente novamente com um caso negativo.'}</p>}
        </section>}
        {lesson.prompt && <section className="ai-exercise">
          <span className="eyebrow">ASSISTENTE EXTERNO · NÃO INTEGRADO AO HUB</span><h3>Escolha uma forma de estudar</h3>
          <div className="ai-choices">{modes.map(m => <button key={m.id} className={'ai-choice ' + (mode === m.id ? 'active' : '')} type="button" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>{m.name}</button>)}</div>
          {mode === 'chatgpt' && <p><a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Abrir ChatGPT ↗</a> · Acesso gratuito pode ter limites; nenhuma API é necessária.</p>}
          {mode === 'claude' && <p><a href="https://claude.ai/" target="_blank" rel="noopener noreferrer">Abrir Claude ↗</a> · Acesso gratuito sujeito a condições do serviço.</p>}
          {mode === 'local' && <p>Ollama é opcional para quem tem recursos de hardware suficientes. Nenhuma pontuação depende de IA local.</p>}
          {mode === 'offline' && <p>Leia as explicações, siga o laboratório e teste as regras manualmente. Não é preciso conta em assistente externo.</p>}
          <label htmlFor="ai-prompt" className="ai-field-label">Prompt didático — revise antes de enviar</label><textarea id="ai-prompt" className="ai-prompt" readOnly rows={8} value={lesson.prompt}/>
          <button type="button" className="button ghost" onClick={() => void copyPrompt()}>{copied ? 'Prompt copiado' : 'Copiar prompt'}</button>
          <p className="ai-privacy">Não inclua dados reais, senhas, tokens, informações clínicas ou arquivos privados. Este site não transmite prompts para a IA.</p>
        </section>}
        {lesson.reviewQuestions && <section className="ai-exercise"><h3>Revisão crítica da resposta</h3><p>Use uma resposta de IA ou compare com os exemplos da aula. Marque após inspecionar o critério, não apenas por ter lido.</p>
          {lesson.reviewQuestions.map((r, i) => <label className="ai-check" key={r}><input type="checkbox" checked={check.includes(i)} onChange={() => toggleCheck(i)} /><span>{r}</span></label>)}
        </section>}
        {lesson.referenceCode && <section className="ai-exercise">
          <span className="eyebrow">AULA REAPROVEITADA, SEM DUPLICAÇÃO</span><h3>{lesson.referenceCode}</h3>
          <a href={lesson.referencePath} className="button ghost">Abrir aula {lesson.referenceCode} ↗</a>
          <p>{lesson.challengeText}</p>
          <label htmlFor="ai-transfer" className="ai-field-label">Explique o caso com suas palavras (mínimo 50 caracteres)</label>
          <textarea id="ai-transfer" className="ai-notes" rows={4} value={quizAttempt} onChange={e => setQuizAttempt(e.target.value)}/>
          <label className="ai-check"><input type="checkbox" checked={referenceRead} onChange={e => setReferenceRead(e.target.checked)}/><span>Estudei a aula e consigo prever um caso inválido sem consultar o gabarito.</span></label>
        </section>}
        {lesson.brief && <section className="ai-exercise">
          <span className="eyebrow">LABORATÓRIO INCREMENTAL · PROJETO MEU GESTOR</span>
          <h3>Prática com evidências</h3><ol>{lesson.brief.map(x => <li key={x}>{x}</li>)}</ol>
          <div className="ai-actions">{lesson.starterUrl && <a className="button primary" href={lesson.starterUrl} target="_blank" rel="noopener noreferrer">Abrir artefato ↗</a>}
          {lesson.starterSourceUrl && <a className="button ghost" href={lesson.starterSourceUrl} target="_blank" rel="noopener noreferrer">Roteiro do projeto ↗</a>}
          {moduleId === 2 && <a className="button ghost" href="/course-labs/ai-dev-meu-gestor/module-02/spec-template.md" target="_blank" rel="noopener noreferrer">Modelo de requisitos ↗</a>}</div>
          {moduleId >= 3 && <p className="ai-privacy">Os checkpoints React são projetos-fonte: salve a pasta inteira e execute npm install e npm run dev em seu computador. Não basta abrir index.html no navegador. O caminho acima aponta para o repositório de arquivos da aula.</p>}
          {lesson.assessmentPrompt && <p><strong>Desafio adicional:</strong> {lesson.assessmentPrompt}</p>}
          <label htmlFor="ai-lab-notes" className="ai-field-label">Registro: decisão, previsão, resultado e erro corrigido (mínimo 120 caracteres)</label>
          <textarea id="ai-lab-notes" className="ai-notes" rows={7} value={notes} maxLength={4500} onChange={e => updateNotes(e.target.value)} placeholder="Descreva o que você fez, o que esperava e o que observou..."/>
          <small className="muted">{notes.trim().length}/120 caracteres mínimos · salvo apenas neste dispositivo</small>
          <h3>Critérios de aceitação (autodeclaração)</h3>{lesson.acceptance?.map((item,i) => <label key={item} className="ai-check"><input type="checkbox" checked={check.includes(i)} onChange={() => toggleCheck(i)} /><span>{item}</span></label>)}
        </section>}
        <footer className="ai-lesson-footer">
          <p className={complete ? 'ai-success' : 'muted'}>{complete ? 'Etapa registrada neste dispositivo.' : 'Conclua a atividade antes de registrar a etapa. O registro não é certificação de competência.'}</p>
          <button type="button" className="button primary" disabled={!complete && !isValid} onClick={mark}>{complete ? 'Próxima etapa →' : 'Registrar conclusão →'}</button>
        </footer>
      </article>
    </div>
    <section className="panel ai-final" aria-label="Avaliação independente do módulo">
      <span className="eyebrow">PROVA INDEPENDENTE · MÓDULO {String(moduleId).padStart(2,'0')}</span>
      <h2>Confirme o aprendizado sem copiar o exemplo</h2>
      <p>Seis desafios de transferência, separados dos exercícios guiados. Responda antes de consultar o gabarito. Critério sugerido: 10 de 12 pontos e nenhum erro eliminatório.</p>
      <div className="ai-actions"><a href={module.assessmentPath} target="_blank" rel="noopener noreferrer" className="button primary">Abrir prova ↗</a><button type="button" className="button ghost" onClick={() => setKeyRevealed(p => ({ ...p, [moduleId]: !p[moduleId] }))}>{keyRevealed[moduleId] ? 'Ocultar gabarito' : 'Já fiz a primeira tentativa'}</button></div>
      {keyRevealed[moduleId] && <p><a href={module.answerKeyPath} target="_blank" rel="noopener noreferrer">Consultar gabarito e rubrica ↗</a> · A confirmação é do aluno e não equivale a revisão humana.</p>}
    </section>
    <p className="ai-disclaimer">As avaliações A são editoriais, assistidas por IA, não certificações do aluno. O progresso desta trilha é local, por identificador de conta, e ainda não é sincronizado entre dispositivos.</p>
  </div>;
}
