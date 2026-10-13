# LOG-15 — Validação de entrada

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 15/20  
**Acesso:** livre; LOG-14 é recomendação opcional. **Próxima:** LOG-16.  
**Ambiente:** Python 3.10+ ou matriz de fronteiras. **Tempo:** 35–50 min.

## Parecer numérico não basta

Um cadastro recebe código `"SKU-007"` e quantidade inteira 1 a 10. `"SKU-007", 1` é válido; `"SKU-007", "1"` não atende ao contrato de tipo escolhido, embora a string pareça um número. `"sku-007"` tem a estrutura parecida, mas viola o formato sensível a maiúsculas deste exercício.

Você aprenderá a separar tipo, formato e intervalo, definir uma política de normalização e usar casos de fronteira que distinguem regras parecidas.

## Contrato antes da implementação

| Campo | Tipo | Formato / intervalo | Política |
| --- | --- | --- | --- |
| código | string | `SKU-` seguido por três dígitos ASCII | sem espaços ou conversão de caixa |
| quantidade | inteiro exato | 1 até 10, inclusivos | não converter strings, não aceitar bool |

O código `SKU-007` mantém zeros à esquerda porque é um identificador textual. Convertê-lo em número destruiria sua representação. O contrato não verifica se esse SKU existe num catálogo: formato válido e existência são verificações diferentes.

```python
def validate_item(code, quantity):
    if type(code) is not str or type(quantity) is not int:
        raise TypeError("TIPO_INVALIDO")
    if re.fullmatch(r"SKU-[0-9]{3}", code) is None:
        raise ValueError("FORMATO_INVALIDO")
    if not 1 <= quantity <= 10:
        raise ValueError("INTERVALO_INVALIDO")
    return {"codigo": code, "quantidade": quantity}
```

O módulo importa `re`. A opção `type(quantity) is int` é intencional: Python considera `bool` uma subclasse de `int`, mas o domínio não aceita `True` como quantidade 1. `re.fullmatch` exige correspondência do texto inteiro; reconhecer só um prefixo deixaria sobras não validadas. Veja [Python: fullmatch](https://docs.python.org/3/library/re.html#re.fullmatch).

## Exemplo resolvido: matriz de decisão

| Entrada | Primeira regra que decide | Resultado |
| --- | --- | --- |
| SKU-007, 1 | todas passam | aceito |
| SKU-007, 10 | limite superior incluído | aceito |
| SKU-007, 0 | intervalo | INTERVALO_INVALIDO |
| SKU-007, 11 | intervalo | INTERVALO_INVALIDO |
| sku-007, 1 | formato | FORMATO_INVALIDO |
| SKU-007, True | tipo | TIPO_INVALIDO |
| SKU-007, "2" | tipo | TIPO_INVALIDO |

A ordem é observável quando mais de uma regra falha. Para `"sku-007", True`, o retorno é erro de tipo primeiro. A aplicação pode escolher coletar todos os erros, mas isso seria outro contrato.

**Autoexplicação:** por que aceitar `True` acidentalmente pode ocorrer mesmo quando alguém escreve `isinstance(qtd,int)`? Por que um SKU bem formatado ainda pode não existir?

## Prática

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-15
```

Na raiz do projeto, a demonstração mostra os casos 1, 10, código em minúsculas, zero e booleano. Compare o campo `resultado`: dois objetos válidos, depois os motivos FORMATO_INVALIDO, INTERVALO_INVALIDO e TIPO_INVALIDO. Os testes também incluem 11, string numérica, 2.0 e quebra de linha no final do código.

Normalização deve ser decisão de produto, não improviso para fazer o teste passar. Se futuramente espaços externos forem aceitos, aplique a normalização definida antes da validação e documente a forma canônica retornada. Não altere silenciosamente a regra durante o diagnóstico.

## Exercício parcial

Complete a condição de intervalo inclusivo:

```python
if not (... <= quantity <= ...):
    raise ValueError("INTERVALO_INVALIDO")
```

**Gabarito:** 1 e 10. Os quatro casos mínimos são 0 rejeitado, 1 aceito, 10 aceito, 11 rejeitado.

**Exercício independente:** valide código `T-` seguido por dois dígitos ASCII e quantidade inteira 0..5. Aqui zero é permitido por especificação. Gabaritos: `T-00,0` aceito; `T-99,5` aceito; `T-1,1` formato inválido; `T-00,6` intervalo inválido; `T-00,False` tipo inválido. Explique por que reutilizar cegamente o limite mínimo 1 mudaria o novo domínio.

## Erros comuns

- Validar apenas na interface não define o contrato da função que outros chamadores podem usar.
- Fazer `int(2.9)` para “corrigir” uma quantidade perde informação e aceita uma entrada que deveria falhar.
- Usar `\d` sem decidir se o domínio aceita dígitos Unicode pode ampliar o formato além do ASCII pretendido.
- Mensagens genéricas demais dificultam distinguir tipo, formato e intervalo no reteste.

## Quiz

1. Qual entrada viola somente o intervalo? A. SKU-007, 11; B. sku-007, 1; C. SKU-007, "1". **Resposta: A.** Tipo e formato são corretos.
2. Por que rejeitar True explicitamente? A. Não é possível compará-lo com números; B. Ele pode ser tratado como inteiro pela hierarquia de tipos; C. Ele contém caracteres especiais. **Resposta: B.** O domínio quer quantidade inteira, não booleano.
3. Formato de SKU aprovado prova: A. Existência no estoque; B. Quantidade disponível; C. Apenas conformidade textual com a regra. **Resposta: C.** Existência exige outra consulta.

## Flashcards

- **Frente:** Três camadas desta validação? **Verso:** Tipo, formato e intervalo.
- **Frente:** Casos essenciais para 1..10? **Verso:** 0,1,10,11, além dos tipos incorretos.
- **Frente:** Validar é converter silenciosamente? **Verso:** Não; conversão e normalização precisam de política explícita.
