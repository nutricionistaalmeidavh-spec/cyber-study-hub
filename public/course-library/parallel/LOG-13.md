# LOG-13 — Buscar e filtrar dados

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 13/20  
**Acesso:** livre; LOG-12 é recomendação opcional. **Próxima:** LOG-14.  
**Ambiente:** Python 3.10+ ou rastreamento manual. **Tempo:** 35–45 min.

## Encontrar uma posição não é selecionar todos os resultados

Em `[4,2,4,7]`, a primeira ocorrência de 4 está no índice 0. Filtrar valores maiores ou iguais a 4 produz `[4,4,7]`. A busca pode parar na primeira resposta; o filtro precisa continuar e preservar duas ocorrências de 4.

Você deve escolher um contrato de retorno antes de implementar: posição ou elemento? Primeira ocorrência ou todas? Qual resultado representa ausência? A palavra “buscar” não responde a essas perguntas.

## Dois contratos explícitos

`first_index(values, target)` devolve o índice da primeira ocorrência ou `None`. Índice zero é uma resposta válida. `at_least(values, minimum)` devolve uma nova lista com todos os valores que satisfazem `>=`, mantendo a ordem e as duplicatas. Sem resultados, devolve `[]`. Nenhuma função altera a lista original.

```python
def first_index(values, target):
    for index, value in enumerate(values):
        if value == target:
            return index
    return None


def at_least(values, minimum):
    return [value for value in values if value >= minimum]
```

São percursos lineares. A busca pode terminar cedo; no pior caso precisa visitar toda a lista. O filtro visita todos os elementos e armazena os aprovados. Não é busca binária: não há requisito de ordenação nem divisão do intervalo.

## Exemplo resolvido

| Índice | Valor | É igual a 4? | É pelo menos 4? | Filtro acumulado |
| --- | --- | --- | --- | --- |
| 0 | 4 | sim; busca retorna 0 | sim | [4] |
| 1 | 2 | busca já terminou | não | [4] |
| 2 | 4 | busca já terminou | sim | [4,4] |
| 3 | 7 | busca já terminou | sim | [4,4,7] |

Para alvo 9, nenhuma igualdade é verdadeira e a busca retorna `None`. Para limite 8, o filtro retorna vazio. Ausência não deve ser representada por zero, pois zero já é um índice possível.

**Autoexplicação:** por que colocar `return None` dentro do laço após a primeira comparação impediria encontrar um alvo mais adiante? Por que converter o filtro em conjunto mudaria sua especificação?

## Prática

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-13
```

Na raiz do projeto, espere `primeiro_4: 0`, `primeiro_9: null`, `filtro_4: [4,4,7]`, `filtro_8: []`. `None` aparece como `null` em JSON.

Teste de mesa adicional: para `[2,4]` e alvo 4, a primeira comparação falha, a segunda retorna índice 1. Esse pequeno caso detecta o `return None` prematuro. Para lista vazia, o corpo não roda e os resultados são `None` na busca e `[]` no filtro.

## Exercício parcial

Complete a verificação de ausência:

```python
indice = first_index([4, 2], 4)
if indice ...:
    print("ausente")
else:
    print(indice)
```

**Gabarito:** `is None`. `if not indice` confundiria índice 0 com ausência. Para o exemplo, a saída deve ser 0.

**Exercício independente:** filtre registros `[{"nome":"A","nota":6},{"nome":"B","nota":8},{"nome":"A","nota":8}]` por nota mínima 7. Gabarito: registros B/8 e A/8, nessa ordem; limite 9 produz vazio. Preserve registros completos e explique se nomes repetidos devem ser eliminados. Neste contrato, não devem: cada registro é uma ocorrência.

## Erros específicos

- Usar `>` em vez de `>=` exclui o valor exatamente na fronteira; o caso 4 é essencial.
- Usar -1 para ausência pode ser perigoso quando o chamador usa esse retorno como índice Python, pois -1 acessa o último elemento. Se escolher esse sentinela, o chamador precisa tratá-lo explicitamente.
- Mutar a entrada para remover reprovados durante o próprio percurso pode pular elementos.

A sintaxe de compreensão e os percursos são detalhados em [Python: estruturas de dados](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions).

## Quiz

1. Primeiro índice de 4 em `[4,2,4]`? A. 0; B. 1; C. 2. **Resposta: A.** O contrato pede a primeira ocorrência.
2. Filtrar `>=4` deve produzir: A. `[4,7]`; B. `[4,4,7]`; C. `[7]`. **Resposta: B.** Preserva duplicatas e inclui a fronteira.
3. Como distinguir ausência de índice zero? A. `if not indice`; B. `if indice == 0`; C. `if indice is None`. **Resposta: C.** O sentinela é específico.

## Flashcards

- **Frente:** Busca primeira versus filtro? **Verso:** Busca pode retornar um índice cedo; filtro reúne todas as ocorrências aprovadas.
- **Frente:** Ausência na busca do lab? **Verso:** None, exibido como null em JSON.
- **Frente:** Invariante do filtro? **Verso:** A saída contém, em ordem, somente os elementos aprovados do prefixo já percorrido.
