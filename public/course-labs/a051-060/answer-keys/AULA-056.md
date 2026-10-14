# Gabarito independente — AULA-056: API Security avançada — BOLA, BFLA, Mass Assignment

**Uso:** corrija somente depois de responder à prova; não inclua o gabarito na tela da aula.

## Respostas comentadas

1. **Qual teste exercita BOLA?**
   - **Resposta:** Tentativa de outro usuário acessar/editar ticket T8 sem permissão no objeto.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

2. **Qual exercita mass assignment?**
   - **Resposta:** Enviar `approved:true` a uma operação que só aceita descrição.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

3. **Qual exercita BFLA?**
   - **Resposta:** Acionar endpoint approve sem papel de gerente.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

4. **Por que UUID não substitui autorização?**
   - **Resposta:** Dificulta descoberta, mas uma vez conhecido não altera permissão.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

5. **Como modelar DTO de patch?**
   - **Resposta:** Whitelist de campos por função e validação de tipos/valores.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

6. **Que testes positivos demonstram não-regressão?**
   - **Resposta:** Dono edita descrição, gerente aprova em rota autorizada, visitante não.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

## Rubrica de correção

- **10–12 pontos sem erro eliminatório:** domínio editorial A da competência no exercício.
- **7–9 pontos:** rever mecanismo e executar reteste positivo/negativo.
- **0–6 pontos:** refazer exemplo resolvido e checkpoints.
- **Erro eliminatório:** executar em serviço não autorizado, confundir validação local com garantia de produção, aceitar hipótese sem evidência ou afirmar que um controle de uma camada resolve todas as outras.
- O resultado desta rubrica é orientação formativa; não confundir com nota editorial do arquivo nem avaliação observacional de alunos reais.
