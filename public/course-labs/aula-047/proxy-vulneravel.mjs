import express from 'express';
import { pathToFileURL } from 'node:url';
export function createVulnerableProxy(origin = 'http://127.0.0.1:3000') {
  const app = express(), cache = new Map();
  app.use(async (req, res) => {
    if (req.method !== 'GET') { res.sendStatus(405); return; }
    const key = `${req.method}:${req.originalUrl}`;
    if (cache.has(key)) {
      const saved = cache.get(key);
      res.set(saved.headers).set('X-Lab-Cache','HIT').status(saved.status).send(saved.body); return;
    }
    const upstream = await fetch(origin + req.originalUrl, {
      redirect: 'error', signal: AbortSignal.timeout(2000),
      headers: { 'X-Lab-User': req.get('X-Lab-User') || 'anonymous' }
    });
    const body = await upstream.text();
    const headers = { 'content-type': upstream.headers.get('content-type') || 'text/plain', 'cache-control': upstream.headers.get('cache-control') || '' };
    // ERRO intencional local: extensão não representa sensibilidade da resposta.
    if (req.path.endsWith('.css')) cache.set(key, { status: upstream.status, headers, body });
    res.set(headers).set('X-Lab-Cache','MISS').status(upstream.status).send(body);
  });
  return app;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createVulnerableProxy().listen(4000, '127.0.0.1', () => console.log('Proxy vulnerável: http://127.0.0.1:4000'));
}
