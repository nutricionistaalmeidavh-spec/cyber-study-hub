# LOG-09 — Recursividade

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 9/20  
**Acesso:** livre; LOG-08 é recomendação opcional. **Próxima:** LOG-10.  
**Ambiente:** Python 3.10+ ou pilha de chamadas em papel. **Tempo:** 40–55 min.

## Uma resposta pode depender de uma versão menor do problema

Queremos somar os inteiros de 1 até `n`. Para `n=3`, a soma é `3+2+1=6`. A relação `S(n)=n+S(n-1)` reduz o problema; o caso `S(0)=0` fornece uma resposta sem outra chamada. Recursividade combina essa redução com o retorno das chamadas pendentes.

Ao final, você deve traçar descida e retorno, identificar o caso base e justificar terminação. Saber apenas que “a função chama ela mesma” não explica por que ela termina nem qual resultado retorna.

## Contrato e progresso

A função do laboratório aceita inteiros de 0 a 100, excluindo booleanos. Esse limite mantém o exercício pequeno e não é o limite universal de recursão de Python. Números negativos violariam a redução em direção a zero: subtrair 1 de -1 afasta o valor do caso base.

```python
def recursive_sum(n):
    if type(n) is not int or not 0 <= n <= 100:
        raise ValueError("N_ENTRE_0_E_100")
    if n == 0:
        return 0
    return n + recursive_sum(n - 1)
```

O caso base devolve 0. O passo recursivo não pode terminar sua soma até obter a resposta menor. Cada chamada mantém seu próprio `n` e o ponto ao qual precisa retornar. O valor natural `n` é uma medida de progresso: é não negativo e diminui estritamente a cada chamada até zero.

## Exemplo resolvido: pilha de chamadas para 3

| Momento | Chamada ativa | Operação pendente / retorno |
| --- | --- | --- |
| Descida 1 | S(3) | aguarda `3 + S(2)` |
| Descida 2 | S(2) | aguarda `2 + S(1)` |
| Descida 3 | S(1) | aguarda `1 + S(0)` |
| Base | S(0) | retorna 0 |
| Retorno 1 | S(1) | calcula `1+0`, retorna 1 |
| Retorno 2 | S(2) | calcula `2+1`, retorna 3 |
| Retorno 3 | S(3) | calcula `3+3`, retorna 6 |

Há quatro chamadas, incluindo a base. A função não “substitui n por zero” em todas as chamadas; cada ativação preserva seu argumento. O espaço ocupado pelas chamadas cresce com `n`, assim como a quantidade de passos neste algoritmo. Uma versão iterativa pode manter apenas um acumulador e um contador.

**Autoexplicação:** qual operação fica suspensa em S(3)? Por que contar só três chamadas esquece uma etapa essencial? O que aconteceria se o passo chamasse `S(n)` em vez de `S(n-1)`?

## Prática e casos de fronteira

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-09
```

Na raiz do projeto, a saída deve conter `soma_3: 6` e `soma_0: 0`. Escreva antes o rastro para `n=1`: S(1) chama S(0), recebe 0 e retorna 1. O teste do laboratório verifica também `S(100)=5050` e rejeita -1, 101, `True` e 1.5.

O limite de recursão do interpretador existe para proteger a pilha; elevar esse limite não corrige falta de progresso. Consulte [Python: limite de recursão](https://docs.python.org/3/library/sys.html#sys.getrecursionlimit) para distinguir a configuração do interpretador do domínio pequeno escolhido aqui.

## Exercício parcial

Complete o passo recursivo para contar elementos de uma sequência, supondo entrada finita:

```python
def contar(itens):
    if not itens:
        return 0
    return 1 + contar(...)
```

**Gabarito:** `itens[1:]`. Para `["A","B"]`, são três chamadas e retorno 2. Essa versão cria fatias; não conclua que é a forma mais eficiente só porque o raciocínio é simples.

**Exercício independente:** implemente potência inteira `potencia(base, expoente)` para expoentes de 0 a 10. Regra escolhida: expoente zero retorna 1, inclusive base zero, conforme a convenção deste algoritmo. Gabaritos: `(2,0)→1`, `(2,3)→8`, `(-2,3)→-8`, `(5,1)→5`; expoente negativo deve ser rejeitado. Trace `(2,3)` e apresente uma medida que diminui em cada chamada.

## Erros específicos

- Um caso base escrito depois de uma chamada incondicional pode nunca ser alcançado a tempo.
- Imprimir o resultado de uma chamada não substitui `return`; o chamador precisa do valor.
- `n+1` no passo desta soma cresce em direção oposta à base.
- Recursão pode ser apropriada para estruturas recursivas, mas não é automaticamente mais rápida que laço.

## Quiz

1. Quantas chamadas ocorrem em S(3), incluindo a base? A. 3; B. 4; C. 6. **Resposta: B.** S(3), S(2), S(1), S(0).
2. Qual propriedade explica a terminação? A. `n` diminui em direção a zero dentro do domínio natural; B. A função tem nome curto; C. Existe `return` em qualquer linha. **Resposta: A.** É necessário progresso até a base.
3. Ao receber o retorno de S(1), S(2) calcula: A. `2+0`; B. `1+1`; C. `2+1`. **Resposta: C.** S(1) devolveu 1 e a chamada S(2) preservou seu n.

## Flashcards

- **Frente:** Caso base? **Verso:** Resposta produzida sem nova chamada recursiva.
- **Frente:** Medida de progresso de S(n)? **Verso:** n natural diminui em uma unidade até zero.
- **Frente:** O que a pilha guarda conceitualmente? **Verso:** Estado local e ponto de retorno das chamadas pendentes.
