import {useEffect,useMemo,useState} from 'react';
import manifest from './manifest.json';
import learning from './modules.json';
import '../ai-dev/ai-dev.css';
import {getStudyDraft,saveStudyVisit,syncCanonicalGuidedProgress} from '../../lib/studyProgress';
import {guidedCanonicalId} from '../../lib/guidedIdentity';
import {GuidedPracticeOrientation} from '../../components/practice/GuidedPracticeOrientation';
import ProgressSyncStatus from '../../components/ProgressSyncStatus';

type Section={heading:string;body:string;example?:string;counterexample?:string};
type Challenge={question:string;options:string[];answer:number;feedback:string};
type Step={stepId:number;kind:'microaula'|'microaula-ia'|'referencia'|'laboratorio';title:string;lead:string;durationMin:number;
 sections?:Section[];challenge?:Challenge;reviewQuestions?:string[];prompt?:string;referenceCode?:string;referencePath?:string;challengeText?:string;
 brief?:string[];acceptance?:string[];assessmentPrompt?:string;starterSourceUrl?:string;labCommand?:string;testCommand?:string;expectedArtifact?:string;checkpointAssertion?:string};
type Module={moduleId:number;title:string;objective:string;learningOutcomes:string[];lessons:Step[];assessmentPath:string;answerKeyPath:string};
type Progress={moduleId:number;stepIndex:number;completed:number[];notes:Record<number,string>;checks:Record<number,number[]>;answers:Record<number,number|null>};
const modules=(learning as {modules:Module[]}).modules;
const initialProgress=():Progress=>({moduleId:1,stepIndex:0,completed:[],notes:{},checks:{},answers:{}});
function restore(userId:string):Progress{
 let data:unknown;
 try{data=JSON.parse(localStorage.getItem('hub-reverse-ai-learning-v1:'+userId)||'null');}catch{data=null}
 if(!data||typeof data!=='object'||Array.isArray(data)){
  const accountDraft=getStudyDraft('reverse-ai');
  data=accountDraft&&typeof accountDraft==='object'&&!Array.isArray(accountDraft)?accountDraft:null;
 }
 const input=data as Partial<Progress>|null,empty=initialProgress();
 if(!input)return empty;
 return {moduleId:Number.isInteger(input.moduleId)?input.moduleId!:1,stepIndex:Number.isInteger(input.stepIndex)?input.stepIndex!:0,
  completed:Array.isArray(input.completed)?input.completed.filter(x=>Number.isInteger(x)&&x>=1&&x<=32):[],
  notes:input.notes&&typeof input.notes==='object'?input.notes:{},
  checks:input.checks&&typeof input.checks==='object'?input.checks:{},
  answers:input.answers&&typeof input.answers==='object'?input.answers:{}};
}
function routePosition(progress:Progress){
 const params=new URLSearchParams(window.location.hash.split('?')[1]||'');
 const moduleId=Number(params.get('module')??progress.moduleId);
 const module=modules.find(x=>x.moduleId===moduleId)||modules[0];
 const stepIndex=Number(params.get('step')??progress.stepIndex);
 return {moduleId:module.moduleId,stepIndex:Number.isInteger(stepIndex)&&stepIndex>=0&&stepIndex<4?stepIndex:0};
}
export default function ReverseAiTrail({userId}:{userId:string}){
 const [progress,setProgress]=useState<Progress>(()=>restore(userId));
 const [position,setPosition]=useState(()=>routePosition(progress));
 const [saveError,setSaveError]=useState('');
 const [answerChecked,setAnswerChecked]=useState(false);
 const module=modules.find(x=>x.moduleId===position.moduleId)||modules[0];
 const step=module.lessons[position.stepIndex]||module.lessons[0];
 const notes=progress.notes[step.stepId]||'';
 const checks=progress.checks[step.stepId]||[];
 const answer=progress.answers[step.stepId]??null;
 const completed=progress.completed.includes(step.stepId);
 const completion=useMemo(()=>new Set(progress.completed).size,[progress.completed]);
 useEffect(()=>{
  const snapshot={...progress,moduleId:position.moduleId,stepIndex:position.stepIndex};
  try{
   localStorage.setItem('hub-reverse-ai-learning-v1:'+userId,JSON.stringify(snapshot));
   saveStudyVisit('reverse-ai',{title:step.title,href:'#reverse-ai?module='+position.moduleId+'&step='+position.stepIndex,kind:'ai',sectionLabel:module.title},snapshot);
   syncCanonicalGuidedProgress('reverse-ai',step.stepId,{completed:snapshot.completed,notes:snapshot.notes,checked:snapshot.checks});
   setSaveError('');
  }catch{setSaveError('Não foi possível salvar o progresso. Confira o armazenamento da sua conta.');}
 },[userId,progress,position.moduleId,position.stepIndex,step.stepId,step.title,module.title]);
 function choose(moduleId:number,stepIndex:number){
  const target=modules.find(x=>x.moduleId===moduleId);
  if(!target||stepIndex<0||stepIndex>=target.lessons.length)return;
  setPosition({moduleId,stepIndex});setAnswerChecked(false);
  window.history.replaceState(null,'','#reverse-ai?module='+moduleId+'&step='+stepIndex);
 }
 function setNotes(value:string){setProgress(x=>({...x,notes:{...x.notes,[step.stepId]:value.slice(0,5000)}}));}
 function setAnswer(value:number){setAnswerChecked(false);setProgress(x=>({...x,answers:{...x.answers,[step.stepId]:value}}));}
 function toggleCheck(i:number){setProgress(x=>{const old=x.checks[step.stepId]||[];return {...x,checks:{...x.checks,[step.stepId]:old.includes(i)?old.filter(j=>j!==i):[...old,i]}}});}
 const valid=step.kind==='microaula'?(answer===step.challenge?.answer&&answerChecked):
  step.kind==='laboratorio'?(notes.trim().length>=120&&checks.length===(step.acceptance?.length||5)):
  notes.trim().length>=120;
 function advance(){
  if(!completed&&!valid)return;
  if(!completed)setProgress(x=>({...x,completed:[...new Set([...x.completed,step.stepId])]}));
  if(position.stepIndex<3)choose(position.moduleId,position.stepIndex+1);
  else if(position.moduleId<modules.length)choose(position.moduleId+1,0);
 }
 return <div className="page ai-track">
  <header className="ai-hero">
   <div><span className="eyebrow">FORMAÇÃO PRÁTICA · ENGENHARIA REVERSA COM IA</span>
    <h1>{manifest.title}</h1><p>{manifest.subtitle}</p>
    <div className="ai-pills"><span>8 módulos</span><span>32 etapas canônicas</span><span>Laboratórios locais R$ 0</span><span>REA e IA opcionais</span></div>
   </div>
   <div className="ai-meter"><strong>{completion}/32</strong><span>etapas registradas</span><div className="progress"><i style={{width:completion/32*100+'%'}}/></div></div>
  </header>
  <p className="ai-disclaimer">Programa próprio ou autorizado somente. Agentes e Ghidra não são executados automaticamente pelo site. Nota de módulo e conclusão autodeclarada não equivalem a certificação ou validação do seu código.</p>
  <ProgressSyncStatus/>
  <section className="ai-roadmap" aria-label="Módulos da trilha">
   {modules.map(m=><button type="button" key={m.moduleId} className={'ai-module available '+(m.moduleId===position.moduleId?'selected':'')} aria-pressed={m.moduleId===position.moduleId} onClick={()=>choose(m.moduleId,0)}>
    <span className="ai-module-number">{String(m.moduleId).padStart(2,'0')}</span>
    <span className="ai-module-label"><strong>{m.title}</strong><small>{m.lessons.filter(x=>progress.completed.includes(x.stepId)).length}/4 etapas · {m.objective}</small></span>
    <span className="ai-status">Abrir</span>
   </button>)}
  </section>
  <div className="ai-section-heading"><span className="eyebrow">MÓDULO {String(module.moduleId).padStart(2,'0')} · {module.title}</span>
   <h2>Da hipótese à evidência</h2><p>{module.objective}</p></div>
  <div className="ai-learning-layout">
   <nav className="ai-steps" aria-label="Etapas do módulo">
    {module.lessons.map((item,i)=><button type="button" key={item.stepId} className={'ai-step '+(i===position.stepIndex?'selected ':'')+(progress.completed.includes(item.stepId)?'completed':'')} aria-current={i===position.stepIndex?'step':undefined} onClick={()=>choose(module.moduleId,i)}>
     <span>{String(i+1).padStart(2,'0')}</span><span className="ai-step-label"><strong>{item.title}</strong><small>{guidedCanonicalId('reverse-ai',item.stepId)} · {item.durationMin} min · {progress.completed.includes(item.stepId)?'Registrada':'Disponível'}</small></span>
    </button>)}
   </nav>
   <article className="ai-lesson panel" aria-labelledby="reverse-ai-lesson-title">
    <div className="ai-lesson-top"><span className="eyebrow">{guidedCanonicalId('reverse-ai',step.stepId)} · ETAPA {step.stepId}/32</span><span>{step.durationMin} min</span></div>
    <h2 id="reverse-ai-lesson-title">{step.title}</h2><p className="ai-lead">{step.lead}</p>
    <GuidedPracticeOrientation code={guidedCanonicalId('reverse-ai',step.stepId)} source="reverse-ai" step={step}/>
    {step.sections?.map((section,i)=><section className="ai-reading" key={i}><h3>{section.heading}</h3><p>{section.body}</p>
     {section.example&&<div className="ai-example"><strong>Exemplo</strong><p>{section.example}</p></div>}
     {section.counterexample&&<div className="ai-counter"><strong>Contraexemplo</strong><p>{section.counterexample}</p></div>}
    </section>)}
    {step.challenge&&<section className="ai-exercise"><h3>{step.challenge.question}</h3>
     {step.challenge.options.map((option,i)=><label className="ai-answer" key={option}><input type="radio" name={'rev-q-'+step.stepId} checked={answer===i} onChange={()=>setAnswer(i)}/><span>{option}</span></label>)}
     <button type="button" className="button ghost" onClick={()=>setAnswerChecked(true)} disabled={answer===null}>Conferir resposta</button>
     {answerChecked&&<p role="status" className={answer===step.challenge.answer?'ai-success':'ai-warning'}>{answer===step.challenge.answer?step.challenge.feedback:'Releia o conceito e teste um contraexemplo antes de avançar.'}</p>}
    </section>}
    {step.prompt&&<section className="ai-exercise"><h3>Assistência crítica de IA (opcional)</h3><p>Use localmente ou responda por conta própria. Nunca envie dados confidenciais.</p>
     <textarea className="ai-prompt" rows={8} readOnly aria-label="Prompt de investigação" value={step.prompt}/>
     <h3>Perguntas para revisão</h3><ol>{step.reviewQuestions?.map(x=><li key={x}>{x}</li>)}</ol></section>}
    {step.referencePath&&<section className="ai-exercise"><h3>Estudo da fonte canônica</h3><p>{step.challengeText}</p><a className="button ghost" href={step.referencePath}>Abrir {step.referenceCode} →</a></section>}
    {step.kind==='laboratorio'&&<section className="ai-exercise"><h3>Laboratório executável · dados fictícios</h3><p>{step.expectedArtifact}</p>
     <ol>{step.brief?.map(x=><li key={x}>{x}</li>)}</ol>
     <p>Comando local:</p><pre className="ai-prompt">{step.labCommand}{'\n'}{step.testCommand}</pre>
     <div className="ai-actions"><a className="button primary" href={step.starterSourceUrl} target="_blank" rel="noopener noreferrer">Abrir arquivos e roteiro ↗</a>
      <a className="button ghost" href={module.assessmentPath} target="_blank" rel="noopener noreferrer">Avaliação independente ↗</a></div>
     <h3>Critérios de aceitação (autodeclaração)</h3>
     {step.acceptance?.map((x,i)=><label key={x} className="ai-check"><input type="checkbox" checked={checks.includes(i)} onChange={()=>toggleCheck(i)}/><span>{x}</span></label>)}
     <p className="ai-privacy">Marcar os critérios não comprova execução do código. Faça os testes no seu computador e guarde as evidências.</p>
    </section>}
    {step.kind!=='microaula'&&<section className="ai-exercise">
     <label className="ai-field-label" htmlFor="reverse-notes">Registro: hipótese, teste, resultado, divergência e limites (mínimo 120 caracteres)</label>
     <textarea id="reverse-notes" className="ai-notes" rows={6} maxLength={5000} value={notes} onChange={event=>setNotes(event.target.value)} placeholder="Descreva sua própria investigação, sem colar gabarito..."/>
     <small>{notes.trim().length}/120 caracteres mínimos · anotação privada da sua conta</small>
    </section>}
    {saveError&&<p className="ai-warning" role="alert">{saveError}</p>}
    <footer className="ai-lesson-footer"><p>{completed?'Registrada no progresso canônico.':'Conclua os critérios da etapa para habilitar o avanço.'}</p>
     <button type="button" className="button primary" disabled={!completed&&!valid} onClick={advance}>{completed?'Próxima etapa':'Registrar e avançar'} →</button>
    </footer>
   </article>
  </div>
 </div>;
}
