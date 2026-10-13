const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const d=path.join(__dirname,'out-safe');
const expected=fs.readFileSync(path.join(d,'artifact.sha256'),'utf8').split(' ')[0];
const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(d,'artifact.json'))).digest('hex');
assert.equal(actual,expected,'artefato alterado depois do gate');
console.log('PASS digest confere; isto prova integridade relativa ao digest, não autoria');
