import { readFile } from 'node:fs/promises';
// Valida referências do modelo; não comprova os controles do sistema representado.
const risk = JSON.parse(await readFile(new URL('./risk-cases.json', import.meta.url)));
const model = JSON.parse(await readFile(new URL('./stride-model.json', import.meta.url)));
const flowIds = new Set(model.flows.map(f => f.id));
for (const threat of model.threats) if (!flowIds.has(threat.flow)) throw new Error(`Fluxo ausente: ${threat.flow}`);
console.table(risk.cases.map(({ id, primary, evidence }) => ({ id, primary, evidence })));
console.table(model.threats.map(({ id, category, flow, test }) => ({ id, category, flow, test })));
console.log('Modelo com 4 casos CIA/risco e 6 ameaças referenciando fluxos existentes. Controles ainda exigem seus testes próprios.');
