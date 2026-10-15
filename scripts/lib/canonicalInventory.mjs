import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
/** Inventário global: IDs canônicos são únicos; revisões A de módulo NÃO promovem cada etapa. */
export function buildCanonicalInventory(catalog,aiManifest,channelManifest,registry,aiReviews,channelReviews,reverseManifest,reverseReviews){
 const units=[...(catalog.main||[]),...(catalog.parallel||[]),...(catalog.guided||[])];
 const ids=new Set();
 const report=units.map(unit=>{
  const id=unit.code || ('AULA-'+String(unit.id).padStart(3,'0'));
  assert.ok(!ids.has(id),'ID duplicado: '+id);ids.add(id);
  if(unit.kind==='guided'){
   assert.match(id, /^(?:DEV-IA|CANAL-IA|REV-IA)-\d{3}$/);
   assert.ok(unit.href?.startsWith('#'+unit.source),'Rota da etapa inválida: '+id);
   const man=unit.source==='ai-dev'?aiManifest:unit.source==='channel-dark'?channelManifest:reverseManifest;
   const review=unit.source==='ai-dev'?aiReviews:unit.source==='channel-dark'?channelReviews:reverseReviews;
   const mod=man.modules.find(x=>x.id===unit.moduleId);
   assert.ok(mod?.status==='available','Etapa sem módulo publicado: '+id);
   assert.equal(mod.steps.find(x=>x.id===unit.stepId)?.type,unit.stepType,'Tipo divergente: '+id);
   const moduleReview=review.modules[String(unit.moduleId).padStart(2,'0')];
   assert.ok(moduleReview,'Sem origem de avaliação de módulo: '+id);
   if(unit.stepType==='referencia')assert.ok(unit.referencePath?.startsWith('#')||unit.referencePath?.startsWith('https://'));
   return {id,kind:'guided',title:unit.title,source:unit.source,href:unit.href,stepId:unit.stepId,moduleId:unit.moduleId,
     stepType:unit.stepType,aliasOf:unit.aliasOf||null,grade:null,
     gradeStatus:'ungraded_individual_step',moduleEditorialGrade:moduleReview.grade||null,
     reviewSource:'quality/trails/'+unit.source+'/reviews.json',
     progressKey:id};
  }
  assert.ok(unit.contentPath?.startsWith('/course-library/'),id+' sem conteúdo canônico');
  const review=registry.editorialReviews?.[id];
  return {id,kind:unit.kind,title:unit.title,source:'canonical-curriculum',href:unit.kind==='main'?'#course/main/'+unit.id:'#course/parallel/'+unit.code,
    contentPath:unit.contentPath,grade:review?.grade??null,gradeStatus:review?'editorial_unit_review':'pending_editorial_review',
    moduleEditorialGrade:null,reviewSource:review?'quality/registry.json':null,progressKey:id};
 });
 const counts={main:catalog.main.length,parallel:catalog.parallel.length,
  ai:catalog.guided.filter(x=>x.source==='ai-dev').length,
  channel:catalog.guided.filter(x=>x.source==='channel-dark').length,
  reverse:catalog.guided.filter(x=>x.source==='reverse-ai').length,
  references:catalog.guided.filter(x=>x.stepType==='referencia').length,all:report.length};
 assert.deepEqual([counts.main,counts.parallel,counts.ai,counts.channel,counts.reverse,counts.references,counts.all],[218,325,32,32,32,24,639]);
 assert.equal(new Set(report.map(x=>x.progressKey)).size,639);
 return {schemaVersion:2,provenance:'src/curriculum/catalog.json',unitOfCount:'identidades canônicas; incluem etapas de referência',
  methodology:'As etapas das trilhas têm identidade/progresso próprios. Avaliações A dos módulos são apresentadas apenas como nota editorial do módulo, não como nota A automática por etapa.',
  summary:counts,records:report};
}
export function canonicalCsv(report){
 const keys=['id','kind','source','title','href','stepId','moduleId','stepType','aliasOf','grade','gradeStatus','moduleEditorialGrade','reviewSource','progressKey'];
 const cell=value=>'"'+String(value??'').replace(/"/g,'""').replace(/^([=+@-])/,"'$1")+'"';
 return [keys.join(','),...report.records.map(record=>keys.map(k=>cell(record[k])).join(','))].join('\n')+'\n';
}
