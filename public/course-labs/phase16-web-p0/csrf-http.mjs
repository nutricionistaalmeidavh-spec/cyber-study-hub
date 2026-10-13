import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { issueSession, changeEmail } from './csrf.mjs';

export function createServer() {
  const sessions = new Map();
  return http.createServer(async (req, res) => {
    const reply = (status, body, headers = {}) => {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers });
      res.end(JSON.stringify(body));
    };
    try {
      if (req.method !== 'POST') { reply(405, { error: 'use_POST' }); return; }
      let raw = ''; for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw) > 1024) { reply(413, { error: 'body_limit' }); return; } }
      const body = JSON.parse(raw || '{}');
      if (req.url === '/lab-session') {
        // Login substituído por identidade fictícia explícita; somente loopback.
        if (!['alice', 'bob'].includes(body.user)) { reply(422, { error: 'lab_user' }); return; }
        const sid = randomBytes(24).toString('hex'), session = issueSession(body.user);
        session.expires = Date.now() + 900000;
        if (sessions.size >= 100) sessions.delete(sessions.keys().next().value);
        sessions.set(sid, session);
        reply(201, { csrfToken: session.csrfToken, email: session.email }, { 'Set-Cookie': `lab_sid=${sid}; HttpOnly; SameSite=Lax; Path=/` });
        return;
      }
      const cookie = String(req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('lab_sid='));
      const session = cookie ? sessions.get(cookie.slice(8)) : null;
      if (session?.expires <= Date.now()) { reply(401, { error: 'expired' }); return; }
      if (req.url !== '/email') { reply(404, { error: 'not_found' }); return; }
      const result = changeEmail(session, body);
      reply(result.status, { ...result, email: session?.email });
    } catch { reply(400, { error: 'invalid_json' }); }
  });
}
export async function demo() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const post = (path, body, cookie) => fetch(origin + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) });
  try {
    const session = await post('/lab-session', { user: 'alice' });
    const cookie = session.headers.get('set-cookie').split(';')[0], body = await session.json();
    const absent = await post('/email', { email: 'novo@example.invalid' }, cookie);
    const denied = await absent.json();
    const accepted = await post('/email', { email: 'novo@example.invalid', csrfToken: body.csrfToken }, cookie);
    const changed = await accepted.json();
    return { session: session.status, absent: absent.status, unchanged: denied.email, accepted: accepted.status, changed: changed.email };
  } finally { await new Promise(resolve => server.close(resolve)); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(await demo());
