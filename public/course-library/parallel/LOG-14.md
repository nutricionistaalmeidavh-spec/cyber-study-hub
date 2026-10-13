# LOG-14 — Contadores, acumuladores e flags

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 14/20  
**Acesso:** livre; LOG-13 é recomendação opcional. **Próxima:** LOG-15.  
**Ambiente:** Python 3.10+ ou tabela de laço. **Tempo:** 35–45 min.

## Três perguntas, três variáveis de estado

Dada a sequência `[-2,0,5,7]`, queremos saber quantos números são positivos, a soma dos positivos e se apareceu algum negativo. As respostas são 2, 12 e verdadeiro. Um único “total” não representa bem as três perguntas.

Um contador soma unidades de ocorrência. Um acumulador combina valores, como uma soma. Uma flag registra uma condição lógica. O nome da variável deve indicar o significado que será preservado durante o percurso.

## Inicialização e atualização

```python
count = 0
total = 0
has_negative = False
for value in [-2, 0, 5, 7]:
    if value > 0:
        count += 1
        total += value
    if value < 0:
        has_negative = True
```

Antes de ler qualquer elemento, a quantidade e a soma dos positivos são zero; nenhum negativo foi visto, logo a flag é falsa. Para cada positivo, contador aumenta 1 e acumulador aumenta o valor. Para um negativo, a flag se torna verdadeira e permanece assim. Zero não pertence a nenhum dos dois grupos neste contrato.

## Exemplo resolvido: rastro completo

| Valor recém-lido | Contador positivos | Soma positivos | Já viu negativo? |
| --- | --- | --- | --- |
| nenhum | 0 | 0 | False |
| -2 | 0 | 0 | True |
| 0 | 0 | 0 | True |
| 5 | 1 | 5 | True |
| 7 | 2 | 12 | True |

Os invariantes após cada etapa são: contador igual ao número de positivos do prefixo; soma igual à soma deles; flag verdadeira se e somente se existe negativo nesse prefixo. Eles explicam inclusive a entrada vazia: 0, 0, False.

Escrever `has_negative = value < 0` a cada passo mudaria a pergunta para “o último valor é negativo?”. O primeiro -2 seria esquecido quando chegasse o zero. Para a pergunta “algum negativo”, a flag é persistente durante o percurso.

**Autoexplicação:** por que `count += value` viola o significado do contador? Por que a flag não deve voltar a falsa quando aparece um positivo?

## Prática verificável

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-14
```

Na raiz do projeto, o resultado contém `positivos: 2`, `soma_positivos: 12`, `tem_negativo: true` e as quatro linhas de rastro. Compare cada linha com a tabela, não apenas o total final.

Faça previsões para `[0]`, `[-3,-1]` e `[2,2]`. Gabaritos: respectivamente `(0,0,False)`, `(0,0,True)` e `(2,4,False)`. Esses casos separam zero, negativos e duplicatas. Dois valores iguais ainda são duas ocorrências.

## Exercício parcial

Queremos também a média dos positivos, ou ausência quando não há nenhum:

```python
media = total / count if ... else None
```

**Gabarito:** `count > 0`. Para a sequência principal, média 6.0; para `[-2,0]`, `None`. Devolver zero no caso sem elementos confundiria ausência de média com uma média numérica.

**Exercício independente:** conte valores pares, some somente pares e marque se há algum valor maior que 10 em `[0,3,4,12]`. Gabarito: contador 3, soma 16, flag True. Para `[]`, 0,0,False. Justifique por que zero conta como par aqui, embora não conte como positivo no exemplo principal.

## Erros comuns e diagnóstico

- Reinicializar o acumulador dentro do laço perde resultados anteriores.
- Incrementar o contador fora do `if` conta todos os elementos, não só os positivos.
- Encerrar o laço ao encontrar um negativo seria correto se a única pergunta fosse existência; neste programa ainda faltaria contar/somar os demais positivos.
- Uma soma final correta pode ocorrer por coincidência. Os invariantes por prefixo ajudam a localizar a primeira divergência.

## Quiz

1. Para dois positivos 5 e 7, o contador cresce quanto? A. 12; B. 2; C. 7. **Resposta: B.** Ele registra ocorrências.
2. Qual atualização preserva “já apareceu negativo”? A. Reatribuir `value < 0` sempre; B. Zerar no `else`; C. Tornar True ao ver negativo e não desfazer. **Resposta: C.** A condição depende do prefixo todo.
3. Para lista vazia, o resultado é: A. 0,0,False; B. 1,0,True; C. Divisão por zero obrigatória. **Resposta: A.** O corpo não executa e a média é tratada separadamente.

## Flashcards

- **Frente:** Contador versus acumulador? **Verso:** Contador soma ocorrências; acumulador combina valores.
- **Frente:** Flag de existência? **Verso:** Registra se a condição ocorreu em algum elemento já percorrido.
- **Frente:** Quando calcular a média? **Verso:** Depois do percurso, somente se a contagem for positiva.
