# Meu Gestor v0.5 — depuração e regressão

Projeto didático do módulo 7, derivado de v0.4. Node 24+, React + TypeScript e SQLite open source; núcleo R$ 0, sem API paga.

Instalar e validar no diretório v0.5:

```sh
npm install --no-audit --no-fund
npm run test
npm run build
```

Terminal 1: `npm run dev:api`; terminal 2: `npm run dev`. API loopback 127.0.0.1:4173, frontend Vite 127.0.0.1:5173.

Exercício: reproduza erro controlado em cópia do código; documente o teste que falha; reverta; rode suíte completa e build. Inclua casos 400, 404, 409 e 422, conclusão repetida, vínculo de cliente e revisão de logs sem dados reais. Não publique a API. Testes não são auditoria de segurança comercial.
