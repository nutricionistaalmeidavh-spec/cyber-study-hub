import { accountStorage } from './accountStorage';
import type { GameProgress } from '../types';
import { recordGameEvidence } from './mastery';

const LESSON_KEY = 'cyber-study-lessons-v1';
const GAME_KEY = 'cyber-study-games-v1';
const RECENT_KEY = 'cyber-study-recent-items-v1';
const LAB_KEY = 'cyber-study-labs-v1';

export type LessonState = Record<number, { completed: boolean; favorite: boolean; doubt: boolean; quizBest: number }>;

export function getLessonState(): LessonState {
  try { return JSON.parse(accountStorage.getItem(LESSON_KEY) || '{}'); } catch { return {}; }
}

export function updateLessonState(id: number, patch: Partial<LessonState[number]>) {
  const all = getLessonState();
  all[id] = { ...(all[id] ?? { completed: false, favorite: false, doubt: false, quizBest: 0 }), ...patch };
  accountStorage.setItem(LESSON_KEY, JSON.stringify(all));
}

export function getGameProgress(): GameProgress[] {
  try { return JSON.parse(accountStorage.getItem(GAME_KEY) || '[]'); } catch { return []; }
}

export function saveGameProgress(next: GameProgress) {
  const all = getGameProgress();
  const idx = all.findIndex(x => x.gameId === next.gameId && x.gameType === next.gameType);
  if (idx >= 0) {
    const prev = all[idx];
    all[idx] = {
      ...next,
      attempts: Math.max(next.attempts, prev.attempts + 1),
      bestScore: Math.max(prev.bestScore, next.score)
    };
  } else {
    all.push({ ...next, attempts: Math.max(1, next.attempts), bestScore: next.score });
  }
  accountStorage.setItem(GAME_KEY, JSON.stringify(all));
  recordGameEvidence(next);
}

export function pickWithRecency<T extends { id: string }>(key: string, pool: T[], count: number): T[] {
  let recent: string[] = [];
  try { recent = JSON.parse(accountStorage.getItem(RECENT_KEY) || '{}')[key] || []; } catch { recent = []; }
  const fresh = pool.filter(x => !recent.includes(x.id));
  const source = fresh.length >= count ? fresh : pool;
  const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, count);
  let map: Record<string, string[]> = {};
  try { map = JSON.parse(accountStorage.getItem(RECENT_KEY) || '{}'); } catch { map = {}; }
  map[key] = [...shuffled.map(x => x.id), ...recent].slice(0, Math.max(count * 2, 12));
  accountStorage.setItem(RECENT_KEY, JSON.stringify(map));
  return shuffled;
}


export type LabProgressRecord = {
  completedStepIds: string[];
  updatedAt: string;
};

export type LabProgressState = Record<number, LabProgressRecord>;

export function getLabProgress(): LabProgressState {
  try {
    return JSON.parse(accountStorage.getItem(LAB_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getLabProgressForLesson(id: number): LabProgressRecord {
  return (
    getLabProgress()[id] ?? {
      completedStepIds: [],
      updatedAt: ''
    }
  );
}

export function setLabStepCompletion(
  lessonId: number,
  stepId: string,
  completed: boolean
): LabProgressRecord {
  const all = getLabProgress();
  const current =
    all[lessonId] ?? {
      completedStepIds: [],
      updatedAt: ''
    };

  const nextIds = new Set(current.completedStepIds);
  if (completed) nextIds.add(stepId);
  else nextIds.delete(stepId);

  const next: LabProgressRecord = {
    completedStepIds: [...nextIds],
    updatedAt: new Date().toISOString()
  };

  all[lessonId] = next;
  accountStorage.setItem(LAB_KEY, JSON.stringify(all));
  return next;
}
