# AULA-136 — Gabarito independente

**Cenário:** VM com snapshot e rede host-only usa pasta compartilhada; querem tratá-la como isolamento completo.

**Observação:** exercício defensivo artificial; não executa malware e não representa validação de alunos por revisor humano.

## Questão 1

**Pergunta:** Host-only é isolamento do host?

**Resposta:** Não, é rede local com host.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 2

**Pergunta:** Para que serve snapshot?

**Resposta:** Restaurar estado, não conter comunicação atual.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 3

**Pergunta:** Por que desabilitar pastas?

**Resposta:** Evitar transferência cruzada.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 4

**Pergunta:** Por que usar credenciais fictícias?

**Resposta:** Proteger contas reais.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 5

**Pergunta:** Qual positivo é aprovado?

**Resposta:** Checklist de fixture sem exposição de host.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 6

**Pergunta:** O que checklist não autoriza?

**Resposta:** Execução de malware real.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Rubrica de correção

- 6 respostas x 15 pontos = 90; exigir mecanismo e observação, não apenas definição.
- 10 pontos para positivo, negativo, controle, reteste e limite corretamente relatados.
- Aprovado com ≥80/100 sem erro eliminatório; essa não é a classificação editorial A.
- **Erro eliminatório:** confundir indício com prova de malware, executar código não autorizado, criar persistência ou declarar sandbox segura sem ensaio.
- **Limite:** Não provisiona VM nem verifica isolamento contra malware ao vivo.
