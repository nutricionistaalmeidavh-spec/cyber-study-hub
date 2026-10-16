import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
export default defineConfig({
 testDir: '.', testMatch:'hub-ui-ux.spec.mjs', timeout:60000, workers:1,
 outputDir:'../qa-results', reporter:[['list'],['html',{outputFolder:'../qa-report',open:'never'}]],
 use:{baseURL:'http://127.0.0.1:8790',trace:'retain-on-failure'},
 webServer:{cwd:fileURLToPath(new URL('..',import.meta.url)),command:'node server/start.mjs',url:'http://127.0.0.1:8790/api/auth/config',reuseExistingServer:false,
  env:{PORT:'8790',HUB_ORIGIN:'http://127.0.0.1:8790',HUB_DATA_DIR:'/tmp/hub-ui-ux-ci-'+process.pid,HUB_BOOTSTRAP_KEY:'qa-disposable-bootstrap-only',HUB_OPEN_REGISTRATION:'true'}}
});
