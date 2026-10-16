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
    const assertLegibleCards=async()=>{
      const metrics=await cards.first().evaluate(card=>{
        const title=card.querySelector('h3');
        const summary=card.querySelector('summary');
        const text=card.querySelector('summary p');
        const background=getComputedStyle(card).backgroundColor;
        const surface=getComputedStyle(summary).backgroundColor;
        const titleColor=getComputedStyle(title).color;
        const bodyColor=getComputedStyle(text).color;
        const rgba=value=>(value.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
        const lum=value=>{
          const rgb=rgba(value).map(x=>{
            const v=x/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;
          });
          return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
        };
        const ratio=(a,b)=>{
          const x=lum(a),y=lum(b);
          return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
        };
        return {background,surface,titleColor,bodyColor,titleContrast:ratio(background,titleColor),bodyContrast:ratio(background,bodyColor)};
      });
      // Solid CSS fallback must be dark even when the device prefers light mode.
      expect(metrics.background).toBe('rgb(19, 29, 51)');
      expect(metrics.titleContrast).toBeGreaterThan(7);
      expect(metrics.bodyContrast).toBeGreaterThan(4.5);
    };
    await page.emulateMedia({colorScheme:'light'});
    await assertLegibleCards();
    await page.emulateMedia({colorScheme:'dark'});
    await assertLegibleCards();
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
    await expect(reverse).toContainText('TRILHA PRÁTICA');
    await reverse.locator('.academy-course-waitlist').click();
    await expect(page.locator('#academy-waitlist-course')).toHaveValue('engenharia-reversa-com-ia');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
    await expect(page.locator('#academy-hero-title')).toContainText('A última turma encerrou');
    await expect(page.locator('#academy-waitlist-title')).toContainText('Última turma encerrada');
    await expect(page.locator('.academy-faq-items details')).toHaveCount(4);
    await expect(page.locator('.academy-plan-price').first()).toContainText('Condições na próxima abertura');
    await expect(page.locator('.academy-waitlist-submit')).toContainText('Quero ser avisado da próxima turma');
    await expect(page.locator('#academy-waitlist-course')).toHaveValue('engenharia-reversa-com-ia');
    await page.screenshot({path:testInfo.outputPath('academy-'+viewport.width+'.png'),fullPage:true});
    await context.close();
  });
}
