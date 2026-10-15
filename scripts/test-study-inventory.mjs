import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildCanonicalInventory,canonicalCsv} from './lib/canonicalInventory.mjs';
const read=p=>readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const c=json('src/curriculum/catalog.json'),ai=json('src/trails/ai-dev/manifest.json'),channel=json('src/trails/channel-dark/manifest.json');
const x=json('src/trails/ai-dev/modules.json'),y=json('src/trails/channel-dark/modules.json');
const reg=json('quality/registry.json');
const a=json('quality/trails/ai-dev/reviews.json'),b=json('quality/trails/channel-dark/reviews.json');
const report=()=>buildCanonicalInventory(c,ai,channel,reg,a,b);
test('607 IDs canônicos sem colisão, preservando 543 existentes',()=>{
 const r=report();
 assert.deepEqual(r.summary,{main:218,parallel:325,ai:32,channel:32,references:16,all:607});
 assert.equal(new Set(r.records.map(v=>v.id)).size,607);
 assert.equal(new Set(r.records.map(v=>v.progressKey)).size,607);
 assert.equal(c.main[0].code,'AULA-001');
 assert.equal(c.parallel.length,325);
 assert.equal(c.guided[0].code,'DEV-IA-001');
 assert.equal(c.guided[31].code,'DEV-IA-032');
 assert.equal(c.guided[32].code,'CANAL-IA-001');
 assert.equal(c.guided[63].code,'CANAL-IA-032');
});
test('64 referências e atividades possuem conteúdo, rotas e contratos de avaliação ligados ao módulo',()=>{
 for(const [source,manifest,modules] of [['ai-dev',ai,x],['channel-dark',channel,y]]){
  const list=c.guided.filter(v=>v.source===source);
  for(const entry of list){
   const m=modules.modules.find(v=>v.moduleId===entry.moduleId);
   const step=m?.lessons.find(v=>v.stepId===entry.stepId);
   assert.ok(step,'Etapa sem conteúdo: '+entry.code);
   assert.equal(entry.title,step.title);
   assert.equal(entry.stepType,step.kind);
   assert.equal(entry.durationMin,step.durationMin);
   assert.equal(entry.moduleTitle,m.title);
   assert.equal(entry.href,'#'+source+'?module='+entry.moduleId+'&step='+(m.lessons.findIndex(v=>v.stepId===entry.stepId)));
   if(entry.stepType==='referencia'){
    assert.equal(entry.referencePath,step.referencePath);
    if(source==='ai-dev')assert.equal(entry.aliasOf,step.referenceCode);
   }
  }
  assert.equal(list.length,32);
 }
 const r=report();
 assert.equal(r.records.filter(v=>v.kind==='guided'&&v.grade!==null).length,0,'A de módulo não equivale a A da aula individual');
 assert.equal(r.records.filter(v=>v.kind==='guided'&&v.moduleEditorialGrade==='A').length,64);
 assert.match(canonicalCsv(r),/CANAL-IA-032/);
});
test('migração dos snapshots legados e leitura da conclusão por ID estável preservam chaves da conta',()=>{
 const progress=read('src/lib/studyProgress.ts'),aiView=read('src/trails/ai-dev/AiDevelopmentTrail.tsx'),chanView=read('src/trails/channel-dark/ChannelAutomationTrail.tsx');
 assert.match(progress,/accountStorage\.setItem\(KEY,JSON\.stringify\(all\)\)/);
 assert.match(progress,/syncCanonicalGuidedProgress/);
 assert.match(progress,/progress\.completed/);
 assert.match(progress,/current\?\.completed\|\|completed/);
 assert.match(aiView,/saveStudyVisit\('ai-dev'/);
 assert.match(chanView,/saveStudyVisit\('channel-dark'/);
 assert.match(aiView,/syncCanonicalGuidedProgress\('ai-dev'/);
 assert.match(chanView,/syncCanonicalGuidedProgress\('channel-dark'/);
 assert.match(aiView,/guidedCanonicalId\('ai-dev'/);
 assert.match(chanView,/guidedCanonicalId\('channel-dark'/);
 assert.ok(read('src/lib/accountStorage.ts').includes("'cyber-study-learning-v2'"));
});
test('Dashboard e Academy exibem total atualizado a partir de catálogo completo, não número rígido',()=>{
 const inv=read('src/lib/studyInventory.ts'),home=read('src/components/Dashboard.tsx'),
 academy=read('src/components/AcademyLanding.tsx');
 assert.match(inv,/source\.guided/);
 assert.match(home,/studyInventory.totalSteps/);
 assert.match(academy,/studyInventory.totalSteps/);
 assert.match(academy,/studyInventory.canonical/);
 assert.match(academy,/studyInventory.legacyCanonical/);
 assert.doesNotMatch(home,/543 aulas/);
 assert.equal(read('scripts/quality-p0.mjs').includes('canonical-inventory.json'),true);
});
