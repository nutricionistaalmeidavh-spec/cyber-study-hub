# LOG-04 — Condições

**Trilha paralela:** Lógica e Algoritmos  
**Posição:** 4/20  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** LOG-03  
**Próxima recomendada:** LOG-05  
**Ambiente:** pseudocódigo ou Python opcional  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Um carrinho ganha frete grátis a partir de R$ 100,00, desde que a entrega seja local. Modele a decisão usando centavos inteiros e uma flag booleana. O caso exatamente no limite deve ser tratado sem ambiguidade.

## Mecanismo e exemplo resolvido

A expressão `(subtotal >= 10000) E local` tem dois operandos booleanos. Ambos precisam ser verdadeiros para executar o primeiro ramo; qualquer falso leva ao segundo. O bloco `senão` pertence ao mesmo `se`: somente um ramo é executado. Usar centavos evita comparar aproximações de ponto flutuante para dinheiro neste exercício.

| Subtotal (centavos) | Local | >= 10000 | Resultado do E | Frete |
|---|---|---|---|---|
| 9999 | verdadeiro | falso | falso | 1500 |
| 10000 | verdadeiro | verdadeiro | verdadeiro | 0 |
| 10001 | falso | verdadeiro | falso | 1500 |

```text
exigir subtotal inteiro >= 0 e local booleano
se subtotal >= 10000 E local:
    frete ← 0    // só este ramo concede gratuidade
senão:
    frete ← 1500
total ← subtotal + frete
```

**Exercício de mesa para baixar:** [LOG-04-mesa.md](/course-labs/phase16-foundations/LOG-04-mesa.md). Não requer runtime.

## Prática e autoexplicação

Parcial: calcule total para subtotal 10000 e local falso. Independente: construa um caso em que trocar E por OU conceda gratuidade incorreta e outro em que trocar >= por > negue a gratuidade. Autoexplicação: justifique a decisão sem citar apenas o nome do operador.

## Solução comentada e checkpoints

10000 com local falso resulta em frete 1500 e total 11500. Com subtotal 100 e local verdadeiro, OU aceitaria indevidamente; com subtotal 10000 local verdadeiro, > negaria indevidamente. Checkpoint: a saída do segundo ramo não depende de qual operando foi falso.

## Robustez, reteste e diagnóstico

Uma string "false" não é automaticamente o booleano falso em toda linguagem. Valide o tipo antes da condição. Se R$ 100,00 cair no ramo pago, examine >=; se toda entrega local for gratuita, examine E/OU. Reteste as três linhas da tabela e subtotal negativo, que deve ser rejeitado antes da decisão.

## Quiz

1. **Qual subtotal local está na fronteira gratuita?**
   - A) 10000
   - B) 9999
   - C) 10001 apenas

2. **Com subtotal 12000 e local falso, o E resulta em:**
   - A) verdadeiro
   - B) 12000, porque E devolve o subtotal
   - C) falso

3. **Qual mudança permite frete grátis indevido para subtotal 100 local?**
   - A) >= por >
   - B) E por OU
   - C) 1500 por 1600

**Gabarito comentado:** 1: A — >= inclui a igualdade. 2: C — um operando falso basta. 3: B — OU aceita somente a condição local.

## Flashcards

- **Caso de fronteira** → Valor exatamente onde a decisão muda: 10000.
- **Conjunção E** → Verdadeira somente se ambos os operandos forem verdadeiros.
- **Exclusividade dos ramos** → Um se/senão executa exatamente um dos dois blocos após avaliar a condição.
