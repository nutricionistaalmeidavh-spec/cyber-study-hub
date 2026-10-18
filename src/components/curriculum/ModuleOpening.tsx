import coursesData from '../../curriculum/courses.json';
import {openingForPentestLesson} from '../../lib/pentestModuleOpenings.mjs';

/**
 * Breve introdução editorial somente na PRIMEIRA aula do módulo.
 * IDs, progresso, conteúdos assinados e laboratórios continuam canônicos.
 */
export function ModuleOpening({lessonId}: {lessonId:number}) {
  const intro = openingForPentestLesson(lessonId, coursesData.courses);
  if (!intro) return null;
  return (
    <section className="module-opening" aria-labelledby="module-opening-heading">
      <div className="module-opening-topline">
        <span>ANTES DE COMEÇAR</span>
        <span>MÓDULO {String(intro.moduleIndex).padStart(2, '0')} / {String(intro.moduleCount).padStart(2, '0')}</span>
      </div>
      <h2 id="module-opening-heading">{intro.title}</h2>
      <p className="module-opening-lead">{intro.lead}</p>
      <div className="module-opening-details">
        <div>
          <strong>Um pouco de história</strong>
          <p>{intro.history}</p>
        </div>
        <div>
          <strong>O que vem pela frente</strong>
          <p>{intro.destination}</p>
        </div>
      </div>
    </section>
  );
}
