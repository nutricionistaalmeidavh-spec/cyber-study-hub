import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyMemoryAccess,validateBoundedCopy,triageSanitizer,limitRecursionDepth,checkHeapAlias,checkPagePermissions,verifyCanary,checkReturnTarget,assessMitigationMatrix} from './models.mjs';

test('161: spatial and temporal memory safety are distinct properties',()=>{
 assert.equal(classifyMemoryAccess({capacity:8,offset:7,width:1,alive:true}).status,'VALID');
 assert.equal(classifyMemoryAccess({capacity:8,offset:8,width:1,alive:true}).status,'SPATIAL_OOB');
 assert.equal(classifyMemoryAccess({capacity:8,offset:0,width:1,alive:false}).status,'TEMPORAL_UAF');
 assert.equal(classifyMemoryAccess({capacity:8,offset:-1,width:1,alive:true}).status,'SPATIAL_OOB');
});
test('162: copy with NUL must reserve a distinct byte and respect source length',()=>{
 assert.deepEqual(validateBoundedCopy({capacity:8,declaredLength:7,actualSourceLength:7}),{accepted:true,reason:'BOUNDS_OK'});
 assert.equal(validateBoundedCopy({capacity:8,declaredLength:8,actualSourceLength:8}).reason,'NO_TERMINATOR_SPACE');
 assert.equal(validateBoundedCopy({capacity:8,declaredLength:7,actualSourceLength:6}).reason,'SOURCE_TRUNCATED');
});
test('163: crash triage reports sanitizer class without asserting exploitability',()=>{
 const r=triageSanitizer('ERROR: AddressSanitizer: stack-buffer-overflow WRITE of size 1');
 assert.equal(r.classification,'STACK_BUFFER_OVERFLOW');
 assert.equal(r.exploitability,'NOT_ESTABLISHED');
 assert.equal(triageSanitizer('process exited normally').classification,'NO_SANITIZER_EVIDENCE');
});
test('164: recursion budget rejects excessive depth while preserving valid workload',()=>{
 assert.equal(limitRecursionDepth({requested:4,budget:8}).accepted,true);
 assert.equal(limitRecursionDepth({requested:100000,budget:8}).reason,'DEPTH_LIMIT');
 assert.equal(limitRecursionDepth({requested:-1,budget:8}).reason,'INVALID_INPUT');
});
test('165: alias after free is invalid even if numerical offset is zero',()=>{
 assert.equal(checkHeapAlias({allocated:true,freed:false,aliasExists:true,offset:0,length:4}).accepted,true);
 assert.equal(checkHeapAlias({allocated:true,freed:true,aliasExists:true,offset:0,length:4}).reason,'LIFETIME_EXPIRED');
 assert.equal(checkHeapAlias({allocated:true,freed:false,aliasExists:true,offset:4,length:4}).reason,'BOUNDS_EXCEEDED');
});
test('167: NX rejects execution on writable, non-executable data mapping',()=>{
 assert.equal(checkPagePermissions({permissions:'rw-',action:'execute'}).allowed,false);
 assert.equal(checkPagePermissions({permissions:'r-x',action:'execute'}).allowed,true);
 assert.equal(checkPagePermissions({permissions:'rw-',action:'write'}).allowed,true);
 assert.equal(checkPagePermissions({permissions:'rwx',action:'write'}).policyViolation,'W_AND_X');
});
test('168: canary mismatch signals tampering; passing canary does not prove safety',()=>{
 const ok=verifyCanary({initial:'fixture-secret',observed:'fixture-secret'});
 const bad=verifyCanary({initial:'fixture-secret',observed:'changed'});
 assert.equal(ok.detected,false);
 assert.equal(ok.memorySafe,'UNKNOWN');
 assert.equal(bad.detected,true);
 assert.equal(bad.action,'ABORT_FUNCTION');
});
test('169: conceptual control-flow integrity checks target, not executable ROP payload',()=>{
 assert.equal(checkReturnTarget({target:'continuationA',allowedTargets:['continuationA'],source:'return'}).allowed,true);
 assert.equal(checkReturnTarget({target:'unexpectedBranch',allowedTargets:['continuationA'],source:'return'}).allowed,false);
});
test('170: mitigators never turn an uncorrected root cause into a fixed bug',()=>{
 const options={aslr:true,nx:true,stackCanary:true,cfi:true};
 const open=assessMitigationMatrix({rootCauseFixed:false,...options});
 const fixed=assessMitigationMatrix({rootCauseFixed:true,...options});
 assert.equal(open.rootCauseStatus,'OPEN');
 assert.equal(open.layers,4);
 assert.equal(fixed.rootCauseStatus,'FIXED_IN_FIXTURE');
 assert.equal(assessMitigationMatrix({rootCauseFixed:false,aslr:false,nx:false,stackCanary:false,cfi:false}).layers,0);
});
