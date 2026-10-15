import { accountStorage } from './accountStorage';
import type { LessonLearningProgress } from './learningProgress';

// Extend entries in the existing account-owned state. No new endpoint or storage key.
const KEY = 'cyber-study-learning-v2';
export type StudyVisit = {
  title: string;
  href: string;
  kind: 'reading' | 'interactive' | 'ai';
  sectionId?: string;
  sectionLabel?: string;
  updatedAt: string;
  read?: boolean;
};
type Entry = LessonLearningProgress & { study?: StudyVisit; draft?: unknown };
function entries(): Record<string, Entry> {
  try {
    const value = JSON.parse(accountStorage.getItem(KEY) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}
export function getStudyVisit(key: string): StudyVisit | undefined {
  return entries()[key]?.study;
}
export function getStudyDraft(key: string): unknown { return entries()[key]?.draft; }
export function getStudyVisits(): Array<StudyVisit & { key: string }> {
  return Object.entries(entries()).flatMap(([key, value]) =>
    value?.study?.href && value?.study?.updatedAt ? [{ ...value.study, key }] : [])
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}
export function saveStudyVisit(key: string, visit: Omit<StudyVisit, 'updatedAt'>, draft?: unknown) {
  const all = entries();
  const now = new Date().toISOString();
  const current = all[key] as Entry | undefined;
  all[key] = {
    migratedFromLegacy: false, completed: false, favorite: false, doubt: false,
    completedActivityIds: [], completedLabStepIds: [],
    quizHistory: [], firstSeenAt: now, ...current, lastSeenAt: now,
    study: { ...current?.study, ...visit, updatedAt: now },
    ...(draft === undefined ? {} : { draft }),
    visitedSectionIds: [...new Set([...(current?.visitedSectionIds || []), ...(visit.sectionId ? [visit.sectionId] : [])])]
  };
  accountStorage.setItem(KEY, JSON.stringify(all));
  return all[key].study!;
}
