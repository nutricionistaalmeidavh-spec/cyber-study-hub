import catalogData from '../curriculum/catalog.json';
import type {GuidedCurriculumItem} from '../curriculum/types';
const guided=(catalogData.guided as GuidedCurriculumItem[]);
const byTrailStep=new Map(guided.map(x=>[x.source+':'+x.stepId,x]));
const byId=new Map(guided.map(x=>[x.code,x]));
/** Nunca derive IDs por posição do array na UI; use o catálogo publicado. */
export function guidedCanonicalId(source:'ai-dev'|'channel-dark'|'reverse-ai',stepId:number):string{
 const item=byTrailStep.get(source+':'+stepId);
 if(!item)throw Error('Etapa sem identidade canônica: '+source+'/'+stepId);
 return item.code;
}
export function guidedCanonicalItem(code:string){return byId.get(code);}
export function guidedItems(source:'ai-dev'|'channel-dark'|'reverse-ai'){return guided.filter(x=>x.source===source);}
