# LOG-17 — Debugging lógico

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 17/20  
**Acesso:** livre; LOG-16 é recomendação opcional. **Próxima:** LOG-18.  
**Ambiente:** teste de mesa, Python 3.10+ e debugger opcional. **Tempo:** 40–55 min.

## O programa roda e mesmo assim responde algo impossível

Uma função que procura o maior número devolve 0 para `[-4,-2]`. Não há erro de sintaxe nem exceção. O resultado viola a regra: em uma lista não vazia, o máximo deve ser um de seus elementos. Zero nem aparece na entrada.

O objetivo é partir de um contraexemplo pequeno, formular uma hipótese sobre o estado e corrigir a causa. Testar somente números positivos esconderia o defeito.

## Código com defeito e contrato esperado

```python
def maximum_bug(values):
    best = 0
    for value in values:
        if value > best:
            best = value
    return best
```

Contrato que queremos: lista finita de números comparáveis; devolver seu maior elemento, ou `None` para vazio; não alterar a entrada. Valores como NaN e tipos mistos ficam fora deste exercício.

A hipótese inicial é que a comparação está invertida. Uma hipótese alternativa é que a inicialização introduz um candidato que não pertence à entrada. Um teste de mesa separa as duas.

## Exemplo resolvido: localizar a primeira divergência

| Passo | value | best antes | value > best | best depois |
| --- | --- | --- | --- | --- |
| Inicialização | nenhum | não existe | não avaliado | 0 |
| 1 | -4 | 0 | False | 0 |
| 2 | -2 | 0 | False | 0 |

Já no primeiro elemento processado, `best=0` não é o máximo do prefixo `[-4]`. A comparação `>` está coerente com procurar o maior. A causa é usar zero como candidato inicial universal.

A correção explicita ausência de candidato:

```python
def maximum(values):
    best = None
    for value in values:
        if best is None or value > best:
            best = value
    return best
```

Agora, -4 se torna primeiro candidato e -2 o substitui. Para vazio, nenhum candidato é definido e o retorno é `None`. O curto-circuito evita comparar número com `None`.

**Autoexplicação:** por que trocar `>` por `<` produziria outro algoritmo? Qual caso pequeno provaria que reinicializar `best` dentro do laço também está errado?

## Prática: reproduzir antes de corrigir

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-17
```

Na raiz do projeto, espere `bug: 0`, `corrigido: -2`, `vazio: null`. O valor errado é exibido intencionalmente para comparação. Leia as duas funções: a correção muda a representação do estado inicial e a guarda; não transforma a tarefa em ordenar a lista.

Em um debugger, coloque um breakpoint dentro do laço, observe `value` e `best`, dê um passo e compare com a tabela. *Watch* mostra valores; *step* avança a execução; a pilha mostra qual função chamou a atual. Esses recursos testam uma hipótese, não substituem a definição do resultado correto. Consulte [Python: pdb](https://docs.python.org/3/library/pdb.html).

## Exercício parcial

Complete a guarda para aceitar o primeiro candidato:

```python
if ... or value > best:
    best = value
```

**Gabarito:** `best is None`. Usar `not best` trataria zero como ausência; isso pode aceitar um negativo depois de zero e produzir resposta errada para `[0,-1]`.

**Exercício independente:** uma função de mínimo inicia `best=0` e usa `<`. Encontre uma entrada de um único elemento que exponha o erro e corrija preservando `None` para vazio. Gabaritos: `[5]` deve devolver 5, não zero; `[5,2]→2`; `[-4,-2]→-4`; `[]→None`. Explique por que o defeito aparece em sinais opostos nos algoritmos de máximo e mínimo.

## Reteste orientado à causa

| Entrada | Máximo esperado | Propriedade exercitada |
| --- | --- | --- |
| [-4,-2] | -2 | candidatos negativos |
| [] | None | ausência explícita |
| [0] | 0 | zero é candidato válido |
| [7,7] | 7 | duplicatas |
| [1,9,2] | 9 | máximo não é último |

Todos esses casos estão no teste do laboratório. Eles não provam correção para qualquer tipo Python; sustentam o domínio declarado e o invariante de máximo do prefixo.

## Quiz

1. A causa do retorno 0 para negativos é: A. Inicialização inadequada; B. Lista fora de ordem; C. Necessidade de trocar `>` por `<`. **Resposta: A.** Zero foi introduzido sem pertencer à entrada.
2. Qual teste detecta confundir zero com ausência? A. [2,3]; B. [0,-1]; C. [7,7]. **Resposta: B.** Zero precisa continuar sendo o máximo.
3. Breakpoint serve para: A. Corrigir automaticamente; B. Ignorar entrada; C. Pausar em um ponto e observar estado. **Resposta: C.** Ele apoia uma hipótese verificável.

## Flashcards

- **Frente:** Contraexemplo mínimo? **Verso:** Entrada pequena que viola a especificação e permite rastrear a causa.
- **Frente:** Invariante do máximo? **Verso:** Após um prefixo não vazio, best é seu maior elemento.
- **Frente:** Erro lógico precisa de exceção? **Verso:** Não; uma saída válida em tipo pode estar errada em significado.
