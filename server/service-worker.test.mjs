import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function swFetchHandler(){
  const handlers={};
  const source=readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');
  runInNewContext(source,{
    self:{
      location:{origin:'https://hub.example.test'},
      addEventListener:(type,fn)=>{handlers[type]=fn;},
      skipWaiting:()=>undefined,
      clients:{claim:()=>undefined}
    },
    URL,Promise,console,
    caches:{open:async()=>({addAll:async()=>undefined,put:async()=>undefined}),keys:async()=>[],match:async()=>null},
    fetch:async()=>({ok:true,clone(){return this;}})
  });
  return handlers.fetch;
}
test('service worker must never intercept private API GET responses',()=>{
  const handler=swFetchHandler();let interceptions=0;
  for(const path of ['/api/me','/api/me/state','/api/admin/users','/api/auth/config']){
    handler({request:{method:'GET',url:'https://hub.example.test'+path},respondWith:()=>{interceptions++;}});
  }
  assert.equal(interceptions,0,'private API responses must bypass all caches');
});
test('service worker must never intercept requests from another origin',()=>{
  const handler=swFetchHandler();let interceptions=0;
  handler({request:{method:'GET',url:'https://another.example.test/private'},respondWith:()=>{interceptions++;}});
  assert.equal(interceptions,0);
});

test('service worker must not cache lesson markdown, labs, PDF or paid assets',()=>{
 const handler=swFetchHandler();let n=0;
 for(const path of ['/course-library/main/001.md','/course-labs/a41-50/test.mjs','/materials/Ethical_Hacking_Aulas_01_10.pdf']){
  handler({request:{method:'GET',url:'https://hub.example.test'+path},respondWith:()=>n++});
 }
 assert.equal(n,0);
});
