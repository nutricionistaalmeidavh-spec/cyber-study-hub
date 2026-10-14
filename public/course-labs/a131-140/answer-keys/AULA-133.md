# AULA-133 — Gabarito independente

**Cenário:** Uma fixture tem prefixo MZ e outra ELF, mas um aluno trata o prefixo como prova de PE íntegro.

**Observação:** exercício defensivo artificial; não executa malware e não representa validação de alunos por revisor humano.

## Questão 1

**Pergunta:** MZ prova PE completo?

**Resposta:** Não, é candidato a cabeçalho.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 2

**Pergunta:** Que dados complementares PE exige?

**Resposta:** e_lfanew, assinatura PE e seções válidas.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 3

**Pergunta:** Por que executed=false?

**Resposta:** Somente lê bytes inertes em Buffer.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 4

**Pergunta:** Como tratar arquivo vazio?

**Resposta:** Classificar empty sem execução.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 5

**Pergunta:** Que campos garantem reprodutibilidade?

**Resposta:** Hash, tamanho e versão do parser.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 6

**Pergunta:** Que conclusão permanece aberta?

**Resposta:** Comportamento e intenção em runtime.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Rubrica de correção

- 6 respostas x 15 pontos = 90; exigir mecanismo e observação, não apenas definição.
- 10 pontos para positivo, negativo, controle, reteste e limite corretamente relatados.
- Aprovado com ≥80/100 sem erro eliminatório; essa não é a classificação editorial A.
- **Erro eliminatório:** confundir indício com prova de malware, executar código não autorizado, criar persistência ou declarar sandbox segura sem ensaio.
- **Limite:** Não é parser de PE/ELF completo e não inspeciona malware real.
