import fs from 'node:fs';

patchLessons();
patchApp();

console.log('Fases 12–14 integradas aos pontos de navegação do checkout.');

function patchLessons() {
  const file = 'src/components/Lessons.tsx';
  let source = fs.readFileSync(file, 'utf8');

  const importLine = "import { CurriculumBrowser } from './curriculum/CurriculumBrowser';";
  if (!source.includes(importLine)) {
    const anchor = "import { getLessonState, updateLessonState } from '../lib/storage';";
    if (!source.includes(anchor)) fail(`Import anchor não encontrado em ${file}.`);
    source = source.replace(anchor, `${anchor}\n${importLine}`);
  }

  if (!source.includes('function LegacyLessonList(')) {
    const signature = "export function LessonList({initialTrack}:{initialTrack?:string}) {";
    if (!source.includes(signature)) fail(`LessonList anchor não encontrado em ${file}.`);
    const replacement = `export function LessonList(props:{initialTrack?:string}) {
  return <CurriculumBrowser {...props} />;
}

function LegacyLessonList({initialTrack}:{initialTrack?:string}) {`;
    source = source.replace(signature, replacement);
  }

  fs.writeFileSync(file, source);
}

function patchApp() {
  const file = 'src/App.tsx';
  let source = fs.readFileSync(file, 'utf8');

  const importLine = "import { CourseDocumentViewer } from './components/curriculum/CourseDocumentViewer';";
  if (!source.includes(importLine)) {
    const anchor = "import type { GameType } from './types';";
    if (!source.includes(anchor)) fail(`App import anchor não encontrado em ${file}.`);
    source = source.replace(anchor, `${anchor}\n${importLine}`);
  }

  if (!source.includes("| { page: 'course-main'; id: number }")) {
    const anchor = "  | { page: 'lesson'; id: number }";
    if (!source.includes(anchor)) fail(`Route anchor não encontrado em ${file}.`);
    source = source.replace(
      anchor,
      `${anchor}\n  | { page: 'course-main'; id: number }\n  | { page: 'course-parallel'; code: string }`
    );
  }

  if (!source.includes("raw.startsWith('course/main/')")) {
    const anchor = "  if (raw.startsWith('lesson/')) return { page: 'lesson', id: Number(raw.split('/')[1]) || 43 };";
    if (!source.includes(anchor)) fail(`parseHash anchor não encontrado em ${file}.`);
    source = source.replace(
      anchor,
      `  if (raw.startsWith('course/main/')) return { page: 'course-main', id: Number(raw.split('/')[2]) || 1 };\n  if (raw.startsWith('course/parallel/')) return { page: 'course-parallel', code: decodeURIComponent(raw.split('/')[2] || 'LOG-01') };\n${anchor}`
    );
  }

  const oldDesktopActive = "active={route.page==='lessons'||route.page==='lesson'}";
  const newDesktopActive = "active={route.page==='lessons'||route.page==='lesson'||route.page==='course-main'||route.page==='course-parallel'}";
  source = source.split(oldDesktopActive).join(newDesktopActive);

  if (!source.includes("route.page==='course-main' && <CourseDocumentViewer")) {
    const anchor = "      {route.page==='lesson' && <LessonViewer id={route.id} onRefresh={refresh} />}";
    if (!source.includes(anchor)) fail(`Render anchor não encontrado em ${file}.`);
    source = source.replace(
      anchor,
      `${anchor}\n      {route.page==='course-main' && <CourseDocumentViewer kind=\"main\" id={route.id} />}\n      {route.page==='course-parallel' && <CourseDocumentViewer kind=\"parallel\" code={route.code} />}`
    );
  }

  fs.writeFileSync(file, source);
}

function fail(message) {
  console.error(`ERRO: ${message}`);
  process.exit(1);
}
