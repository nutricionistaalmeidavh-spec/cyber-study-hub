import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const catalog=JSON.parse(readFileSync('src/curriculum/catalog.json','utf8'));
const browser=readFileSync('src/components/curriculum/CurriculumBrowser.tsx','utf8');
const app=readFileSync('src/App.tsx','utf8');
const viewer=readFileSync('src/components/curriculum/CourseDocumentViewer.tsx','utf8');

function modules(items,key){
  return items.reduce((groups,item)=>{
    const name=item[key];
    const list=groups.get(name)||[];
    list.push(item);
    groups.set(name,list);
    return groups;
  },new Map());
}
test('17 canonical main blocks cover all 218 lessons without duplicates',()=>{
 const groups=modules(catalog.main,'block');
 assert.equal(groups.size,17);
 assert.equal([...groups.values()].reduce((sum,items)=>sum+items.length,0),218);
 assert.equal(new Set(catalog.main.map(item=>item.id)).size,218);
 assert.deepEqual(groups.get('Blue Team & SOC').map(item=>item.id),Array.from({length:12},(_,i)=>79+i));
 assert.equal(groups.get('Antivírus, EDR e Detection').length,10);
 assert.equal(groups.get('Fundamentos e Web Security')[0].id,1);
});
test('13 parallel subject groups preserve all 325 codes',()=>{
 const groups=modules(catalog.parallel,'track');
 assert.equal(groups.size,13);
 assert.equal([...groups.values()].reduce((sum,items)=>sum+items.length,0),325);
 assert.equal(new Set(catalog.parallel.map(item=>item.code)).size,325);
 assert.equal(groups.get('JavaScript / TypeScript').length,15);
 assert.equal(groups.get('Cloud, Containers e Kubernetes').length,30);
});
test('only selected module renders its lessons and old track links stay compatible',()=>{
 assert.match(browser,/groupBy\(catalog\.main, item => item\.block\)/);
 assert.match(browser,/groupBy\(catalog\.parallel, item => item\.track\)/);
 assert.match(browser,/initialTrack \? mainModules\.find/);
 assert.match(browser,/selectedMain\?\.items\.filter/);
 assert.match(browser,/selectedParallel\?\.items\.filter/);
 assert.match(browser,/!selected \? <>/);
 assert.match(browser,/Voltar aos módulos/);
 assert.match(browser,/encodeURIComponent\(moduleName\)/);
 assert.match(browser,/activeCodes/);
 assert.match(browser,/setActiveParallelTracks\(\[\.\.\.next\]\)/);
 assert.match(app,/params\.get\('module'\)/);
 assert.match(app,/initialModule=\{route\.module\}/);
 assert.match(viewer,/moduleBackLink/);
});
test('module search finds lesson terms and the reader remains reachable',()=>{
 assert.match(browser,/group\.items\.some\(item => matchesMain/);
 assert.match(browser,/group\.items\.some\(item => matchesParallel/);
 assert.match(browser,/interactive \? '#lesson\/' \+ item\.id : '#course\/main\/' \+ item\.id/);
 assert.match(browser,/'#course\/parallel\/' \+ item\.code/);
 assert.match(browser,/Carregar mais 24 unidades/);
 assert.match(browser,/Nenhum módulo encontrado/);
});

test('a navegação principal exibe cinco trilhas completas e preserva links antigos',()=>{
 assert.match(browser,/mainPathGroups=mainLearningPaths\.map/);
 assert.match(browser,/mainPathGroups\.filter/);
 assert.match(browser,/href=\{'#courses\/'\+path\.id\}/);
 assert.match(browser,/mainModules\.find\(group=>group\.name===initialModule\)/);
});
