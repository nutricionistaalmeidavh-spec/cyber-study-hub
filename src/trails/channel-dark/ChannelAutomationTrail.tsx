import { useEffect, useMemo, useState } from 'react';
import manifest from './manifest.json';
import '../ai-dev/ai-dev.css';
import './channel-dark.css';
import { getStudyDraft, saveStudyVisit, syncCanonicalGuidedProgress } from '../../lib/studyProgress';
import { guidedCanonicalId } from '../../lib/guidedIdentity';
import { GuidedPracticeOrientation } from '../../components/practice/GuidedPracticeOrientation';
import ProgressSyncStatus from '../../components/ProgressSyncStatus';

type Section = { heading: string; body: string; example?: string; counterexample?: string };
type Challenge = { question: string; options: string[]; answer: number; feedback: string };
type Lesson = { stepId: number; kind: string; durationMin: number; title: string; lead: string;
  sections?: Section[]; challenge?: Challenge; reviewQuestions?: string[]; prompt?: string;
  referenceCode?: string; referencePath?: string; challengeText?: string; brief?: string[];
  acceptance?: string[]; starterUrl?: string; starterSourceUrl?: string; assessmentPrompt?: string;
  labCommand?: string; expectedArtifact?: string; testCommand?: string; troubleshooting?: string[]; implementationNote?: string; checkpointAssertion?: string };
type Tool = { name: string; url: string; tier: 'core' | 'optional'; note: string };
type Module = { moduleId: number; version: number; title: string; objective: string; tools: Tool[];
  learningOutcomes: string[]; lessons: Lesson[]; assessmentPath: string; answerKeyPath: string };
type StepDraft = { answer: number | null; checkedAnswer: boolean; referenceRead: boolean; quizAttempt: string };
type Progress = { moduleId?: number; stepIndex?: number; drafts?: Record<number, StepDraft>; completed: number[]; notes: Record<number, string>; checked: Record<number, number[]> };
const modes = [
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { id: 'claude', name: 'Claude', url: 'https://claude.ai/' },
  { id: 'local', name: 'IA local (opcional)', url: '' },
  { id: 'offline', name: 'Sem IA', url: '' }
] as const;
type Mode = (typeof modes)[number]['id'];
const empty = (): Progress => ({ completed: [], notes: {}, checked: {} });
const progressKey = (userId: string) => 'hub-channel-dark-learning-v1:' + userId;
function validProgress(value: unknown): value is Progress {
  if (!value || typeof value !== 'object') return false;
  const progress = value as Progress;
  return Array.isArray(progress.completed) && Boolean(progress.notes && typeof progress.notes === 'object' && !Array.isArray(progress.notes)) && Boolean(progress.checked && typeof progress.checked === 'object' && !Array.isArray(progress.checked));
}
function initial(userId: string): Progress {
  const remote = getStudyDraft('channel-dark');
  let local: unknown;
  try { local = JSON.parse(localStorage.getItem(progressKey(userId)) || 'null'); } catch { /* Keep legacy bytes intact. */ }
  const saved = validProgress(remote) ? remote : empty();
  const old = validProgress(local) ? local : empty();
  return { ...old, ...saved, completed: [...new Set([...old.completed, ...saved.completed])].filter(Number.isInteger),
    notes: { ...old.notes, ...saved.notes }, checked: { ...old.checked, ...saved.checked } };
}
function initialPosition(progress: Progress, modules:Module[]) {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const moduleId = Number(params.get('module') || progress.moduleId || 1);
  const module = modules.find(item => item.moduleId === moduleId) || modules[0];
  const stepIndex = Number(params.get('step') ?? progress.stepIndex ?? 0);
  return { moduleId: module.moduleId, stepIndex: Number.isInteger(stepIndex) && stepIndex >= 0 && stepIndex < module.lessons.length ? stepIndex : 0 };
}

export default function ChannelAutomationTrail({ userId }: { userId: string }) {
  const [content,setContent]=useState<{modules:Module[];oficinas:any[]}|null>(null);
  const [loadError,setLoadError]=useState('');
  useEffect(()=>{
    const controller=new AbortController();
    fetch('/api/content/trail/channel-dark',{credentials:'same-origin',cache:'no-store',signal:controller.signal})
      .then(async response=>{if(!response.ok)throw Error('Curso não liberado (HTTP '+response.status+').');return response.json();})
      .then(payload=>setContent(payload))
      .catch(reason=>{if(!controller.signal.aborted)setLoadError(String(reason));});
    return ()=>controller.abort();
  },[]);
  if(!content?.modules?.length)return <div className="page"><section className="panel">
    <h1>Automação de Canal Dark</h1>
    <p>{loadError||'Carregando conteúdo autorizado pelo servidor…'}</p>
  </section></div>;
  return <ChannelAutomationTrailLoaded userId={userId} modules={content.modules} oficinas={content.oficinas} />;
}
function ChannelAutomationTrailLoaded({ userId, modules, oficinas }: { userId:string; modules:Module[]; oficinas:any[] }) {
  const [progress, setProgress] = useState<Progress>(() => initial(userId));
  const [moduleId, setModuleId] = useState(() => initialPosition(progress,modules).moduleId);
  const [stepIndex, setStepIndex] = useState(() => initialPosition(progress,modules).stepIndex);
  const initialStep = modules.find(item => item.moduleId === moduleId)!.lessons[stepIndex].stepId;
  const restored = progress.drafts?.[initialStep];
  const [saveError, setSaveError] = useState('');
  const [saveAttempt, setSaveAttempt] = useState(0);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [answer, setAnswer] = useState<number | null>(restored?.answer ?? null);
  const [checkedAnswer, setCheckedAnswer] = useState(restored?.checkedAnswer ?? false);
  const [referenceRead, setReferenceRead] = useState(restored?.referenceRead ?? false);
  const [mode, setMode] = useState<Mode>('chatgpt');
  const [copied, setCopied] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState(restored?.quizAttempt ?? '');
  const [keyRevealed, setKeyRevealed] = useState<Record<number, boolean>>({});
  const module = modules.find(m => m.moduleId === moduleId) || modules[0];
  const lesson = module.lessons[stepIndex];
  const complete = progress.completed.includes(lesson.stepId);
  const check = progress.checked[lesson.stepId] || [];
  const notes = progress.notes[lesson.stepId] || '';
  const doneInModule = module.lessons.filter(l => progress.completed.includes(l.stepId)).length;
  const allCount = useMemo(() => modules.flatMap(m => m.lessons).filter(l => progress.completed.includes(l.stepId)).length, [progress.completed]);

  useEffect(() => {
    const snapshot: Progress = { ...progress, moduleId, stepIndex, drafts: { ...progress.drafts,
      [lesson.stepId]: { answer, checkedAnswer, referenceRead, quizAttempt } } };
    try {
      saveStudyVisit('channel-dark', { title: lesson.title, href: '#channel-dark?module=' + moduleId + '&step=' + stepIndex,
        kind: 'ai', sectionLabel: module.title }, snapshot);
      syncCanonicalGuidedProgress('channel-dark', lesson.stepId, snapshot);
      setSaveError('');
    } catch { setSaveError('Não foi possível salvar esta etapa. Mantenha suas anotações abertas e tente novamente.'); }
  }, [progress, moduleId, stepIndex, lesson.stepId, lesson.title, module.title, answer, checkedAnswer, referenceRead, quizAttempt, saveAttempt]);

  const choose = (m: number, i: number) => {
    const target = modules.find(item => item.moduleId === m)?.lessons[i];
    if (!target) return;
    if (m === moduleId && i === stepIndex) { setShowRoadmap(false); return; }
    setProgress(p => ({ ...p, drafts: { ...p.drafts, [lesson.stepId]: { answer, checkedAnswer, referenceRead, quizAttempt } } }));
    const draft = progress.drafts?.[target.stepId];
    setModuleId(m); setStepIndex(i); setAnswer(draft?.answer ?? null); setCheckedAnswer(draft?.checkedAnswer ?? false);
    setCopied(false); setReferenceRead(draft?.referenceRead ?? false); setQuizAttempt(draft?.quizAttempt ?? '');
    setShowRoadmap(false);
    history.replaceState(null, '', '#channel-dark?module=' + m + '&step=' + i);
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

  return <div className="page ai-track channel-track">
    <header className="ai-hero">
      <div><span className="eyebrow">FORMAÇÃO PRÁTICA · CANAL PILOTO</span>
        <h1>Automação de Canais Dark com IA</h1>
        <p>Crie um canal piloto autoral: pesquisa, roteiro, narração, visuais, vídeo, Shorts, automação e publicação. Pika, Google Flow, Steve AI e Modal são opcionais. O percurso principal é gratuito e local.</p>
        <div className="ai-pills"><span>R$ 0 obrigatório</span><span>Open source / self-hosted</span><span>8 módulos · A editorial</span></div>
      </div>
      <div className="ai-meter"><strong>{allCount}/32</strong><span>etapas disponíveis registradas</span><div className="progress"><i style={{ width: allCount * 100 / 32 + '%' }} /></div></div>
    </header>

    <div className="ai-resume-bar"><span><strong>Módulo {String(moduleId).padStart(2, '0')} · Etapa {stepIndex + 1}/4</strong> {lesson.title}</span><button type="button" className="button ghost" aria-expanded={showRoadmap} aria-controls="ai-all-modules" onClick={() => setShowRoadmap(value => !value)}>{showRoadmap ? 'Ocultar módulos' : 'Todos os módulos'}</button></div>
    <ProgressSyncStatus />
    {saveError && <p role="alert">{saveError} <button onClick={() => setSaveAttempt(value => value + 1)}>Tentar novamente</button></p>}
    {showRoadmap && <section id="ai-all-modules" className="ai-roadmap" aria-label="Módulos da formação">
      {manifest.modules.map(m => {
        const released = m.status === 'available';

        return released
          ? <button type="button" key={m.id} className={'ai-module available ' + (moduleId === m.id ? 'selected' : '')} aria-pressed={moduleId === m.id} onClick={() => choose(m.id, 0)}>
              <span className="ai-module-number">{String(m.id).padStart(2, '0')}</span><span className="ai-module-label"><strong>{m.title}</strong><small>{m.duration}</small></span><span className="ai-status">Estudar ↗</span>
            </button>
          : <div key={m.id} className="ai-module planned" aria-disabled="true"><span className="ai-module-number">{String(m.id).padStart(2, '0')}</span><span className="ai-module-label"><strong>{m.title}</strong><small>{m.duration}</small></span><span className="ai-status">Em breve</span></div>;
      })}
    </section>}

    <section className="ai-section-heading">
      <span className="eyebrow">MÓDULO {String(moduleId).padStart(2, '0')} · {doneInModule}/4 ETAPAS REGISTRADAS</span>
      <h2>{module.title}</h2><p>{module.objective}</p>
      <details className="ai-objectives"><summary>O que você deverá saber fazer</summary><ul>{module.learningOutcomes.map(o => <li key={o}>{o}</li>)}</ul></details>
       <section className="channel-tools" aria-label="Ferramentas deste módulo">
         <h3>Ferramentas do módulo</h3>
         <div className="channel-tool-grid">{module.tools.map(t => <a className="channel-tool" key={t.name} href={t.url} target="_blank" rel="noopener noreferrer">
           <span><strong>{t.name}</strong><small className={t.tier === 'core' ? 'channel-core' : 'channel-optional'}>{t.tier === 'core' ? 'Núcleo gratuito' : 'Opcional'}</small></span>
           <em>{t.note}</em>
         </a>)}</div>
       </section>
    </section>

    <div className="ai-learning-layout">
      <nav className="ai-steps" aria-label={'Etapas do módulo ' + moduleId}>
        {module.lessons.map((step, i) => <button key={step.stepId} type="button" className={'ai-step ' + (i === stepIndex ? 'selected ' : '') + (progress.completed.includes(step.stepId) ? 'completed' : '')} aria-current={i === stepIndex ? 'step' : undefined} onClick={() => choose(moduleId, i)}>
          <span>{String(i + 1).padStart(2, '0')}</span><span className="ai-step-label"><strong>{step.title}</strong><small>{step.durationMin} min · {progress.completed.includes(step.stepId) ? 'Registrada' : 'Disponível'}</small></span>
        </button>)}
      </nav>
      <article className="ai-lesson panel" aria-labelledby="ai-lesson-title">
        <div className="ai-lesson-top"><span className="eyebrow">ID {guidedCanonicalId('channel-dark', lesson.stepId)} · ETAPA {String(lesson.stepId).padStart(2, '0')} / 32</span><span>{lesson.durationMin} min</span></div>
        <h2 id="ai-lesson-title">{lesson.title}</h2><p className="ai-lead">{lesson.lead}</p>
        <GuidedPracticeOrientation code={guidedCanonicalId('channel-dark',lesson.stepId)} source='channel-dark' step={lesson} />
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
          {mode === 'local' && <p>Ollama, Kokoro e ComfyUI são opcionais para computadores adequados. O laboratório sempre oferece um caminho gratuito sem GPU.</p>}
          {mode === 'offline' && <p>Leia as explicações, siga o laboratório e teste as regras manualmente. Não é preciso conta em assistente externo.</p>}
          <label htmlFor="ai-prompt" className="ai-field-label">Prompt didático — revise antes de enviar</label><textarea id="ai-prompt" className="ai-prompt" readOnly rows={8} value={lesson.prompt}/>
          <button type="button" className="button ghost" onClick={() => void copyPrompt()}>{copied ? 'Prompt copiado' : 'Copiar prompt'}</button>
          <p className="ai-privacy">Não inclua dados reais, senhas, tokens, informações clínicas ou arquivos privados. Este site não transmite prompts para a IA.</p>
        </section>}
        {lesson.reviewQuestions && <section className="ai-exercise"><h3>Revisão crítica da resposta</h3><p>Use uma resposta de IA ou compare com os exemplos da aula. Marque após inspecionar o critério, não apenas por ter lido.</p>
          {lesson.reviewQuestions.map((r, i) => <label className="ai-check" key={r}><input type="checkbox" checked={check.includes(i)} onChange={() => toggleCheck(i)} /><span>{r}</span></label>)}
        </section>}
        {lesson.referenceCode && <section className="ai-exercise">
          <span className="eyebrow">DOCUMENTAÇÃO OFICIAL OU PRIMÁRIA</span><h3>{lesson.referenceCode}</h3>
          <a href={lesson.referencePath} target="_blank" rel="noopener noreferrer" className="button ghost">Abrir documentação ↗</a>
          <p>{lesson.challengeText}</p>
          <label htmlFor="ai-transfer" className="ai-field-label">Explique o caso com suas palavras (mínimo 50 caracteres)</label>
          <textarea id="ai-transfer" className="ai-notes" rows={4} value={quizAttempt} maxLength={4500} onChange={e => setQuizAttempt(e.target.value.slice(0, 4500))}/>
          <label className="ai-check"><input type="checkbox" checked={referenceRead} onChange={e => setReferenceRead(e.target.checked)}/><span>Estudei a aula e consigo prever um caso inválido sem consultar o gabarito.</span></label>
        </section>}
        {lesson.brief && <section id={'laboratorio-'+guidedCanonicalId('channel-dark',lesson.stepId)} className="ai-exercise">
          <span className="eyebrow">LABORATÓRIO INCREMENTAL · CANAL PILOTO</span>
          <h3>Prática com evidências</h3><ol>{lesson.brief.map(x => <li key={x}>{x}</li>)}</ol>
          {oficinas.filter(oficina => oficina.moduleId === moduleId).map(oficina =>
            <section key={oficina.moduleId} className="channel-workshop" aria-label="Oficina prática com código reutilizável">
              <span className="eyebrow">OFICINA PRINCIPAL · CÓDIGO REUTILIZÁVEL</span>
              <h3>{oficina.title}</h3>
              <p>{oficina.whatWorks}</p>
              <a className="button primary" target="_blank" rel="noopener noreferrer" href={oficina.guide}>Abrir guia de integração e arquivos ↗</a>
              <div className="channel-workshop-command"><strong>Execute no seu computador:</strong><code>{oficina.command}</code></div>
              <h4>Arquivos que você vai produzir</h4>
              <ul>{oficina.artifacts.map((file:string) => <li key={file}><code>{file}</code></li>)}</ul>
              <h4>Código existente que você vai usar</h4>
              <ul className="channel-workshop-sources">{oficina.sources.map((source:{repo:string;path:string;url:string;access:string;why:string}) =>
                <li key={source.repo + source.path}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">{source.repo}/{source.path} ↗</a>
                  <small>{source.access === 'private' ? 'Repositório privado: precisa de acesso · opcional' : 'Origem pública com código MIT'}</small>
                  <p>{source.why}</p>
                </li>)}
              </ul>
              <p className="channel-workshop-limit">O guia distingue módulos de contrato dos executores reais. A edição do vídeo requer FFmpeg e direitos dos ativos; nenhum vídeo é publicado automaticamente.</p>
            </section>
          )}
          <div className="ai-actions">{lesson.starterSourceUrl && <a className="button ghost" href={lesson.starterSourceUrl} target="_blank" rel="noopener noreferrer">Consultar exercício introdutório ↗</a>}</div>
          <p className="ai-privacy">Trabalhe com arquivos próprios e mídia licenciada. O laboratório pode ser concluído sem GPU, assinatura ou API paga. Ferramentas externas são experimentos opcionais, nunca um desbloqueio.</p>
          {lesson.labCommand && <div className="channel-executable">
            <h3>Execute no seu computador</h3>
            <p>Na pasta do projeto HubEstudos, com Node.js instalado:</p>
            <code>{lesson.labCommand}</code>
            <p><strong>Arquivos esperados:</strong> {lesson.expectedArtifact}</p>
            <p><strong>Como conferir:</strong> {lesson.checkpointAssertion}</p>
            <p>{lesson.implementationNote}</p>
            {lesson.troubleshooting && <details><summary>Erros comuns e recuperação</summary><ul>{lesson.troubleshooting.map(item => <li key={item}>{item}</li>)}</ul></details>}
            <p>Para testar as regras e os casos negativos:</p><code>{lesson.testCommand}</code>
          </div>}
          {lesson.assessmentPrompt && <p><strong>Desafio adicional:</strong> {lesson.assessmentPrompt}</p>}
          <label htmlFor="ai-lab-notes" className="ai-field-label">Registro: decisão, previsão, resultado e erro corrigido (mínimo 120 caracteres)</label>
          <textarea id="ai-lab-notes" className="ai-notes" rows={7} value={notes} maxLength={4500} onChange={e => updateNotes(e.target.value)} placeholder="Descreva o que você fez, o que esperava e o que observou..."/>
          <small className="muted">{notes.trim().length}/120 caracteres mínimos · registro pessoal vinculado à sua conta</small>
          <h3>Critérios de aceitação (autodeclaração)</h3>{lesson.acceptance?.map((item,i) => <label key={item} className="ai-check"><input type="checkbox" checked={check.includes(i)} onChange={() => toggleCheck(i)} /><span>{item}</span></label>)}
        </section>}
        <footer className="ai-lesson-footer">
          <p className={complete ? 'ai-success' : 'muted'}>{complete ? 'Etapa registrada na sua conta.' : 'Conclua a atividade antes de registrar a etapa. O registro não é certificação de competência.'}</p>
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
    <p className="ai-disclaimer">Os oito módulos têm classificação A exclusivamente editorial por IA com testes locais e evidências; isso não representa auditoria humana independente, avaliação com alunos reais nem certificação. Serviços externos e a qualidade final do vídeo exigem conferência humana. O progresso continua vinculado à sua conta.</p>
  </div>;
}
