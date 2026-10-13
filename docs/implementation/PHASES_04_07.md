# Cyber Study Hub — Fases 4–7

Este pacote é um overlay incremental e pressupõe que as Fases 0–3 já foram aplicadas.

## Fase 4 — Lesson Viewer V2

A Aula 47 passa a usar um viewer editorial próprio:

- roteiro claro;
- posição atual observada por `IntersectionObserver`;
- seções visitadas marcadas;
- sidebar sticky no desktop;
- roteiro vertical/expansível no mobile;
- conteúdo principal sem sequência de cards gigantes;
- revisão somente no fim;
- nenhuma dependência de backend.

Aulas legadas continuam no viewer antigo.

## Fase 5 — worked examples e fading

O viewer suporta:

- exemplo totalmente resolvido;
- evidência por etapa;
- perguntas de autoexplicação;
- completion exercise;
- solução de referência escondida até o aluno pedir;
- exercício independente;
- critérios de sucesso.

## Fase 6 — código

O componente de código inclui:

- line numbers;
- destaque sintático leve sem nova dependência;
- linhas anotadas;
- comentários por faixa de linhas;
- botão copiar;
- fallback de copy para navegadores sem `navigator.clipboard`;
- scroll apenas dentro do bloco de código quando necessário.

## Fase 7 — laboratório

O laboratório agora tem:

- escopo seguro;
- setup;
- happy path;
- passos estruturados;
- comando copiável;
- resultado esperado recolhido em `details`;
- checkpoint por etapa;
- progresso percentual;
- persistência local dos checkpoints;
- troubleshooting;
- cleanup.

A persistência usa uma nova chave aditiva:

`cyber-study-labs-v1`

Não altera nem migra `cyber-study-lessons-v1`.

## Arquivos adicionados

- `src/components/lesson-v2/LessonViewerV2.tsx`
- `src/components/lesson-v2/LabRunner.tsx`
- `src/components/lesson-v2/lesson-v2.css`
- `scripts/apply-phase-04-07.mjs`
- `scripts/verify-phase-04-07.mjs`

## Arquivos alterados pelo apply

- `src/components/Lessons.tsx`
- `src/lib/storage.ts`

## Fora do escopo

- Fase 8: progresso granular geral e migração de storage;
- Fase 9: FSRS;
- Fase 10: revisão completa de quizzes;
- deploy Cloudflare;
- commit/push.
