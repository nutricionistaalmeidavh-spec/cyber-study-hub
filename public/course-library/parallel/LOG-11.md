# LOG-11 — Entrada → processamento → saída

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 11/20  
**Acesso:** livre; LOG-10 é recomendação opcional. **Próxima:** LOG-12.  
**Ambiente:** Python 3.10+ ou cálculo em papel. **Tempo:** 40–55 min.

## Transformar uma linha em um total não é só multiplicar

Uma linha de pedido chega como `"2;350"`: quantidade 2 e preço unitário de 350 centavos. A saída precisa ser total de 700 centavos e texto `"7,00"`. Antes de multiplicar, o programa precisa reconhecer formato, converter campos e validar intervalos. Depois do cálculo, ele formata a apresentação sem transformar o resultado interno em texto cedo demais.

O objetivo é separar as três etapas com contratos claros e localizar a falha quando o resultado não corresponde à entrada.

## Três representações e uma fronteira

| Etapa | Representação | Contrato |
| --- | --- | --- |
| Entrada | string `"2;350"` | dois campos ASCII separados por um `;`, sem espaços |
| Processamento | inteiros 2 e 350 | quantidade 1..99; preço em centavos 0..100000 |
| Saída de domínio | inteiro 700 | produto exato em centavos |
| Apresentação | string `"7,00"` | parte inteira e dois dígitos de centavos |

Escolhemos centavos inteiros para este exercício: não são aceitos preços como `3.50` nem `3,50` na entrada. Uma interface real pode ter outro contrato; a mudança precisa ser explícita. Também não arredondamos descontos nem moedas distintas aqui.

Uma validação de formato não substitui a de intervalo. `"0;350"` tem dois campos numéricos, mas quantidade zero é inválida. `"2;100001"` passa na largura do campo e falha no máximo permitido. `"2;350;1"` viola o formato por ter um terceiro campo.

## Exemplo resolvido

O laboratório usa `re.fullmatch` para exigir a linha inteira no formato `[0-9]{1,2};[0-9]{1,6}`, converte por `int`, valida intervalos e então calcula:

```python
quantidade, preco = 2, 350
total = quantidade * preco
exibicao = f"{total // 100},{total % 100:02d}"
```

1. `2 * 350` produz 700 centavos.
2. `700 // 100` produz 7 unidades monetárias inteiras.
3. `700 % 100` produz 0 centavos restantes.
4. A formatação `02d` mostra dois dígitos: `00`.
5. O relatório preserva `total_centavos: 700` e também oferece `exibicao: "7,00"`.

Para `"3;105"`, o total é 315 e a exibição `"3,15"`. Para `"1;0"`, preço zero é permitido, total 0 e exibição `"0,00"`. O domínio admite produto gratuito, mas não quantidade zero.

**Autoexplicação:** em qual etapa você rejeitaria `"dois;350"`? Por que `"0;350"` exige outra verificação? Qual valor deve ser usado em um cálculo seguinte: 700 ou `"7,00"`?

## Prática executável

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-11
```

Execute na raiz do projeto. Resultado esperado: quantidade 2, unitário 350, total 700 e exibição `"7,00"`. Leia `parse_order` e `order_pipeline` no laboratório para localizar formato, conversão, intervalo, cálculo e formatação.

A regressão testa também `"99;100000" → 9900000` centavos e rejeita quantidade zero, preço acima do limite, ponto decimal, campo extra e espaços. Exceções são saídas de falha previstas; não devem virar um pedido gratuito por padrão.

## Exercício parcial

Complete a parte de centavos da apresentação:

```python
inteiros = total // 100
centavos = total ... 100
```

**Gabarito:** `%`, resto da divisão. Para total 709, os valores são 7 e 9; formate o segundo como `09`. Usar `/` devolve divisão, não resto.

**Exercício independente:** adicione uma taxa fixa de 25 centavos a cada pedido válido, uma única vez. Gabaritos: `"2;350" → 725 → "7,25"`; `"1;0" → 25 → "0,25"`; entrada inválida continua inválida sem taxa calculada. Defina onde a taxa entra no pipeline e prove que não foi multiplicada pela quantidade.

## Onde procurar um erro

- Total 70000 sugere confusão de unidade, como tratar centavos como unidades e multiplicar novamente por 100.
- Saída `7,0` indica falta de preenchimento de dois dígitos, não erro de multiplicação.
- Aceitar `2;350;1` revela parse que ignora campos extras.
- Converter qualquer exceção em total 0 apaga a distinção entre pedido gratuito válido e entrada inválida.

As operações de divisão inteira, resto e formatação estão documentadas em [Python: tipos embutidos](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex). A política comercial e os dados acima são próprios do exercício.

## Quiz

1. `"0;350"` falha por quê? A. Não contém separador; B. Quantidade fora do intervalo; C. Preço não numérico. **Resposta: B.** Formato e intervalo são verificações distintas.
2. Para total 315, `total % 100` é: A. 3; B. 3.15; C. 15. **Resposta: C.** É o resto que representa os centavos.
3. Qual valor deve permanecer numérico no domínio? A. 700 centavos; B. `"7,00"`; C. `"R$ 7"`. **Resposta: A.** A apresentação textual fica na borda de saída.

## Flashcards

- **Frente:** Pipeline desta aula? **Verso:** Reconhecer formato, converter, validar intervalo, calcular e formatar.
- **Frente:** Por que centavos inteiros? **Verso:** Tornam os valores e os cálculos deste domínio exatos sem ponto decimal na entrada.
- **Frente:** Entrada inválida equivale a total zero? **Verso:** Não; zero pode ser resultado legítimo e deve ser distinguido da falha.
