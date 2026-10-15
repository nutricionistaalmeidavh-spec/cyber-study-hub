import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const load = path => JSON.parse(readFileSync(path,'utf8'));
const source=load('src/curriculum/catalog.json'), q=load('quality/registry.json'), offers=load('src/curriculum/courses.json');
const ai=load('quality/trails/ai-dev/reviews.json'), dark=load('quality/trails/channel-dark/reviews.json');
const flatten = kind => offers.courses.filter(c=>c.type===kind).flatMap(c=>c.modules.flatMap(m=>m.lessonCodes));
test('curso agrupa IDs canônicos sem duplicar ou alterar aula/progresso',()=>{
  assert.deepEqual([...flatten('main')].sort(),source.main.map(x=>x.code).sort());
  assert.deepEqual([...flatten('parallel')].sort(),source.parallel.map(x=>x.code).sort());
  assert.equal(new Set(flatten('main')).size,source.main.length);
  assert.equal(new Set(flatten('parallel')).size,source.parallel.length);
  assert.deepEqual([...flatten('trail')].sort(),source.guided.map(x=>x.code).sort());
  assert.equal(new Set(flatten('trail')).size,64);
  assert.equal(new Set([...flatten('main'),...flatten('parallel'),...flatten('trail')]).size,607);
  assert.equal(new Set(offers.courses.map(c=>c.id)).size,offers.courses.length);
  assert.equal(new Set(offers.courses.flatMap(c=>c.modules.map(m=>m.id))).size,offers.courses.flatMap(c=>c.modules).length);
});
test('nenhum curso incompleto ou sem A fica publicado',()=>{
  for(const c of offers.courses.filter(c=>c.type==='main'||c.type==='parallel')) {
    const codes=c.modules.flatMap(m=>m.lessonCodes);
    if(c.status==='published') assert.ok(codes.every(code=>q.editorialReviews[code]?.grade==='A'),c.id);
    if(c.type==='parallel') assert.equal(c.status,'draft',c.id+' ainda não foi liberado');
  }
  const final=offers.courses.find(c=>c.id==='projeto-final');
  assert.equal(final.status,'draft');
  assert.equal(offers.courses.filter(c=>c.status==='published'&&c.type==='main').length,11);
  assert.equal(q.editorialReviews['AULA-211'],undefined);
});
test('trilhas especiais publicadas só com 8 módulos auditados A',()=>{
 for(const [course,review] of [[offers.courses.find(c=>c.id==='desenvolvimento-com-ia'),ai],[offers.courses.find(c=>c.id==='automacao-canal-dark'),dark]]) {
  assert.equal(course.type,'trail'); assert.equal(course.status,'published');
  assert.equal(course.modules.length,8);
  assert.equal(course.modules.flatMap(m=>m.lessonCodes).length,32);
  assert.equal(Object.values(review.modules).length,8);
  assert.ok(Object.values(review.modules).every(m=>m.grade==='A'));
 }
});
test('catálogo não inventa pagamentos, preserva status explícito e acesso separado',()=>{
 assert.equal(offers.commercialAccess,'not_implemented');
 assert.ok(offers.courses.every(c=>['published','draft'].includes(c.status)));
 const app=readFileSync('src/App.tsx','utf8');
 const landing=readFileSync('src/components/AcademyLanding.tsx','utf8');
 assert.match(app,/CourseCatalog/);
 assert.match(landing,/publishedCourses/);
 assert.match(landing,/courses\.filter\(course => course\.status === 'published'\)/);
 assert.doesNotMatch(landing,/\/api\/(?:checkout|payment|subscribe)/i);
});

test('documenta acesso comercial seguro antes de ativar cobrança',()=> {
 const s=readFileSync('docs/platform/COURSE_ENTITLEMENTS_PLAN.md','utf8');
 assert.match(s,/Backend faz checagem autorizada/);
 assert.match(s,/URL direta e recursos estáticos públicos não são paywall/);
 assert.match(s,/self-hosted\/open source\/R\$ 0/);
});
