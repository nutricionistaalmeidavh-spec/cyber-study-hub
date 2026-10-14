# Gabarito independente — módulo 04

**Abra somente após concluir e salvar a primeira tentativa.** Este documento é separado da prova e não valida aprendizagem automaticamente.

1. **Pergunta:** Numa tela de clientes sem label, qual problema ocorre e como corrigir sem trocar biblioteca?

   **Resposta esperada:** Falta nome acessível; associar label htmlFor/id, conferir teclado e leitores de tela quando disponíveis.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

2. **Pergunta:** Dashboard exibe 12 concluídos e lista só um. Dê uma fonte canônica e um teste para impedir divergência.

   **Resposta esperada:** Derivar indicador do array de ordens, filtrar status concluído, testar fixture de 3 OS/1 concluída e mudança controlada.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

3. **Pergunta:** A 360px há rolagem horizontal causada por cards. Proponha uma alteração CSS verificável.

   **Resposta esperada:** Grid responsive 1 coluna em breakpoint, max-width e overflow, inspecionar 360px com conteúdo longo e zoom.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

4. **Pergunta:** Como diferenciar botão de navegação funcional de div clicável?

   **Resposta esperada:** button com type=button, foco visível, teclado, aria-pressed para seleção; div clicável sozinho falha acessibilidade.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

5. **Pergunta:** Na v0.2 a pessoa preenche um formulário ilustrativo e pensa que salvou. Qual comunicação corrigiria isso?

   **Resposta esperada:** Declarar 'dados demonstrativos, sem cadastro/persistência' e não mostrar sucesso de salvamento falso.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

6. **Pergunta:** A lista de ordens está vazia. O que a página deve apresentar e qual teste realizar?

   **Resposta esperada:** Mensagem explícita 'Nenhuma ordem demonstrativa'; render com fixture vazia, heading presente, sem erro de console.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

## Rubrica de correção

- 2 pontos: resposta específica, demonstrável e completa, contendo previsão e teste adequado.
- 1 ponto: conceito correto, mas faltou condição, evidência ou cenário negativo.
- 0 pontos: resposta incorreta, impossível de verificar ou aceita comportamento perigoso.
- **Aprovação pedagógica sugerida:** pelo menos 10/12 e nenhuma falha eliminatória; é aferição do estudante, distinta da nota editorial A da aula.
- **Erro eliminatório:** afirmar persistência inexistente ou substituir navegação acessível por controle sem teclado.
- **Reteste:** reescrever a decisão errada, executar cenário mínimo e registrar o resultado antes/depois.

## Método e limites

Revisão crítica editorial por IA sobre perguntas e respostas, separada do texto expositivo. Não houve teste com estudantes, correção por docente humano nem validação com leitor de tela. Essas evidências continuam pendentes.
