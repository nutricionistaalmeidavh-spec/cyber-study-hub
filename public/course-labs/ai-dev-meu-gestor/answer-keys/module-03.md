# Gabarito independente — módulo 03

**Abra somente após concluir e salvar a primeira tentativa.** Este documento é separado da prova e não valida aprendizagem automaticamente.

1. **Pergunta:** O navegador abriu a página com Vite, mas npm run build falhou. Diga como diagnosticar e qual é a situação real.

   **Resposta esperada:** Executar build, ler erro, localizar arquivo/linha, fazer diff, corrigir e rodar novamente. Página renderizada não certifica build.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

2. **Pergunta:** Explique a função de Node/npm, Vite, React, TypeScript, VSCodium e Git, sem confundi-las.

   **Resposta esperada:** Node runtime ferramentas, npm dependências, Vite dev/build, React UI, TS tipos, editor altera arquivos, Git versiona snapshots.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

3. **Pergunta:** Após editar App.tsx, git status mostra modified. O que falta antes de ter um commit e por quê?

   **Resposta esperada:** Testar, revisar git diff, git add e git commit. Salvar não cria histórico de alterações.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

4. **Pergunta:** A IA pediu para enviar .env com token para corrigir erro de build. Qual resposta segura?

   **Resposta esperada:** Recusar envio de segredos, sanitizar log e compartilhar apenas mensagem e contexto mínimo.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

5. **Pergunta:** Uma tentativa de npm run dev falha por pacote ausente. Cite verificações antes de apagar diretórios.

   **Resposta esperada:** Confirmar diretório, Node/npm, presença package.json, npm install, saída do erro, conexão; não executar rm -rf arbitrário.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

6. **Pergunta:** Por que abrir index.html em file:// pode falhar no checkpoint e qual URL se deve usar?

   **Resposta esperada:** TypeScript/React importações requerem processamento Vite; executar npm run dev e usar endereço localhost apresentado.

   **Critério:** resposta tem hipótese, regra, resultado testável e justifica rejeição de comportamento incorreto.

## Rubrica de correção

- 2 pontos: resposta específica, demonstrável e completa, contendo previsão e teste adequado.
- 1 ponto: conceito correto, mas faltou condição, evidência ou cenário negativo.
- 0 pontos: resposta incorreta, impossível de verificar ou aceita comportamento perigoso.
- **Aprovação pedagógica sugerida:** pelo menos 10/12 e nenhuma falha eliminatória; é aferição do estudante, distinta da nota editorial A da aula.
- **Erro eliminatório:** divulgar segredos de .env ou declarar build OK quando falhou.
- **Reteste:** reescrever a decisão errada, executar cenário mínimo e registrar o resultado antes/depois.

## Método e limites

Revisão crítica editorial por IA sobre perguntas e respostas, separada do texto expositivo. Não houve teste com estudantes, correção por docente humano nem validação com leitor de tela. Essas evidências continuam pendentes.
