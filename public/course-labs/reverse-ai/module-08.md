# Oficina 08 — Capstone: auditoria e entrega

**Identidade permanente:** REV-IA-032. **Competência:** Investigar dossiê final e hashes dos checkpoints com o arquivo verificável 08-capstone-manifest.json, explicando evidências, hipóteses, limitações e um caso negativo sem exigir API ou serviço pago.

## O que será produzido
Arquivo 08-capstone-manifest.json realmente criado no computador do aluno, mais hipóteses, limitações e análise do módulo 8. **Arquivo-alvo:** `08-capstone-manifest.json`. Prova de execução = nome do arquivo, entrada prevista, comando, saída observada, rejeição/controle e conclusão que possa ser contestada.

## Arquivos que o aluno realmente precisa
- Código do checkpoint: `public/course-labs/reverse-ai/engine.mjs` e testes em `engine.test.mjs`.
- Comportamento de referência: `reference.mjs`; reconstrução independente: `candidate.mjs`.
- Programa C de autoria do curso: `sample.c`; módulos ES originais: `sample-ui.mjs` e `sample-rule.mjs`.
- Índice e contexto: [README](/course-labs/reverse-ai/README.md); referência canônica já existente: [AULA-130](#course/main/130).

## Passo a passo — execução gratuita e local
Node.js 22+ e o código da trilha. Abra o terminal na raiz do repositório:

```sh
node public/course-labs/reverse-ai/engine.mjs --module 8 --out ./rev-evidencias/m08
node --test public/course-labs/reverse-ai/engine.test.mjs public/course-labs/reverse-ai/lab.test.mjs
```

O primeiro comando cria `08-capstone-manifest.json` em `./rev-evidencias/m08/`; o segundo valida as oito oficinas. Abra o artefato produzido com editor de texto. Ambos funcionam sem modelos, API, contas de terceiros, GPU ou acesso à rede.

1. Confirme que os módulos 1–7 geram seus próprios arquivos de evidência, usando engine.test.mjs.
2. Execute o capstone e confira capítulos, nomes e hashes em 08-capstone-manifest.json.
3. Monte um relatório de decisão: escopo, comandos, resultados, limitações e diferença entre teste de código próprio e produto real.

## Perguntas de defesa e diagnóstico
1. Preservar proveniência e integridade de artefatos Em que linha/saída de `08-capstone-manifest.json` você encontra evidência? Qual entrada contestaria essa conclusão?
2. Definir critérios explícitos de aceite e limites Em que linha/saída de `08-capstone-manifest.json` você encontra evidência? Qual entrada contestaria essa conclusão?
3. Montar documentação reproduzível de ponta a ponta Em que linha/saída de `08-capstone-manifest.json` você encontra evidência? Qual entrada contestaria essa conclusão?
4. Entregar 08-capstone-manifest.json com resultado e contraexemplo reproduzíveis Em que linha/saída de `08-capstone-manifest.json` você encontra evidência? Qual entrada contestaria essa conclusão?

## Avaliação independente
Tente a [prova do módulo 08](/course-labs/reverse-ai/assessments/module-08.md) sem consultar o gabarito. Guarde um registro de pelo menos 120 caracteres sobre previsão, execução, erro e reteste. Sua marcação de progresso no site é autodeclarada, não execução remota de scripts.

## Restrições honestas
Ferramenta externa não é executada pelo runner. **REA**, quando instalado e configurado voluntariamente, analisa apps por CLI/MCP e pode combinar ferramentas locais. **Ghidra**, quando instalado pelo aluno, analisa o binário C próprio. Ambos requerem artefatos autorizados. Não execute código de terceiros, não burle DRM/licenças, não invente resultados de Ghidra/REA ou equivalência universal. Código gerado por IA sempre necessita revisão humana.

## Checklist verificável
- [ ] Usei apenas arquivo próprio e ambiente local.
- [ ] Registrei uma previsão antes de executar.
- [ ] Executei um caso permitido e um inválido.
- [ ] Separei resultado medido de sugestão da IA.
- [ ] Documentei uma limitação e um reteste.

**Evidência esperada:** O arquivo 08-capstone-manifest.json existe na pasta ./rev-evidencias/m08 e a suíte engine.test.mjs passa, cobrindo um controle negativo específico.
