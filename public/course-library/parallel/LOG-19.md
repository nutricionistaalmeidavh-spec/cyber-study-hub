# LOG-19 — Refatoração básica

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 19/20  
**Acesso:** livre; LOG-18 é recomendação opcional. **Próxima:** LOG-20.  
**Ambiente:** Python 3.10+ e testes de equivalência. **Tempo:** 40–55 min.

## Melhorar a forma preservando a regra

Uma função calcula o total de um pedido com frete. Cliente VIP não paga frete; os demais também ficam isentos a partir de 5000 centavos de subtotal; abaixo disso, pagam 500 centavos. O código usa condições aninhadas. Queremos simplificá-lo preservando resultados e erros.

Refatorar muda a estrutura interna mantendo o comportamento contratado. Alterar o limiar para 6000 ou passar a perdoar entradas inválidas seria mudança funcional, mesmo se o código final ficasse menor.

## Contrato observável

Subtotal é inteiro não negativo, excluindo booleanos. VIP é bool exato. Entrada inválida gera `ValueError("PEDIDO_INVALIDO")`. O retorno é inteiro em centavos. O cálculo não altera objetos externos.

O caso subtotal zero **cobra 500** para não VIP neste contrato. Isso pode parecer uma política comercial estranha, mas uma refatoração não a muda silenciosamente. Se a regra precisa mudar, abra uma mudança separada com novos resultados esperados.

## Exemplo resolvido: reduzir duplicação da decisão

Trecho original, após validação:

```python
if vip:
    fee = 0
else:
    if subtotal >= 5000:
        fee = 0
    else:
        fee = 500
return subtotal + fee
```

Trecho refatorado, com a mesma validação:

```python
fee = 0 if vip or subtotal >= 5000 else 500
return subtotal + fee
```

A isenção tem duas condições suficientes: VIP **ou** subtotal no limiar. A expressão não precisa testar as duas se VIP já é verdadeiro. O retorno continua somando frete ao subtotal.

| Subtotal | VIP | Frete original/refatorado | Total esperado |
| --- | --- | --- | --- |
| 0 | False | 500 | 500 |
| 4999 | False | 500 | 5499 |
| 5000 | False | 0 | 5000 |
| 100 | True | 0 | 100 |

Para comprovar a fronteira, 4999 e 5000 são mais informativos que dois valores muito acima do limiar. Para comprovar os dois ramos, precisamos de VIP e não VIP. Um teste que apenas compara antes/depois pode deixar passar um erro compartilhado; por isso também verificamos totais calculados independentemente na tabela.

**Autoexplicação:** que diferença `>` em vez de `>=` produziria em 5000? Por que trocar `or` por `and` alteraria o caso de VIP com subtotal 100?

## Prática executável

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-19
```

Execute na raiz do projeto. Cada linha mostra `antes` e `depois` iguais aos totais da tabela. Inspecione `old_delivery` e `new_delivery`: a validação é idêntica.

O teste `test_log19` usa os quatro gabaritos explícitos, compara as versões para subtotais de 0 a 5001 com ambos os valores VIP e confirma os erros para subtotal negativo, booleano no subtotal e inteiro no campo VIP. Essa amostra dá evidência, não uma prova de equivalência para toda entrada possível. A justificativa por casos das duas condições complementa os testes.

## Exercício parcial

Complete a decisão de isenção equivalente:

```python
isento = vip ... subtotal >= 5000
```

**Gabarito:** `or`. Há três classes de caso: VIP; não VIP acima/no limiar; não VIP abaixo. As duas primeiras têm frete zero, a terceira frete 500.

**Exercício independente:** extraia a decisão de frete para uma função `frete(subtotal, vip)` e preserve o total na função pública. Gabaritos de `frete`: `(4999,False)→500`, `(5000,False)→0`, `(100,True)→0`. Preserve a mesma validação no ponto definido pelo contrato e execute os testes de retorno e exceções. Não duplique duas versões divergentes da política em funções diferentes.

## Erros comuns

- Reduzir linhas não é um objetivo suficiente se torna a intenção menos clara.
- Mudar o tipo retornado de inteiro para texto “para facilitar a interface” quebra o contrato.
- Remover validação porque os exemplos felizes passam altera o comportamento das falhas.
- Reescrever os resultados esperados para corresponder à nova implementação elimina a independência dos testes.

A ferramenta usada é a biblioteca padrão [Python: unittest](https://docs.python.org/3/library/unittest.html). A política de frete e os gabaritos são próprios deste exercício.

## Quiz

1. Qual mudança é refatoração conforme o contrato? A. Subir limiar; B. Trocar aninhamento por condição equivalente; C. Aceitar strings numéricas. **Resposta: B.** Os comportamentos permanecem iguais.
2. Qual par testa a fronteira do subtotal? A. 9000 e 10000; B. 0 e 1 somente; C. 4999 e 5000. **Resposta: C.** As entradas estão em lados distintos da decisão.
3. Por que testar valores esperados além da equivalência? A. Duas versões podem compartilhar o mesmo erro; B. Comparação nunca funciona; C. Todo teste deve duplicar o código. **Resposta: A.** O gabarito vem da regra.

## Flashcards

- **Frente:** Refatoração preserva o quê? **Verso:** Comportamento contratado, incluindo retorno, erros e efeitos relevantes.
- **Frente:** Teste de equivalência basta sozinho? **Verso:** Não; acrescente gabaritos independentes e raciocínio por casos.
- **Frente:** Mudar a regra do subtotal zero? **Verso:** É mudança funcional e precisa de decisão explícita, não de limpeza silenciosa.
