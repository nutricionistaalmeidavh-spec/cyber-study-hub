# Gabarito independente — módulo 05

**Abra somente após concluir e salvar a primeira tentativa.** Este documento é separado da prova e não valida aprendizagem automaticamente.

1. **Pergunta:** Após filtrar pendentes, excluir índice 0 remove OS errada. Identifique causa, correção e teste negativo.

   **Resposta esperada:** Índice da lista filtrada não é identidade. Excluir por id estável e verificar que OS não escolhida permanece após filtro.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

2. **Pergunta:** Cliente com ordens tem botão excluir. Qual comportamento correto na regra inicial?

   **Resposta esperada:** Bloquear com erro e não modificar cliente/ordens; teste id C-001 com OS-003 mantém ambos.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

3. **Pergunta:** Avançar a OS concluída repetidamente causa contador 3→4. Como prevenir?

   **Resposta esperada:** Estado final no-op, contador derivado do array, teste repetição sem mudança do objeto e do indicador.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

4. **Pergunta:** A pessoa digita apenas espaços no serviço. O que deve acontecer?

   **Resposta esperada:** trim, rejeitar vazio com mensagem e manter estado e IDs idênticos.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

5. **Pergunta:** Editar OS-002 troca seu id para OS-001. Por que é errado e como provar?

   **Resposta esperada:** IDs estáveis independentes de índice; preservar id e status, alterar apenas serviço, teste comparar IDs antes/depois.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

6. **Pergunta:** Um filtro mostra duas OS e o total do dashboard cai de três para duas. Isso é correto?

   **Resposta esperada:** Não; total geral deriva fonte canônica e filtro só seleciona visualização. Testar query status e conferir contagem geral inalterada.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

## Rubrica de correção

- 2 pontos: resposta específica, demonstrável e completa, contendo previsão e teste adequado.
- 1 ponto: conceito correto, mas faltou condição, evidência ou cenário negativo.
- 0 pontos: resposta incorreta, impossível de verificar ou aceita comportamento perigoso.
- **Aprovação pedagógica sugerida:** pelo menos 10/12 e nenhuma falha eliminatória; é aferição do estudante, distinta da nota editorial A da aula.
- **Erro eliminatório:** permitir exclusão por índice filtrado, cliente órfão ou estado inválido que altera contadores.
- **Reteste:** reescrever a decisão errada, executar cenário mínimo e registrar o resultado antes/depois.

## Método e limites

Revisão crítica editorial por IA sobre perguntas e respostas, separada do texto expositivo. Não houve teste com estudantes, correção por docente humano nem validação com leitor de tela. Essas evidências continuam pendentes.
