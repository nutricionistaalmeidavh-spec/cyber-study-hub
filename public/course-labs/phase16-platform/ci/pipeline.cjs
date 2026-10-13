'use strict';
const {readNote}=require('./app.cjs');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const unsafe=process.argv.includes('--unsafe');
const out=path.join(__dirname,unsafe?'out-unsafe':'out-safe');
// Remova só saídas deste exercício para não aceitar artefato residual de execução anterior.
fs.rmSync(out,{recursive:true,force:true});
for(const [user,id,status] of [['alice','a',200],['bob','b',200],['alice','b',403],[null,'a',401],['alice','z',404]]) {
  assert.equal(readNote(user,id,unsafe).status,status,`gate: ${user}/${id}`);
}
// O pacote não possui dependências npm. Este inventário fixo NÃO é um scanner CVE.
const bytes=Buffer.from(JSON.stringify({version:1,notes:['nota A','nota B']})+'\n');
fs.mkdirSync(out);
fs.writeFileSync(path.join(out,'artifact.json'),bytes);
const digest=createHash('sha256').update(bytes).digest('hex');
fs.writeFileSync(path.join(out,'artifact.sha256'),digest+'  artifact.json\n');
console.log('PASS 5 gates; artifact SHA256 '+digest);
