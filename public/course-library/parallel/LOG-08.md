# LOG-08 — Escopo

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 8/20  
**Acesso:** livre; LOG-07 é recomendação opcional. **Próxima:** LOG-09.  
**Ambiente:** Python 3.10+ e teste de mesa. **Tempo:** 40–50 min.

## Dois nomes iguais não são necessariamente a mesma variável

Um módulo mantém `SALDO = 100`. Uma função usa `SALDO = 20` para simular um orçamento e acrescenta 5. Ao retornar, o saldo do módulo ainda vale 100. A grafia igual não implica um único vínculo: a atribuição dentro da função cria um nome local que oculta o nome externo naquele escopo.

Nesta unidade você distinguirá consulta de nome, reatribuição e mutação de objeto. Isso evita usar `global` como tentativa automática de consertar qualquer valor inesperado.

## Onde o nome é procurado

Para os casos comuns de funções desta aula, a busca por nomes não locais percorre escopo envolvente, módulo e nomes embutidos. Uma atribuição a um nome em uma função o torna local, salvo declaração explícita apropriada. Python decide isso considerando o corpo da função, não apenas a ordem em que as linhas são executadas.

Por isso `saldo += 1` dentro de uma função, sem `global saldo` nem um valor local anterior, pode gerar `UnboundLocalError`: a operação precisa ler o nome local antes de escrever. Ler um nome global é diferente de reatribuí-lo. A referência formal é [Python: modelo de execução](https://docs.python.org/3/reference/executionmodel.html#resolution-of-names).

## Exemplo resolvido: shadowing

```python
SALDO = 100

def local_balance():
    SALDO = 20
    SALDO += 5
    return SALDO

resultado = local_balance()
```

| Etapa | SALDO do módulo | SALDO local | resultado |
| --- | --- | --- | --- |
| Antes da chamada | 100 | não existe | não definido |
| Atribuição local | 100 | 20 | não definido |
| Incremento local | 100 | 25 | não definido |
| Depois do retorno | 100 | fora do escopo de acesso do chamador | 25 |

O retorno transporta um valor; ele não atualiza automaticamente uma variável de mesmo nome no chamador. Se a intenção for atualizar o saldo, uma função `novo_saldo(saldo, incremento)` com retorno explícito torna o fluxo mais visível.

## Um caso diferente: duas referências para uma lista

```python
numeros = [1]
alias = numeros
alias.append(2)
```

Agora `numeros` e `alias` referenciam a mesma lista `[1,2]`. A operação mudou o objeto, não reatribuiu o nome `numeros`. Se escrever `alias = [9]` depois, apenas `alias` passa a referenciar outra lista; `numeros` continua `[1,2]`.

**Autoexplicação:** por que o inteiro global ficou inalterado no primeiro exemplo e a lista compartilhada mudou no segundo? A resposta precisa mencionar vínculo de nome e objeto, não apenas “local” e “global”.

## Prática

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-08
```

Execute na raiz do projeto. O resultado é `antes: 100`, `local: 25`, `depois: 100`, `lista_compartilhada: [1,2]`. Rode novamente: cada processo começa do estado inicial, e a chamada local não altera `SALDO`.

Faça a previsão antes de executar uma cópia modificada: substituir `alias = numeros` por `alias = numeros.copy()` faz a lista original permanecer `[1]`. Uma cópia superficial só separa o contêiner; objetos mutáveis dentro dele ainda podem ser compartilhados.

## Exercício parcial

Complete sem variável global:

```python
def acrescentar(saldo, incremento):
    saldo = saldo + incremento
    return ...

saldo = 100
saldo = acrescentar(saldo, 5)
```

**Gabarito:** retornar `saldo`; o chamador recebe 105 porque atribui o retorno. Se apenas chamar `acrescentar(saldo,5)` sem atribuição, seu `saldo` permanece 100.

**Exercício independente:** uma função recebe lista `[2,3]` e deve devolver `[2,3,4]` preservando a original. Escreva duas implementações, uma correta e outra com mutação acidental. Gabarito observável: original `[2,3]` antes/depois e retorno `[2,3,4]`; uma implementação que apenas usa `append` no parâmetro viola a preservação. Explique quais nomes referenciam cada lista.

## Erros comuns

- Adicionar `global` muda o contrato para estado compartilhado; não corrige por si só um fluxo mal entendido.
- Um bloco `if` comum em Python não cria o mesmo tipo de escopo local independente que uma função. Não importe regras de outra linguagem sem conferir.
- Nome local não significa objeto privado: o parâmetro pode referenciar a mesma lista do chamador.
- Retornar uma lista não prova que ela é uma cópia. Observe identidade e mutações relevantes.

## Quiz

1. Qual é o SALDO do módulo após `local_balance()`? A. 100; B. 25; C. 20. **Resposta: A.** As atribuições da função são locais.
2. `alias = numeros` faz o quê? A. Copia todos os elementos profundamente; B. Converte a lista em tupla; C. Cria outro nome para o mesmo objeto. **Resposta: C.** Uma mutação é observada por ambos.
3. Uma função soma em um parâmetro inteiro e retorna o novo valor. Para atualizar o chamador, ele deve: A. Declarar qualquer nome global; B. Atribuir o retorno ao nome desejado; C. Apenas imprimir o parâmetro. **Resposta: B.** O retorno precisa ser usado.

## Flashcards

- **Frente:** Shadowing? **Verso:** Um nome de escopo mais próximo oculta um nome de mesmo texto em escopo externo.
- **Frente:** Reatribuição versus mutação? **Verso:** Reatribuição muda o vínculo do nome; mutação altera o objeto existente.
- **Frente:** Como evitar atualização global implícita? **Verso:** Receber estado por parâmetro e devolver o estado calculado com contrato explícito.
