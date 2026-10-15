import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const catalog=json('src/curriculum/catalog.json');
const doc=read('src/components/curriculum/CourseDocumentViewer.tsx');
const legacy=read('src/components/Lessons.tsx');
const v2=read('src/components/lesson-v2/LessonViewerV2.tsx');
const runner=read('src/components/lesson-v2/LabRunner.tsx');
const contracts=read('src/lib/practiceContracts.ts');
const guided=read('src/components/practice/GuidedPracticeOrientation.tsx');
const canonical=read('src/components/practice/CanonicalLessonContent.tsx');

test('P0: as 607 unidades mantêm ID estável e um caminho de orientação em sua experiência real',()=>{
 assert.equal(catalog.main.length,218);assert.equal(catalog.parallel.length,325);assert.equal(catalog.guided.length,64);
 const ids=[...catalog.main,...catalog.parallel,...catalog.guided].map(item=>item.code);
 assert.equal(new Set(ids).size,607);
 assert.match(doc,/<PracticeOrientation target=\{item\}/);
 assert.match(legacy,/<MainPracticeOrientation id=\{lesson.id\}/);
 assert.match(v2,/<MainPracticeOrientation id=\{lesson.id\}/);
 const ai=read('src/trails/ai-dev/AiDevelopmentTrail.tsx');
 const channel=read('src/trails/channel-dark/ChannelAutomationTrail.tsx');
 assert.match(ai,/<GuidedPracticeOrientation code=\{guidedCanonicalId\('ai-dev'/);
 assert.match(channel,/<GuidedPracticeOrientation code=\{guidedCanonicalId\('channel-dark'/);
 assert.match(guided,/Projeto incremental/);
 assert.match(contracts,/Experimento didático/);
 assert.match(contracts,/Estudo aplicado/);
 assert.match(contracts,/Kit funcional/);
});
test('P1: as aulas 043–100 apresentam o Markdown integral sem perder a versão interativa',()=>{
 assert.match(legacy,/<CanonicalLessonContent id=\{lesson.id\}/);
 assert.match(v2,/<CanonicalLessonContent id=\{lesson.id\}/);
 assert.match(canonical,/MarkdownDocument markdown=\{markdown\}/);
 assert.match(canonical,/course-library\/main/);
 assert.match(doc,/export function MarkdownDocument/);
 assert.match(legacy,/quizDone/);
 assert.match(v2,/recordQuizAttempt/);
 assert.match(runner,/setLabStepCompletion/);
 for(let id=43;id<=100;id++){
  const path='public/course-library/main/'+String(id).padStart(3,'0')+'.md';
  assert.ok(existsSync(path),'Markdown canônico ausente: '+id);
  const source=read(path);
  assert.ok(source.length>900,'Markdown integral anormalmente curto: '+id);
  assert.ok((source.match(/^## /gm)||[]).length>=3,'Markdown sem seções completas: '+id);
 }
});
test('P1: recursos das 14 aulas V2 têm apontamentos verificáveis e sem gabaritos',()=>{
 assert.match(runner,/v2LabResources\(lessonId,lab.resources \|\| \[\]\)/);
 assert.match(runner,/resources.map\(resource/);
 assert.doesNotMatch(runner,/<strong>Laboratório concluído<\/strong>/);
 for(let id=47;id<=60;id++){
  const file='src/content/main/'+String(id).padStart(3,'0')+'/lesson.json';
  const lesson=json(file);
  assert.equal(lesson.id,id);
  assert.ok(lesson.lab?.steps?.length>0,'V2 sem laboratório: '+id);
  const explicit=lesson.lab.resources||[];
  for(const res of explicit){
   assert.ok(!res.href.includes('answer-keys'),'Gabarito exposto no laboratório: '+id);
   if(res.href.startsWith('/course-labs/')) assert.ok(existsSync('public'+res.href),'Recurso V2 quebrado: '+id+'/'+res.href);
   else assert.match(res.href,/^https:\/\//,'Referência externa deve usar HTTPS');
  }
  if(!explicit.length){
   assert.ok(id>=48&&id<=60,'Sem fallback verificado para '+id);
   assert.ok(contracts.includes('id>=48&&id<=50')||id>50);
   assert.ok(contracts.includes('id>=51&&id<=60')||id<=50);
  }
 }
});
test('P0: todos os links estáticos de arquivo e os conteúdos canônicos têm fonte real',()=>{
 const match=[...contracts.matchAll(/\/course-labs\/[a-zA-Z0-9_./-]+/g)].map(m=>m[0]);
 for(const path of match)assert.ok(existsSync('public'+path),'Artefato ausente: '+path);
 for(const item of [...catalog.main,...catalog.parallel])
  assert.ok(existsSync('public'+item.contentPath),'Conteúdo canônico quebrado: '+item.code);
 assert.match(contracts,/arquivos/i);
 assert.match(guided,/registro de estudo/i);
});
test('P1: fonte editorial única, estados legados e identidade guiada permanecem separados',()=>{
 assert.match(canonical,/cache:'force-cache'/);
 assert.match(canonical,/controller.abort\(\)/);
 assert.match(doc,/useStudyPosition/);
 assert.match(legacy,/updateLessonState/);
 assert.match(v2,/syncLegacyLessonFlags/);
 assert.match(read('src/lib/guidedIdentity.ts'),/guidedCanonicalId/);
 assert.match(read('src/lib/studyProgress.ts'),/syncCanonicalGuidedProgress/);
});
