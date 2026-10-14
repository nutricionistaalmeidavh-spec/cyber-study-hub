import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const conf=readFileSync(new URL('../wrangler.toml',import.meta.url),'utf8');
const worker=readFileSync(new URL('../src/worker/index.mjs',import.meta.url),'utf8');
const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));

assert.match(conf,/^main\s*=\s*"src\/worker\/index\.mjs"/m,
  'A configuração deve publicar o Worker real de autenticação, não o bootstrap estático.');
assert.match(conf,/class_name\s*=\s*"HubAuthObject"/);
assert.match(conf,/name\s*=\s*"HUB_AUTH"/);
assert.match(conf,/new_sqlite_classes\s*=\s*\["HubAuthObject"\]/);
assert.match(conf,/run_worker_first\s*=\s*\[[^\]]*"\/api\/\*"/);
assert.match(conf,/required\s*=\s*\["HUB_BOOTSTRAP_KEY"\]/);
assert.match(worker,/export\s+class\s+HubAuthObject\s+extends\s+DurableObject/);
assert.match(worker,/env\.HUB_AUTH/);
assert.equal(pkg.scripts.prebuild,'node scripts/check-cloudflare-worker.mjs');
console.log('Worker production guard OK: código, Durable Object, rotas e secret obrigatório.');
