import {
  createEmptyCard,
  fsrs,
  Rating,
  type Card
} from 'ts-fsrs';
import type { LessonV2 } from '../content/schema';
import { recordSpacedReviewEvidence } from './mastery';

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export type StoredReviewCard = {
  id: string;
  lessonId: number;
  conceptId: string;
  prompt: string;
  answer: string;
  card: SerializedCard;
  reviewCount: number;
  lastRating?: ReviewRating;
};

type SerializedCard = Omit<Card, 'due' | 'last_review'> & {
  due: string;
  last_review?: string;
};

const REVIEW_KEY = 'cyber-study-fsrs-v1';

const scheduler = fsrs({
  request_retention: 0.9,
  maximum_interval: 3650,
  enable_fuzz: true,
  enable_short_term: true,
  learning_steps: ['1m', '10m'],
  relearning_steps: ['10m']
});

const ratingMap: Record<ReviewRating, Rating.Again | Rating.Hard | Rating.Good | Rating.Easy> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy
};

function store() {
  return typeof localStorage === 'undefined' ? null : localStorage;
}

export function getReviewCards(): StoredReviewCard[] {
  const storage = store();
  if (!storage) return [];

  try {
    const parsed = JSON.parse(storage.getItem(REVIEW_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function seedLessonReviewCards(lesson: LessonV2) {
  const storage = store();
  if (!storage) return [];

  const cards = getReviewCards();
  const byId = new Map(cards.map(card => [card.id, card]));

  for (const [index, flashcard] of lesson.review.flashcards.entries()) {
    const id = `${lesson.id}:${flashcard.concept}:${index}`;
    if (byId.has(id)) continue;

    const card = createEmptyCard(new Date());
    byId.set(id, {
      id,
      lessonId: lesson.id,
      conceptId: flashcard.concept,
      prompt: flashcard.front,
      answer: flashcard.back,
      card: serializeCard(card),
      reviewCount: 0
    });
  }

  const next = [...byId.values()];
  storage.setItem(REVIEW_KEY, JSON.stringify(next));
  return next;
}

export function getDueReviewCards(now = new Date(), limit = 20) {
  return getReviewCards()
    .filter(item => hydrateCard(item.card).due.getTime() <= now.getTime())
    .sort(
      (a, b) =>
        hydrateCard(a.card).due.getTime() - hydrateCard(b.card).due.getTime()
    )
    .slice(0, limit);
}

export function getNextReviewCard() {
  return getReviewCards()
    .sort(
      (a, b) =>
        hydrateCard(a.card).due.getTime() - hydrateCard(b.card).due.getTime()
    )[0];
}

export function rateReviewCard(
  cardId: string,
  rating: ReviewRating,
  now = new Date()
) {
  const storage = store();
  if (!storage) return null;

  const cards = getReviewCards();
  const index = cards.findIndex(item => item.id === cardId);
  if (index < 0) return null;

  const item = cards[index];
  const previous = hydrateCard(item.card);
  const result = scheduler.next(previous, now, ratingMap[rating]);

  const next: StoredReviewCard = {
    ...item,
    card: serializeCard(result.card),
    reviewCount: item.reviewCount + 1,
    lastRating: rating
  };

  cards[index] = next;
  storage.setItem(REVIEW_KEY, JSON.stringify(cards));

  recordSpacedReviewEvidence(
    item.lessonId,
    item.conceptId,
    rating === 'good' || rating === 'easy'
  );

  return next;
}

export function getReviewStats(now = new Date()) {
  const cards = getReviewCards();
  const due = cards.filter(
    item => hydrateCard(item.card).due.getTime() <= now.getTime()
  );

  return {
    total: cards.length,
    due: due.length,
    reviewed: cards.filter(item => item.reviewCount > 0).length,
    nextDueAt:
      cards.length > 0
        ? cards
            .map(item => hydrateCard(item.card).due)
            .sort((a, b) => a.getTime() - b.getTime())[0]
            .toISOString()
        : null
  };
}

export function getCardRetrievability(item: StoredReviewCard, now = new Date()) {
  if (item.reviewCount === 0) return 0;
  try {
    return scheduler.get_retrievability(hydrateCard(item.card), now, false);
  } catch {
    return 0;
  }
}

function serializeCard(card: Card): SerializedCard {
  return {
    ...card,
    due: card.due.toISOString(),
    last_review: card.last_review?.toISOString()
  };
}

function hydrateCard(card: SerializedCard): Card {
  return {
    ...card,
    due: new Date(card.due),
    last_review: card.last_review ? new Date(card.last_review) : undefined
  } as Card;
}
