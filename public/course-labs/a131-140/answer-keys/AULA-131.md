# AULA-131 — Gabarito independente

**Cenário:** Um release próprio com hash conhecido e um anexo desconhecido com evento de rede fictício chegam ao analista.

**Observação:** exercício defensivo artificial; não executa malware e não representa validação de alunos por revisor humano.

## Questão 1

**Pergunta:** Por que as duas fichas não têm mesmo veredito?

**Resposta:** Proveniência e corroboração diferem.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 2

**Pergunta:** Qual propriedade o hash confirma?

**Resposta:** Igualdade de bytes, não intenção.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 3

**Pergunta:** Que significa evento de rede isolado?

**Resposta:** Um registro, não infecção comprovada.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 4

**Pergunta:** Qual ordem segura da triagem?

**Resposta:** Preservar, documentar, analisar estático e correlacionar.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 5

**Pergunta:** O que incluir na cadeia de custódia?

**Resposta:** Hash, fonte, horário, analista e armazenamento.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 6

**Pergunta:** Que conclusão não é permitida?

**Resposta:** Declarar malware apenas por indicador.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Rubrica de correção

- 6 respostas x 15 pontos = 90; exigir mecanismo e observação, não apenas definição.
- 10 pontos para positivo, negativo, controle, reteste e limite corretamente relatados.
- Aprovado com ≥80/100 sem erro eliminatório; essa não é a classificação editorial A.
- **Erro eliminatório:** confundir indício com prova de malware, executar código não autorizado, criar persistência ou declarar sandbox segura sem ensaio.
- **Limite:** Não executa arquivos nem identifica malware; só trata metadados simulados.
