# Oficina 07 — Reconstrução e testes diferenciais

**Identidade permanente:** REV-IA-028. **Competência:** Investigar matriz diferencial e mutante rejeitado com o arquivo verificável 07-differential-report.json, explicando evidências, hipóteses, limitações e um caso negativo sem exigir API ou serviço pago.

## O que será produzido
Arquivo 07-differential-report.json realmente criado no computador do aluno, mais hipóteses, limitações e análise do módulo 7. **Arquivo-alvo:** `07-differential-report.json`. Prova de execução = nome do arquivo, entrada prevista, comando, saída observada, rejeição/controle e conclusão que possa ser contestada.

## Arquivos que o aluno realmente precisa
- Código do checkpoint: `public/course-labs/reverse-ai/engine.mjs` e testes em `engine.test.mjs`.
- Comportamento de referência: `reference.mjs`; reconstrução independente: `candidate.mjs`.
- Programa C de autoria do curso: `sample.c`; módulos ES originais: `sample-ui.mjs` e `sample-rule.mjs`.
- Índice e contexto: [README](/course-labs/reverse-ai/README.md); referência canônica já existente: [AULA-129](#course/main/129).

## Passo a passo — execução gratuita e local
Node.js 22+ e o código da trilha. Abra o terminal na raiz do repositório:

```sh
node public/course-labs/reverse-ai/engine.mjs --module 7 --out ./rev-evidencias/m07
node --test public/course-labs/reverse-ai/engine.test.mjs public/course-labs/reverse-ai/lab.test.mjs
```

O primeiro comando cria `07-differential-report.json` em `./rev-evidencias/m07/`; o segundo valida as oito oficinas. Abra o artefato produzido com editor de texto. Ambos funcionam sem modelos, API, contas de terceiros, GPU ou acesso à rede.

1. Modifique intencionalmente uma cópia de candidate.mjs para classificar score=22 como high; execute o teste e registre a falha.
2. Reverta a mutação e reteste: 07-differential-report.json deve indicar regressionFailures vazio.
3. Explique amostragem, limites de equivalência e por que mutation.killed=true é requisito.

## Perguntas de defesa e diagnóstico
1. Escrever implementação candidata independente Em que linha/saída de `07-differential-report.json` você encontra evidência? Qual entrada contestaria essa conclusão?
2. Cobrir pares severidade/impacto e estado bloqueado Em que linha/saída de `07-differential-report.json` você encontra evidência? Qual entrada contestaria essa conclusão?
3. Usar mutação para provar sensibilidade da suíte Em que linha/saída de `07-differential-report.json` você encontra evidência? Qual entrada contestaria essa conclusão?
4. Entregar 07-differential-report.json com resultado e contraexemplo reproduzíveis Em que linha/saída de `07-differential-report.json` você encontra evidência? Qual entrada contestaria essa conclusão?

## Avaliação independente
Tente a [prova do módulo 07](/course-labs/reverse-ai/assessments/module-07.md) sem consultar o gabarito. Guarde um registro de pelo menos 120 caracteres sobre previsão, execução, erro e reteste. Sua marcação de progresso no site é autodeclarada, não execução remota de scripts.

## Restrições honestas
Ferramenta externa não é executada pelo runner. **REA**, quando instalado e configurado voluntariamente, analisa apps por CLI/MCP e pode combinar ferramentas locais. **Ghidra**, quando instalado pelo aluno, analisa o binário C próprio. Ambos requerem artefatos autorizados. Não execute código de terceiros, não burle DRM/licenças, não invente resultados de Ghidra/REA ou equivalência universal. Código gerado por IA sempre necessita revisão humana.

## Checklist verificável
- [ ] Usei apenas arquivo próprio e ambiente local.
- [ ] Registrei uma previsão antes de executar.
- [ ] Executei um caso permitido e um inválido.
- [ ] Separei resultado medido de sugestão da IA.
- [ ] Documentei uma limitação e um reteste.

**Evidência esperada:** O arquivo 07-differential-report.json existe na pasta ./rev-evidencias/m07 e a suíte engine.test.mjs passa, cobrindo um controle negativo específico.
