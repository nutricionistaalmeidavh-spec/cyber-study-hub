# AULA-198 — Supabase / Firebase Security: gabarito comentado
**Uso:** consultar apenas depois de responder à avaliação de transferência; não disponibilizar respostas na página da aula.

## Respostas e justificativas
1. **Ator, recurso e fronteira:** Alice pode editar sua nota, mas tenta transferir owner para Bob. No PostgreSQL RLS, USING examina estado anterior e WITH CHECK estado novo; ambos importam para UPDATE.
2. **Mecanismo e regra:** Grant permite operação da role; RLS limita linhas. Sem ENABLE RLS, policy não atua. Em Firestore resource.data é o estado antigo, request.resource.data o novo; rules não fazem filtro pós-query. Admin SDK e PostgreSQL BYPASSRLS não devem validar isolamento de cliente.
3. **Correção causal:** Exigir owner tanto em USING quanto WITH CHECK, grants mínimos, nenhum bypass em testes de usuário e query Firestore restrita. A suíte existente PostgreSQL/Firestore Emulator dá evidência real de enforcement local; a fixture JS não substitui essas integrações.
4. **Evidência negativa:** Alice atualiza oldOwner:'alice' para newOwner:'bob' deve resultar em `DENY_OWNER`. Caso o simulador aceite, o controle da fixture falhou.
5. **Evidência positiva:** `assessRowChange({authenticated:true,userId:'alice',oldOwner:'alice',newOwner:'alice',operation:'update'})` deve produzir `ALLOW`, sem alterar o caso autorizado.
6. **Limitação fundamental:** aprovação de uma fixture determinística não mede políticas reais, proveniência, autenticação, runtime ou aprendizado humano. Requer laboratório nativo de propriedade do estudante para extrapolar.

## Rubrica verificável (100 pontos)
30 fronteira, conceitos e regra; 20 correção primária; 20 evidência do caso indevido; 20 reteste preservando a função; 10 escopo e riscos residuais.
**Erros impeditivos:** afirmar garantia de segurança de produção com base em fixture, usar credenciais reais ou sistemas não autorizados, ou tornar solução paga um pré-requisito silencioso.
