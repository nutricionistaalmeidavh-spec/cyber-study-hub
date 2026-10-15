# Catálogo por produtos (15/10/2026)

## Hierarquia e integridade
- **Produto vendável** (curso independente ou trilha aplicada) → **módulos** → **aulas/etapas** → **laboratórios**.
- `src/curriculum/courses.json` define 12 cursos independentes a partir das 218 aulas canônicas, sem duplicação e sem renumerar unidades. Dois cursos práticos de IA permanecem como trilhas com seu próprio manifest e progressão.
- A visibilidade da **vitrine pública** depende de `releaseRequested` e de 100% dos módulos/aulas com parecer A editorial vigente. `src/curriculum/publication.json` é uma projeção testada contra `quality/registry.json` e `quality/trails/*/reviews.json`.
- Execute `npm run refresh:courses` ao promover novos conteúdos, revise o diff e faça merge após os testes; `npm run test:courses` valida integridade.
- Atualmente 11/12 cursos (208 aulas agrupadas) estão na vitrine. Projeto Final Integrado (209–218) fica oculto até as aulas 211–218 alcançarem A; não há publicação parcial. As 325 unidades paralelas são suporte curricular, não produtos automaticamente vendáveis.

## Comércio e autorização — etapa separada, **ainda não implantada**
- `products`: id canônico, nome, módulos, `published`, versão; preços não são definidos no front-end.
- `entitlements`: `user_id`, `product_id`, `source` (compra avulsa, assinatura ativa, concessão administrativa), `valid_from`, `valid_until`, estado e trilha de auditoria.
- `orders/payments`: eventos de pagamento idempotentes e validados **no servidor**, sem confiar no front-end; recebedor/provider a escolher explicitamente quando a venda entrar no escopo.
- `subscriptions`: período, renovações/cancelamento, período de tolerância definido, atualização do catálogo e revogação; assinatura ativa dá acesso aos cursos publicados e atualizações, sem compra retroativa implícita quando cancelada.
- A venda avulsa concede o **produto específico**, inclusive suas atualizações futuras conforme política contratada; não libera o restante do catálogo.
- Middleware de autorização no Worker e autorização de objetos/arquivos: preservar rotas `/api/auth`, `/api/me` e contas, e exigir concessão no acesso a cada produto/aula/asset. **Não considerar esconder cards ou rotas React como proteção**, pois arquivos `public/course-library` são servidos estaticamente.
- Não habilitar checkout, cobrar, ou afirmar controle de acesso comercial antes de validar fluxo end-to-end (login, produto avulso, assinatura, cancelamento, retorno e URL direta).
- Núcleo do ambiente e laboratórios: R$ 0, self-hosted e open source. Gateway comercial futuro será uma integração externa explícita e opcional, nunca dependência silenciosa dos laboratórios.

## Migração
- A biblioteca existente `#lessons`, os IDs `AULA-001..218`, os materiais paralelos, os estados de progresso e os links antigos permanecem intactos.
- Nova navegação `#courses` e `#courses/<id>`; nenhuma alteração em secrets, OAuth, banco, endpoints, sessões ou Cloudflare nesta etapa.
- É obrigatório um projeto posterior de autorização comercial **antes de vender cursos**, pois acesso atual por login ainda não equivale a assinatura/compra.
