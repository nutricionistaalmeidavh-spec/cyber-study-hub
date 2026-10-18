import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {presentPentestLesson} from '../src/lib/pentestLessonFlow.mjs';
import {presentLessonMarkdown} from '../src/lib/lessonPresentation.mjs';

const read = path => readFileSync(path, 'utf8');

test('lesson 031 reads as human teaching material without internal caveats, project instructions or references', () => {
  const source = read('public/course-library/main/031.md');
  const visible = presentLessonMarkdown(presentPentestLesson(31, source), {id:31});
  assert.match(visible, /## Problema e objetivo mensurável/);
  assert.doesNotMatch(visible, /contrato jurídico/);
  assert.doesNotMatch(visible, /raiz do projeto|fixture da aula|sintaxe de import acima/i);
  assert.doesNotMatch(visible, /Fonte técnica para aprofundamento|OWASP Web Security Testing Guide 4\.2/);
  assert.doesNotMatch(visible, /## Revisão ativa e fontes/);
  assert.doesNotMatch(visible, /^### Exemplo resolvido e comentado$/m);
  assert.equal(source, read('public/course-library/main/031.md'), 'canonical editorial source must remain intact');
});

test('lesson 034 retains the conceptual decision flow and the integrated lab, not duplicate hands-on code', () => {
  const displayed = presentLessonMarkdown(presentPentestLesson(34, read('public/course-library/main/034.md')), {id:34});
  assert.match(displayed, /\*\*Modelo de decisão:\*\* estado inicial → entrada controlada/);
  assert.doesNotMatch(displayed, /## Laboratório reproduzível|## Prova final independente/);
  assert.doesNotMatch(displayed, /modelo de código:|raiz do projeto/i);
  const component = read('src/components/curriculum/CourseDocumentViewer.tsx');
  assert.match(component, /<EscolaLabIntroLab/);
  assert.match(component, /<DecisionFlow/);
  assert.match(component, /className="decision-flow"/);
  assert.match(component, /presentLessonMarkdown/);
  assert.ok(component.indexOf('<EscolaLabIntroLab') > component.indexOf('<MarkdownDocument'));
});

test('all 543 canonical learning documents get editorial presentation without modifying their files', () => {
  const catalog = JSON.parse(read('src/curriculum/catalog.json'));
  assert.equal(catalog.main.length + catalog.parallel.length, 543);
  for (const item of [...catalog.main, ...catalog.parallel]) {
    const source = read('public' + item.contentPath);
    const visible = presentLessonMarkdown(
      item.kind === 'main' ? presentPentestLesson(item.id, source) : source,
      item);
    assert.ok(visible.trim().length > 0, item.code + ' content disappeared');
    assert.doesNotMatch(visible, /^\*\*(Fonte técnica para aprofundamento|Limite de aprendizagem):\*\*/m, item.code);
    assert.doesNotMatch(visible, /^## (Referências(?: bibliográficas)?|Bibliografia)\s*$/im, item.code);
  }
});

test('reference lists are absent from BOTH course reading and native interactive lesson UI', () => {
  const doc = read('src/components/curriculum/CourseDocumentViewer.tsx');
  const native = read('src/components/lesson-v2/LessonViewerV2.tsx');
  assert.doesNotMatch(doc, /<ReferencePanel/);
  assert.doesNotMatch(native, /<ReferencePanel/);
  assert.match(native, /id="v2-mecanismo"/);
});

test('EscolaLab shows in-product beginner instructions, not the raw developer README', () => {
  const lab = read('src/components/pentest/EscolaLabIntroLab.tsx');
  assert.doesNotMatch(lab, /href=\{academyPublicHref\('\/course-labs\/capstone-final\/README\.md'\)\}/);
  assert.match(lab, /Como realizar o laboratório/);
  assert.match(lab, /127\.0\.0\.1/);
  assert.doesNotMatch(lab, /Download( gratuito)? disponível/i);
});

test('course code examples and flowchart styles are mobile accessible', () => {
  const reader = read('src/components/curriculum/CourseDocumentViewer.tsx');
  const css = read('src/components/curriculum/curriculum.css');
  assert.match(reader, /role="img"|aria-label="Fluxograma/);
  assert.match(css, /\.decision-flow/);
  assert.match(css, /@media\(max-width:700px\)/);
});
