# Oficina 02 — Investigação orientada por evidências

**Identidade permanente:** REV-IA-008. **Competência:** Investigar matriz e cobertura de hipóteses com o arquivo verificável 02-coverage.json, explicando evidências, hipóteses, limitações e um caso negativo sem exigir API ou serviço pago.

## O que será produzido
Arquivo 02-coverage.json realmente criado no computador do aluno, mais hipóteses, limitações e análise do módulo 2. **Arquivo-alvo:** `02-coverage.json`. Prova de execução = nome do arquivo, entrada prevista, comando, saída observada, rejeição/controle e conclusão que possa ser contestada.

## Arquivos que o aluno realmente precisa
- Código do checkpoint: `public/course-labs/reverse-ai/engine.mjs` e testes em `engine.test.mjs`.
- Comportamento de referência: `reference.mjs`; reconstrução independente: `candidate.mjs`.
- Programa C de autoria do curso: `sample.c`; módulos ES originais: `sample-ui.mjs` e `sample-rule.mjs`.
- Índice e contexto: [README](/course-labs/reverse-ai/README.md); referência canônica já existente: [AULA-111](#course/main/111).

## Passo a passo — execução gratuita e local
Node.js 22+ e o código da trilha. Abra o terminal na raiz do repositório:

```sh
node public/course-labs/reverse-ai/engine.mjs --module 2 --out ./rev-evidencias/m02
node --test public/course-labs/reverse-ai/engine.test.mjs public/course-labs/reverse-ai/lab.test.mjs
```

O primeiro comando cria `02-coverage.json` em `./rev-evidencias/m02/`; o segundo valida as oito oficinas. Abra o artefato produzido com editor de texto. Ambos funcionam sem modelos, API, contas de terceiros, GPU ou acesso à rede.

1. Compare diretamente score 21 com score 22 e registre duas saídas distintas.
2. Faça a matriz de severity/impact em dois eixos; conte casos inválidos sem classificá-los como resultados de negócio.
3. Explique a diferença entre RangeError, TypeError e erro interno do programa.

## Perguntas de defesa e diagnóstico
1. Desenhar uma matriz de hipóteses e refutações Em que linha/saída de `02-coverage.json` você encontra evidência? Qual entrada contestaria essa conclusão?
2. Investigar os dois lados de um limiar Em que linha/saída de `02-coverage.json` você encontra evidência? Qual entrada contestaria essa conclusão?
3. Distinguir caso válido, rejeição e falha silenciosa Em que linha/saída de `02-coverage.json` você encontra evidência? Qual entrada contestaria essa conclusão?
4. Entregar 02-coverage.json com resultado e contraexemplo reproduzíveis Em que linha/saída de `02-coverage.json` você encontra evidência? Qual entrada contestaria essa conclusão?

## Avaliação independente
Tente a [prova do módulo 02](/course-labs/reverse-ai/assessments/module-02.md) sem consultar o gabarito. Guarde um registro de pelo menos 120 caracteres sobre previsão, execução, erro e reteste. Sua marcação de progresso no site é autodeclarada, não execução remota de scripts.

## Restrições honestas
Ferramenta externa não é executada pelo runner. **REA**, quando instalado e configurado voluntariamente, analisa apps por CLI/MCP e pode combinar ferramentas locais. **Ghidra**, quando instalado pelo aluno, analisa o binário C próprio. Ambos requerem artefatos autorizados. Não execute código de terceiros, não burle DRM/licenças, não invente resultados de Ghidra/REA ou equivalência universal. Código gerado por IA sempre necessita revisão humana.

## Checklist verificável
- [ ] Usei apenas arquivo próprio e ambiente local.
- [ ] Registrei uma previsão antes de executar.
- [ ] Executei um caso permitido e um inválido.
- [ ] Separei resultado medido de sugestão da IA.
- [ ] Documentei uma limitação e um reteste.

**Evidência esperada:** O arquivo 02-coverage.json existe na pasta ./rev-evidencias/m02 e a suíte engine.test.mjs passa, cobrindo um controle negativo específico.
