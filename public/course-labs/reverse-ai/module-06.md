# Oficina 06 — REA, agentes e MCP com execução local

**Identidade permanente:** REV-IA-024. **Competência:** Investigar dossiê de alegações, evidências e limites com o arquivo verificável 06-agent-evidence.json, explicando evidências, hipóteses, limitações e um caso negativo sem exigir API ou serviço pago.

## O que será produzido
Arquivo 06-agent-evidence.json realmente criado no computador do aluno, mais hipóteses, limitações e análise do módulo 6. **Arquivo-alvo:** `06-agent-evidence.json`. Prova de execução = nome do arquivo, entrada prevista, comando, saída observada, rejeição/controle e conclusão que possa ser contestada.

## Arquivos que o aluno realmente precisa
- Código do checkpoint: `public/course-labs/reverse-ai/engine.mjs` e testes em `engine.test.mjs`.
- Comportamento de referência: `reference.mjs`; reconstrução independente: `candidate.mjs`.
- Programa C de autoria do curso: `sample.c`; módulos ES originais: `sample-ui.mjs` e `sample-rule.mjs`.
- Índice e contexto: [README](/course-labs/reverse-ai/README.md); referência canônica já existente: [AULA-117](#course/main/117).

## Passo a passo — execução gratuita e local
Node.js 22+ e o código da trilha. Abra o terminal na raiz do repositório:

```sh
node public/course-labs/reverse-ai/engine.mjs --module 6 --out ./rev-evidencias/m06
node --test public/course-labs/reverse-ai/engine.test.mjs public/course-labs/reverse-ai/lab.test.mjs
```

O primeiro comando cria `06-agent-evidence.json` em `./rev-evidencias/m06/`; o segundo valida as oito oficinas. Abra o artefato produzido com editor de texto. Ambos funcionam sem modelos, API, contas de terceiros, GPU ou acesso à rede.

1. Entenda REA em https://github.com/morluto/rea e sua CLI/MCP, sem instalar automaticamente nada.
2. Opcional para ambiente autorizado: npx rea-agents setup; confira versão Node e alterações na configuração do agente antes de aprovar.
3. Compare 06-agent-evidence.json: uma hipótese medida, uma não verificada, uma afirmação falsa; registre o que o agente realmente executou.

## Perguntas de defesa e diagnóstico
1. Identificar REA como interface CLI/MCP, não magia Em que linha/saída de `06-agent-evidence.json` você encontra evidência? Qual entrada contestaria essa conclusão?
2. Configurar ferramenta sob aprovação e sem serviço pago obrigatório Em que linha/saída de `06-agent-evidence.json` você encontra evidência? Qual entrada contestaria essa conclusão?
3. Contrapor agente e evidência local auditável Em que linha/saída de `06-agent-evidence.json` você encontra evidência? Qual entrada contestaria essa conclusão?
4. Entregar 06-agent-evidence.json com resultado e contraexemplo reproduzíveis Em que linha/saída de `06-agent-evidence.json` você encontra evidência? Qual entrada contestaria essa conclusão?

## Avaliação independente
Tente a [prova do módulo 06](/course-labs/reverse-ai/assessments/module-06.md) sem consultar o gabarito. Guarde um registro de pelo menos 120 caracteres sobre previsão, execução, erro e reteste. Sua marcação de progresso no site é autodeclarada, não execução remota de scripts.

## Restrições honestas
Ferramenta externa não é executada pelo runner. **REA**, quando instalado e configurado voluntariamente, analisa apps por CLI/MCP e pode combinar ferramentas locais. **Ghidra**, quando instalado pelo aluno, analisa o binário C próprio. Ambos requerem artefatos autorizados. Não execute código de terceiros, não burle DRM/licenças, não invente resultados de Ghidra/REA ou equivalência universal. Código gerado por IA sempre necessita revisão humana.

## Checklist verificável
- [ ] Usei apenas arquivo próprio e ambiente local.
- [ ] Registrei uma previsão antes de executar.
- [ ] Executei um caso permitido e um inválido.
- [ ] Separei resultado medido de sugestão da IA.
- [ ] Documentei uma limitação e um reteste.

**Evidência esperada:** O arquivo 06-agent-evidence.json existe na pasta ./rev-evidencias/m06 e a suíte engine.test.mjs passa, cobrindo um controle negativo específico.
