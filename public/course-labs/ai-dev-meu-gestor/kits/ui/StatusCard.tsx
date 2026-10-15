// Componente didático ORIGINAL; não copia código privado de frontEnds.
import type {ReactNode} from 'react';
export function StatusCard({title,value,description,icon}:{title:string;value:string|number;description?:string;icon?:ReactNode}){
 return <section aria-label={title} className="kit-status-card">
   <div className="kit-status-card-head">{icon&&<span aria-hidden="true">{icon}</span>}<h3>{title}</h3></div>
   <strong aria-live="polite">{value}</strong>
   {description&&<p>{description}</p>}
 </section>;
}
