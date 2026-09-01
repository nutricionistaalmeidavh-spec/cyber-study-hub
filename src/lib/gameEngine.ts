import type { CrosswordEntry } from '../types';

export const normalize = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase()
  .replace(/[^A-Z0-9]/g, '');

export type CrosswordPlacement = {
  id: string;
  answer: string;
  clue: string;
  row: number;
  col: number;
  dir: 'across' | 'down';
  number: number;
};

export type CrosswordBoard = {
  size: number;
  placements: CrosswordPlacement[];
  cells: Record<string, { answer: string; wordIds: string[]; number?: number }>;
};

function canPlace(
  word: string,
  row: number,
  col: number,
  dir: 'across' | 'down',
  size: number,
  cells: Record<string, { answer: string; wordIds: string[] }>
) {
  const dr = dir === 'down' ? 1 : 0;
  const dc = dir === 'across' ? 1 : 0;
  if (row < 0 || col < 0 || row + dr * (word.length - 1) >= size || col + dc * (word.length - 1) >= size) return false;
  let intersects = 0;
  for (let i = 0; i < word.length; i++) {
    const key = `${row + dr * i}-${col + dc * i}`;
    const cell = cells[key];
    if (cell && cell.answer !== word[i]) return false;
    if (cell) intersects++;
  }
  return intersects > 0;
}

export function buildCrossword(entries: CrosswordEntry[], size = 21): CrosswordBoard {
  const prepared = entries
    .map(e => ({ ...e, answer: normalize(e.answer) }))
    .filter(e => e.answer.length >= 3 && e.answer.length <= size - 2)
    .sort((a, b) => b.answer.length - a.answer.length);

  const placements: CrosswordPlacement[] = [];
  const cells: Record<string, { answer: string; wordIds: string[]; number?: number }> = {};
  if (!prepared.length) return { size, placements, cells };

  const place = (entry: CrosswordEntry & { answer: string }, row: number, col: number, dir: 'across' | 'down') => {
    const number = placements.length + 1;
    const p: CrosswordPlacement = { id: entry.id, answer: entry.answer, clue: entry.clue, row, col, dir, number };
    placements.push(p);
    const dr = dir === 'down' ? 1 : 0;
    const dc = dir === 'across' ? 1 : 0;
    for (let i = 0; i < entry.answer.length; i++) {
      const key = `${row + dr * i}-${col + dc * i}`;
      const prior = cells[key];
      cells[key] = { answer: entry.answer[i], wordIds: [...(prior?.wordIds || []), entry.id], number: i === 0 ? (prior?.number || number) : prior?.number };
    }
  };

  const first = prepared[0];
  place(first, Math.floor(size / 2), Math.max(0, Math.floor((size - first.answer.length) / 2)), 'across');

  for (const entry of prepared.slice(1)) {
    let placed = false;
    const candidates = [...placements].sort(() => Math.random() - 0.5);
    for (const base of candidates) {
      for (let i = 0; i < entry.answer.length && !placed; i++) {
        for (let j = 0; j < base.answer.length && !placed; j++) {
          if (entry.answer[i] !== base.answer[j]) continue;
          const dir: 'across' | 'down' = base.dir === 'across' ? 'down' : 'across';
          const crossRow = base.row + (base.dir === 'down' ? j : 0);
          const crossCol = base.col + (base.dir === 'across' ? j : 0);
          const row = crossRow - (dir === 'down' ? i : 0);
          const col = crossCol - (dir === 'across' ? i : 0);
          if (canPlace(entry.answer, row, col, dir, size, cells)) {
            place(entry, row, col, dir);
            placed = true;
          }
        }
      }
      if (placed) break;
    }
  }
  return { size, placements, cells };
}

export function scoreFrom(correct: number, total: number, mistakes = 0, hints = 0) {
  if (!total) return 0;
  const base = (correct / total) * 100;
  return Math.max(0, Math.round(base - mistakes * 3 - hints * 5));
}
