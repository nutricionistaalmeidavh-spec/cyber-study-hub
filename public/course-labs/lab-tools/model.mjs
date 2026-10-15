import catalog from './scenarios.json' with {type:'json'};
const entries=new Map(catalog.scenarios.map(item=>[item.code,item]));
const same=(a,b)=>typeof a===typeof b&&Object.is(a,b);
/** Avaliador local de contratos/fixtures; NÃO substitui o programa indicado pela aula. */
export function assessToolLab(code,input){
 const scenario=entries.get(code);
 if(!scenario)return {status:'UNKNOWN_LAB'};
 if(!input||typeof input!=='object'||Array.isArray(input)||!Object.hasOwn(input,scenario.field)||!same(typeof input[scenario.field],typeof scenario.expected))return {status:'INVALID_INPUT'};
 return {status:same(input[scenario.field],scenario.expected)?'EXPECTED_LOCAL_CASE':'REVIEW_NEGATIVE_CASE',caseId:input.caseId??null,criterion:scenario.field,actual:input[scenario.field],expected:scenario.expected,toolExecuted:false};
}
export function runToolLab(code){
 const item=entries.get(code);
 if(!item)return {status:'UNKNOWN_LAB'};
 return {lab:code,title:item.title,positive:assessToolLab(code,item.positive),negative:assessToolLab(code,item.negative)};
}
export const listToolLabs=()=>[...entries.keys()];
