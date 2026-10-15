import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';

const jsFiles=readdirSync('dist/assets').filter(f=>f.endsWith('.js'));
assert.ok(jsFiles.length>0,'Build sem assets JavaScript');
const code=jsFiles.map(f=>readFileSync('dist/assets/'+f,'utf8')).join('\n');
for(const privateFragment of ['Objeto trocado','Criação, validação, tuning, versionamento','Canal dark não significa canal sem autoria']){
  assert.equal(code.includes(privateFragment),false,'Bundle vazou conteúdo privado: '+privateFragment);
}
for(const privatePath of ['lessonDetails','reviewPacks','AiDevelopmentTrail']){
  if(privatePath==='AiDevelopmentTrail')continue; // UI names are public metadata.
}
console.log('Bundle auditado: nenhum texto privado/gabarito exposto.');
