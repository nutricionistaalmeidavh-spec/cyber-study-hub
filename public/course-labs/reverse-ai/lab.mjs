// Runner local determinístico dos oito módulos — Node.js 22+. Não acessa a rede.
import {pathToFileURL} from 'node:url';
import {classifyTicket} from './reference.mjs';
import {classifyCandidate} from './candidate.mjs';
export const scenarios=[
 {focus:'baseline',input:{severity:3,impact:1,blocked:false},invalid:{severity:-1,impact:1,blocked:false}},
 {focus:'boundary',input:{severity:6,impact:3,blocked:false},invalid:{severity:6,impact:11,blocked:false}},
 {focus:'native mapping',input:{severity:8,impact:2,blocked:true},invalid:{severity:8,impact:2,blocked:'yes'}},
 {focus:'dynamic trace',input:{severity:10,impact:0,blocked:false},invalid:{severity:1.5,impact:0,blocked:false}},
 {focus:'JS mapping',input:{severity:4,impact:5,blocked:true},invalid:null},
 {focus:'agent evidence',input:{severity:0,impact:0,blocked:false},invalid:{severity:'x',impact:0,blocked:false}},
 {focus:'differential',input:{severity:8,impact:1,blocked:true},invalid:{severity:8,impact:null,blocked:true}},
 {focus:'capstone',input:{severity:10,impact:10,blocked:true},invalid:{severity:10,impact:10,blocked:0}}
];
export function inspectModule(moduleId){
 if(!Number.isInteger(moduleId)||moduleId<1||moduleId>8)throw new RangeError('module must be 1..8');
 const scenario=scenarios[moduleId-1];
 const expected=classifyTicket(scenario.input),candidate=classifyCandidate(scenario.input);
 let rejected=false,reason='';
 try{classifyTicket(scenario.invalid)}catch(error){rejected=true;reason=error.name+': '+error.message}
 return {moduleId,focus:scenario.focus,input:scenario.input,observed:expected,candidate,
  differentialMatch:JSON.stringify(expected)===JSON.stringify(candidate),
  negativeControl:{input:scenario.invalid,rejected,reason},
  limitation:'Somente amostras do programa próprio foram executadas; não prova equivalência geral nem segurança de produção'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const arg=process.argv.indexOf('--module');
 if(arg<0||!/^\d+$/.test(process.argv[arg+1]||'')){
  console.error('Uso: node public/course-labs/reverse-ai/lab.mjs --module 1..8');process.exitCode=2;
 }else{
  try{console.log(JSON.stringify(inspectModule(Number(process.argv[arg+1])),null,2))}
  catch(error){console.error(error.message);process.exitCode=2}
 }
}
