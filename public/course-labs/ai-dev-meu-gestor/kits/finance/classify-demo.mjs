// Instale @artisys/finance-domain no consumidor. Classifica, não movimenta dinheiro.
import {writeFile} from 'node:fs/promises';
import {sourceFingerprint,businessFingerprint,applyDeterministicRules} from '@artisys/finance-domain';
import {orderToTransaction} from './transaction.mjs';
const tx=orderToTransaction({id:'TX-OS-1',accountId:'caixa-demo',date:'2026-10-15',description:'SERVIÇO OS-1',amountCents:15000});
const result={sourceId:sourceFingerprint(tx,{source:'manual',documentId:'gestor-demo',rowIndex:1}),similarityId:businessFingerprint(tx),classification:applyDeterministicRules(tx,[{id:'receita-servico',priority:100,match:{description:{kind:'contains',value:'SERVIÇO'},direction:'credit'},assign:{category:'Receita de Serviços'},reason:'Lançamento fictício de serviço'}])};
await writeFile(process.argv[2]||'decisao-financeira.json',JSON.stringify(result,null,2),{flag:'wx'});
console.log('Decisão didática classificada sem banco ou API');
