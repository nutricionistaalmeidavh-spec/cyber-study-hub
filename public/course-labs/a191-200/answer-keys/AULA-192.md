# AULA-192 — Kubernetes Security: gabarito comentado
**Uso:** consultar apenas depois de responder à avaliação de transferência; não disponibilizar respostas na página da aula.

## Respostas e justificativas
1. **Ator, recurso e fronteira:** Um pod lê um ConfigMap. Sua ServiceAccount tem RoleBinding que concede '*' e token montado automaticamente, embora nenhum request à API seja necessário. Um processo que falhe recebe poderes não relacionados à tarefa.
2. **Mecanismo e regra:** RBAC valida sujeito, recurso e verbo; ServiceAccount fornece identidade à API; securityContext limita o processo. NetworkPolicy trata tráfego se o CNI aplicar; admission decide aceitação do manifesto. Usuário não-root não corrige Role editora e NetworkPolicy não substitui autorização do token.
3. **Correção causal:** Restringir Role GET a configmaps do namespace, vincular somente a ServiceAccount específica e desligar automount quando desnecessário; configurar runAsNonRoot, cap drop ALL, sem escalation e rootfs somente leitura. Verificar kubectl auth can-i num cluster próprio e a NetworkPolicy efetiva.
4. **Evidência negativa:** trocar Role verbs:['get'] por verbs:['*'] deve resultar em `RBAC_WILDCARD`. Caso o simulador aceite, o controle da fixture falhou.
5. **Evidência positiva:** `assessKubernetes({allowedVerbs:['get'],allowedResources:['configmaps'],automountServiceAccountToken:false,runAsNonRoot:true,privileged:false,allowPrivilegeEscalation:false,readOnlyRootFilesystem:true,capDrop:['ALL']})` deve produzir `MINIMUM_POD_FIXTURE`, sem alterar o caso autorizado.
6. **Limitação fundamental:** aprovação de uma fixture determinística não mede políticas reais, proveniência, autenticação, runtime ou aprendizado humano. Requer laboratório nativo de propriedade do estudante para extrapolar.

## Rubrica verificável (100 pontos)
30 fronteira, conceitos e regra; 20 correção primária; 20 evidência do caso indevido; 20 reteste preservando a função; 10 escopo e riscos residuais.
**Erros impeditivos:** afirmar garantia de segurança de produção com base em fixture, usar credenciais reais ou sistemas não autorizados, ou tornar solução paga um pré-requisito silencioso.
