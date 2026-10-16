import { useState } from 'react';
import { courses, publishedCourses, mainLessonsByCode, parallelLessonsByCode, guidedLessonsByCode } from '../../curriculum/courseOfferings';
import type { CourseOffering } from '../../curriculum/courseOfferings';
import { catalogType, courseSearchMatch } from '../../lib/courseDiscovery';
import { getStudyVisits } from '../../lib/studyProgress';
import { getLearningProgress, type LessonLearningProgress } from '../../lib/learningProgress';
import { getLessonState } from '../../lib/storage';
import { studySectionHref } from '../../lib/studyNavigation';
import './course-catalog.css';
import ArtisysPurchase from './ArtisysPurchase';

function label(course:CourseOffering){
 return course.type==='trail'?'Trilha prática':course.type==='parallel'?'Formação paralela':'Curso de cibersegurança';
}
function lesson(code:string) {
 const main=mainLessonsByCode.get(code), parallel=parallelLessonsByCode.get(code), guided=guidedLessonsByCode.get(code);
 return {code,title:main?.title??parallel?.title??guided?.title??code,
  key:main?String(main.id):guided?code:'parallel:'+code,
  href:main?'#course/main/'+main.id:guided?guided.href:'#course/parallel/'+encodeURIComponent(code),
  duration:main?.durationMin??guided?.durationMin??0,mainId:main?.id};
}
function courseMinutes(course:CourseOffering){
 return course.modules.flatMap(m=>m.lessonCodes).reduce((total,code)=>total+lesson(code).duration,0);
}
function totalLessons(course:CourseOffering){
 return course.modules.reduce((total,module)=>total+module.lessonCodes.length,0);
}
export default function CourseCatalog({courseId,courseType,admin=false,userEmail}:{courseId?:string;courseType?:string;admin?:boolean;userEmail?:string}) {
 const [query,setQuery]=useState('');
 const available=admin?courses:publishedCourses;
 const selected=available.find(course=>course.id===courseId);
 const type=catalogType(courseType);
 const filtered=available.flatMap(course=>{
  if(type&&course.type!==type)return [];
  const match=courseSearchMatch(course,query,code=>lesson(code).title);
  return match?[{course,match}]:[];
 });
 const visits=getStudyVisits();
 const visitsByKey=new Map(visits.map(visit=>[visit.key,visit]));
 const learning=getLearningProgress() as Record<string,LessonLearningProgress|undefined>;
 const legacy=getLessonState();
 const stateFor=(code:string)=>{
  const item=lesson(code), visit=visitsByKey.get(item.key);
  return learning[item.key]?.completed || (item.mainId&&legacy[item.mainId]?.completed) ? 'Concluída' : visit?.read ? 'Leitura registrada' : visit ? 'Em estudo' : '';
 };
 const units=selected?.modules.flatMap(module=>module.lessonCodes.map(lesson))??[];
 const latest=visits.find(visit=>units.some(unit=>unit.key===visit.key)&&!visit.read&&stateFor(units.find(unit=>unit.key===visit.key)!.code)!=='Concluída');
 const firstPending=units.find(unit=>!['Concluída','Leitura registrada'].includes(stateFor(unit.code)));
 const next=latest?units.find(unit=>unit.key===latest.key):firstPending??units[0];
 const nextHref=latest&&next?latest.sectionId?studySectionHref(latest.sectionId,latest.href):latest.href:next?.href;
 if(courseId&&!selected)return <section className="page course-catalog"><div className="course-empty">
  <h1>Este curso ainda não foi publicado.</h1>
  <p>Novas formações aparecem no catálogo somente quando o conteúdo está completo e aprovado editorialmente.</p>
  <a className="button primary" href="#courses">Ver cursos disponíveis</a>
 </div></section>;
 return <div className="page course-catalog stack-lg">
  <header className="course-catalog-header">
   <div><h1>{selected?selected.title:'Encontre seu próximo curso'}</h1>
    <p>{selected?selected.description:'Busque por tema, módulo ou aula. Escolha uma formação e avance no seu ritmo.'}</p></div>
   {selected?<a className="course-back" href="#courses">← Voltar aos cursos</a>:<span className="course-count">{publishedCourses.length} cursos publicados</span>}
  </header>
  {!selected?<>
    <section className="course-discovery" aria-label="Encontrar cursos">
     <label className="course-search-label" htmlFor="course-search">Buscar por assunto ou aula</label>
     <input className="search" id="course-search" type="search" placeholder="Ex.: IA, pentest, redes ou AULA-047" value={query} onChange={e=>setQuery(e.target.value)} aria-describedby="course-results"/>
     <nav className="course-type-filters" aria-label="Tipo de formação">
      {[{value:undefined,title:'Todos'},{value:'main',title:'Cibersegurança'},{value:'trail',title:'Trilhas práticas'},...(admin?[{value:'parallel',title:'Formações paralelas'}]:[])].map(filter=>
       <a key={filter.value??'all'} href={filter.value?'#courses?type='+filter.value:'#courses'} aria-current={type===filter.value?'page':undefined}>{filter.title}</a>)}
     </nav>
     <p id="course-results" className="course-results" role="status">{filtered.length} {filtered.length===1?'curso encontrado':'cursos encontrados'}{query.trim()?' para “'+query.trim()+'”':''}</p>
    </section>
    <div className="course-grid">{filtered.map(({course,match})=><a className="course-tile" key={course.id} href={'#courses/'+course.id}>
      <span className="course-kind">{label(course)}</span><h2>{course.title}</h2><p>{course.description}</p>
      {query.trim()&&match!==course.title&&<p className="course-match">Inclui: {match}</p>}
      <div className="course-tile-bottom"><span>{course.modules.length} módulos · {totalLessons(course)} {course.type==='trail'?'etapas':'aulas'}</span><strong>{course.status==='draft'?'Em preparação':'Ver curso →'}</strong></div>
    </a>)}</div>
    {filtered.length===0&&<div className="course-empty"><h2>Nenhum curso encontrado.</h2><p>Tente outro assunto ou remova os filtros para ver as formações disponíveis.</p>
     {query&&<button type="button" className="button ghost" onClick={()=>setQuery('')}>Limpar busca</button>}
     {type&&<a className="button ghost" href="#courses" onClick={()=>setQuery('')}>Ver todos os cursos</a>}
    </div>}
   </>:<>
    {selected.status==='draft'&&<p className="course-draft-note">Prévia administrativa: este curso ainda não é exibido no catálogo público.</p>}
    {selected.status==='published'&&<ArtisysPurchase courseId={selected.id} email={userEmail} />}
    <section className="course-overview" aria-label="Seu próximo passo no curso"><div>
      <h2>{latest?'Continue de onde parou':firstPending?'Comece ou retome seus estudos':'Revisite o conteúdo'}</h2>
      <p>{next?.title??'Explore os módulos deste curso.'}</p>
      <p className="course-structure">{selected.modules.length} módulos · {totalLessons(selected)} {selected.type==='trail'?'etapas práticas guiadas':'aulas'}{courseMinutes(selected)>0?' · cerca de '+Math.ceil(courseMinutes(selected)/60)+' horas':''}</p>
      <small>Leitura registrada e conclusão de atividades são estados diferentes.</small>
    </div>{nextHref&&<a className="button primary" href={nextHref}>{latest?'Continuar estudo':firstPending?'Abrir próxima aula':'Rever conteúdo'} →</a>}</section>
    <section aria-labelledby="course-outline-title"><h2 id="course-outline-title">Sumário do curso</h2><p className="course-outline-hint">Abra um módulo para ver suas aulas e o que já estudou.</p>
    <div className="course-module-stack">{selected.modules.map((module,index)=><details className="course-module" key={selected.id+module.id} open={index===0||Boolean(latest&&module.lessonCodes.some(code=>lesson(code).key===latest.key))}>
      <summary className="course-module-top"><span className="course-module-index">M{String(index+1).padStart(2,'0')}</span>
       <span className="course-module-heading"><strong>{module.title}</strong><small>{module.lessonCodes.length?module.lessonCodes.length+(selected.type==='trail'?' etapas':' aulas'):'Atividades, referências e laboratório'}</small></span>
       <span className="course-module-toggle" aria-hidden="true"><span className="course-module-open">Abrir</span><span className="course-module-close">Fechar</span></span>
      </summary>
      {module.lessonCodes.length>0&&<ol className="course-lesson-list">{module.lessonCodes.map((code,i)=>{
        const item=lesson(code),state=stateFor(code);
        return <li key={code}><a href={item.href}>
         <span>{String(i+1).padStart(2,'0')}</span><span className="course-lesson-name">{item.title}{state&&<small className="course-study-state">{state}</small>}</span><small className="course-duration">{item.duration?item.duration+' min':''}</small><b aria-hidden="true">→</b>
        </a></li>;
      })}</ol>}
    </details>)}</div></section>
   </>}
 </div>;
}
