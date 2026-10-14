# Gabarito independente — AULA-052: Path Traversal e LFI/RFI

**Uso:** corrija somente depois de responder à prova; não inclua o gabarito na tela da aula.

## Respostas comentadas

1. **Qual nome passa em uma checagem lexical mas pode resolver para fora?**
   - **Resposta:** atalho.txt se for symlink para destino externo.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

2. **Qual medição diferencia nome lexical de destino real?**
   - **Resposta:** Comparar `path.resolve` com `realpath` e a raiz canonicalizada.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

3. **Ler texto fora da raiz demonstra RFI?**
   - **Resposta:** Não; demonstra leitura de arquivo, não inclusão remota.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

4. **Qual a limitação de `O_NOFOLLOW` no componente final?**
   - **Resposta:** Não protege links em diretórios ancestrais; proteger diretórios e handles.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

5. **Qual sucesso funcional deve permanecer?**
   - **Resposta:** Leitura do relatório regular público autorizado.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

6. **Como demonstrar o risco de TOCTOU sem prometer proteção inexistente?**
   - **Resposta:** Explicar que checagem por nome e abertura não são atômicas; declarar pré-condições de diretórios protegidos.
   - **Critério:** 2 pontos se a resposta ligar decisão, entrada e evidência pertinente; 1 se mencionar conceito sem justificativa; 0 se a decisão estiver errada.

## Rubrica de correção

- **10–12 pontos sem erro eliminatório:** domínio editorial A da competência no exercício.
- **7–9 pontos:** rever mecanismo e executar reteste positivo/negativo.
- **0–6 pontos:** refazer exemplo resolvido e checkpoints.
- **Erro eliminatório:** executar em serviço não autorizado, confundir validação local com garantia de produção, aceitar hipótese sem evidência ou afirmar que um controle de uma camada resolve todas as outras.
- O resultado desta rubrica é orientação formativa; não confundir com nota editorial do arquivo nem avaliação observacional de alunos reais.
