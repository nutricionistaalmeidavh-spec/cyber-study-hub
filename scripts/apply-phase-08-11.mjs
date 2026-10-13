import fs from 'node:fs';

patchStorage();
patchReview();

console.log('Fases 8–11 integradas aos pontos legados do checkout.');

function patchStorage() {
  const file = 'src/lib/storage.ts';
  let source = fs.readFileSync(file, 'utf8');

  const importLine = "import { recordGameEvidence } from './mastery';";
  if (!source.includes(importLine)) {
    const anchor = "import type { GameProgress } from '../types';";
    if (!source.includes(anchor)) fail(`Import anchor não encontrado em ${file}.`);
    source = source.replace(anchor, `${anchor}\n${importLine}`);
  }

  const saveAnchor =
    "  localStorage.setItem(GAME_KEY, JSON.stringify(all));\n}";
  if (!source.includes('recordGameEvidence(next);')) {
    if (!source.includes(saveAnchor)) {
      fail(`saveGameProgress anchor não encontrado em ${file}.`);
    }
    source = source.replace(
      saveAnchor,
      "  localStorage.setItem(GAME_KEY, JSON.stringify(all));\n  recordGameEvidence(next);\n}"
    );
  }

  fs.writeFileSync(file, source);
}

function patchReview() {
  const file = 'src/components/Review.tsx';
  let source = fs.readFileSync(file, 'utf8');

  const importLine =
    "import { LearningInsights } from './review/LearningInsights';";

  if (!source.includes(importLine)) {
    const anchor = "import { getGameProgress, getLessonState } from '../lib/storage';";
    if (!source.includes(anchor)) fail(`Import anchor não encontrado em ${file}.`);
    source = source.replace(anchor, `${anchor}\n${importLine}`);
  }

  if (!source.includes('<LearningInsights />')) {
    const anchor =
      '    <section className="two-col align-start">';
    if (!source.includes(anchor)) {
      fail(`Render anchor não encontrado em ${file}.`);
    }
    source = source.replace(
      anchor,
      '    <LearningInsights />\n' + anchor
    );
  }

  fs.writeFileSync(file, source);
}

function fail(message) {
  console.error(`ERRO: ${message}`);
  process.exit(1);
}
