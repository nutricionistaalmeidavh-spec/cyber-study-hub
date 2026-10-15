import './practice.css';

type GuidedStep = {
 kind:string; title:string; expectedArtifact?:string; brief?:string[];
};
type LabContract = { kind:string; deliverable:string };
/**
 * A unidade canônica já informa título e ID. Nas microaulas e referências não
 * existe um segundo card repetindo a aula. Nos laboratórios, apenas um atalho
 * ao roteiro real, com entrega específica em vez de texto genérico.
 */
export function GuidedPracticeOrientation({
 code,source,step,labContract
}:{
 code:string; source:'ai-dev'|'channel-dark'; step:GuidedStep;labContract?:LabContract
}){
 if(step.kind!=='laboratorio')return null;
 const specification=labContract?.kind==='Especificação';
 const label=specification?'Especificação prática':'Projeto incremental';
 const deliverable=labContract?.deliverable||step.expectedArtifact||
  step.brief?.at(-1)||'Código ou documentação, teste e evidência da etapa.';
 const anchor='laboratorio-'+code;
 return <aside className="guided-practice-contract" aria-label={'Próximo passo de '+code}>
  <div className="guided-practice-copy">
   <span className="guided-practice-eyebrow">{label} · {code}</span>
   <p><strong>Entrega:</strong> {deliverable}</p>
  </div>
  <a className="guided-practice-jump" href={'#'+anchor}>Ver atividade e arquivos <span aria-hidden="true">↓</span></a>
 </aside>;
}
