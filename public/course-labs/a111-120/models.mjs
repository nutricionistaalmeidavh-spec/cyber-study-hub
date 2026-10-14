// Fixtures e modelos determinísticos do próprio curso. Não processa binários externos.
export function decodeOwnBytes(bytes,mode){
 if(mode==='x64' && bytes.length===4 && bytes[0]===0x48&&bytes[1]===0x83&&bytes[2]===0xC0)
  return {mnemonic:'add',operand:'rax',immediate:bytes[3]<128?bytes[3]:bytes[3]-256,length:4};
 if(mode==='x86' && bytes.length===3 && bytes[0]===0x83&&bytes[1]===0xC0)
  return {mnemonic:'add',operand:'eax',immediate:bytes[2]<128?bytes[2]:bytes[2]-256,length:3};
 return null; // Um decodificador real cobre REX, prefixos, ModR/M, modos e mais opcodes.
}
export function executeRegisterTrace(instructions){
 let rax=0;let ZF=false;
 const trace=[];
 for(const ins of instructions){
  if(!Number.isSafeInteger(ins.value))throw Error('Imediato inválido');
  switch(ins.op){
   case 'mov':rax=ins.value;break;
   case 'add':rax+=ins.value;break;
   case 'cmp':ZF=rax===ins.value;break;
   default:throw Error('Opcode fora da fixture: '+ins.op);
  }
  if(!Number.isSafeInteger(rax))throw Error('Fora da faixa de inteiros seguros da simulação');
  trace.push({op:ins.op,rax,ZF});
 }
 return {rax,flags:{ZF},trace};
}
export function assignCallingArguments(abi,args){
 const registersByAbi={'sysv-amd64':['rdi','rsi','rdx','rcx','r8','r9'],win64:['rcx','rdx','r8','r9']};
 const order=registersByAbi[abi];if(!order)throw Error('ABI não suportada');
 const registers={};order.forEach((reg,i)=>{if(i<args.length)registers[reg]=args[i]});
 return {abi,registers,stack:args.slice(order.length),shadowSpaceBytes:abi==='win64'?32:0,
  note:'Posições lógicas dos argumentos, não layout completo de frame/stack'};
}
export function traceBranches(n){
 if(!Number.isSafeInteger(n))throw Error('Entrada inválida');
 return {path:n<=0?['entry','reject','return']:n<10?['entry','positive','small','return']:['entry','positive','large','return']};
}
export function reviewStaticFunction({entry,listingAddresses,callTargets,candidateCalls}){
 const consistent=listingAddresses.includes(entry)&&candidateCalls.every(x=>callTargets.includes(x));
 return {consistent,entry,unverifiedCalls:candidateCalls.filter(x=>!callTargets.includes(x)),
  explanation:consistent?'Pseudocódigo compatível com a evidência apresentada, não prova de equivalência':'Divergência de entry ou alvos entre listing e hipótese'};
}
export function traceBreakpoint(program,breakAt){
 if(!Array.isArray(program)||!program.every(Number.isSafeInteger)||!Number.isInteger(breakAt)||breakAt<0||breakAt>=program.length)
  throw Error('Programa ou breakpoint inválido');
 let accumulator=0,atBreakpoint=null;
 for(let pc=0;pc<program.length;pc++){
  if(pc===breakAt)atBreakpoint={pc,accumulator};
  accumulator+=program[pc];
 }
 return {atBreakpoint,after:{pc:program.length,accumulator},completed:true};
}
export function checkDecompilation(oracle,candidate,cases){
 const mismatches=cases.filter(x=>oracle(x)!==candidate(x));
 return {equal:mismatches.length===0,mismatches,checked:cases.length,
  note:'Equivalência restrita aos casos testados, não prova formal'};
}
export function findReferences(graph,target,entry){
 const seen=new Set([entry]),queue=[[entry]];
 while(queue.length){
  const p=queue.shift();const node=p[p.length-1];
  if(node===target)return {reachable:true,path:p};
  for(const next of graph[node]??[]){if(!seen.has(next)){seen.add(next);queue.push([...p,next])}}
 }
 return {reachable:false,path:null};
}
export function investigateOwnBug(cases){
 const expected=n=>n>=100?Math.round(n*10)/100:0;
 const observed=n=>n>100?Math.round(n*10)/100:0; // BUG intencional no limite
 return {failures:cases.filter(n=>expected(n)!==observed(n)),corrected:cases.map(expected),
  explanation:'Falha de comparação > em vez de >= com limiar exatamente 100'};
}
export function evaluateReconstruction(oracle,candidate,heldOut){
 const counterexamples=heldOut.filter(x=>oracle(x)!==candidate(x));
 return {accepted:counterexamples.length===0,counterexamples,checked:heldOut.length,
  claim:'Somente exemplos cobertos; sem equivalência provada para domínio inteiro'};
}
