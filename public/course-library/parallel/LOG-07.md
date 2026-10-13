# LOG-07 — Funções

**Trilha paralela:** Lógica e Algoritmos  
**Posição:** 7/20  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** LOG-06  
**Próxima recomendada:** LOG-08  
**Ambiente:** pseudocódigo ou Python opcional  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Dois caixas calculam o mesmo subtotal e divergem porque uma rotina imprime o valor, mas não o devolve. Defina uma função de subtotal que outro cálculo possa usar, com parâmetros e retorno explícitos.

## Mecanismo e exemplo resolvido

O contrato de `subtotal(preço, quantidade)` exige dois inteiros não negativos e retorna seu produto em centavos. Parâmetros são nomes locais que recebem os argumentos da chamada. Retorno entrega um valor ao chamador; impressão produz uma mensagem para uma pessoa e não substitui retorno. A função não lê nem modifica variáveis externas e, para os mesmos argumentos, devolve o mesmo resultado.

| Chamada | preço local | quantidade local | retorno | variável no chamador |
|---|---|---|---|---|
| a ← subtotal(250,3) | 250 | 3 | 750 | a=750 |
| b ← subtotal(250,0) | 250 | 0 | 0 | b=0 |

Ao terminar cada chamada, os nomes locais deixam de participar daquela execução; a e b continuam no chamador.

```text
função subtotal(preço, quantidade):
    exigir preço e quantidade inteiros não negativos
    valor ← preço * quantidade // nome local, não global
    devolver valor
a ← subtotal(250, 3)
b ← subtotal(250, 0)
total ← a + b
```

**Exercício de mesa para baixar:** [LOG-07-mesa.md](/course-labs/phase16-foundations/LOG-07-mesa.md). Não requer runtime.

## Prática e autoexplicação

Parcial: complete `subtotal(125,4) → ____`. Independente: escreva o contrato de `com_frete(valor, frete)` e use o retorno de subtotal como argumento. Autoexplicação: o que impediria total de ser calculado se subtotal somente imprimisse 750?

## Solução comentada e checkpoints

Retorno 500. com_frete exige inteiros não negativos e devolve valor+frete; `com_frete(subtotal(125,4),150)` devolve 650. A função interna termina antes que a externa receba o argumento. Sem retorno numérico, total não tem os operandos exigidos. Checkpoint: quantidade -1 é erro de contrato, não subtotal negativo válido.

## Robustez, reteste e diagnóstico

Valide na fronteira da função para que todos os chamadores recebam a mesma garantia. Não use quantidade global como dependência escondida. Se duas chamadas iguais diferirem, procure estado externo. Reteste (250,3), (250,0), (0,3) e entrada negativa. Em implementação com inteiros limitados, também é necessário tratar overflow.

## Quiz

1. **Qual é argumento em subtotal(250,3)?**
   - A) preço
   - B) valor
   - C) 250

2. **Para somar depois, a função precisa:**
   - A) devolver número
   - B) imprimir número
   - C) alterar variável global

3. **Qual entrada viola o contrato?**
   - A) (0,3)
   - B) (250,-1)
   - C) (250,0)

**Gabarito comentado:** 1: C — argumento é o valor fornecido na chamada. 2: A — retorno compõe cálculos sem efeito externo. 3: B — quantidade deve ser não negativa.

## Flashcards

- **Parâmetro** → Nome local declarado na definição; recebe um argumento.
- **Retorno** → Valor transferido ao chamador, distinto da saída no terminal.
- **Contrato de subtotal** → Inteiros não negativos entram; produto em centavos sai.
