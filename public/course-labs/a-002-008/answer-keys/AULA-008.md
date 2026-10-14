# AULA-008 — gabarito comentado / uso após a tentativa

Este gabarito pertence à **prova de transferência** da aula 008 e não comprova sozinho domínio do estudante. Compare seu raciocínio com cada critério e registre por que divergiu. O caso usa dados sintéticos em ambiente local.

## Questão 1

**Situação:** Um usuário escreve `<b>olá</b>` num campo de nome. Como exibir com segurança como texto?

**Resposta fundamentada:** Usar textContent: browser mostra a marcação literalmente, sem interpretá-la.

**Erro eliminatório:** Usar innerHTML com entrada arbitrária.

## Questão 2

**Situação:** Quais são source e sink na leitura de `location.search` seguida de `innerHTML`?

**Resposta fundamentada:** Source é o parâmetro da URL; sink é innerHTML.

**Erro eliminatório:** Tratar URL como dado confiável ou ignorar a chamada de DOM.

## Questão 3

**Situação:** A página usa encoding HTML e insere valor dentro de atributo JavaScript inline. Isso basta?

**Resposta fundamentada:** Não; contexto JS requer desenho seguro próprio, preferencialmente evitar JS inline.

**Erro eliminatório:** Considerar encoding HTML suficiente para qualquer contexto.

## Questão 4

**Situação:** CSP bloqueou uma execução durante teste, mas innerHTML continua recebendo HTML não confiável. A causa foi corrigida?

**Resposta fundamentada:** Não; CSP é defesa em profundidade, e o sink perigoso deve ser corrigido.

**Erro eliminatório:** Declarar aplicação segura só porque CSP bloqueou um caso.

## Questão 5

**Situação:** Armazenar texto e depois renderizar torna a vulnerabilidade exclusivamente stored XSS?

**Resposta fundamentada:** É um fluxo típico de XSS armazenado, mas precisa comprovar interpretação/executabilidade; armazenamento sozinho não causa XSS.

**Erro eliminatório:** Confundir persistir string com execução de código.

## Questão 6

**Situação:** Após substituir innerHTML por textContent, que regressões deve verificar?

**Resposta fundamentada:** Texto com acento, apóstrofo, &, < e > visível; nenhum elemento HTML inesperado; exibição normal continua.

**Erro eliminatório:** Só verificar que nada aparece.

## Rubrica de correção

- **1 ponto por questão:** resposta correta, justificativa causal e referência à decisão/controle. **0,5** quando falta justificativa; **0** quando consequência ou controle estão errados.
- **A da atividade (não equivale a nota editorial da aula):** pelo menos 5/6 pontos, nenhuma resposta com erro eliminatório e capacidade de reproduzir um caso positivo e um negativo com evidência observável.
- **B da atividade:** 4–4,5 pontos sem erro eliminatório; revise as lacunas e tente novamente com novo cenário.
- **Repetição/revisão:** se houver erro eliminatório ou menos de 4 pontos, volte ao mecanismo, corrija o caso e faça uma nova tentativa sem copiar o gabarito.
- O professor deve verificar a plausibilidade da justificação; o arquivo não é um avaliador automático da aprendizagem.
