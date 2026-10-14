# Gabarito independente — AULA-055: OAuth e OIDC Security

**Uso:** corrija somente depois de responder à prova; não inclua o gabarito na tela da aula.

## Respostas comentadas

1. **Qual comparação impede confusão entre provedores?**
   - **Resposta:** Issuer da resposta deve corresponder ao da transação iniciada.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

2. **Qual a função do code_verifier?**
   - **Resposta:** Segredo da transação que comprova posse ao trocar o code; challenge S256 enviado antes.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

3. **O que fazer com state correto reaproveitado?**
   - **Resposta:** Rejeitar replay: transação single-use.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

4. **O access token prova identidade OIDC?**
   - **Resposta:** Não; identidade é declarada por ID Token validado no fluxo OIDC.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

5. **A URI de retorno pode ser substituída pelo navegador?**
   - **Resposta:** Não; comparar com URI registrada segundo regras do fluxo.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

6. **O que registrar sem expor credenciais?**
   - **Resposta:** Identificador opaco, provedor e resultado, evitando code, tokens e verifier.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

## Rubrica de correção

- **10–12 pontos sem erro eliminatório:** domínio editorial A da competência no exercício.
- **7–9 pontos:** rever mecanismo e executar reteste positivo/negativo.
- **0–6 pontos:** refazer exemplo resolvido e checkpoints.
- **Erro eliminatório:** executar em serviço não autorizado, confundir validação local com garantia de produção, aceitar hipótese sem evidência ou afirmar que um controle de uma camada resolve todas as outras.
- O resultado desta rubrica é orientação formativa; não confundir com nota editorial do arquivo nem avaliação observacional de alunos reais.
