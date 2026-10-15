# AULA-197 — Software Supply Chain: gabarito comentado
**Uso:** consultar apenas depois de responder à avaliação de transferência; não disponibilizar respostas na página da aula.

## Respostas e justificativas
1. **Ator, recurso e fronteira:** Um pacote baixado confere com checksum publicado pelo próprio remetente desconhecido; isso não liga artefato a builder confiável ou fonte esperada.
2. **Mecanismo e regra:** Digest oferece integridade relativa à referência confiável, mas não autentica origem quando referência e arquivo vêm do mesmo atacante. Lockfile evita drift de resolução; SBOM fornece inventário; attestation associa build a identidade e workflow, desde que emissor e assinatura sejam realmente validados.
3. **Correção causal:** Fixar dependencies e digests, consumir registries confiáveis, verificar proveniência com identidade explicitamente aprovada e usar SBOM para resposta. Testar alteração intencional da fixture e confirmar que falha o digest; não chamar presença de campo 'verified' de verificação criptográfica.
4. **Evidência negativa:** manter digest igual e marcar provenanceVerified:false deve resultar em `ORIGIN_NOT_VERIFIED`. Caso o simulador aceite, o controle da fixture falhou.
5. **Evidência positiva:** `assessSupplyChain({expectedDigest:'SHA256:1',actualDigest:'SHA256:1',lockfilePinned:true,provenanceVerified:true,sbomAvailable:true})` deve produzir `VERIFIED_FIXTURE`, sem alterar o caso autorizado.
6. **Limitação fundamental:** aprovação de uma fixture determinística não mede políticas reais, proveniência, autenticação, runtime ou aprendizado humano. Requer laboratório nativo de propriedade do estudante para extrapolar.

## Rubrica verificável (100 pontos)
30 fronteira, conceitos e regra; 20 correção primária; 20 evidência do caso indevido; 20 reteste preservando a função; 10 escopo e riscos residuais.
**Erros impeditivos:** afirmar garantia de segurança de produção com base em fixture, usar credenciais reais ou sistemas não autorizados, ou tornar solução paga um pré-requisito silencioso.
