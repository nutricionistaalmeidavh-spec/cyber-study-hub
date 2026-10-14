# Gabarito — AULA-116: x64dbg

**Somente depois da tentativa.** Este é um caso independente da fixture e o material não implica estudo humano observado.

## Caso de transferência

O programa próprio `int total=0; total+=4; total+=6; return total;` pausa antes da segunda soma. O painel do debugger mostra total=4. Outro colega insiste que o esperado naquele momento é 10.

## Soluções e critérios

### Questão 1

**Resposta fundamentada:** 0, depois 4 e ainda 4 antes da segunda soma.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 2

**Resposta fundamentada:** Um breakpoint antes da instrução não executou sua operação; o valor anterior é consistente.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 3

**Resposta fundamentada:** Single-step na instrução ou breakpoint depois dela, observando a mudança antes/depois.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 4

**Resposta fundamentada:** Resultado final 10.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 5

**Resposta fundamentada:** Consultar instruções/listing e registradores reais, build com símbolos e otimização; UI de variáveis pode perder localização.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 6

**Resposta fundamentada:** PC é índice em array JS, sem instruções, loader, endereços x86 ou stack nativa.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

## Rubrica de correção

| Categoria | Pontos | Evidência mínima |
|---|---:|---|
| Conceitos e mecanismo (Q1–2) | 30 | Sem confundir estado e interpretação |
| Evidência observável e hipóteses (Q3–4) | 30 | Contraexemplo e caso de fronteira |
| Regressão, limites e transferência (Q5–6) | 30 | Positivo e negativo sem extrapolar |
| Comunicação e escopo autorizado | 10 | Programa próprio e dados fictícios |

**Erro eliminatório:** Afirmar que breakpoint em instrução significa que ela já modificou o estado, sem verificar o momento do stop. Respostas com esse erro não atingem aprovação editorial.

**Critério de aprovação orientativo:** 80/100 sem erro eliminatório. Não há resultado medido com estudantes reais.
