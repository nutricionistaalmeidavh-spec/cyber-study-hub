import fs from 'node:fs';

const checks = [
  ['package.json', ['"ts-fsrs"', '"verify:learning"']],
  ['src/lib/learningProgress.ts', ['migrateLegacyProgress', 'markSectionVisited', 'recordQuizAttempt']],
  ['src/lib/mastery.ts', ['recordQuizConceptEvidence', 'recordGameEvidence', 'getWeakConcepts']],
  ['src/lib/reviewEngine.ts', ['createEmptyCard', 'fsrs', 'Rating', 'seedLessonReviewCards', 'rateReviewCard']],
  ['src/components/review/LearningInsights.tsx', ['FSRS', 'getDueReviewCards', 'getWeakConcepts']],
  ['src/components/Lessons.tsx', ['LessonViewerV2', 'hasNativeV2Lesson']],
  ['src/components/lesson-v2/LessonViewerV2.tsx', ['markSectionVisited', 'recordQuizConceptEvidence', 'recordQuizAttempt']],
  ['src/components/lesson-v2/LabRunner.tsx', ['markLabStepProgress']],
  ['src/lib/storage.ts', ['recordGameEvidence(next);']],
  ['src/components/Review.tsx', ['LearningInsights']]
];

const errors = [];

for (const [file, needles] of checks) {
  if (!fs.existsSync(file)) {
    errors.push(`${file}: ausente`);
    continue;
  }

  const source = fs.readFileSync(file, 'utf8');
  for (const needle of needles) {
    if (!source.includes(needle)) {
      errors.push(`${file}: não contém "${needle}"`);
    }
  }
}

if (errors.length) {
  console.error('Phase 8–11 verification FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  'Phase 8–11 verification OK — progresso granular, FSRS, QA de avaliação e mastery integrados.'
);
