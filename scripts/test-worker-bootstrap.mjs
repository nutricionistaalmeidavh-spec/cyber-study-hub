import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const port = 8877;
const baseUrl = `http://127.0.0.1:${port}`;
const persistentDir = await mkdtemp(join(tmpdir(), 'hub-worker-bootstrap-'));
const wrangler = spawn(process.execPath, [
  './node_modules/wrangler/bin/wrangler.js',
  'dev', '--local', '--ip', '127.0.0.1',
  '--port', String(port), '--persist-to', persistentDir
], { env: { ...process.env, CI: 'true' }, stdio: ['ignore', 'pipe', 'pipe'] });
let logs = '';
for (const stream of [wrangler.stdout, wrangler.stderr]) {
  stream.on('data', chunk => { logs += chunk.toString(); });
}

async function waitForWorker() {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (wrangler.exitCode !== null) throw Error('Wrangler stopped: ' + logs.slice(-4000));
    try {
      const result = await fetch(baseUrl + '/__worker/health', { signal: AbortSignal.timeout(2000) });
      if (result.ok) return;
    } catch { /* continue */ }
    await sleep(250);
  }
  throw Error('Wrangler did not start: ' + logs.slice(-4000));
}

async function fetchText(path) {
  const response = await fetch(baseUrl + path);
  assert.equal(response.status, 200, `Expected 200 for ${path}, got ${response.status}`);
  return response.text();
}

try {
  await waitForWorker();
  const health = await (await fetch(baseUrl + '/__worker/health')).json();
  assert.deepEqual(health, { ok: true, runtime: 'worker', phase: 'static-bridge' });

  const home = await fetchText('/');
  assert.match(home, /Cyber Study Hub/);
  assert.match(home, /src="\/assets\//); // Build serve bundles through the asset binding.

  const firstLesson = await fetchText('/course-library/main/001.md');
  assert.ok(firstLesson.length > 500, 'Canonical main lesson must remain accessible');
  const parallel = await fetchText('/course-library/parallel/LOG-01.md');
  assert.ok(parallel.length > 500, 'Canonical parallel lesson must remain accessible');

  const manifest = await fetchText('/manifest.webmanifest');
  assert.ok(JSON.parse(manifest).name, 'PWA manifest must remain valid');
  assert.match(await fetchText('/sw.js'), /serviceWorker|addEventListener/);
  assert.match(await fetchText('/course/main/1'), /Cyber Study Hub/,
    'Unknown routes must still receive the SPA fallback');

  const noSession = await fetch(baseUrl + '/');
  assert.equal(noSession.status, 200, 'Login must not be activated by bootstrap');

  console.log('Worker runtime active; public Hub, lessons, PWA and SPA routing preserved.');
} catch (error) {
  console.error(error);
  console.error('Wrangler logs:', logs.slice(-7000));
  process.exitCode = 1;
} finally {
  wrangler.kill('SIGTERM');
  await Promise.race([new Promise(resolve => wrangler.once('close', resolve)), sleep(2000)]);
  await rm(persistentDir, { force: true, recursive: true });
}
