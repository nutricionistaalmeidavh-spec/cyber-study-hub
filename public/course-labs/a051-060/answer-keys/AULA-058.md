# Gabarito independente — AULA-058: CORS e Same-Origin Policy

**Uso:** corrija somente depois de responder à prova; não inclua o gabarito na tela da aula.

## Respostas comentadas

1. **O navegador permite JS ler resposta credenciada com wildcard?**
   - **Resposta:** Não; ACAO wildcard não satisfaz credenciais.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

2. **O status 200 demonstra acesso do JS?**
   - **Resposta:** Não; é necessário verificar aplicação da política CORS no navegador.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

3. **Qual é o papel de Vary: Origin?**
   - **Resposta:** Distinguir resposta cacheada conforme origem quando refletida de allowlist.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

4. **Por que CORS não substitui autorização?**
   - **Resposta:** Clientes fora do navegador não obedecem SOP; backend controla dados.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

5. **O valor Origin: null é automaticamente confiável?**
   - **Resposta:** Não; deve ser tratado com cautela e não liberado genericamente.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

6. **Qual regressão positiva deve permanecer?**
   - **Resposta:** Frontend app.local credenciado recebe cabeçalhos adequados e continua operando.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

## Rubrica de correção

- **10–12 pontos sem erro eliminatório:** domínio editorial A da competência no exercício.
- **7–9 pontos:** rever mecanismo e executar reteste positivo/negativo.
- **0–6 pontos:** refazer exemplo resolvido e checkpoints.
- **Erro eliminatório:** executar em serviço não autorizado, confundir validação local com garantia de produção, aceitar hipótese sem evidência ou afirmar que um controle de uma camada resolve todas as outras.
- O resultado desta rubrica é orientação formativa; não confundir com nota editorial do arquivo nem avaliação observacional de alunos reais.
