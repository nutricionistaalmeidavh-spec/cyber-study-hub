# A editorial IA — Desenvolvimento de Sistemas com IA, módulos 01 a 05

**Data:** 14/10/2026. **Método:** revisão editorial por IA com segunda passagem crítica. **Testes de aprendizagem com estudantes:** não realizados. **Revisor humano externo:** não realizado. As classificações desta trilha são separadas do inventário canônico de 543 aulas.

| Módulo | Entrega | Regressão | Prova |
|---|---|---|---|
| 01 Fundamentos | Protótipo HTML e regras de estado | `node --test public/course-labs/ai-dev-meu-gestor/tests/starter.test.mjs` | module-01 |
| 02 Requisitos | Matriz de requisitos e contratos | `node --test public/course-labs/ai-dev-meu-gestor/module-02/spec-rules.test.mjs` | module-02 |
| 03 Projeto | React/TS/Vite v0.1, Git | build v0.1 | module-03 |
| 04 Interface | React v0.2, semântica e indicadores | build v0.2 | module-04 |
| 05 CRUD | React v0.3, validação, filtros e IDs | teste + build v0.3 | module-05 |

As provas estão em `public/course-labs/ai-dev-meu-gestor/assessments` e os gabaritos e rubricas ficam separados em `answer-keys`. Cada módulo possui revisão editorial em seis dimensões (conteúdo técnico, didática, prática, defesa, avaliação, especificidade), evidências e SHA-256 do objeto canônico em `src/trails/ai-dev/quality-reviews.json`.

**Significado de A:** material considerado A no parecer editorial assistido por IA, não certificação de aprendizagem, acessibilidade assistiva validada com usuários ou revisão humana independente. Ferramentas e projeto são gratuitos e locais; ChatGPT/Claude são caminhos opcionais pelo navegador sujeitos a limites; Ollama é opcional conforme hardware. Não usar informações reais, segredos nem API paga obrigatória. As regras da v0.3 ainda vivem apenas em memória.

**Verificação:** `npm run verify:ai-dev`; workflow `Trilha IA — Módulos 01 a 05` executa os dois laboratórios Node, três builds React, testes v0.3, build da plataforma e testes de autenticação.
