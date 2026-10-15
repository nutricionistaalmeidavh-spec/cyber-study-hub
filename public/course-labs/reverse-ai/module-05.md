# Oficina 05 — JavaScript, Electron e interfaces

**Identidade permanente:** REV-IA-020. **Competência:** Investigar diagrama de módulos e limites de evidência com o arquivo verificável 05-js-boundaries.json, explicando evidências, hipóteses, limitações e um caso negativo sem exigir API ou serviço pago.

## O que será produzido
Arquivo 05-js-boundaries.json realmente criado no computador do aluno, mais hipóteses, limitações e análise do módulo 5. **Arquivo-alvo:** `05-js-boundaries.json`. Prova de execução = nome do arquivo, entrada prevista, comando, saída observada, rejeição/controle e conclusão que possa ser contestada.

## Arquivos que o aluno realmente precisa
- Código do checkpoint: `public/course-labs/reverse-ai/engine.mjs` e testes em `engine.test.mjs`.
- Comportamento de referência: `reference.mjs`; reconstrução independente: `candidate.mjs`.
- Programa C de autoria do curso: `sample.c`; módulos ES originais: `sample-ui.mjs` e `sample-rule.mjs`.
- Índice e contexto: [README](/course-labs/reverse-ai/README.md); referência canônica já existente: [AULA-118](#course/main/118).

## Passo a passo — execução gratuita e local
Node.js 22+ e o código da trilha. Abra o terminal na raiz do repositório:

```sh
node public/course-labs/reverse-ai/engine.mjs --module 5 --out ./rev-evidencias/m05
node --test public/course-labs/reverse-ai/engine.test.mjs public/course-labs/reverse-ai/lab.test.mjs
```

O primeiro comando cria `05-js-boundaries.json` em `./rev-evidencias/m05/`; o segundo valida as oito oficinas. Abra o artefato produzido com editor de texto. Ambos funcionam sem modelos, API, contas de terceiros, GPU ou acesso à rede.

1. Abra sample-ui.mjs e sample-rule.mjs e destaque o import/export estático.
2. Compare 05-js-boundaries.json com os arquivos, indicando o limite exato UI→regra.
3. Identifique o que NÃO é observado: servidor remoto, código de backend e tokens secretos.

## Perguntas de defesa e diagnóstico
1. Localizar import e export no módulo ESM Em que linha/saída de `05-js-boundaries.json` você encontra evidência? Qual entrada contestaria essa conclusão?
2. Separar interface local de regras e servidor remoto Em que linha/saída de `05-js-boundaries.json` você encontra evidência? Qual entrada contestaria essa conclusão?
3. Descrever o que bundles e source maps não demonstram Em que linha/saída de `05-js-boundaries.json` você encontra evidência? Qual entrada contestaria essa conclusão?
4. Entregar 05-js-boundaries.json com resultado e contraexemplo reproduzíveis Em que linha/saída de `05-js-boundaries.json` você encontra evidência? Qual entrada contestaria essa conclusão?

## Avaliação independente
Tente a [prova do módulo 05](/course-labs/reverse-ai/assessments/module-05.md) sem consultar o gabarito. Guarde um registro de pelo menos 120 caracteres sobre previsão, execução, erro e reteste. Sua marcação de progresso no site é autodeclarada, não execução remota de scripts.

## Restrições honestas
Ferramenta externa não é executada pelo runner. **REA**, quando instalado e configurado voluntariamente, analisa apps por CLI/MCP e pode combinar ferramentas locais. **Ghidra**, quando instalado pelo aluno, analisa o binário C próprio. Ambos requerem artefatos autorizados. Não execute código de terceiros, não burle DRM/licenças, não invente resultados de Ghidra/REA ou equivalência universal. Código gerado por IA sempre necessita revisão humana.

## Checklist verificável
- [ ] Usei apenas arquivo próprio e ambiente local.
- [ ] Registrei uma previsão antes de executar.
- [ ] Executei um caso permitido e um inválido.
- [ ] Separei resultado medido de sugestão da IA.
- [ ] Documentei uma limitação e um reteste.

**Evidência esperada:** O arquivo 05-js-boundaries.json existe na pasta ./rev-evidencias/m05 e a suíte engine.test.mjs passa, cobrindo um controle negativo específico.
