# Laboratórios Web P0 — Fase 16

Node.js 24 e npm; Path Traversal exige POSIX/Linux/WSL para symlinks e O_NOFOLLOW. Todos os dados são fictícios. Servidores usados pelos drivers escutam loopback em portas livres e são encerrados automaticamente.

```sh
cd public/course-labs/phase16-web-p0
npm ci
npm test
```

| Aula | Comando neste diretório | Evidência |
|---|---|---|
| 001 / 036 | `node read-models.mjs` | Consistência de 4 casos de risco e 6 ameaças STRIDE; não testa os controles representados |
| 004 | `node passwords.mjs` | Salt distinto, comparação correta/incorreta, limite UTF-8 |
| 009 | `node csrf.mjs` e `node csrf-http.mjs` | Ausência de tokens recusada; HTTP 403 sem mutação e 200 com alteração |
| 015 | `node ssrf.mjs` | Redirect acessa serviço interno fictício no antigo; delta zero no corrigido |
| 020 | `node oauth.mjs` | Assinatura real, login simulado, rejeição de replay/nonce/token errado |
| 052 | `node paths.mjs` | Symlink sai da raiz no antigo; leitura legítima e quatro negativas no corrigido |

Testes seletivos: `node --test --test-name-pattern='CSRF' web.test.mjs`; outros padrões: `bcrypt`, `SSRF`, `OAuth/OIDC`, `paths`. O arquivo de testes é **web.test.mjs**.

Limites importantes: `/lab-session` é seleção de identidade para o teste, não login real. O driver CSRF HTTP não verifica cookies/SameSite em navegador. OIDC é simulação no mesmo processo com RSA real, sem IdP remoto. SSRF testa redirect e catálogo controlados, sem implementar resolução DNS segura genérica. Paths exige raiz e ancestrais protegidos contra escrita não confiável; não promete eliminar corridas de filesystem arbitrárias. Nenhum exemplo deve ser publicado como serviço de produção.

`npm ci` instala a versão fixada de bcryptjs. Após instalação, os experimentos não precisam de destinos externos. Não imprima senhas, tokens ou cookies reais nos exercícios.
