# LOG-20 — Projeto lógico final

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 20/20  
**Acesso:** livre; LOG-19 e as unidades anteriores são recomendações opcionais.  
**Próxima:** encerramento/projeto. **Ambiente:** Python 3.10+ ou modelo completo de mesa. **Tempo:** 60–90 min.

## Entrega: um processador de reservas de material

Você vai transformar um estoque e uma sequência de pedidos em estoque restante, lista de aceitos, lista de rejeitados, número de pedidos aceitos e total de unidades reservadas. O projeto reúne validação, coleções, condições, estado, busca por chave, acumuladores, erros e testes. Não exige interface web, banco de dados ou exploração de sistemas.

A entrega precisa explicar as decisões e demonstrar os resultados. Executar a solução de referência sem conseguir reconstruir o rastro não substitui a atividade.

## Dados e regras completas

Estoque inicial:

```python
estoque = {"caderno": 3, "caneta": 2}
pedidos = [
    {"id": "p1", "item": "caderno", "qtd": 2},
    {"id": "p2", "item": "caderno", "qtd": 2},
    {"id": "p3", "item": "caneta", "qtd": 1},
    {"id": "p1", "item": "caneta", "qtd": 1},
    {"id": "p4", "item": "borracha", "qtd": 1},
    {"id": "p5", "item": "caneta", "qtd": 0},
]
```

O estoque de entrada é um mapa válido de nomes para inteiros não negativos. Os pedidos são dicionários, processados na ordem recebida. Cada pedido precisa de ID string não vazia, item string e quantidade inteira positiva, excluindo bool. Não normalizamos caixa/espaços dos identificadores nesta versão.

Verifique nesta ordem:

1. Campos inválidos → ENTRADA_INVALIDA.
2. ID de pedido **já aceito** → ID_JA_ACEITO.
3. Item ausente do estoque → ITEM_DESCONHECIDO.
4. Quantidade maior que o estoque restante → ESTOQUE_INSUFICIENTE.
5. Caso contrário, reservar: diminuir estoque, registrar ID aceito e copiar o pedido para a lista de aceitos.

Uma rejeição não altera o estoque nem registra o ID como aceito. Portanto, um ID rejeitado pode reaparecer corrigido; um ID aceito não pode reservar de novo. Essa é a política deste projeto, não uma definição universal de idempotência.

## Decomposição e invariantes

Faça uma cópia do estoque para não alterar o argumento original. Use um conjunto de IDs aceitos, duas listas para os resultados e consultas por chave para disponibilidade. A validação vem antes da mudança de estado.

Após cada pedido, para cada item:

> estoque inicial = estoque restante + soma das quantidades aceitas daquele item.

O estoque restante nunca é negativo. Todo pedido aceito aparece uma vez na lista e tem ID único entre aceitos. O contador de aceitos é o tamanho da lista de aceitos; o acumulador de unidades é a soma de suas quantidades. O conjunto de IDs não inclui rejeitados.

Essas propriedades permitem detectar erros mesmo quando um total final coincide por acaso.

## Exemplo resolvido e gabarito parcial

| Passo | Pedido | Verificação determinante | Estoque depois | IDs aceitos |
| --- | --- | --- | --- | --- |
| Inicial | nenhum | nenhum | caderno 3, caneta 2 | vazio |
| 1 | p1: caderno 2 | há estoque, ID novo | caderno 1, caneta 2 | p1 |
| 2 | p2: caderno 2 | 2 > 1 restante | caderno 1, caneta 2 | p1 |

No passo 1, o invariante para caderno é `3 = 1 + 2`. No passo 2 continua igual: rejeitar não consome material. O erro seria consultar sempre o estoque inicial 3; isso aprovaria o segundo pedido e excederia a disponibilidade.

**Autoexplicação:** qual estado precisa ser consultado no passo 2? Por que registrar p2 como aceito antes de verificar estoque tornaria o relatório inconsistente? Por que número de pedidos e número de unidades são totais diferentes?

## Exercício parcial

No ramo aprovado, complete as três operações antes de registrar o resultado:

```python
remaining[item] -= ...
accepted_ids.add(...)
accepted.append(dict(request))
```

**Gabarito:** `quantity` e `identifier`. A cópia do pedido separa o dicionário do registro aceito do objeto original. Neste domínio os campos são valores simples; não é necessário prometer cópia profunda de estruturas arbitrárias.

Agora preencha os passos 3 a 6 sem executar. Registre motivo, estoque e IDs depois de cada evento. O relatório deve manter a ordem de entrada entre os rejeitados.

## Prática e conferência da referência

Na raiz do projeto, depois de concluir sua previsão:

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-20
```

Gabarito final para conferência: estoque caderno 1/caneta 1; pedidos aceitos p1 e p3; `pedidos_aceitos=2`; `unidades_reservadas=3`. Rejeições na ordem: p2/ESTOQUE_INSUFICIENTE, p1/ID_JA_ACEITO, p4/ITEM_DESCONHECIDO, p5/ENTRADA_INVALIDA.

O código de referência está na função `reserve` de [logic_lab.py](/course-labs/phase16-logic/logic_lab.py). Os testes verificam os resultados, a conservação por item e a preservação dos argumentos. Executar toda a suíte local:

```sh
python3 -m unittest discover -s public/course-labs/phase16-logic -p 'test_*.py' -v
```

Esperado: 15 testes aprovados. Não há dependências externas. Um teste reúne várias fronteiras, portanto o número de testes não é o número total de casos.

## Exercício independente: reservas em outro conjunto

Implemente sua versão e use estoque `{"lapis":2}` com três pedidos: a/lapis/3, a/lapis/2, b/lapis/1. Gabarito: primeiro rejeitado por estoque; segundo aceito porque a ainda não tinha sido aceito; terceiro rejeitado por estoque. Final lapis 0, um pedido aceito, duas unidades reservadas.

Acrescente testes de estoque/pedidos vazios, quantidade booleana e item desconhecido. Preserve os argumentos originais. Entregue: especificação resumida; código ou pseudocódigo sem lacunas; duas tabelas preenchidas; saídas e motivos; invariantes conferidos; uma limitação reconhecida.

**Limite explícito:** o processador roda sequencialmente em memória. Não implementa transações entre clientes concorrentes, persistência, cancelamentos ou expiração. Se esses requisitos aparecerem, o modelo de estado e a forma de atualizar estoque precisam ser ampliados.

## Erros que os casos revelam

- Contar quantidade como número de pedidos faz p1 valer dois pedidos, confundindo os totais.
- Verificar duplicata depois de diminuir estoque permite que a repetição consuma material antes da rejeição.
- Copiar apenas o nome `remaining = stock` altera o estoque do chamador; use um novo mapa.
- Aceitar `qtd=True` passa por comparações numéricas, mas viola o contrato de tipo.
- Remover os pedidos rejeitados do relatório oculta o que não foi reservado.

## Quiz

1. Depois de p1/caderno/2, p2/caderno/2 deve: A. Ser aceito usando estoque inicial; B. Ser rejeitado usando estoque restante 1; C. Reservar parcialmente 1 sem informar. **Resposta: B.** A regra não permite reserva parcial.
2. Resultado final de contagem/unidades? A. 3 e 2; B. 6 e 5; C. 2 e 3. **Resposta: C.** p1 e p3 são dois pedidos somando três unidades.
3. Um ID rejeitado pode reaparecer corrigido? A. Sim, pois só IDs aceitos são bloqueados; B. Nunca; C. Apenas se mudar o estoque original. **Resposta: A.** É a política explicitada.

## Flashcards

- **Frente:** Invariante do estoque? **Verso:** Inicial = restante + unidades aceitas, para cada item.
- **Frente:** O que uma rejeição pode alterar? **Verso:** A lista de rejeitados; não estoque nem conjunto de aceitos.
- **Frente:** Limite do projeto? **Verso:** Execução sequencial em memória; concorrência e persistência não foram implementadas.
