# Oficina 03 — Binários nativos e Ghidra

**Identidade permanente:** REV-IA-012. **Competência:** Investigar mapeamento estático de função e fluxo com o arquivo verificável 03-static-source-map.json, explicando evidências, hipóteses, limitações e um caso negativo sem exigir API ou serviço pago.

## O que será produzido
Arquivo 03-static-source-map.json realmente criado no computador do aluno, mais hipóteses, limitações e análise do módulo 3. **Arquivo-alvo:** `03-static-source-map.json`. Prova de execução = nome do arquivo, entrada prevista, comando, saída observada, rejeição/controle e conclusão que possa ser contestada.

## Arquivos que o aluno realmente precisa
- Código do checkpoint: `public/course-labs/reverse-ai/engine.mjs` e testes em `engine.test.mjs`.
- Comportamento de referência: `reference.mjs`; reconstrução independente: `candidate.mjs`.
- Programa C de autoria do curso: `sample.c`; módulos ES originais: `sample-ui.mjs` e `sample-rule.mjs`.
- Índice e contexto: [README](/course-labs/reverse-ai/README.md); referência canônica já existente: [AULA-115](#course/main/115).

## Passo a passo — execução gratuita e local
Node.js 22+ e o código da trilha. Abra o terminal na raiz do repositório:

```sh
node public/course-labs/reverse-ai/engine.mjs --module 3 --out ./rev-evidencias/m03
node --test public/course-labs/reverse-ai/engine.test.mjs public/course-labs/reverse-ai/lab.test.mjs
```

O primeiro comando cria `03-static-source-map.json` em `./rev-evidencias/m03/`; o segundo valida as oito oficinas. Abra o artefato produzido com editor de texto. Ambos funcionam sem modelos, API, contas de terceiros, GPU ou acesso à rede.

1. Antes de abrir o Ghidra, examine sample.c e preveja as funções main/parse e os ramos score>=22/score>=14.
2. Opcional: use cc -O0 -g -Wall -Wextra -Werror public/course-labs/reverse-ai/sample.c -o ./sample; importe ./sample no Ghidra.
3. Compare strings e fluxo reais da ferramenta com 03-static-source-map.json, que NÃO foi gerado pelo Ghidra.

## Perguntas de defesa e diagnóstico
1. Ler formato de binário e cadeias de texto Em que linha/saída de `03-static-source-map.json` você encontra evidência? Qual entrada contestaria essa conclusão?
2. Localizar função main e os dois ramos de prioridade Em que linha/saída de `03-static-source-map.json` você encontra evidência? Qual entrada contestaria essa conclusão?
3. Separar código decompilado do fonte original Em que linha/saída de `03-static-source-map.json` você encontra evidência? Qual entrada contestaria essa conclusão?
4. Entregar 03-static-source-map.json com resultado e contraexemplo reproduzíveis Em que linha/saída de `03-static-source-map.json` você encontra evidência? Qual entrada contestaria essa conclusão?

## Avaliação independente
Tente a [prova do módulo 03](/course-labs/reverse-ai/assessments/module-03.md) sem consultar o gabarito. Guarde um registro de pelo menos 120 caracteres sobre previsão, execução, erro e reteste. Sua marcação de progresso no site é autodeclarada, não execução remota de scripts.

## Restrições honestas
Ferramenta externa não é executada pelo runner. **REA**, quando instalado e configurado voluntariamente, analisa apps por CLI/MCP e pode combinar ferramentas locais. **Ghidra**, quando instalado pelo aluno, analisa o binário C próprio. Ambos requerem artefatos autorizados. Não execute código de terceiros, não burle DRM/licenças, não invente resultados de Ghidra/REA ou equivalência universal. Código gerado por IA sempre necessita revisão humana.

## Checklist verificável
- [ ] Usei apenas arquivo próprio e ambiente local.
- [ ] Registrei uma previsão antes de executar.
- [ ] Executei um caso permitido e um inválido.
- [ ] Separei resultado medido de sugestão da IA.
- [ ] Documentei uma limitação e um reteste.

**Evidência esperada:** O arquivo 03-static-source-map.json existe na pasta ./rev-evidencias/m03 e a suíte engine.test.mjs passa, cobrindo um controle negativo específico.
