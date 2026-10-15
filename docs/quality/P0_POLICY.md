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

## Ampliação A editorial IA — aulas 031 a 040 (13/10/2026)

Dez pareceres A editoriais novos elevam o total canônico a **46 A editoriais** (26 anteriores, 10 de 021–030 e 10 de 031–040). Evidências e hashes em `quality/reviews/a031-040-2026-10-13.json`, sem teste observacional com aprendizes reais. O material e seus laboratórios são locais, com núcleo sem custo obrigatório.

## A editorial IA — aulas 061 a 070 (13/10/2026)

Dez pareceres A editoriais foram acrescentados (agora **65 A editoriais**, 55 anteriores preservados), com hashes, laboratórios Node em memória/loopback, provas independentes e rubricas. Ferramentas Nmap/Nuclei/PowerShell e Windows/AD são opcionais; core R$0, local. O julgamento é por IA, sem testes humanos com aprendizes. Ver `quality/reviews/a061-070-2026-10-13.json` e `docs/quality/AUDITORIA_A_AULAS_061_070.md`.

## A editorial IA — aulas 111–120 (13/10/2026)

Mais 10 unidades A (Assembly & Reverse Engineering) com laboratórios Node, provas independentes, gabaritos e hashes SHA-256. São **105 classificações A editoriais IA** no total (95 anteriores preservadas). Ferramentas Ghidra/x64dbg e compiladores nativos são opcionais. Não houve teste observacional com alunos nem revisão humana externa. Conferir `quality/reviews/a111-120-2026-10-13.json` e `docs/quality/AUDITORIA_A_AULAS_111_120.md`.


## A editorial IA — aulas 101–110 (13/10/2026)

Revisão editorial assistida por IA de dez unidades; total registrado na branch: **135 A editoriais**, incluindo as 125 anteriores na main e sem rebaixamentos. Evidências das seis dimensões, 60 questões independentes, rubricas e hashes de conteúdo em `quality/reviews/a101-110-2026-10-13.json` e `docs/quality/AUDITORIA_A_101_110.md`. Nenhum teste humano de aprendizagem, ensaio Win32 real, driver ou DLL externa foi executado. Os laboratórios CI se limitam a programas C próprios e modelos Python com fixtures sintéticas.

## A editorial IA — aulas 161–170 (14/10/2026)

AULA-166 já estava A, com hash e laboratório piloto preservados. As outras **nove aulas** deste lote foram complementadas e promovidas a A por revisão editorial assistida por IA, com 9 modelos/testes locais, 54 perguntas de transferência e rubricas independentes. Total esperado: **153 A editoriais IA**, incluindo as 144 anteriores intactas. `quality/reviews/a161-170-2026-10-14.json` registra seis dimensões e SHA de cada um dos nove documentos novos; `docs/quality/AUDITORIA_A_161_170.md` registra limites. Sem validação de aprendizagem com alunos reais ou execução de payloads.

## A editorial IA — aulas 181 a 190 (15/10/2026)

As dez aulas de Red/Purple Team foram reescritas como material específico, com distinção explícita entre fatos da fixture e inferência de incidente. O núcleo é local e gratuito (Node 22+), sem executar alvos externos, alterar permissões, abrir SSH, criar persistência real ou usar segredos. Existem 10 oficinas de contrastes positivos/negativos, testes de invariantes, seis perguntas de transferência por aula (60 no lote), gabaritos externos e rubricas 5/6.

A classificação **A editorial IA** corresponde às seis dimensões com evidências e hashes em `quality/reviews/a181-190-2026-10-15.json`, auditáveis por `npm run test:grade-a-181-190`. A execução automatizada dos modelos foi concluída no GitHub Actions em 15/10/2026, antes do parecer. **Não houve validação com alunos humanos, nem parecer de especialista humano externo; isso permanece em aberto.** A classificação não significa que as táticas foram executadas em sistemas reais.

