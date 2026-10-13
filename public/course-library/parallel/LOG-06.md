# LOG-06 — Arrays e coleções

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 6/20  
**Acesso:** livre; LOG-05 é recomendação opcional. **Próxima:** LOG-07.  
**Ambiente:** Python 3.10+ ou tabela em papel. **Tempo:** 35–45 min.

## Uma coleção tem posições e valores

Um inventário simplificado guarda quantidades em `[12, 0, 7]`. A posição 1 contém zero: ela existe e representa um produto sem estoque. Isso difere de pedir a posição 3, que não existe. Confundir valor zero, ausência e posição inválida produz erros mesmo quando nenhum laço parece complicado.

O objetivo é percorrer uma coleção sem pular elementos, prever os índices válidos e escolher como tratar uma coleção vazia. Aqui usamos `list` de Python, uma sequência dinâmica; não afirmamos que ela tenha todas as restrições de um array fixo de outra linguagem.

## Tamanho não é último índice

Para uma lista com `n` elementos, os índices não negativos válidos vão de 0 a `n-1`. Quando `n=0`, não existe índice válido. `range(n)` gera exatamente esses índices; `range(n+1)` tenta uma posição a mais.

Python também aceita índices negativos, como `lista[-1]` para o último elemento. Nossa função didática `element_at` escolhe um contrato mais restrito: rejeitar índices negativos, booleanos e valores fora do intervalo. Portanto, uma exceção em `element_at(lista, -1)` não significa que Python desconhece índices negativos.

`enumerate` entrega pares índice/elemento sem precisar manter um contador manual. O percurso abaixo não modifica o tamanho da lista. Alterar a coleção enquanto a percorre exige outra análise. Veja [Python: estruturas de dados](https://docs.python.org/3/tutorial/datastructures.html).

## Exemplo resolvido: somar o inventário

```python
quantidades = [12, 0, 7]
soma = 0
for indice, quantidade in enumerate(quantidades):
    soma += quantidade
```

| Momento | Índice | Valor lido | Soma após a etapa |
| --- | --- | --- | --- |
| Inicial | nenhum | nenhum | 0 |
| Primeiro elemento | 0 | 12 | 12 |
| Segundo elemento | 1 | 0 | 12 |
| Terceiro elemento | 2 | 7 | 19 |
| Fim | nenhum | nenhum | 19 |

O invariante é: após processar `k` elementos, `soma` contém a soma dos primeiros `k` valores. Ele vale no início para zero elementos, é preservado pela adição e explica o resultado final.

Para `[]`, o corpo não roda e a soma permanece 0. Não tente ler o primeiro elemento para descobrir que a lista está vazia: confira o tamanho ou use uma iteração que naturalmente aceite o vazio.

**Autoexplicação:** qual linha da tabela prova que zero é um elemento válido? Por que `len(quantidades)` é 3 enquanto o último índice não negativo é 2?

## Prática com resultado definido

Na raiz do projeto:

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-06
```

Espere `percurso: [[0,12],[1,0],[2,7]]`, `soma: 19`, `ultimo: 7` e `vazia: []`. Os pares Python viram arrays JSON na exibição.

Inspecione `element_at` em `logic_lab.py`. Sua condição de validade é `type(index) is int and 0 <= index < len(values)`; ela foi escrita em forma de rejeição. Testes automatizados incluem índice 3 em lista de tamanho 3, índice -1, `True` e lista vazia. Todos devem receber `IndexError("INDICE_INVALIDO")`, sem inventar um valor substituto.

## Exercício parcial

Complete para ler apenas índices não negativos válidos:

```python
if 0 <= indice < ...:
    valor = lista[indice]
```

**Gabarito:** `len(lista)`. Escrever `<= len(lista)` no segundo comparador aceita uma posição inexistente. Para `lista=[8]`, índice 0 é válido e índice 1 é inválido.

**Exercício independente:** produza uma nova lista contendo o dobro de `[3, 0, -2]`, preservando a original. Gabarito: original `[3,0,-2]`, nova `[6,0,-4]`; para entrada vazia, saída vazia. Trace os três pares de `enumerate` e explique por que `nova = original` não cria uma cópia independente.

## Erros de raciocínio e correção

- Iniciar o índice em 1 perde o primeiro elemento quando a estrutura começa em 0.
- Usar o tamanho como índice final inclusivo cria um erro de uma posição, o chamado *off-by-one*.
- Testar `if lista[i]` para decidir se a posição existe confunde existência com o valor zero. A própria leitura pode falhar antes do `if`.
- Tratar `IndexError` como quantidade zero esconde a violação do contrato e pode alterar a soma silenciosamente.

## Quiz

1. Em `[12,0,7]`, qual é o último índice não negativo? A. 3; B. 1; C. 2. **Resposta: C.** O tamanho é 3 e a numeração começa em zero.
2. O percurso de `[]` deve executar o corpo quantas vezes? A. Zero; B. Uma; C. Depende do valor do primeiro elemento. **Resposta: A.** Não existe primeiro elemento.
3. O que `lista[1] == 0` prova no exemplo? A. Índice inválido; B. Um elemento existente tem valor zero; C. Lista vazia. **Resposta: B.** Posição e conteúdo são conceitos distintos.

## Flashcards

- **Frente:** Índices não negativos válidos de tamanho `n`? **Verso:** `0 <= i < n`; nenhum quando `n=0`.
- **Frente:** O que `enumerate` entrega? **Verso:** Posição e elemento de cada passo do percurso.
- **Frente:** Invariante da soma? **Verso:** Soma dos elementos já percorridos, inicialmente zero.
