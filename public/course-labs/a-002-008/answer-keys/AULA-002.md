# AULA-002 — gabarito comentado / uso após a tentativa

Este gabarito pertence à **prova de transferência** da aula 002 e não comprova sozinho domínio do estudante. Compare seu raciocínio com cada critério e registre por que divergiu. O caso usa dados sintéticos em ambiente local.

## Questão 1

**Situação:** Uma chamada `POST /itens?id=R10` devolve 201. Identifique método, alvo, query e o que *não* se pode concluir sobre permissão.

**Resposta fundamentada:** Método POST; caminho /itens; query id=R10; 201 indica criação declarada pelo servidor, não é prova de autorização.

**Erro eliminatório:** Afirmar que o método ou status autentica o solicitante.

## Questão 2

**Situação:** Um cliente envia `?id=R10&id=R11`. Qual política de parsing escolheria e qual evidência espera?

**Resposta fundamentada:** Rejeitar parâmetros conflitantes com 400; registrar a ocorrência sem dados sensíveis.

**Erro eliminatório:** Aceitar arbitrariamente uma versão do parâmetro sem contrato.

## Questão 3

**Situação:** Explique por que um GET que realiza uma exclusão é defeito mesmo que duas chamadas excluam o mesmo recurso.

**Resposta fundamentada:** GET é semanticamente seguro; implementar efeito destrutivo nesse método viola intenção segura mesmo se estado final coincidir.

**Erro eliminatório:** Confundir idempotência com segurança do método.

## Questão 4

**Situação:** Compare `Content-Type: application/json` e `Accept: application/json` em uma requisição com corpo JSON.

**Resposta fundamentada:** Content-Type descreve representação enviada; Accept informa representação preferida de resposta.

**Erro eliminatório:** Tratar Accept como autorização ou como tipo do corpo recebido.

## Questão 5

**Situação:** Recebeu 403 em um pedido. O que precisaria testar antes de declarar o controle correto?

**Resposta fundamentada:** Testar acesso ao mesmo objeto como dono autorizado e usuário sem permissão; confirmar 403 apenas para o segundo.

**Erro eliminatório:** Considerar bloqueio global como sucesso sem positivo.

## Questão 6

**Situação:** Quais quatro evidências mínimas guardaria num relatório sem expor tokens?

**Resposta fundamentada:** Método, caminho com valores sintéticos/redigidos, status e identidade/escopo sintéticos associados à decisão do backend.

**Erro eliminatório:** Incluir cookie de sessão ou token real no relatório.

## Rubrica de correção

- **1 ponto por questão:** resposta correta, justificativa causal e referência à decisão/controle. **0,5** quando falta justificativa; **0** quando consequência ou controle estão errados.
- **A da atividade (não equivale a nota editorial da aula):** pelo menos 5/6 pontos, nenhuma resposta com erro eliminatório e capacidade de reproduzir um caso positivo e um negativo com evidência observável.
- **B da atividade:** 4–4,5 pontos sem erro eliminatório; revise as lacunas e tente novamente com novo cenário.
- **Repetição/revisão:** se houver erro eliminatório ou menos de 4 pontos, volte ao mecanismo, corrija o caso e faça uma nova tentativa sem copiar o gabarito.
- O professor deve verificar a plausibilidade da justificação; o arquivo não é um avaliador automático da aprendizagem.
