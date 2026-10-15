import {labJourney,kitPaths,kitPublicFile,repoZipUrl} from './labJourneyData';
import './ai-lab-path.css';

type Contract={kind:string;deliverable:string;entrypoint:string;preflight:string;verify:string;evidence:string;optionalKits:string[]};
type Lesson={stepId:number;title:string;brief?:string[];acceptance?:string[]};
type Props={code:string;moduleId:number;moduleTitle:string;moduleObjective:string;lesson:Lesson;contract:Contract};

function Phase({number,title,children}:{number:number;title:string;children:React.ReactNode}){
 return <li className="ai-path-step">
  <span className="ai-path-number" aria-hidden="true">{number}</span>
  <div className="ai-path-step-content"><h4>{title}</h4>{children}</div>
 </li>;
}

/** Os cinco passos são explicados no próprio laboratório, não num card duplicado. */
export function AiLabLearningPath({code,moduleId,moduleTitle,moduleObjective,lesson,contract}:Props){
 const path=labJourney(moduleId);
 return <section className="ai-lab-path" aria-label={'Roteiro prático em cinco etapas de '+code}>
  <div className="ai-path-heading">
   <span className="ai-path-kicker">{code} · {contract.kind} · R$ 0 no núcleo</span>
   <h3>Seu laboratório, do início à validação</h3>
   <p>Você estuda no HubEstudos e executa o Meu Gestor no seu computador. Os cinco passos abaixo mostram exatamente o que usar, fazer e conferir.</p>
  </div>
  <ol className="ai-path-steps">
   <Phase number={1} title="Explicação — o que você vai construir">
    <p>{moduleTitle}: {moduleObjective}</p>
    <p><strong>Por que isso importa:</strong> {path.why}</p>
   </Phase>
   <Phase number={2} title="Arquivos prontos — comece pelo projeto correto">
    <p>{path.exerciseFocus}</p>
    <div className="ai-path-links">
     <a href={path.fileUrl} target="_blank" rel="noopener noreferrer">{path.fileLabel} ↗</a>
     <a href={path.projectUrl} target="_blank" rel="noopener noreferrer">{path.hasApp?'Ver pasta completa do checkpoint ↗':'Ver arquivos do projeto ↗'}</a>
     {path.hasApp&&<a href={repoZipUrl} target="_blank" rel="noopener noreferrer">Baixar ZIP do repositório completo ↗</a>}
    </div>
    {path.hasApp&&<small>O ZIP contém todo o HubEstudos; extraia apenas a pasta do checkpoint indicada no tutorial. Não é um instalador do Meu Gestor.</small>}
   </Phase>
   <Phase number={3} title="Tutorial — preparar e executar">
    <ul>{path.setup.map(x=><li key={x}>{x}</li>)}</ul>
    {path.hasApp&&<div className="ai-path-command"><span>Na pasta do checkpoint, em seu terminal</span>
     <pre><code>{path.run.join('\n')}</code></pre></div>}
    {!path.hasApp&&<ul>{path.run.map(x=><li key={x}>{x}</li>)}</ul>}
    <p className="ai-path-small">Não é necessário digitar comandos no site. Nenhum serviço pago ou API de IA é obrigatório.</p>
   </Phase>
   <Phase number={4} title="Laboratório — faça a integração ou alteração">
    <p><strong>Entrega:</strong> {contract.deliverable}</p>
    <p>{path.howTo}</p>
    <ol className="ai-path-tasks">{lesson.brief?.map((task,i)=><li key={i}>{task}</li>)}</ol>
    {moduleId===8&&<p>Depois do núcleo funcional, experimente os seis kits opcionais listados logo abaixo. Eles não bloqueiam a conclusão do curso.</p>}
   </Phase>
   <Phase number={5} title="Validação — comprove que funcionou">
    <p>{path.proof}</p>
    <p><strong>Como conferir:</strong> {contract.verify}</p>
    <p><strong>Registre:</strong> {contract.evidence}</p>
    <a className="ai-path-validation-link" href={'#criterios-'+code}>Ir aos critérios de aceitação ↓</a>
    <p className="ai-path-small">O Hub registra a autodeclaração; o teste do projeto precisa ser executado por você.</p>
   </Phase>
  </ol>
  {moduleId===8&&<div className="ai-path-kits" aria-label="Integrações opcionais no Meu Gestor">
   <div className="ai-path-kits-heading"><span className="ai-path-kicker">APLICAÇÃO NO MEU GESTOR v1.0</span>
    <h4>Seis módulos funcionais para experimentar</h4>
    <p>Acesse <strong>Extensões (kits)</strong> no Meu Gestor que roda em <code>127.0.0.1:4173</code>. Os exemplos abaixo indicam o que já funciona e o que ainda requer bibliotecas ou hardware.</p>
   </div>
   <div className="ai-kit-grid">
    {kitPaths.map((kit,i)=><details className="ai-kit-item" key={kit.id}>
     <summary><span className="ai-kit-index">{String(i+1).padStart(2,'0')}</span>
      <span className="ai-kit-title"><strong>{kit.title}</strong><small>{kit.status}</small></span>
      <span className="ai-kit-expand" aria-hidden="true">▾</span></summary>
     <div className="ai-kit-details"><ol>
      <li><strong>Explicação</strong><p>{kit.why}</p></li>
      <li><strong>Arquivos prontos</strong><p>{kit.fileLabel}</p><div className="ai-path-links"><a href={kitPublicFile(kit)} target="_blank" rel="noopener noreferrer">Abrir código ou documento ↗</a><a href={kit.link} target="_blank" rel="noopener noreferrer">Guia do kit ↗</a></div></li>
      <li><strong>Tutorial</strong><p>{kit.setup}</p></li>
      <li><strong>Laboratório</strong><p>{kit.howTo}</p></li>
      <li><strong>Validação</strong><p>{kit.proof}</p></li>
     </ol></div>
    </details>)}
   </div>
   <p className="ai-path-small">O PDF atual é uma página para imprimir; balança é simulada; financeiro é prévia. O scanner externo e os módulos privados não são incluídos automaticamente. Os laboratórios utilizam dados fictícios.</p>
  </div>}
 </section>;
}
