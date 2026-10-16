import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const courses=JSON.parse(readFileSync('src/curriculum/courses.json','utf8')).courses.filter(course=>course.status==='published'||course.id==='engenharia-reversa-com-ia');

for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  test('Academy: expandable modules and waiting list on '+viewport.width,async({browser},testInfo)=>{
    const context=await browser.newContext({viewport});
    const page=await context.newPage();
    await page.goto('http://127.0.0.1:8790/academy');
    const cards=page.locator('.academy-courses-grid details.academy-course-card');
    await expect(cards).toHaveCount(courses.length);
    await expect(page.locator('.academy-catalog-panel')).toHaveCount(0);
    const first=cards.first();
    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open','');
    await expect(first.locator('.academy-course-module')).toHaveCount(courses[0].modules.length);
    await expect(first.locator('.academy-course-module').first()).toContainText(courses[0].modules[0].title);
    await first.locator('.academy-course-waitlist').click();
    await expect(page.locator('#academy-waitlist-course')).toHaveValue(courses[0].id);
    await expect(page.locator('.academy-plan-card').first()).toContainText('Lista de espera');
    const reverse=page.locator('#curso-engenharia-reversa-com-ia');
    await reverse.locator('summary').click();
    await expect(reverse.locator('.academy-course-module')).toHaveCount(8);
    await expect(reverse).toContainText('PRÉVIA · LISTA DE ESPERA');
    await reverse.locator('.academy-course-waitlist').click();
    await expect(page.locator('#academy-waitlist-course')).toHaveValue('engenharia-reversa-com-ia');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
    await page.screenshot({path:testInfo.outputPath('academy-'+viewport.width+'.png'),fullPage:true});
    await context.close();
  });
}
