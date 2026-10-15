# Gabarito independente — AULA-176 (Reproduzir Vulnerabilidade)

### Questão 1

**Pergunta:** Qual status retorna a fixture-v1 seed29?

**Resposta fundamentada:** REPRODUCED ao observar a divergência de comprimento.

### Questão 2

**Pergunta:** Qual status se o esperado mudar para OK?

**Resposta fundamentada:** EXPECTATION_MISMATCH.

### Questão 3

**Pergunta:** Por que fixar a versão antes do reteste?

**Resposta fundamentada:** Evita atribuir à correção um resultado de outro build.

### Questão 4

**Pergunta:** Qual teste positivo criar?

**Resposta fundamentada:** PKT|4|ABCD com expectativa OK.

### Questão 5

**Pergunta:** Quais metadados salvar?

**Resposta fundamentada:** Versão, seed, entrada, expectativa, observado e hash do build real se aplicável.

### Questão 6

**Pergunta:** O que invalida o escopo?

**Resposta fundamentada:** Um alvo de produção ou dados privados.

## Rubrica

6×15 pontos pela resposta e justificativa, 10 pela evidência de entrada/saída e contraprova. **Erro eliminatório:** extrapolar o modelo local para sistemas reais sem autorização ou inventar sucesso de exploit. Não há validação com estudantes humanos.
