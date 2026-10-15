import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {runModule} from './engine.mjs';
const withDir=fn=>{const dir=mkdtempSync(join(tmpdir(),'hub-reverse-ai-'));try{return fn(dir)}finally{rmSync(dir,{force:true,recursive:true})}};
test('oito módulos produzem evidências independentes e verificáveis, sem API',()=>{
 withDir(dir=>{
  const all=new Set();
  for(let id=1;id<=8;id++){
   const result=runModule(id,join(dir,String(id)));
   assert.equal(result.module,id);assert.ok(result.files.length>=1);
   for(const name of result.files){
    assert.ok(!all.has(name),'arquivo reaproveitado sem identidade: '+name);all.add(name);
    assert.ok(existsSync(join(result.dir,name)));
    assert.ok(readFileSync(join(result.dir,name),'utf8').length>100);
   }
  }
  assert.ok(all.size>=9);
 });
});
test('M02 prova fronteira e rejeita entradas inválidas',()=>withDir(dir=>{
 runModule(2,dir);
 const coverage=JSON.parse(readFileSync(join(dir,'02-coverage.json')));
 assert.equal(coverage.criticalBoundary.score21.value.score,21);
 assert.equal(coverage.criticalBoundary.score22.value.score,22);
 assert.ok(coverage.rejectedCases>=3);
}));
test('M03 informa que Ghidra não foi executado e orienta análise C real',()=>withDir(dir=>{
 runModule(3,dir);const report=JSON.parse(readFileSync(join(dir,'03-static-source-map.json')));
 assert.ok(report.functions.includes('main'));
 assert.equal(report.decompilerExecuted,false);
 assert.match(report.ghidraInstructions,/Ghidra/);
}));
test('M04 valida ramos traçados contra saída de referência',()=>withDir(dir=>{
 runModule(4,dir);
 const traces=JSON.parse(readFileSync(join(dir,'04-controlled-trace.json'))).traces;
 assert.ok(traces.length>=4 && traces.every(x=>x.verified));
}));
test('M05 distingue código client e servidor inferido',()=>withDir(dir=>{
 runModule(5,dir);
 const boundaries=JSON.parse(readFileSync(join(dir,'05-js-boundaries.json'))).boundaries;
 assert.ok(boundaries.some(x=>x.kind==='não observado'));
}));
test('M06 não inventa análise com agentes externos',()=>withDir(dir=>{
 runModule(6,dir);
 const audit=JSON.parse(readFileSync(join(dir,'06-agent-evidence.json')));
 assert.equal(audit.reaExecuted,false);
 assert.ok(audit.claims.some(x=>x.status==='unfounded_reject'));
}));
test('M07 prova capacidade de detectar mutante e comparar saídas',()=>withDir(dir=>{
 runModule(7,dir);
 const data=JSON.parse(readFileSync(join(dir,'07-differential-report.json')));
 assert.equal(data.totalCases,data.matching);
 assert.ok(data.totalCases>=90);
 assert.equal(data.mutation.killed,true);
}));
test('M08 publica hashes por módulo e deixa limites explícitos',()=>withDir(dir=>{
 runModule(8,dir);
 const data=JSON.parse(readFileSync(join(dir,'08-capstone-manifest.json')));
 assert.equal(data.chapters.length,7);
 for(const chapter of data.chapters)for(const entry of chapter.artifacts)assert.match(entry.sha256,/^[a-f0-9]{64}$/);
 assert.match(readFileSync(join(dir,'08-report.md'),'utf8'),/não garantem equivalência universal/);
}));
test('fail-closed para número inválido e caminho ausente',()=>{
 for(const id of [0,9,-1,1.2,NaN])assert.throws(()=>runModule(id,'./tmp'));
 assert.throws(()=>runModule(1,''),TypeError);
});
