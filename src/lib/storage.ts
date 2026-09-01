import type { GameProgress } from '../types';

const LESSON_KEY = 'cyber-study-lessons-v1';
const GAME_KEY = 'cyber-study-games-v1';
const RECENT_KEY = 'cyber-study-recent-items-v1';

export type LessonState = Record<number, { completed: boolean; favorite: boolean; doubt: boolean; quizBest: number }>;

export function getLessonState(): LessonState {
  try { return JSON.parse(localStorage.getItem(LESSON_KEY) || '{}'); } catch { return {}; }
}

export function updateLessonState(id: number, patch: Partial<LessonState[number]>) {
  const all = getLessonState();
  all[id] = { ...(all[id] ?? { completed: false, favorite: false, doubt: false, quizBest: 0 }), ...patch };
  localStorage.setItem(LESSON_KEY, JSON.stringify(all));
}

export function getGameProgress(): GameProgress[] {
  try { return JSON.parse(localStorage.getItem(GAME_KEY) || '[]'); } catch { return []; }
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
  localStorage.setItem(GAME_KEY, JSON.stringify(all));
}

export function pickWithRecency<T extends { id: string }>(key: string, pool: T[], count: number): T[] {
  let recent: string[] = [];
  try { recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '{}')[key] || []; } catch { recent = []; }
  const fresh = pool.filter(x => !recent.includes(x.id));
  const source = fresh.length >= count ? fresh : pool;
  const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, count);
  let map: Record<string, string[]> = {};
  try { map = JSON.parse(localStorage.getItem(RECENT_KEY) || '{}'); } catch { map = {}; }
  map[key] = [...shuffled.map(x => x.id), ...recent].slice(0, Math.max(count * 2, 12));
  localStorage.setItem(RECENT_KEY, JSON.stringify(map));
  return shuffled;
}
