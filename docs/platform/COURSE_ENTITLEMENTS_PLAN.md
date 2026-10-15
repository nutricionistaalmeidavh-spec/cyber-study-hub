# Catálogo de cursos e política comercial (proposta; cobrança inativa)

## Catálogo

A vitrine pública exibe cursos com `status: published` em `src/curriculum/courses.json`. O catálogo agrupa **607 identidades canônicas**: 218 aulas principais, 325 unidades paralelas e 64 etapas guiadas (Meu Gestor com IA + Canal Dark). A publicação das 12 formações principais depende do parecer **A** registrado na `quality/registry.json`; os 8 módulos de cada trilha especial têm pareceres A próprios. A aprovação é editorial automatizada/assistida por IA, não um teste com alunos humanos.

O cadastro de cursos é independente dos IDs de unidade: alterar a estrutura de módulos NÃO muda `AULA-xxx`, `LOG-xx`, `DEV-IA-xxx` nem `CANAL-IA-xxx`, suas rotas ou os dados de estudo.

Estado no momento:
- 12 cursos principais publicados (todas as suas aulas têm A).
- Projeto Final Integrado publicado após auditoria A das aulas 211–218 em 15/10/2026.
- 13 cursos paralelos ocultos; somente LOG-01, PY-01 e NET-25 têm parecer A individual. Não publicar um curso paralelo parcialmente revisado.
- Duas trilhas guiadas publicadas: 8 módulos A cada, 32 etapas com IDs canônicos cada.
- Valores, checkout e cobranças automáticas **não implementados**. Grants manuais de curso e assinatura são controlados pelo administrador.

## Regras de visibilidade

- `draft`: não pode aparecer na vitrine pública nem no catálogo de cursos do aluno.
- `published`: requer curso integralmente A, inclusive módulos novos, com hashes e evidências validados no build.
- Revisão perdida, hash inválido ou conteúdo ampliado: bloquear publicação até novo parecer editorial.
- A área administrativa pode inspecionar cursos em preparação. O aluno precisa manter seus dados de progresso independentemente das mudanças de agrupamento.

## Proteção de arquivos ativa e modelo comercial a concluir

- `course_grants`: `(user_id,course_id,granted_at,expires_at,revoked_at)`, com chave única por conta e curso; liberação/revogação manual.
- `subscription_grants`: `(user_id,granted_at,expires_at,revoked_at)`, acesso geral temporário concedido manualmente, sem cobrança.
- `access`: administração **ou** grant individual ativo **ou** assinatura ativa dentro do período; considerar `status: published` separadamente do acesso do aluno.
- Backend faz checagem autorizada a **cada requisição de material** (`/course-library`, `/course-labs`, `/materials`), no Cloudflare Worker e no Node self-hosted, não apenas no roteador React. Uma URL direta e recursos estáticos públicos não são paywall. A intercepção do Worker é obrigatória (`run_worker_first=true`), com respostas privadas/no-store, sessão ativa e grant válido. O service worker não armazena essas rotas.
- Webhook autenticado e idempotente para pagamento opcional, registrando pagamento/liquidação/estorno e lidando com duplicidade, cancelamento, prazo e chargeback.
- A assinatura concede acesso aos novos cursos publicados **durante a vigência**, sem apagar histórico/progresso na expiração. Compra individual concede acesso àquele curso pelo prazo comercial explicitado ao comprador.
- Nenhuma API ou serviço pago é dependência oculta: o núcleo segue self-hosted/open source/R$ 0. Prestador de pagamento só entra com aceitação comercial explícita, conforme as taxas dele; não ligar checkout fictício.
- Credenciais e tokens de pagamento ficam somente em Secrets do servidor, nunca no `VITE_*` ou bundle frontend.

## Checklist para lançar monetização

1. Definir preços, impostos, política de aquisição individual, prazo de acesso e reembolso.
2. Proteger conteúdo no servidor; testes reais de autorização cruzada e rotas estáticas devem comprovar isolamento.
3. Concessão manual/admin e de assinatura implementada, com regra de vencimento, revogação e cursos publicados. Validar fluxo integral no ambiente de produção.
4. Escolher opcionalmente um processador de pagamento, validar webhooks e reconciliação.
5. Migrar contas antigas sem perder progresso, favoritos, questionários nem relatórios.
6. Validar UX de login, compra, pagamento pendente, assinatura vencida e recuperação de acesso.

Esta etapa contempla **organização curricular, vitrine A e autenticação dos conteúdos no aplicativo**. A cobrança continua desativada; a publicação do repositório GitHub ainda impede exclusividade comercial.

## Segunda camada implementada: entrega autorizada de conteúdo

- Aulas V2 047–060 e legado 043–100 saem de `/api/content/lesson/:id` e não são importadas pelo aplicativo.
- Trilhas Meu Gestor e Canal Dark, oficinas e contratos de laboratórios são recuperados via `/api/content/trail/:source` com grant do respectivo curso.
- Conteúdo de jogos, gabaritos e cenários é recuperado via `/api/content/games`. O backend filtra os pacotes cujas aulas pertencem às concessões ativas.
- Cloudflare Worker e Node self-hosted usam o mesmo motor `securedPayload` e checam sessão, curso publicado, concessão, revogação e assinatura.
- Markdown, laboratórios e PDFs continuam protegidos também contra URL direta no Worker/Node. Respostas de conteúdo usam `Cache-Control: no-store`; o service worker não intercepta `/api`, `/course-library`, `/course-labs` nem `/materials`.
- `npm run build` verifica regressões e, no pós-build, audita o JavaScript gerado para evitar inclusão de conteúdo privado.
- IDs canônicos, progresso, contas, avaliações e login não mudam.

## Bloqueios comerciais ainda existentes

**O repositório GitHub `nutricionistaalmeidavh-spec/cyber-study-hub` está público.** Seus arquivos-fonte de aulas, jogos e trilhas, além dos diretórios de Markdown/laboratórios, permanecem disponíveis no GitHub independentemente do login no site. A proteção de requests e do bundle é real, mas **não constitui proteção de propriedade intelectual comercial contra leitura do GitHub**. Para vender conteúdo exclusivo será obrigatório:

1. Transferir o material completo para armazenamento ou repositório **privado** com deploy de conteúdo autenticado, sem integrar payloads didáticos no repositório público.
2. Excluir os arquivos sensíveis do estado atual do repositório público (sem apagar códigos canônicos de progresso), revisar scripts de QA que consultam esses arquivos e configurar credenciais de leitura *somente* no backend.
3. Considerar que commits públicos anteriores, forks, clones, caches antigos e materiais baixados não podem ser recolhidos retroativamente. Para exclusividade futura, publicar conteúdo revisado/novo apenas no armazenamento privado.
4. Validar URLs diretas, bundles, dois usuários distintos, conta suspensa, grant vencido/revogado, cache e deploy de produção.
5. Habilitar pagamentos e webhooks idempotentes somente após a migração, os testes operacionais e a escolha explícita do processador.

O núcleo permanece self-hosted/open source/R$ 0 e não chama prestadores pagos. A aquisição/assinatura ainda não é cobrada.
