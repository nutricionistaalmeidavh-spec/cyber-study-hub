# Caderno de trabalho LOG-04

Um carrinho ganha frete grátis a partir de R$ 100,00, desde que a entrega seja local. Modele a decisão usando centavos inteiros e uma flag booleana. O caso exatamente no limite deve ser tratado sem ambiguidade.

| Subtotal (centavos) | Local | >= 10000 | Resultado do E | Frete |
|---|---|---|---|---|
| 9999 | verdadeiro | falso | falso | 1500 |
| 10000 | verdadeiro | verdadeiro | verdadeiro | 0 |
| 10001 | falso | verdadeiro | falso | 1500 |

exigir subtotal inteiro >= 0 e local booleano
se subtotal >= 10000 E local:
    frete ← 0    // só este ramo concede gratuidade
senão:
    frete ← 1500
total ← subtotal + frete

Parcial: calcule total para subtotal 10000 e local falso. Independente: construa um caso em que trocar E por OU conceda gratuidade incorreta e outro em que trocar >= por > negue a gratuidade. Autoexplicação: justifique a decisão sem citar apenas o nome do operador.

## Solução para conferir depois

10000 com local falso resulta em frete 1500 e total 11500. Com subtotal 100 e local verdadeiro, OU aceitaria indevidamente; com subtotal 10000 local verdadeiro, > negaria indevidamente. Checkpoint: a saída do segundo ramo não depende de qual operando foi falso.