import type { CourseOffering } from '../curriculum/courseOfferings';

export function normalizeCourseSearch(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
}

/** Return a visible match, including module/lesson metadata, without loading private content. */
export function courseSearchMatch(course: CourseOffering, query: string, titleFor: (code: string) => string) {
  const term = normalizeCourseSearch(query);
  if (!term || normalizeCourseSearch(course.title + ' ' + course.description).includes(term)) return course.title;
  for (const module of course.modules) {
    if (normalizeCourseSearch(module.title).includes(term)) return module.title;
    for (const code of module.lessonCodes) {
      const title = titleFor(code);
      if (normalizeCourseSearch(code + ' ' + title).includes(term)) return title || code;
    }
  }
  return null;
}

export function catalogType(value?: string): CourseOffering['type'] | undefined {
  return value === 'main' || value === 'trail' || value === 'parallel' ? value : undefined;
}
