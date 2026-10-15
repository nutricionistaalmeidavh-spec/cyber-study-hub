# Gabarito independente — AULA-175 (Root Cause Analysis)

### Questão 1

**Pergunta:** Qual invariante foi violada em 6,5,16?

**Resposta fundamentada:** declared <= available: 6 não cabe nos 5 bytes disponíveis.

### Questão 2

**Pergunta:** O que é gatilho e o que é causa?

**Resposta fundamentada:** Gatilho é o input; causa é ausência de validação do comprimento.

### Questão 3

**Pergunta:** Qual controle negativo verifica a capacidade?

**Resposta fundamentada:** declared=17 available=17 capacity=16 → CAPACITY_BOUND_MISSING.

### Questão 4

**Pergunta:** Qual entrada legítima preservar?

**Resposta fundamentada:** declared=5 available=5 capacity=16.

### Questão 5

**Pergunta:** Que correção deve ocorrer antes da operação?

**Resposta fundamentada:** Validar origem, capacidade e inteiros não negativos.

### Questão 6

**Pergunta:** Por que ausência de crash não afasta a causa?

**Resposta fundamentada:** Comportamento observável depende do caminho e do ambiente.

## Rubrica

6×15 pontos pela resposta e justificativa, 10 pela evidência de entrada/saída e contraprova. **Erro eliminatório:** extrapolar o modelo local para sistemas reais sem autorização ou inventar sucesso de exploit. Não há validação com estudantes humanos.
