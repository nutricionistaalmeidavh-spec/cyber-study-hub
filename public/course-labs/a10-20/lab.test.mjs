import test from 'node:test';
import assert from 'node:assert/strict';
import {
  requestEcho, patchProfile, readInvoice, validateUpload, corsHeaders,
  checkout, reserveConcurrently, updateSelfProfile, authorizeAdmin,
  makeJwt, decodeJwt, verifyJwt
} from './models.mjs';

test('010: requisições baseline e modificada ficam separadas no servidor loopback', async () => {
  const result = await requestEcho();
  assert.equal(result.baseline.status, 200);
  assert.equal(result.baseline.echo, 'original');
  assert.equal(result.modified.echo, 'teste-local');
  assert.equal(result.count, 2);
});
test('011: mass assignment falha no modelo vulnerável e campo role é descartado na allowlist', () => {
  const initial = { name: 'Ana', role: 'reader' };
  const payload = { name: 'Ana Maria', role: 'admin' };
  assert.equal(patchProfile(initial, payload, false).role, 'admin');
  assert.deepEqual(patchProfile(initial, payload, true), { name: 'Ana Maria', role: 'reader' });
});
test('012: autorização por objeto rejeita outra empresa e mantém a leitura do proprietário', () => {
  const obj = { id: 'F101', companyId: 'org-a', totalCents: 6000 };
  assert.equal(readInvoice('org-b',obj,false).status,200);
  assert.equal(readInvoice('org-b',obj,true).status,404);
  assert.equal(readInvoice('org-a',obj,true).status,200);
});
test('013: upload inofensivo aceito; conteúdo HTML e excesso de bytes rejeitados', () => {
  assert.equal(validateUpload({name:'recibo.pdf',mime:'application/pdf',data:Buffer.from('%PDF-1.7\n')}).accepted,true);
  assert.equal(validateUpload({name:'recibo.pdf',mime:'application/pdf',data:Buffer.from('<html>')}).accepted,false);
  assert.equal(validateUpload({name:'x.pdf',mime:'application/pdf',data:Buffer.alloc(1024 * 1024 + 1)}).accepted,false);
});
test('014: CORS admite somente origem completa cadastrada e inclui Vary', () => {
  assert.equal(corsHeaders('https://painel.exemplo.test')['access-control-allow-origin'],'https://painel.exemplo.test');
  assert.equal(corsHeaders('https://outro.exemplo.test')['access-control-allow-origin'],undefined);
  assert.equal(corsHeaders('https://painel.exemplo.test.evil.test')['access-control-allow-origin'],undefined);
  assert.equal(corsHeaders('https://painel.exemplo.test').vary,'Origin');
});
test('016: regra comercial rejeita quantidade negativa e preço manipulado', () => {
  assert.equal(checkout({qty:2, priceCents:1, stock:3}).totalCents,14000);
  assert.throws(() => checkout({qty:-2,priceCents:1,stock:3}),/QUANTIDADE_INVALIDA/);
  assert.throws(() => checkout({qty:4,priceCents:1,stock:3}),/ESTOQUE_INSUFICIENTE/);
});
test('017: dois compradores demonstram double-booking antes da correção, apenas um depois', async () => {
  const result=await reserveConcurrently();
  assert.equal(result.unsafeApproved,2);
  assert.equal(result.safeApproved,1);
  assert.equal(result.safeStock,0);
});
test('018: autoatualização ignora role e rota administrativa exige permissão do servidor', () => {
  assert.deepEqual(updateSelfProfile({role:'reader',name:'Cris'}, {role:'admin',name:'Cristina'}),{role:'reader',name:'Cristina'});
  assert.equal(authorizeAdmin('reader'),false);
  assert.equal(authorizeAdmin('admin'),true);
});
test('019: decode sozinho aceita token adulterado, verificador recusa assinatura e claims', () => {
  const token=makeJwt({sub:'A17',exp:1900000000,iss:'lab.local',aud:'api.local'});
  assert.equal(verifyJwt(token,1800000000).sub,'A17');
  const [head,body,signature]=token.split('.');
  const tampered=Buffer.from(JSON.stringify({...JSON.parse(Buffer.from(body,'base64url').toString()),sub:'ADMIN'})).toString('base64url');
  const forged=[head,tampered,signature].join('.');
  assert.equal(decodeJwt(forged).sub,'ADMIN');
  assert.throws(()=>verifyJwt(forged,1800000000),/ASSINATURA_INVALIDA/);
  assert.throws(()=>verifyJwt(token,2000000000),/EXPIRADO/);
});
