# Cadastro público de alunos — HubEstudos

## Política implementada

O HubEstudos abre a inscrição de estudantes sem convite por padrão em Node/SQLite e Cloudflare/Durable Object. Esta política **não** libera cursos pagos automaticamente, não envia nem exige código por e-mail, e não permite criar professor ou administrador via formulário público.

- Após a configuração do primeiro administrador (bootstrap one-time), o estudante acessa `/?register=1` ou o botão **Criar minha conta** em `/academy`.
- Informa nome, e-mail e senha (mínimo 12 caracteres); obtém sessão individual e progresso isolado.
- Requisições públicas ignoram `role` ou `status` enviados pelo navegador; perfil criado é sempre `student`.
- Professor/administrador seguem disponíveis **exclusivamente** por convite gerado por conta administradora, com papel definido no servidor e token de uso único.
- O registro público permite 10 tentativas por IP por janela de 15 minutos, tanto em Node quanto em Cloudflare, com persistência SQLite.
- O endpoint `/api/auth/config` informa `openRegistration: true` por padrão, permitindo à UI exibir a opção sem lógica de pagamento.
- Para retornar ao cadastro somente por convite, configure `HUB_OPEN_REGISTRATION=0` (Node) ou variável de Worker equivalente. `HUB_OPEN_REGISTRATION=1` e `true` mantém aberto. Valores inválidos **não** abrem o cadastro.
- As rotas administrativas e os controles de origem/CSRF continuam com as mesmas restrições; bootstrap continua requerendo `HUB_BOOTSTRAP_KEY`.

## Vínculo com ArtiSys Pagamentos

Esta entrega não ativa cobrança e **não exige OTP por e-mail**. A integração comercial ainda está em PR separada (PR #62).

**Atenção:** um cadastro público sem comprovação de propriedade do e-mail não prova identidade; portanto **não é seguro ativar concessões financeiras exclusivamente pela coincidência de e-mail**. Antes de habilitar o checkout público e fazer merge da integração financeira, use uma vinculação criptográfica do **pedido iniciado em sessão autenticada** ao ID canônico da conta; o gateway deve conservar e assinar essa vinculação até o evento de entrega. O e-mail segue como contato, não como prova suficiente de titularidade. Isso pode ser feito sem códigos enviados por e-mail.

O aluno pode criar uma conta agora, mas continua vendo apenas os conteúdos liberados por administradores e os cursos com grants válidos.

## Testes

```sh
npm run test:public-signup
npm run test:platform
npm run build
```

Casos: inscrição sem convite, elevacão de papel forjada, bootstrap independente, convites de staff, isolamento de dados e limitação por IP. Os testes não dependem de provedores pagos, secret de gateway ou envio de e-mail.
