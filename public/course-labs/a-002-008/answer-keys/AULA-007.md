# AULA-007 — gabarito comentado / uso após a tentativa

Este gabarito pertence à **prova de transferência** da aula 007 e não comprova sozinho domínio do estudante. Compare seu raciocínio com cada critério e registre por que divergiu. O caso usa dados sintéticos em ambiente local.

## Questão 1

**Situação:** Por que rejeitar todo apóstrofo não é correção suficiente?

**Resposta fundamentada:** Quebra nomes válidos e não oferece separação robusta de código e dados.

**Erro eliminatório:** Propor blacklist como defesa principal.

## Questão 2

**Situação:** Um placeholder `?` representa valor de tabela ou nome de coluna?

**Resposta fundamentada:** Normalmente valores; identificadores dinâmicos exigem mapeamento/allowlist.

**Erro eliminatório:** Parametrizar qualquer string SQL arbitrariamente.

## Questão 3

**Situação:** No lab, uma entrada de demonstração retorna dois registros na versão insegura e nenhum na segura. Por quê?

**Resposta fundamentada:** A primeira incorporou sintaxe ao comando; na segunda o texto foi tratado literalmente.

**Erro eliminatório:** Dizer que o segundo caso foi bloqueado por filtro do caractere apóstrofo.

## Questão 4

**Situação:** Consulta preparada devolve R11 para Ana: isso prova que não existe SQLi?

**Resposta fundamentada:** Pode não haver SQLi, mas há falha de autorização; adicionar owner confiável e retestar.

**Erro eliminatório:** Confundir injeção com controle de acesso.

## Questão 5

**Situação:** Por que SQL bruto não deve aparecer em erro para usuário final?

**Resposta fundamentada:** Pode revelar schema/detalhes internos; responder erro controlado e registrar evento sanitizado.

**Erro eliminatório:** Expor trace e dados internos na resposta.

## Questão 6

**Situação:** Como provar correção sem prejudicar funcionalidade?

**Resposta fundamentada:** Testes com R10 válido, nome com apóstrofo, entrada negativa, owner incorreto e operações permitidas.

**Erro eliminatório:** Apenas confirmar que o payload malicioso não retorna dados.

## Rubrica de correção

- **1 ponto por questão:** resposta correta, justificativa causal e referência à decisão/controle. **0,5** quando falta justificativa; **0** quando consequência ou controle estão errados.
- **A da atividade (não equivale a nota editorial da aula):** pelo menos 5/6 pontos, nenhuma resposta com erro eliminatório e capacidade de reproduzir um caso positivo e um negativo com evidência observável.
- **B da atividade:** 4–4,5 pontos sem erro eliminatório; revise as lacunas e tente novamente com novo cenário.
- **Repetição/revisão:** se houver erro eliminatório ou menos de 4 pontos, volte ao mecanismo, corrija o caso e faça uma nova tentativa sem copiar o gabarito.
- O professor deve verificar a plausibilidade da justificação; o arquivo não é um avaliador automático da aprendizagem.
