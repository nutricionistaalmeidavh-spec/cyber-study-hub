// Apenas arquivos públicos. Nunca interceptar nem armazenar respostas da API.
const CACHE = 'cyber-study-hub-v4';
const APP_SHELL = ['/', '/manifest.webmanifest', '/favicon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  // O cache anterior (v3) podia incluir GETs privados; elimine-o na atualização.
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  event.respondWith(
    fetch(request).then(response => {
      const cacheControl = response.headers.get('cache-control') || '';
      if (response.ok && response.type !== 'opaque' && !/no-store|private/i.test(cacheControl)) {
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, response.clone())));
      }
      return response;
    }).catch(async () => {
      const hit = await caches.match(request);
      if (hit) return hit;
      if (request.mode === 'navigate') {
        const shell = await caches.match('/');
        if (shell) return shell;
      }
      return Response.error();
    })
  );
});
