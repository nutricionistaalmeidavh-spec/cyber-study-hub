# Gabarito e rubrica independente — Módulo 06

**Consulte somente após registrar sua própria tentativa.** Análise editorial por IA, não avaliação humana de estudantes.

1. **Pergunta:** Uma ordem é exibida no React, mas some após reiniciar o processo Node. Identifique as três fontes que devem ser conferidas e um teste de arquivo.

   **Resposta esperada:** Verifique estado React, confirmação de POST 201 e se GET consulta a mesma base SQLite em disco. Abra o arquivo após fechar/reiniciar a conexão e confira ID/estado; mudança de pasta DB_FILE pode explicar sumiço.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

2. **Pergunta:** POST /api/orders com C-999 retorna 422. Qual contrato e qual invariante precisam permanecer?

   **Resposta esperada:** Cliente inexistente não cria OS; resposta 422 com erro, lista/contagens inalteradas e PRAGMA foreign_keys=ON com constraint no SQLite.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

3. **Pergunta:** Uma ordem é salva com status 'cancelado' ao chamar SQL diretamente. O que falhou e qual proteção é necessária?

   **Resposta esperada:** Faltou constraint CHECK status; banco deve aceitar apenas pendente, em andamento e concluído, independentemente da UI ou da API. Tente SQL inválido e confirme erro sem commit.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

4. **Pergunta:** Após criar uma ordem, o frontend diz 'salvo' antes da resposta HTTP; a API retorna 500. Qual decisão de UI deve mudar?

   **Resposta esperada:** Aguardar resposta 2xx e atualização de GET antes de indicar persistência. Em erro, exibir falha e permitir nova tentativa sem falso positivo de gravação.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

5. **Pergunta:** Cliente com OS vinculada recebe DELETE e desaparece, mas a ordem continua. Como impedir órfãos em duas camadas?

   **Resposta esperada:** Rejeitar no backend com 409 e configurar FK ON DELETE RESTRICT no banco com foreign_keys ligado; testar DELETE e integridade após falha.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

6. **Pergunta:** Que evidência diferencia SQLite em arquivo de um banco :memory: e por que isso importa ao final do módulo?

   **Resposta esperada:** Arquivo SQLite reaberto após encerrar processo preserva OS e relacionamentos. :memory: perde conteúdo ao fechar conexão, logo não demonstra persistência requerida.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

## Rubrica de correção

- **2 pontos:** previsão específica, resultado verificável e justificativa cobrindo erro/limite.
- **1 ponto:** conceito correto mas falta evidência, passo de teste ou caso negativo.
- **0 pontos:** resposta genérica, contraditória ou que viola regras.
- Aprovação didática sugerida: pelo menos **10/12** sem erro eliminatório.
- **Erro eliminatório:** aceitar OS órfã ou declarar persistência sem reabrir banco em arquivo.
- **Reteste:** corrigir a regra, executar cenário mínimo e registrar antes/depois sem consultar a solução durante primeira tentativa.

## Limites

Sem teste com estudantes reais, professor externo ou auditoria independente de segurança/assistividade. A rubrica mede respostas a seis casos, não prontidão de produto.
