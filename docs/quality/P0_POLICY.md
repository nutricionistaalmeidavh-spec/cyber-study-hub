# P0 — Registro de qualidade editorial

## Fonte canônica

- `src/curriculum/catalog.json`: identidade, ordem, tipo, trilha e caminho de cada unidade.
- `quality/registry.json`: notas **históricas** da Fase 15 por exceções à classe D, conjunto de 66 IDs alterados na Fase 16 e pareceres editoriais atuais.
- `scripts/lib/quality-p0.mjs`: valida identidade e coleta sinais estruturais; não atribui notas por palavras-chave, tamanho ou presença de seções.
- `reports/quality/*` (gerado): evidências e problemas pendentes por unidade. Não editar manualmente.

## Política de avaliação

As classes A/B/C/D da Fase 15 pertencem ao material de setembro de 2026; após a Fase 16 são histórico, não a classificação corrente. As 66 unidades alteradas recebem triagem estática de integridade e organização do conteúdo, **não** uma promoção editorial automática. Notas A só resultam de pareceres completos com seis dimensões, evidências e hash, discriminando auditoria IA de avaliação humana. As outras 477 aguardam análise atualizada.

A qualificação A exige seis dimensões (conteúdo técnico, didática, prática, defesa, avaliação, especificidade) avaliadas entre 80 e 100 por um revisor; evidências individualizadas por dimensão (método, referência, resultado); precisão revisada, didática para iniciante inspecionada via walkthrough editorial, prática verificada, avaliação de transferência revisada por um segundo processo, escopo seguro e identificação distinta de autoria/revisão. No parecer de IA, declarar explicitamente que não houve teste com estudantes humanos; este teste é uma métrica separada da nota editorial. Notas não podem ser deduzidas do número de palavras ou da presença de Markdown. Em aulas sem código, a prática adequada pode ser um exercício de análise com entregáveis verificáveis.

**Não editar** o catálogo nem arquivos de aula para ajustar o resultado deste P0. Falhas estruturais ou recursos inacessíveis são findings; ausência de um cabeçalho detectável é apenas pista de revisão, não defeito pedagógico provado. Revisões independentes e testes reais com estudantes ainda precisam ser conduzidos.

## Comandos (offline, Node.js nativo)

```sh
npm run test:quality
npm run verify:quality
npm run report:quality
```

`report:quality` materializa `status-543.json`, `status-543.csv` e `triagem-66.json`. `verify:quality` falha em corrupção do inventário, IDs faltantes, paths inválidos, nota A sem provas e ausência de conteúdo; não falha apenas porque uma aula ainda está D historicamente.

## Fluxo para uma promoção editorial

1. Obter e ler toda a aula, seus artefatos, laboratórios e contexto de pré-requisitos.
2. Verificar tecnicamente em ambiente autorizado, registrando entradas, saídas, versões, casos negativos e reteste.
3. Avaliar as seis dimensões separadamente, com evidência de cada uma, sem pontuação simulada.
4. Realizar revisão do quiz e walkthrough de iniciante com objetivo sem indicar o controle.
5. Preencher `quality/registry.json > editorialReviews[ID]` com `grade`, `author`, `reviewer`, `reviewedOn`, `summary`, `contentSha256`, `scores`, `gates` e `evidence`; passar CI e revisão externa/humana de PR quando disponível (não afirmar sua realização se somente a auditoria por IA ocorreu).
6. Preservar a classificação histórica e refazer a revisão quando mudar conteúdo material. Comparar SHA-256 do arquivo revisado antes de aceitar nova promoção.

## Limites

Esta triagem apenas verifica estrutura textual, integridade de referências locais e pendências de evidência. Não comprova a exatidão de conteúdo, execução de exercícios, funcionamento de VMs Windows, Kubernetes, GUI, nem eficácia para aprendizes sem observação independente. O core permanece local/self-hosted, sem API paga.
## Escopo de A editorial assistido por IA (piloto)

Oito avaliações realizadas em 13/10/2026 possuem `reviewMethod=ai_editorial_second_pass` e `humanLearnerTesting=not_performed`. `didaticaInicianteValidada` indica walkthrough editorial a partir de pressupostos de conhecimento inicial zero, **não** observação de alunos reais. `revisorIndependente` indica segunda passagem crítica separada da autoria, com identidade do processo IA documentada, **não** revisor humano. O indicador de eficácia pedagógica observada permanece em aberto e não deve ser inventado. A metodologia, fontes e resultados estão em `quality/reviews/pilot-a-2026-10-13.json` e `docs/quality/AUDITORIA_A_PILOTO.md`.

## Extensão A editorial IA — aulas 002 a 008 (13/10/2026)

Mais sete pareceres A editoriais foram registrados, totalizando quinze. Cada um contém seis notas e evidências, hash SHA-256 do Markdown final, prova separada e laboratório local. A identificação `revisorIndependente=true` mantém a semântica adotada pelo piloto: **segunda passagem crítica de IA**, não certificação humana externa. `humanLearnerTesting=not_performed` continua obrigatório. Conferir `quality/reviews/a-002-008-2026-10-13.json` e `docs/quality/AUDITORIA_A_002_008.md`.

## Ampliação A editorial IA — aulas 010 a 020 (13/10/2026)

Mais onze pareceres A editoriais foram integrados ao registro, totalizando **26 unidades A** (8 pilotos + 7 de 002–008 + 11 de 010–020). Evidências e hashes constam em `quality/reviews/a10-20-2026-10-13.json`. O resultado é uma avaliação por IA, não estudo observacional com estudantes reais. O core e os laboratórios continuam gratuitos e locais.
