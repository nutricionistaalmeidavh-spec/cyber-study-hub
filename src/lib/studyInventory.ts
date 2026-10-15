import catalogData from '../curriculum/catalog.json';
import type {CurriculumCatalog} from '../curriculum/types';
const catalog=catalogData as CurriculumCatalog;
/** 607 IDs canônicos. Referências são etapas rastreáveis, mas não aulas novas. */
export function calculateStudyInventory(source: CurriculumCatalog) {
 const main=source.main.length,parallel=source.parallel.length;
 const ai=source.guided.filter(x=>x.source==='ai-dev').length;
 const channel=source.guided.filter(x=>x.source==='channel-dark').length;
 return {main,parallel,legacyCanonical:main+parallel,ai,channel,
  guided:ai+channel,referenceSteps:source.guided.filter(x=>x.stepType==='referencia').length,
  canonical:main+parallel+ai+channel,totalSteps:main+parallel+ai+channel};
}
export const studyInventory=calculateStudyInventory(catalog);
