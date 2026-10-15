# Oficina 04 — Análise dinâmica controlada

**Identidade permanente:** REV-IA-016. **Competência:** Investigar trace controlado com reteste com o arquivo verificável 04-controlled-trace.json, explicando evidências, hipóteses, limitações e um caso negativo sem exigir API ou serviço pago.

## O que será produzido
Arquivo 04-controlled-trace.json realmente criado no computador do aluno, mais hipóteses, limitações e análise do módulo 4. **Arquivo-alvo:** `04-controlled-trace.json`. Prova de execução = nome do arquivo, entrada prevista, comando, saída observada, rejeição/controle e conclusão que possa ser contestada.

## Arquivos que o aluno realmente precisa
- Código do checkpoint: `public/course-labs/reverse-ai/engine.mjs` e testes em `engine.test.mjs`.
- Comportamento de referência: `reference.mjs`; reconstrução independente: `candidate.mjs`.
- Programa C de autoria do curso: `sample.c`; módulos ES originais: `sample-ui.mjs` e `sample-rule.mjs`.
- Índice e contexto: [README](/course-labs/reverse-ai/README.md); referência canônica já existente: [AULA-116](#course/main/116).

## Passo a passo — execução gratuita e local
Node.js 22+ e o código da trilha. Abra o terminal na raiz do repositório:

```sh
node public/course-labs/reverse-ai/engine.mjs --module 4 --out ./rev-evidencias/m04
node --test public/course-labs/reverse-ai/engine.test.mjs public/course-labs/reverse-ai/lab.test.mjs
```

O primeiro comando cria `04-controlled-trace.json` em `./rev-evidencias/m04/`; o segundo valida as oito oficinas. Abra o artefato produzido com editor de texto. Ambos funcionam sem modelos, API, contas de terceiros, GPU ou acesso à rede.

1. Preveja o ramo para score 21 e 22 sem ler a saída do trace.
2. Execute a instrumentação local e identifique validate→score→branch, com verificação contra a saída real.
3. Explique por que instrumentação didática e breakpoint do processo são evidências diferentes.

## Perguntas de defesa e diagnóstico
1. Traçar validação, cálculo e ramo de escolha Em que linha/saída de `04-controlled-trace.json` você encontra evidência? Qual entrada contestaria essa conclusão?
2. Confrontar rastreamento didático e saída efetiva Em que linha/saída de `04-controlled-trace.json` você encontra evidência? Qual entrada contestaria essa conclusão?
3. Anotar diferenças entre observar e reconstruir um trace Em que linha/saída de `04-controlled-trace.json` você encontra evidência? Qual entrada contestaria essa conclusão?
4. Entregar 04-controlled-trace.json com resultado e contraexemplo reproduzíveis Em que linha/saída de `04-controlled-trace.json` você encontra evidência? Qual entrada contestaria essa conclusão?

## Avaliação independente
Tente a [prova do módulo 04](/course-labs/reverse-ai/assessments/module-04.md) sem consultar o gabarito. Guarde um registro de pelo menos 120 caracteres sobre previsão, execução, erro e reteste. Sua marcação de progresso no site é autodeclarada, não execução remota de scripts.

## Restrições honestas
Ferramenta externa não é executada pelo runner. **REA**, quando instalado e configurado voluntariamente, analisa apps por CLI/MCP e pode combinar ferramentas locais. **Ghidra**, quando instalado pelo aluno, analisa o binário C próprio. Ambos requerem artefatos autorizados. Não execute código de terceiros, não burle DRM/licenças, não invente resultados de Ghidra/REA ou equivalência universal. Código gerado por IA sempre necessita revisão humana.

## Checklist verificável
- [ ] Usei apenas arquivo próprio e ambiente local.
- [ ] Registrei uma previsão antes de executar.
- [ ] Executei um caso permitido e um inválido.
- [ ] Separei resultado medido de sugestão da IA.
- [ ] Documentei uma limitação e um reteste.

**Evidência esperada:** O arquivo 04-controlled-trace.json existe na pasta ./rev-evidencias/m04 e a suíte engine.test.mjs passa, cobrindo um controle negativo específico.
