import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const products=JSON.parse(readFileSync('src/curriculum/courses.json','utf8'));
const catalog=JSON.parse(readFileSync('src/curriculum/catalog.json','utf8'));
const registry=JSON.parse(readFileSync('quality/registry.json','utf8'));
const codes=new Set(catalog.main.map(item => item.id));
const allIds=products.courses.flatMap(course => course.modules.flatMap(module => Array.from({length:module.end-module.start+1},(_,i)=>module.start+i)));
assert.equal(catalog.main.length,218);
assert.equal(allIds.length,218,'all 218 lessons must be allocated to a course');
assert.equal(new Set(allIds).size,218,'a lesson must not belong to two saleable courses');
assert(allIds.every(id=>codes.has(id)),'course contains unknown lesson');
const publishedCourseIds=products.courses.filter(course => course.releaseRequested && course.modules.every(module =>
  Array.from({length:module.end-module.start+1},(_,i)=>'AULA-'+String(module.start+i).padStart(3,'0'))
    .every(code=>registry.editorialReviews[code]?.grade==='A'))).map(course=>course.id);
const pendingCourseIds=products.courses.filter(course=>!publishedCourseIds.includes(course.id)).map(course=>course.id);
const publishedTrailIds=products.trails.filter(trail => {
  if (!trail.releaseRequested) return false;
  assert(/^quality\/trails\/(?:ai-dev|channel-dark)\/reviews\.json$/.test(trail.reviewPath));
  const reviews=JSON.parse(readFileSync(trail.reviewPath,'utf8'));
  return Object.values(reviews.modules).length === 8 && Object.values(reviews.modules).every(module=>module.grade==='A');
}).map(trail=>trail.id);
const value={schemaVersion:1,source:'quality/registry.json + quality/trails/*/reviews.json',publishedCourseIds,pendingCourseIds,publishedTrailIds};
const generated=JSON.stringify(value,null,2)+'\n';
const target='src/curriculum/publication.json';
if(process.argv.includes('--write')) { writeFileSync(target,generated); console.log('Publicação curricular atualizada:',publishedCourseIds.length,'cursos e',publishedTrailIds.length,'trilhas.'); }
else if(process.argv.includes('--check')) { assert.equal(readFileSync(target,'utf8'),generated,'Projeção desatualizada; execute npm run refresh:courses e revise antes de publicar.'); console.log('Publicação A consistente.'); }
else { process.stdout.write(generated); }
