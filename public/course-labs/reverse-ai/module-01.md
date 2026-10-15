# Oficina 01 — Fundamentos e limites da engenharia reversa

**Identidade permanente:** REV-IA-004. **Competência:** Investigar linha de base e autorização com o arquivo verificável 01-baseline.json, explicando evidências, hipóteses, limitações e um caso negativo sem exigir API ou serviço pago.

## O que será produzido
Arquivo 01-baseline.json realmente criado no computador do aluno, mais hipóteses, limitações e análise do módulo 1. **Arquivo-alvo:** `01-baseline.json`. Prova de execução = nome do arquivo, entrada prevista, comando, saída observada, rejeição/controle e conclusão que possa ser contestada.

## Arquivos que o aluno realmente precisa
- Código do checkpoint: `public/course-labs/reverse-ai/engine.mjs` e testes em `engine.test.mjs`.
- Comportamento de referência: `reference.mjs`; reconstrução independente: `candidate.mjs`.
- Programa C de autoria do curso: `sample.c`; módulos ES originais: `sample-ui.mjs` e `sample-rule.mjs`.
- Índice e contexto: [README](/course-labs/reverse-ai/README.md); referência canônica já existente: [AULA-028](#course/main/28).

## Passo a passo — execução gratuita e local
Node.js 22+ e o código da trilha. Abra o terminal na raiz do repositório:

```sh
node public/course-labs/reverse-ai/engine.mjs --module 1 --out ./rev-evidencias/m01
node --test public/course-labs/reverse-ai/engine.test.mjs public/course-labs/reverse-ai/lab.test.mjs
```

O primeiro comando cria `01-baseline.json` em `./rev-evidencias/m01/`; o segundo valida as oito oficinas. Abra o artefato produzido com editor de texto. Ambos funcionam sem modelos, API, contas de terceiros, GPU ou acesso à rede.

1. Registre primeiro que o escopo é o programa classificador de propriedade do curso, não uma aplicação comercial.
2. Teste severity=3, impact=1, blocked=false e descreva a saída prevista antes de ver a implementação.
3. Troque para severity=-1 e registre a rejeição esperada; compare comportamento e hipótese.

## Perguntas de defesa e diagnóstico
1. Distinguir entradas observadas de hipóteses Em que linha/saída de `01-baseline.json` você encontra evidência? Qual entrada contestaria essa conclusão?
2. Delimitar direito de uso antes da análise Em que linha/saída de `01-baseline.json` você encontra evidência? Qual entrada contestaria essa conclusão?
3. Repetir a linha de base e documentar exceções Em que linha/saída de `01-baseline.json` você encontra evidência? Qual entrada contestaria essa conclusão?
4. Entregar 01-baseline.json com resultado e contraexemplo reproduzíveis Em que linha/saída de `01-baseline.json` você encontra evidência? Qual entrada contestaria essa conclusão?

## Avaliação independente
Tente a [prova do módulo 01](/course-labs/reverse-ai/assessments/module-01.md) sem consultar o gabarito. Guarde um registro de pelo menos 120 caracteres sobre previsão, execução, erro e reteste. Sua marcação de progresso no site é autodeclarada, não execução remota de scripts.

## Restrições honestas
Ferramenta externa não é executada pelo runner. **REA**, quando instalado e configurado voluntariamente, analisa apps por CLI/MCP e pode combinar ferramentas locais. **Ghidra**, quando instalado pelo aluno, analisa o binário C próprio. Ambos requerem artefatos autorizados. Não execute código de terceiros, não burle DRM/licenças, não invente resultados de Ghidra/REA ou equivalência universal. Código gerado por IA sempre necessita revisão humana.

## Checklist verificável
- [ ] Usei apenas arquivo próprio e ambiente local.
- [ ] Registrei uma previsão antes de executar.
- [ ] Executei um caso permitido e um inválido.
- [ ] Separei resultado medido de sugestão da IA.
- [ ] Documentei uma limitação e um reteste.

**Evidência esperada:** O arquivo 01-baseline.json existe na pasta ./rev-evidencias/m01 e a suíte engine.test.mjs passa, cobrindo um controle negativo específico.
