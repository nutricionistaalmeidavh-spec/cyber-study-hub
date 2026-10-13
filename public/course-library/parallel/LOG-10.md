# LOG-10 — Estruturas de dados básicas

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 10/20  
**Acesso:** livre; LOG-09 é recomendação opcional. **Próxima:** LOG-11.  
**Ambiente:** Python 3.10+ ou cartões em papel. **Tempo:** 40–50 min.

## A ordem de saída faz parte do problema

Três tarefas chegam na ordem A, B, C. Um atendimento deve retirar A primeiro; uma função de desfazer deve retirar C primeiro. Os mesmos elementos exigem regras diferentes. Escolher uma estrutura começa pelas operações e propriedades necessárias, não pelo tipo que você aprendeu mais recentemente.

Nesta aula você distinguirá sequência, pilha, fila e mapa, resolverá uma sequência de operações e estimará custos básicos sem confundir estimativa com garantia de tempo de execução.

## Comparação operacional

| Estrutura | Pergunta principal | Operação típica | Resultado para A, B, C |
| --- | --- | --- | --- |
| Lista | O que há na posição i? | índice, percurso, inserção | conserva sequência |
| Pilha | Qual foi o último a entrar? | empilhar / desempilhar | C, B, A |
| Fila | Qual espera há mais tempo? | entrar no fim / sair do início | A, B, C |
| Mapa | Qual valor corresponde à chave? | consultar / atualizar chave | chave A pode guardar contagem 2 |

Pilha e fila são contratos de operações; podem ter implementações diferentes. No laboratório, uma lista com `append`/`pop` serve como pilha e `collections.deque` com `append`/`popleft` serve como fila. Usar `list.pop(0)` funciona logicamente como retirada do início, mas desloca os demais elementos; isso se torna relevante em filas grandes.

Em implementações usuais como CPython, acesso a uma posição de lista é O(1), busca linear é O(n), inserção no início de lista é O(n), e `append` no final é O(1) amortizado. Dicionários têm acesso médio O(1), não uma promessa universal de pior caso. `deque` é apropriada para inserções e retiradas nas extremidades. Consulte [Python: deque](https://docs.python.org/3/library/collections.html#collections.deque).

## Exemplo resolvido: atendimento, desfazer e contagem

Comece com pilha e fila vazias. Entre A, depois B, depois C. Faça três retiradas em cada uma.

| Retirada | Pilha antes | Sai da pilha | Fila antes | Sai da fila |
| --- | --- | --- | --- | --- |
| 1 | A, B, C | C | A, B, C | A |
| 2 | A, B | B | B, C | B |
| 3 | A | A | C | C |

Agora conte nomes na sequência `["A","B","A"]`:

```python
contagens = {}
for nome in ["A", "B", "A"]:
    contagens[nome] = contagens.get(nome, 0) + 1
```

A primeira ocorrência cria A→1; a segunda cria B→1; a terceira atualiza A→2. Um mapa não cria duas chaves A distintas. A repetição é representada no valor armazenado. Se apenas atribuíssemos `contagens[nome]=1`, perderíamos a frequência.

**Autoexplicação:** por que uma pilha inverte as retiradas sem precisar ordenar os elementos? Qual informação seria perdida ao converter uma sequência em conjunto?

## Prática

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-10
```

Na raiz do projeto, espere `pilha: ["C","B","A"]`, `fila: ["A","B","C"]` e `mapa: {"A":2,"B":1}`. Os exemplos usam somente biblioteca padrão. Antes de uma quarta retirada, pergunte qual é a regra para vazio. Nesta implementação, `pop` e `popleft` em contêiner vazio geram `IndexError`; não existe elemento implícito zero.

## Exercício parcial

Complete um atendimento FIFO:

```python
from collections import deque
fila = deque(["A", "B"])
fila.append("C")
atendido = fila....()
```

**Gabarito:** `popleft`; atendido A, fila restante B,C. `pop` retiraria C e mudaria a política para o outro extremo.

**Exercício independente:** simule desfazer de um editor com ações `digitar A`, `digitar B`, `apagar B`. Empilhe as três descrições e desfaça duas ações. Gabarito da ordem de retirada: `apagar B`, depois `digitar B`; pilha restante `digitar A`. Explique por que a descrição de uma ação ainda precisa de uma operação inversa para desfazer o efeito no texto: retirar um nome da pilha não altera o documento sozinho.

## Escolhas que precisam de justificativa

- Um mapa por ID pode acelerar consulta, mas chaves repetidas sobrescrevem o valor anterior se a política não guardar uma lista ou contagem.
- Um conjunto elimina duplicatas e não serve para preservar multiplicidade de pedidos.
- Uma pilha não é uma lista ordenada por prioridade; seu topo representa ordem de inserção.
- Complexidade descreve como trabalho cresce com o tamanho da entrada; não informa segundos sem ambiente e medição.

## Quiz

1. A estrutura adequada para atender pela chegada é: A. Pilha; B. Mapa sem fila; C. Fila. **Resposta: C.** A política é FIFO.
2. Após A,B,A no mapa de contagem, A vale: A. 2; B. 1; C. Três chaves A. **Resposta: A.** A terceira entrada incrementa a chave existente.
3. Por que evitar `list.pop(0)` em fila grande? A. Retira o último elemento; B. Desloca os demais elementos; C. Ordena automaticamente a lista. **Resposta: B.** O custo cresce com o tamanho.

## Flashcards

- **Frente:** LIFO? **Verso:** Último a entrar, primeiro a sair: pilha.
- **Frente:** FIFO? **Verso:** Primeiro a entrar, primeiro a sair: fila.
- **Frente:** Mapa guarda o quê? **Verso:** Associação entre chaves únicas e valores, que podem ser contagens ou coleções.
