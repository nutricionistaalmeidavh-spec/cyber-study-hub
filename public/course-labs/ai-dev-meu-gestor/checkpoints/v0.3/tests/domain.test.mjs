import test from 'node:test';
import assert from 'node:assert/strict';
import {seed,addClient,editClient,removeClient,addOrder,editOrder,removeOrder,advanceOrder,findOrders,doneCount} from '../src/domain.ts';

test('fixtures contêm 3 OS e 1 concluída',()=>{const s=seed();assert.equal(s.orders.length,3);assert.equal(doneCount(s),1);});
test('adiciona cliente com ID estável, sem mutar lista',()=>{const a=seed();const b=addClient(a,'  Fictício C ');assert.equal(b.clients.at(-1).id,'C-003');assert.equal(b.clients.at(-1).name,'Fictício C');assert.equal(a.clients.length,2);});
test('não permite cliente vazio',()=>{const a=seed();assert.throws(()=>addClient(a,'   '),/obrigatório/);assert.equal(a.clients.length,2);});
test('editar cliente conserva id e vínculos',()=>{const b=editClient(seed(),'C-001','Outro Nome');assert.equal(b.clients[0].id,'C-001');assert.equal(b.orders[0].clientId,'C-001');});
test('não apaga cliente com ordens',()=>{const a=seed();assert.throws(()=>removeClient(a,'C-001'),/possui ordens/);assert.equal(a.clients.length,2);});
test('permite apagar cliente sem ordens',()=>{const a=addClient(seed(),'Sem OS');const b=removeClient(a,'C-003');assert.equal(b.clients.length,2);});
test('nova ordem começa pendente e preserva fonte',()=>{const a=seed();const b=addOrder(a,'C-001','Visita de retorno');assert.equal(b.orders.at(-1).id,'OS-004');assert.equal(b.orders.at(-1).status,'pendente');assert.equal(a.orders.length,3);});
test('rejeita serviço em branco sem alterar estado',()=>{const a=seed();assert.throws(()=>addOrder(a,'C-001',' '),/Serviço obrigatório/);assert.equal(a.orders.length,3);});
test('rejeita cliente inexistente sem órfãos',()=>{const a=seed();assert.throws(()=>addOrder(a,'C-999','Teste'),/inexistente/);assert.equal(a.orders.length,3);});
test('avançar pendente duas vezes termina concluído e terceira vez é no-op',()=>{const a=seed();const b=advanceOrder(a,'OS-002');assert.equal(b.orders[1].status,'em andamento');assert.equal(doneCount(b),1);const c=advanceOrder(b,'OS-002');assert.equal(c.orders[1].status,'concluído');assert.equal(doneCount(c),2);const d=advanceOrder(c,'OS-002');assert.equal(d,c);assert.equal(doneCount(d),2);});
test('concluída permanece concluída',()=>{const a=seed();assert.equal(advanceOrder(a,'OS-003'),a);});
test('editar ordem mantém id e status',()=>{const b=editOrder(seed(),'OS-003','Revisão fictícia');assert.equal(b.orders[2].status,'concluído');assert.equal(b.orders[2].id,'OS-003');});
test('excluir usa id e não índice visual',()=>{const a=seed();const b=removeOrder(a,'OS-002');assert.deepEqual(b.orders.map(x=>x.id),['OS-001','OS-003']);assert.equal(a.orders.length,3);});
test('pesquisa por cliente ou serviço e filtro não mutam lista',()=>{const a=seed();assert.deepEqual(findOrders(a,'Cliente Exemplo B').map(x=>x.id),['OS-002']);assert.deepEqual(findOrders(a,'','concluído').map(x=>x.id),['OS-003']);assert.equal(a.orders.length,3);});
test('operações rejeitam id que não existe',()=>{const a=seed();assert.throws(()=>editOrder(a,'OS-999','Alterar'),/inexistente/);assert.throws(()=>removeOrder(a,'OS-999'),/inexistente/);assert.throws(()=>advanceOrder(a,'OS-999'),/inexistente/);});
