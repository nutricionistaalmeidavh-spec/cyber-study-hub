# HubEstudos ↔ Pagamento ArtiSys (integração opt-in)

## Origem da integração

A integração usa **o Pagamento ArtiSys existente** (`nutricionistaalmeidavh-spec/pagamentos-artisys`), na `main` que já contempla DevKits e publicações R2. **Não cria um novo gateway, não modifica as 67 ofertas preexistentes, não altera os 71 ZIPs dos kits e não reutiliza segredos de outros produtos.**

A compra individual e a assinatura são modos diferentes da *mesma* API de pagamento. O Hub conserva a fonte canônica de cursos (`src/curriculum/courses.json`) e os 607 IDs atuais. Somente cursos `published` podem receber compras e liberações; o futuro REV-IA entrará quando tiver avaliação A e `published`.

**Padrão R$ 0:** a plataforma de estudo, os grants manuais e o backend self-hosted continuam utilizáveis sem pagamentos, credenciais, chave de API, Asaas ou serviço externo. A integração monetizada depende de ativação explícita e a cobrança real pode envolver taxas do processador escolhido; não há dependência paga silenciosa.

## 1. Produtos e ofertas no Pagamento ArtiSys

Cadastre no **painel ArtiSys /admin**, **inativos inicialmente**, com `deliveryMode=webhook` e preços definidos exclusivamente pelo administrador em centavos BRL. Não inventar preços no Hub. Cada curso A publicado possui produto:

| ID de produto no ArtiSys | Curso no Hub | Sale type |
| --- | --- | --- |
| hubestudos-course-web-apis | web-apis | one_time |
| hubestudos-course-redes-sistemas | redes-sistemas | one_time |
| hubestudos-course-pentest-seguro | pentest-seguro | one_time |
| hubestudos-course-active-directory | active-directory | one_time |
| hubestudos-course-blue-team | blue-team | one_time |
| hubestudos-course-engenharia-reversa | engenharia-reversa | one_time |
| hubestudos-course-analise-malware | analise-malware | one_time |
| hubestudos-course-exploit-research | exploit-research | one_time |
| hubestudos-course-red-purple-team | red-purple-team | one_time |
| hubestudos-course-cloud-devsecops | cloud-devsecops | one_time |
| hubestudos-course-seguranca-ia | seguranca-ia | one_time |
| hubestudos-course-projeto-final | projeto-final | one_time |
| hubestudos-course-desenvolvimento-com-ia | desenvolvimento-com-ia | one_time |
| hubestudos-course-automacao-canal-dark | automacao-canal-dark | one_time |
| hubestudos-subscription | Todos os cursos publicados durante a vigência | monthly **ou** yearly |

Para `hubestudos-subscription`, crie duas ofertas distintas com o mesmo `productId`, uma `saleType=monthly` e outra `saleType=yearly`. Cada oferta tem ID único, nome e preço no painel. Para os cursos, cada oferta usa o produto indicado. Não use `manual` ou `download` para esses produtos: somente `webhook` libera acesso no Hub.

O preço canônico é do Pagamento ArtiSys (não fica duplicado no HubEstudos). A vitrine só usa as ofertas **ativas** do `GET /v1/catalog` — taxas e descontos continuam sob a responsabilidade do gateway.

## 2. Endpoint HTTPS do Hub

`POST https://<dominio-hub>/api/integrations/artisys/fulfillment` — atende Cloudflare Durable Object e Node self-hosted. O formato é o **conector de produto existente**:

```http
POST /api/integrations/artisys/fulfillment
Content-Type: application/json
x-artisys-timestamp: <Unix-ms>
x-artisys-delivery-id: <UUID-do-job>
x-artisys-signature: sha256=<HMAC-SHA256>
```

Payload: `{event,orderId,productId,email,customerName,amountCents,currency,saleType,idempotencyKey}`. O MAC cobre o timestamp, um ponto e os **bytes JSON exatos**. Eventos aceitos: `artisys.license.activate`, `artisys.license.renew` (somente assinatura) e `artisys.license.revoke`. O checkout não pode chamar essa rota; somente o motor de entregas assinadas do Pagamento ArtiSys.

Verificações: segredo >= 32 caracteres; HMAC via WebCrypto; janela ±5 min; UUID da entrega igual a `idempotencyKey`; e-mail idêntico ao cadastro existente, ativo; moeda BRL; total positivo; produto A com modalidade permitida. Sem conta correspondente, retorna HTTP 409 (entrega pendente, nunca finge sucesso). Resposta HTTP 200 `{"accepted":true}` apenas depois da transação SQL persistida. Eventos repetidos são seguros; IDs conflitantes são rejeitados.

O vínculo da compra é com o **e-mail informado no checkout**, que deve corresponder à conta Hub. E-mail de login do Hub ainda não tem verificação por e-mail; configurar política de verificação/identidade antes de operar volume comercial ou liberar contas autogeridas. Compra feita para e-mail distinto será destinada à conta correspondente, não à sessão local do navegador.

## 3. Conectar os dois serviços (somente quando for ativar)

1. Gere um segredo aleatório diferente de todos os segredos do Asaas, Admin ou outros produtos, de no mínimo 32 caracteres. Salve-o **somente** nos ambientes privados.
2. Hub Cloudflare: Secret `HUB_ARTISYS_CONNECTOR_SECRET` no Worker/DO. Hub Node: variável `HUB_ARTISYS_CONNECTOR_SECRET` no servidor. Não usar `VITE_*` para esse valor.
3. Pagamento ArtiSys: Secret `PRODUCT_CONNECTORS_JSON` com objeto indexado por cada `productId` da tabela; os 15 produtos podem apontar para a mesma URL HTTPS do Hub e o mesmo segredo do Hub, sem conceder permissão sobre os outros produtos. **Faça merge do JSON existente, jamais sobrescreva configurações dos quatro sistemas e DevKits.**
4. Configure `CONNECTOR_ALLOWED_ORIGINS` do Pagamento ArtiSys para incluir a origem HTTPS do Hub, preservando as origens existentes. O gateway recusa conector fora da lista.
5. Publique oferta no Pagamento ArtiSys somente depois de concluir a migração de conteúdo privado, QA e homologação. Ative `PAYMENTS_ENABLED=true` no gateway **somente** quando a cobrança estiver preparada. Defina preços, tributos, reembolso e prazo contratual da compra individual.
6. Vitrine Hub (variáveis **públicas** de build): `VITE_ARTISYS_PAYMENTS_URL=https://pagamentos-artisys-central.nutricionistaalmeidavh.workers.dev` (ou domínio HTTPS oficial configurado) e `VITE_ARTISYS_CHECKOUT_ENABLED=true`. Sem essa flag, não existem botões de compra nem acesso ao gateway.
7. Teste com conta A (comprador) e conta B (sem acesso), inclusive replay, estorno, revogação de curso, renovação, expiração e entrega fora de ordem; depois valide sessão do comprador, redirecionamento, HTTPS e logs sanitizados em produção.

**Formato ilustrativo**, a preencher manualmente e mesclar no JSON já existente, sem colocar segredo em Git:

```json
{
  "hubestudos-course-web-apis": {
    "url": "https://SEU-HUB/api/integrations/artisys/fulfillment",
    "secret": "<SEGREDO_PRIVADO_COMPARTILHADO_APENAS_COM_HUB>"
  },
  "hubestudos-subscription": {
    "url": "https://SEU-HUB/api/integrations/artisys/fulfillment",
    "secret": "<MESMO_SEGREDO_PRIVADO_DO_HUB>"
  }
}
```

Repita o mesmo apontamento para os outros 13 IDs de produto publicados. Nunca usar valores ilustrativos em produção.

## 4. Concessões, assinatura e falha segura

- Pagamentos ficam em `billing_entitlements`, eventos em `billing_events`. O acesso manual continua independente em `course_grants` e `subscription_grants`. Um reembolso pago não revoga concessão manual nem outro pedido.
- Compra por curso: acesso sem vencimento técnico, sujeito à política comercial definida antes da venda; o admin pode limitar acesso manual independentemente.
- Assinatura: o ledger local concede **30 dias para mensal** e **365 dias para anual** após ativação; renova somente após `license.renew` **assinado**. Essas durações são operacionais provisórias: alinhar à data real de ciclo de cobrança e contratos antes de habilitar assinatura em produção.
- `license.revoke` marca somente o pedido correspondente como revogado; rejeita revogação desconhecida e não ressuscita pedido reembolsado.
- `POST` externo não utiliza cookie de usuário, `Origin` de navegador nem ADMIN_TOKEN; a exceção de origem é **exclusiva** à rota HMAC. APIs restantes mantêm CSRF/origem e autenticação.
- O frontend nunca envia status `paid`, valor, privilégio, `userId`, secret ou qualquer token de pagamento.
- Nenhuma API/login/OAuth de outro produto muda.
- Pagamento ArtiSys ainda exige validação do ciclo de cobrança e reembolso da assinatura; webhook não substitui conciliação financeira.

## 5. Gates

```sh
npm run test:artisys-billing
npm run test:course-access
npm run build
```

O build passa a exigir os testes de HMAC/Node e preservação de grants. Verifique também o QA do Cloudflare Worker e faça homologação real do conector antes de publicar.

**Bloqueio importante:** o repositório de conteúdos do Hub ainda é **público**; uma autorização HTTP não torna exclusivos os arquivos publicados no GitHub. Para comercializar conteúdo restrito, migre os assets educacionais para repositório/storage privado e faça QA do acesso direto antes de habilitar checkout.

Referência do contrato: `pagamentos-artisys/docs/INTEGRACAO.md`. Não transportar chaves do gateway para o Hub; apenas o segredo específico HMAC do conector.
