# LOG-03 — Operadores e expressões

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 3/20  
**Acesso:** livre; LOG-02 é recomendação, nunca bloqueio. **Próxima:** LOG-04.  
**Ambiente:** Python 3.10+ ou teste de mesa. **Tempo:** 35–50 min.

## A pergunta que a expressão precisa responder

Uma compra tem quantidade 2, preço unitário 3 e taxa fixa 4. O total correto é `2 * 3 + 4 = 10`; escrever `2 * (3 + 4)` produz 14 porque cobra a taxa por unidade. Antes de discutir operadores, escreva a regra em palavras: multiplicar preço pela quantidade, depois acrescentar uma única taxa. Parênteses tornam o agrupamento explícito, mas só são corretos se representarem essa regra.

Ao terminar, você deve calcular expressões em etapas, distinguir concatenação de soma e justificar uma expressão booleana com todos os casos possíveis.

## Operador, operando e tipo

Em `2 + 3 * 4`, os números são operandos e `+`, `*` são operadores. Em Python, multiplicação precede adição; parênteses alteram o agrupamento. Comparações como `>=` produzem booleanos. `not`, `and` e `or` combinam decisões, nessa ordem de precedência; use parênteses quando a intenção não ficar clara.

O mesmo símbolo pode ter operações diferentes conforme os tipos: `"2" + "3"` concatena texto, enquanto `int("2") + 3` soma números. Python não converte automaticamente `"2" + 3` em soma: isso gera `TypeError`. Conversão explícita também pode falhar: `int("dois")` não produz 2.

`and` e `or` avaliam por curto-circuito e podem devolver operandos, não apenas `True`/`False`. Por isso `"" or "padrão"` devolve a string `"padrão"`. Nos exercícios de tabela abaixo, os operandos são booleanos. Consulte as regras em [Python: expressões](https://docs.python.org/3/reference/expressions.html#operator-precedence).

## Exemplo resolvido: cálculo e autorização de uma ação

| Expressão | Primeira etapa | Resultado e tipo |
| --- | --- | --- |
| `2 + 3 * 4` | `3 * 4 = 12` | `14`, inteiro |
| `(2 + 3) * 4` | `2 + 3 = 5` | `20`, inteiro |
| `"2" + "3"` | concatenação | `"23"`, string |
| `int("2") + 3` | conversão para inteiro | `5`, inteiro |
| `0 != 0 and 10 / 0 > 2` | primeira condição é falsa | `False`, sem fazer divisão |

Para uma ação que exige cadastro **e** saldo suficiente, defina `a = cadastrado` e `b = saldo >= custo`. A expressão é `a and b`, não `a or b`.

| a | b | a and b | a or b | not a |
| --- | --- | --- | --- | --- |
| False | False | False | False | True |
| False | True | False | True | True |
| True | False | False | True | False |
| True | True | True | True | False |

**Autoexplicação:** por que trocar `and` por `or` admite dois casos que a regra não permite? Por que a ordem da condição que evita divisão por zero importa?

## Prática verificável

Na raiz do projeto, execute depois de prever os resultados:

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-03
```

O JSON deve trazer `precedencia: [14, 20]`, `texto_e_numero: ["23", 5]`, `curto_circuito: false` e a tabela acima. JSON escreve `false`, enquanto Python escreve `False`; a representação muda, o valor lógico não.

Faça também o teste de mesa de `2 ** 3 ** 2`: potência associa da direita, portanto `2 ** (3 ** 2) = 512`, diferente de `(2 ** 3) ** 2 = 64`. Não estenda a regra de avaliação esquerda-direita a todos os agrupamentos.

## Complete e depois confira

A divisão deve acontecer apenas se `quantidade` for positiva. Complete:

```python
# Exercício: substitua ... por uma expressão.
valido = ... and total / quantidade <= 10
```

**Gabarito:** `quantidade > 0`. Para `total=20, quantidade=2`, o resultado é verdadeiro; para `quantidade=0`, é falso sem divisão. `quantidade != 0` aceitaria valores negativos e mudaria a regra.

**Exercício independente:** uma promoção exige subtotal de pelo menos 100 e cupom válido, mas cliente VIP recebe a promoção independentemente desses dois requisitos. Escreva a expressão e teste as oito combinações de três booleanos. Gabarito de fronteira: não VIP + subtotal 99 + cupom válido → falso; não VIP + 100 + cupom válido → verdadeiro; VIP + 0 + cupom inválido → verdadeiro. Explique o agrupamento sem executar.

## Erros que explicam resultados diferentes

- `=` atribui; `==` compara. Trocar os dois é erro de significado ou sintaxe, não de prioridade.
- `a and b or c` pode ser legível, mas escreva `(a and b) or c` ao traduzir a promoção para tornar a regra auditável.
- Converter um resultado booleano para texto não o mantém booleano: a string `"False"` não é vazia e é considerada verdadeira em contexto condicional.
- Não use `eval` para resolver entrada textual de exercício: a prática avalia expressões fixas escritas por você.

## Quiz

1. Qual é o resultado de `2 + 3 * 4`? A. 20; B. 14; C. 24. **Resposta: B.** Multiplicação vem primeiro.
2. Qual expressão soma a entrada textual `"2"` com 3? A. `"2" + 3`; B. `str(2) + str(3)`; C. `int("2") + 3`. **Resposta: C.** A conversão antecede a operação numérica.
3. Se `a=False` e `b=True`, qual exige os dois requisitos? A. `a and b`; B. `a or b`; C. `not a`. **Resposta: A.** A expressão será falsa, conforme a exigência conjunta.

## Flashcards

- **Frente:** O que os parênteses definem? **Verso:** O agrupamento da expressão; não garantem que a regra escolhida esteja correta.
- **Frente:** Curto-circuito em `and`? **Verso:** Se o primeiro operando for falso, o segundo não é avaliado.
- **Frente:** Por que `"23"` difere de `5` no exemplo? **Verso:** Concatenação opera sobre strings; soma opera sobre valores numéricos após conversão.
