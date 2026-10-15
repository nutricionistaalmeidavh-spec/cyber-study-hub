// Estudos determinísticos de pesquisa de vulnerabilidades: apenas strings e objetos sintéticos.
import {createHash} from 'node:crypto';
const digest=value=>createHash('sha256').update(String(value)).digest('hex');
const ownText=x=>typeof x==='string' && x.length>0;
const safeRecord=s=>typeof s==='string' && /^R:[A-Z]{1,8}$/.test(s);
const sampleInputs=['R:A','R:ABC','R:TOOLONGNAME','R:123','bad','R:XYZ','R:','R:AAAAAAAA'];
const observedPath=({declared,actual,capacity})=>Number.isInteger(declared)&&Number.isInteger(actual)&&Number.isInteger(capacity)&&declared>=0&&actual>=0&&capacity>0;
export function evaluateResearch(id,x){
 if(!x||typeof x!=='object'||Array.isArray(x))return {status:'INVALID_INPUT'};
 switch(Number(id)){
 case 171: {
   if(!Array.isArray(x.inputs)||x.inputs.length===0||!x.inputs.every(ownText))return {status:'INVALID_INPUT'};
   const invalid=x.inputs.filter(v=>!safeRecord(v));
   return {status:invalid.length?'REJECTED_MALFORMED':'VALID_RECORDS',invalidCount:invalid.length,executed:x.inputs.length,realFuzzer:false};
 }
 case 172: {
   if(!Array.isArray(x.inputs)||!x.inputs.every(ownText)||x.inputs.length===0)return {status:'INVALID_INPUT'};
   const paths=[...new Set(x.inputs.map(v=>safeRecord(v)?'accepted':v.startsWith('R:')?'bad-payload':'bad-prefix'))].sort();
   return {status:paths.length>=3?'BRANCHES_COVERED':'COVERAGE_GAP',paths,coveragePaths:paths.length,libFuzzerExecuted:false};
 }
 case 173: {
   if(!ownText(x.log)||typeof x.exitCode!=='number')return {status:'INVALID_INPUT'};
   const pattern=/AddressSanitizer|runtime error:|UndefinedBehaviorSanitizer/i.test(x.log);
   return {status:pattern&&x.exitCode!==0?'SANITIZER_SIGNAL':pattern?'REVIEW_EXIT_STATUS':'NO_SANITIZER_SIGNAL',sanitizerRun:false};
 }
 case 174: {
   if(!ownText(x.input)||typeof x.reproduced!=='boolean')return {status:'INVALID_INPUT'};
   const triggers=x.input.includes('!')&&x.reproduced;
   const min=triggers?'!':null;
   return {status:triggers?'MINIMAL_REPRO':'NOT_REPRODUCED',minimal:min,originalLength:x.input.length};
 }
 case 175: {
   if(!observedPath(x))return {status:'INVALID_INPUT'};
   return {status:x.declared>x.capacity||x.declared>x.actual?'LENGTH_BOUNDARY_FAIL':'LENGTH_BOUNDARY_OK',declared:x.declared,actual:x.actual,capacity:x.capacity};
 }
 case 176: {
   if(!Array.isArray(x.runs)||x.runs.length!==3||!x.runs.every(v=>v==='REJECT' || v==='ACCEPT'))return {status:'INVALID_INPUT'};
   return {status:x.runs.every(v=>v===x.runs[0])?'REPRODUCIBLE':'NON_DETERMINISTIC',runs:x.runs};
 }
 case 177: {
   if(!ownText(x.sample)||typeof x.accepted!=='boolean')return {status:'INVALID_INPUT'};
   return {status:!safeRecord(x.sample)&&!x.accepted?'SAFE_REJECTION_PROVEN':safeRecord(x.sample)&&x.accepted?'LEGITIMATE_ACCEPTED':'REGRESSION',exploitExecuted:false};
 }
 case 178: {
   if(!observedPath(x)||typeof x.fixedGuard!=='boolean')return {status:'INVALID_INPUT'};
   const unsafe=x.declared>x.capacity || x.declared>x.actual;
   return {status:unsafe&&x.fixedGuard?'PATCH_BLOCKS_UNSAFE':unsafe?'MISSING_BOUNDARY_CHECK':'NO_TRIGGER',codePatchApplied:false};
 }
 case 179: {
   if(!Array.isArray(x.functions)||!x.functions.every(v=>v&&ownText(v.name)&&typeof v.boundsCheck==='boolean'))return {status:'INVALID_INPUT'};
   const candidates=x.functions.filter(v=>!v.boundsCheck).map(v=>v.name);
   return {status:candidates.length?'VARIANTS_TO_REVIEW':'NO_VARIANTS_IN_FIXTURE',candidates,confirmedVulnerability:false};
 }
 case 180: {
   if(!ownText(x.advisory)||!ownText(x.installed)||!Array.isArray(x.affectedVersions)||!x.affectedVersions.every(ownText)||typeof x.evidenceVerified!=='boolean')return {status:'INVALID_INPUT'};
   return {status:x.affectedVersions.includes(x.installed)?x.evidenceVerified?'REVIEW_APPLICABILITY':'UNVERIFIED_REPORT':'VERSION_NOT_LISTED',advisory:x.advisory,exploitationProven:false};
 }
 default:return {status:'INVALID_LESSON'};
 }
}
export const cases={
 171:{ok:{inputs:['R:A','R:ABC','R:XYZ']},bad:{inputs:['R:A','R:TOOLONGNAME','bad']},okStatus:'VALID_RECORDS',badStatus:'REJECTED_MALFORMED'},
 172:{ok:{inputs:['R:ABC','R:123','oops']},bad:{inputs:['R:A','R:B']},okStatus:'BRANCHES_COVERED',badStatus:'COVERAGE_GAP'},
 173:{ok:{log:'AddressSanitizer: heap-buffer-overflow (toy transcript)',exitCode:1},bad:{log:'Program exited normally',exitCode:0},okStatus:'SANITIZER_SIGNAL',badStatus:'NO_SANITIZER_SIGNAL'},
 174:{ok:{input:'PREFIX!SUFFIX',reproduced:true},bad:{input:'PREFIX!SUFFIX',reproduced:false},okStatus:'MINIMAL_REPRO',badStatus:'NOT_REPRODUCED'},
 175:{ok:{declared:4,actual:4,capacity:8},bad:{declared:12,actual:4,capacity:8},okStatus:'LENGTH_BOUNDARY_OK',badStatus:'LENGTH_BOUNDARY_FAIL'},
 176:{ok:{runs:['REJECT','REJECT','REJECT']},bad:{runs:['REJECT','ACCEPT','REJECT']},okStatus:'REPRODUCIBLE',badStatus:'NON_DETERMINISTIC'},
 177:{ok:{sample:'R:123',accepted:false},bad:{sample:'R:123',accepted:true},okStatus:'SAFE_REJECTION_PROVEN',badStatus:'REGRESSION'},
 178:{ok:{declared:12,actual:4,capacity:8,fixedGuard:true},bad:{declared:12,actual:4,capacity:8,fixedGuard:false},okStatus:'PATCH_BLOCKS_UNSAFE',badStatus:'MISSING_BOUNDARY_CHECK'},
 179:{ok:{functions:[{name:'parse-header',boundsCheck:true},{name:'parse-body',boundsCheck:false}]},bad:{functions:[{name:'parse-header',boundsCheck:true},{name:'parse-body',boundsCheck:true}]},okStatus:'VARIANTS_TO_REVIEW',badStatus:'NO_VARIANTS_IN_FIXTURE'},
 180:{ok:{advisory:'DEMO-ADVISORY',installed:'1.2.0',affectedVersions:['1.2.0'],evidenceVerified:true},bad:{advisory:'DEMO-ADVISORY',installed:'2.0.0',affectedVersions:['1.2.0'],evidenceVerified:true},okStatus:'REVIEW_APPLICABILITY',badStatus:'VERSION_NOT_LISTED'}
};
export function runResearch(id){const x=cases[id];return x?{lesson:Number(id),casePositive:evaluateResearch(id,x.ok),caseNegative:evaluateResearch(id,x.bad)}:{status:'INVALID_LESSON'};}
export const corpusHash=digest(sampleInputs.join('\n'));
