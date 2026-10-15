// Pesquisa de vulnerabilidades em parser *fictício*, sem alvo externo nem payload real.
export function parseFrame(text){
 if(typeof text!=='string'||!/^LAB:[0-9]{2}:/.test(text))return{ok:false,branch:'FORMAT'};
 const expected=Number(text.slice(4,6)),payload=text.slice(7);
 if(payload.length!==expected)return{ok:false,branch:'LENGTH'};
 if(!/^[a-z]*$/.test(payload))return{ok:false,branch:'CHARSET'};
 return{ok:true,branch:'ACCEPT',payload};
}
export function inspectCorpus(cases){const counts={FORMAT:0,LENGTH:0,CHARSET:0,ACCEPT:0};for(const c of cases)counts[parseFrame(c).branch]++;return counts;}
export function mutate(seed){return [seed,seed+'x',seed.replace('LAB:','lab:'),seed.replace('abc','123'),'LAB:01:x'];}
export function triage(input){const result=parseFrame(input);return{reproducible:parseFrame(input).branch===result.branch,branch:result.branch,inputLength:String(input).length,scope:'toy-parser-only'};}
export function unguardedAccept(input){return typeof input==='string'&&input.startsWith('LAB:');}
export function compareFix(input){return{before:unguardedAccept(input),after:parseFrame(input).ok};}
