import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';

const src=path=>readFileSync(path,'utf8');
test('Aulas interativas devem vir do servidor autenticado',()=>{
 for(const path of ['src/components/Dashboard.tsx','src/components/Review.tsx','src/components/curriculum/CurriculumBrowser.tsx','src/components/review/LearningInsights.tsx','src/components/lesson-v2/LessonViewerV2.tsx','src/App.tsx']){
  const code=src(path);
  assert.doesNotMatch(code,/from ['"][^'"]*\/(?:data\/lessons|data\/lessonDetails|content\/registry)['"]/,path);
 }
 assert.match(src('src/components/lesson-v2/LessonViewerV2.tsx'),/\/api\/content\/lesson\//);
});
test('Trilhas e jogos não incorporam payload editorial em JS público',()=>{
 for(const path of ['src/trails/ai-dev/AiDevelopmentTrail.tsx','src/trails/channel-dark/ChannelAutomationTrail.tsx']){
  const code=src(path);
  assert.doesNotMatch(code,/import (?:learning|oficinas|labContracts) from ['"][^'"]*\/(?:modules|oficinas|labContracts)\.json['"]/,path);
  assert.match(code,/\/api\/content\/trail\//,path);
 }
 assert.doesNotMatch(src('src/components/Games.tsx'),/from ['"]\.\.\/data\/games['"]/);
 assert.match(src('src/components/Games.tsx'),/\/api\/content\/games/);
});
test('API de payload depende da autorização de curso existente nos dois backends',()=>{
 for(const file of ['src/worker/index.mjs','server/platform.mjs']){
  const s=src(file);
  assert.match(s,/contentRoute\(path\)/,file);
  assert.match(s,/securedPayload\(/,file);
 }
});
test('Bundle de produção não contém textos ou gabaritos de aulas privadas',()=>{
 const dir='dist/assets';
 let files=[];try{files=readdirSync(dir).filter(f=>f.endsWith('.js'));}catch{return;}
 const output=files.map(file=>src(dir+'/'+file)).join('\n');
 for(const privateFragment of ['Objeto trocado','Criação, validação, tuning, versionamento','Canal dark não significa canal sem autoria']){
  assert.equal(output.includes(privateFragment),false,'Vazamento: '+privateFragment);
 }
});