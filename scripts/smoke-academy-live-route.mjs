import assert from 'node:assert/strict';

const origin = process.env.ACADEMY_PUBLIC_ORIGIN || 'https://artisys.dev';
const maxAttempts = 5;
const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));
async function get(path) {
  const response = await fetch(origin+path,{headers:{'accept':path.includes('/api/')?'application/json':'text/html','user-agent':'ArtiSys-Academy-Route-Smoke/1.0'},signal:AbortSignal.timeout(12000),cache:'no-store'});
  return response;
}
let passed=false;
for(let attempt=1;attempt<=maxAttempts;attempt++){
  try{
    const worker=await get('/academy/__worker/health');
    const workerBody=await worker.text();
    const workerData=JSON.parse(workerBody);
    assert.equal(worker.status,200,'Worker routing HTTP');
    assert.equal(workerData.runtime,'worker','Wrong Worker routed at /academy');
    const api=await get('/academy/api/health');
    assert.equal(api.status,200,'Academy API HTTP');
    const payload=await api.json();
    assert.equal(payload.ok,true,'Academy API body');
    const site=await get('/academy');
    assert.equal(site.status,200,'Academy landing HTTP');
    const html=await site.text();
    assert.match(html,/ArtiSys Academy/,'Academy title not found');
    assert.match(html,/\/academy\/assets\//,'Assets not prefixed under /academy');
    console.log('ArtiSys Academy /academy: HTTP 200; Worker, API and assets route all verified');
    passed=true;
    break;
  }catch(error){
    console.warn('Attempt '+attempt+'/'+maxAttempts+' failed:',String(error));
    if(attempt<maxAttempts)await sleep(10000);
  }
}
if(!passed)process.exitCode=1;
