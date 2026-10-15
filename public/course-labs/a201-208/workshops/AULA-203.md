# AULA-203 — Sensitive Information Disclosure: laboratório de controle de IA

**ID canônico:** AULA-203. **Tipo:** experimento didático offline com decisões determinísticas, não um modelo de IA instalado. **Requisitos:** Node.js 22+ e dados fictícios.

## Problema e projeto de laboratório

Logs e saídas substituem segredos fictícios por marcações. A aplicação de demonstração possui documentos `public-1`, `alice-1`, `bob-1`, principais fictícios e ferramentas explicitamente permitidas. O arquivo `../models.mjs` fornece a função `scrubOutput`; o runner utiliza esse contrato diretamente.

## Arquivos e execução

- [Código de controle](../models.mjs), [runner](../run.mjs), [testes independentes](../run.test.mjs).
- Fonte pedagógica completa: `public/course-library/main/203.md`.

```sh
node public/course-labs/a201-208/run.mjs 203
node --test public/course-labs/a201-208/run.test.mjs public/course-labs/a201-208/lab.test.mjs
```

## Exercício guiado e contraprova

1. Registre o principal, documento ou ferramenta testada e preveja a decisão.
2. Confira no JSON o par `positive` e `negative`, que devem demonstrar comportamentos distintos.
3. Faça uma cópia da fixture para alterar **um único campo** de redaction. Justifique o resultado antes de executá-lo.
4. Documente **evidência de entrada**, **decisão de política**, **resultado inesperado/negativo** e **limite**.
5. Retorne à fixture original e reteste a suíte.
6. Explique por que texto não confiável, prompt ou output do modelo não autoriza leitura, exportação nem execução de ferramenta.

## Critérios de aprovação

Há um caso autorizado, um bloqueado, um teste de transferência próprio e uma explicação de qual parte do sistema faz a checagem. A saída é vinculada à AULA-203, não a outra aula. Gabaritos não são entregues antecipadamente.

**Limite:** nenhum LLM é invocado; não simula robustez de modelo real, RAG em produção, fuga de dados real nem agente com acesso a serviços. A prática demonstra apenas uma camada de validação local.
