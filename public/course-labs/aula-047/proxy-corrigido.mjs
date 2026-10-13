import express from 'express';
import { pathToFileURL } from 'node:url';
import { isAnonymousAsset, storageTtl, TimedCache } from './cache-policy.mjs';
export function createFixedProxy(origin = 'http://127.0.0.1:3000', cache = new TimedCache()) {
  const app = express();
  app.use(async (req, res) => {
    if (req.method !== 'GET') { res.sendStatus(405); return; }
    const key = `${req.method}:${req.originalUrl}`;
    // Bypass antes de consultar o cache, inclusive quando o asset já está aquecido.
    const eligible = isAnonymousAsset(req);
    const saved = eligible ? cache.get(key) : null;
    if (saved) {
      res.set(saved.headers).set('Age', String(saved.age)).set('X-Lab-Cache','HIT').status(saved.status).send(saved.body); return;
    }
    const upstream = await fetch(origin + req.originalUrl, {
      redirect: 'error', signal: AbortSignal.timeout(2000),
      headers: { 'X-Lab-User': req.get('X-Lab-User') || '' }
    });
    const body = await upstream.text();
    const headers = { 'content-type': upstream.headers.get('content-type') || 'text/plain', 'cache-control': upstream.headers.get('cache-control') || '' };
    const ttl = storageTtl(req, upstream);
    if (ttl > 0) cache.put(key, { status: upstream.status, headers, body }, ttl);
    res.set(headers).set('X-Lab-Cache', ttl > 0 ? 'MISS' : 'BYPASS').status(upstream.status).send(body);
  });
  return app;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createFixedProxy().listen(4001, '127.0.0.1', () => console.log('Proxy corrigido: http://127.0.0.1:4001'));
}
