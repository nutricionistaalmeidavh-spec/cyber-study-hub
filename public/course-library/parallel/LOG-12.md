# LOG-12 — Estado e mudança de estado

**Trilha paralela:** Lógica e Algoritmos · **Posição:** 12/20  
**Acesso:** livre; LOG-11 é recomendação opcional. **Próxima:** LOG-13.  
**Ambiente:** tabela de transições e Python 3.10+. **Tempo:** 35–50 min.

## O mesmo evento muda de significado conforme o estado

Um pedido pode estar em rascunho, confirmado, pago ou cancelado. “Pagar” é permitido depois de confirmar, mas não diretamente do rascunho. O dado importante não é apenas o evento recebido: a decisão depende do par `(estado atual, evento)`.

O objetivo é representar estados possíveis, executar uma sequência e demonstrar que uma transição inválida preserva o estado anterior. Este modelo é deliberadamente pequeno: não inclui estorno, entrega ou concorrência.

## Contrato completo da máquina

| Estado atual | Evento | Próximo estado |
| --- | --- | --- |
| rascunho | confirmar | confirmado |
| rascunho | cancelar | cancelado |
| confirmado | pagar | pago |
| confirmado | cancelar | cancelado |
| qualquer outro par | qualquer evento | erro TRANSICAO_INVALIDA, sem mudança |

`pago` e `cancelado` são estados terminais neste contrato. Isso significa que não têm saídas previstas; não significa que todo sistema comercial real deva funcionar assim.

Uma variável `pago=True` sozinha não descreve bem a relação com confirmação e cancelamento. Vários booleanos independentes podem produzir combinações contraditórias. Um estado enumerado e uma tabela de transições deixam claro quais combinações existem.

## Exemplo resolvido: confirmar, pagar, cancelar

```python
state = "rascunho"
state = transition(state, "confirmar")
state = transition(state, "pagar")
# transition("pago", "cancelar") gera ValueError antes de devolver novo estado.
```

| Passo | Estado antes | Evento | Decisão | Estado depois |
| --- | --- | --- | --- | --- |
| 1 | rascunho | confirmar | permitido | confirmado |
| 2 | confirmado | pagar | permitido | pago |
| 3 | pago | cancelar | rejeitado | pago |

A função `transition` é uma consulta pura à tabela: retorna um novo estado ou lança erro. Na atribuição `state = transition(...)`, o lado direito precisa terminar antes de atualizar `state`. Se a função lança a exceção, essa atribuição não acontece. O chamador pode registrar o erro e continuar mostrando `pago`.

**Autoexplicação:** por que rejeitar o terceiro evento não deve voltar o pedido ao rascunho? O que você precisaria acrescentar à especificação para aceitar estorno após pagamento?

## Prática com gabarito

```sh
python3 public/course-labs/phase16-logic/logic_lab.py LOG-12
```

Na raiz do projeto, a saída deve ser `estados: ["rascunho","confirmado","pago"]`, `rejeicao: "TRANSICAO_INVALIDA"`, `final: "pago"`. Localize a tabela `TRANSITIONS` no laboratório e confira que o par rejeitado não aparece.

Faça depois, em papel, a sequência `cancelar, confirmar` partindo do rascunho. Gabarito: primeiro vai para cancelado; segundo é rejeitado e permanece cancelado. Se uma implementação aceita o segundo evento, ela diverge do contrato, ainda que produza um nome de estado válido.

## Exercício parcial

Falta uma transição autorizada:

```python
("confirmado", "cancelar"): ...
```

**Gabarito:** `"cancelado"`. Adicionar esse par não autoriza `("pago","cancelar")`; cada origem precisa ser decidida separadamente.

**Exercício independente:** modele uma lâmpada com estados apagada/acesa e eventos ligar/desligar. Escolha explicitamente a política para “ligar quando já acesa”: rejeitar ou manter o estado sem erro. Preencha os quatro pares. Gabarito para política idempotente: apagada+ligar→acesa; acesa+desligar→apagada; acesa+ligar→acesa; apagada+desligar→apagada. Uma política de rejeição também pode ser coerente, desde que documentada e testada.

## Erros comuns

- Alterar o estado antes de validar o evento pode deixar mudança parcial mesmo quando há erro.
- Testar apenas se o próximo nome existe não verifica se a transição é permitida a partir da origem.
- Uma tabela correta não resolve duas atualizações simultâneas. Este exercício executa sequencialmente; persistência concorrente exigiria controle adicional.

## Quiz

1. Qual informação decide uma transição? A. Só evento; B. Só próximo estado; C. Estado atual e evento. **Resposta: C.** A origem modifica a validade da operação.
2. Após tentar cancelar um pedido pago neste modelo, o estado é: A. Pago; B. Cancelado; C. Rascunho. **Resposta: A.** A transição inválida não atualiza estado.
3. “Terminal” significa: A. Uma interface de comandos; B. Sem saídas previstas no modelo; C. Estado sempre inválido. **Resposta: B.** É uma propriedade da tabela escolhida.

## Flashcards

- **Frente:** Transição? **Verso:** Regra que relaciona estado atual, evento e próximo estado.
- **Frente:** Invariante ao rejeitar? **Verso:** O estado anterior permanece inalterado.
- **Frente:** Idempotência no exemplo da lâmpada? **Verso:** Repetir a operação permitida mantém o mesmo resultado de estado.
