import assert from 'node:assert/strict';
import { resolveCourseLink, parsePipeRow, isTableSeparator } from '../src/components/curriculum/markdownSupport.ts';

assert.deepEqual(resolveCourseLink('/course-labs/pilot-a/stock_rules.py'), { href: '/course-labs/pilot-a/stock_rules.py', external: false });
assert.deepEqual(resolveCourseLink('https://owasp.org/'), { href: 'https://owasp.org/', external: true });
assert.equal(resolveCourseLink('//evil.test'), null);
assert.equal(resolveCourseLink('javascript:alert(1)'), null);
assert.equal(resolveCourseLink('/course-labs/../secret.txt'), null);
assert.equal(resolveCourseLink('https://example.org\\evil.test'), null);
assert.equal(resolveCourseLink('/admin'), null);
assert.deepEqual(parsePipeRow('| Passo | Evidência |'), ['Passo', 'Evidência']);
assert.deepEqual(parsePipeRow('Passo | Evidência'), ['Passo', 'Evidência']);
assert.equal(isTableSeparator('| --- | :---: |'), true);
assert.equal(isTableSeparator('Alice | Bob'), false);
console.log('PASS markdown course: links seguros e separadores de tabelas');
