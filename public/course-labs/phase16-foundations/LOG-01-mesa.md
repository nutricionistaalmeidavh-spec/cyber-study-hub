# Caderno de trabalho LOG-01

Uma oficina possui 7 peças e recebe um pedido de 4. Precisamos aceitar somente pedidos inteiros positivos que caibam no estoque e informar saldo e decisão. Ao final, você deve decompor essa regra em entradas, etapas e invariantes, sem depender de uma linguagem.

| Estoque | Pedido | Domínio válido? | Cabe? | Decisão | Saldo |
|---|---|---|---|---|---|
| 7 | 4 | sim | sim | aceitar | 3 |
| 7 | 8 | sim | não | recusar | 7 |
| 7 | 0 | não | não avaliar | inválido | 7 |
| 0 | 1 | sim | não | recusar | 0 |

receber estoque, pedido
se estoque não é inteiro ou estoque < 0: devolver erro de estoque
se pedido não é inteiro ou pedido <= 0: devolver inválido, estoque
se pedido > estoque: devolver recusar, estoque
saldo ← estoque - pedido  // única etapa que altera a quantidade
devolver aceitar, saldo

Parcial: complete `(7,7) → (____,____)` e identifique a etapa responsável. Independente: resolva `(3,-2)`, `(3,2.5)` e `(3,1)`, registrando cada comparação. Autoexplicação: por que subtrair antes de validar o pedido quebra a regra? Qual entrada prova isso?

## Solução para conferir depois

Pedido 7 é aceito e saldo é 0. Os pedidos -2 e 2,5 são inválidos; saldo permanece 3. Pedido 1 produz saldo 2. O contraexemplo -2 produziria 5 se subtraído prematuramente. Checkpoint: cada execução retorna uma decisão e termina; “inválido” e “sem estoque” são motivos diferentes.