import bcrypt from 'bcryptjs';
import { pathToFileURL } from 'node:url';

// Esta fronteira rejeita truncamento silencioso; limite medido em UTF-8.
export function validatePassword(password) {
  if (typeof password !== 'string' || !password.length) throw new Error('SENHA_AUSENTE');
  if (Buffer.byteLength(password, 'utf8') > 72) throw new Error('LIMITE_BCRYPT_72_BYTES');
  return password;
}
export async function register(password, cost = 10) {
  validatePassword(password);
  if (!Number.isInteger(cost) || cost < 10 || cost > 14) throw new Error('CUSTO_FORA_DO_LAB');
  // A biblioteca gera salt aleatório. O resultado guarda algoritmo/custo/salt/hash.
  return bcrypt.hash(password, cost);
}
export async function authenticate(password, encodedHash) {
  validatePassword(password);
  return bcrypt.compare(password, encodedHash);
}
export async function demo() {
  const password = 'frase fictícia do laboratório';
  const a = await register(password), b = await register(password);
  return {
    salts_diferentes: a !== b,
    correta: await authenticate(password, a),
    incorreta: await authenticate('outra frase fictícia', a),
    custo: bcrypt.getRounds(a),
    bytes_36_e_acentuados: Buffer.byteLength('é'.repeat(36), 'utf8'),
    bytes_37_e_acentuados: Buffer.byteLength('é'.repeat(37), 'utf8')
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(await demo());
