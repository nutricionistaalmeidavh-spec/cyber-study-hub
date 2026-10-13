# LOG-02 — Variáveis, tipos e memória conceitual

**Trilha paralela:** Lógica e Algoritmos  
**Posição:** 2/20  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** LOG-01  
**Próxima recomendada:** LOG-03  
**Ambiente:** pseudocódigo ou Python opcional  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Um formulário recebe o texto "007". O atendente quer somar uma unidade ao número informado, preservando também o código original. Preveja valor e tipo após cada atribuição; não confunda a grafia exibida com a quantidade.

## Mecanismo e exemplo resolvido

Variável é um nome associado a um valor. Nesta notação, `texto` e `numero` são tipos distintos; converter cria outro valor, sem editar o texto original. `←` atribui e `=` compara. Inteiros são tratados como valores: atribuir `copia ← quantidade` copia o valor conceitual, e reatribuir quantidade não altera copia. Não estamos modelando referências de listas nem endereços físicos.

| Etapa | código: texto | quantidade: inteiro | cópia: inteiro |
|---|---|---|---|
| código ← "007" | "007" | não definido | não definido |
| quantidade ← inteiro(código) | "007" | 7 | não definido |
| cópia ← quantidade | "007" | 7 | 7 |
| quantidade ← quantidade + 1 | "007" | 8 | 7 |
| código ← código + "1" | "0071" | 8 | 7 |

```text
código ← "007"
quantidade ← inteiro(código) // conversão decimal explícita
cópia ← quantidade
quantidade ← quantidade + 1 // soma numérica
código ← código + "1"      // concatenação de textos
```

**Exercício de mesa para baixar:** [LOG-02-mesa.md](/course-labs/phase16-foundations/LOG-02-mesa.md). Não requer runtime.

## Prática e autoexplicação

Parcial: substitua o texto inicial por "010" e complete quantidade final e código final. Independente: simule "dez" e marque a primeira etapa que não pode continuar. Autoexplicação: por que imprimir 7 e imprimir "7" pode parecer igual, mas somar 1 é uma operação diferente?

## Solução comentada e checkpoints

Com "010", quantidade final é 11, cópia é 10 e código final é "0101". Com "dez", a conversão decimal falha; quantidade e cópia não recebem valor. Checkpoint: não invente zero como resultado da conversão inválida. O texto pode ser um identificador; se zeros iniciais importam, mantenha-o como texto.

## Robustez, reteste e diagnóstico

Defina no contrato se sinais, espaços e zeros iniciais são permitidos. Não dependa de coerção implícita. Para uma idade, valide intervalo após converter; para código postal, talvez não converta. Reteste "007", "0" e "dez"; observe tanto tipo quanto valor, porque a saída visual sozinha pode mascarar o erro.

## Quiz

1. **Após incrementar quantidade, cópia vale:**
   - A) 8
   - B) "007"
   - C) 7

2. **Qual resultado corresponde à concatenação "07" + "1"?**
   - A) "071"
   - B) 8
   - C) "08"

3. **Qual informação se perde ao converter "007" para inteiro?**
   - A) a quantidade sete
   - B) os zeros de apresentação
   - C) o valor sete, porque o resultado passa a ser oito

**Gabarito comentado:** 1: C — a reatribuição não altera o inteiro anteriormente copiado. 2: A — texto é concatenado, não somado. 3: B — a representação textual não acompanha o inteiro.

## Flashcards

- **Valor e representação** → 7 é uma quantidade; "007" é texto com três caracteres.
- **Reatribuição** → Muda a associação de um nome; não reescreve outros inteiros.
- **Conversão** → Operação explícita que pode falhar se o texto não representar número.
