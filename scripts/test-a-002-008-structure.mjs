// Gate independente de estrutura para usar ANTES da promoção de notas.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
for(let id=2;id<=8;id++){
 const code=`AULA-${String(id).padStart(3,'0')}`;
 const text=fs.readFileSync(path.join(root,`public/course-library/main/${String(id).padStart(3,'0')}.md`),'utf8');
 const gabarito=fs.readFileSync(path.join(root,`public/course-labs/a-002-008/answer-keys/${code}.md`),'utf8');
 assert.equal((text.match(/^\d\. /gm)||[]).length>=6,true);
 assert.equal((gabarito.match(/^## Questão /gm)||[]).length,6);
 assert.match(text,/## 17\. Prova final independente/);
 assert.match(text,/## 15\. Laboratório reproduzível/);
 assert.ok(!text.includes('const input="lab"'));
 const links=[...text.matchAll(/\]\((\/course-labs\/[\w./-]+)\)/g)].map(x=>x[1]);
 for(const link of links)assert.ok(fs.existsSync(path.join(root,'public'+link)),`Arquivo de lab inexistente ${link}`);
 console.log(`${code} conteúdo e links OK`);
}
