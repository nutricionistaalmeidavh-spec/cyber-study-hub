import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root = process.cwd();
const catalogue = JSON.parse(fs.readFileSync(path.join(root,'src/curriculum/catalog.json')));
const registry = JSON.parse(fs.readFileSync(path.join(root,'quality/registry.json')));
const audit = JSON.parse(fs.readFileSync(path.join(root,'quality/reviews/a-002-008-2026-10-13.json')));
const dims = ['conteudoTecnico','didatica','pratica','defesa','avaliacao','especificidade'];
const gates = ['precisaoRevisada','didaticaInicianteValidada','praticaVerificada','avaliacaoIndependenteRevisada','escopoSeguroVerificado','revisorIndependente'];
assert.equal(catalogue.main.length,218);assert.equal(catalogue.parallel.length,325);
assert.equal(Object.keys(audit.units).length,7);
for(let id=2;id<=8;id++){
 const code=`AULA-${String(id).padStart(3,'0')}`;
 const name=String(id).padStart(3,'0');
 const contentPath=`public/course-library/main/${name}.md`;
 const lesson=fs.readFileSync(path.join(root,contentPath),'utf8');
 const key=fs.readFileSync(path.join(root,'public/course-labs/a-002-008/answer-keys',`${code}.md`),'utf8');
 assert.equal(catalogue.main.find(x=>x.id===id).contentPath,`/course-library/main/${name}.md`);
 assert.ok(lesson.includes('## 17. Prova final independente — competência aplicada'),`${code} sem transferência`);
 const questions=lesson.split('## 17. Prova final independente — competência aplicada')[1].split('## 18. Retenção')[0];
 assert.equal((questions.match(/^\d+\. /gm)||[]).length,6,`${code} sem seis questões novas`);
 assert.equal((key.match(/^## Questão \d+/gm)||[]).length,6,`${code} sem seis respostas`);
 assert.equal((key.match(/\*\*Erro eliminatório:\*\*/gm)||[]).length,6,`${code} sem erros eliminatórios`);
 assert.ok(key.includes('## Rubrica de correção'));
 assert.ok(!/Qual ideia resume melhor/.test(questions),'questão genérica');
 assert.ok(!/const input="lab"/.test(lesson),'código genérico não removido');
 for(const part of ['## 15. Laboratório reproduzível','## 16. Defesa, evidências e reteste','### Exemplo resolvido','### Mecanismo, conceitos e limites'])assert.ok(lesson.includes(part),`${code} sem ${part}`);
 const hash=createHash('sha256').update(lesson).digest('hex');
 const entry=registry.editorialReviews[code];const review=audit.units[code];
 assert.equal(hash,entry.contentSha256,`${code} hash canônico desatualizado`);
 assert.equal(hash,review.contentSha256,`${code} hash parecer desatualizado`);
 assert.equal(entry.grade,'A');
 assert.equal(entry.humanLearnerTesting,'not_performed');
 assert.equal(entry.reviewMethod,'ai_editorial_second_pass');
 assert.ok(entry.author!==entry.reviewer);
 for(const d of dims){assert.ok(entry.scores[d]>=80&&entry.scores[d]<=100,`${code} nota ${d}`);assert.ok(entry.evidence.some(x=>x.dimension===d && x.method && x.reference && x.result),`${code} evidência ${d}`)}
 for(const g of gates)assert.equal(entry.gates[g],true,`${code} gate ${g}`);
 assert.ok(review.technicalSources.length>0);
 for(const link of [...lesson.matchAll(/\]\((\/course-labs\/[\w./-]+)\)/g)].map(x=>x[1]))assert.ok(fs.existsSync(path.join(root,'public',link)),`${code} link quebrado ${link}`);
 console.log(`PASS ${code} — A editorial IA, conteúdo hash ${hash.slice(0,14)}`);
}
const allA=Object.entries(registry.editorialReviews).filter(([,r])=>r.grade==='A');
assert.equal(allA.length,15,'Esperado 8 antigos + 7 novos, sem alterar as demais aulas');
console.log('PASS 7/7 novos A editoriais e 15/543 A canônicos; 528 sem nota atual; sem estudo humano alegado.');
