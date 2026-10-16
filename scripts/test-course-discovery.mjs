import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const exports={};
vm.runInNewContext(ts.transpileModule(readFileSync('src/lib/courseDiscovery.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports});
const catalog=JSON.parse(readFileSync('src/curriculum/catalog.json','utf8'));
const {courses}=JSON.parse(readFileSync('src/curriculum/courses.json','utf8'));
const titles=new Map([...catalog.main,...catalog.parallel,...catalog.guided].map(item=>[item.code,item.title]));
const titleFor=code=>titles.get(code)||'';

test('search finds each published lesson by its canonical ID without exposing drafts',()=>{
 for(const course of courses.filter(c=>c.status==='published'))for(const module of course.modules)for(const code of module.lessonCodes){
  assert.ok(exports.courseSearchMatch(course,code,titleFor),course.id+' '+code);
 }
});
test('lesson titles and module titles match without accents, case or padding',()=>{
 for(const course of courses)for(const module of course.modules){
  assert.ok(exports.courseSearchMatch(course,' '+exports.normalizeCourseSearch(module.title).toUpperCase()+' ',titleFor));
  for(const code of module.lessonCodes)assert.ok(exports.courseSearchMatch(course,exports.normalizeCourseSearch(titleFor(code)).toUpperCase(),titleFor));
 }
});
test('unknown terms have no result; invalid types cannot become hidden filters',()=>{
 for(const course of courses)assert.equal(exports.courseSearchMatch(course,'assunto-inexistente-abcdefgh',titleFor),null);
 assert.equal(exports.catalogType('main'),'main');
 assert.equal(exports.catalogType('trail'),'trail');
 assert.equal(exports.catalogType('parallel'),'parallel');
 assert.equal(exports.catalogType('unknown'),undefined);
 assert.equal(exports.catalogType(),undefined);
});

// Render the actual course UI with the real catalog and isolated account-state readers.
const {createRequire}=await import('node:module');
const {createElement}=await import('react');
const {renderToStaticMarkup}=await import('react-dom/server');
const require=createRequire(import.meta.url);
const source=readFileSync('src/components/curriculum/CourseCatalog.tsx','utf8');
const offerings={courses,publishedCourses:courses.filter(c=>c.status==='published'),
 mainLessonsByCode:new Map(catalog.main.map(x=>[x.code,x])),
 parallelLessonsByCode:new Map(catalog.parallel.map(x=>[x.code,x])),
 guidedLessonsByCode:new Map(catalog.guided.map(x=>[x.code,x]))};
function renderCourse(props,{visits=[],learning={},legacy={}}={}){
 const output={};
 const dependencies={
  '../../curriculum/courseOfferings':offerings,
  '../../lib/courseDiscovery':exports,
  '../../curriculum/mainLearningPaths':{mainLearningPaths:courses.filter(course=>course.type==='main')},
  '../../lib/studyProgress':{getStudyVisits:()=>visits},
  '../../lib/learningProgress':{getLearningProgress:()=>learning},
  '../../lib/storage':{getLessonState:()=>legacy},
  '../../lib/studyNavigation':{studySectionHref:(id,href)=>href+'?section='+id},
  './course-catalog.css':{},'./ArtisysPurchase':{default:()=>null}
 };
 vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,
  {exports:output,require:name=>name in dependencies?dependencies[name]:require(name)});
 return renderToStaticMarkup(createElement(output.default,props));
}
test('student type filters show only published matching courses; drafts remain unavailable',()=>{
 const html=renderCourse({courseType:'trail'});
 assert.equal((html.match(/class="course-tile"/g)||[]).length,2);
 assert.ok(html.includes('#courses/desenvolvimento-com-ia'));
 assert.ok(!html.includes('#courses/engenharia-reversa-com-ia'));
 assert.match(renderCourse({courseId:'engenharia-reversa-com-ia'}),/Este curso ainda não foi publicado/);
});
test('resume preserves interactive routes and sections instead of redirecting them to a reading page',()=>{
 const unit=catalog.main.find(item=>item.id===47);
 const course=courses.find(course=>course.modules.some(module=>module.lessonCodes.includes(unit.code)));
 const html=renderCourse({courseId:course.id},{visits:[{key:'47',title:unit.title,href:'#lesson/47',kind:'interactive',sectionId:'v2-lab',updatedAt:'2026-10-16T12:00:00Z'}]});
 assert.match(html,/href="#lesson\/47\?section=v2-lab"/);
 assert.match(html,/Em estudo/);
});
test('completed work is not resumed; reading and practical completion retain distinct labels',()=>{
 const course=courses.find(course=>course.status==='published'&&course.type==='main');
 const [firstCode,secondCode]=course.modules.flatMap(module=>module.lessonCodes);
 const first=offerings.mainLessonsByCode.get(firstCode), second=offerings.mainLessonsByCode.get(secondCode);
 const html=renderCourse({courseId:course.id},{visits:[
  {key:String(first.id),title:first.title,href:'#course/main/'+first.id,kind:'reading',read:true,updatedAt:'2026-10-16T12:00:00Z'},
  {key:String(second.id),title:second.title,href:'#lesson/'+second.id,kind:'interactive',updatedAt:'2026-10-16T11:00:00Z'}
 ],learning:{[second.id]:{completed:true}}});
 assert.match(html,/Leitura registrada/);assert.match(html,/Concluída/);
 assert.doesNotMatch(html,/>Continuar estudo/);
});
