import assert from 'node:assert/strict';
import fs from 'node:fs';
const registry=JSON.parse(fs.readFileSync('quality/registry.json','utf8'));
const expected=[...Array.from({length:90},(_,i)=>'AULA-'+String(i+1).padStart(3,'0')),'AULA-160','AULA-166','LOG-01','NET-25','PY-01'];
assert.equal(new Set(expected).size,95);
for(const id of expected){
  assert.equal(registry.editorialReviews[id]?.grade,'A','Nota A perdida: '+id);
  assert.match(registry.editorialReviews[id]?.contentSha256??'',/^[0-9a-f]{64}$/,'SHA faltante em '+id);
}
const total=Object.values(registry.editorialReviews).filter(x=>x.grade==='A').length;
assert.ok(total>=95,'Regressão editorial: esperado pelo menos 95 A, atual '+total);
console.log('PASS: as 95 notas A iniciais permanecem (001–090 + cinco unidades piloto).');
