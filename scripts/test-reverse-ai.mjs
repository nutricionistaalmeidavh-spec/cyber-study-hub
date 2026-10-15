import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
test('trilha de engenharia reversa possui 32 IDs imutáveis e sem colisões',()=>{
 const c=json('src/curriculum/catalog.json');
 const units=[...c.main,...c.parallel,...c.guided],codes=units.map(x=>x.code);
 assert.equal(c.main.length,218);assert.equal(c.parallel.length,325);
 assert.equal(new Set(codes).size,codes.length);
 const steps=c.guided.filter(x=>x.source==='reverse-ai');
 assert.equal(steps.length,32);
 for(let i=0;i<32;i++){const x=steps[i],id=String(i+1).padStart(3,'0');
  assert.equal(x.code,'REV-IA-'+id);
  assert.equal(x.stepId,i+1);
  assert.equal(x.moduleId,Math.floor(i/4)+1);
  assert.equal(x.href,'#reverse-ai?module='+x.moduleId+'&step='+(i%4));
 }
});
test('cada etapa tem conteúdo específico e vínculo com laboratório e referência canônica',()=>{
 const c=json('src/curriculum/catalog.json'),m=json('src/trails/reverse-ai/manifest.json'),data=json('src/trails/reverse-ai/modules.json');
 assert.equal(m.totalSteps,32);assert.equal(m.modules.length,8);assert.equal(data.modules.length,8);
 for(const [i,mod] of data.modules.entries()){
  assert.equal(mod.moduleId,i+1);assert.equal(mod.lessons.length,4);
  assert.deepEqual(mod.lessons.map(x=>x.kind),['microaula','microaula-ia','referencia','laboratorio']);
  assert.ok(mod.objective.length>50);
  for(const lesson of mod.lessons){
   const item=c.guided.find(x=>x.code==='REV-IA-'+String(lesson.stepId).padStart(3,'0'));
   assert.ok(item);assert.equal(item.title,lesson.title);assert.equal(item.stepType,lesson.kind);
   assert.equal(item.durationMin,lesson.durationMin);
   if(lesson.kind==='referencia'){
    const original=[...c.main,...c.parallel].find(x=>x.code===lesson.referenceCode);
    assert.ok(original);assert.equal(lesson.referencePath,'#course/main/'+original.id);
    assert.equal(item.aliasOf,lesson.referenceCode);
   }
   if(lesson.kind==='laboratorio'){
    assert.ok(lesson.brief.length>=4&&lesson.acceptance.length>=4);
    assert.ok(lesson.labCommand.includes('node '));
    assert.ok(existsSync('public'+lesson.starterSourceUrl));
   }else if(lesson.kind==='microaula'||lesson.kind==='microaula-ia'){
    assert.ok(lesson.sections.length>=3);
    assert.ok(lesson.sections.every(x=>x.body.length>120&&x.example&&x.counterexample));
   }
  }
  for(const type of ['assessments','answer-keys']){
   const path='public/course-labs/reverse-ai/'+type+'/module-'+String(i+1).padStart(2,'0')+'.md';
   assert.ok(existsSync(path),'Falta '+path);
  }
 }
});
test('UI integra rota, progresso por conta e não altera o registro legado',()=>{
 const app=read('src/App.tsx'),progress=read('src/lib/studyProgress.ts'),ids=read('src/lib/guidedIdentity.ts'),home=read('src/components/Dashboard.tsx');
 assert.match(app,/reverse-ai/);assert.match(home,/#courses\/engenharia-reversa-com-ia/);
 assert.match(ids,/reverse-ai/);assert.match(progress,/reverse-ai/);
 assert.match(read('src/trails/reverse-ai/ReverseAiTrail.tsx'),/syncCanonicalGuidedProgress\('reverse-ai'/);
 assert.match(read('src/trails/reverse-ai/ReverseAiTrail.tsx'),/guidedCanonicalId\('reverse-ai'/);
});
