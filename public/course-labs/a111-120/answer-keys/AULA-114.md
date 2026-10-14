# Gabarito independente — AULA-114: Jumps, Calls e Control Flow

**Abra depois de responder.** Evidências e cenários são sintéticos, de finalidade exclusivamente educacional.

## Situação

Um aplicativo de matrícula aceita idades 18–60. Um CFG reconstruído tem blocos `entry`, `invalidLow`, `invalidHigh`, `accept`, `return`. A implementação usa `if(age<18)... else if(age>60)... else accept`.

## Respostas fundamentadas

### Questão 1

**Resposta esperada:** entry → invalidLow se <18, senão segundo teste → invalidHigh se >60, senão accept; todos convergem a return.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 2

**Resposta esperada:** entry, invalidLow e return.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 3

**Resposta esperada:** entry, segundo teste, accept e return; 60 é aceito.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 4

**Resposta esperada:** 60; a condição `>=60` rejeitaria 60 e `>60` não.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 5

**Resposta esperada:** O grafo representa apenas a função/casos analisados, não prova de cobertura de entradas, handlers, erros externos ou chamadas indiretas.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

### Questão 6

**Resposta esperada:** Comparar resultados e efeitos para casos de fronteira e caminhos independentes, reconhecendo equivalência comportamental limitada.

**Avaliação:** conferir relação explícita entre dado, operação, estado, evidência e hipótese alternativa quando relevante.

## Rubrica — 100 pontos

| Dimensão | Pontos | Critério |
|---|---:|---|
| Fundamentação e mecanismo (Q1–2) | 30 | Explicação causal, não apenas nome da ferramenta |
| Comparação com evidência (Q3–4) | 30 | Caso positivo, resultado, hipótese controlada |
| Negativos e limites (Q5–6) | 30 | Contraexemplo, limite e reteste |
| Clareza e autorização | 10 | Programa próprio, sem segredo ou licença violada |

**Erro eliminatório:** Confundir arestas possíveis do CFG com caminho executado por determinada entrada. A revisão só aprova após corrigir esse erro.

**Referência de aprovação:** 80/100 sem erro eliminatório. Esta rubrica não afirma avaliação humana observada.
