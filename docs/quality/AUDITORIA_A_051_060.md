# Aulas 051 a 060 — revisão editorial técnica A

**Data de revisão:** 13/10/2026. **Qualificação:** A editorial auditado por IA, **não** certificação humana nem teste de eficácia com alunos reais.

A revisão preserva todos os 543 IDs canônicos e os 65 pareceres A que já existiam. Para as dez aulas novas, o conteúdo passou a incluir oficina guiada, mecanismo com causa e consequência, caso positivo, caso negativo, defesa e reteste, seis perguntas de transferência inéditas e gabarito separado. A aula 052 mantém integralmente a análise avançada preexistente de symlink/canonicalização/TOCTOU; o exercício adicional verifica transferência.

| Aula | Tema | Artefato verificável | Limite explícito |
|---|---|---|---|
| 051 | Command Injection | `plannedProcess` | Não executa shell controlável |
| 052 | Path Traversal e LFI/RFI | `phase16-web-p0/paths.mjs` | POSIX, não protege corrida de renomeação |
| 053 | File Upload | `acceptsDocument` | Magic bytes não bastam para produção |
| 054 | JWT | `verifyJwt` | HMAC didático, não biblioteca de produção |
| 055 | OAuth/OIDC | `pkcePair`, `verifyAuthorizationResponse` | Sem provedor externo, troca real de tokens ou identidade validada |
| 056 | BOLA/BFLA/Mass Assignment | `updateCase` | Política simulada, sem persistência HTTP |
| 057 | Rate limit/Race/Logic | `reserveOnce` | Estado in-memory, não transação distribuída |
| 058 | CORS/SOP | `corsPolicy` | Headers sem navegador real |
| 059 | CSP e headers | `securityHeaders` | Headers sem enforcement gráfico |
| 060 | Exploit chains | `assessChain` | Grafo simulado, não exploração real |

## Evidência e reprodução

- Documentos e respostas: `public/course-library/main/051.md` a `060.md` e `/course-labs/a051-060/answer-keys/AULA-0xx.md`.
- Auditoria por dimensão, fontes e hashes: `quality/reviews/a51-60-2026-10-13.json` e `quality/registry.json`.
- Testes com casos positivos/negativos: `node --test public/course-labs/a051-060/labs.test.mjs`.
- Caminhos e symlink: `node public/course-labs/phase16-web-p0/paths.mjs`.
- Inventário e build: `npm run verify:quality`, `npm run build`.
- Novo workflow `Aulas 051-060 QA`, disparado apenas por PR envolvendo os arquivos relevantes ou manualmente, sem gatilho para cada push.

**Interpretação dos gates:** didática validada refere-se à inspeção editorial por IA no perfil iniciante, e revisor independente significa segunda passagem editorial do material por IA, não auditor humano externo. `humanLearnerTesting=not_performed` está registrado explicitamente. O material evita execução em terceiros, credenciais reais e sistemas de produção.
