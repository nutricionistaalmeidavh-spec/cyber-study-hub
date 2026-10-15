import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {issueBuyerIntent,verifyBuyerIntent} from '../src/billing/buyer-intent.mjs';
const secret='long-test-artisys-hub-connector-secret-for-all-scenarios';
const user={id:randomUUID(),email:'aluno@example.test',status:'active'};
const productId='hubestudos-course-web-apis',saleType='one_time';
const now=Date.parse('2026-10-15T12:00:00Z');
test('binding criptográfico vincula usuário, email, produto e modalidade a pedido criado na vigência',async()=>{
 const ticket=await issueBuyerIntent({user,productId,saleType,secret,now});
 const person=await verifyBuyerIntent({ticket,productId,saleType,email:user.email,orderCreatedAt:new Date(now+1000).toISOString(),secret,now:now+120000});
 assert.equal(person.userId,user.id);
 assert.equal(person.email,user.email);
});
test('não serve copiar ticket para outra conta, outro produto, outra modalidade ou falsificar MAC',async()=>{
 const ticket=await issueBuyerIntent({user,productId,saleType,secret,now});
 const verify=(changes={})=>verifyBuyerIntent({ticket,productId,saleType,email:user.email,orderCreatedAt:new Date(now+1000).toISOString(),secret,now:now+1000,...changes});
 await assert.rejects(verify({email:'outra@example.test'}));
 await assert.rejects(verify({productId:'hubestudos-course-blue-team'}));
 await assert.rejects(verify({saleType:'monthly'}));
 await assert.rejects(verify({ticket:ticket.slice(0,-1)+(ticket.endsWith('f')?'0':'f')}));
 await assert.rejects(verify({orderCreatedAt:new Date(now+3600000).toISOString()}));
 await assert.rejects(verify({orderCreatedAt:new Date(now-600000).toISOString()}));
});
test('pedido criado dentro da vigência pode renovar meses depois sem reutilizar autorização de checkout',async()=>{
 const ticket=await issueBuyerIntent({user,productId:'hubestudos-subscription',saleType:'monthly',secret,now});
 const buyer=await verifyBuyerIntent({ticket,productId:'hubestudos-subscription',saleType:'monthly',email:user.email,orderCreatedAt:new Date(now+25000).toISOString(),secret,now:now+90*86400000});
 assert.equal(buyer.userId,user.id);
 await assert.rejects(issueBuyerIntent({user,productId,saleType,secret:'short',now}));
});
