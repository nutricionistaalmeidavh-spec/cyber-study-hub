# AULA-196 — SAST, DAST e SCA: gabarito comentado
**Uso:** consultar apenas depois de responder à avaliação de transferência; não disponibilizar respostas na página da aula.

## Respostas e justificativas
1. **Ator, recurso e fronteira:** SAST marca uma concatenação perigosa, DAST encontra HTTP 500 e SCA acusa CVE de biblioteca. São sinais de natureza diferente; scanner não demonstra automaticamente explorabilidade nem exposição na aplicação.
2. **Mecanismo e regra:** SAST analisa código e fluxos estáticos; DAST observa comportamento de instância em escopo autorizado; SCA cruza versões e advisories. SAST pode marcar código morto; DAST não prova causa; SCA não prova reachability. Triage precisa de versão, caminho executado, evidência positiva e negativa, severidade contextual.
3. **Correção causal:** Reproduzir localmente, localizar construção causal, aplicar patch ou atualização, validar input legítimo e adversarial e registrar falso positivo quando comprovado. Evitar baixar scanner pago para o percurso obrigatório; fixture em memória demonstra classificação, não varredura.
4. **Evidência negativa:** alterar reproduced para false deve resultar em `REQUIRES_TRIAGE`. Caso o simulador aceite, o controle da fixture falhou.
5. **Evidência positiva:** `triageScanFinding({kind:'SCA',component:'lib-a@1',rule:'advisory-x',reproduced:true,falsePositiveConfirmed:false,fixedAndRetested:false})` deve produzir `CONFIRMED_IN_FIXTURE`, sem alterar o caso autorizado.
6. **Limitação fundamental:** aprovação de uma fixture determinística não mede políticas reais, proveniência, autenticação, runtime ou aprendizado humano. Requer laboratório nativo de propriedade do estudante para extrapolar.

## Rubrica verificável (100 pontos)
30 fronteira, conceitos e regra; 20 correção primária; 20 evidência do caso indevido; 20 reteste preservando a função; 10 escopo e riscos residuais.
**Erros impeditivos:** afirmar garantia de segurança de produção com base em fixture, usar credenciais reais ou sistemas não autorizados, ou tornar solução paga um pré-requisito silencioso.
