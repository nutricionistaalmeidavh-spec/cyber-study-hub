# LOG-05 — Laços de repetição

**Trilha paralela:** Lógica e Algoritmos  
**Posição:** 5/20  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** LOG-04  
**Próxima recomendada:** LOG-06  
**Ambiente:** pseudocódigo ou Python opcional  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Precisamos emitir exatamente três etiquetas, numeradas 0, 1 e 2. O mesmo algoritmo deve aceitar zero etiquetas sem imprimir nada. Trace a condição antes de cada iteração e o avanço do contador.

## Mecanismo e exemplo resolvido

Inicialize `i=0`. Antes de cada corpo, teste `i<n`. Ao final incremente i. Invariante: antes do teste, i etiquetas já foram emitidas e `0 ≤ i ≤ n`. A quantidade `n−i` diminui em uma unidade a cada iteração, justificando a terminação para n inteiro não negativo. O índice final n existe como contador, mas não como etiqueta emitida.

| Teste | i antes | i < 3 | Etiqueta | i depois |
|---|---|---|---|---|
| 1 | 0 | verdadeiro | 0 | 1 |
| 2 | 1 | verdadeiro | 1 | 2 |
| 3 | 2 | verdadeiro | 2 | 3 |
| 4 | 3 | falso | nenhuma | 3 |

Para n=0, o primeiro teste `0<0` é falso; o corpo não executa.

```text
exigir n inteiro >= 0
i ← 0
enquanto i < n:
    emitir etiqueta i
    i ← i + 1  // progresso obrigatório
devolver i     // quantidade efetivamente emitida
```

**Exercício de mesa para baixar:** [LOG-05-mesa.md](/course-labs/phase16-foundations/LOG-05-mesa.md). Não requer runtime.

## Prática e autoexplicação

Parcial: preencha a tabela para n=1. Independente: troque < por <= e trace n=0 e n=3. Autoexplicação: por que contar testes da condição não é o mesmo que contar iterações?

## Solução comentada e checkpoints

n=1 emite 0, termina com i=1 e testa a condição duas vezes. Com <=, n=0 emite uma etiqueta e n=3 emite quatro. Checkpoint: n iterações geram n+1 testes neste enquanto, porque há um teste final falso. Sem incremento, n=3 repete etiqueta 0 indefinidamente.

## Robustez, reteste e diagnóstico

Não tente corrigir duplicação começando i em 1 sem revisar o contrato de numeração. Corrija o limite e repita n=0,1,3. Limite também n na entrada se cada etiqueta consumir recursos; um algoritmo terminante ainda pode demorar demais. Nenhuma exploração de sistemas é necessária: a evidência é a tabela de estados.

## Quiz

1. **Para n=0, quantos corpos executam?**
   - A) 1
   - B) 0
   - C) 2, contando entrada e saída do laço

2. **Qual valor tem i ao terminar n=3?**
   - A) 3
   - B) 2
   - C) 4

3. **O que prova progresso rumo à parada?**
   - A) emitir etiquetas sem mudar i
   - B) n continuar constante
   - C) n−i diminuir até zero

**Gabarito comentado:** 1: B — a condição inicial já é falsa. 2: A — 3 é contador final, não etiqueta impressa. 3: C — a distância ao limite decresce.

## Flashcards

- **Off-by-one** → Erro de uma unidade no limite, como <= onde o contrato exige <.
- **Invariante do contador** → i corresponde à quantidade já emitida antes do teste.
- **Zero iterações** → Um enquanto testa antes do corpo e pode não executá-lo.
