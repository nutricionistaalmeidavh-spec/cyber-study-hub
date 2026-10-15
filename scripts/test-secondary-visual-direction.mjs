import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(path,'utf8');
const css=read('src/components/hub-secondary-pages.css');
const entry=read('src/main.tsx');
const surfaces=[
  ['src/components/feedback/FeedbackCenter.tsx','feedback-page hub-secondary'],
  ['src/components/feedback/Roadmap.tsx','roadmap-shell hub-secondary'],
  ['src/components/Review.tsx','hub-secondary review-page'],
  ['src/components/PlatformAccount.tsx','hub-secondary platform-profile']
];
test('as cinco telas usam o mesmo sistema visual secundário, sem alterar a navegação ou permissões',()=>{
 for(const [path,needle] of surfaces){
  const component=read(path);
  assert.ok(component.includes(needle)||path.endsWith('Roadmap.tsx')&&component.includes("'roadmap-shell hub-secondary '"),path);
 }
 const app=read('src/App.tsx');
 for(const p of ['route.page===\'feedback\'','route.page===\'admin-feedback\'','route.page===\'roadmap\'','route.page===\'account\'','route.page===\'review\'']) assert.ok(app.includes(p),p);
 assert.match(entry,/import '.\/components\/hub-secondary-pages\.css';/);
 assert.ok(entry.lastIndexOf('hub-secondary-pages.css')>entry.lastIndexOf('hub-editorial.css'),'Override precisa ser importado após as regras da home');
});
test('direção editorial oficial usa roxo, Outfit e cartões claros, não o antigo teal',()=>{
 for(const token of ['Outfit','--hub-violet:#8745f7','--hub-lilac:#f3ecfc','.roadmap-empty','.feedback-empty','.platform-profile.hub-secondary','.review-page.hub-secondary','.feedback-board']) assert.ok(css.includes(token),token);
 assert.match(css,/\.app-shell \.main-content:has\(\.hub-secondary\)>\.feedback-global-action/);
 assert.match(css,/\.roadmap-shell\.hub-secondary\.roadmap-embedded\{padding:0/);
 assert.ok(!css.includes('background:#19d3bd'),'Página não deve carregar CTA verde antigo');
});
test('leitura 320/390/768 e scroll acima da bottom-nav, foco e redução de movimento',()=>{
 for(const token of ['@media(max-width:780px)','@media(max-width:360px)','env(safe-area-inset-bottom,0px)',':focus-visible','prefers-reduced-motion','grid-template-columns:1fr','min-width:0']) assert.ok(css.includes(token),token);
 assert.match(css,/padding:9px 14px calc\(142px \+ env\(safe-area-inset-bottom,0px\)\)/);
});
test('cadastros, alteração de senha, revisão e feedback mantêm ações originais',()=>{
 const account=read('src/components/PlatformAccount.tsx');
 for(const route of ['/api/me','/api/me/password','#feedback','#roadmap']) assert.ok(account.includes(route),route);
 const feedback=read('src/components/feedback/FeedbackCenter.tsx');
 for(const token of ['platformApi','FeedbackDetail','status','onChange','load()']) assert.ok(feedback.includes(token),token);
 const review=read('src/components/review/LearningInsights.tsx');
 for(const token of ['rateReviewCard','getDueReviewCards','getWeakConcepts']) assert.ok(review.includes(token),token);
});
