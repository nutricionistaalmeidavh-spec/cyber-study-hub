import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  A_GATES, DIMENSIONS, buildQualityReport, canonicalCode, reportToCsv,
  screenChangedUnit, validateRegistry, validateReview
} from './lib/quality-p0.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(fs.readFileSync(path.join(root, 'quality/registry.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/curriculum/catalog.json'), 'utf8'));

assert.equal(canonicalCode(catalog.main[0]), 'AULA-001');
assert.equal(canonicalCode(catalog.parallel[0]), 'LOG-01');
const original = validateRegistry(catalog, registry);
assert.deepEqual(original.errors, []);
assert.deepEqual(original.counts, { D: 439, C: 103, B: 1 });
assert.equal(original.changed.size, 66);

const r = buildQualityReport(catalog, registry, root);
assert.equal(r.summary.total, 543);
assert.equal(r.summary.changedAndScreenedPhase16, 66);
assert.equal(r.summary.untouchedPendingCurrentReview, 477);
const reviewed = Object.values(registry.editorialReviews ?? {});
assert.equal(r.summary.currentGradeUnassigned, 543 - reviewed.length);
assert.equal(r.summary.currentGradeA, reviewed.filter(x => x.grade === 'A').length);
assert.equal(r.summary.currentGradeUnassigned + reviewed.length, 543);
assert.equal(new Set(r.records.map(x => x.id)).size, 543);
assert.equal(r.records.filter(x => x.screening?.sha256).length, 66);
assert.match(reportToCsv(r), /^\ufeffid;tipo;/);
assert.equal(reportToCsv(r).split('\n').length - 2, 543);

const changed = structuredClone(registry);
changed.changeTracking.changedIds = changed.changeTracking.changedIds.slice(1);
assert.match(validateRegistry(catalog, changed).errors.join(' '), /66 unidades/);

const bogusGrade = structuredClone(registry);
bogusGrade.historical.overrides['AULA-001'] = 'A';
assert.match(validateRegistry(catalog, bogusGrade).errors.join(' '), /histórica inválida/);

const alteredCurrent = structuredClone(registry);
alteredCurrent.editorialReviews['AULA-001'] = { grade: 'A', reviewer: 'Fulano', reviewedOn: '2026-10-13', summary: 'Aula revisada' };
assert.match(validateRegistry(catalog, alteredCurrent).errors.join(' '), /AULA-001: A exige/);

const scores = Object.fromEntries(DIMENSIONS.map(x => [x, 95]));
const gates = Object.fromEntries(A_GATES.map(x => [x, true]));
const withNoProof = { grade: 'A', reviewer: 'Revisor independente', reviewedOn: '2026-10-13',
  summary: 'Avaliação específica da unidade', author: 'Autor A', contentSha256: 'a'.repeat(64), scores, gates, evidence: [] };
assert.match(validateReview(withNoProof).join(' '), /evidência individualizada/);

const evidence = DIMENSIONS.map(dimension => ({ dimension, method: 'teste reproduzível',
  reference: `reports/${dimension}.json`, result: 'passou conforme critério externo' }));
assert.deepEqual(validateReview({ ...withNoProof, evidence }), []);
assert.match(validateReview({ ...withNoProof, author: 'Revisor independente', evidence }).join(' '), /pessoa diferente/);
assert.match(validateReview({ ...withNoProof, contentSha256: '', evidence }).join(' '), /SHA-256/);
const staleGrade = structuredClone(registry);
staleGrade.editorialReviews['AULA-001'] = { ...withNoProof, evidence };
assert.throws(() => buildQualityReport(catalog, staleGrade, root), /conteúdo modificado após parecer/);

const broken = screenChangedUnit('# Um tema\n## Quiz\nQual ideia resume melhor esta aula?\n`/course-labs/inexistente.py`', 'public/course-library/main/001.md', () => false);
assert.ok(broken.findings.some(x => x.code === 'LAB_PATH_UNRESOLVED'));
assert.ok(broken.findings.some(x => x.code === 'GENERIC_QUIZ_CUE'));
assert.ok(broken.findings.some(x => x.code === 'HEADING_EXEMPLO_NOT_IDENTIFIED'));

console.log('Quality P0 test OK — integridade 543/66, histórico, promoção A bloqueada, evidências e relatórios.');