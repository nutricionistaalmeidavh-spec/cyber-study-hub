# Cyber Study Hub — Fases 0–3

## Baseline observado

Repositório: `nutricionistaalmeidavh-spec/cyber-study-hub`

Baseline consultado antes desta entrega:

- branch: `main`
- tree SHA observado: `53ed8a0044d87ae21a1c7d7b076a7f4c2c74a849`
- package version: `1.1.0`
- stack: React 19 + TypeScript + Vite + Wrangler
- conteúdo atual: aulas 43–100 em `src/data/lessons.ts` e `src/data/lessonDetails.ts`
- persistência atual: localStorage
- deploy existente: `npm run build && wrangler deploy`

## Contrato desta entrega

### Fase 0 — baseline e guardrails

- nenhum redesign visual;
- nenhum deploy;
- nenhum backend novo;
- nenhum bloqueio de pré-requisito;
- nenhum apagamento de conteúdo legado;
- validação estrutural adicionada antes do build.

### Fase 1 — schema v2 compatível

Foi criado `src/content/schema.ts`.

O modelo v2 passa a representar:

- pré-requisitos recomendados e explicitamente não bloqueadores;
- problema concreto;
- fundamentos;
- mecanismo;
- worked examples;
- completion/fading exercises;
- prática independente;
- código anotado;
- laboratório estruturado;
- detecção;
- correção/reteste;
- quiz e flashcards;
- referências externas.

`legacyAdapter.ts` mantém o material atual utilizável enquanto a migração acontece por lotes.

### Fase 2 — conteúdo modular

A Aula 47 é a primeira aula nativa v2:

`src/content/main/047/lesson.json`

O arquivo já incorpora conteúdo pedagógico e técnico adicional:

- cache key vs cacheability;
- origin routing;
- shared cache;
- worked example completo;
- autoexplicação;
- completion exercise;
- exercício independente;
- laboratório localhost com happy path, evidência, checkpoints, cleanup e troubleshooting;
- detecção e reteste.

`registry.ts` fornece override v2 para a Aula 47 e fallback para as aulas legadas.

O catálogo `src/content/references/repositories.json` registra projetos externos úteis e suas regras de uso seguro/licenciamento.

### Fase 3 — QA automático

Foram adicionados:

- `scripts/check-baseline.mjs`
- `scripts/lib/curriculum-validator.mjs`
- `scripts/validate-curriculum.mjs`
- `scripts/test-curriculum-validator.mjs`

O validador verifica, entre outros:

- JSON inválido;
- IDs duplicados;
- schema incorreto;
- título/objetivos ausentes;
- pré-requisito bloqueador;
- lab sem expected/checkpoint;
- quiz com answer inválido;
- alternativas duplicadas;
- referência externa inexistente.

O `build` passa a executar os checks antes de `tsc`/`vite`.

## O que não foi alterado

- `Lessons.tsx`;
- `Dashboard.tsx`;
- `Games.tsx`;
- `storage.ts`;
- rotas;
- UI;
- deploy;
- Cloudflare.

Isso é deliberado: as Fases 0–3 criam a infraestrutura sem mudar o comportamento visível.
