# Cyber Study Hub — Fases 12–14

## Fase 12 — Navegação curricular completa

O Hub deixa de enxergar apenas as aulas atualmente codificadas em `lessons.ts` e recebe um catálogo unificado com:

- 218 aulas principais;
- 325 unidades paralelas;
- 543 unidades totais.

A formação principal e as trilhas paralelas ficam separadas visualmente, mas no mesmo catálogo.

### Acesso livre

Pré-requisitos continuam sendo recomendações. Nenhum item do catálogo possui bloqueio por progresso.

### Trilhas paralelas concorrentes

O aluno pode marcar várias trilhas como `Em estudo` ao mesmo tempo. A preferência é local e usa:

`cyber-study-active-parallel-tracks-v1`

### Lazy content

Para não colocar 543 aulas no bundle inicial, conteúdos que ainda não usam o viewer estruturado são carregados sob demanda por `fetch` a partir de:

- `/course-library/main/`
- `/course-library/parallel/`

Assim, todo o MASTER fica navegável sem transformar o app inicial em um bundle gigantesco.

### Estados de renderização

A lista principal mostra três estados:

- Interativa V2;
- Interativa legado;
- Leitura completa.

As aulas 47–60 são V2 após esta entrega.
As aulas 43–100 que ainda não foram migradas para V2 continuam usando o viewer legado.
As demais usam o viewer editorial de documento até a migração estruturada.

---

## Fase 13 — Integração controlada de referências e laboratórios

Os repositórios externos pesquisados não são copiados para dentro do produto.

Foi criado um catálogo de integração que registra:

- finalidade;
- licença conhecida/alerta de licença;
- regra de uso seguro;
- faixas de aulas/trilhas onde a referência faz sentido.

Projetos mapeados:

- OWASP WebGoat;
- OWASP Juice Shop;
- OWASP crAPI;
- Atomic Red Team;
- SigmaHQ;
- Yara-Rules;
- pwn.college / dojo.

O painel de referências aparece no viewer de documento e nas aulas V2 quando a aula declara referências.

### Laboratório 47

Os arquivos próprios do laboratório de Web Cache Deception do MASTER foram incluídos em:

`public/course-labs/aula-047/`

Contém:

- `origin.mjs`;
- `proxy-vulneravel.mjs`;
- `proxy-corrigido.mjs`;
- `package.json`;
- `README.md`.

O Lesson Viewer exibe esses recursos como arquivos do laboratório.

---

## Fase 14 — Primeira migração por lote

Foi executado o primeiro lote da estratégia de migração:

**47–60 — Web/AppSec avançado**

A Aula 47 já era V2 e foi preservada.
As Aulas 48–60 foram convertidas do `CyberCourse_MASTER_v2` para o schema V2.

Cada unidade migrada passa a possuir:

- problema concreto;
- fundamentos;
- fluxo/mecanismo;
- worked example;
- autoexplicação;
- completion/fading exercise;
- prática independente;
- código;
- laboratório estruturado;
- detecção;
- correção e reteste;
- quiz;
- flashcards;
- referências externas controladas.

### Avaliação durante a migração

O primeiro quiz genérico do MASTER (`qual afirmação melhor resume...`) foi removido do lote 48–60 antes da importação.

As cinco questões restantes são preservadas quando passam no validador e recebem vínculo explícito a conceitos da aula.

O validador das Fases 8–11 continua exigindo para aulas profundas:

- >= 5 questões;
- >= 6 flashcards;
- zero alternativas duplicadas;
- zero questão genérica do padrão bloqueado;
- `concept` em cada item.

### Fonte

Conteúdo-base:

`CyberCourse_MASTER_v2`

A biblioteca editorial completa 1–218 + 325 paralelas também foi empacotada como fallback lazy para auditoria da Fase 15 no Work.

---

## O que fica para a Fase 15

A Fase 15 deve ser feita no Work, conforme definido pelo usuário, e deve auditar o estado integrado — não apenas arquivos isolados.

Pontos para auditoria:

1. UX mobile do currículo com 543 unidades.
2. Carregamento lazy dos Markdown.
3. Aula 47–60 no viewer V2.
4. Qualidade específica dos quizzes 48–60.
5. Coerência de worked examples gerados durante a migração.
6. Painel de referências/licenças.
7. FSRS + mastery + progresso granular.
8. Performance do bundle inicial.
9. Acessibilidade e navegação por teclado.
10. Critérios para o próximo lote de migração.
