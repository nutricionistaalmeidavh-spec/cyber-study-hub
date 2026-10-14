import { accountStorage } from './accountStorage';
import type { GameProgress } from '../types';

export type MasterySource =
  | 'lesson-quiz'
  | 'game'
  | 'spaced-review'
  | 'manual';

export type ConceptMastery = {
  conceptId: string;
  label: string;
  score: number;
  correctEvidence: number;
  incorrectEvidence: number;
  lastSource: MasterySource;
  lastSeenAt: string;
  relatedLessons: number[];
};

export type MasteryState = Record<string, ConceptMastery>;

const MASTERY_KEY = 'cyber-study-concept-mastery-v1';

function store() {
  return typeof accountStorage === 'undefined' ? null : accountStorage;
}

export function getMasteryState(): MasteryState {
  const storage = store();
  if (!storage) return {};

  try {
    return JSON.parse(storage.getItem(MASTERY_KEY) || '{}');
  } catch {
    return {};
  }
}

export function recordConceptEvidence({
  conceptId,
  label,
  correct,
  source,
  lessonId,
  weight = 1
}: {
  conceptId: string;
  label?: string;
  correct: boolean;
  source: MasterySource;
  lessonId?: number;
  weight?: number;
}) {
  const storage = store();
  if (!storage) return;

  const state = getMasteryState();
  const previous: ConceptMastery =
    state[conceptId] ?? {
      conceptId,
      label: label ?? conceptId,
      score: 50,
      correctEvidence: 0,
      incorrectEvidence: 0,
      lastSource: source,
      lastSeenAt: new Date(0).toISOString(),
      relatedLessons: []
    };

  const delta = correct ? 8 * weight : -13 * weight;
  const relatedLessons = new Set(previous.relatedLessons);
  if (lessonId) relatedLessons.add(lessonId);

  state[conceptId] = {
    ...previous,
    label: label ?? previous.label,
    score: clamp(Math.round(previous.score + delta), 0, 100),
    correctEvidence:
      previous.correctEvidence + (correct ? Math.max(1, Math.round(weight)) : 0),
    incorrectEvidence:
      previous.incorrectEvidence + (!correct ? Math.max(1, Math.round(weight)) : 0),
    lastSource: source,
    lastSeenAt: new Date().toISOString(),
    relatedLessons: [...relatedLessons]
  };

  storage.setItem(MASTERY_KEY, JSON.stringify(state));
}

export function recordQuizConceptEvidence(
  lessonId: number,
  conceptId: string,
  correct: boolean
) {
  recordConceptEvidence({
    conceptId,
    label: conceptId,
    correct,
    source: 'lesson-quiz',
    lessonId
  });
}

export function recordGameEvidence(progress: GameProgress) {
  for (const lessonId of progress.relatedLessons) {
    recordConceptEvidence({
      conceptId: `lesson:${lessonId}`,
      label: `Aula ${lessonId}`,
      correct: progress.score >= 70,
      source: 'game',
      lessonId,
      weight: progress.score >= 85 ? 1.2 : progress.score < 55 ? 1.2 : 0.7
    });
  }

  for (const weakConcept of progress.weakConcepts ?? []) {
    recordConceptEvidence({
      conceptId: normalizeConceptId(weakConcept),
      label: weakConcept,
      correct: false,
      source: 'game',
      weight: 1.1
    });
  }
}

export function recordSpacedReviewEvidence(
  lessonId: number,
  conceptId: string,
  correct: boolean
) {
  recordConceptEvidence({
    conceptId,
    label: conceptId,
    correct,
    source: 'spaced-review',
    lessonId,
    weight: correct ? 1.1 : 1.35
  });
}

export function getWeakConcepts(limit = 12) {
  return Object.values(getMasteryState())
    .filter(item => item.score < 60)
    .sort((a, b) => a.score - b.score || b.incorrectEvidence - a.incorrectEvidence)
    .slice(0, limit);
}

export function getStrongConcepts(limit = 12) {
  return Object.values(getMasteryState())
    .filter(item => item.score >= 75)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function normalizeConceptId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
