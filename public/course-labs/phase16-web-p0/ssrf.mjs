import http from 'node:http';
import { pathToFileURL } from 'node:url';

async function listen(handler) {
  const server = http.createServer(handler);
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}
const close = server => new Promise((resolve, reject) => server.close(e => e ? reject(e) : resolve()));

export async function experiment() {
  let internalHits = 0;
  const internal = await listen((_req, res) => { internalHits++; res.end('DADO_INTERNO_FICTICIO'); });
  let source;
  try {
    source = await listen((req, res) => {
      if (req.url === '/public') { res.end('CATALOGO_PUBLICO'); return; }
      if (req.url === '/jump') { res.writeHead(302, { Location: internal.origin + '/private' }); res.end(); return; }
      res.writeHead(404); res.end('NOT_FOUND');
    });
    // Vulnerável SOMENTE no cenário local: valida a primeira URL, segue outro destino.
    async function legacyPreview(url) {
      if (new URL(url).origin !== source.origin) throw new Error('ORIGEM_INICIAL_REJEITADA');
      return (await fetch(url, { signal: AbortSignal.timeout(2000) })).text();
    }
    const catalog = new Map([['catalogo', source.origin + '/public'], ['redirecionamento-teste', source.origin + '/jump']]);
    async function fixedPreview(resourceId) {
      // Usuário escolhe ID; nunca fornece host, scheme, porta, path nem credenciais.
      const destination = catalog.get(resourceId);
      if (!destination) throw new Error('RECURSO_REJEITADO');
      const response = await fetch(destination, { redirect: 'manual', signal: AbortSignal.timeout(2000) });
      if (response.status >= 300 && response.status < 400) throw new Error('REDIRECT_REJEITADO');
      if (!response.ok) throw new Error(`UPSTREAM_${response.status}`);
      return response.text(); // Respostas pequenas e controladas neste lab.
    }
    const happy = await fixedPreview('catalogo');
    const legacy = await legacyPreview(source.origin + '/jump');
    const beforeFixed = internalHits;
    let redirectDenied = false, arbitraryDenied = false;
    try { await fixedPreview('redirecionamento-teste'); } catch (e) { redirectDenied = e.message === 'REDIRECT_REJEITADO'; }
    try { await fixedPreview(internal.origin + '/private'); } catch (e) { arbitraryDenied = e.message === 'RECURSO_REJEITADO'; }
    return { happy, legacy, redirectDenied, arbitraryDenied, internalHits, internalHitsAfterFix: internalHits - beforeFixed };
  } finally {
    if (source) await close(source.server);
    await close(internal.server);
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(await experiment());
