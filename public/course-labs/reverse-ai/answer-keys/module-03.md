# Gabarito restrito à revisão — Análise estática C/Ghidra

**Módulo 03**. Compare a resposta do aluno com a prova de execução; equivalentes justificáveis são aceitos.

1. **Resposta esperada:** São três tarefas distintas; engine lê fonte C e não compila nem faz decompilação.

   **Pontuação:** 2 se explicar e citar comando/arquivo quando aplicável; 1 para acerto parcial sem evidência; 0 se incorreto.

2. **Resposta esperada:** parse e main; confirmar no arquivo próprio e, opcionalmente, em fluxo real do Ghidra.

   **Pontuação:** 2 se explicar e citar comando/arquivo quando aplicável; 1 para acerto parcial sem evidência; 0 se incorreto.

3. **Resposta esperada:** critical/high/normal; ramos score>=22 e score>=14 determinam prioridade.

   **Pontuação:** 2 se explicar e citar comando/arquivo quando aplicável; 1 para acerto parcial sem evidência; 0 se incorreto.

4. **Resposta esperada:** cc -O0 -g -Wall -Wextra -Werror sample.c -o sample, adaptando o caminho do diretório.

   **Pontuação:** 2 se explicar e citar comando/arquivo quando aplicável; 1 para acerto parcial sem evidência; 0 se incorreto.

5. **Resposta esperada:** Perde nomes, comentários, tipagem e estruturas após compilação/otimização, reconstruindo aproximação.

   **Pontuação:** 2 se explicar e citar comando/arquivo quando aplicável; 1 para acerto parcial sem evidência; 0 se incorreto.

6. **Resposta esperada:** Informar versão, binário, captura e log reais; se não executou, declarar decompilerExecuted=false.

   **Pontuação:** 2 se explicar e citar comando/arquivo quando aplicável; 1 para acerto parcial sem evidência; 0 se incorreto.

**Erro eliminatório:** apresentar execução de Ghidra/REA/serviço externo sem prova, induzir bypass de licença/DRM ou confundir resultado didático com clone perfeito.

## Rubrica de correção
10–12 pontos, sem erro eliminatório: domínio editorial satisfatório. 0–9 pontos: estudar novamente, refazer controle negativo e apresentar reteste. Sem observação com estudantes reais, esta rubrica é proposta e não certificação humana.
