import { useMemo, useState } from 'react';
import { courses, publishedCourses, mainLessonsByCode, parallelLessonsByCode, guidedLessonsByCode } from '../../curriculum/courseOfferings';
import type { CourseOffering } from '../../curriculum/courseOfferings';
import './course-catalog.css';
import ArtisysPurchase from './ArtisysPurchase';

const normalize=(text:string)=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
function label(course:CourseOffering){
 return course.type==='trail'?'Trilha prática':course.type==='parallel'?'Formação paralela':'Curso de cibersegurança';
}
function courseMinutes(course:CourseOffering){
 return course.modules.flatMap(m=>m.lessonCodes).reduce((total,code)=>total+(mainLessonsByCode.get(code)?.durationMin||guidedLessonsByCode.get(code)?.durationMin||0),0);
}
function totalLessons(course:CourseOffering){
 return course.modules.reduce((total,module)=>total+module.lessonCodes.length,0);
}
export default function CourseCatalog({courseId,admin=false,userEmail}:{courseId?:string;admin?:boolean;userEmail?:string}) {
 const [query,setQuery]=useState('');
 const available=admin?courses:publishedCourses;
 const selected=available.find(course=>course.id===courseId);
 const filtered=useMemo(()=>available.filter(course=>normalize(course.title+' '+course.description).includes(normalize(query))),[available,query]);
 if(courseId&&!selected)return <section className="page course-catalog"><div className="course-empty">
  <span className="eyebrow">CURSO INDISPONÍVEL</span><h1>Este curso ainda não foi publicado.</h1>
  <p>Novas formações aparecem no catálogo somente quando o conteúdo está completo e aprovado editorialmente.</p>
  <a className="button primary" href="#courses">Ver cursos disponíveis</a>
 </div></section>;
 return <div className="page course-catalog stack-lg">
  <header className="course-catalog-header">
   <div><span className="eyebrow">{selected?'SEU CURSO':'CATÁLOGO DE CURSOS'}</span>
    <h1>{selected?selected.title:'Escolha o curso que quer fazer'}</h1>
    <p>{selected?selected.description:'Cada formação tem módulos próprios, aulas e laboratórios. Escolha um tema e avance no seu ritmo.'}</p></div>
   {selected?<a className="course-back" href="#courses">← Voltar aos cursos</a>:<span className="course-count">{publishedCourses.length} cursos publicados</span>}
  </header>
  {!selected?<>
    <label className="course-search-label" htmlFor="course-search">Buscar por assunto</label>
    <input className="search" id="course-search" type="search" placeholder="Ex.: IA, pentest, redes, engenharia reversa…" value={query} onChange={e=>setQuery(e.target.value)}/>
    <div className="course-grid">{filtered.map(course=><a className="course-tile" key={course.id} href={'#courses/'+course.id}>
      <span className="course-kind">{label(course)}</span><h2>{course.title}</h2><p>{course.description}</p>
      <div className="course-tile-bottom"><span>{course.modules.length} módulos{course.type==='trail'?' · projeto guiado':''}</span><strong>{course.status==='draft'?'Em preparação':'Conhecer curso →'}</strong></div>
    </a>)}</div>
    {filtered.length===0&&<div className="course-empty"><h2>Nenhum curso encontrado.</h2><button type="button" className="button ghost" onClick={()=>setQuery('')}>Limpar busca</button></div>}
   </>:<>
    {selected.status==='draft'&&<p className="course-draft-note">Prévia administrativa: este curso ainda não é exibido no catálogo público.</p>}
    {selected.status==='published'&&<ArtisysPurchase courseId={selected.id} email={userEmail} />}
    <section className="course-overview"><div><span className="eyebrow">ESTRUTURA DO CURSO</span>
      <h2>{selected.modules.length} módulos</h2>
      <p>{selected.type==='trail'?totalLessons(selected)+' etapas práticas guiadas':totalLessons(selected)+' aulas canônicas'}{courseMinutes(selected)>0?' · cerca de '+Math.round(courseMinutes(selected)/60)+' horas':''}</p>
    </div>{selected.type==='trail'&&selected.href&&<a className="button primary" href={selected.href}>Abrir trilha completa →</a>}</section>
    <div className="course-module-stack">{selected.modules.map((module,index)=><section className="course-module" key={module.id}>
      <div className="course-module-top"><span className="course-module-index">M{String(index+1).padStart(2,'0')}</span>
       <div><h2>{module.title}</h2><p>{module.lessonCodes.length?module.lessonCodes.length+(selected.type==='trail'?' etapas':' aulas'):'Atividades, referências e laboratório'}</p></div>
       {selected.type==='trail'&&selected.href&&<a href={selected.href} aria-label={'Abrir '+module.title}>Abrir trilha ↗</a>}
      </div>
      {module.lessonCodes.length>0&&<ol className="course-lesson-list">{module.lessonCodes.map((code,i)=>{
        const main=mainLessonsByCode.get(code),parallel=parallelLessonsByCode.get(code),guided=guidedLessonsByCode.get(code);
        if(!main&&!parallel&&!guided)return null;
        return <li key={code}><a href={main?'#course/main/'+main.id:guided?guided.href:'#course/parallel/'+encodeURIComponent(code)}>
         <span>{String(i+1).padStart(2,'0')}</span><span>{main?.title??parallel?.title??guided?.title}</span><small>{(main?.durationMin??guided?.durationMin)?(main?.durationMin??guided?.durationMin)+' min':''}</small><b aria-hidden="true">→</b>
        </a></li>;
      })}</ol>}
    </section>)}</div>
   </>}
 </div>;
}
