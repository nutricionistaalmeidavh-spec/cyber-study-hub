import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { ownersForPath, publishedCourseIds } from '../src/worker/course-access.mjs';

const catalog = JSON.parse(readFileSync('src/curriculum/catalog.json', 'utf8'));
const offerings = JSON.parse(readFileSync('src/curriculum/courses.json', 'utf8')).courses;
const exports = {};
const source = readFileSync('src/curriculum/mainLearningPaths.ts', 'utf8');
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS }
}).outputText, { exports, require: name => {
  if (name === './courseOfferings') return { courses: offerings };
  throw Error('Unexpected dependency: ' + name);
}});
const { mainLearningPaths, mainPathCourses, mainPathModules, mainPathLessonCount } = exports;

test('five thematic paths organize exactly 218 canonical lessons without duplicates', () => {
  assert.equal(mainLearningPaths.length, 5);
  const ids = mainLearningPaths.map(path => path.id);
  assert.equal(new Set(ids).size, 5);
  const all = mainLearningPaths.flatMap(path => mainPathModules(path).flatMap(module => module.lessonCodes));
  assert.equal(all.length, 218);
  assert.equal(new Set(all).size, 218);
  assert.deepEqual([...all].sort(), catalog.main.map(item => item.code).sort());
  assert.deepEqual(Array.from(mainLearningPaths, mainPathLessonCount), [30, 50, 60, 20, 58]);
});

test('each new track is one published course with its own secure access identity', () => {
  const allCourses = mainLearningPaths.flatMap(mainPathCourses);
  assert.equal(allCourses.length, 5);
  assert.equal(new Set(allCourses.map(course => course.id)).size, 5);
  assert.deepEqual(Array.from(allCourses, course => course.id).sort(), offerings.filter(course => course.type === 'main').map(course => course.id).sort());
  for (const course of allCourses) {
    assert.equal(course.status, 'published');
    assert.ok(publishedCourseIds.has(course.id));
    const code = course.modules[0].lessonCodes[0];
    assert.deepEqual(ownersForPath('/course-library/main/' + code.slice(-3) + '.md'), [course.id]);
  }
  assert.deepEqual(ownersForPath('/course-library/main/218.md'), ['trilha-pentest-ethical-hacking']);
});

test('existing special trail remains independent; main paths are payment identities', () => {
  assert.ok(mainLearningPaths.every(path=>offerings.some(course=>course.id===path.id&&course.type==='main')));
  assert.ok(!mainLearningPaths.some(path=>path.id==='engenharia-reversa-com-ia'));
  assert.equal(offerings.find(course => course.id === 'engenharia-reversa-com-ia').modules.flatMap(m => m.lessonCodes).length, 32);
  const catalogUi = readFileSync('src/components/curriculum/CourseCatalog.tsx', 'utf8');
  const landing = readFileSync('src/components/AcademyLanding.tsx', 'utf8');
  assert.match(catalogUi, /mainLearningPaths/);
  assert.match(catalogUi, /selectedPath/);
  assert.match(catalogUi, /#courses\/\x27\s*\+\s*course\.id|#courses\/\x27\s*\+\s*sourceCourse\.id/);
  assert.match(landing, /waitlistCatalogCourses\.map/);
  assert.match(landing, /course\.modules\.map/);
});
