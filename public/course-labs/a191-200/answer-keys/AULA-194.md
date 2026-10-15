# AULA-194 — Secrets Management: gabarito comentado
**Uso:** consultar apenas depois de responder à avaliação de transferência; não disponibilizar respostas na página da aula.

## Respostas e justificativas
1. **Ator, recurso e fronteira:** Uma API usa token fora do Git, mas uma exceção imprime todas as variáveis no log. Uma variável de ambiente não impede vazamento por logs, dumps ou child processes.
2. **Mecanismo e regra:** Ciclo de vida inclui emissão, distribuição, armazenamento, escopo, consumo, observabilidade, rotação e revogação. Escopo limita impacto; rotação preventiva não corrige exposição existente. Secret em bundle client equivale a público. File restrito local exige permissões e exclusão do Git.
3. **Correção causal:** Revogar credencial vazada, criar nova com escopo mínimo, eliminar logs de headers/env, conferir histórico de acessos e configurar rotação. Testar apenas metadados sintéticos; arquivo fora do Git e permissionamento podem ser usados sem serviço pago.
4. **Evidência negativa:** usar location:'repository' ou logExposed:true deve resultar em `SOURCE_EXPOSURE / LOG_EXPOSURE`. Caso o simulador aceite, o controle da fixture falhou.
5. **Evidência positiva:** `assessSecretLifecycle({location:'restricted_file',logExposed:false,revoked:false,ageDays:5,rotationDays:30,scope:'read',requiredScope:'read'})` deve produzir `CONTROLLED_FIXTURE`, sem alterar o caso autorizado.
6. **Limitação fundamental:** aprovação de uma fixture determinística não mede políticas reais, proveniência, autenticação, runtime ou aprendizado humano. Requer laboratório nativo de propriedade do estudante para extrapolar.

## Rubrica verificável (100 pontos)
30 fronteira, conceitos e regra; 20 correção primária; 20 evidência do caso indevido; 20 reteste preservando a função; 10 escopo e riscos residuais.
**Erros impeditivos:** afirmar garantia de segurança de produção com base em fixture, usar credenciais reais ou sistemas não autorizados, ou tornar solução paga um pré-requisito silencioso.
