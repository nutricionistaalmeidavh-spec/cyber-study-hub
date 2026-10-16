import { courses, type CourseOffering } from './courseOfferings';

/**
 * Trilhas temáticas são uma camada de navegação. Os IDs de curso de origem,
 * grants, produtos ArtiSys e identidades AULA-XXX permanecem inalterados.
 */
export type MainLearningPath = {
  id: string;
  title: string;
  description: string;
  courseIds: readonly string[];
};

export const mainLearningPaths: MainLearningPath[] = [
  {
    id: 'trilha-pentest-ethical-hacking',
    title: 'Pentest e Ethical Hacking',
    description: 'Testes autorizados, segurança no desenvolvimento, Red/Purple Team e projeto prático integrado.',
    courseIds: ['pentest-seguro', 'red-purple-team', 'projeto-final']
  },
  {
    id: 'trilha-seguranca-ofensiva-defensiva',
    title: 'Segurança Ofensiva e Defensiva',
    description: 'Redes, sistemas, Active Directory, SOC, resposta a incidentes e engenharia de detecção.',
    courseIds: ['redes-sistemas', 'active-directory', 'blue-team']
  },
  {
    id: 'trilha-engenharia-reversa-malware',
    title: 'Engenharia Reversa e Análise de Malware',
    description: 'C, internals, Assembly, binários, análise estática e dinâmica de malware em laboratório.',
    courseIds: ['engenharia-reversa', 'analise-malware']
  },
  {
    id: 'trilha-pesquisa-vulnerabilidades',
    title: 'Pesquisa e Exploração de Vulnerabilidades',
    description: 'Memória, mitigações, fuzzing e investigação responsável de falhas em ambientes controlados.',
    courseIds: ['exploit-research']
  },
  {
    id: 'trilha-aplicacoes-cloud-ia',
    title: 'Segurança de Aplicações, Infraestrutura, Nuvem e IA',
    description: 'Web Security, APIs, OAuth, AppSec, containers, DevSecOps, agentes e LLMs.',
    courseIds: ['web-apis', 'cloud-devsecops', 'seguranca-ia']
  }
];

export function mainPathCourses(path: MainLearningPath): CourseOffering[] {
  return path.courseIds.flatMap(id => {
    const course = courses.find(item => item.id === id && item.type === 'main' && item.status === 'published');
    return course ? [course] : [];
  });
}

export function mainPathModules(path: MainLearningPath) {
  return mainPathCourses(path).flatMap(course =>
    course.modules.map(module => ({
      ...module,
      courseId: course.id,
      courseTitle: course.title
    }))
  );
}

export function mainPathLessonCount(path: MainLearningPath): number {
  return mainPathModules(path).reduce((total, module) => total + module.lessonCodes.length, 0);
}
