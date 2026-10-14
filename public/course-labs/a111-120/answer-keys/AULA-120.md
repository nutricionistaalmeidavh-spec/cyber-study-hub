# Gabarito — AULA-120: Reconstrução de lógica

**Somente depois da tentativa.** Este é um caso independente da fixture e o material não implica estudo humano observado.

## Caso de transferência

Um programa próprio de triagem de pedidos devolve `blocked` para quantidade≤0; `normal` para 1–20; `bulk` para ≥21. Foram mostrados apenas resultados de 5, 10 e 30 ao analista. Uma hipótese coloca bulk em ≥20.

## Soluções e critérios

### Questão 1

**Resposta fundamentada:** Valores próximos ao limiar, especialmente 19, 20 e 21, além de 0/1 e inválidos.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 2

**Resposta fundamentada:** normal, pois bulk começa em 21.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 3

**Resposta fundamentada:** bulk, indicando divergência exatamente no limite.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 4

**Resposta fundamentada:** Ambas regras produzem mesmos resultados para esses três valores; não têm poder de distinguir a fronteira.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 5

**Resposta fundamentada:** Logs/trace confirmam comportamento em inputs, CFG mostra ramos potenciais, especificação define resultado esperado; comparar separadamente.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 6

**Resposta fundamentada:** 'O candidato corresponde aos casos documentados e falha ou passa nos held-out informados; equivalência global e source literal não foram provados'.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

## Rubrica de correção

| Categoria | Pontos | Evidência mínima |
|---|---:|---|
| Conceitos e mecanismo (Q1–2) | 30 | Sem confundir estado e interpretação |
| Evidência observável e hipóteses (Q3–4) | 30 | Contraexemplo e caso de fronteira |
| Regressão, limites e transferência (Q5–6) | 30 | Positivo e negativo sem extrapolar |
| Comunicação e escopo autorizado | 10 | Programa próprio e dados fictícios |

**Erro eliminatório:** Afirmar reconstrução perfeita por cinco exemplos ou memorizar outputs sem explicar predicados. Respostas com esse erro não atingem aprovação editorial.

**Critério de aprovação orientativo:** 80/100 sem erro eliminatório. Não há resultado medido com estudantes reais.
