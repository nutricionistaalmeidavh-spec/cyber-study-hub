// Safety-focused models, no real memory accesses, gadgets, payloads or privilege changes.
// Deliberately synthetic: they demonstrate invariants, not an exploitation framework.
const validInt=(v)=>Number.isSafeInteger(v);
export function classifyMemoryAccess({capacity,offset,width,alive}){
 if(![capacity,offset,width].every(validInt)||capacity<0||width<=0)return {status:'INVALID_INPUT'};
 if(alive!==true)return {status:'TEMPORAL_UAF'};
 if(offset<0||offset>capacity||width>capacity-offset)return {status:'SPATIAL_OOB'};
 return {status:'VALID'};
}
export function validateBoundedCopy({capacity,declaredLength,actualSourceLength}){
 if(![capacity,declaredLength,actualSourceLength].every(validInt)||capacity<=0||declaredLength<0||actualSourceLength<0)return {accepted:false,reason:'INVALID_INPUT'};
 if(declaredLength>=capacity)return {accepted:false,reason:'NO_TERMINATOR_SPACE'};
 if(declaredLength>actualSourceLength)return {accepted:false,reason:'SOURCE_TRUNCATED'};
 return {accepted:true,reason:'BOUNDS_OK'};
}
export function triageSanitizer(log){
 if(typeof log!=='string')return {classification:'INVALID_INPUT',exploitability:'NOT_ESTABLISHED'};
 let classification='NO_SANITIZER_EVIDENCE';
 if(/AddressSanitizer:\s*stack-buffer-overflow/i.test(log))classification='STACK_BUFFER_OVERFLOW';
 else if(/AddressSanitizer:\s*heap-buffer-overflow/i.test(log))classification='HEAP_BUFFER_OVERFLOW';
 else if(/AddressSanitizer:\s*heap-use-after-free/i.test(log))classification='HEAP_USE_AFTER_FREE';
 return {classification,exploitability:'NOT_ESTABLISHED'};
}
export function limitRecursionDepth({requested,budget}){
 if(!validInt(requested)||!validInt(budget)||requested<0||budget<0)return {accepted:false,reason:'INVALID_INPUT'};
 return requested>budget?{accepted:false,reason:'DEPTH_LIMIT'}:{accepted:true,reason:'WITHIN_BUDGET'};
}
export function checkHeapAlias({allocated,freed,aliasExists,offset,length}){
 if(!validInt(offset)||!validInt(length)||length<=0)return {accepted:false,reason:'INVALID_INPUT'};
 if(allocated!==true||freed===true)return {accepted:false,reason:'LIFETIME_EXPIRED'};
 if(aliasExists!==true)return {accepted:false,reason:'NO_ALIAS'};
 if(offset<0||offset>=length)return {accepted:false,reason:'BOUNDS_EXCEEDED'};
 return {accepted:true,reason:'LIVE_IN_BOUNDS'};
}
export function checkPagePermissions({permissions,action}){
 if(!/^[r-][w-][x-]$/.test(permissions)||!['read','write','execute'].includes(action))return {allowed:false,policyViolation:'INVALID_INPUT'};
 const need={read:0,write:1,execute:2}[action];
 return {allowed:permissions[need]!=='-',policyViolation:permissions[1]==='w'&&permissions[2]==='x'?'W_AND_X':null,
  note:'abstract permissions, not an operating-system page table'};
}
export function verifyCanary({initial,observed}){
 const detected=typeof initial!=='string'||typeof observed!=='string'||initial!==observed;
 return {detected,memorySafe:'UNKNOWN',action:detected?'ABORT_FUNCTION':'CONTINUE_CHECKS'};
}
export function checkReturnTarget({target,allowedTargets,source}){
 if(source!=='return'||!Array.isArray(allowedTargets))return {allowed:false,reason:'INVALID_INPUT'};
 return allowedTargets.includes(target)?{allowed:true,reason:'ALLOWED_IN_MODEL'}:{allowed:false,reason:'TARGET_NOT_PERMITTED'};
}
export function assessMitigationMatrix({rootCauseFixed,aslr,nx,stackCanary,cfi}){
 const enabled=[aslr,nx,stackCanary,cfi].filter(Boolean).length;
 return {rootCauseStatus:rootCauseFixed===true?'FIXED_IN_FIXTURE':'OPEN',layers:enabled,
  inference:rootCauseFixed===true?'Root cause marked fixed in educational fixture; still retest target':'Mitigators may obstruct some exploit paths, but root-cause bug remains'};
}
