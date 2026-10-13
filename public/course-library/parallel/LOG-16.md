# LOG-16 — Tratamento de erros

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 16/20  
**Acesso:** livre; LOG-15 é recomendação opcional. **Próxima:** LOG-17.  
**Ambiente:** Python 3.10+ ou rastro de chamada. **Tempo:** 40–50 min.

## Continuar um lote sem esconder linhas inválidas

Um lote de quantidades chega como strings `["2","x","0","3"]`. A regra aceita textos decimais ASCII de 1 a 99. Queremos somar linhas válidas e devolver erros com o número da linha. O resultado correto é total 5 e erros nas linhas 2 e 3. Devolver apenas 5 esconderia que parte da entrada foi descartada.

O objetivo é distinguir a função que detecta uma falha da camada que decide se pode recuperar, mantendo um resultado observável e sem capturar erros de programação indiscriminadamente.

## Propagação e recuperação têm responsabilidades diferentes

`parse_positive(text)` reconhece formato, converte e valida intervalo. Ela lança `ValueError` para texto com valor/formato inválido e `TypeError` se receber algo que nem é string. `process_batch` foi contratado para receber strings; ele recupera `ValueError` por linha, mas deixa `TypeError` propagar para que uma quebra do contrato pelo chamador apareça.

```python
def process_batch(lines):
    total = 0
    errors = []
    for line_number, text in enumerate(lines, 1):
        try:
            value = parse_positive(text)
        except ValueError as error:
            errors.append({"linha": line_number, "motivo": str(error)})
        else:
            total += value
    return {"total": total, "erros": errors}
```

O bloco `else` executa quando o `try` termina sem exceção. Assim, uma linha inválida não soma valor residual de outra iteração. Erros e resultados ficam juntos no retorno. Veja [Python: tratamento de exceções](https://docs.python.org/3/tutorial/errors.html#handling-exceptions).

## Exemplo resolvido: quem recebe a exceção?

| Linha | Texto | parse_positive | Decisão do lote | Total após |
| --- | --- | --- | --- | --- |
| 1 | "2" | retorna 2 | soma | 2 |
| 2 | "x" | ValueError FORMATO_INVALIDO | registra erro e continua | 2 |
| 3 | "0" | ValueError INTERVALO_INVALIDO | registra erro e continua | 2 |
| 4 | "3" | retorna 3 | soma | 5 |

Ao lançar erro, o parser não devolve um número. O controle volta ao manipulador `except` compatível do chamador. Se não houver manipulador compatível, a exceção continua subindo. Esse caminho de falha faz parte do comportamento da função.

Para lote `[2]`, o elemento é inteiro, não string: `TypeError` não é capturado por `except ValueError`. Isso é proposital. Para lote vazio, retorno `{"total":0,"erros":[]}`; vazio não é falha neste contrato.

**Autoexplicação:** por que `except Exception: pass` esconderia a diferença entre dado inválido e bug do chamador? Por que colocar `total += value` depois do `try/except`, sem `else`, seria arriscado?

## Prática

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-16
```

Na raiz do projeto, espere total 5 e `erros` contendo linha 2/FORMATO_INVALIDO e linha 3/INTERVALO_INVALIDO. A numeração é humana, começando em 1. O teste adicional de `[2]` exige a propagação de `TypeError`, em vez de um total inventado.

Neste exercício, recuperar significa ignorar apenas a linha inválida e informar o erro. Outra regra poderia rejeitar o lote inteiro; não misture as duas políticas sem mudar a especificação. A função não escreve arquivos nem realiza transações parciais externas.

## Exercício parcial

Complete a captura mais restrita para a política descrita:

```python
try:
    valor = parse_positive(texto)
except ... as erro:
    erros.append(str(erro))
```

**Gabarito:** `ValueError`. Capturar `TypeError` também alteraria a política de quebra de contrato. Capturar nada abortaria no primeiro texto inválido.

**Exercício independente:** crie um modo “tudo ou nada” para o mesmo lote. Ele deve devolver total apenas quando todas as linhas forem válidas; caso contrário, retornar os erros e `total: None`. Gabaritos: `["2","3"] → total 5, erros []`; `["2","x"] → total None, erro na linha 2`; `[] → total 0`. Evite usar zero como sinal de falha, pois ele é resultado legítimo do vazio.

## Erros comuns

- Um erro registrado só em `print` pode desaparecer do contrato do retorno e ser perdido por outro chamador.
- Repetir indefinidamente uma conversão do mesmo texto inválido não é recuperação: a causa não mudou.
- `finally` serve para ações que precisam ocorrer ao sair do bloco, como liberar recursos; não deve retornar sucesso por cima de uma exceção sem intenção explícita.

## Quiz

1. Total do lote principal? A. 2; B. 0; C. 5. **Resposta: C.** Duas linhas válidas são somadas e duas são reportadas.
2. Qual erro o lote recupera por linha? A. ValueError; B. Qualquer exceção; C. Somente TypeError. **Resposta: A.** É a política de dados inválidos definida.
3. A numeração do erro de "x" é: A. 1; B. 2; C. 0. **Resposta: B.** enumerate começa em 1.

## Flashcards

- **Frente:** Propagar erro? **Verso:** Deixar a falha seguir para uma camada capaz de decidir o que fazer.
- **Frente:** Recuperar sem ocultar? **Verso:** Produzir resultado parcial e informar quais itens falharam, conforme o contrato.
- **Frente:** Por que `else` após try? **Verso:** Separa a ação de sucesso das iterações em que houve exceção.
