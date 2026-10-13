# Cyber Study Hub — Fases 8–11

## Fase 8 — Progresso granular

Nova chave local:

`cyber-study-learning-v2`

O sistema passa a registrar:

- seções visitadas;
- atividades concluídas;
- checkpoints de laboratório;
- histórico de quizzes;
- flags migradas do modelo legado;
- firstSeenAt/lastSeenAt.

Migração:

- lê `cyber-study-lessons-v1`;
- lê `cyber-study-labs-v1`;
- cria o novo estado;
- não apaga nenhuma chave antiga;
- é idempotente por `cyber-study-learning-v2-migration`.

## Fase 9 — FSRS

Dependência:

`ts-fsrs ^5.4.2`

Versão verificada no repositório upstream em 02/09/2026.

Configuração inicial:

- request retention: 0.90;
- maximum interval: 3650 dias;
- fuzz habilitado;
- short-term learning habilitado;
- learning steps: 1m, 10m;
- relearning: 10m.

Os flashcards das aulas V2 são semeados no scheduler local.
A tela Revisão exibe cartões vencidos e permite rating:

- Errei;
- Difícil;
- Bom;
- Fácil.

## Fase 10 — qualidade de quiz e flashcards

Além do conteúdo específico já existente na Aula 47, o validador agora impede no conteúdo V2:

- enunciado genérico do tipo “qual afirmação resume a aula”;
- alternativas duplicadas;
- answer fora do intervalo;
- flashcards duplicados;
- flashcard sem concept;
- aula profunda com menos de 5 questões;
- aula profunda com menos de 6 flashcards.

O objetivo é evitar que a futura migração das 543 unidades reintroduza avaliação genérica.

## Fase 11 — Games → mastery

Nova chave:

`cyber-study-concept-mastery-v1`

Fontes de evidência:

- quiz da aula;
- Cyber Games;
- revisão espaçada.

Regras iniciais são conservadoras:

- acerto aumenta domínio gradualmente;
- erro pesa mais que um acerto isolado;
- weakConcepts dos games reduzem domínio;
- score do game também gera evidência no nível da aula.

A tela Revisão exibe:

- cartões FSRS vencidos;
- conceitos fracos;
- progresso granular recente.

## Compatibilidade

Não removemos:

- `cyber-study-lessons-v1`;
- `cyber-study-labs-v1`;
- `cyber-study-games-v1`.

O novo modelo é aditivo e pode ser revertido sem destruir o progresso legado.

## Robustez adicional

O extrator de IDs do validador aceita propriedades `id` com ou sem aspas, evitando falso negativo entre arquivos TypeScript e JSON-like.
