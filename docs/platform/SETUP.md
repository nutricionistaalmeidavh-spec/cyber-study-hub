# Cyber Study Hub — plataforma de contas

Esta implementação cria contas, sessões, convites, permissões e progresso individual, preservando as 543 unidades do catálogo.

## Produção: Cloudflare Workers e Durable Objects SQLite

A implantação principal agora usa **o mesmo Cloudflare Worker** para frontend e API. O arquivo wrangler.toml declara main=src/worker/index.mjs, assets=dist, run_worker_first para /api/* e a classe Durable Object HubAuthObject com SQLite persistente.

**Nenhum backend Node separado ou provisionamento de D1 é necessário.** O Wrangler cria o namespace Durable Objects SQLite no primeiro deploy. O comando de publicação continua npm run deploy, já configurado no package.json e no fluxo existente do GitHub.

Durable Objects SQLite está disponível no plano Cloudflare Workers Free (sujeito às cotas gratuitas; ao exceder, operações podem falhar). O servidor Node com SQLite permanece como alternativa 100% self-hosted e open source.

## Chave de instalação obrigatória

Antes de integrar e publicar esta branch, configure no Worker cyber-study-hub um secret de nome HUB_BOOTSTRAP_KEY, com valor aleatório longo (exemplo de geração local: openssl rand -hex 32).

No painel Cloudflare: Workers & Pages > cyber-study-hub > Settings > Variables and Secrets > Add > Secret.

Nunca coloque esse valor no Git, no wrangler.toml, na página web ou nesta conversa. O wrangler.toml declara o secret como obrigatório: se estiver ausente, o deploy deve recusar a publicação em vez de colocar no ar um login impossível de inicializar. O comando wrangler secret put pode publicar uma versão imediatamente; prefira configurar com o cuidado adequado antes do merge.

Depois que o secret existir e os testes passarem, o merge para a main seguirá o deploy automático que já existe. No primeiro acesso, use a chave para cadastrar o administrador inicial. O bootstrap é de uso único. Depois, acesse Usuários para gerar convites de aluno, instrutor ou administrador.

O cadastro público é desativado por padrão. Convites são válidos por 48 horas.

## Validação

- npm run test:platform: teste do backend Node e SQLite.
- npm run build: integridade das aulas, qualidade editorial, tipos e frontend.
- npx wrangler deploy --dry-run: valida bundling do Worker, sem publicar.
- npm run test:worker: executa um Worker local real com Durable Objects SQLite e testa autenticação, convite, isolamento do progresso, suspensão, logout e entrega do frontend.
- O service worker não intercepta nem guarda respostas da API e remove o cache antigo.

Testes locais e dry-run não substituem QA no domínio publicado. Antes da troca definitiva, validar login, cookies Secure, dois usuários, sincronização e administração em ambiente real.

## Alternativa self-hosted gratuita (sem Cloudflare)

O backend portátil em server/platform.mjs e server/start.mjs funciona com Node.js 22.16+ e SQLite nativo, sem serviços externos.

Exemplo Linux/macOS:

    npm ci
    npm run build
    HUB_ORIGIN=http://localhost:8788 HUB_BOOTSTRAP_KEY='CHAVE_ALEATORIA_FORTE' npm start

Acesse http://localhost:8788. O banco local fica em .hub-data/platform.sqlite e não entra no Git. Para produção própria, use HTTPS com proxy reverso, backups consistentes e isolamento do armazenamento.

## Regras e limitações

- Aluno, instrutor, administrador; apenas administrador gerencia usuários, convites e suspensão.
- Senhas PBKDF2-SHA256 com salt, sessão aleatória HttpOnly SameSite=Lax e Secure em HTTPS.
- Progresso e jogos isolados por conta. O aluno precisa confirmar manualmente a importação do progresso antigo.
- Alterações offline aguardam sincronização em fila local; não é permitido logout com envios pendentes.
- Recuperação de senha por e-mail: link aleatório de uso único, expira em 30 minutos; troca preserva ID/permissões/progresso e revoga todas as sessões. MFA e painel exclusivo de instrutor permanecem fora deste escopo.
- URLs públicas de aulas e PDFs continuam públicas: não foi criado controle de assinatura nem paywall.
- Não há dependência de serviço de IA ou autenticação pago. O núcleo self-hosted permanece gratuito e aberto.

## Recuperação de senha por e-mail (configuração explícita)

### Cloudflare (Email Sending — opção paga)

Esta branch habilita o binding `EMAIL` e declara o remetente `academy@artisys.dev` em `wrangler.toml`.
A entrega a qualquer aluno exige **Cloudflare Workers Paid**, domínio `artisys.dev` onboarded no **Compute > Email Service > Email Sending**, e DNS de autenticação (SPF/DKIM/DMARC) que o painel orienta. Não basta criar uma variável: sem onboarding, a Cloudflare rejeita mensagens. Confirme o remetente e faça um envio real antes de disponibilizar publicamente. Não há chave de API ou serviço adicional de terceiros. A opção não é requisito para rodar a plataforma self-hosted.

### Self-hosted, núcleo gratuito / open source

Defina `HUB_EMAIL_FROM=academy@seudominio.org` e instale/configure um MTA local open source com interface sendmail (ex.: Postfix). Opcionalmente defina `HUB_SENDMAIL_PATH=/caminho/absoluto/do/sendmail` (padrão: `/usr/sbin/sendmail`). O envio ocorre por `sendmail -t -i` via stdin, sem shell ou execução de payload de entrada. É necessário configurar DNS/autenticação e reputação do remetente para entregar a caixas externas. Sem transporte, a API devolve 503 e não emite links falsos.

### Rotas e segurança

- `POST /api/auth/password/forgot`: recebe `{email}`, responde genericamente para e-mails existentes/inexistentes, limita requisições por IP e endereço. O token nunca é retornado por API.
- `POST /api/auth/password/reset`: recebe `{token,newPassword}`, valida 12 a 128 caracteres, expiração e consumo atômico; remove sessões e outros tokens da conta.
- Página `/academy/study?reset=...` recebe o token pelo e-mail, com `Referrer-Policy` desativada por metatag e limpeza da URL após uso.
- O backend salva apenas SHA-256 do token, não o token em claro. O e-mail só é gerado para contas ativas. A conta administrativa mantém o mesmo ID e o histórico.
- Em falha de envio real, a API mantém resposta uniforme para evitar enumeração de contas e registra erro técnico sem imprimir token ou e-mail. Monitore logs e teste entregabilidade.
