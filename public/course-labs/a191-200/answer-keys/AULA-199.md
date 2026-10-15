# AULA-199 — Serverless Security: gabarito comentado
**Uso:** consultar apenas depois de responder à avaliação de transferência; não disponibilizar respostas na página da aula.

## Respostas e justificativas
1. **Ator, recurso e fronteira:** Uma função recebe token válido de Alice do tenant A, mas consulta fatura do tenant B com credencial administrativa do backend. Login correto não prova autorização do objeto.
2. **Mecanismo e regra:** Gateway ou handler deve validar assinatura, issuer, audience e tempo do JWT. Recurso e tenant devem vir de escopo conferido contra claims verificadas, não só parâmetro de URL. Runtime serverless não elimina limite de custo, privilégios de IAM, segredos e idempotência em reprocessamento.
3. **Correção causal:** Rejeitar pedido cross-tenant e método não permitido, usar identidade verificada, backend com least privilege, logs sem PII e idempotência transacional para eventos repetidos. Não usar nuvem obrigatória; fixture assume claims já verificadas.
4. **Evidência negativa:** alterar resourceTenant para B mantendo tenant A deve resultar em `TENANT_MISMATCH`. Caso o simulador aceite, o controle da fixture falhou.
5. **Evidência positiva:** `assessServerlessRequest({verifiedClaims:true,subject:'alice',role:'reader',now:10,exp:20,tenant:'A',resourceTenant:'A',method:'GET'})` deve produzir `ALLOW_FIXTURE`, sem alterar o caso autorizado.
6. **Limitação fundamental:** aprovação de uma fixture determinística não mede políticas reais, proveniência, autenticação, runtime ou aprendizado humano. Requer laboratório nativo de propriedade do estudante para extrapolar.

## Rubrica verificável (100 pontos)
30 fronteira, conceitos e regra; 20 correção primária; 20 evidência do caso indevido; 20 reteste preservando a função; 10 escopo e riscos residuais.
**Erros impeditivos:** afirmar garantia de segurança de produção com base em fixture, usar credenciais reais ou sistemas não autorizados, ou tornar solução paga um pré-requisito silencioso.
