import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { adaptLegacyLesson } from '../../content/legacyAdapter';
import type {
  CodeExampleV2,
  CompletionExerciseV2,
  IndependentExerciseV2,
  LessonV2,
  WorkedExampleV2
} from '../../content/schema';
import {
  getLessonState,
  updateLessonState
} from '../../lib/storage';
import { LabRunner } from './LabRunner';
import {
  markActivityCompletion,
  markSectionVisited,
  migrateLegacyProgress,
  recordQuizAttempt,
  syncLegacyLessonFlags
} from '../../lib/learningProgress';
import { recordQuizConceptEvidence } from '../../lib/mastery';
import { ReferencePanel } from '../references/ReferencePanel';
import { canRevealQuizFeedback, quizActionLabel } from './quizCommit';
import './lesson-v2.css';
import { useStudyPosition } from '../useStudyPosition';
import { studySectionHref } from '../../lib/studyNavigation';
import { getLessonLearningProgress } from '../../lib/learningProgress';
import { CanonicalLessonContent } from '../practice/CanonicalLessonContent';
import { MainPracticeOrientation } from '../practice/PracticeOrientation';

type LessonViewerV2Props = {
  id: number;
  onRefresh: () => void;
};

type SectionItem = {
  id: string;
  label: string;
};

const sectionItems: SectionItem[] = [
  { id: 'v2-problema', label: 'Problema' },
  { id: 'v2-fundamentos', label: 'Fundamentos' },
  { id: 'v2-mecanismo', label: 'Mecanismo' },
  { id: 'v2-exemplo', label: 'Exemplo resolvido' },
  { id: 'v2-completar', label: 'Complete' },
  { id: 'v2-pratica', label: 'Prática' },
  { id: 'v2-codigo', label: 'Código' },
  { id: 'v2-lab', label: 'Laboratório' },
  { id: 'v2-detectar', label: 'Detectar' },
  { id: 'v2-corrigir', label: 'Corrigir' },
  { id: 'v2-revisao', label: 'Revisão' }
];

export function LessonViewerV2({ id, onRefresh }: LessonViewerV2Props) {
  const [payload,setPayload]=useState<{kind:'native'|'legacy';lesson:LessonV2|import('../../types').Lesson;detail?:import('../../data/lessonDetails').LessonDetail|null}|null>(null);
  const [error,setError]=useState('');
  useEffect(()=>{
    const controller=new AbortController();
    setPayload(null);setError('');
    fetch('/api/content/lesson/'+id,{signal:controller.signal,credentials:'same-origin',cache:'no-store'})
      .then(async response=>{if(!response.ok)throw Error('Conteúdo indisponível (HTTP '+response.status+').');return response.json();})
      .then(data=>setPayload(data))
      .catch(reason=>{if(!controller.signal.aborted)setError(String(reason));});
    return ()=>controller.abort();
  },[id]);
  if(!payload)return <div className="page"><section className="panel">
    <h1>{error?'Não foi possível abrir a aula':'Carregando aula segura…'}</h1>
    <p>{error||'O servidor está verificando a autorização desta conta.'}</p>
  </section></div>;
  const lesson=payload.kind==='native' ? payload.lesson as LessonV2 :
    adaptLegacyLesson(payload.lesson as import('../../types').Lesson,payload.detail??undefined);
  return <LessonViewerV2Content lesson={lesson} onRefresh={onRefresh} />;
}

function LessonViewerV2Content({
  lesson,
  onRefresh
}: {
  lesson: LessonV2;
  onRefresh: () => void;
}) {
  const savedState =
    getLessonState()[lesson.id] ??
    { completed: false, favorite: false, doubt: false, quizBest: 0 };

  const [activeSection, setActiveSection] = useState(sectionItems[0].id);
  const [visitedSections, setVisitedSections] = useState<Set<string>>(
    () => new Set(getLessonLearningProgress(lesson.id).visitedSectionIds)
  );
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [copyNotice, setCopyNotice] = useState('');

  const quizQuestion = lesson.review.quiz[quizIndex];

  useEffect(() => {
    migrateLegacyProgress();
  }, []);
  const prev = lesson.id>43 ? {id:lesson.id-1} : null;
  const next = lesson.id<100 ? {id:lesson.id+1} : null;

  const availableSections = useMemo(
    () =>
      sectionItems.filter(item => {
        if (item.id === 'v2-exemplo') return lesson.workedExamples.length > 0;
        if (item.id === 'v2-completar') return lesson.completionExercises.length > 0;
        if (item.id === 'v2-pratica') return lesson.independentExercises.length > 0;
        if (item.id === 'v2-codigo') return lesson.codeExamples.length > 0;
        if (item.id === 'v2-lab') return Boolean(lesson.lab);
        return true;
      }),
    [lesson]
  );

  const position = useStudyPosition(String(lesson.id), lesson.title, '#lesson/' + lesson.id,
    'interactive', availableSections);
  useEffect(() => {
    if (!position.active) return;
    setActiveSection(position.active);
    // The shared position hook owns persistence and displays save/retry failures.
    if (!getLessonLearningProgress(lesson.id).visitedSectionIds.includes(position.active)) {
      try { markSectionVisited(lesson.id, position.active); } catch { /* Preserve the lesson; shared hook exposes recovery. */ }
    }
    setVisitedSections(previous => new Set([...previous, position.active]));
  }, [position.active, lesson.id]);

  const toggle = (key: 'completed' | 'favorite' | 'doubt') => {
    const nextValue = !savedState[key];
    updateLessonState(lesson.id, { [key]: nextValue });
    syncLegacyLessonFlags(lesson.id, { [key]: nextValue });
    onRefresh();
  };

  const copyLessonSummary = async () => {
    const summary = [
      `Aula ${lesson.id} — ${lesson.title}`,
      '',
      lesson.summary,
      '',
      'Objetivos:',
      ...lesson.objectives.map(objective => `- ${objective}`),
      '',
      'Detecção:',
      ...lesson.detection.signals.map(signal => `- ${signal}`),
      '',
      'Correção:',
      ...lesson.remediation.principles.map(principle => `- ${principle}`)
    ].join('\n');

    await copyText(summary);
    setCopyNotice('Resumo copiado');
    window.setTimeout(() => setCopyNotice(''), 1400);
  };

  const submitQuizAnswer = () => {
    if (selected === null) return;
    if (!confirmed) {
      recordQuizConceptEvidence(lesson.id, quizQuestion.concept, selected === quizQuestion.answer);
      setConfirmed(true);
      return;
    }

    const isCorrect = selected === quizQuestion.answer;
    const nextCorrect = quizCorrect + (isCorrect ? 1 : 0);

    if (quizIndex === lesson.review.quiz.length - 1) {
      const score = Math.round(
        (nextCorrect / lesson.review.quiz.length) * 100
      );
      updateLessonState(lesson.id, {
        quizBest: Math.max(savedState.quizBest || 0, score)
      });
      recordQuizAttempt(lesson.id, {
        score,
        correct: nextCorrect,
        total: lesson.review.quiz.length
      });
      setQuizCorrect(nextCorrect);
      setQuizDone(true);
      onRefresh();
      return;
    }

    if (isCorrect) setQuizCorrect(value => value + 1);
    setQuizIndex(value => value + 1);
    setSelected(null);
    setConfirmed(false);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelected(null);
    setConfirmed(false);
    setQuizCorrect(0);
    setQuizDone(false);
  };

  return (
    <div className="page lesson-v2-page">
      <header className="lesson-v2-hero" aria-labelledby="lesson-v2-title">
        <div className="lesson-v2-kicker">
          <span>Aula {lesson.id}</span>
          <span>{lesson.track}</span>
          <span>{lesson.level}</span>
          <span>{lesson.durationMin} min</span>
          {lesson.pcPractice && <span className="lesson-v2-pc">Prática no PC</span>}
        </div>

        <h1 id="lesson-v2-title">{lesson.title}</h1>
        <p className="lesson-v2-deck">{lesson.summary}</p>

        {lesson.recommendedPrerequisites.length > 0 && (
          <div className="lesson-v2-prerequisites">
            <strong>Recomendado antes, nunca obrigatório</strong>
            <div>
              {lesson.recommendedPrerequisites.map(prerequisite => (
                <span key={`${prerequisite.kind}-${prerequisite.title}`}>
                  {prerequisite.title}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="lesson-v2-actions">
          <button
            className={savedState.completed ? 'button primary' : 'button ghost'}
            onClick={() => toggle('completed')}
          >
            {savedState.completed ? '✓ Concluída' : 'Marcar concluída'}
          </button>
          <button className="button ghost" onClick={() => toggle('favorite')}>
            {savedState.favorite ? '★ Favorita' : '☆ Favoritar'}
          </button>
          <button className="button ghost" onClick={() => toggle('doubt')}>
            {savedState.doubt ? '? Dúvida marcada' : 'Marcar dúvida'}
          </button>
          <button className="button ghost" onClick={copyLessonSummary}>
            {copyNotice || 'Copiar resumo'}
          </button>
        </div>
      </header>

      <MobileOutline
        sections={availableSections}
        activeSection={activeSection}
        visitedSections={visitedSections}
      />

      {position.saveError && <p role="alert">{position.saveError} <button onClick={position.retry}>Tentar novamente</button></p>}
      <MainPracticeOrientation id={lesson.id} objective={lesson.lab?.title} deliverable={lesson.lab?.steps?.at(-1)?.checkpoint} />
      <CanonicalLessonContent id={lesson.id} />
      <div className="lesson-v2-layout">
        <aside className="lesson-v2-rail" aria-label="Roteiro da aula">
          <span className="eyebrow">ROTEIRO</span>
          <nav>
            {availableSections.map((item, index) => (
              <a
                key={item.id}
                href={studySectionHref(item.id)}
                className={activeSection === item.id ? 'active' : ''}
              >
                <b>{String(index + 1).padStart(2, '0')}</b>
                <span>{item.label}</span>
                <i aria-hidden="true">
                  {visitedSections.has(item.id) ? '✓' : ''}
                </i>
              </a>
            ))}
          </nav>
        </aside>

        <main className="lesson-v2-article">
          <section className="lesson-v2-section lesson-v2-problem" id="v2-problema">
            <SectionLabel>O PROBLEMA</SectionLabel>
            <h2>{lesson.problem.title}</h2>
            <p className="lesson-v2-lead">{lesson.problem.scenario}</p>

            <div className="lesson-v2-objectives">
              <h3>Ao final, você deve conseguir</h3>
              <ol>
                {lesson.objectives.map(objective => (
                  <li key={objective}>{objective}</li>
                ))}
              </ol>
            </div>
          </section>

          <section className="lesson-v2-section" id="v2-fundamentos">
            <SectionLabel>FUNDAMENTOS</SectionLabel>
            <h2>Construa o modelo mental antes do laboratório</h2>
            <div className="lesson-v2-definition-list">
              {lesson.fundamentals.map((fundamental, index) => (
                <article key={fundamental.term}>
                  <div className="lesson-v2-index">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3>{fundamental.term}</h3>
                    <p>{fundamental.explanation}</p>
                    {fundamental.example && (
                      <p className="lesson-v2-example-line">
                        <strong>Exemplo:</strong> {fundamental.example}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="lesson-v2-section" id="v2-mecanismo">
            <SectionLabel>MECANISMO INTERNO</SectionLabel>
            <h2>O que acontece, em ordem</h2>
            <p>{lesson.mechanism.summary}</p>
            <div className="lesson-v2-mechanism">
              {lesson.mechanism.steps.map((step, index) => (
                <article key={step.id}>
                  <div className="lesson-v2-mechanism-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {lesson.workedExamples.length > 0 && (
            <section className="lesson-v2-section" id="v2-exemplo">
              <SectionLabel>EXEMPLO RESOLVIDO</SectionLabel>
              <h2>Veja o raciocínio completo antes de tentar sozinho</h2>
              {lesson.workedExamples.map(example => (
                <WorkedExample key={example.id} example={example} />
              ))}
            </section>
          )}

          {lesson.completionExercises.length > 0 && (
            <section className="lesson-v2-section" id="v2-completar">
              <SectionLabel>FADING / COMPLETE</SectionLabel>
              <h2>Agora parte da solução é sua</h2>
              <p>
                A estrutura ainda está visível, mas alguns passos foram removidos.
                Complete antes de abrir a orientação.
              </p>
              {lesson.completionExercises.map(exercise => (
                <CompletionExercise
                  key={exercise.id}
                  lessonId={lesson.id}
                  exercise={exercise}
                />
              ))}
            </section>
          )}

          {lesson.independentExercises.length > 0 && (
            <section className="lesson-v2-section" id="v2-pratica">
              <SectionLabel>PRÁTICA INDEPENDENTE</SectionLabel>
              <h2>Resolva sem copiar o exemplo</h2>
              {lesson.independentExercises.map(exercise => (
                <IndependentExercise
                  key={exercise.id}
                  lessonId={lesson.id}
                  exercise={exercise}
                />
              ))}
            </section>
          )}

          {lesson.codeExamples.length > 0 && (
            <section className="lesson-v2-section" id="v2-codigo">
              <SectionLabel>CÓDIGO EXPLICADO</SectionLabel>
              <h2>Código para ler, entender e copiar</h2>
              {lesson.codeExamples.map(example => (
                <CodeExample key={example.id} example={example} />
              ))}
            </section>
          )}

          {lesson.lab && (
            <section className="lesson-v2-section" id="v2-lab">
              <SectionLabel>LABORATÓRIO</SectionLabel>
              <LabRunner lessonId={lesson.id} lab={lesson.lab} />
            </section>
          )}

          <section className="lesson-v2-section" id="v2-detectar">
            <SectionLabel>COMO DETECTAR</SectionLabel>
            <h2>Procure evidência, não apenas sintomas</h2>
            <p>{lesson.detection.why}</p>
            <div className="lesson-v2-two-columns">
              <div>
                <h3>Sinais</h3>
                <ul>
                  {lesson.detection.signals.map(signal => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Investigação</h3>
                <ol>
                  {lesson.detection.investigation.map(step => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="lesson-v2-section" id="v2-corrigir">
            <SectionLabel>COMO CORRIGIR</SectionLabel>
            <h2>Quebre a cadeia de risco e comprove o reteste</h2>
            <div className="lesson-v2-two-columns">
              <div>
                <h3>Princípios</h3>
                <ul>
                  {lesson.remediation.principles.map(principle => (
                    <li key={principle}>{principle}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Reteste</h3>
                <ol>
                  {lesson.remediation.verification.map(step => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>



          {lesson.externalReferences.length > 0 && (
            <section className="lesson-v2-section lesson-v2-reference-section">
              <ReferencePanel lessonReferences={lesson.externalReferences} />
            </section>
          )}

          <section className="lesson-v2-section lesson-v2-review" id="v2-revisao">
            <SectionLabel>REVISÃO</SectionLabel>
            <h2>Só agora: recupere o conhecimento sem consultar</h2>

            <article className="lesson-v2-challenge">
              <span className="eyebrow">DESAFIO</span>
              <p>{lesson.review.challenge}</p>
            </article>

            <div className="lesson-v2-review-grid">
              <div className="lesson-v2-quiz">
                <div className="lesson-v2-subhead">
                  <div>
                    <span className="eyebrow">QUIZ</span>
                    <h3>Checagem de mecanismo</h3>
                  </div>
                  <span>
                    {quizDone ? lesson.review.quiz.length : quizIndex + 1}/
                    {lesson.review.quiz.length}
                  </span>
                </div>

                {quizDone ? (
                  <div className="lesson-v2-result">
                    <strong>
                      {Math.round(
                        (quizCorrect / lesson.review.quiz.length) * 100
                      )}
                      %
                    </strong>
                    <p>
                      Melhor score salvo:{' '}
                      {Math.max(
                        savedState.quizBest || 0,
                        Math.round(
                          (quizCorrect / lesson.review.quiz.length) * 100
                        )
                      )}
                      %
                    </p>
                    <button className="button ghost" onClick={resetQuiz}>
                      Refazer quiz
                    </button>
                  </div>
                ) : (
                  <>
                    <h3>{quizQuestion.q}</h3>
                    <div className="lesson-v2-options">
                      {quizQuestion.options.map((option, optionIndex) => (
                        <button
                          key={`${optionIndex}-${option}`}
                          className={selected === optionIndex ? 'selected' : ''}
                          onClick={() => { if (!confirmed) setSelected(optionIndex); }}
                          disabled={confirmed}
                        >
                          <b>{String.fromCharCode(65 + optionIndex)}</b>
                          <span>{option}</span>
                        </button>
                      ))}
                    </div>

                    {canRevealQuizFeedback(confirmed) && selected !== null && (
                      <div
                        role="status"
                        aria-live="polite"
                        className={
                          selected === quizQuestion.answer
                            ? 'lesson-v2-feedback correct'
                            : 'lesson-v2-feedback incorrect'
                        }
                      >
                        <strong>
                          {selected === quizQuestion.answer
                            ? 'Correto.'
                            : 'Ainda não.'}
                        </strong>{' '}
                        {quizQuestion.why}
                      </div>
                    )}

                    <button
                      className="button primary"
                      disabled={selected === null}
                      onClick={submitQuizAnswer}
                    >
                      {quizActionLabel(confirmed, quizIndex === lesson.review.quiz.length - 1)}
                    </button>
                  </>
                )}
              </div>

              <div className="lesson-v2-flashcards">
                <div className="lesson-v2-subhead">
                  <div>
                    <span className="eyebrow">FLASHCARDS</span>
                    <h3>Recuperação rápida</h3>
                  </div>
                  <span>{lesson.review.flashcards.length}</span>
                </div>

                {lesson.review.flashcards.map((card, index) => (
                  <details key={`${card.front}-${index}`}>
                    <summary>
                      <b>{String(index + 1).padStart(2, '0')}</b>
                      <span>{card.front}</span>
                      <i>+</i>
                    </summary>
                    <p>{card.back}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <nav className="lesson-v2-bottom-nav" aria-label="Navegação entre aulas">
            {prev ? (
              <a href={`#lesson/${prev.id}`}>← Aula {prev.id}</a>
            ) : (
              <span />
            )}
            <a href="#games">Revisar em jogos</a>
            {next ? (
              <a href={`#lesson/${next.id}`}>Aula {next.id} →</a>
            ) : (
              <span />
            )}
          </nav>
        </main>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <span className="eyebrow lesson-v2-section-label">{children}</span>;
}

function MobileOutline({
  sections,
  activeSection,
  visitedSections
}: {
  sections: SectionItem[];
  activeSection: string;
  visitedSections: Set<string>;
}) {
  const activeLabel =
    sections.find(section => section.id === activeSection)?.label ?? sections[0]?.label;

  return (
    <details className="lesson-v2-mobile-outline">
      <summary>
        <div>
          <span className="eyebrow">ROTEIRO</span>
          <strong>{activeLabel}</strong>
        </div>
        <span>Abrir</span>
      </summary>
      <nav>
        {sections.map((section, index) => (
          <a
            key={section.id}
            href={studySectionHref(section.id)}
            className={activeSection === section.id ? 'active' : ''}
          >
            <b>{String(index + 1).padStart(2, '0')}</b>
            <span>{section.label}</span>
            <i>{visitedSections.has(section.id) ? '✓' : ''}</i>
          </a>
        ))}
      </nav>
    </details>
  );
}

function WorkedExample({ example }: { example: WorkedExampleV2 }) {
  return (
    <article className="lesson-v2-worked">
      <div className="lesson-v2-worked-head">
        <div>
          <span>EXEMPLO COMPLETO</span>
          <h3>{example.title}</h3>
        </div>
        <small>Observe → explique → só depois pratique</small>
      </div>

      <p>{example.problem}</p>

      <ol>
        {example.solutionSteps.map((step, index) => (
          <li key={step.id}>
            <div className="lesson-v2-worked-number">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div>
              <strong>{step.action}</strong>
              <p>{step.explanation}</p>
              {step.evidence && (
                <p className="lesson-v2-evidence">
                  <b>Evidência:</b> {step.evidence}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <details className="lesson-v2-self-explain">
        <summary>Agora explique com suas palavras</summary>
        <ul>
          {example.selfExplanationPrompts.map(prompt => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}

function CompletionExercise({
  lessonId,
  exercise
}: {
  lessonId: number;
  exercise: CompletionExerciseV2;
}) {
  const [draft, setDraft] = useState(exercise.starterCode ?? '');
  const [showGuide, setShowGuide] = useState(false);
  const [completed, setCompleted] = useState(false);

  const markCompleted = () => {
    markActivityCompletion(lessonId, exercise.id, true);
    setCompleted(true);
  };

  return (
    <article className="lesson-v2-completion">
      <div className="lesson-v2-subhead">
        <div>
          <span className="eyebrow">COMPLETE A SOLUÇÃO</span>
          <h3>{exercise.title}</h3>
        </div>
        <span>Fading</span>
      </div>
      <p>{exercise.prompt}</p>

      {exercise.starterCode && (
        <textarea
          aria-label={`Resposta para ${exercise.title}`}
          spellCheck={false}
          value={draft}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDraft(event.target.value)}
        />
      )}

      <div className="lesson-v2-inline-actions">
        <button
          className="button ghost"
          onClick={() => setShowGuide(value => !value)}
        >
          {showGuide ? 'Ocultar orientação' : 'Conferir orientação'}
        </button>
        <button
          className={completed ? 'button primary' : 'button ghost'}
          onClick={markCompleted}
        >
          {completed ? '✓ Tentativa registrada' : 'Registrar tentativa'}
        </button>
      </div>

      {showGuide && (
        <div className="lesson-v2-completion-guide">
          <h4>Conceitos que sua resposta deve conter</h4>
          <ul>
            {exercise.expectedConcepts.map(concept => (
              <li key={concept}>{concept}</li>
            ))}
          </ul>
          <details>
            <summary>Ver solução de referência</summary>
            <p>{exercise.solution}</p>
          </details>
        </div>
      )}
    </article>
  );
}

function IndependentExercise({
  lessonId,
  exercise
}: {
  lessonId: number;
  exercise: IndependentExerciseV2;
}) {
  const [checked, setChecked] = useState<Set<number>>(() => new Set());

  const toggleCriterion = (index: number) => {
    setChecked(previous => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);

      markActivityCompletion(
        lessonId,
        exercise.id,
        next.size === exercise.successCriteria.length
      );

      return next;
    });
  };

  return (
    <article className="lesson-v2-independent">
      <span className="eyebrow">SEM SOLUÇÃO PRONTA</span>
      <h3>{exercise.title}</h3>
      <p>{exercise.prompt}</p>
      <div className="lesson-v2-success-list">
        <strong>Critérios de sucesso</strong>
        {exercise.successCriteria.map((criterion, index) => (
          <label key={criterion}>
            <input
              type="checkbox"
              checked={checked.has(index)}
              onChange={() => toggleCriterion(index)}
            />
            <span>{criterion}</span>
          </label>
        ))}
      </div>
    </article>
  );
}

function CodeExample({ example }: { example: CodeExampleV2 }) {
  const [copied, setCopied] = useState(false);
  const annotatedLines = useMemo(
    () =>
      new Set(
        (example.annotations ?? []).flatMap(annotation =>
          expandLineRange(annotation.lines)
        )
      ),
    [example.annotations]
  );

  const copy = async () => {
    await copyText(example.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <article className="lesson-v2-code-example">
      <div className="lesson-v2-code-head">
        <div>
          <span>{example.language.toUpperCase()}</span>
          <h3>{example.title}</h3>
        </div>
        <button className="button ghost" onClick={copy}>
          {copied ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>

      <div className="lesson-v2-code-scroll">
        <pre>
          <code>
            {example.code.split('\n').map((line, index) => {
              const lineNumber = index + 1;
              return (
                <span
                  className={
                    annotatedLines.has(lineNumber)
                      ? 'lesson-v2-code-line annotated'
                      : 'lesson-v2-code-line'
                  }
                  key={`${lineNumber}-${line}`}
                >
                  <b>{String(lineNumber).padStart(2, '0')}</b>
                  <span>{highlightLine(line)}</span>
                </span>
              );
            })}
          </code>
        </pre>
      </div>

      <p className="lesson-v2-code-explanation">{example.explanation}</p>

      {example.annotations && example.annotations.length > 0 && (
        <div className="lesson-v2-annotations">
          {example.annotations.map(annotation => (
            <div key={`${annotation.lines}-${annotation.note}`}>
              <b>L{annotation.lines}</b>
              <p>{annotation.note}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function highlightLine(line: string) {
  const pattern =
    /(\/\/.*$|\/\*.*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:const|let|var|function|return|if|else|throw|new|true|false|null|undefined|async|await|import|from|export|type|interface|class|extends)\b|\b\d+(?:\.\d+)?\b)/g;

  const chunks = line.split(pattern).filter(chunk => chunk !== '');

  return chunks.map((chunk, index) => {
    let className = '';
    if (/^\/\//.test(chunk) || /^\/\*/.test(chunk)) className = 'tok-comment';
    else if (/^["'`]/.test(chunk)) className = 'tok-string';
    else if (/^\d/.test(chunk)) className = 'tok-number';
    else if (
      /^(const|let|var|function|return|if|else|throw|new|true|false|null|undefined|async|await|import|from|export|type|interface|class|extends)$/.test(
        chunk
      )
    ) {
      className = 'tok-keyword';
    }

    return (
      <span className={className} key={`${index}-${chunk}`}>
        {chunk}
      </span>
    );
  });
}

function expandLineRange(value: string): number[] {
  const result: number[] = [];
  for (const token of value.split(',')) {
    const [startText, endText] = token.trim().split('-');
    const start = Number(startText);
    const end = endText ? Number(endText) : start;
    if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
    for (let line = start; line <= end; line += 1) result.push(line);
  }
  return result;
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}
