# Electron: notas locais e fronteira IPC

Aula 200. Node 22+: `npm test` executa 8 testes do handler real, usando dublês de WebContents/frame.
Desktop local: `npm install --save-dev --save-exact electron@latest`, conserve package-lock.json e versão instalada; depois `npm start`. O download/runtime Electron não foi validado nesta edição. Não desabilite sandbox para contornar ambiente root/headless.

Ler A: `{"text":"nota A"}`. Tentar B: erro FORBIDDEN. DevTools: `typeof require` deve ser `undefined`; `Object.keys(window.notes)` deve conter somente `read`; `await window.notes.read('../../secret')` deve falhar INVALID_ARGUMENT.

O app mantém sessão fictícia Alice no main, não oferece login real. A allowlist do protocolo customizado serve só index.html/renderer.js, sem acesso arbitrário ao filesystem. O handler limita WebContents, frame principal, URL, schema e owner. Testes Node não certificam execução IPC/Chromium/CSP/sandbox.
