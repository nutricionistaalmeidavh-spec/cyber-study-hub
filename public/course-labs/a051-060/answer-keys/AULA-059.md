# Gabarito independente — AULA-059: CSP, Security Headers e Browser Protections

**Uso:** corrija somente depois de responder à prova; não inclua o gabarito na tela da aula.

## Respostas comentadas

1. **Que diretiva bloqueia outros sites de embutir a página?**
   - **Resposta:** frame-ancestors, não frame-src.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

2. **Por que unsafe-inline exige cuidado?**
   - **Resposta:** Permite scripts inline e reduz mitigação CSP contra XSS.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

3. **CSP é substituta do encoding por contexto?**
   - **Resposta:** Não; são camadas distintas.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

4. **Qual header restringe MIME sniffing?**
   - **Resposta:** X-Content-Type-Options: nosniff.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

5. **Qual condição operacional para HSTS?**
   - **Resposta:** Respostas HTTPS e implantação controlada após avaliar impacto em domínios/subdomínios.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

6. **Que evidência demonstra aplicação real de CSP?**
   - **Resposta:** DevTools/browser observando recurso bloqueado e recurso legítimo funcionando, além de política enviada.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

## Rubrica de correção

- **10–12 pontos sem erro eliminatório:** domínio editorial A da competência no exercício.
- **7–9 pontos:** rever mecanismo e executar reteste positivo/negativo.
- **0–6 pontos:** refazer exemplo resolvido e checkpoints.
- **Erro eliminatório:** executar em serviço não autorizado, confundir validação local com garantia de produção, aceitar hipótese sem evidência ou afirmar que um controle de uma camada resolve todas as outras.
- O resultado desta rubrica é orientação formativa; não confundir com nota editorial do arquivo nem avaliação observacional de alunos reais.
