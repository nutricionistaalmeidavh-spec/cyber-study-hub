# Cyber Study Hub — plataforma multiusuário (self-hosted)

## Funcionalidades
- Login com senha, sessão HttpOnly, cookies SameSite=Lax e Secure em HTTPS.
- Bootstrap do primeiro administrador com chave definida no servidor.
- Convites de uso único (48h) e cadastro público desativado por padrão.
- Perfis: aluno, instrutor e administrador; gestão de contas reservada ao admin.
- Suspensão revoga as sessões do usuário.
- Nome, troca de senha e invalidação de sessões antigas.
- Progresso por usuário em SQLite, sincronizado por chaves e com fila local persistente em caso de falha de rede.
- Importação opcional, não destrutiva, de progresso legado.

Não há dependência de serviço de autenticação pago, SDK de terceiros nem API de IA. Núcleo R$ 0 com Node.js 22.16+ e SQLite nativo.

## Instalação local
1. Instale Node.js 22.16+.
2. Execute npm ci e npm run build.
3. Gere uma chave aleatória longa (exemplo: openssl rand -hex 32). Não coloque a chave em Git ou no frontend.
4. Configure variáveis de ambiente para o servidor. Exemplo Linux/macOS:

    HUB_ORIGIN=http://localhost:8788 HUB_BOOTSTRAP_KEY='SUA_CHAVE_ALEATORIA' npm start

5. Acesse http://localhost:8788 e configure o primeiro administrador. Depois disso, o bootstrap fecha.
6. Como administrador, abra Usuários para gerar convites e compartilhá-los com o destinatário.

Padrões: PORT=8788, HUB_DATA_DIR=./.hub-data. O diretório contém a base SQLite, protegida pelo .gitignore.

### Desenvolvimento com Vite
Terminal 1:

    HUB_ORIGIN=http://localhost:5173 HUB_BOOTSTRAP_KEY='SUA_CHAVE_ALEATORIA' npm run dev:api

Terminal 2:

    npm run dev

Acesse http://localhost:5173. Vite encaminha /api à porta 8788. A variável HUB_ORIGIN precisa corresponder exatamente à origem do navegador, incluindo a porta.

### Produção
- Utilize HTTPS com proxy reverso terminando TLS, enviando requisições ao Node. Defina HUB_ORIGIN=https://seudominio.
- Nunca exponha SQLite diretamente. Faça backup consistente do banco e do WAL.
- HUB_OPEN_REGISTRATION=1 habilita cadastro público opcional. O padrão é desligado.
- O instrutor já tem identidade própria, mas ainda não possui área exclusiva para criar conteúdo.
- Envio de e-mail, MFA e recuperação autônoma de senha são extensões futuras; convites são compartilhados manualmente.
- A API reconhece o usuário pelo cookie validado no servidor, não por userId fornecido pelo cliente.

## Migração e isolamento de progresso
O estado anterior ao login (chaves cyber-study-*) não é associado automaticamente a qualquer usuário. A opção Minha conta > Importar progresso antigo só deve ser usada pelo dono dos dados; ela substitui os registros correspondentes na conta escolhida e não remove os dados antigos.

O cache novo usa chaves por conta, separadas por ID. O banco usa user_state(user_id,key,value). A fila local de gravações offline é preservada e reenviada depois; o logout é bloqueado se ainda houver dados pendentes. Se o mesmo aluno editar em dois dispositivos ao mesmo tempo, prevalece a gravação mais recente recebida pelo servidor.

## Bloqueio de publicação no Cloudflare atual
A aplicação em produção está configurada apenas como Cloudflare Workers Static Assets. O deploy existente não tem backend Node nem rota /api/*.

**Não mergear esta branch diretamente na main atual**: o login passaria a depender de rotas que não existem no Worker estático. Antes de publicar, configurar uma rota /api/* no mesmo domínio para o servidor Node self-hosted, ou desenvolver, provisionar e testar um backend opcional específico para Cloudflare. Manter intactas as rotas existentes.

Os materiais e aulas estáticos sob /course-library e /materials continuam públicos. Esta etapa fornece contas e progresso individual; não constitui bloqueio pago de conteúdo nem autorização por assinatura. Conteúdo privado futuro exige proteção no servidor e auditoria do cache e do service worker.

## Testes
- npm run test:platform: integração HTTP de login, bootstrap, convites, RBAC, isolamento e estado SQLite.
- npm run build: testes de currículo e qualidade já presentes no projeto.
- CI do PR: Node.js 22 executando os dois comandos.
- QA manual necessário: primeiro acesso, cadastro por convite, login, logout, suspensão, troca de senha, convite usado, teste de dois navegadores e sincronização offline.
