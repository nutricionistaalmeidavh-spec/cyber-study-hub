import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const origin='http://127.0.0.1:8790';
const data=JSON.parse(readFileSync('src/curriculum/courses.json','utf8'));
const catalog=JSON.parse(readFileSync('src/curriculum/catalog.json','utf8'));
const course=data.courses.find(course=>course.status==='published'&&course.type==='main');
const codes=course.modules.flatMap(module=>module.lessonCodes);
const first=catalog.main.find(item=>item.code===codes[0]);
const second=catalog.main.find(item=>item.code===codes[1]);
let student;
let studentState;
test.beforeAll(async({browser})=>{
 const admin=await browser.newContext({baseURL:origin});
 const adminEmail='admin@qa.example',learnerEmail='student@qa.example',password='Qa-Disposable-Password-2026!';
 const setup=await admin.request.post('/api/auth/bootstrap',{headers:{Origin:origin},data:{name:'QA Admin',email:adminEmail,password,bootstrapKey:'qa-disposable-bootstrap-only'}});
 if(!setup.ok()){
  expect(setup.status()).toBe(409); // worker concorrente já inicializou a instalação de QA
  const login=await admin.request.post('/api/auth/login',{headers:{Origin:origin},data:{email:adminEmail,password}});
  expect(login.ok()).toBeTruthy();
 }
 const learner=await browser.newContext({baseURL:origin});
 const signup=await learner.request.post('/api/auth/register',{headers:{Origin:origin},data:{name:'Aluno QA',email:learnerEmail,password}});
 const signed=signup.ok()?signup:await learner.request.post('/api/auth/login',{headers:{Origin:origin},data:{email:learnerEmail,password}});
 expect(signed.ok()).toBeTruthy();
 student=(await signed.json()).user;
 expect((await admin.request.post('/api/admin/access/grants',{headers:{Origin:origin},data:{userId:student.id,courseId:course.id}})).ok()).toBeTruthy();
 studentState=await learner.storageState();
 await admin.close();await learner.close();
});
for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
 test('discovery, continuity and readable cards '+viewport.width,async({browser},testInfo)=>{
  const context=await browser.newContext({baseURL:origin,viewport,storageState:studentState});
  const page=await context.newPage();
  await page.goto('/#dashboard');
  const main=page.locator('main.main-content');
  await expect(main.getByRole('heading',{name:'Olá, Aluno.'})).toBeVisible();
  await main.getByRole('link',{name:/Cursos de cibersegurança/}).click();
  await expect(page).toHaveURL(/#courses\?type=main$/);
  await expect(main.locator('.course-tile')).toHaveCount(5);
  const search=main.getByLabel('Buscar por assunto ou aula');
  await search.fill(second.code);
  await expect(main.locator('.course-tile')).toHaveCount(1);
  await expect(main.locator('.course-match')).toContainText(second.title);
  const color=await main.locator('.course-tile h2').evaluate(el=>getComputedStyle(el).color);
  expect(color).toBe('rgb(40, 27, 64)');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:testInfo.outputPath('catalog-'+viewport.width+'.png'),fullPage:true});
  await search.fill('nao-existe-123456789');
  await expect(main.getByRole('heading',{name:'Nenhum curso encontrado.'})).toBeVisible();
  expect(await main.locator('.course-empty p').evaluate(el=>getComputedStyle(el).color)).toBe('rgb(98, 86, 111)');
  await main.getByRole('button',{name:'Limpar busca'}).click();
  await expect(main.locator('.course-tile')).toHaveCount(5);
  await main.getByRole('link',{name:'Trilhas práticas',exact:true}).click();
  await expect(main.locator('.course-tile')).toHaveCount(3);
  await page.goto('/#courses/'+course.id);
  await expect(main.getByRole('heading',{name:'Sumário do curso'})).toBeVisible();
  const module=main.locator('details.course-module').first();
  const summary=module.locator('summary');
  await summary.focus();await summary.press('Enter');
  await expect(module).not.toHaveAttribute('open');
  await summary.press('Enter');await expect(module).toHaveAttribute('open','');
  // Seed through the existing server state API, then reload to prove persisted state is rendered.
  const now=new Date().toISOString();
  const state={
   [first.id]:{completed:false,study:{title:first.title,href:'#course/main/'+first.id,kind:'reading',read:true,updatedAt:now}},
   [second.id]:{completed:false,study:{title:second.title,href:'#course/main/'+second.id,kind:'reading',read:false,sectionId:'doc-2',updatedAt:now}}
  };
  expect((await context.request.put('/api/me/state',{headers:{Origin:origin},data:{key:'cyber-study-learning-v2',value:JSON.stringify(state)}})).ok()).toBeTruthy();
  await page.reload();
  await expect(main.getByText('Leitura registrada',{exact:true})).toBeVisible();
  await expect(main.getByText('Em estudo',{exact:true})).toBeVisible();
  await expect(main.getByRole('link',{name:'Continuar estudo →',exact:true})).toHaveAttribute('href','#course/main/'+second.id+'?section=doc-2');
  await page.screenshot({path:testInfo.outputPath('outline-'+viewport.width+'.png'),fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.goto('/#ai-dev');
  if(viewport.width<780)await expect(page.locator('.mobile-nav a[href="#courses"]')).toHaveAttribute('aria-current','page');
  // The unentitled trail remains protected, including after navigation changes.
  await expect(main.getByRole('heading',{name:'Curso não liberado nesta conta'})).toBeVisible();
  await context.close();
 });
}
