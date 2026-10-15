import {test} from 'node:test';
import assert from 'node:assert/strict';
import {privateCourseSource} from '../server/private-course-data.mjs';
import {contentRoute,securedPayload} from '../src/worker/secure-payload-route.mjs';

const student={id:'learner',status:'active',role:'student'};
const grant=(courseId)=>[{course_id:courseId,expires_at:null,revoked_at:null}];
test('server-only payload de aula preserva dados canônicos de versão legada e V2',()=>{
  const lesson=privateCourseSource.getLesson(43);
  assert.equal(lesson.kind,'legacy');
  assert.equal(lesson.lesson.id,43);
  assert.ok(lesson.lesson.quiz.length);
  assert.ok(lesson.detail.code.length>10);
  const native=privateCourseSource.getLesson(47);
  assert.equal(native.kind,'native');
  assert.equal(native.lesson.id,47);
  assert.ok(native.lesson.review.quiz.length>0);
});
test('API de aula exige concessão do próprio curso, incluindo revogações',()=>{
  const path=contentRoute('/api/content/lesson/43');
  assert.equal(securedPayload(path,student,[],false,privateCourseSource),null);
  const course='web-apis';
  const allowed=securedPayload(path,student,grant(course),false,privateCourseSource);
  assert.ok(allowed?.lesson);
  assert.equal(securedPayload(path,student,[{course_id:course,expires_at:null,revoked_at:1}],false,privateCourseSource),null);
  assert.equal(contentRoute('/api/content/lesson/../43'),null);
  assert.equal(contentRoute('/api/content/lesson/999'),null);
});
test('trilhas retornam conteúdo somente quando o aluno tem a concessão correta',()=>{
 for(const [trail,course] of [['ai-dev','desenvolvimento-com-ia'],['channel-dark','automacao-canal-dark']]){
  const route=contentRoute('/api/content/trail/'+trail);
  assert.equal(securedPayload(route,student,[],false,privateCourseSource),null);
  const payload=securedPayload(route,student,grant(course),false,privateCourseSource);
  assert.equal(payload.modules.length,8);
  assert.equal(payload.modules.flatMap(m=>m.lessons).length,32);
 }
});
test('jogos não entregam pacotes sem autorização, nem conteúdo de outros cursos',()=>{
 const route=contentRoute('/api/content/games');
 assert.equal(securedPayload(route,student,[],false,privateCourseSource),null);
 const staff={...student,role:'admin'};
 const full=securedPayload(route,staff,[],false,privateCourseSource);
 assert.equal(full.reviewPacks.length,9);
 assert.equal(full.scenarios.length,32);
 const subset=securedPayload(route,student,grant('web-apis'),false,privateCourseSource);
 if(subset){
   assert.ok(subset.reviewPacks.length<full.reviewPacks.length);
   const expected=new Set(subset.reviewPacks.flatMap(pack=>pack.scenarioIds));
   assert.ok(subset.scenarios.every(s=>expected.has(s.id)));
 }
});