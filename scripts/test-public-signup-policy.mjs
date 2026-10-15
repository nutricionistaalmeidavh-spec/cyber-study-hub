import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {registrationEnabled} from '../src/auth/registration-policy.mjs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('cadastro público é default e administrador pode desativar explicitamente',()=>{
 assert.equal(registrationEnabled(undefined),true);
 assert.equal(registrationEnabled(''),true);
 assert.equal(registrationEnabled('1'),true);
 assert.equal(registrationEnabled('true'),true);
 assert.equal(registrationEnabled('0'),false);
 assert.equal(registrationEnabled('false'),false);
 assert.equal(registrationEnabled('invalid-config'),false);
});
test('Node e Cloudflare compartilham uma unica política de cadastro, independente de cobrança',()=>{
 const node=read('server/start.mjs');
 const worker=read('src/worker/index.mjs');
 assert.match(node,/registrationEnabled\(process\.env\.HUB_OPEN_REGISTRATION\)/);
 assert.match(worker,/registrationEnabled\(this\.env\.HUB_OPEN_REGISTRATION\)/);
 assert.doesNotMatch(worker,/openRegistration:\s*this\.env\.HUB_OPEN_REGISTRATION\s*===\s*'1'/);
 assert.match(worker,/role\s*=\s*'student'/);
 assert.match(worker,//api\/admin\/invitations/);
});
test('landing e login oferecem cadastro público sem confundir inscrição com compra',()=>{
 const landing=read('src/components/AcademyLanding.tsx');
 const gate=read('src/components/PlatformGate.tsx');
 assert.match(landing,/href="\/\?register=1"/);
 assert.match(gate,/searchParams|get\('register'\)/);
 assert.match(gate,/Criar minha conta/);
 assert.doesNotMatch(gate,/c[oó]digo.*e-?mail|verifica[cç][aã]o.*e-?mail/i);
});
