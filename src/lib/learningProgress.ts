import { accountStorage } from './accountStorage';
export type QuizAttempt = {
  score: number;
  correct: number;
  total: number;
  completedAt: string;
};

export type LessonLearningProgress = {
  migratedFromLegacy: boolean;
  completed: boolean;
  favorite: boolean;
  doubt: boolean;
  visitedSectionIds: string[];
  completedActivityIds: string[];
  completedLabStepIds: string[];
  quizHistory: QuizAttempt[];
  firstSeenAt: string;
  lastSeenAt: string;
};

export type LearningProgressState = Record<number, LessonLearningProgress>;

const PROGRESS_KEY = 'cyber-study-learning-v2';
const MIGRATION_KEY = 'cyber-study-learning-v2-migration';
const LEGACY_LESSON_KEY = 'cyber-study-lessons-v1';
const LEGACY_LAB_KEY = 'cyber-study-labs-v1';

function nowIso() {
  return new Date().toISOString();
}

function store() {
  return typeof accountStorage === 'undefined' ? null : accountStorage;
}

function emptyProgress(): LessonLearningProgress {
  const now = nowIso();
  return {
    migratedFromLegacy: false,
    completed: false,
    favorite: false,
    doubt: false,
    visitedSectionIds: [],
    completedActivityIds: [],
    completedLabStepIds: [],
    quizHistory: [],
    firstSeenAt: now,
    lastSeenAt: now
  };
}

export function getLearningProgress(): LearningProgressState {
  const storage = store();
  if (!storage) return {};

  try {
    return JSON.parse(storage.getItem(PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getLessonLearningProgress(id: number): LessonLearningProgress {
  return getLearningProgress()[id] ?? emptyProgress();
}

export function migrateLegacyProgress(): LearningProgressState {
  const storage = store();
  if (!storage) return {};

  const alreadyMigrated = storage.getItem(MIGRATION_KEY);
  if (alreadyMigrated) return getLearningProgress();

  const all = getLearningProgress();

  let legacyLessons: Record<
    number,
    { completed?: boolean; favorite?: boolean; doubt?: boolean; quizBest?: number }
  > = {};
  let legacyLabs: Record<number, { completedStepIds?: string[] }> = {};

  try {
    legacyLessons = JSON.parse(storage.getItem(LEGACY_LESSON_KEY) || '{}');
  } catch {
    legacyLessons = {};
  }

  try {
    legacyLabs = JSON.parse(storage.getItem(LEGACY_LAB_KEY) || '{}');
  } catch {
    legacyLabs = {};
  }

  const ids = new Set([
    ...Object.keys(legacyLessons).map(Number),
    ...Object.keys(legacyLabs).map(Number)
  ]);

  for (const id of ids) {
    if (!Number.isFinite(id)) continue;

    const current = all[id] ?? emptyProgress();
    const legacy = legacyLessons[id] ?? {};
    const legacyLab = legacyLabs[id] ?? {};
    const mergedLabSteps = new Set([
      ...current.completedLabStepIds,
      ...(legacyLab.completedStepIds ?? [])
    ]);

    const quizHistory = [...current.quizHistory];
    if (
      typeof legacy.quizBest === 'number' &&
      legacy.quizBest > 0 &&
      !quizHistory.some(item => item.score === legacy.quizBest)
    ) {
      quizHistory.push({
        score: legacy.quizBest,
        correct: 0,
        total: 0,
        completedAt: current.firstSeenAt
      });
    }

    all[id] = {
      ...current,
      migratedFromLegacy: true,
      completed: current.completed || Boolean(legacy.completed),
      favorite: current.favorite || Boolean(legacy.favorite),
      doubt: current.doubt || Boolean(legacy.doubt),
      completedLabStepIds: [...mergedLabSteps],
      quizHistory,
      lastSeenAt: nowIso()
    };
  }

  storage.setItem(PROGRESS_KEY, JSON.stringify(all));
  storage.setItem(
    MIGRATION_KEY,
    JSON.stringify({
      completedAt: nowIso(),
      sourceKeys: [LEGACY_LESSON_KEY, LEGACY_LAB_KEY],
      destructive: false
    })
  );

  return all;
}

export function markSectionVisited(lessonId: number, sectionId: string) {
  return updateLessonLearningProgress(lessonId, current => ({
    ...current,
    visitedSectionIds: unique([...current.visitedSectionIds, sectionId]),
    lastSeenAt: nowIso()
  }));
}

export function markActivityCompletion(
  lessonId: number,
  activityId: string,
  completed = true
) {
  return updateLessonLearningProgress(lessonId, current => {
    const ids = new Set(current.completedActivityIds);
    if (completed) ids.add(activityId);
    else ids.delete(activityId);

    return {
      ...current,
      completedActivityIds: [...ids],
      lastSeenAt: nowIso()
    };
  });
}

export function markLabStepProgress(
  lessonId: number,
  stepId: string,
  completed: boolean
) {
  return updateLessonLearningProgress(lessonId, current => {
    const ids = new Set(current.completedLabStepIds);
    if (completed) ids.add(stepId);
    else ids.delete(stepId);

    return {
      ...current,
      completedLabStepIds: [...ids],
      lastSeenAt: nowIso()
    };
  });
}

export function recordQuizAttempt(
  lessonId: number,
  attempt: Omit<QuizAttempt, 'completedAt'>
) {
  return updateLessonLearningProgress(lessonId, current => ({
    ...current,
    quizHistory: [
      ...current.quizHistory,
      { ...attempt, completedAt: nowIso() }
    ].slice(-30),
    lastSeenAt: nowIso()
  }));
}

export function syncLegacyLessonFlags(
  lessonId: number,
  flags: {
    completed?: boolean;
    favorite?: boolean;
    doubt?: boolean;
  }
) {
  return updateLessonLearningProgress(lessonId, current => ({
    ...current,
    ...flags,
    lastSeenAt: nowIso()
  }));
}

export function getLearningSummary(lessonId: number) {
  const progress = getLessonLearningProgress(lessonId);
  const bestQuiz = progress.quizHistory.reduce(
    (best, attempt) => Math.max(best, attempt.score),
    0
  );

  return {
    visitedSections: progress.visitedSectionIds.length,
    activities: progress.completedActivityIds.length,
    labSteps: progress.completedLabStepIds.length,
    quizAttempts: progress.quizHistory.length,
    bestQuiz,
    lastSeenAt: progress.lastSeenAt
  };
}

function updateLessonLearningProgress(
  lessonId: number,
  updater: (current: LessonLearningProgress) => LessonLearningProgress
) {
  const storage = store();
  if (!storage) return emptyProgress();

  const all = getLearningProgress();
  const next = updater(all[lessonId] ?? emptyProgress());
  all[lessonId] = next;
  storage.setItem(PROGRESS_KEY, JSON.stringify(all));
  return next;
}

function unique(values: string[]) {
  return [...new Set(values)];
}
