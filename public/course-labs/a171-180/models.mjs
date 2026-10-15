// Educational, deterministic, local-only models. No external targets, exploits, filesystem writes or secrets.
const uint=n=>Number.isSafeInteger(n)&&n>=0;
export function validateFrame(input){
 if(typeof input!=='string'||input.length>150)return {status:'INPUT_LIMIT'};
 const m=/^PKT\|(\d+)\|([\s\S]*)$/.exec(input);
 if(!m)return {status:'INVALID_FORMAT'};
 const length=Number(m[1]);if(!uint(length)||length>64||m[2].length>64)return {status:'INPUT_LIMIT'};
 return {status:length===m[2].length?'OK':'DECLARED_LENGTH_MISMATCH',declared:length,actual:m[2].length};
}
export function coverageBucket(input){
 if(typeof input!=='string')return {path:'INVALID_INPUT',memorySafe:'NOT_PROVED'};
 if(input==='')return {path:'EMPTY',memorySafe:'NOT_PROVED'};
 if(!input.startsWith('FORM|'))return {path:'UNKNOWN_HEADER',memorySafe:'NOT_PROVED'};
 if(!/\|V=\d+/.test(input))return {path:'BAD_VERSION',memorySafe:'NOT_PROVED'};
 if(!/\|LEN=\d+/.test(input))return {path:'VERSION_ONLY',memorySafe:'NOT_PROVED'};
 const declared=Number(/\|LEN=(\d+)/.exec(input)[1]);
 const payload=/\|DATA=([^|]*)/.exec(input);
 if(!payload)return {path:'HAS_LENGTH',memorySafe:'NOT_PROVED'};
 return {path:declared===payload[1].length?'COMPLETE_FORM':'LENGTH_MISMATCH',memorySafe:'NOT_PROVED'};
}
export function classifySanitizer(trace){
 if(typeof trace!=='string')return {category:'INVALID_INPUT',memorySafe:'NOT_PROVED'};
 if(/AddressSanitizer:\s*(?:heap-use-after-free|stack-use-after-return)/i.test(trace))return {category:'TEMPORAL_MEMORY',memorySafe:'NOT_PROVED'};
 if(/AddressSanitizer:\s*(?:stack|heap)-buffer-overflow/i.test(trace))return {category:'SPATIAL_MEMORY',memorySafe:'NOT_PROVED'};
 if(/runtime error:\s*(?:signed integer overflow|division by zero)/i.test(trace))return {category:'UNDEFINED_BEHAVIOR',memorySafe:'NOT_PROVED'};
 return {category:'NO_REPORT_IN_TRACE',memorySafe:'NOT_PROVED'};
}
export function dedupeCrashes(entries){
 if(!Array.isArray(entries))return [];
 const groups=new Map();
 for(const {kind,topFrame,inputId} of entries){
  if(typeof kind!=='string'||!kind||typeof topFrame!=='string'||!topFrame||typeof inputId!=='string')continue;
  const id=JSON.stringify([kind,topFrame]),item=groups.get(id)||{kind,topFrame,count:0,inputs:[],classification:'hypothesis_not_root_cause'};
  item.count++;item.inputs.push(inputId);groups.set(id,item);
 }
 return [...groups.values()].sort((a,b)=>b.count-a.count||a.kind.localeCompare(b.kind));
}
export function diagnoseLengthField({declared,available,capacity}){
 if(![declared,available,capacity].every(uint))return {rootCause:'INVALID_FIXTURE'};
 if(declared>capacity)return {rootCause:'CAPACITY_BOUND_MISSING',invariant:'declared <= capacity'};
 if(declared>available)return {rootCause:'UNTRUSTED_LENGTH_NOT_VALIDATED',invariant:'declared <= available'};
 return {rootCause:'NONE_OBSERVED',invariant:'declared <= min(available,capacity)'};
}
export function reproduceFixture({version,seed,input,expected}){
 if(version!=='fixture-v1'||!uint(seed)||seed>100000)return {status:'OUT_OF_SCOPE'};
 if(typeof expected!=='string')return {status:'INVALID_EXPECTATION'};
 const observed=validateFrame(input).status;
 return {status:observed===expected?'REPRODUCED':'EXPECTATION_MISMATCH',observed,seed,version};
}
export function validatePoCScope({target,data,network,writes,authorization}={}){
 if(authorization!==true)return {safe:false,reason:'UNAUTHORIZED'};
 if(target!=='fixture')return {safe:false,reason:'TARGET_NOT_LOCAL_FIXTURE'};
 if(data!=='synthetic')return {safe:false,reason:'REAL_DATA_NOT_ALLOWED'};
 if(network!==false)return {safe:false,reason:'NETWORK_NOT_ALLOWED'};
 if(writes!==false)return {safe:false,reason:'SIDE_EFFECTS_NOT_ALLOWED'};
 return {safe:true,reason:'MINIMUM_SAFE_EVIDENCE'};
}
export function comparePatch(cases){
 if(!Array.isArray(cases))return {status:'INVALID_FIXTURE'};
 const neg=cases.some(c=>uint(c?.declared)&&uint(c?.actual)&&c.declared>c.actual);
 const pos=cases.some(c=>uint(c?.declared)&&uint(c?.actual)&&c.declared===c.actual);
 if(!neg)return {status:'NO_NEGATIVE_CONTROL'};
 if(!pos)return {status:'NO_POSITIVE_CONTROL'};
 // A regression oracle: old behavior trusts declared length; patched behavior checks actual bytes.
 const before=cases.map(c=>uint(c.declared)&&uint(c.actual));
 const after=cases.map(c=>uint(c.declared)&&uint(c.actual)&&c.declared<=c.actual);
 return {status:'SECURITY_REGRESSION_FIXED',before,after,claim:'fixture_only'};
}
export function findSiblingVariants(functions){
 if(!Array.isArray(functions))return [];
 return functions.filter(x=>typeof x?.name==='string'&&x.readsLength===true&&x.validatesLength!==true).map(x=>x.name);
}
export function reviewAdvisory({fixtureId,rootCause,negativeRetest,positiveRetest,scope}={}){
 const meta={cve:'NOT_ASSIGNED',cvss:'NOT_CALCULATED',purpose:'fictional training advisory'};
 if(scope!=='course-fixture')return {status:'OUT_OF_SCOPE',...meta};
 if(fixtureId!=='CSH-VR-01'||typeof rootCause!=='string'||rootCause.length<8||negativeRetest!==true||positiveRetest!==true)return {status:'INCOMPLETE',...meta};
 return {status:'READY_FOR_EDITORIAL_REVIEW',...meta};
}
