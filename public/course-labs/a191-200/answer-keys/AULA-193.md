# AULA-193 — IAM: gabarito comentado
**Uso:** consultar apenas depois de responder à avaliação de transferência; não disponibilizar respostas na página da aula.

## Respostas e justificativas
1. **Ator, recurso e fronteira:** O serviço leitor de relatórios só necessita s3:GetObject em reports/; conceder s3:* no bucket dá um privilégio de escrita/deleção que o produto não exige.
2. **Mecanismo e regra:** Uma policy permite se Action, Resource e Conditions corresponderem; Deny explícito vence Allow, ausência de Allow é Deny implícito. ListBucket requer ARN do bucket; GetObject usa objeto. Trust policy e permissions policy respondem perguntas diferentes. O laboratório Python já existente exercita a policy com mais fidelidade.
3. **Correção causal:** Remover wildcards; vincular ação ao prefixo de objeto, verificar transporte e políticas de recurso/boundary/SCP separadamente. Comparar read-report, delete, read-private e pedido sem TLS com o avaliador IAM da aula.
4. **Evidência negativa:** substituir GetObject por DeleteObject no mesmo ARN deve resultar em `IMPLICIT_DENY`. Caso o simulador aceite, o controle da fixture falhou.
5. **Evidência positiva:** `assessIam({action:'s3:GetObject',resource:'arn:aws:s3:::course-iam-lab/reports/a.txt',secureTransport:true})` deve produzir `ALLOW_READ`, sem alterar o caso autorizado.
6. **Limitação fundamental:** aprovação de uma fixture determinística não mede políticas reais, proveniência, autenticação, runtime ou aprendizado humano. Requer laboratório nativo de propriedade do estudante para extrapolar.

## Rubrica verificável (100 pontos)
30 fronteira, conceitos e regra; 20 correção primária; 20 evidência do caso indevido; 20 reteste preservando a função; 10 escopo e riscos residuais.
**Erros impeditivos:** afirmar garantia de segurança de produção com base em fixture, usar credenciais reais ou sistemas não autorizados, ou tornar solução paga um pré-requisito silencioso.
