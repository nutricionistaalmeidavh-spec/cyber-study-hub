import { mkdtemp, mkdir, writeFile, symlink, realpath, open, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

export function lexicalPath(root, input) {
  const candidate = path.resolve(root, input);
  if (!candidate.startsWith(path.resolve(root) + path.sep)) throw new Error('FORA_DA_RAIZ');
  return candidate;
}
// Contrato: raiz/ancestrais pertencem ao serviço e não são graváveis por atores não confiáveis.
// Não promete eliminar corridas contra um atacante capaz de renomear diretórios durante open.
export async function readWithinProtectedRoot(root, input) {
  if (typeof input !== 'string' || !input.length || input.includes('\0')) throw new Error('NOME_INVALIDO');
  const canonicalRoot = await realpath(root);
  const candidate = await realpath(path.resolve(canonicalRoot, input));
  const rel = path.relative(canonicalRoot, candidate);
  if (!rel || rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) throw new Error('FORA_DA_RAIZ');
  if (typeof constants.O_NOFOLLOW !== 'number') throw new Error('USE_POSIX_OU_WSL_PARA_ESTE_LAB');
  const handle = await open(candidate, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > 4096) throw new Error('TIPO_OU_TAMANHO_INVALIDO');
    return await handle.readFile('utf8');
  } finally { await handle.close(); }
}
export async function experiment() {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'csh-path-'));
  const root = path.join(dir, 'public-files');
  try {
    await mkdir(root); await writeFile(path.join(root, 'report.txt'), 'RELATORIO_PUBLICO');
    await writeFile(path.join(dir, 'outside.txt'), 'DADO_EXTERNO_FICTICIO');
    await symlink(path.join(dir, 'outside.txt'), path.join(root, 'link.txt'));
    const h = await open(lexicalPath(root, 'link.txt'));
    let legacy; try { legacy = await h.readFile('utf8'); } finally { await h.close(); }
    const happy = await readWithinProtectedRoot(root, 'report.txt');
    const rejected = [];
    for (const input of ['link.txt', '../outside.txt', '.', '\0']) {
      try { await readWithinProtectedRoot(root, input); } catch (e) { rejected.push({ input: JSON.stringify(input), reason: e.message }); }
    }
    return { happy, legacy, rejected, contract: 'raiz protegida; não cobre diretórios concorrencialmente mutáveis por atacante' };
  } finally { await rm(dir, { recursive: true, force: true }); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(await experiment());
