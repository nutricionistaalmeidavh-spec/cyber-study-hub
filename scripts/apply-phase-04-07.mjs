import fs from 'node:fs';

const lessonsPath = 'src/components/Lessons.tsx';
const storagePath = 'src/lib/storage.ts';

patchLessons();
patchStorage();

console.log('Fases 4–7 aplicadas ao checkout atual.');
console.log('Próximo passo: npm run verify:curriculum && npm run build && git diff --check');

function patchLessons() {
  let source = fs.readFileSync(lessonsPath, 'utf8');

  const importAnchor =
    "import { getLessonState, updateLessonState } from '../lib/storage';";
  const bridgeImport =
    "import { hasNativeV2Lesson } from '../content/registry';\n" +
    "import { LessonViewerV2 } from './lesson-v2/LessonViewerV2';";

  if (!source.includes(bridgeImport)) {
    if (!source.includes(importAnchor)) {
      fail(`Não encontrei o anchor de import em ${lessonsPath}.`);
    }
    source = source.replace(importAnchor, `${importAnchor}\n${bridgeImport}`);
  }

  if (
    !source.includes(
      "export function LessonViewer({id,onRefresh}:{id:number;onRefresh:()=>void})"
    )
  ) {
    if (
      source.includes(
        "function LegacyLessonViewer({id,onRefresh}:{id:number;onRefresh:()=>void})"
      )
    ) {
      fs.writeFileSync(lessonsPath, source);
      return;
    }
    fail(`Assinatura esperada de LessonViewer não encontrada em ${lessonsPath}.`);
  }

  const oldSignature =
    "export function LessonViewer({id,onRefresh}:{id:number;onRefresh:()=>void}) {";
  const replacement = `export function LessonViewer(props:{id:number;onRefresh:()=>void}) {
  if (hasNativeV2Lesson(props.id)) {
    return <LessonViewerV2 {...props} />;
  }
  return <LegacyLessonViewer {...props} />;
}

function LegacyLessonViewer({id,onRefresh}:{id:number;onRefresh:()=>void}) {`;

  source = source.replace(oldSignature, replacement);
  fs.writeFileSync(lessonsPath, source);
}

function patchStorage() {
  let source = fs.readFileSync(storagePath, 'utf8');

  if (!source.includes("const LAB_KEY = 'cyber-study-labs-v1';")) {
    const anchor = "const RECENT_KEY = 'cyber-study-recent-items-v1';";
    if (!source.includes(anchor)) fail(`Anchor de storage não encontrado em ${storagePath}.`);
    source = source.replace(
      anchor,
      `${anchor}\nconst LAB_KEY = 'cyber-study-labs-v1';`
    );
  }

  if (source.includes('export type LabProgressRecord')) {
    fs.writeFileSync(storagePath, source);
    return;
  }

  source += `

export type LabProgressRecord = {
  completedStepIds: string[];
  updatedAt: string;
};

export type LabProgressState = Record<number, LabProgressRecord>;

export function getLabProgress(): LabProgressState {
  try {
    return JSON.parse(localStorage.getItem(LAB_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getLabProgressForLesson(id: number): LabProgressRecord {
  return (
    getLabProgress()[id] ?? {
      completedStepIds: [],
      updatedAt: ''
    }
  );
}

export function setLabStepCompletion(
  lessonId: number,
  stepId: string,
  completed: boolean
): LabProgressRecord {
  const all = getLabProgress();
  const current =
    all[lessonId] ?? {
      completedStepIds: [],
      updatedAt: ''
    };

  const nextIds = new Set(current.completedStepIds);
  if (completed) nextIds.add(stepId);
  else nextIds.delete(stepId);

  const next: LabProgressRecord = {
    completedStepIds: [...nextIds],
    updatedAt: new Date().toISOString()
  };

  all[lessonId] = next;
  localStorage.setItem(LAB_KEY, JSON.stringify(all));
  return next;
}
`;

  fs.writeFileSync(storagePath, source);
}

function fail(message) {
  console.error(`ERRO: ${message}`);
  process.exit(1);
}
