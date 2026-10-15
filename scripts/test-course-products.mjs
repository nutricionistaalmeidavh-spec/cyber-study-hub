import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const products=JSON.parse(readFileSync('src/curriculum/courses.json','utf8'));
const publication=JSON.parse(readFileSync('src/curriculum/publication.json','utf8'));
const catalog=JSON.parse(readFileSync('src/curriculum/catalog.json','utf8'));
const registry=JSON.parse(readFileSync('quality/registry.json','utf8'));

test('218 IDs canônicos são distribuídos sem duplicação em cursos e módulos',()=>{
  const ids=products.courses.flatMap(course=>course.modules.flatMap(module=>Array.from({length:module.end-module.start+1},(_,i)=>module.start+i)));
  assert.equal(ids.length,218); assert.equal(new Set(ids).size,218);
  assert.deepEqual([...ids].sort((a,b)=>a-b),catalog.main.map(item=>item.id).sort((a,b)=>a-b));
});
test('somente curso integralmente A com lançamento explícito aparece na vitrine',()=>{
  for(const course of products.courses){
    const ids=course.modules.flatMap(module=>Array.from({length:module.end-module.start+1},(_,i)=>'AULA-'+String(module.start+i).padStart(3,'0')));
    const safe=course.releaseRequested&&ids.every(id=>registry.editorialReviews[id]?.grade==='A');
    assert.equal(publication.publishedCourseIds.includes(course.id),safe,course.id);
  }
  assert(!publication.publishedCourseIds.includes('projeto-final'));
});
test('trilhas independentes de IA só entram após oito módulos A',()=>{
  for(const trail of products.trails){
    const doc=JSON.parse(readFileSync(trail.reviewPath,'utf8'));
    const allA=Object.values(doc.modules).length===8&&Object.values(doc.modules).every(module=>module.grade==='A');
    assert.equal(publication.publishedTrailIds.includes(trail.id),trail.releaseRequested&&allA);
  }
});
test('projeção publicada não está desatualizada frente ao registro de qualidade',()=>{
  execFileSync(process.execPath,['scripts/refresh-course-publication.mjs','--check'],{stdio:'pipe'});
});
