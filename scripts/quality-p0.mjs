import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildQualityReport, reportToCsv } from './lib/quality-p0.mjs';
import { buildCanonicalInventory, canonicalCsv } from './lib/canonicalInventory.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/curriculum/catalog.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(root, 'quality/registry.json'), 'utf8'));
const report = buildQualityReport(catalog, registry, root);
if (process.argv.includes('--write')) {
  const output = path.join(root, 'reports/quality');
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'status-543.json'), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(output, 'status-543.csv'), reportToCsv(report));
  fs.writeFileSync(path.join(output, 'triagem-66.json'), JSON.stringify({
    provenance: report.provenance,
    summary: report.summary,
    records: report.records.filter(u => u.changedInPhase16)
  }, null, 2) + '\n');
  const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
  const all=buildCanonicalInventory(catalog,
    load('src/trails/ai-dev/manifest.json'),load('src/trails/channel-dark/manifest.json'),
    registry,load('quality/trails/ai-dev/reviews.json'),load('quality/trails/channel-dark/reviews.json'),
    load('src/trails/reverse-ai/manifest.json'),load('quality/trails/reverse-ai/reviews.json'));
  fs.writeFileSync(path.join(output,'canonical-inventory.json'),JSON.stringify(all,null,2)+'\n');
  fs.writeFileSync(path.join(output,'canonical-inventory.csv'),canonicalCsv(all));
  console.log('Relatórios gerados: 543 IDs históricos no status-543 e '+all.summary.all+' IDs no inventário canônico consolidado.');
} else {
  console.log(`Quality P0 OK — ${report.summary.total} identidades canônicas; ` +
    `${report.summary.changedAndScreenedPhase16} unidades da Fase 16 triadas; ` +
    `${report.summary.currentGradeUnassigned} sem nota editorial atual. Nenhuma promoção automática.`);
}