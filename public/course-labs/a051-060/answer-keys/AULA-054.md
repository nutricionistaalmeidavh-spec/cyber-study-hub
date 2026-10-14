# Gabarito independente — AULA-054: JWT Security

**Uso:** corrija somente depois de responder à prova; não inclua o gabarito na tela da aula.

## Respostas comentadas

1. **Por que decodificar payload não autentica ninguém?**
   - **Resposta:** Base64 é codificação legível e alterável; é necessário verificar assinatura.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

2. **A assinatura válida autoriza a API errada?**
   - **Resposta:** Não; audience não corresponde ao recurso esperado.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

3. **Qual a política do algoritmo?**
   - **Resposta:** Allowlist explícita por aplicação e chave, rejeitando alg none e trocas.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

4. **O que acontece quando exp<=agora?**
   - **Resposta:** Token expirado é rejeitado sem acessar recurso.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

5. **Como distinguir assinatura de sigilo?**
   - **Resposta:** JWS garante integridade/autenticidade conforme chaves, mas não oculta claims.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

6. **Que controle ainda falta para ler o objeto B de outro usuário?**
   - **Resposta:** Autorização server-side por objeto, independente da identidade assinada.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

## Rubrica de correção

- **10–12 pontos sem erro eliminatório:** domínio editorial A da competência no exercício.
- **7–9 pontos:** rever mecanismo e executar reteste positivo/negativo.
- **0–6 pontos:** refazer exemplo resolvido e checkpoints.
- **Erro eliminatório:** executar em serviço não autorizado, confundir validação local com garantia de produção, aceitar hipótese sem evidência ou afirmar que um controle de uma camada resolve todas as outras.
- O resultado desta rubrica é orientação formativa; não confundir com nota editorial do arquivo nem avaliação observacional de alunos reais.
