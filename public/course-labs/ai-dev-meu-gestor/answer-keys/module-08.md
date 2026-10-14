# Gabarito e rubrica independente — Módulo 08

**Consulte somente após registrar sua própria tentativa.** Análise editorial por IA, não avaliação humana de estudantes.

1. **Pergunta:** npm run build passou, mas /api/orders retorna 404. O que está faltando no pacote de entrega?

   **Resposta esperada:** Frontend dist sozinho não inclui API; verificar Node rodando, rotas do servidor e banco SQLite. Comprovar /api/health, GET /api/orders e smoke test.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

2. **Pergunta:** Um backup tem 4 ordens, mas uma aponta para C-999 ausente. Por que a contagem não demonstra integridade?

   **Resposta esperada:** Executar PRAGMA foreign_key_check e integrity_check no arquivo restaurado, validar IDs e relacionamentos, rejeitar backup inconsistente e retestar.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

3. **Pergunta:** Um colega tenta restaurar sobre banco ativo em uso. Qual política inicial é adequada?

   **Resposta esperada:** Não sobrescrever arquivo existente. Criar banco novo em pasta isolada com mecanismo de backup SQLite, verificar e somente depois planejar troca controlada com servidor parado.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

4. **Pergunta:** A aplicação responde em 127.0.0.1 e não possui login. É correto expor a porta na internet?

   **Resposta esperada:** Não. Uso didático local sem autenticação, TLS, autorização e hardening; manter bind loopback e dados fictícios.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

5. **Pergunta:** Seu README diz apenas 'rode npm'. O que falta para outra pessoa reproduzir a entrega?

   **Resposta esperada:** Versão de Node, npm install, teste, build, start local, portas, caminho DB, health, backup/restauração, limitações, reset e interpretação de erros.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

6. **Pergunta:** Uma IA sugeriu trocar SQLite por banco gerenciado pago. Como preservar o contrato da trilha e avaliar a sugestão?

   **Resposta esperada:** Recusar dependência paga silenciosa; manter SQLite local open source como núcleo. Serviço gerenciado só como alternativa futura e explicitamente opcional.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

## Rubrica de correção

- **2 pontos:** previsão específica, resultado verificável e justificativa cobrindo erro/limite.
- **1 ponto:** conceito correto mas falta evidência, passo de teste ou caso negativo.
- **0 pontos:** resposta genérica, contraditória ou que viola regras.
- Aprovação didática sugerida: pelo menos **10/12** sem erro eliminatório.
- **Erro eliminatório:** expor o servidor sem autenticação à internet ou sobrescrever banco ativo durante restauração.
- **Reteste:** corrigir a regra, executar cenário mínimo e registrar antes/depois sem consultar a solução durante primeira tentativa.

## Limites

Sem teste com estudantes reais, professor externo ou auditoria independente de segurança/assistividade. A rubrica mede respostas a seis casos, não prontidão de produto.
