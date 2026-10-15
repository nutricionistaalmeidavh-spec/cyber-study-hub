# AULA-195 — CI/CD Security: gabarito comentado
**Uso:** consultar apenas depois de responder à avaliação de transferência; não disponibilizar respostas na página da aula.

## Respostas e justificativas
1. **Ator, recurso e fronteira:** Uma PR passa nos testes, mas o workflow gera build a partir de commit diferente; digest do artefato recém-gerado está correto, porém não garante código testado.
2. **Mecanismo e regra:** Evento, checkout, testes, build, autenticação e publicação são fronteiras distintas. Exit code do gate deve impedir release. Digest confere integridade de bytes, não proveniência; SHA de fonte testada precisa coincidir com a fonte construída. Workflow de PR deve minimizar permissões e nunca executar texto de PR como shell.
3. **Correção causal:** Fixar mesma revisão nos gates e build, negar release após falha, conferir digest de artefato e minimizar GITHUB_TOKEN. Preservar teste nativo phase16-platform/ci com falha da variante insegura e sem artefato.
4. **Evidência negativa:** alterar testedDigest para sha256:old deve resultar em `UNTESTED_SOURCE`. Caso o simulador aceite, o controle da fixture falhou.
5. **Evidência positiva:** `assessReleaseGate({authorizationPassed:true,sourceDigest:'sha256:A',testedDigest:'sha256:A',builtDigest:'sha256:A',artifactDigest:'sha256:B',verifiedDigest:'sha256:B',failOpen:false})` deve produzir `RELEASE_FIXTURE_APPROVED`, sem alterar o caso autorizado.
6. **Limitação fundamental:** aprovação de uma fixture determinística não mede políticas reais, proveniência, autenticação, runtime ou aprendizado humano. Requer laboratório nativo de propriedade do estudante para extrapolar.

## Rubrica verificável (100 pontos)
30 fronteira, conceitos e regra; 20 correção primária; 20 evidência do caso indevido; 20 reteste preservando a função; 10 escopo e riscos residuais.
**Erros impeditivos:** afirmar garantia de segurança de produção com base em fixture, usar credenciais reais ou sistemas não autorizados, ou tornar solução paga um pré-requisito silencioso.
