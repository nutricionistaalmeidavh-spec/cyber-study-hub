# Gabarito independente — AULA-057: Rate Limit, Race Conditions e Business Logic Flaws

**Uso:** corrija somente depois de responder à prova; não inclua o gabarito na tela da aula.

## Respostas comentadas

1. **Por que rate limit não prova consistência do estoque?**
   - **Resposta:** Limitar frequência não torna a escrita atômica; duas operações válidas concorrem.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

2. **Qual a invariante de negócio central?**
   - **Resposta:** Stock não negativo e no máximo uma reserva confirmada para 1 unidade.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

3. **Qual comportamento esperado na repetição da chave A?**
   - **Resposta:** Responder resultado original sem repetir baixa.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

4. **O pedido B pode ser aceito após A consumir estoque?**
   - **Resposta:** Não, se transação válida consumiu unidade.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

5. **Como garantir no banco real?**
   - **Resposta:** UPDATE condicional/transação serializável ou bloqueio apropriado com idempotência persistida.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

6. **Qual evidência distingue erro de lógica de erro HTTP?**
   - **Resposta:** Estado final de estoque, IDs de reserva e contagem de transações confirmadas.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

## Rubrica de correção

- **10–12 pontos sem erro eliminatório:** domínio editorial A da competência no exercício.
- **7–9 pontos:** rever mecanismo e executar reteste positivo/negativo.
- **0–6 pontos:** refazer exemplo resolvido e checkpoints.
- **Erro eliminatório:** executar em serviço não autorizado, confundir validação local com garantia de produção, aceitar hipótese sem evidência ou afirmar que um controle de uma camada resolve todas as outras.
- O resultado desta rubrica é orientação formativa; não confundir com nota editorial do arquivo nem avaliação observacional de alunos reais.
