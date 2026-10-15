import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const text=p=>readFileSync(p,'utf8');
const load=p=>JSON.parse(text(p));
const catalog=load('src/curriculum/catalog.json');
const ai=load('src/trails/ai-dev/manifest.json');
const channel=load('src/trails/channel-dark/manifest.json');
const aiDetails=load('src/trails/ai-dev/modules.json');
const channelDetails=load('src/trails/channel-dark/modules.json');
const live = manifest => manifest.modules.filter(m=>m.status==='available').flatMap(m=>m.steps);
const a=live(ai),c=live(channel);
const total=catalog.main.length+catalog.parallel.length+a.length+c.length;
test('inventário incorpora as trilhas sem mudar os IDs canônicos',()=>{
 assert.equal(catalog.main.length,218);assert.equal(catalog.parallel.length,325);
 assert.equal(ai.modules.length,8);assert.equal(channel.modules.length,8);
 assert.equal(a.length,ai.totalSteps);assert.equal(c.length,channel.totalSteps);
 assert.equal(total,607);
 assert.equal(a.filter(s=>s.type==='referencia').length,8);
 assert.equal(c.filter(s=>s.type==='referencia').length,8);
 assert.equal(new Set(catalog.main.map(x=>x.id)).size,catalog.main.length);
 assert.equal(new Set(catalog.parallel.map(x=>x.code)).size,catalog.parallel.length);
});
test('manifestos refletem etapas de conteúdo efetivamente disponíveis',()=>{
 for(const [manifest,details] of [[ai,aiDetails],[channel,channelDetails]]){
   assert.equal(manifest.modules.length,details.modules.length);
   for(let i=0;i<manifest.modules.length;i++){
     const described=manifest.modules[i],actual=details.modules[i];
     assert.equal(described.id,actual.moduleId);
     assert.deepEqual(described.steps.map(s=>s.type),actual.lessons.map(s=>s.kind));
     assert.equal(described.steps.length,actual.lessons.length);
   }
 }
 assert.ok(aiDetails.modules.every(m=>m.lessons[2].referencePath.startsWith('#course/parallel/')));
 assert.ok(channelDetails.modules.every(m=>m.lessons[2].referencePath.startsWith('https://')));
});
test('plataforma exibe etapas sem prometer 607 aulas inéditas nem distorcer progresso',()=>{
 const inventory=text('src/lib/studyInventory.ts'),dashboard=text('src/components/Dashboard.tsx'),
 landing=text('src/components/AcademyLanding.tsx'),quality=text('scripts/quality-p0.mjs');
 assert.match(inventory,/manifest.modules/);
 assert.match(inventory,/totalSteps: main \+ parallel \+ aiSteps.length \+ channelSteps.length/);
 assert.match(dashboard,/studyInventory.totalSteps/);
 assert.match(dashboard,/studyInventory.referenceSteps/);
 assert.match(landing,/studyInventory.totalSteps/);
 assert.match(landing,/studyInventory.canonical/);
 assert.match(landing,/inclui referências/);
 assert.match(quality,/report.summary.total/);
 assert.doesNotMatch(dashboard,/543 aulas/);
});
