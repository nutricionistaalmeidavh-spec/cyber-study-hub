// Política propositalmente restrita: GET público, sem Vary nem identidade.
export function isAnonymousAsset(req) {
  const h = req.headers;
  return req.method === 'GET' && req.path.startsWith('/assets/') &&
    !h['x-lab-user'] && !h.cookie && !h.authorization;
}
export function storageTtl(req, response) {
  if (!isAnonymousAsset(req) || response.status !== 200) return 0;
  if (response.headers.has('set-cookie') || response.headers.has('vary')) return 0;
  const directives = (response.headers.get('cache-control') || '').toLowerCase().split(',').map(x => x.trim());
  if (!directives.includes('public') || directives.some(x => ['private','no-store','no-cache'].includes(x.split('=')[0]))) return 0;
  const maxAge = directives.find(x => /^max-age=\d+$/.test(x));
  return maxAge ? Math.min(Number(maxAge.split('=')[1]), 3600) * 1000 : 0;
}
export class TimedCache {
  constructor(now = Date.now) { this.now = now; this.entries = new Map(); }
  get(key) {
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (entry.expires <= this.now()) { this.entries.delete(key); return null; }
    return { ...entry, age: Math.floor((this.now() - entry.storedAt) / 1000) };
  }
  put(key, value, ttl) {
    if (ttl <= 0) return;
    if (this.entries.size >= 100) this.entries.delete(this.entries.keys().next().value);
    this.entries.set(key, { ...value, storedAt: this.now(), expires: this.now() + ttl });
  }
}
