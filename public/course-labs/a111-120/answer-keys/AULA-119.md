# Gabarito — AULA-119: Debugging dos próprios executáveis

**Somente depois da tentativa.** Este é um caso independente da fixture e o material não implica estudo humano observado.

## Caso de transferência

Um sistema próprio de frete cobra taxa adicional apenas quando peso ultrapassa 5 kg. Um desenvolvedor escreveu `weight>=5`, de modo que exatamente 5 também é taxado. O time tem testes apenas para 4 e 6 kg.

## Soluções e critérios

### Questão 1

**Resposta fundamentada:** Comparação usa >= em vez de >, incluindo indevidamente o limite.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 2

**Resposta fundamentada:** 5 kg.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 3

**Resposta fundamentada:** Sem taxa adicional, pois regra diz 'ultrapassa'.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 4

**Resposta fundamentada:** Substituir `weight>=5` por `weight>5` preservando cálculos restantes.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 5

**Resposta fundamentada:** 4 sem taxa, 5 sem taxa, 6 com taxa; observar saída e custo integral.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 6

**Resposta fundamentada:** Outro erro de cálculo ou apresentação pode produzir valor incorreto mesmo com condicional certa.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

## Rubrica de correção

| Categoria | Pontos | Evidência mínima |
|---|---:|---|
| Conceitos e mecanismo (Q1–2) | 30 | Sem confundir estado e interpretação |
| Evidência observável e hipóteses (Q3–4) | 30 | Contraexemplo e caso de fronteira |
| Regressão, limites e transferência (Q5–6) | 30 | Positivo e negativo sem extrapolar |
| Comunicação e escopo autorizado | 10 | Programa próprio e dados fictícios |

**Erro eliminatório:** Alterar expected do teste para coincidir com resultado defeituoso ou corrigir um caso quebrando os outros. Respostas com esse erro não atingem aprovação editorial.

**Critério de aprovação orientativo:** 80/100 sem erro eliminatório. Não há resultado medido com estudantes reais.
