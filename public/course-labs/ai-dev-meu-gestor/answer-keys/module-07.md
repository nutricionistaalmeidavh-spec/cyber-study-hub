# Gabarito e rubrica independente — Módulo 07

**Consulte somente após registrar sua própria tentativa.** Análise editorial por IA, não avaliação humana de estudantes.

1. **Pergunta:** Após corrigir PATCH /orders/OS-002/advance, o teste passou, mas outra ordem some após aplicar filtro. Como fazer regressão?

   **Resposta esperada:** Reproduzir por IDs estáveis com fixture, testar filtragem sem mutação, excluir por ID e conferir ordens restantes; rodar suíte completa de domínio e HTTP.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

2. **Pergunta:** A API recebe JSON quebrado em POST /clients. O que deve responder e como verificar que não gravou parcialmente?

   **Resposta esperada:** HTTP 400 JSON e nenhuma inserção. Compare contagens antes/depois e confirme banco íntegro sem lançar exceção que encerre o servidor.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

3. **Pergunta:** Uma OS concluída é avançada três vezes e o contador cresce. Qual teste falha primeiro e qual contrato deve reger a correção?

   **Resposta esperada:** Teste idempotência do estado final: conclusão repetida mantém status e o contador derivado da lista. Não incrementar contadores por clique.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

4. **Pergunta:** Um modelo de IA afirma que todos os testes passando provam segurança em produção. Qual resposta técnica cabe?

   **Resposta esperada:** Cobertura se limita aos cenários executados; não prova autenticação, autorização, TLS, acesso público nem revisão humana. Manter loopback e dados fictícios.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

5. **Pergunta:** Você recebeu um stack trace com token de autenticação e email real. Como pedir diagnóstico sem vazar dados?

   **Resposta esperada:** Redigir ou sintetizar log e criar fixture falsa sem credenciais; compartilhar comportamento e mensagem mínima, nunca .env ou segredo.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

6. **Pergunta:** Uma mudança em SQL bloqueou criação válida de cliente. Como isolar e reverter antes de prosseguir?

   **Resposta esperada:** Reproduzir caso com teste isolado, inspecionar diff e mensagem, desfazer mudança mínima, rodar teste específico e suíte completa com build.

   **Critério observável:** identificar a pré-condição, decisão, resultado e pelo menos um teste negativo.

## Rubrica de correção

- **2 pontos:** previsão específica, resultado verificável e justificativa cobrindo erro/limite.
- **1 ponto:** conceito correto mas falta evidência, passo de teste ou caso negativo.
- **0 pontos:** resposta genérica, contraditória ou que viola regras.
- Aprovação didática sugerida: pelo menos **10/12** sem erro eliminatório.
- **Erro eliminatório:** expor segredos ou considerar suíte de testes prova de segurança comercial.
- **Reteste:** corrigir a regra, executar cenário mínimo e registrar antes/depois sem consultar a solução durante primeira tentativa.

## Limites

Sem teste com estudantes reais, professor externo ou auditoria independente de segurança/assistividade. A rubrica mede respostas a seis casos, não prontidão de produto.
