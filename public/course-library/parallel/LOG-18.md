# LOG-18 — Ler código de outra pessoa

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 18/20  
**Acesso:** livre; LOG-17 é recomendação opcional. **Próxima:** LOG-19.  
**Ambiente:** leitura de fonte, papel e Python 3.10+. **Tempo:** 40–55 min.

## Antes de executar, descubra o contrato

Você recebe uma função chamada `unique_nonempty` para revisar. O nome sugere remover vazios e duplicatas, mas não informa se ela ordena, modifica a entrada, preserva maiúsculas ou compara antes de remover espaços. Sua tarefa é anotar o código real e construir previsões específicas antes de rodá-lo.

O trecho é autoral deste material e está executável no laboratório; representa a situação de receber código de um colega. Não há dependência de um repositório remoto desconhecido.

## Código para leitura inicial

```python
def unique_nonempty(labels):
    seen = set()
    result = []
    for label in labels:
        key = label.strip().lower()
        if key and key not in seen:
            seen.add(key)
            result.append(key)
    return result
```

Leia primeiro a assinatura e o retorno. `labels` deve ser uma sequência ou iterável de strings, pois cada elemento precisa oferecer `strip` e `lower`. O retorno é uma lista nova. A função não chama `append` nem outra mutação sobre `labels`; isso sustenta a previsão de que a lista original será preservada.

Depois localize estado e decisões. `seen` rastreia chaves já emitidas; `result` preserva a ordem da primeira ocorrência normalizada. A normalização acontece **antes** de testar vazio e duplicata. Portanto, a saída contém strings sem espaços externos e em minúsculas, e não os textos originais.

## Exemplo resolvido: anotações por elemento

Entrada: `[" Ana ", "", "ANA", "Bia", " bia "]`.

| Texto recebido | key | Decisão | result depois |
| --- | --- | --- | --- |
| " Ana " | "ana" | não vazio e novo | ["ana"] |
| "" | "" | vazio, ignorar | ["ana"] |
| "ANA" | "ana" | repetido, ignorar | ["ana"] |
| "Bia" | "bia" | novo | ["ana","bia"] |
| " bia " | "bia" | repetido, ignorar | ["ana","bia"] |

O invariante conecta os dois contêineres: `seen` contém exatamente as chaves já colocadas em `result`; `result` mantém sua ordem de primeira aparição. O conjunto sozinho não expressaria a ordem de saída exigida.

Não deduza que isso resolve identificação de pessoas: nomes iguais podem representar pessoas distintas. Também não deduza equivalência Unicode completa: `lower` não promete todas as regras de comparação linguística. O domínio aqui é normalizar rótulos simples de exercício. Os métodos são descritos em [Python: strings](https://docs.python.org/3/library/stdtypes.html#string-methods).

**Autoexplicação:** qual linha prova que o retorno usa a forma normalizada? Qual alteração faria o código preservar o primeiro texto original em vez de `key`?

## Prática em duas fases

Primeiro, sem executar, escreva previsões para:

- `[]` → `[]`;
- `["  "]` → `[]`;
- `["B","A","B"]` → `["b","a"]`, sem ordenação alfabética;
- entrada principal → `["ana","bia"]`, preservando a lista de entrada.

Depois execute na raiz do projeto:

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-18
```

A saída deve ser `["ana","bia"]`. Os testes também comparam a lista original antes/depois. Se uma previsão divergir, aponte a linha que você interpretou incorretamente em vez de apenas atualizar o gabarito.

## Exercício parcial

Complete a anotação da linha `if key and key not in seen`:

> “Só incluir quando a string normalizada não for ______ e ainda não tiver sido ______.”

**Gabarito:** vazia; emitida. A ordem com curto-circuito evita a segunda verificação quando `key` é vazia, embora aqui não haja erro em verificar a presença da string vazia no conjunto.

**Exercício independente:** adapte uma cópia para preservar o primeiro texto original de cada chave normalizada, mas ainda descartar entradas vazias após `strip`. Gabarito para a entrada principal: `[" Ana ","Bia"]`. Para `["B","b","A"]`, retorno `["B","A"]`. Preserve `seen` com chaves normalizadas e justifique por que apenas trocar o conteúdo de `seen` para texto original quebraria a deduplicação.

## Erros comuns de leitura

- Confiar só no nome da função e perder a normalização.
- Supor que conjunto implica que o retorno não tem ordem: a saída é construída numa lista separada.
- Executar um único exemplo e concluir um contrato universal. Casos vazio, duplicado e ordem inversa revelam decisões diferentes.
- Confundir comportamento inferido com intenção do autor. Se a política esperada não está documentada, registre a dúvida em vez de “corrigir” o código por preferência.

## Quiz

1. A saída mantém: A. Espaços originais; B. Ordem alfabética; C. Primeira ordem das chaves normalizadas. **Resposta: C.** A lista é preenchida durante o percurso.
2. Qual estado evita duplicatas? A. seen; B. Apenas o nome da função; C. O índice. **Resposta: A.** A decisão consulta o conjunto de chaves emitidas.
3. `"  "` vira: A. Dois espaços na saída; B. String vazia descartada; C. Erro obrigatório. **Resposta: B.** strip ocorre antes da condição.

## Flashcards

- **Frente:** Primeiros pontos de leitura? **Verso:** Entrada, retorno, mutações e decisões sobre estado.
- **Frente:** Por que prever antes de executar? **Verso:** A previsão expõe a interpretação que será confrontada com o comportamento.
- **Frente:** Invariante de seen/result? **Verso:** O conjunto contém as chaves emitidas; a lista preserva sua ordem.
