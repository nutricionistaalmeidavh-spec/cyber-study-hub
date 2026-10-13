export type LessonLevel = 'Base' | 'Intermediário' | 'Avançado';
export type LabMode = 'Celular' | 'PC' | 'Celular + PC';

export type RecommendedPrerequisite = {
  kind: 'lesson' | 'track-unit' | 'concept';
  id?: number | string;
  title: string;
  reason: string;
  /**
   * Guardrail estrutural: pré-requisitos do Cyber Study Hub são sempre
   * recomendações pedagógicas. Nunca podem bloquear navegação.
   */
  blocking: false;
};

export type FundamentalV2 = {
  term: string;
  explanation: string;
  example?: string;
};

export type MechanismStepV2 = {
  id: string;
  title: string;
  detail: string;
};

export type WorkedExampleV2 = {
  id: string;
  title: string;
  problem: string;
  solutionSteps: Array<{
    id: string;
    action: string;
    explanation: string;
    evidence?: string;
  }>;
  selfExplanationPrompts: string[];
};

export type CompletionExerciseV2 = {
  id: string;
  title: string;
  prompt: string;
  starterCode?: string;
  expectedConcepts: string[];
  solution: string;
};

export type IndependentExerciseV2 = {
  id: string;
  title: string;
  prompt: string;
  successCriteria: string[];
};

export type CodeExampleV2 = {
  id: string;
  title: string;
  language: string;
  code: string;
  explanation: string;
  annotations?: Array<{
    lines: string;
    note: string;
  }>;
};

export type LabStepV2 = {
  id: string;
  instruction: string;
  command?: string;
  expected: string;
  checkpoint: string;
};

export type LabV2 = {
  title: string;
  mode: LabMode;
  safetyScope: string;
  setup: string[];
  happyPath: string[];
  steps: LabStepV2[];
  cleanup: string[];
  resources?: Array<{ label: string; href: string }>;
  troubleshooting: Array<{
    symptom: string;
    likelyCause: string;
    action: string;
  }>;
};

export type DetectionGuideV2 = {
  why: string;
  signals: string[];
  investigation: string[];
};

export type RemediationGuideV2 = {
  principles: string[];
  verification: string[];
};

export type QuizQuestionV2 = {
  q: string;
  options: string[];
  answer: number;
  why: string;
  concept: string;
};

export type FlashcardV2 = {
  front: string;
  back: string;
  concept: string;
};

export type ExternalReferenceV2 = {
  catalogId: string;
  role: string;
  note: string;
};

export type LessonV2 = {
  schemaVersion: 2;
  id: number;
  slug: string;
  title: string;
  track: string;
  level: LessonLevel;
  durationMin: number;
  pcPractice: boolean;
  summary: string;

  recommendedPrerequisites: RecommendedPrerequisite[];
  objectives: string[];

  problem: {
    title: string;
    scenario: string;
  };

  fundamentals: FundamentalV2[];

  mechanism: {
    summary: string;
    steps: MechanismStepV2[];
  };

  workedExamples: WorkedExampleV2[];
  completionExercises: CompletionExerciseV2[];
  independentExercises: IndependentExerciseV2[];
  codeExamples: CodeExampleV2[];

  lab: LabV2 | null;

  detection: DetectionGuideV2;
  remediation: RemediationGuideV2;

  review: {
    challenge: string;
    quiz: QuizQuestionV2[];
    flashcards: FlashcardV2[];
  };

  externalReferences: ExternalReferenceV2[];
};
