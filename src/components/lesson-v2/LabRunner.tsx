import { useMemo, useState } from 'react';
import type { LabV2 } from '../../content/schema';
import { v2LabResources } from '../../lib/practiceContracts';
import { markLabStepProgress } from '../../lib/learningProgress';
import {
  getLabProgressForLesson,
  setLabStepCompletion
} from '../../lib/storage';

export function LabRunner({
  lessonId,
  lab
}: {
  lessonId: number;
  lab: LabV2;
}) {
  const initial = getLabProgressForLesson(lessonId);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    () => new Set(initial.completedStepIds)
  );
  const [copiedStep, setCopiedStep] = useState('');

  const resources=v2LabResources(lessonId,lab.resources || []);
  const total = lab.steps.length;
  const completed = completedSteps.size;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const allComplete = total > 0 && completed === total;

  const toggleStep = (stepId: string) => {
    const done = !completedSteps.has(stepId);
    const persisted = setLabStepCompletion(lessonId, stepId, done);
    markLabStepProgress(lessonId, stepId, done);
    setCompletedSteps(new Set(persisted.completedStepIds));
  };

  const copyCommand = async (stepId: string, command: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(command);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = command;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }

    setCopiedStep(stepId);
    window.setTimeout(() => setCopiedStep(''), 1400);
  };

  const progressLabel = useMemo(
    () => `${completed}/${total} checkpoints`,
    [completed, total]
  );

  return (
    <div className="lesson-v2-lab">
      <div className="lesson-v2-lab-head">
        <div>
          <span className="eyebrow">LABORATÓRIO GUIADO</span>
          <h2>{lab.title}</h2>
        </div>
        <span className="lesson-v2-lab-mode">{lab.mode}</span>
      </div>

      <div className="lesson-v2-safety">
        <strong>Escopo seguro</strong>
        <p>{lab.safetyScope}</p>
      </div>

      {resources.length > 0 && (
        <div className="lesson-v2-lab-resources">
          <span className="eyebrow">ARQUIVOS REAIS DO LAB · PACOTE INDIVIDUAL OU COMPARTILHADO</span>
          <p>Links para arquivos reais deste laboratório. Se forem compartilhados com outras aulas, consulte o roteiro antes de executar.</p>
          <div>
            {resources.map(resource => (
              <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer">
                {resource.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="lesson-v2-lab-progress" aria-label={progressLabel}>
        <div>
          <strong>{progressLabel}</strong>
          <span>{percent}%</span>
        </div>
        <div className="lesson-v2-progress-track">
          <i style={{ width: `${percent}%` }} />
        </div>
      </div>

      {lab.setup.length > 0 && (
        <section className="lesson-v2-lab-prep">
          <span className="eyebrow">SETUP</span>
          <ol>
            {lab.setup.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      )}

      {lab.happyPath.length > 0 && (
        <section className="lesson-v2-happy-path">
          <span className="eyebrow">HAPPY PATH PRIMEIRO</span>
          <h3>Confirme como o sistema deveria funcionar</h3>
          <ol>
            {lab.happyPath.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      )}

      <div className="lesson-v2-lab-steps">
        {lab.steps.map((step, index) => {
          const isDone = completedSteps.has(step.id);

          return (
            <article
              key={step.id}
              className={isDone ? 'lesson-v2-lab-step done' : 'lesson-v2-lab-step'}
            >
              <div className="lesson-v2-lab-step-head">
                <div>
                  <b>{String(index + 1).padStart(2, '0')}</b>
                  <div>
                    <span>PASSO {index + 1}</span>
                    <h3>{step.instruction}</h3>
                  </div>
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleStep(step.id)}
                  />
                  <span>{isDone ? 'Concluído' : 'Checkpoint'}</span>
                </label>
              </div>

              {step.command && (
                <div className="lesson-v2-command">
                  <div>
                    <span>COMANDO</span>
                    <button onClick={() => copyCommand(step.id, step.command!)}>
                      {copiedStep === step.id ? '✓ Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <pre>
                    <code>{step.command}</code>
                  </pre>
                </div>
              )}

              <details className="lesson-v2-expected">
                <summary>Ver resultado esperado</summary>
                <p>{step.expected}</p>
              </details>

              <div className="lesson-v2-checkpoint">
                <span>CHECKPOINT</span>
                <p>{step.checkpoint}</p>
              </div>
            </article>
          );
        })}
      </div>

      {allComplete && (
        <div className="lesson-v2-lab-complete">
          <strong>Todos os checkpoints marcados</strong>
          <p>
            A marcação é uma autodeclaração; não executa testes. O próximo
            passo é comparar evidências, aplicar a correção e executar o reteste.
          </p>
        </div>
      )}

      {lab.troubleshooting.length > 0 && (
        <section className="lesson-v2-troubleshooting">
          <span className="eyebrow">TROUBLESHOOTING</span>
          <h3>Se o resultado não bater</h3>
          <div>
            {lab.troubleshooting.map(item => (
              <article key={`${item.symptom}-${item.likelyCause}`}>
                <strong>{item.symptom}</strong>
                <p>
                  <b>Causa provável:</b> {item.likelyCause}
                </p>
                <p>
                  <b>Faça:</b> {item.action}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {lab.cleanup.length > 0 && (
        <details className="lesson-v2-cleanup">
          <summary>Cleanup do laboratório</summary>
          <ol>
            {lab.cleanup.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
