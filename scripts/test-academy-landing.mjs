import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('academy is a public route, evaluated before account gate', () => {
  const app = read('src/App.tsx');
  const route = app.indexOf('isAcademyPath(window.location.pathname)');
  const gate = app.indexOf('<PlatformGate>');
  assert.ok(route > -1, 'academy route should exist');
  assert.ok(gate > route, 'public academy should not require a logged-in account');
  assert.match(app, /AcademyLanding/);
});

test('academy page includes real curriculum and working navigation targets', () => {
  const source = read('src/components/AcademyLanding.tsx');
  const css = read('src/components/academy.css');
  for (const anchor of ['trilhas', 'metodo', 'assinaturas', 'perguntas']) {
    assert.match(source, new RegExp('id="' + anchor + '"'));
    assert.match(source, new RegExp('href="#' + anchor + '"'));
  }
  assert.match(source, /waitlistCatalogCourses\.map/);
  assert.match(source, /course\.modules\.map/);
  assert.doesNotMatch(source, /academy-catalog-panel|academy-available-modules|academy-module-grid/);
  assert.match(source, /href="\/academy\/study"/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
});

test('academy comunica próxima turma, sem prometer vaga nem ativar cobrança', () => {
  const landing = read('src/components/AcademyLanding.tsx');
  const waitlist = read('src/components/AcademyWaitlist.tsx');
  assert.match(landing, /A última turma encerrou/);
  assert.match(landing, /ÚLTIMA TURMA ENCERRADA/);
  assert.match(landing, /próxima abertura por lista de espera/i);
  assert.match(waitlist, /Última turma encerrada/);
  assert.match(waitlist, /PRÓXIMA TURMA · LISTA DE ESPERA ABERTA/);
  assert.match(waitlist, /não garante vaga e não gera cobrança/);
  assert.match(waitlist, /Quero ser avisado da próxima turma/);
  assert.doesNotMatch(landing + waitlist, /assinaturas em preparação|formatos de acesso previstos|sem código por e-mail|professores e administradores recebem convite|sem API paga obrigatória|em preparação/i);
  assert.doesNotMatch(landing, /\/api\/(checkout|payment|subscribe)|stripe\.com|mercadopago/i);
  assert.match(landing, /monthlyPrice\/100/);
});

test('FAQ pública é curta, acessível e responde dúvidas reais sobre inscrições',()=>{
  const landing=read('src/components/AcademyLanding.tsx');
  const faq=landing.split('<div className="academy-faq-items">')[1]?.split('</div>')[0]||'';
  assert.equal((faq.match(/<details data-reveal>/g)||[]).length,4);
  for (const question of ['Como funciona a lista de espera?', 'Entrar na lista garante uma vaga?', 'Preciso pagar agora?', 'Quando recebo acesso às aulas?']) {
    assert.ok(faq.includes(question),question);
  }
  assert.match(faq,/não gera nenhuma cobrança/);
  assert.match(faq,/vaga só é confirmada após a inscrição/);
});

test('vitrine pública expande os módulos reais de cada curso sem duplicar catálogo', async () => {
  const {createRequire} = await import('node:module');
  const {createElement} = await import('react');
  const {renderToStaticMarkup} = await import('react-dom/server');
  const ts = await import('typescript');
  const vm = await import('node:vm');
  const require = createRequire(import.meta.url);
  const allCourses = JSON.parse(read('src/curriculum/courses.json')).courses;
  const courses = allCourses.filter(c => c.status === 'published');
  const visibleCourses = allCourses.filter(c => c.status === 'published'||c.id==='engenharia-reversa-com-ia');
  const exported = {};
  const mocks = {
    '../curriculum/courseOfferings': {publishedCourses:courses,waitlistCatalogCourses:visibleCourses},
    '../lib/studyInventory': {studyInventory:{totalSteps:639,canonical:639,legacyCanonical:543,guided:96}},
    './useAcademyMotion': {useAcademyMotion:()=>undefined},
    './AcademyBrand': {default:()=>createElement('span',null,'Academy')},
    './AcademyWaitlist': {default:()=>createElement('div',{id:'lista-de-espera'})},
    './academy.css': {}, './academy-motion.css': {}
  };
  const output = ts.transpileModule(read('src/components/AcademyLanding.tsx'), {
    compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}
  }).outputText;
  vm.runInNewContext(output,{exports:exported,require:name=>name in mocks?mocks[name]:require(name)});
  const html = renderToStaticMarkup(createElement(exported.default));
  assert.equal((html.match(/<details class="academy-course-card"/g)||[]).length,visibleCourses.length);
  assert.equal((html.match(/class="academy-course-module"/g)||[]).length,
    visibleCourses.reduce((total,c)=>total+c.modules.length,0));
  const escaped = value=>value.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
  for(const course of visibleCourses){
    assert.ok(html.includes(escaped(course.title)),course.id+' should be visible');
    for(const module of course.modules)
      assert.ok(html.includes(escaped(module.title)),course.id+' should list '+module.id);
    assert.ok(html.includes('/academy?curso='+encodeURIComponent(course.id)+'#lista-de-espera'),
      course.id+' should lead to selected waitlist');
  }
  assert.doesNotMatch(html,/Explore também os módulos publicados|17 módulos no catálogo/);
  assert.match(html,/Curso individual/);
  assert.match(html,/Lista de espera/);
  assert.match(html,/Entrar na lista de espera/);
});

test('clicking a course waits for the selected canonical offering, not general Academy',()=>{
  const landing=read('src/components/AcademyLanding.tsx');
  const waitlist=read('src/components/AcademyWaitlist.tsx');
  assert.match(landing,/chooseWaitlistCourse\(event, course\.id\)/);
  assert.match(landing,/selectedCourseId=\{waitlistCourseId\}/);
  assert.match(landing,/replaceState\(null, '', '\/academy\?curso='/);
  assert.match(waitlist,/setCourseId\(selectedCourseId\)/);
  assert.match(waitlist,/waitlistCatalogCourses\.some\(c=>c\.id===selectedCourseId\)/);
  assert.match(landing,/>Lista de espera<\/span>/);
});

test('Engenharia Reversa com IA publicada aparece na vitrine e mantém módulos canônicos',()=>{
  const offers=JSON.parse(read('src/curriculum/courses.json')).courses;
  const reverse=offers.find(c=>c.id==='engenharia-reversa-com-ia');
  const available=read('src/curriculum/courseOfferings.ts');
  const waitlist=read('src/components/AcademyWaitlist.tsx');
  const access=read('src/worker/course-access.mjs');
  assert.equal(reverse.status,'published');
  assert.equal(reverse.modules.length,8);
  assert.equal(reverse.modules.reduce((sum,module)=>sum+module.lessonCodes.length,0),32);
  assert.match(available,/waitlistCatalogCourses/);
  assert.match(waitlist,/waitlistCatalogCourses\.map/);
  assert.match(access,/offers\.courses\.filter\(c => c\.status === 'published'\)/);
});
test('preço mensal editável apenas na API de administração, sem cobrança automática no site',()=>{
  const landing=read('src/components/AcademyLanding.tsx');
  const editor=read('src/components/SubscriptionOfferAdmin.tsx');
  assert.match(landing,/\/api\/subscription\/offer/);
  assert.match(landing,/monthlyPrice\/100/);
  assert.match(editor,/\/api\/admin\/subscription\/offer/);
  assert.match(read('server/platform.mjs'),/subscriptionOfferRoute/);
  assert.match(read('src/worker/index.mjs'),/subscriptionOfferRoute/);
  assert.doesNotMatch(landing,/\/api\/(?:billing\/purchase-intent|checkout)/);
});

test('cards expansíveis garantem legibilidade em iOS independentemente do tema',()=>{
  const css=read('src/components/academy.css');
  const scope=css.match(/\.academy-page \.academy-courses-grid > details\.academy-course-card\{([^}]+)\}/)?.[1]||'';
  assert.match(scope,/color-scheme:dark/);
  const background=scope.match(/background-color:(#[0-9a-f]{6})!important/i)?.[1];
  const titleRule=css.match(/\.academy-page \.academy-courses-grid \.academy-course-summary h3\{([^}]+)\}/)?.[1]||'';
  const textRule=css.match(/\.academy-page \.academy-courses-grid \.academy-course-summary p\{([^}]+)\}/)?.[1]||'';
  const title=titleRule.match(/color:(#[0-9a-f]{6})!important/i)?.[1];
  const text=textRule.match(/color:(#[0-9a-f]{6})!important/i)?.[1];
  assert.ok(background&&title&&text,'cores explícitas de fundo e textos devem existir');
  const luminance=hex=>{
    const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255)
      .map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
    return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
  };
  const ratio=(a,b)=>{
    const x=luminance(a),y=luminance(b);
    return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
  };
  assert.ok(ratio(background,title)>=7,'título deve atender AAA');
  assert.ok(ratio(background,text)>=4.5,'descrição deve atender AA');
  assert.match(css,/\.academy-page \.academy-courses-grid \.academy-course-expanded\{/);
});
