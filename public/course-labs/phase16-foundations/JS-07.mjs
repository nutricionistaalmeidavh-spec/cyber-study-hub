import http from 'node:http';
import assert from 'node:assert/strict';
// Servidor e cliente no mesmo processo; porta efêmera evita colisões.
const server = http.createServer((req, res) => {
  if (req.url === '/lento') {
    const timer = setTimeout(() => res.end('{"ok":true}'), 250);
    res.on('close', () => clearTimeout(timer));
    return;
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.url === '/ausente') { res.writeHead(404); res.end('{"erro":"ausente"}'); }
  else if (req.url === '/quebrado') res.end('{invalido');
  else if (req.url === '/redireciona') { res.writeHead(302, {Location:'/ok'}); res.end(); }
  else res.end('{"mensagem":"ação local"}');
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

async function consultar(url, prazo = 1000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), prazo);
  try {
    // Fetch resolve também para 404; a regra HTTP é nossa responsabilidade.
    const response = await fetch(url, {signal:controller.signal, redirect:'error'});
    if (!response.ok) return {tipo:'http', status:response.status};
    try { return {tipo:'ok', dados:await response.json()}; }
    catch (erro) {
      // Abort pode acontecer durante leitura do corpo, não só em fetch.
      if (controller.signal.aborted) return {tipo:'timeout'};
      if (erro instanceof SyntaxError) return {tipo:'json'};
      throw erro;
    }
  } catch (erro) {
    if (controller.signal.aborted) return {tipo:'timeout'};
    if (erro instanceof TypeError) return {tipo:'transporte-ou-redirecionamento'};
    throw erro; // não esconder erro de programação como indisponibilidade
  } finally { clearTimeout(timer); }
}
try {
  for (const [rota, prazo, esperado] of [
    ['/ok',1000,'ok'], ['/ausente',1000,'http'],
    ['/quebrado',1000,'json'], ['/lento',20,'timeout'],
    ['/redireciona',1000,'transporte-ou-redirecionamento'],
  ]) {
    const resultado = await consultar(base+rota,prazo);
    assert.equal(resultado.tipo,esperado);
    if (rota === '/ausente') assert.equal(resultado.status,404);
    if (rota === '/ok') assert.equal(resultado.dados.mensagem,'ação local');
    console.log(rota, JSON.stringify(resultado));
  }
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
// Listener encerrado: nova conexão não encontra serviço, sem contato externo.
const offline = await consultar(base+'/ok');
assert.equal(offline.tipo,'transporte-ou-redirecionamento');
console.log('/offline', JSON.stringify(offline));
