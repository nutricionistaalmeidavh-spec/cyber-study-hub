# Gabarito independente — AULA-053: File Upload Vulnerabilities

**Uso:** corrija somente depois de responder à prova; não inclua o gabarito na tela da aula.

## Respostas comentadas

1. **O MIME declarado prova o conteúdo?**
   - **Resposta:** Não: pode ser falsificado pelo cliente.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

2. **O que a assinatura GIF invalida nesse caso?**
   - **Resposta:** Bytes sem GIF87a/GIF89a são rejeitados no gate inicial.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

3. **Onde fica o arquivo aceito até inspeções adicionais?**
   - **Resposta:** Quarentena isolada, com identificador do servidor, sem execução.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

4. **O que fazer com o nome fornecido pelo cliente?**
   - **Resposta:** Não usá-lo como caminho; gerar nome/ID interno e guardar metadado validado.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

5. **Como servir depois de aprovação?**
   - **Resposta:** Como recurso de dados, tipo explícito, nosniff, autorização e domínio/rota de arquivos sem execução.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

6. **Qual limitação da verificação de magic bytes?**
   - **Resposta:** Ela não garante ausência de conteúdo malicioso ou poliglota; outras validações são necessárias.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

## Rubrica de correção

- **10–12 pontos sem erro eliminatório:** domínio editorial A da competência no exercício.
- **7–9 pontos:** rever mecanismo e executar reteste positivo/negativo.
- **0–6 pontos:** refazer exemplo resolvido e checkpoints.
- **Erro eliminatório:** executar em serviço não autorizado, confundir validação local com garantia de produção, aceitar hipótese sem evidência ou afirmar que um controle de uma camada resolve todas as outras.
- O resultado desta rubrica é orientação formativa; não confundir com nota editorial do arquivo nem avaliação observacional de alunos reais.
