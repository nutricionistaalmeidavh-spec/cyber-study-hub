# Gabarito — AULA-117: Decompilation

**Somente depois da tentativa.** Este é um caso independente da fixture e o material não implica estudo humano observado.

## Caso de transferência

No código próprio, a função devolve `true` quando `size <= 64`. O decompiler sugere `size < 64` e alguns testes usam apenas 10, 20 e 100.

## Soluções e critérios

### Questão 1

**Resposta fundamentada:** Uma inclui 64 e outra o exclui.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 2

**Resposta fundamentada:** size=64.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 3

**Resposta fundamentada:** true; o limite superior é inclusivo.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 4

**Resposta fundamentada:** Ambos predicados concordam nesses valores, escondendo a diferença no limite.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 5

**Resposta fundamentada:** Valores negativos não existem no domínio unsigned, mas casts/conversões podem alterar semântica em operações adjacentes.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 6

**Resposta fundamentada:** Demonstrar equivalência nos casos testados, explicar divergências e hipóteses de tipo, sem alegar reconstrução literal.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

## Rubrica de correção

| Categoria | Pontos | Evidência mínima |
|---|---:|---|
| Conceitos e mecanismo (Q1–2) | 30 | Sem confundir estado e interpretação |
| Evidência observável e hipóteses (Q3–4) | 30 | Contraexemplo e caso de fronteira |
| Regressão, limites e transferência (Q5–6) | 30 | Positivo e negativo sem extrapolar |
| Comunicação e escopo autorizado | 10 | Programa próprio e dados fictícios |

**Erro eliminatório:** Concluir que o decompiler recupera o source original exatamente ou que amostras provam equivalência global. Respostas com esse erro não atingem aprovação editorial.

**Critério de aprovação orientativo:** 80/100 sem erro eliminatório. Não há resultado medido com estudantes reais.
