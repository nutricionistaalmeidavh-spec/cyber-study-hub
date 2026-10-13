import lesson47Data from './main/047/lesson.json';
import lesson48Data from './main/048/lesson.json';
import lesson49Data from './main/049/lesson.json';
import lesson50Data from './main/050/lesson.json';
import lesson51Data from './main/051/lesson.json';
import lesson52Data from './main/052/lesson.json';
import lesson53Data from './main/053/lesson.json';
import lesson54Data from './main/054/lesson.json';
import lesson55Data from './main/055/lesson.json';
import lesson56Data from './main/056/lesson.json';
import lesson57Data from './main/057/lesson.json';
import lesson58Data from './main/058/lesson.json';
import lesson59Data from './main/059/lesson.json';
import lesson60Data from './main/060/lesson.json';
import { lessons } from '../data/lessons';
import { lessonDetails } from '../data/lessonDetails';
import type { LessonV2 } from './schema';
import { adaptLegacyLesson } from './legacyAdapter';

const nativeV2Lessons: Record<number, LessonV2> = {
  47: lesson47Data as LessonV2,
  48: lesson48Data as LessonV2,
  49: lesson49Data as LessonV2,
  50: lesson50Data as LessonV2,
  51: lesson51Data as LessonV2,
  52: lesson52Data as LessonV2,
  53: lesson53Data as LessonV2,
  54: lesson54Data as LessonV2,
  55: lesson55Data as LessonV2,
  56: lesson56Data as LessonV2,
  57: lesson57Data as LessonV2,
  58: lesson58Data as LessonV2,
  59: lesson59Data as LessonV2,
  60: lesson60Data as LessonV2,
};

export function hasNativeV2Lesson(id: number): boolean {
  return Boolean(nativeV2Lessons[id]);
}

export function getLessonV2(id: number): LessonV2 | undefined {
  const nativeLesson = nativeV2Lessons[id];
  if (nativeLesson) return nativeLesson;

  const legacyLesson = lessons.find(lesson => lesson.id === id);
  if (!legacyLesson) return undefined;

  return adaptLegacyLesson(legacyLesson, lessonDetails[id]);
}

export function listNativeV2LessonIds(): number[] {
  return Object.keys(nativeV2Lessons).map(Number).sort((a, b) => a - b);
}
