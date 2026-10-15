import {useEffect,useState} from 'react';
import {MarkdownDocument} from '../curriculum/CourseDocumentViewer';
import './practice.css';

/** P1: aula 043–100 exibe o Markdown integral da mesma fonte publicada no catálogo. */
export function CanonicalLessonContent({id}:{id:number}){
 const [markdown,setMarkdown]=useState(''),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  if(!Number.isInteger(id)||id<43||id>100)return;
  const controller=new AbortController();
  setError('');setMarkdown('');
  fetch('/course-library/main/'+String(id).padStart(3,'0')+'.md',{signal:controller.signal,cache:'force-cache'})
   .then(response=>{if(!response.ok)throw Error('HTTP '+response.status);return response.text();})
   .then(text=>{if(!controller.signal.aborted)setMarkdown(text);})
   .catch(err=>{if(!controller.signal.aborted)setError(String(err));});
  return ()=>controller.abort();
 },[id,attempt]);
 const path='/course-library/main/'+String(id).padStart(3,'0')+'.md';
 return <section id="conteudo-integral" className="canonical-full-lesson" aria-label="Conteúdo canônico integral da aula">
  <div className="canonical-full-lesson-heading">
   <span>CONTEÚDO CANÔNICO · AULA {String(id).padStart(3,'0')}</span>
   <h2>Apostila integral da aula</h2>
   <p>A fonte completa inclui teoria, procedimentos, exercícios e referências. As atividades interativas abaixo complementam essa fonte sem substituir seu conteúdo.</p>
   <a href={path} target="_blank" rel="noopener noreferrer">Abrir o Markdown integral ↗</a>
  </div>
  {error?<p role="alert">Não foi possível carregar o conteúdo integral ({error}). <button type="button" onClick={()=>setAttempt(n=>n+1)}>Tentar novamente</button></p>:
   markdown?<MarkdownDocument markdown={markdown}/>:<p role="status">Carregando o conteúdo integral…</p>}
 </section>;
}
