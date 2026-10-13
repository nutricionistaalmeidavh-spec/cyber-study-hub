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

---

## Segunda oficina — algoritmo que preserva o estado, inclusive com erros

Um algoritmo pode produzir o resultado certo no exemplo fácil e falhar nos limites. Nesta oficina, o contrato é **uma única reserva**, sem concorrência. Estoque inicial deve ser inteiro não negativo. Pedido deve ser inteiro estritamente positivo; uma recusa não pode modificar estoque.

**Para quem nunca programou:** entrada é informação recebida; condição é uma pergunta com duas saídas; estado é informação que pode mudar; saída é o que devolvemos. O algoritmo não precisa de Python para funcionar no papel.

### Trace manual, etapa a etapa

Siga as entradas `(estoque=5, pedido=5)`: valide estoque (sim) → valide pedido (sim) → compare `pedido > estoque` (falso) → subtraia (saldo 0) → devolva `aceitar,0`.

Agora siga `(5,6)`: validações verdadeiras → comparação verdadeira → devolva `recusar,5` **sem** executar subtração. Para `(5,0)`, o pedido é inválido antes de qualquer comparação de disponibilidade. A distinção importa: um pedido inválido não pode consumir estoque nem ser tratado como falta de estoque.

### Exercícios para completar

1. `(0,1)` → decisão `______` e saldo `______`.
2. `(5,5)` → decisão `______` e saldo `______`.
3. `(5,-1)` → decisão `______` e saldo `______`.
4. `(5,2.5)` → decisão `______` e saldo `______`.
5. `(5,1)` → decisão `______` e saldo `______`.

**Gabarito com justificativa:** 1 recusar/0 (sem peças); 2 aceitar/0 (limite permitido); 3 inválido/5 (pedido não positivo); 4 inválido/5 (pedido fracionário); 5 aceitar/4 (subtração válida). Atenção: a validação de `estoque` precede a de `pedido`; uma entrada com estoque negativo é erro de estoque, não recusa por falta.

### Programa verificador opcional

O [verificador LOG-01](/course-labs/pilot-a/stock_rules.py) é uma implementação **de referência** em Python 3, separada do exercício de papel. Você não precisa dominar Python para realizar a aula; ele existe para conferir respostas depois. Execute `python3 stock_rules.py` para testar casos positivos, inválidos e limites. O comando para com falha se a regra produzir saldo incorreto. Ele não simula concorrência nem sistema de vendas real.

### Desafio independente — transferência

Uma biblioteca tem três exemplares livres de um livro. Um empréstimo deve solicitar um número **inteiro positivo**, não superior ao disponível. Adapte seu pseudocódigo para o vocabulário da biblioteca e teste `(3,0)`, `(3,4)`, `(3,3)` e `(3,1)`. Explique por que o estado só muda **depois** de todas as validações. Qual parte você alteraria se várias pessoas reservassem simultaneamente? Não basta o algoritmo de uma execução: seria preciso uma operação transacional/atômica no armazenamento compartilhado.

### Rubrica da competência

- Consegue identificar **entradas, decisões, estado e saídas** sem decorar código.
- Preserva estoque nos casos inválidos/recusados e nunca produz saldo negativo.
- Diferencia pedido igual ao disponível de pedido maior.
- Reconhece que o contrato não contempla concorrência, em vez de prometer segurança multiusuário.
- Propõe um novo exemplo sem copiar os números da oficina.

**Próximo:** LOG-02 para explorar estruturas de decisão e repetição; retorne à validação de entrada quando iniciar PY-01.
