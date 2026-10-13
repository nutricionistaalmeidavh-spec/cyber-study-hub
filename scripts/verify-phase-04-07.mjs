import fs from 'node:fs';

const checks = [
  ['src/components/lesson-v2/LessonViewerV2.tsx', ['WorkedExample', 'CompletionExercise', 'IndependentExercise', 'CodeExample', 'IntersectionObserver']],
  ['src/components/lesson-v2/LabRunner.tsx', ['getLabProgressForLesson', 'setLabStepCompletion', 'Ver resultado esperado', 'TROUBLESHOOTING']],
  ['src/components/lesson-v2/lesson-v2.css', ['lesson-v2-layout', 'lesson-v2-mobile-outline', 'lesson-v2-code-line', 'lesson-v2-lab-step']],
  ['src/components/Lessons.tsx', ['LessonViewerV2', 'hasNativeV2Lesson', 'LegacyLessonViewer']],
  ['src/lib/storage.ts', ['cyber-study-labs-v1', 'getLabProgressForLesson', 'setLabStepCompletion']]
];

const errors = [];
for (const [file, needles] of checks) {
  if (!fs.existsSync(file)) {
    errors.push(`${file}: ausente`);
    continue;
  }

  const source = fs.readFileSync(file, 'utf8');
  for (const needle of needles) {
    if (!source.includes(needle)) errors.push(`${file}: não contém "${needle}"`);
  }
}

if (errors.length) {
  console.error('Phase 4–7 verification FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Phase 4–7 verification OK — viewer V2, fading, código anotado e lab estruturado presentes.');
