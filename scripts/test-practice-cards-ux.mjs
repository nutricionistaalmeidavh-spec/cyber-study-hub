import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=p=>readFileSync(p,'utf8');
const catalog=JSON.parse(read('src/curriculum/catalog.json'));
const ai=JSON.parse(read('src/trails/ai-dev/modules.json'));
const channel=JSON.parse(read('src/trails/channel-dark/modules.json'));
const contracts=JSON.parse(read('src/trails/ai-dev/labContracts.json'));
const guided=read('src/components/practice/GuidedPracticeOrientation.tsx');
const practice=read('src/components/practice/PracticeOrientation.tsx');
const css=read('src/components/practice/practice.css');
const aiCss=read('src/trails/ai-dev/ai-dev.css');
const aiView=read('src/trails/ai-dev/AiDevelopmentTrail.tsx');
const labPath=read('src/trails/ai-dev/AiLabLearningPath.tsx');
const channelView=read('src/trails/channel-dark/ChannelAutomationTrail.tsx');

const luminance=hex=>{
 const ch=hex.replace('#','').match(/../g).map(v=>parseInt(v,16)/255);
 const linear=v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;
 return 0.2126*linear(ch[0])+0.7152*linear(ch[1])+0.0722*linear(ch[2]);
};
const contrast=(a,b)=>{const [hi,lo]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (hi+0.05)/(lo+0.05);};

test('paleta do card mantém contraste alto e preenchimento opaco mesmo sobre tema claro',()=>{
 for(const [fg,bg] of [['#f6f0ff','#1b1730'],['#e4cbff','#1b1730'],['#decfea','#1b1730'],['#ffffff','#4b286e']]){
  assert.ok(contrast(fg,bg)>=4.5,fg+'/'+bg+' não atende a 4.5:1');
 }
 assert.match(css,/background:#1b1730/);
 assert.match(css,/\.guided-practice-contract/);
 assert.match(css,/\.guided-practice-copy p[\s\S]*?color:#f6f0ff!important/);
 assert.match(aiCss,/\.ai-track \.ai-lab-contract\{\s*background:#1b1730/);
});
test('microaulas e referências não exibem card gigante, laboratório mostra ação compacta',()=>{
 assert.match(guided,/if\(step\.kind!=='laboratorio'\)return null/);
 assert.match(guided,/<aside className="guided-practice-contract"/);
 assert.match(guided,/href=\{'#'\+anchor\}/);
 assert.doesNotMatch(guided,/<dl>/);
 assert.match(practice,/<details className="practice-contract"/);
 assert.match(practice,/<summary className="practice-contract-summary"/);
 assert.match(css,/\.guided-practice-jump/);
 assert.match(css,/@media\(max-width:680px\)/);
});
test('DEV-IA-004 usa especificação real, não mensagem genérica de código',()=>{
 const lab=ai.modules[0].lessons[3],meta=contracts[0];
 assert.equal(lab.stepId,4);assert.equal(lab.kind,'laboratorio');
 assert.equal(meta.moduleId,1);assert.match(meta.deliverable,/Escopo inicial/);
 assert.equal(meta.kind,'Projeto incremental');
 assert.match(guided,/labContract\?\.deliverable/);
 assert.match(aiView,/contract=\{activeLabA\}/);
 assert.match(aiView,/id=\{'laboratorio-'\+guidedCanonicalId\('ai-dev',lesson\.stepId\)\}/);
 assert.match(channelView,/id=\{'laboratorio-'\+guidedCanonicalId\('channel-dark',lesson\.stepId\)\}/);
});
test('o roteiro mostra cinco passos e o material canônico continua acessível',()=>{
 for(const label of ['Explicação','Arquivos prontos','Tutorial','Laboratório','Validação']) assert.ok(labPath.includes(label));
 assert.match(aiView,/<AiLabLearningPath/);
 assert.match(labPath,/contract.deliverable/);
 assert.match(labPath,/contract.verify/);
 assert.match(labPath,/kitPaths.map/);
});
test('IDs históricos permanecem estáveis após adicionar trilha',()=>{
 const codes=[...catalog.main,...catalog.parallel,...catalog.guided].map(x=>x.code);
 assert.equal(codes.length,639);
 assert.equal(catalog.guided.slice(0,64).filter(x=>['ai-dev','channel-dark'].includes(x.source)).length,64);
 assert.equal(catalog.guided.slice(64).filter(x=>x.source==='reverse-ai').length,32);
 assert.equal(new Set(codes).size,639);
 assert.equal(ai.modules.flatMap(x=>x.lessons).length,32);
 assert.equal(channel.modules.flatMap(x=>x.lessons).length,32);
 assert.equal(ai.modules.flatMap(x=>x.lessons).filter(s=>s.kind==='laboratorio').length,8);
 assert.equal(channel.modules.flatMap(x=>x.lessons).filter(s=>s.kind==='laboratorio').length,8);
 assert.match(aiView,/syncCanonicalGuidedProgress\('ai-dev'/);
 assert.match(channelView,/syncCanonicalGuidedProgress\('channel-dark'/);
});
