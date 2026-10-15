import {practiceFor,type PracticeTarget} from '../../lib/practiceContracts';
import './practice.css';

export function PracticeOrientation({target,objective,deliverable}:{target:PracticeTarget;objective?:string;deliverable?:string}){
 const p=practiceFor(target,objective,deliverable);
 return <section className="practice-contract" aria-label="Como funciona a prática desta aula">
  <div className="practice-contract-overline"><span>PRÁTICA · {target.kind==='main'?'AULA-'+String(target.id).padStart(3,'0'):target.code}</span><span>{p.kind}</span></div>
  <h2>{p.title}</h2>
  <dl><div><dt>O que você vai fazer</dt><dd>{p.purpose}</dd></div>
   <div><dt>Preparação</dt><dd>{p.preparation}</dd></div>
   <div><dt>O que entregar</dt><dd>{p.deliverable}</dd></div>
   <div><dt>Como verificar</dt><dd>{p.verification}</dd></div></dl>
  <div className="practice-contract-files"><strong>Arquivos e materiais reais</strong><div>{p.resources.map(x=>
   <a key={x.href} href={x.href} target="_blank" rel="noopener noreferrer">
    <span>{x.role==='base'?'Aula':x.role==='codigo'?'Código':x.role==='teste'?'Teste':'Guia'}</span>{x.label} ↗
   </a>)}</div></div>
  <p className="practice-contract-limit">{p.limits}</p>
 </section>;
}
