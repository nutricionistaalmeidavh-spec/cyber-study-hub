# Gabarito — AULA-172 Coverage-Guided Fuzzing

### Questão 1

**Pergunta:** Quais três caminhos atingem as sementes FORM|V=7, FORM|V=7|LEN=2 e FORM|V=7|LEN=2|DATA=HI?

**Resposta:** VERSION_ONLY, HAS_LENGTH e COMPLETE_FORM.

### Questão 2

**Pergunta:** O que muda quando LEN=3 e DATA=HI?

**Resposta:** LENGTH_MISMATCH; comprimento difere de 2.

### Questão 3

**Pergunta:** Qual é um seed para caminho EMPTY?

**Resposta:** String vazia.

### Questão 4

**Pergunta:** Que vantagem há em preservar corpus mínimo de ramos novos?

**Resposta:** Regressão reproduzível e menor redundância.

### Questão 5

**Pergunta:** Coverage alto prova segurança?

**Resposta:** Não, cobertura só mede caminhos percorridos.

### Questão 6

**Pergunta:** Qual positivo retestar após corrigir comprimento?

**Resposta:** LEN=2 com DATA=HI permanece completo e aceito.

## Rubrica

Seis respostas valem 15 pontos cada; 10 pontos adicionais pela documentação de entrada, previsão, observação e limites. **Erro eliminatório:** afirmar exploração real sem evidência ou usar sistemas sem autorização. Classificação editorial por IA; não avalia aluno.
