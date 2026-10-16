# Lista de espera da ArtiSys Academy (HubEstudos)

## Como usar

- Página pública: `/academy#lista-de-espera`.
- Formulário pede nome, e-mail, **ID canônico do curso** e consentimento de contato.
- `academy` é o escopo canônico para quem quer novidades da Academy sem escolher uma formação específica; cursos selecionados usam os IDs reais de `src/curriculum/courses.json`.
- O mesmo e-mail só ocupa um registro por curso (idempotência), mas pode se interessar por cursos diferentes.
- Após cadastrar, o visitante recebe confirmação **na própria página**. Não há disparo de e-mail automático ou promessa de prazo.
- Admin autenticado consulta `/#admin/waitlist`, filtra por curso, exporta CSV (com proteção contra injeção de fórmulas) e exclui registros.
- O formulário não cria usuário, matrícula, convite, assinatura, pagamento nem concessão de acesso. Cadastro real continua em `/?register=1`.

## API

- `POST /api/waitlist` (público, mesma origem): `{ "name":"...", "email":"...", "courseId":"desenvolvimento-com-ia", "consent":true, "website":"" }`. Retorna `201` no novo registro ou `200` em inscrições repetidas.
- `GET /api/admin/waitlist?courseId=&limit=100&offset=0` somente para administradores; lista inscrições, consentimento e contagem.
- `DELETE /api/admin/waitlist/{uuid}` somente para administradores; remoção permanente daquele registro.
- Tabela `waitlist_entries` criada sob demanda na inicialização, com índice e unicidade `(course_id,email)`; **mesmo contrato** em Node/SQLite e Cloudflare Durable Objects/SQLite.
- Proteções: validação de entrada no servidor, campo honeypot, limite de 10 tentativas por IP/15 minutos, checagem de `Origin` em POST/DELETE, leitura administrativa autorizada no servidor.
- O sistema **não comprova titularidade do endereço de e-mail**. Nunca derive entitlements, cupons pessoais ou provas de compra a partir desta lista.

## Privacidade e operação

- Finalidade do aceite: contactar interessados sobre vagas e novidades dos cursos.
- Consentimento com data/hora armazenado na tabela; e-mail armazenado em minúsculas.
- A exclusão pode ser feita diretamente na área administrativa mediante solicitação do titular. Responsável pelo tratamento deve disponibilizar canal de contato e política de privacidade antes da divulgação pública.
- Exportações CSV contêm dados pessoais; proteja-os e apague cópias locais quando não forem mais necessárias.
- Sem serviço externo obrigatório, sem credenciais novas, sem cobrança e sem impacto nas rotas do ArtiSys Pagamentos.
- Avisos futuros podem ser feitos manualmente com a exportação CSV. O disparo automático de comunicações é uma **funcionalidade futura**, não foi ativado.

## Testar

```sh
npm run test:platform
npm run test:public-signup
npm run build
```

Os cenários específicos são cobertos por `server/waitlist.test.mjs`: inscrições sem conta, deduplicação, ID canônico, anti-spam, consentimento, isolamento das permissões, proteção contra origem externa, autorização administrativa e exclusão.
