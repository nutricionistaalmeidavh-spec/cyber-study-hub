# Gabarito independente — módulo 01

**Abra somente após concluir e salvar a primeira tentativa.** Este documento é separado da prova e não valida aprendizagem automaticamente.

1. **Pergunta:** Uma ordem OS-100 começa pendente. Um usuário a avança duas vezes e tenta uma terceira vez. Registre os três resultados e o contador se havia antes 1 ordem concluída.

   **Resposta esperada:** Primeiro avanço: em andamento, total concluído 1; segundo: concluído, total 2; terceiro: sem alteração e total 2. Contador deriva estado, não eventos.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

2. **Pergunta:** Explique, sem mencionar tecnologia, entrada, regra, estado e saída de uma OS de serviço fictício.

   **Resposta esperada:** Entrada: cliente e descrição; regra valida e define pendente; estado: conjunto de ordens; saída: linha e indicadores coerentes. Interface não é fonte autônoma.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

3. **Pergunta:** Uma IA sugere login, cobrança mensal e CRM completo antes da primeira tela. Escreva uma contestação construtiva e um prompt melhor.

   **Resposta esperada:** Contestar escopo/custo, exigir no máximo três funções, dados fictícios, testes e pergunta sobre decisões. Não aceitar requisitos inventados.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

4. **Pergunta:** A ordem não possui cliente. É correto criar e depois corrigir? Indique invariantes e um teste negativo.

   **Resposta esperada:** Não; deve rejeitar antes de inserir e manter estado sem alteração. Teste: entradas sem cliente → erro/nenhum novo registro.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

5. **Pergunta:** Ao editar apenas o texto 'Visita técnica' o indicador de concluídos muda de 1 para 2. O que ocorreu e como investigar?

   **Resposta esperada:** Alteração puramente textual não pode mudar estado; comparar fonte das ordens, reverter diff e repetir testes antes/depois.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

6. **Pergunta:** Quais dados seriam proibidos ao conversar com um assistente público e como prosseguir quando ele não estiver disponível?

   **Resposta esperada:** Não compartilhar segredos, senhas, tokens, clientes/pacientes reais. Usar roteiro, requisitos e protótipo local sem IA.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

## Rubrica de correção

- 2 pontos: resposta específica, demonstrável e completa, contendo previsão e teste adequado.
- 1 ponto: conceito correto, mas faltou condição, evidência ou cenário negativo.
- 0 pontos: resposta incorreta, impossível de verificar ou aceita comportamento perigoso.
- **Aprovação pedagógica sugerida:** pelo menos 10/12 e nenhuma falha eliminatória; é aferição do estudante, distinta da nota editorial A da aula.
- **Erro eliminatório:** aceitar conclusão repetida com incremento duplicado ou enviar dados reais/segredos à IA.
- **Reteste:** reescrever a decisão errada, executar cenário mínimo e registrar o resultado antes/depois.

## Método e limites

Revisão crítica editorial por IA sobre perguntas e respostas, separada do texto expositivo. Não houve teste com estudantes, correção por docente humano nem validação com leitor de tela. Essas evidências continuam pendentes.
