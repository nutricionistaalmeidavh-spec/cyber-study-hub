import { test } from 'node:test';
import assert from 'node:assert/strict';
import { passwordHash, passwordMatches, passwordPolicy } from '../src/worker/password-kdf.mjs';

test('versioned KDF never exceeds the Cloudflare 100k ceiling in one call',async()=>{
  assert.equal(passwordPolicy.maxIterationsPerCall,100_000);
  assert.equal(passwordPolicy.stages,6);
  const secret='ExampleLongPassword#123';
  const digest=await passwordHash(secret);
  assert.match(digest,/^pbkdf2-chain-sha256\$100000\$6\$[0-9a-f]{32}\$[0-9a-f]{64}$/);
  assert.equal(await passwordMatches(secret,digest),true);
  assert.equal(await passwordMatches('AnotherLongPassword#123',digest),false);
});
test('the KDF rejects malformed or incompatible legacy hashes without a 500',async()=>{
  assert.equal(await passwordMatches('a','pbkdf2-sha256$600000$'+('a'.repeat(32))+'$'+('b'.repeat(64))),false);
  assert.equal(await passwordMatches('a','pbkdf2-chain-sha256$100001$6$'+'a'.repeat(32)+'$'+'b'.repeat(64)),false);
  assert.equal(await passwordMatches('a',''),false);
});
