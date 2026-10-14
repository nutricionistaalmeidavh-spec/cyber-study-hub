# AULA-003 — gabarito comentado / uso após a tentativa

Este gabarito pertence à **prova de transferência** da aula 003 e não comprova sozinho domínio do estudante. Compare seu raciocínio com cada critério e registre por que divergiu. O caso usa dados sintéticos em ambiente local.

## Questão 1

**Situação:** Ana possui papel `reader` e o objeto `R10` é dela. Pode editar?

**Resposta fundamentada:** Não: propriedade é necessária, mas não suficiente; reader não possui edit.

**Erro eliminatório:** Autorizar só por owner.

## Questão 2

**Situação:** Bia é `editor` e tenta editar R10 de Ana. O que ocorre?

**Resposta fundamentada:** 403 pela política didática; ação existe no papel, mas objeto pertence a outra identidade.

**Erro eliminatório:** Aceitar papel sem checar objeto.

## Questão 3

**Situação:** Um usuário não apresentou credencial. Que resposta usar no contrato didático?

**Resposta fundamentada:** 401 e nenhum dado do recurso.

**Erro eliminatório:** Responder 200 ou revelar o conteúdo.

## Questão 4

**Situação:** Por que `role=admin` enviado em JSON não pode liberar a função?

**Resposta fundamentada:** É dado controlado pelo cliente, não evidência de privilégio emitido pelo servidor.

**Erro eliminatório:** Confiar em papel controlável via requisição.

## Questão 5

**Situação:** Uma migração adicionou `teamId` como escopo. Quais negativos introduzir?

**Resposta fundamentada:** Usuário na equipe correta e na errada; ação permitida e não permitida; tenant cruzado; recurso inexistente.

**Erro eliminatório:** Testar apenas fluxo permitido.

## Questão 6

**Situação:** Ao publicar regra nova, o portal negou todos os acessos. Isso prova segurança?

**Resposta fundamentada:** Não; precisa manter casos positivos reais e reportar regressão de disponibilidade.

**Erro eliminatório:** Tratar indisponibilidade total como êxito da autorização.

## Rubrica de correção

- **1 ponto por questão:** resposta correta, justificativa causal e referência à decisão/controle. **0,5** quando falta justificativa; **0** quando consequência ou controle estão errados.
- **A da atividade (não equivale a nota editorial da aula):** pelo menos 5/6 pontos, nenhuma resposta com erro eliminatório e capacidade de reproduzir um caso positivo e um negativo com evidência observável.
- **B da atividade:** 4–4,5 pontos sem erro eliminatório; revise as lacunas e tente novamente com novo cenário.
- **Repetição/revisão:** se houver erro eliminatório ou menos de 4 pontos, volte ao mecanismo, corrija o caso e faça uma nova tentativa sem copiar o gabarito.
- O professor deve verificar a plausibilidade da justificação; o arquivo não é um avaliador automático da aprendizagem.
