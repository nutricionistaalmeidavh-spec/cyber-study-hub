/**
 * REA didático — motor local sem agentes externos, rede ou serviços pagos.
 * Oito oficinas com saídas distintas e evidências separadas.
 */
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,resolve,basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {classifyTicket} from './reference.mjs';
import {classifyCandidate} from './candidate.mjs';
const here=fileURLToPath(new URL('.',import.meta.url));
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const valid=(severity,impact,blocked=false)=>({severity,impact,blocked});
const samples=[valid(0,0),valid(4,5,true),valid(8,0,true),valid(8,1,true),valid(10,10,true)];
function observed(input){
 try{return {type:'success',value:classifyTicket(input)}}
 catch(error){return {type:'error',name:error.name,message:error.message}}
}
function own(input){
 try{return {type:'success',value:classifyCandidate(input)}}
 catch(error){return {type:'error',name:error.name,message:error.message}}
}
function testRow(input){return {input,expected:observed(input),candidate:own(input),match:JSON.stringify(observed(input))===JSON.stringify(own(input))}}
function requireAll(rows){if(rows.some(row=>!row.match))throw Error('Reimplementação divergente; reveja candidate.mjs');}
function note(limits){return {scope:'Aplicação de autoria do curso; não software de terceiros',limitation:limits,externalToolExecuted:false,localCoreFree:true}}
function one(){
 const inputs=[valid(3,1),valid(8,1,true),valid(0,0),valid(10,10,true),{severity:-1,impact:1,blocked:false}];
 const rows=inputs.map(testRow);requireAll(rows);
 return {'01-baseline.json':{module:1,hypothesis:'A pontuação cresce com severidade e impacto; entradas inválidas são rejeitadas',cases:rows,evidence:note('Cinco casos não revelam todas as regras do programa')}};
}
function two(){
 const inputs=[valid(0,0),valid(6,1),valid(7,0),valid(8,0,true),valid(8,1,true),valid(9,9,true),valid(11,0),valid(1,-1),valid(1,2,'true')];
 const rows=inputs.map(testRow);requireAll(rows);
 const coverage={validCases:rows.filter(x=>x.expected.type==='success').length,rejectedCases:rows.filter(x=>x.expected.type==='error').length,criticalBoundary:{score21:observed(valid(8,0,true)),score22:observed(valid(8,1,true))},hypotheses:[{claim:'22 é crítico',falsification:'Verificar 21 e 22',observed:true},{claim:'blocked deve ser boolean',falsification:'Enviar string true',observed:true}]};
 return {'02-matrix.json':{module:2,cases:rows,evidence:note('A matriz é amostragem, não exaustiva')},'02-coverage.json':coverage};
}
function three(){
 const file=join(here,'sample.c'),source=readFileSync(file,'utf8');
 const functions=[...source.matchAll(/\b(?:static\s+)?int\s+(parse|main)\s*\(/g)].map(x=>x[1]);
 const symbols=['score','critical','high','normal','strtol'].filter(s=>source.includes(s));
 const evidence={sourceFile:'sample.c',sha256:hash(source),functions,symbols,decisionPoints:['score>=22','score>=14'].filter(x=>source.includes(x)),compilerExecuted:false,decompilerExecuted:false,ghidraInstructions:'Compile no computador: cc -O0 -g -Wall -Wextra -Werror sample.c -o sample; abra sample no Ghidra; compare funções parse e main com este mapa do código próprio'};
 if(!functions.includes('main')||!source.includes('score>=22'))throw Error('A fixture C foi alterada e precisa de revisão');
 return {'03-static-source-map.json':{module:3,...evidence,evidence:note('Mapa extraído do código C próprio; não finge análise de binário no Ghidra')}};
}
function four(){
 const inputs=[valid(8,0,true),valid(8,1,true),valid(0,0,false),valid(10,10,true)];
 const traces=inputs.map(input=>{
  const score=input.severity*2+input.impact+(input.blocked?5:0);
  const branch=score>=22?'critical':score>=14?'high':'normal';
  const result=observed(input);
  return {input,trace:[{stage:'validate',accepted:true},{stage:'score',value:score},{stage:'branch',chosen:branch}],result,verified:result.type==='success'&&result.value.score===score&&result.value.priority===branch};
 });
 if(traces.some(t=>!t.verified))throw Error('Ramo previsto divergiu da referência');
 return {'04-controlled-trace.json':{module:4,traces,evidence:note('Trace é instrumentação DIDÁTICA reconstruída; não é captura do processo real nem debugger')}};
}
function five(){
 const source=readFileSync(join(here,'sample-ui.mjs'),'utf8');
 const contract=readFileSync(join(here,'sample-rule.mjs'),'utf8');
 const imports=[...source.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g)].map(x=>x[1]);
 if(!imports.includes('./sample-rule.mjs'))throw Error('Fixture JS perdeu fronteira UI/regra');
 const result={module:5,files:[{name:'sample-ui.mjs',sha256:hash(source),imports},{name:'sample-rule.mjs',sha256:hash(contract),imports:[]}],boundaries:[{origin:'sample-ui.mjs',target:'sample-rule.mjs',kind:'import estático',visibility:'somente aplicação local'},{origin:'sample-ui.mjs',target:'servidor remoto',kind:'não observado',visibility:'backend não inferível'}],evidence:note('Extração estática de fontes próprias; não equivale a descompilar Electron de terceiro')};
 return {'05-js-boundaries.json':result};
}
function six(){
 const cases=[{claim:'o classificador aceita severity=8, impact=1, blocked=true',evidence:observed(valid(8,1,true)),status:'verified_local'},{claim:'a IA executou Ghidra automaticamente',evidence:null,status:'not_verified_do_not_claim'},{claim:'REA recupera todo código original sem limites',evidence:null,status:'unfounded_reject'}];
 return {'06-agent-evidence.json':{module:6,workflow:['Definir escopo autorizado','Coletar evidências com comando verificável','Opcional: conectar REA MCP a um agente local configurado','Conferir manualmente cada afirmação','Registrar observações e limitações'],claims:cases,reaExecuted:false,ghidraExecuted:false,evidence:note('REA, MCP e Ghidra são passos opcionais reais; motor não simula sua execução')}};
}
function seven(){
 const values=[0,1,5,7,8,9,10],rows=[];
 for(const severity of values)for(const impact of values)for(const blocked of [false,true])rows.push(testRow(valid(severity,impact,blocked)));
 for(const bad of [null,[],valid(-1,0),valid(0,11),{severity:2,impact:1,blocked:'yes'}])rows.push(testRow(bad));
 requireAll(rows);
 const mutated=valid(8,1,true);
 const original=classifyTicket(mutated);
 const mutant={...original,priority:'high'};
 const killed=JSON.stringify(original)!==JSON.stringify(mutant);
 if(!killed)throw Error('Mutação não detectada');
 return {'07-differential-report.json':{module:7,totalCases:rows.length,matching:rows.filter(x=>x.match).length,regressionFailures:rows.filter(x=>!x.match),mutation:{input:mutated,expected:original,mutatedOutput:mutant,killed},evidence:note('Teste diferencial por amostragem e mutante sintético; não é prova formal de equivalência')}};
}
function eight(){
 const outputs=[one(),two(),three(),four(),five(),six(),seven()];
 const chapters=outputs.map((obj,i)=>({module:i+1,artifacts:Object.entries(obj).map(([name,data])=>({name,sha256:hash(JSON.stringify(data))}))}));
 if(chapters.some(x=>!x.artifacts.length))throw Error('Capstone incompleto');
 const report=['# Dossiê de Engenharia Reversa','', 'Escopo: artefatos próprios, local e R$0.', ...chapters.map(x=>'Módulo '+x.module+': '+x.artifacts.map(a=>a.name).join(', ')),'','Limite: evidências didáticas e testes locais não garantem equivalência universal.','REA/Ghidra são opcionais e não foram executados pelo gerador.'].join('\n')+'\n';
 return {'08-capstone-manifest.json':{module:8,chapters,evidence:note('Hashes permitem verificar artefatos, não são atestado externo de auditoria')},'08-report.md':report};
}
export const modules=[one,two,three,four,five,six,seven,eight];
export function runModule(moduleId,outputDir){
 if(!Number.isInteger(moduleId)||moduleId<1||moduleId>8)throw RangeError('module must be 1..8');
 if(typeof outputDir!=='string'||!outputDir.trim())throw TypeError('output directory is required');
 const files=modules[moduleId-1](),dir=resolve(outputDir);mkdirSync(dir,{recursive:true});
 const names=Object.keys(files);
 for(const [name,value] of Object.entries(files))writeFileSync(join(dir,name),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n','utf8');
 return {module:moduleId,dir,files:names,summary:'Artefatos próprios criados sem rede; verifique e documente suas observações'};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const moduleIndex=process.argv.indexOf('--module'),outIndex=process.argv.indexOf('--out');
 try{
  const moduleId=Number(process.argv[moduleIndex+1]),out=process.argv[outIndex+1];
  if(moduleIndex<0||outIndex<0||!out||!/^\d+$/.test(process.argv[moduleIndex+1]||''))throw Error('Uso: node public/course-labs/reverse-ai/engine.mjs --module 1..8 --out ./rev-evidencias');
  console.log(JSON.stringify(runModule(moduleId,out),null,2));
 }catch(error){console.error(error.message);process.exitCode=2}
}
