# AULA-191 — Docker Security: gabarito comentado
**Uso:** consultar apenas depois de responder à avaliação de transferência; não disponibilizar respostas na página da aula.

## Respostas e justificativas
1. **Ator, recurso e fronteira:** Uma API roda em contêiner com USER 10001 e rootfs somente leitura, mas a operação de logs monta /var/run/docker.sock. O socket pode dar controle do daemon do host a um processo comprometido; não confundir isolamento por UID com autorização no daemon.
2. **Mecanismo e regra:** A imagem define pacote e usuário padrão; o runtime define volumes, capabilities, seccomp, rede e permissões efetivas. Um Dockerfile com USER não prova flags de docker run; rootfs readonly não impede escrita em volumes. Docker socket é uma fronteira de controle do host, independente de identidade non-root dentro do contêiner.
3. **Correção causal:** Remover acesso ao socket, evitar privileged e host network, usar usuário não-root, rootfs readonly, capabilities reduzidas e seccomp default. Para escrita legítima, criar volume restrito específico. Em laboratório próprio conferir docker inspect e tentativa de escrita; nunca montar daemon de terceiros.
4. **Evidência negativa:** adicionar volume /var/run/docker.sock ao processo não-root deve resultar em `DAEMON_SOCKET`. Caso o simulador aceite, o controle da fixture falhou.
5. **Evidência positiva:** `assessContainer({user:'10001',readOnlyRootfs:true,dropAllCapabilities:true,extraCapabilities:[],volumes:[],hostNetwork:false,privileged:false,seccomp:'default'})` deve produzir `HARDENED_FIXTURE`, sem alterar o caso autorizado.
6. **Limitação fundamental:** aprovação de uma fixture determinística não mede políticas reais, proveniência, autenticação, runtime ou aprendizado humano. Requer laboratório nativo de propriedade do estudante para extrapolar.

## Rubrica verificável (100 pontos)
30 fronteira, conceitos e regra; 20 correção primária; 20 evidência do caso indevido; 20 reteste preservando a função; 10 escopo e riscos residuais.
**Erros impeditivos:** afirmar garantia de segurança de produção com base em fixture, usar credenciais reais ou sistemas não autorizados, ou tornar solução paga um pré-requisito silencioso.
