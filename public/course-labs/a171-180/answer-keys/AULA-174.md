# Gabarito — AULA-174 Crash Triage

### Questão 1

**Pergunta:** Quantos grupos aparecem nesse conjunto de três logs?

**Resposta:** Dois, com contagens 2 e 1.

### Questão 2

**Pergunta:** Por que dois logs iguais não comprovam a mesma causa?

**Resposta:** Assinatura é heurística; existem colisões e stacks instáveis.

### Questão 3

**Pergunta:** Que sintoma distingue o terceiro log?

**Resposta:** Erro temporal heap-use-after-free e frame cleanup.

### Questão 4

**Pergunta:** Como minimizar uma entrada com rigor?

**Resposta:** Retirar partes enquanto o mesmo predicado de falha continua reproduzindo.

### Questão 5

**Pergunta:** Como classificar severidade sem impacto demonstrado?

**Resposta:** Como hipótese, sem afirmar explorabilidade.

### Questão 6

**Pergunta:** Que evidência anexar ao ticket?

**Resposta:** Build, entrada, classe, stack, frequência e retestes positivos/negativos.

## Rubrica

Seis respostas valem 15 pontos cada; 10 pontos adicionais pela documentação de entrada, previsão, observação e limites. **Erro eliminatório:** afirmar exploração real sem evidência ou usar sistemas sem autorização. Classificação editorial por IA; não avalia aluno.
