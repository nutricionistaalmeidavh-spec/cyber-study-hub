import {practiceFor,type PracticeTarget} from '../../lib/practiceContracts';
import catalogData from '../../curriculum/catalog.json';
import type {CurriculumCatalog} from '../../curriculum/types';
import './practice.css';
const catalog=catalogData as CurriculumCatalog;

/** Resumo recolhido por padrão: a aula integral continua sendo a fonte principal. */
export function PracticeOrientation({target,objective,deliverable}:{target:PracticeTarget;objective?:string;deliverable?:string}){
 const p=practiceFor(target,objective,deliverable);
 const code=target.kind==='main'?'AULA-'+String(target.id).padStart(3,'0'):target.code;
 return <details className="practice-contract" aria-label={'Orientação prática '+code}>
  <summary className="practice-contract-summary">
   <span className="practice-contract-summary-copy"><span className="practice-contract-eyebrow">{code} · {p.kind}</span>
    <strong>Orientação prática e arquivos</strong></span>
   <span className="practice-contract-summary-action">Ver detalhes <span aria-hidden="true">▾</span></span>
  </summary>
  <div className="practice-contract-body">
   <p className="practice-contract-purpose">{p.purpose}</p>
   <dl><div><dt>Preparação</dt><dd>{p.preparation}</dd></div>
    <div><dt>O que entregar</dt><dd>{p.deliverable}</dd></div>
    <div><dt>Como conferir</dt><dd>{p.verification}</dd></div></dl>
   <div className="practice-contract-files"><strong>Materiais desta aula</strong>
    <div>{p.resources.map(x=><a key={x.href} href={x.href} target="_blank" rel="noopener noreferrer">
     <span>{x.role==='base'?'Aula':x.role==='codigo'?'Código':x.role==='teste'?'Teste':'Guia'}</span>{x.label} ↗
    </a>)}</div></div>
   <p className="practice-contract-limit">{p.limits}</p>
  </div>
 </details>;
}
/** Mantém o ID canônico e nenhum estado de progresso paralelo. */
export function MainPracticeOrientation({id,objective,deliverable}:{id:number;objective?:string;deliverable?:string}){
 const item=catalog.main.find(x=>x.id===id);
 return item?<PracticeOrientation target={item} objective={objective} deliverable={deliverable}/>:null;
}
