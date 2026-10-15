# Catálogo de cursos e política comercial (proposta; cobrança inativa)

## Catálogo

A vitrine pública exibe cursos com `status: published` em `src/curriculum/courses.json`. O catálogo agrupa **607 identidades canônicas**: 218 aulas principais, 325 unidades paralelas e 64 etapas guiadas (Meu Gestor com IA + Canal Dark). A publicação das 11 formações principais depende do parecer **A** registrado na `quality/registry.json`; os 8 módulos de cada trilha especial têm pareceres A próprios. A aprovação é editorial automatizada/assistida por IA, não um teste com alunos humanos.

O cadastro de cursos é independente dos IDs de unidade: alterar a estrutura de módulos NÃO muda `AULA-xxx`, `LOG-xx`, `DEV-IA-xxx` nem `CANAL-IA-xxx`, suas rotas ou os dados de estudo.

Estado no momento:
- 12 cursos principais publicados (todas as suas aulas têm A).
- Projeto Final Integrado publicado após auditoria A das aulas 211–218 em 15/10/2026.
- 13 cursos paralelos ocultos; somente LOG-01, PY-01 e NET-25 têm parecer A individual. Não publicar um curso paralelo parcialmente revisado.
- Duas trilhas guiadas publicadas: 8 módulos A cada, 32 etapas com IDs canônicos cada.
- Valores, checkout, venda avulsa e assinatura mensal **ainda não implementados**.

## Regras de visibilidade

- `draft`: não pode aparecer na vitrine pública nem no catálogo de cursos do aluno.
- `published`: requer curso integralmente A, inclusive módulos novos, com hashes e evidências validados no build.
- Revisão perdida, hash inválido ou conteúdo ampliado: bloquear publicação até novo parecer editorial.
- A área administrativa pode inspecionar cursos em preparação. O aluno precisa manter seus dados de progresso independentemente das mudanças de agrupamento.

## Modelo de acesso comercial a implementar antes de cobrar

- `course_grants`: `(id,user_id,course_id,origin,status,valid_from,valid_until,external_reference)`, com unicidade adequada para grants ativos.
- `subscriptions`: `(id,user_id,status,period_start,period_end,provider,external_reference)`.
- `access`: administração **ou** grant individual ativo **ou** assinatura ativa dentro do período; considerar `status: published` separadamente do acesso do aluno.
- Backend faz checagem autorizada a **cada requisição de material**, não apenas no roteador React. Uma URL direta e recursos estáticos públicos não são paywall. Os documentos/labs de conteúdo pago devem ser servidos por endpoint autenticado, com cache privado e sem URL pública direta.
- Webhook autenticado e idempotente para pagamento opcional, registrando pagamento/liquidação/estorno e lidando com duplicidade, cancelamento, prazo e chargeback.
- A assinatura concede acesso aos novos cursos publicados **durante a vigência**, sem apagar histórico/progresso na expiração. Compra individual concede acesso àquele curso pelo prazo comercial explicitado ao comprador.
- Nenhuma API ou serviço pago é dependência oculta: o núcleo segue self-hosted/open source/R$ 0. Prestador de pagamento só entra com aceitação comercial explícita, conforme as taxas dele; não ligar checkout fictício.
- Credenciais e tokens de pagamento ficam somente em Secrets do servidor, nunca no `VITE_*` ou bundle frontend.

## Checklist para lançar monetização

1. Definir preços, impostos, política de aquisição individual, prazo de acesso e reembolso.
2. Proteger conteúdo no servidor; testes reais de autorização cruzada e rotas estáticas devem comprovar isolamento.
3. Implementar concessão manual/admin e de assinatura com testes de expiração, revogação e atualização de cursos.
4. Escolher opcionalmente um processador de pagamento, validar webhooks e reconciliação.
5. Migrar contas antigas sem perder progresso, favoritos, questionários nem relatórios.
6. Validar UX de login, compra, pagamento pendente, assinatura vencida e recuperação de acesso.

Esta etapa contempla **organização curricular e vitrine A**, não o lançamento de cobrança nem a ativação de uma barreira de conteúdo seguro.
