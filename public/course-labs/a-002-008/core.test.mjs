import test from 'node:test';
import assert from 'node:assert/strict';
import {describeRequest, decision, createSessionStore, sessionCookieHeader,
        signCompactJwt, verifyCompactJwt, encodeHtmlText, explainDomSink} from './core.mjs';

test('002: request separa método, path e query sem confiar em parâmetros repetidos',()=>{
  const ok=describeRequest('get','/pedido?id=R10&view=full');
  assert.deepEqual([ok.method,ok.path,ok.id,ok.queryCount,ok.status],['GET','/pedido','R10',2,200]);
  assert.equal(describeRequest('post','/pedido?id=a&id=b').status,400);
  assert.equal(describeRequest('trace','/').status,405);
});
test('003: 401 sem identidade, 403 sem permissão, 200 para ação legítima',()=>{
  const obj={ownerId:'ana'};
  assert.equal(decision(null,obj,'read').status,401);
  assert.equal(decision({id:'ana',role:'reader'},obj,'edit').status,403);
  assert.equal(decision({id:'ana',role:'editor'},obj,'edit').status,200);
  assert.equal(decision({id:'ana',role:'reader'},obj,'unknown').status,403);
});
test('005: session id imprevisível, expiração inclusiva e revogação',()=>{
  const store=createSessionStore(); const a=store.issue('ana',1000,2000),b=store.issue('ana',1000,2000);
  assert.notEqual(a,b);assert.equal(store.lookup(a,2999),'ana');assert.equal(store.lookup(a,3000),null);
  assert.equal(store.lookup(b,2000),'ana');store.revoke(b);assert.equal(store.lookup(b,2000),null);
  const cookie=sessionCookieHeader(a,true);
  for(const attr of ['HttpOnly','Secure','SameSite=Lax','Path=/'])assert.ok(cookie.includes(attr));
});
test('005: JWT deve verificar assinatura, expiração e audience, não apenas decodificar',()=>{
  const secret='segredo_de_teste_ephemeral_32_bytes';
  const t=signCompactJwt({sub:'ana',exp:2000,aud:'a-002-008'},secret);
  assert.equal(verifyCompactJwt(t,secret,1999)?.sub,'ana');
  assert.equal(verifyCompactJwt(t,secret,2000),null);
  assert.equal(verifyCompactJwt(t,secret,1999,'outra'),null);
  assert.equal(verifyCompactJwt(t+'a',secret,1999),null);
});
test('006: trocar ID de objeto não confere autorização',()=>{
  const ana={id:'ana',role:'reader'},bob={id:'bob',role:'reader'};
  const ticket={ownerId:'ana',id:'R10'};
  assert.equal(decision(ana,ticket,'read').allowed,true);
  assert.equal(decision(bob,ticket,'read').allowed,false);
  assert.equal(decision(ana,ticket,'delete').allowed,false);
});
test('008: texto HTML permanece texto literal, sem converter em marcação',()=>{
  const value=`<b class="x">O'Hara & equipe</b>`;
  assert.equal(encodeHtmlText(value),'&lt;b class=&quot;x&quot;&gt;O&#39;Hara &amp; equipe&lt;/b&gt;');
  assert.equal(explainDomSink('textContent'),'texto_literal');
  assert.equal(explainDomSink('innerHTML'),'interpretacao_html');
});
