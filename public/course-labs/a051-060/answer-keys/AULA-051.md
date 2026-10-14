# Gabarito independente — AULA-051: Command Injection

**Uso:** corrija somente depois de responder à prova; não inclua o gabarito na tela da aula.

## Respostas comentadas

1. **Qual é o executável e a lista de argumentos no caminho permitido?**
   - **Resposta:** node e [--version], fixos no backend, sem shell.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

2. **Por que `argv` vindo do navegador não basta ser um array?**
   - **Resposta:** Array separa argumentos, mas o usuário poderia injetar opções perigosas; é preciso allowlist da operação e parâmetros.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

3. **Como responder a `list-users` nesse contrato?**
   - **Resposta:** Rejeitar antes de lançar processo e registrar evento mínimo sem o payload sensível.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

4. **Que evidência demonstra ausência de execução indevida?**
   - **Resposta:** Stub de planejamento ou observação de que rejeição ocorreu antes de qualquer spawn, com contador de chamadas zero.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

5. **Qual caso positivo deve permanecer depois da correção?**
   - **Resposta:** health retorna o plano de `node --version` sem alterar a semântica.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

6. **Qual risco continua se trocar shell por execFile mas aceitar opções arbitrárias?**
   - **Resposta:** Injeção de argumentos: alterar comportamento do binário sem metacaracteres de shell.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

## Rubrica de correção

- **10–12 pontos sem erro eliminatório:** domínio editorial A da competência no exercício.
- **7–9 pontos:** rever mecanismo e executar reteste positivo/negativo.
- **0–6 pontos:** refazer exemplo resolvido e checkpoints.
- **Erro eliminatório:** executar em serviço não autorizado, confundir validação local com garantia de produção, aceitar hipótese sem evidência ou afirmar que um controle de uma camada resolve todas as outras.
- O resultado desta rubrica é orientação formativa; não confundir com nota editorial do arquivo nem avaliação observacional de alunos reais.
