# AULA-004 — gabarito comentado / uso após a tentativa

Este gabarito pertence à **prova de transferência** da aula 004 e não comprova sozinho domínio do estudante. Compare seu raciocínio com cada critério e registre por que divergiu. O caso usa dados sintéticos em ambiente local.

## Questão 1

**Situação:** Alice autentica num registro bcrypt antigo. Qual a ordem correta da migração?

**Resposta fundamentada:** Verificar tentativa contra hash antigo; gerar novo verificador com a senha fornecida; persistir com política de concorrência.

**Erro eliminatório:** Tentar decifrar o hash antigo como senha.

## Questão 2

**Situação:** Dois registros com a mesma senha têm hashes diferentes. O que isso indica?

**Resposta fundamentada:** Compatível com salts distintos; precisa executar compare para provar validação.

**Erro eliminatório:** Declarar que as senhas eram diferentes.

## Questão 3

**Situação:** Por que `"é".repeat(37)` viola limite de 72 bytes?

**Resposta fundamentada:** São 74 bytes UTF-8 (2 por letra).

**Erro eliminatório:** Medir apenas `.length` em JS.

## Questão 4

**Situação:** Se Bob não faz login há um ano, como o plano lida com ele?

**Resposta fundamentada:** Mantém verificador antigo suportado temporariamente ou exige fluxo de recuperação/reativação.

**Erro eliminatório:** Declarar migração feita sem senha.

## Questão 5

**Situação:** Elevar custo dobrou mediana em máquina A, mas não em B. Existe contradição?

**Resposta fundamentada:** Não; medidas são específicas de CPU, implementação e carga.

**Erro eliminatório:** Forçar razão exata em todo ambiente.

## Questão 6

**Situação:** Um banco copiado contém hashes bcrypt: qual proteção o rate limiting de login oferece contra tentativa offline?

**Resposta fundamentada:** Nenhuma diretamente; limites online não governam tentativas offline.

**Erro eliminatório:** Considerar rate limiting suficiente contra vazamento do banco.

## Rubrica de correção

- **1 ponto por questão:** resposta correta, justificativa causal e referência à decisão/controle. **0,5** quando falta justificativa; **0** quando consequência ou controle estão errados.
- **A da atividade (não equivale a nota editorial da aula):** pelo menos 5/6 pontos, nenhuma resposta com erro eliminatório e capacidade de reproduzir um caso positivo e um negativo com evidência observável.
- **B da atividade:** 4–4,5 pontos sem erro eliminatório; revise as lacunas e tente novamente com novo cenário.
- **Repetição/revisão:** se houver erro eliminatório ou menos de 4 pontos, volte ao mecanismo, corrija o caso e faça uma nova tentativa sem copiar o gabarito.
- O professor deve verificar a plausibilidade da justificação; o arquivo não é um avaliador automático da aprendizagem.
