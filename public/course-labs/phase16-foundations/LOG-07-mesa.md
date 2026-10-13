# Caderno de trabalho LOG-07

Dois caixas calculam o mesmo subtotal e divergem porque uma rotina imprime o valor, mas não o devolve. Defina uma função de subtotal que outro cálculo possa usar, com parâmetros e retorno explícitos.

| Chamada | preço local | quantidade local | retorno | variável no chamador |
|---|---|---|---|---|
| a ← subtotal(250,3) | 250 | 3 | 750 | a=750 |
| b ← subtotal(250,0) | 250 | 0 | 0 | b=0 |

Ao terminar cada chamada, os nomes locais deixam de participar daquela execução; a e b continuam no chamador.

função subtotal(preço, quantidade):
    exigir preço e quantidade inteiros não negativos
    valor ← preço * quantidade // nome local, não global
    devolver valor
a ← subtotal(250, 3)
b ← subtotal(250, 0)
total ← a + b

Parcial: complete `subtotal(125,4) → ____`. Independente: escreva o contrato de `com_frete(valor, frete)` e use o retorno de subtotal como argumento. Autoexplicação: o que impediria total de ser calculado se subtotal somente imprimisse 750?

## Solução para conferir depois

Retorno 500. com_frete exige inteiros não negativos e devolve valor+frete; `com_frete(subtotal(125,4),150)` devolve 650. A função interna termina antes que a externa receba o argumento. Sem retorno numérico, total não tem os operandos exigidos. Checkpoint: quantidade -1 é erro de contrato, não subtotal negativo válido.