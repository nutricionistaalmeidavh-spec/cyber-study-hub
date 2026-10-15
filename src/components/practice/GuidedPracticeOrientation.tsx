import './practice.css';

type GuidedStep={
 kind:string;title:string;referencePath?:string;starterSourceUrl?:string;
 labCommand?:string;testCommand?:string;expectedArtifact?:string;
 checkpointAssertion?:string;challengeText?:string;assessmentPrompt?:string;
 brief?:string[];
};
/** A mesma distinção pedagógica nas etapas canônicas das trilhas especiais. */
export function GuidedPracticeOrientation({code,source,step}:{code:string;source:'ai-dev'|'channel-dark'|'reverse-ai';step:GuidedStep}){
 const lab=step.kind==='laboratorio',ref=step.kind==='referencia',ai=step.kind==='microaula-ia';
 const kind=lab?'Projeto incremental':'Estudo aplicado';
 const purpose=lab?(source==='ai-dev'?'Evoluir seu Meu Gestor com código de um checkpoint real.':source==='reverse-ai'?'Investigar e reconstruir comportamento com evidências locais e software próprio.':'Construir a próxima etapa do canal piloto com os componentes gratuitos.'):
  ref?'Consultar a fonte indicada, interpretar um caso e demonstrar o aprendizado sem duplicar a aula original.':
  ai?'Produzir uma tentativa própria, revisar os erros da IA ou de um exemplo e justificar as correções.':
  'Compreender a regra, resolver a questão e explicar um contraexemplo.';
 const deliverable=lab?step.expectedArtifact||step.brief?.at(-1)||'Código, evidência da execução e teste com uma situação negativa.':
  ref?'Registro da análise da fonte e resposta própria de transferência.':
  ai?'Resposta revisada criticamente, com exemplos e limitações.':'Explicação e decisão verificadas no exercício.';
 const guide=lab?step.starterSourceUrl:ref?step.referencePath:undefined;
 return <section className="guided-practice-contract" aria-label="Contrato da etapa de estudo">
  <div className="practice-contract-overline"><span>{code} · NATUREZA DA ETAPA</span><span>{kind}</span></div>
  <dl><div><dt>O que fazer</dt><dd>{purpose}</dd></div>
   <div><dt>Entrega</dt><dd>{deliverable}</dd></div>
   <div><dt>Como conferir</dt><dd>{step.checkpointAssertion||step.assessmentPrompt||
    (lab?'Comprove um caso válido, um inválido e o reteste.':'Compare a decisão com os critérios da própria etapa.')}</dd></div>
   <div><dt>Ambiente</dt><dd>{lab?'Projeto local e dados fictícios; kits opcionais não são requisito.':'Aula acessível pelo navegador; IA externa é opcional.'}</dd></div></dl>
  {guide&&<div className="practice-contract-files"><strong>Fonte e arquivos indicados</strong><div>
   <a href={guide} target="_blank" rel="noopener noreferrer"><span>{ref?'Fonte':'Guia'}</span>Abrir recurso da etapa ↗</a>
   </div></div>}
  {lab&&step.labCommand&&<p className="guided-practice-command"><strong>Comando real do projeto:</strong> <code>{step.labCommand}</code></p>}
  {lab&&step.testCommand&&<p className="guided-practice-command"><strong>Teste:</strong> <code>{step.testCommand}</code></p>}
  <p className="practice-contract-limit">Registro de estudo não equivale a execução comprovada ou produto pronto. Repositórios privados e serviços pagos são opcionais e exigem permissão própria.</p>
 </section>;
}
