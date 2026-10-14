/**
 * Etapa intermediária: mantém o Hub público exatamente como está.
 * A presença de um entrypoint Worker habilita runtime, secrets e bindings
 * no painel Cloudflare, sem exigir login ou banco na aplicação publicada.
 */
export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/__worker/health') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
      }
      return new Response(request.method === 'HEAD' ? null : JSON.stringify({
        ok: true,
        runtime: 'worker',
        phase: 'static-bridge'
      }), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }
    // Fallback defensivo: não altera navegação, assets, aulas ou PWA.
    return env.ASSETS.fetch(request);
  }
};
