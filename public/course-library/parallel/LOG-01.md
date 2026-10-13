# LOG-01 — Algoritmos e decomposição de problemas

**Trilha paralela:** Lógica e Algoritmos  
**Posição:** 1/20  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** início da trilha  
**Próxima recomendada:** LOG-02  
**Ambiente:** pseudocódigo ou Python opcional  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Uma oficina possui 7 peças e recebe um pedido de 4. Precisamos aceitar somente pedidos inteiros positivos que caibam no estoque e informar saldo e decisão. Ao final, você deve decompor essa regra em entradas, etapas e invariantes, sem depender de uma linguagem.

## Mecanismo e exemplo resolvido

As entradas são estoque e pedido; a saída é `(decisão, saldo)`. Primeiro valide domínio, depois compare disponibilidade, só então subtraia. A ordem impede que um pedido negativo aumente o estoque. Invariante: para entradas válidas, `0 ≤ saldo ≤ estoque`; uma recusa preserva o estoque. A comparação não modifica dados; a atribuição modifica o saldo.

| Estoque | Pedido | Domínio válido? | Cabe? | Decisão | Saldo |
|---|---|---|---|---|---|
| 7 | 4 | sim | sim | aceitar | 3 |
| 7 | 8 | sim | não | recusar | 7 |
| 7 | 0 | não | não avaliar | inválido | 7 |
| 0 | 1 | sim | não | recusar | 0 |

```text
receber estoque, pedido
se estoque não é inteiro ou estoque < 0: devolver erro de estoque
se pedido não é inteiro ou pedido <= 0: devolver inválido, estoque
se pedido > estoque: devolver recusar, estoque
saldo ← estoque - pedido  // única etapa que altera a quantidade
devolver aceitar, saldo
```

**Exercício de mesa para baixar:** [LOG-01-mesa.md](/course-labs/phase16-foundations/LOG-01-mesa.md). Não requer runtime.

## Prática e autoexplicação

Parcial: complete `(7,7) → (____,____)` e identifique a etapa responsável. Independente: resolva `(3,-2)`, `(3,2.5)` e `(3,1)`, registrando cada comparação. Autoexplicação: por que subtrair antes de validar o pedido quebra a regra? Qual entrada prova isso?

## Solução comentada e checkpoints

Pedido 7 é aceito e saldo é 0. Os pedidos -2 e 2,5 são inválidos; saldo permanece 3. Pedido 1 produz saldo 2. O contraexemplo -2 produziria 5 se subtraído prematuramente. Checkpoint: cada execução retorna uma decisão e termina; “inválido” e “sem estoque” são motivos diferentes.

## Robustez, reteste e diagnóstico

Se o saldo for negativo, revise a comparação de disponibilidade; se aumentar, revise o domínio do pedido. Reteste 0, 1, estoque e estoque+1 após corrigir. A lógica não trata concorrência: duas reservas simultâneas exigiriam uma transação em um sistema real. Aqui o contrato é uma única execução com estoque inicial fixo.

## Quiz

1. **Qual entrada viola o domínio do pedido?**
   - A) (7,8)
   - B) (7,0)
   - C) (0,1)

2. **Pedido igual ao estoque deve produzir:**
   - A) recusa e saldo zero
   - B) aceite e saldo original
   - C) aceite e saldo zero

3. **Qual invariante vale para uma recusa por falta de peças?**
   - A) saldo = estoque
   - B) saldo = estoque − pedido
   - C) saldo = 0

**Gabarito comentado:** 1: B — zero não representa pedido positivo. 2: C — a condição de recusa é estritamente maior. 3: A — nenhuma reserva foi aplicada.

## Flashcards

- **Decomposição** → Separar validação, decisão e atualização para testar cada regra.
- **Invariante do saldo** → Permanece entre zero e estoque inicial nas entradas válidas.
- **Contraexemplo** → Pedido -2 revela aumento indevido se a validação for omitida.
