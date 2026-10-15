import catalogData from '../curriculum/catalog.json';
import productData from '../curriculum/courses.json';
import publication from '../curriculum/publication.json';
import { lessons } from '../data/lessons';
import { listNativeV2LessonIds } from '../content/registry';
import { moduleDisplayTitle } from '../lib/modulePresentation';
import './curriculum/curriculum.css';
import './course-catalog.css';

const byId = new Map(catalogData.main.map(item => [item.id, item]));
const interactiveIds = new Set([...lessons.map(lesson => lesson.id), ...listNativeV2LessonIds()]);
const publishedCourses = productData.courses.filter(course => publication.publishedCourseIds.includes(course.id));
const publishedTrails = productData.trails.filter(trail => publication.publishedTrailIds.includes(trail.id));
const lessonCount = (modules: Array<{start:number;end:number}>) => modules.reduce((total, module) => total + module.end - module.start + 1, 0);

export default function CourseCatalog({courseId}:{courseId?:string}) {
  const course = publishedCourses.find(item => item.id === courseId);
  if (courseId && !course) return <div className="page curriculum-page stack-lg">
    <header className="curriculum-hero"><span className="eyebrow">CATÁLOGO DE CURSOS</span><h1>Curso indisponível</h1><p>Este curso ainda não foi publicado ou não está no catálogo atual.</p></header>
    <a href="#courses" className="curriculum-back-link">← Ver cursos publicados</a>
  </div>;
  return <div className="page curriculum-page stack-lg">
    <header className="curriculum-hero curriculum-modules-hero">
      <div>
        <span className="eyebrow">ARTISYS ACADEMY · CATÁLOGO</span>
        <h1>{course ? course.title : 'Escolha seu curso'}</h1>
        <p>{course ? course.description : 'Cursos independentes, organizados por módulos, aulas e práticas. Somente conteúdos com A editorial entram na vitrine.'}</p>
      </div>
      {course && <a href="#courses" className="curriculum-back-link">← Voltar aos cursos</a>}
    </header>
    {!course ? <>
      <div className="curriculum-module-count">{publishedCourses.length} cursos de cibersegurança · {publishedTrails.length} trilhas práticas com IA</div>
      <section className="curriculum-module-grid" aria-label="Cursos disponíveis">
        {publishedCourses.map((item, index) => <a href={'#courses/' + item.id} className="curriculum-module-card" key={item.id}>
          <div className="curriculum-module-top"><span className="curriculum-module-index">{String(index+1).padStart(2,'0')}</span><span className="curriculum-module-arrow" aria-hidden="true">↗</span></div>
          <h2>{item.title}</h2><p className="course-card-description">{item.description}</p>
          <div className="curriculum-module-footer"><strong>{item.modules.length} módulos · {lessonCount(item.modules)} aulas</strong></div>
        </a>)}
        {publishedTrails.map(trail => <a href={trail.route} className="curriculum-module-card" key={trail.id}>
          <div className="curriculum-module-top"><span className="curriculum-module-index">IA</span><span className="curriculum-module-arrow" aria-hidden="true">↗</span></div>
          <h2>{trail.title}</h2><p className="course-card-description">{trail.description}</p>
          <div className="curriculum-module-footer"><strong>8 módulos práticos</strong></div>
        </a>)}
      </section>
    </> : <>
      <div className="curriculum-module-count">{course.modules.length} módulos · {lessonCount(course.modules)} aulas</div>
      <section className="course-module-list" aria-label={'Módulos de ' + course.title}>
        {course.modules.map((module, index) => <details key={module.title} className="course-module-details" open={index === 0}>
          <summary><span>Módulo {String(index+1).padStart(2,'0')} · {module.title}</span><small>{module.end - module.start + 1} aulas</small></summary>
          <div className="course-module-units">
            {Array.from({length:module.end-module.start+1}, (_, i) => byId.get(module.start + i)).filter(item => item !== undefined).map(item => <a className="curriculum-row" key={item.id} href={interactiveIds.has(item.id) ? '#lesson/' + item.id : '#course/main/' + item.id}>
              <span className="curriculum-code">{String(item.id).padStart(3,'0')}</span>
              <div className="curriculum-row-body"><strong>{item.title}</strong><small>{moduleDisplayTitle(item.block)}</small></div>
              <span className="curriculum-module-arrow" aria-hidden="true">↗</span>
            </a>)}
          </div>
        </details>)}
      </section>
    </>}
  </div>;
}
