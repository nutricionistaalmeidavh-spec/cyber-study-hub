import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const DIMENSIONS = Object.freeze([
  'conteudoTecnico', 'didatica', 'pratica', 'defesa', 'avaliacao', 'especificidade'
]);
export const A_GATES = Object.freeze([
  'precisaoRevisada', 'didaticaInicianteValidada', 'praticaVerificada',
  'avaliacaoIndependenteRevisada', 'escopoSeguroVerificado', 'revisorIndependente'
]);
const TITLE_PATTERNS = Object.freeze({
  problema: /problema|cen[aá]rio|por que/i,
  fundamentos: /fundamento|conceito|pr[eé][ -]?requisito|defini[cç][aã]o/i,
  mecanismo: /mecanismo|como funciona|fluxo|passo a passo|modelo mental/i,
  exemplo: /exemplo resolvido|exemplo comentado|solu[cç][aã]o comentada/i,
  pratica: /laborat[oó]rio|pr[aá]tica|exerc[ií]cio/i,
  avaliacao: /quiz|quest[oõ]es|avalia[cç][aã]o|desafio/i,
  correcao: /defesa|corre[cç][aã]o|reteste|valida[cç][aã]o|mitiga[cç][aã]o/i,
  fontes: /fonte|refer[eê]ncia|bibliografia|aprofundar/i
});
const QUIZ_TEMPLATE = /qual (?:ideia|afirma[cç][aã]o|op[cç][aã]o) (?:melhor )?(?:resume|descreve).*?(?:aula|tema)/i;
const LAB_LINK = /\/course-labs\/[a-zA-Z0-9_./-]+/g;

export function canonicalCode(item) {
  return item.kind === 'main' ? `AULA-${String(item.id).padStart(3, '0')}` : item.code;
}

function normalContentPath(item) {
  const candidate = String(item.contentPath ?? '');
  if (!/^\/course-library\/(?:main|parallel)\/[\w-]+\.md$/.test(candidate)) {
    throw new Error(`${canonicalCode(item)}: caminho inseguro/inválido ${candidate}`);
  }
  return `public${candidate}`;
}

export function validateRegistry(catalog, registry) {
  const errors = [];
  const units = [...(catalog.main ?? []), ...(catalog.parallel ?? [])];
  const codes = units.map(canonicalCode);
  const unique = new Set(codes);
  if (catalog.main?.length !== 218 || catalog.parallel?.length !== 325 || units.length !== 543) {
    errors.push('O catálogo não contém as 218 aulas principais e 325 paralelas esperadas no checkpoint.');
  }
  if (unique.size !== codes.length) errors.push('IDs duplicados no catálogo.');
  if (registry.schemaVersion !== 1) errors.push('schemaVersion desconhecida.');
  if (registry.historical?.defaultGrade !== 'D') errors.push('baseline padrão deve ser D.');
  const exceptions = registry.historical?.overrides ?? {};
  for (const [id, grade] of Object.entries(exceptions)) {
    if (!unique.has(id) || !['B', 'C'].includes(grade)) errors.push(`Nota histórica inválida: ${id}/${grade}`);
  }
  const grades = Object.fromEntries(codes.map(id => [id, exceptions[id] ?? 'D']));
  const counts = Object.values(grades).reduce((acc, grade) => ({ ...acc, [grade]: (acc[grade] ?? 0) + 1 }), {});
  if (counts.A || counts.B !== 1 || counts.C !== 103 || counts.D !== 439) {
    errors.push(`Distribuição histórica incoerente: ${JSON.stringify(counts)}.`);
  }
  const changed = registry.changeTracking?.changedIds ?? [];
  if (changed.length !== 66 || new Set(changed).size !== changed.length || changed.some(id => !unique.has(id))) {
    errors.push('Lista de 66 unidades alteradas é incompleta, duplicada ou tem IDs ausentes.');
  }
  const reviews = registry.editorialReviews ?? {};
  for (const [id, review] of Object.entries(reviews)) {
    if (!unique.has(id)) errors.push(`Parecer de unidade inexistente: ${id}`);
    errors.push(...validateReview(review).map(error => `${id}: ${error}`));
  }
  return { errors, grades, changed: new Set(changed), units, counts };
}

export function validateReview(review) {
  if (!review || typeof review !== 'object') return ['Parecer editorial inválido.'];
  const errors = [];
  if (!['A', 'B', 'C', 'D'].includes(review.grade)) errors.push('Nota atual deve ser A/B/C/D.');
  if (!review.reviewer?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedOn ?? '')) {
    errors.push('Parecer precisa de revisor e data de revisão.');
  }
  if (!review.summary?.trim()) errors.push('Parecer precisa de justificativa específica.');
  if (!/^[0-9a-f]{64}$/.test(review.contentSha256 ?? '')) {
    errors.push('Parecer precisa vincular SHA-256 do conteúdo exato revisado.');
  }
  if (review.grade === 'A') {
    if (!review.author?.trim() || review.author.trim() === review.reviewer?.trim()) {
      errors.push('A exige revisão por pessoa diferente da autoria.');
    }
    for (const dimension of DIMENSIONS) {
      const score = review.scores?.[dimension];
      if (!Number.isFinite(score) || score < 80 || score > 100) {
        errors.push(`A exige ${dimension} entre 80 e 100, baseado em avaliação editorial.`);
      }
    }
    for (const gate of A_GATES) {
      if (review.gates?.[gate] !== true) errors.push(`A exige gate ${gate} comprovado.`);
    }
    if (!Array.isArray(review.evidence) || review.evidence.length < 6 ||
        review.evidence.some(e => !e.dimension || !DIMENSIONS.includes(e.dimension) ||
          !e.reference?.trim() || !e.result?.trim() || !e.method?.trim()) ||
        DIMENSIONS.some(d => !review.evidence.some(e => e.dimension === d))) {
      errors.push('A exige evidência individualizada de todas as seis dimensões, com método, referência e resultado.');
    }
  }
  return errors;
}

function headings(text) {
  return [...text.matchAll(/^(#{1,4})\s+(.+)$/gm)].map(m => ({
    label: m[2].trim(), line: text.slice(0, m.index).split('\n').length
  }));
}

export function screenChangedUnit(text, contentPath, exists = () => true) {
  const titleLines = headings(text);
  const hints = Object.fromEntries(Object.entries(TITLE_PATTERNS).map(([key, pattern]) => {
    const heading = titleLines.find(h => pattern.test(h.label));
    return [key, heading ? { found: true, line: heading.line, heading: heading.label } : { found: false, line: null, heading: null }];
  }));
  const findings = [];
  const referencedLabPaths = [...new Set((text.match(LAB_LINK) ?? []).map(s => s.replace(/[.,;:]+$/, '')))];
  for (const labPath of referencedLabPaths) {
    if (labPath.includes('..') || !exists(`public${labPath}`)) {
      findings.push({ code: 'LAB_PATH_UNRESOLVED', severity: 'high', evidence: labPath,
        note: 'Referência a artefato local não encontrada ou inválida; conferir acesso e execução.' });
    }
  }
  if (QUIZ_TEMPLATE.test(text)) findings.push({ code: 'GENERIC_QUIZ_CUE', severity: 'medium',
    evidence: 'enunciado padrão', note: 'Questão aparentemente genérica; revisar transferência de aprendizagem e distratores.' });
  for (const key of ['problema', 'mecanismo', 'exemplo', 'pratica', 'avaliacao']) {
    if (!hints[key].found) findings.push({ code: `HEADING_${key.toUpperCase()}_NOT_IDENTIFIED`, severity: 'review',
      evidence: contentPath, note: 'Estrutura não localizada por cabeçalhos; verificar se o objetivo está coberto por outra organização.' });
  }
  return {
    sha256: createHash('sha256').update(text).digest('hex'),
    method: 'triagem estática de cabeçalhos e referências; não é revisão técnica ou pedagógica completa',
    structuralIndicators: hints,
    labReferences: referencedLabPaths,
    findings,
    pendingEvidence: ['revisão de precisão técnica', 'execução/observação da prática aplicável',
      'revisão independente de quiz e distratores', 'teste com aprendiz iniciante',
      'avaliação editorial das seis dimensões']
  };
}

export function buildQualityReport(catalog, registry, root) {
  const { errors, grades, changed, units, counts } = validateRegistry(catalog, registry);
  if (errors.length) throw new Error(errors.join('\n'));
  const records = units.map(item => {
    const id = canonicalCode(item);
    const contentPath = normalContentPath(item);
    const absPath = path.join(root, contentPath);
    if (!fs.existsSync(absPath)) throw new Error(`${id}: conteúdo não encontrado: ${contentPath}`);
    const markdown = fs.readFileSync(absPath, 'utf8');
    const review = registry.editorialReviews?.[id] ?? null;
    const actualHash = createHash('sha256').update(markdown).digest('hex');
    if (review && review.contentSha256 !== actualHash) {
      throw new Error(`${id}: conteúdo modificado após parecer editorial; revisar antes de classificar.`);
    }
    const changedIn16 = changed.has(id);
    const screening = changedIn16 ? screenChangedUnit(markdown, contentPath, relative => fs.existsSync(path.join(root, relative))) : null;
    return {
      id, kind: item.kind, title: item.title, track: item.track, contentPath,
      baselinePhase15: grades[id], baselineIsHistorical: true,
      changedInPhase16: changedIn16,
      screeningStatus: changedIn16 ? 'triagem_estatica_concluida' : 'reavaliacao_nao_iniciada',
      currentGrade: review?.grade ?? null,
      editorialStatus: review ? 'parecer_editorial_registrado' : 'parecer_editorial_pendente',
      // Explicit remaining work for EVERY unit; historical complaints are not asserted against new content.
      remaining: screening?.findings ?? [{ code: 'POST_BASELINE_REVIEW_PENDING', severity: 'review',
        evidence: contentPath, note: 'Aplicar revisão atual; nota F15 não prova estado presente.' }],
      pendingEvidence: screening?.pendingEvidence ?? ['reavaliação editorial em seis dimensões', 'validação independente dos resultados'],
      screening, review
    };
  });
  return {
    schemaVersion: 1,
    provenance: { historical: registry.historical.source, checkpoint: registry.changeTracking.source,
      identity: registry.identitySource },
    summary: {
      total: records.length, main: catalog.main.length, parallel: catalog.parallel.length,
      historicalGrades: { A: counts.A ?? 0, B: counts.B, C: counts.C, D: counts.D },
      changedAndScreenedPhase16: records.filter(u => u.screeningStatus === 'triagem_estatica_concluida').length,
      untouchedPendingCurrentReview: records.filter(u => u.screeningStatus === 'reavaliacao_nao_iniciada').length,
      currentGradeA: records.filter(u => u.currentGrade === 'A').length,
      currentGradeUnassigned: records.filter(u => u.currentGrade === null).length
    }, records
  };
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\r\n;]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
export function reportToCsv(report) {
  const lines = ['id;tipo;trilha;titulo;nota_historica_f15;mudou_f16;estado_triagem;nota_atual;parecer_editorial;problemas_ou_verificacoes_pendentes;arquivo'];
  for (const x of report.records) {
    lines.push([
      x.id, x.kind, x.track, x.title, x.baselinePhase15, x.changedInPhase16,
      x.screeningStatus, x.currentGrade ?? 'NÃO ATRIBUÍDA', x.editorialStatus,
      x.remaining.map(y => y.code).concat(x.pendingEvidence).join(' | '), x.contentPath
    ].map(csvCell).join(';'));
  }
  return '\ufeff' + lines.join('\n') + '\n';
}