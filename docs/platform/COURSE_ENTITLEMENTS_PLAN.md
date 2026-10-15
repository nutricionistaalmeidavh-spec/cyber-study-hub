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

Esta etapa contempla **organização curricular e vitrine A**, não o lançamento de cobrança nem a ativação de uma barreira de conteúdo seguro.

## Limite de segurança antes de cobrar (obrigatório resolver)

Os documentos Markdown, PDFs e laboratórios estáticos estão controlados pelo backend. **Isso ainda não constitui um paywall completo**: partes do conteúdo das aulas interativas (`src/data/lessons.ts`, `src/data/lessonDetails.ts`, `src/content/main/*.json`) e das trilhas guiadas (`src/trails/*/modules.json`) são incorporadas ao JavaScript público pelo Vite. Um visitante tecnicamente capaz pode inspecionar o bundle, mesmo sem permissão de leitura no servidor. O source map público foi desativado, mas isso **não elimina** o conteúdo embutido.

Antes de aceitar pagamentos reais, extrair os dados didáticos para endpoints autenticados, aplicar a mesma autorização por curso a cada payload, impedir o acesso por arquivos alternativos, realizar testes E2E de tentativas com duas contas e confirmar que o bundle público contém somente a estrutura editorial permitida. Também considerar que caches antigos em dispositivos e arquivos previamente baixados não podem ser revogados retroativamente.

O núcleo atual não chama gateway externo, não contém credenciais novas e continua usando tecnologias abertas. Pagamentos permanecem somente opção futura explícita.
