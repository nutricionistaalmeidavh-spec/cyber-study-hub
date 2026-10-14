# Gabarito independente — AULA-115: Introdução ao Ghidra

**Abra depois de responder.** Evidências e cenários são sintéticos, de finalidade exclusivamente educacional.

## Situação

Um binário didático possui a string `PAYMENT_OK`. Ghidra mostra uma referência a ela em uma função de logging, mas o decompiler batiza essa função `validatePayment`. Um aluno afirma que a referência comprova o pagamento realizado.

## Respostas fundamentadas

### Questão 1

**Resposta esperada:** Que algum trecho de código/dados referencia a string, não que foi executado ou que a regra aprovou.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 2

**Resposta esperada:** Nomes do decompiler podem ser inferidos, renomeados manualmente ou ausentes; a decisão está nas instruções/dados.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 3

**Resposta esperada:** Relacionar caller/callee, branches, registradores, destino de chamadas e estado da função em listing.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 4

**Resposta esperada:** Gerar entradas fictícias autorizadas, observar resultado/regras e diferenciar log de transação/estado persistido.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 5

**Resposta esperada:** Código ou branch morto pode conter a string e xref sem execução real.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 6

**Resposta esperada:** Separar string observada, caminho potencial, teste executado e limites; exigir outra evidência para afirmar efeito financeiro.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

## Rubrica — 100 pontos

| Dimensão | Pontos | Critério |
|---|---:|---|
| Fundamentação e mecanismo (Q1–2) | 30 | Explicação causal, não apenas nome da ferramenta |
| Comparação com evidência (Q3–4) | 30 | Caso positivo, resultado, hipótese controlada |
| Negativos e limites (Q5–6) | 30 | Contraexemplo, limite e reteste |
| Clareza e autorização | 10 | Programa próprio, sem segredo ou licença violada |

**Erro eliminatório:** Interpretar o pseudocódigo gerado automaticamente como transcrição fiel do source. A revisão só aprova após corrigir esse erro.

**Referência de aprovação:** 80/100 sem erro eliminatório. Esta rubrica não afirma avaliação humana observada.
