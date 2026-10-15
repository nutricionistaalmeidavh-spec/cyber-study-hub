import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = p => readFileSync(p, 'utf8');
const json = p => JSON.parse(read(p));
const root = 'src/trails/channel-dark/';
const manifest = json(root + 'manifest.json');
const course = json(root + 'modules.json');
const allowedKinds = ['microaula','microaula-ia','referencia','laboratorio'];

test('trilha separada e 32 etapas no mesmo contrato pedagógico da trilha IA', () => {
  assert.equal(manifest.id, 'CANAL-DARK-IA');
  assert.equal(manifest.modules.length, 8);
  assert.equal(course.modules.length, 8);
  assert.equal(course.modules.flatMap(m => m.lessons).length, 32);
  assert.match(manifest.corePolicy, /R\$ 0/);
  for (const [index, mod] of course.modules.entries()) {
    assert.equal(mod.moduleId, index + 1);
    assert.equal(mod.lessons.length, 4);
    assert.deepEqual(mod.lessons.map(l => l.kind), allowedKinds);
    assert.deepEqual(mod.lessons.map(l => l.stepId), [1,2,3,4].map(n=>index*4+n));
    assert.equal(mod.learningOutcomes.length, 4);
    assert.equal(mod.lessons[0].sections.length, 3);
    assert.ok(mod.lessons[0].challenge.options.length >= 3);
    assert.equal(mod.lessons[1].sections.length, 3);
    assert.equal(mod.lessons[1].reviewQuestions.length, 3);
    assert.ok(mod.lessons[1].prompt.length > 200);
    assert.match(mod.lessons[2].referencePath, /^https:\/\//);
    assert.equal(mod.lessons[3].brief.length, 4);
    assert.equal(mod.lessons[3].acceptance.length, 5);
    assert.ok(existsSync('public' + mod.lessons[3].starterSourceUrl));
    assert.ok(existsSync('public' + mod.assessmentPath));
    assert.ok(existsSync('public' + mod.answerKeyPath));
    assert.ok(mod.tools.some(t => t.tier === 'core'), 'Todo módulo deve ter ferramenta gratuita executável localmente');
    assert.ok(mod.tools.every(t => /^https:\/\//.test(t.url)));
  }
});

test('alternativas pagas explícitas e ausência de bloqueio no projeto grátis', () => {
  const all = course.modules.flatMap(m=>m.tools);
  for (const name of ['Steve AI','Pika','Google Flow','n8n','Kokoro','Modal','FFmpeg','Node-RED']) {
    assert.ok(all.some(t=>t.name===name), 'Ferramenta ausente: '+name);
  }
  for (const name of ['Pika','Google Flow','Steve AI','Modal']) {
    assert.ok(all.filter(t=>t.name===name).every(t=>t.tier==='optional'), name+' não pode ser requisito obrigatório');
  }
  for (const mod of course.modules) {
    assert.ok(mod.lessons[3].brief.join(' ').includes('gratuit'), 'Laboratório sem caminho gratuito '+mod.moduleId);
  }
});

test('rota isolada e sem alterar a IA existente ou o catálogo canônico', () => {
  const app=read('src/App.tsx'), dashboard=read('src/components/Dashboard.tsx');
  assert.match(app, /page: 'channel-dark'/);
  assert.match(app, /ChannelAutomationTrail userId/);
  assert.match(dashboard, /href="#channel-dark"/);
  assert.match(app, /route.page==='ai-dev' && \(entitled\('desenvolvimento-com-ia'\)\?<AiDevelopmentTrail/);
  assert.equal(json('src/curriculum/catalog.json').main.length,218);
  assert.equal(json('src/curriculum/catalog.json').parallel.length,325);
});
