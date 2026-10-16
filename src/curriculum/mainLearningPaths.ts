import { courses, type CourseOffering } from './courseOfferings';

/** Navegação pública e produtos seguem os mesmos cinco IDs de trilha. */
export type MainLearningPath = {
  id:string; title:string; description:string; courseIds:readonly string[];
};
const PATH_IDS = [
  "trilha-pentest-ethical-hacking",
  "trilha-seguranca-ofensiva-defensiva",
  "trilha-engenharia-reversa-malware",
  "trilha-pesquisa-vulnerabilidades",
  "trilha-aplicacoes-cloud-ia"
] as const;
export const mainLearningPaths: MainLearningPath[] = PATH_IDS.map(id => {
  const course=courses.find(item=>item.id===id&&item.type==='main'&&item.status==='published');
  if(!course)throw Error('Trilha principal não publicada: '+id);
  return {id,title:course.title,description:course.description,courseIds:[id]};
});
export function mainPathCourses(path:MainLearningPath):CourseOffering[] {
  return path.courseIds.flatMap(id => {
    const course=courses.find(item=>item.id===id&&item.type==='main'&&item.status==='published');
    return course?[course]:[];
  });
}
export function mainPathModules(path:MainLearningPath) {
  return mainPathCourses(path).flatMap(course=>course.modules.map(module=>({...module,courseId:course.id,courseTitle:course.title})));
}
export function mainPathLessonCount(path:MainLearningPath):number {
  return mainPathModules(path).reduce((count,module)=>count+module.lessonCodes.length,0);
}
