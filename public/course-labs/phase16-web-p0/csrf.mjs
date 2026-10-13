import { randomBytes, timingSafeEqual } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export function issueSession(userId) {
  return { userId, csrfToken: randomBytes(32).toString('hex'), email: `${userId}@example.invalid` };
}
// Modelo do snippet antigo: demonstra a falha sem publicá-la em um servidor.
export const legacyAccepts = (received, stored) => received === stored;
export function validCsrf(received, stored) {
  // Presença, tipo e formato vêm antes da comparação. Token é aleatório de 32 bytes.
  if (typeof received !== 'string' || typeof stored !== 'string') return false;
  if (!/^[a-f0-9]{64}$/.test(received) || !/^[a-f0-9]{64}$/.test(stored)) return false;
  return timingSafeEqual(Buffer.from(received, 'hex'), Buffer.from(stored, 'hex'));
}
export function changeEmail(session, body) {
  if (!session?.userId) return { status: 401, event: 'session_required' };
  if (!validCsrf(body?.csrfToken, session.csrfToken)) return { status: 403, event: 'csrf_rejected' };
  if (typeof body.email !== 'string' || !/^[a-z]+@example\.invalid$/.test(body.email)) {
    return { status: 422, event: 'invalid_lab_email' };
  }
  session.email = body.email;
  return { status: 200, event: 'email_changed', userId: session.userId };
}
export function demo() {
  const alice = issueSession('alice'), bob = issueSession('bob');
  return {
    antigo_sem_tokens: legacyAccepts(undefined, undefined),
    corrigido_sem_tokens: validCsrf(undefined, undefined),
    sem_token: changeEmail(alice, { email: 'novo@example.invalid' }).status,
    token_de_bob: changeEmail(alice, { csrfToken: bob.csrfToken, email: 'novo@example.invalid' }).status,
    legitimo: changeEmail(alice, { csrfToken: alice.csrfToken, email: 'novo@example.invalid' }).status,
    email_final: alice.email
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(demo());
