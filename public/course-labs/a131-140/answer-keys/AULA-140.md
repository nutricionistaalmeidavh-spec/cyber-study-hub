# AULA-140 — Gabarito independente

**Cenário:** Aplicativo próprio simulado inicia, grava log e gera evento de rede com ambiente bridged e snapshot.

**Observação:** exercício defensivo artificial; não executa malware e não representa validação de alunos por revisor humano.

## Questão 1

**Pergunta:** Quais eventos correlacionar?

**Resposta:** Criação de processo e operações em ordem.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 2

**Pergunta:** Por que snapshot é insuficiente?

**Resposta:** Tráfego já enviado não é desfeito.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 3

**Pergunta:** O que indica networkIsolationOk=false?

**Resposta:** A rede simulada não está desligada.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 4

**Pergunta:** Como diferenciar file e network?

**Resposta:** Tipos de evento e horário distintos.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 5

**Pergunta:** Qual caso positivo preservar?

**Resposta:** Log legítimo sem saída de rede.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 6

**Pergunta:** O que impede validar malware real?

**Resposta:** Nenhuma amostra foi executada e não há contenção testada.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Rubrica de correção

- 6 respostas x 15 pontos = 90; exigir mecanismo e observação, não apenas definição.
- 10 pontos para positivo, negativo, controle, reteste e limite corretamente relatados.
- Aprovado com ≥80/100 sem erro eliminatório; essa não é a classificação editorial A.
- **Erro eliminatório:** confundir indício com prova de malware, executar código não autorizado, criar persistência ou declarar sandbox segura sem ensaio.
- **Limite:** Só cronologia JSON, sem VM, tráfego real ou código malicioso.
