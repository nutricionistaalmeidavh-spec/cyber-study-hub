import catalogData from '../curriculum/catalog.json';
import type {CurriculumCatalog} from '../curriculum/types';
const catalog=catalogData as CurriculumCatalog;
/** IDs canônicos calculados do catálogo. Referências são etapas rastreáveis, não novas aulas. */
export function calculateStudyInventory(source: CurriculumCatalog) {
 const main=source.main.length,parallel=source.parallel.length;
 const ai=source.guided.filter(x=>x.source==='ai-dev').length;
 const channel=source.guided.filter(x=>x.source==='channel-dark').length;
 const reverse=source.guided.filter(x=>x.source==='reverse-ai').length;
 return {main,parallel,legacyCanonical:main+parallel,ai,channel,reverse,
  guided:ai+channel+reverse,referenceSteps:source.guided.filter(x=>x.stepType==='referencia').length,
  canonical:main+parallel+ai+channel+reverse,totalSteps:main+parallel+ai+channel+reverse};
}
export const studyInventory=calculateStudyInventory(catalog);
