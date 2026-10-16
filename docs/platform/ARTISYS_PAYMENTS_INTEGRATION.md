# HubEstudos ↔ Pagamento ArtiSys (integração opt-in)

## Origem da integração

A integração usa **o Pagamento ArtiSys existente** (`nutricionistaalmeidavh-spec/pagamentos-artisys`), na `main` que já contempla DevKits e publicações R2. **Não cria um novo gateway, não modifica as 67 ofertas preexistentes, não altera os 71 ZIPs dos kits e não reutiliza segredos de outros produtos.**

A compra individual e a assinatura são modos diferentes da *mesma* API de pagamento. O Hub conserva a fonte canônica de cursos (`src/curriculum/courses.json`) e os 607 IDs atuais. Somente cursos `published` podem receber compras e liberações; a trilha REV-IA já integrada entrará no catálogo comercial somente quando seu curso estiver `published`.

**Padrão R$ 0:** a plataforma de estudo, os grants manuais e o backend self-hosted continuam utilizáveis sem pagamentos, credenciais, chave de API, Asaas ou serviço externo. A integração monetizada depende de ativação explícita e a cobrança real pode envolver taxas do processador escolhido; não há dependência paga silenciosa.

## Migração para vendas por trilha (outubro de 2026)

Não há histórico de compras de alunos a migrar: segundo a administração, somente a conta de administrador tem acesso. Os **12 IDs de cursos antigos deixam de ser produtos vendáveis**; compras e liberações novas usam exclusivamente os cinco IDs de trilha da tabela e as trilhas especiais publicadas. O administrador continua com bypass autorizado por perfil, sem compra. As identidades `AULA-001..AULA-218`, progresso, sessões e API de autenticação não mudam.

No painel ArtiSys Pagamentos, criar **novas ofertas inativas** com os IDs abaixo, preços definidos pelo administrador, `one_time` e `webhook`; desativar quaisquer ofertas antigas do Hub se elas tiverem sido cadastradas. Atualizar `PRODUCT_CONNECTORS_JSON` por merge com os segredos existentes dos outros sistemas, sem sobrescrevê-los. **Não publicar ofertas nem ativar cobrança até homologar o conector e proteger o material privado.** O Hub por padrão funciona a R$ 0 com grants manuais e infraestrutura self-hosted; gateway é opcional. Uma compra de trilha concede acesso somente às aulas e laboratórios pertencentes àquela trilha. A assinatura geral permanece como produto separado.

## 1. Produtos e ofertas no Pagamento ArtiSys

Cadastre no **painel ArtiSys /admin**, **inativos inicialmente**, com `deliveryMode=webhook` e preços definidos exclusivamente pelo administrador em centavos BRL. Não inventar preços no Hub. As 218 aulas principais formam cinco trilhas que correspondem aos cinco produtos comerciais novos. As duas trilhas práticas já publicadas permanecem como produtos independentes. Engenharia Reversa com IA (32 etapas) segue draft até aprovação/publicação. Cada trilha publicada possui produto:

| ID de produto no ArtiSys | Trilha no Hub | Sale type |
| --- | --- | --- |
| hubestudos-course-trilha-pentest-ethical-hacking | Pentest e Ethical Hacking (30 aulas) | one_time |
| hubestudos-course-trilha-seguranca-ofensiva-defensiva | Segurança Ofensiva e Defensiva (50 aulas) | one_time |
| hubestudos-course-trilha-engenharia-reversa-malware | Engenharia Reversa e Análise de Malware (60 aulas) | one_time |
| hubestudos-course-trilha-pesquisa-vulnerabilidades | Pesquisa e Exploração de Vulnerabilidades (20 aulas) | one_time |
| hubestudos-course-trilha-aplicacoes-cloud-ia | Segurança de Aplicações, Infraestrutura, Nuvem e IA (58 aulas) | one_time |
| hubestudos-course-desenvolvimento-com-ia | Desenvolvimento de Sistemas com IA (32 etapas) | one_time |
| hubestudos-course-automacao-canal-dark | Automação de Canal com IA (32 etapas) | one_time |
| hubestudos-subscription | Todas as trilhas publicadas durante a vigência | monthly **ou** yearly |

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

Payload: `{event,orderId,productId,email,customerName,amountCents,currency,saleType,buyerBinding,orderCreatedAt,idempotencyKey}`. `buyerBinding` contém ticket assinado com `userId`, e-mail, produto, modalidade e janela de criação do pedido. `orderCreatedAt` vem do banco do gateway, não do navegador. O MAC cobre o timestamp, um ponto e os **bytes JSON exatos**. Eventos aceitos: `artisys.license.activate`, `artisys.license.renew` (somente assinatura) e `artisys.license.revoke`. O checkout não pode chamar essa rota; somente o motor de entregas assinadas do Pagamento ArtiSys.

Verificações: segredo >= 32 caracteres; HMAC via WebCrypto; janela ±5 min; UUID da entrega igual a `idempotencyKey`; ticket de compra emitido sob sessão autenticada e assinado para ID do usuário, produto, modalidade, e-mail e prazo do pedido; e-mail idêntico ao cadastro existente, ativo; moeda BRL; total positivo; produto A com modalidade permitida. **Não liberar com apenas e-mail coincidente.** Sem conta correspondente, retorna HTTP 409 (entrega pendente, nunca finge sucesso). Resposta HTTP 200 `{"accepted":true}` apenas depois da transação SQL persistida. Eventos repetidos são seguros; IDs conflitantes são rejeitados.

O vínculo da compra é com o **ID canônico do aluno que iniciou o checkout em sessão autenticada**, confirmado por um ticket assinado pelo Hub. O e-mail ainda deve corresponder à conta Hub, mas não é prova suficiente de titularidade. **Não há exigência de código enviado por e-mail (OTP)**: foi explicitamente descartada. O Hub valida o ID de conta do ticket, o e-mail cadastrado, o estado ativo, o produto e modalidade publicados, a criação do pedido dentro dos 20 minutos válidos do ticket e o evento HMAC vindo da central financeira. O cadastro público de alunos está **ativo por padrão**; `HUB_OPEN_REGISTRATION=0` permite ao administrador voltar ao regime por convites. Nenhum aluno recebe acesso pago apenas por informar um e-mail. O cadastro público de alunos pode ser habilitado sem OTP porque o e-mail sozinho nunca concede acesso financeiro; a conta que inicia o checkout é a destinatária da compra. Compra com e-mail distinto do cadastrado na conta que iniciou o checkout é rejeitada para entrega, nunca redirecionada a outra conta.

## 3. Conectar os dois serviços (somente quando for ativar)

1. Gere um segredo aleatório diferente de todos os segredos do Asaas, Admin ou outros produtos, de no mínimo 32 caracteres. Salve-o **somente** nos ambientes privados.
2. Hub Cloudflare: Secret `HUB_ARTISYS_CONNECTOR_SECRET` no Worker/DO. Hub Node: variável `HUB_ARTISYS_CONNECTOR_SECRET` no servidor. Não usar `VITE_*` para esse valor.
3. Pagamento ArtiSys: Secret `PRODUCT_CONNECTORS_JSON` com objeto indexado por cada `productId` da tabela; os 8 produtos podem apontar para a mesma URL HTTPS do Hub e o mesmo segredo do Hub, sem conceder permissão sobre os outros produtos. **Faça merge do JSON existente, jamais sobrescreva configurações dos quatro sistemas e DevKits.**
4. Configure `CONNECTOR_ALLOWED_ORIGINS` do Pagamento ArtiSys para incluir a origem HTTPS do Hub, preservando as origens existentes. O gateway recusa conector fora da lista.
5. Publique oferta no Pagamento ArtiSys somente depois de concluir a migração de conteúdo privado, QA e homologação. Ative `PAYMENTS_ENABLED=true` no gateway **somente** quando a cobrança estiver preparada. Defina preços, tributos, reembolso e prazo contratual da compra individual.
6. Vitrine Hub (variáveis **públicas** de build): `VITE_ARTISYS_PAYMENTS_URL=https://pagamentos-artisys-central.nutricionistaalmeidavh.workers.dev` (ou domínio HTTPS oficial configurado) e `VITE_ARTISYS_CHECKOUT_ENABLED=true`. Sem essa flag, não existem botões de compra nem acesso ao gateway.
7. Teste com conta A (comprador) e conta B (sem acesso), inclusive tentativa de entregar pelo mesmo e-mail sem ticket, compra iniciada por A com e-mail de B, replay, estorno, revogação de curso, renovação, expiração e entrega fora de ordem; depois valide sessão do comprador, redirecionamento, HTTPS e logs sanitizados em produção. Não criar fluxo de verificação de e-mail por código.

**Formato ilustrativo**, a preencher manualmente e mesclar no JSON já existente, sem colocar segredo em Git:

```json
{
  "hubestudos-course-trilha-aplicacoes-cloud-ia": {
    "url": "https://SEU-HUB/api/integrations/artisys/fulfillment",
    "secret": "<SEGREDO_PRIVADO_COMPARTILHADO_APENAS_COM_HUB>"
  },
  "hubestudos-subscription": {
    "url": "https://SEU-HUB/api/integrations/artisys/fulfillment",
    "secret": "<MESMO_SEGREDO_PRIVADO_DO_HUB>"
  }
}
```

Repita o mesmo apontamento para os outros 6 IDs de produto publicados. Nunca usar valores ilustrativos em produção.

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
npm run test:buyer-intent
npm run test:artisys-billing
npm run test:course-access
npm run build
```

O build passa a exigir os testes de HMAC/Node e preservação de grants. Verifique também o QA do Cloudflare Worker e faça homologação real do conector antes de publicar.

**Bloqueio importante:** o repositório de conteúdos do Hub ainda é **público**; uma autorização HTTP não torna exclusivos os arquivos publicados no GitHub. Para comercializar conteúdo restrito, migre os assets educacionais para repositório/storage privado e faça QA do acesso direto antes de habilitar checkout.

Referência do contrato: `pagamentos-artisys/docs/INTEGRACAO.md`. Não transportar chaves do gateway para o Hub; apenas o segredo específico HMAC do conector.

## Compra vinculada sem OTP (PR ArtiSys Pagamentos #24)

A interface do Hub executa `POST /api/billing/purchase-intent` **autenticado**, enviando apenas `productId` e `saleType`. O Hub devolve `buyerBinding` HMAC assinado (validade de **20 minutos para CRIAR o pedido**), codificado sem expor a chave privada. A UI navega para `/comprar?oferta=ID&buyer=...` na central existente. A central guarda o ticket em `order_buyer_bindings`, associando-o ao pedido; o envio ao Hub é assinado pelo HMAC do conector e inclui `orderCreatedAt`. O Hub confere o MAC interno do ticket e ID da conta, jamais confia em `userId` declarado pelo navegador. A assinatura pode renovar meses depois porque a janela do ticket se aplica à **criação do pedido**, não à entrega/renovação.

Os DevKits e demais produtos não usam `buyerBinding` e seus payloads permanecem idênticos. Sem ticket, a oferta Hub falha antes de cobrar. Nenhum código enviado ao e-mail é necessário; o acesso pago é entregue somente à conta autenticada que iniciou a operação.
