import data from './courses.json';
import content from './catalog.json';
import type { CurriculumCatalog } from './types';
export type CourseOffering = {
  id: string; type: 'main'|'parallel'|'trail'; title:string; description:string;
  status:'published'|'draft'; href?:string; sourceId?:string;
  modules:Array<{id:string;title:string;lessonCodes:string[]}>;
};
export const courses = data.courses as CourseOffering[];
export const publishedCourses = courses.filter(course => course.status === 'published');
const catalog=content as CurriculumCatalog;
export const mainLessonsByCode = new Map(catalog.main.map(item => [item.code,item]));
export const parallelLessonsByCode = new Map(catalog.parallel.map(item => [item.code,item]));
export const publishedMainLessonIds = new Set(publishedCourses.filter(c=>c.type==='main').flatMap(c=>c.modules.flatMap(m=>m.lessonCodes)).map(code=>mainLessonsByCode.get(code)?.id).filter((id):id is number=>id!==undefined));
export const publishedParallelLessonCodes = new Set(publishedCourses.filter(c=>c.type==='parallel').flatMap(c=>c.modules.flatMap(m=>m.lessonCodes)));
export const guidedLessonsByCode = new Map(catalog.guided.map(item => [item.code,item]));
export const publishedGuidedLessonCodes = new Set(publishedCourses.filter(c=>c.type==='trail').flatMap(c=>c.modules.flatMap(m=>m.lessonCodes)));
export const publishedStandaloneLessonCodes = new Set<string>(data.publishedStandaloneLessonCodes);

export const courseByLessonCode = new Map<string,string>(courses.flatMap(course=>course.modules.flatMap(module=>module.lessonCodes.map(code=>[code,course.id] as [string,string]))));
