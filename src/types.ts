export type Track = 'Web' | 'Sistemas' | 'Active Directory' | 'Blue Team' | 'Antivírus/EDR';

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  why: string;
};

export type Flashcard = { front: string; back: string };

export type Lesson = {
  id: number;
  title: string;
  track: Track;
  level: 'Base' | 'Intermediário' | 'Avançado';
  pcPractice: boolean;
  summary: string;
  objectives: string[];
  concepts: { term: string; definition: string }[];
  defend: string;
  detect: string;
  challenge: string;
  tags: string[];
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
};

export type GameType = 'crossword' | 'matching' | 'ordering' | 'scenario';

export type CrosswordEntry = { id: string; answer: string; clue: string; tags?: string[] };
export type MatchingPair = { id: string; left: string; right: string; explanation: string };
export type OrderingChallenge = { id: string; title: string; steps: string[]; explanation: string };
export type Scenario = {
  id: string;
  track: Track;
  relatedLessons: number[];
  title: string;
  evidence: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
};

export type ReviewPack = {
  id: number;
  title: string;
  lessons: [number, number];
  track: Track;
  crosswordPool: CrosswordEntry[];
  matchingPool: MatchingPair[];
  orderingPool: OrderingChallenge[];
  scenarioIds: string[];
};

export type GameProgress = {
  gameId: string;
  gameType: GameType;
  relatedLessons: number[];
  score: number;
  attempts: number;
  correct: number;
  mistakes: number;
  hintsUsed: number;
  durationSec: number;
  completedAt: string;
  bestScore: number;
  weakConcepts?: string[];
};
