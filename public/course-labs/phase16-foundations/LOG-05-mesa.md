# Caderno de trabalho LOG-05

Precisamos emitir exatamente três etiquetas, numeradas 0, 1 e 2. O mesmo algoritmo deve aceitar zero etiquetas sem imprimir nada. Trace a condição antes de cada iteração e o avanço do contador.

| Teste | i antes | i < 3 | Etiqueta | i depois |
|---|---|---|---|---|
| 1 | 0 | verdadeiro | 0 | 1 |
| 2 | 1 | verdadeiro | 1 | 2 |
| 3 | 2 | verdadeiro | 2 | 3 |
| 4 | 3 | falso | nenhuma | 3 |

Para n=0, o primeiro teste `0<0` é falso; o corpo não executa.

exigir n inteiro >= 0
i ← 0
enquanto i < n:
    emitir etiqueta i
    i ← i + 1  // progresso obrigatório
devolver i     // quantidade efetivamente emitida

Parcial: preencha a tabela para n=1. Independente: troque < por <= e trace n=0 e n=3. Autoexplicação: por que contar testes da condição não é o mesmo que contar iterações?

## Solução para conferir depois

n=1 emite 0, termina com i=1 e testa a condição duas vezes. Com <=, n=0 emite uma etiqueta e n=3 emite quatro. Checkpoint: n iterações geram n+1 testes neste enquanto, porque há um teste final falso. Sem incremento, n=3 repete etiqueta 0 indefinidamente.