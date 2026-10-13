import express from 'express';
import { pathToFileURL } from 'node:url';
export function createOrigin() {
  const app = express();
  app.get('/account/*rest', (req, res) => {
    // Identidade fictícia para observar isolamento de cache; não é login de produção.
    const user = req.get('X-Lab-User') || 'anonymous';
    res.set('Cache-Control', 'private, no-store');
    res.json({ user, route: 'private-account' });
  });
  app.get('/assets/app.css', (_req, res) => {
    res.set('Content-Type', 'text/css');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send('body { font-family: system-ui; }');
  });
  return app;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createOrigin().listen(3000, '127.0.0.1', () => console.log('Origin: http://127.0.0.1:3000'));
}
