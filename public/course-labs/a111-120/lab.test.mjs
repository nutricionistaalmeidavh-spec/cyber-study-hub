import test from 'node:test';
import assert from 'node:assert/strict';
import {
 decodeOwnBytes, executeRegisterTrace, assignCallingArguments, traceBranches,
 reviewStaticFunction, traceBreakpoint, checkDecompilation, findReferences,
 investigateOwnBug, evaluateReconstruction
} from './models.mjs';

test('111: x86-64 REX.W and x86 32-bit encodings are distinct, unknown bytes remain unknown',()=>{
 assert.deepEqual(decodeOwnBytes([0x48,0x83,0xC0,0x01],'x64'),{mnemonic:'add',operand:'rax',immediate:1,length:4});
 assert.deepEqual(decodeOwnBytes([0x83,0xC0,0x01],'x86'),{mnemonic:'add',operand:'eax',immediate:1,length:3});
 assert.equal(decodeOwnBytes([0x48,0x83,0xC0,0x01],'x86'),null);
});
test('112: instruction sequence changes register and ZF without treating cmp as a write',()=>{
 const out=executeRegisterTrace([{op:'mov',value:4},{op:'add',value:2},{op:'cmp',value:6}]);
 assert.equal(out.rax,6);
 assert.equal(out.flags.ZF,true);
 assert.deepEqual(out.trace.map(x=>x.rax),[4,6,6]);
 assert.equal(executeRegisterTrace([{op:'mov',value:3},{op:'cmp',value:6}]).flags.ZF,false);
});
test('113: System V and Win64 allocate arguments to different registers and stack',()=>{
 const data=[10,20,30,40,50,60,70];
 const sys=assignCallingArguments('sysv-amd64',data);
 const win=assignCallingArguments('win64',data);
 assert.deepEqual(sys.registers,{rdi:10,rsi:20,rdx:30,rcx:40,r8:50,r9:60});
 assert.deepEqual(sys.stack,[70]);
 assert.deepEqual(win.registers,{rcx:10,rdx:20,r8:30,r9:40});
 assert.deepEqual(win.stack,[50,60,70]);
 assert.equal(win.shadowSpaceBytes,32);
});
test('114: CFG records which decision branch is reached, not simply instruction count',()=>{
 assert.deepEqual(traceBranches(-1).path,['entry','reject','return']);
 assert.deepEqual(traceBranches(2).path,['entry','positive','small','return']);
 assert.deepEqual(traceBranches(10).path,['entry','positive','large','return']);
});
test('115: Ghidra pseudo-code is a hypothesis requiring listing and symbol cross-check',()=>{
 const ok=reviewStaticFunction({entry:'0x401000',listingAddresses:['0x401000','0x401004'],callTargets:['0x402000'],candidateCalls:['0x402000']});
 assert.equal(ok.consistent,true);
 assert.equal(reviewStaticFunction({entry:'0x401000',listingAddresses:['0x401004'],callTargets:['0x402000'],candidateCalls:['0x402000']}).consistent,false);
});
test('116: breakpoints capture before/after state in harmless owned bytecode fixture',()=>{
 const r=traceBreakpoint([1,2,3],1);
 assert.equal(r.atBreakpoint.pc,1);
 assert.equal(r.atBreakpoint.accumulator,1);
 assert.equal(r.after.accumulator,6);
 assert.equal(r.completed,true);
});
test('117: pseudo-code semantic equivalence must check negatives and boundary',()=>{
 const oracle=n=>n>=10?'approved':'denied';
 assert.equal(checkDecompilation(oracle,n=>n>9?'approved':'denied',[-1,0,9,10,11]).equal,true);
 assert.deepEqual(checkDecompilation(oracle,n=>n>10?'approved':'denied',[9,10,11]).mismatches,[10]);
});
test('118: strings and imports without reachable cross-reference are not proof of execution',()=>{
 const graph={entry:['parse'],parse:['logError'],unused:[]};
 const r=findReferences(graph,'logError','entry');
 assert.deepEqual(r.path,['entry','parse','logError']);
 assert.equal(findReferences(graph,'unused','entry').reachable,false);
});
test('119: debugging own program detects off-by-one discount, fixes it and preserves boundary',()=>{
 const r=investigateOwnBug([99,100,101]);
 assert.deepEqual(r.failures,[100]);
 assert.deepEqual(r.corrected,[0,10,10.1]);
});
test('120: reconstruction validated on held-out inputs not just memorized examples',()=>{
 const oracle=n=>n<=0?'invalid':n<10?'standard':'priority';
 const good=evaluateReconstruction(oracle,n=>n<=0?'invalid':n<10?'standard':'priority',[-1,1,9,10,11]);
 const bad=evaluateReconstruction(oracle,n=>n<=0?'invalid':n<=10?'standard':'priority',[-1,1,9,10,11]);
 assert.equal(good.accepted,true);
 assert.equal(bad.accepted,false);
 assert.deepEqual(bad.counterexamples,[10]);
});
