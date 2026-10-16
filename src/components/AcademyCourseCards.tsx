import {type MouseEvent} from 'react';
import {waitlistCatalogCourses} from '../curriculum/courseOfferings';
import './academy-courses.css';

export default function AcademyCourseCards({onChoose}:{onChoose:(courseId:string)=>void}){
  const choose=(event:MouseEvent<HTMLAnchorElement>,courseId:string)=>{
    event.preventDefault();
    onChoose(courseId);
    window.history.replaceState(null,'','/academy?curso='+encodeURIComponent(courseId)+'#lista-de-espera');
    document.getElementById('lista-de-espera')?.scrollIntoView({behavior:'smooth',block:'start'});
  };
  return <div className="academy-courses-grid" aria-label="Trilhas e cursos disponíveis para interesse">
    {waitlistCatalogCourses.map(course=><details className="academy-course-card" name="academy-courses" key={course.id} id={'curso-'+course.id}>
      <summary className="academy-course-summary">
        <span className="academy-course-card-top">
          <span className="academy-course-type">{course.status==='draft'?'PRÉVIA · LISTA DE ESPERA':course.type==='trail'?'TRILHA PRÁTICA':'CURSO COMPLETO'}</span>
          <span className="academy-course-toggle" aria-hidden="true" />
        </span>
        <h3>{course.title}</h3><p>{course.description}</p>
        <span className="academy-course-card-bottom"><span>{course.modules.length} módulos</span>
          <span className="academy-course-expand-label"><span className="academy-course-closed">Ver módulos</span><span className="academy-course-open">Ocultar módulos</span> ↓</span>
        </span>
      </summary>
      <div className="academy-course-expanded">
        <h4>O que você vai estudar</h4>
        <ol className="academy-course-modules">
          {course.modules.map((module,index)=><li className="academy-course-module" key={module.id}>
            <span className="academy-course-module-index">{String(index+1).padStart(2,'0')}</span>
            <span>{module.title}</span>
          </li>)}
        </ol>
        {course.status==='draft'&&<p className="academy-course-preview-note">Conteúdo em prévia editorial. A participação na lista não libera aulas nem constitui matrícula.</p>}
        <a className="academy-button academy-button-outline academy-course-waitlist"
           href={'/academy?curso='+encodeURIComponent(course.id)+'#lista-de-espera'}
           onClick={event=>choose(event,course.id)}>Entrar na lista de espera <span aria-hidden="true">→</span></a>
      </div>
    </details>)}
  </div>;
}
