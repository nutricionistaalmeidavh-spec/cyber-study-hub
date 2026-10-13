import type { Lesson } from '../types';
import type { LessonDetail } from '../data/lessonDetails';
import type { LessonV2 } from './schema';

export function adaptLegacyLesson(
  lesson: Lesson,
  detail?: LessonDetail
): LessonV2 {
  const legacyLab = detail
    ? {
        title: detail.labTitle,
        mode: detail.labMode,
        safetyScope:
          'Execute somente em equipamento, VM, WSL, aplicação ou domínio próprio ou explicitamente autorizado.',
        setup: [],
        happyPath: [],
        steps: detail.labSteps.map((instruction, index) => ({
          id: `legacy-step-${index + 1}`,
          instruction,
          expected:
            index === detail.labSteps.length - 1
              ? detail.expected
              : 'Conclua o passo sem sair do escopo autorizado e registre a evidência observável.',
          checkpoint:
            index === detail.labSteps.length - 1
              ? detail.expected
              : `Passo ${index + 1} concluído e evidência registrada.`
        })),
        cleanup: [],
        troubleshooting: []
      }
    : null;

  return {
    schemaVersion: 2,
    id: lesson.id,
    slug: `lesson-${lesson.id}`,
    title: lesson.title,
    track: lesson.track,
    level: lesson.level,
    durationMin: lesson.pcPractice ? 45 : 30,
    pcPractice: lesson.pcPractice,
    summary: lesson.summary,

    recommendedPrerequisites: [],
    objectives: [...lesson.objectives],

    problem: {
      title: 'Por que este tema importa?',
      scenario: detail?.why ?? lesson.summary
    },

    fundamentals: lesson.concepts.map(concept => ({
      term: concept.term,
      explanation: concept.definition
    })),

    mechanism: {
      summary: detail?.why ?? lesson.summary,
      steps:
        detail?.flow.map((step, index) => ({
          id: `legacy-flow-${index + 1}`,
          title: `Etapa ${index + 1}`,
          detail: step
        })) ?? []
    },

    workedExamples: [],
    completionExercises: [],
    independentExercises: [],
    codeExamples: detail
      ? [
          {
            id: `legacy-code-${lesson.id}`,
            title: detail.codeTitle,
            language: detail.language,
            code: detail.code,
            explanation: detail.codeNote
          }
        ]
      : [],

    lab: legacyLab,

    detection: {
      why: 'Procure evidências que diferenciem comportamento normal de comportamento de risco.',
      signals: [lesson.detect],
      investigation: [lesson.detect]
    },

    remediation: {
      principles: [lesson.defend],
      verification: [
        'Repita o cenário após a correção e confirme que a cadeia de risco foi interrompida.'
      ]
    },

    review: {
      challenge: lesson.challenge,
      quiz: lesson.quiz.map((question, index) => ({
        ...question,
        concept: lesson.concepts[index % Math.max(lesson.concepts.length, 1)]?.term ?? lesson.title
      })),
      flashcards: lesson.flashcards.map(card => ({
        ...card,
        concept: card.front
      }))
    },

    externalReferences: []
  };
}
