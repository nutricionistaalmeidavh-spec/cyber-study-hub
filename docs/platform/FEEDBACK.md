# HubEstudos — Central de Feedback (P0 + P1)

## Experiência do aluno
- Em qualquer área autenticada do Hub: **Enviar feedback**. Nas aulas, **Reportar problema nesta aula**.
- O formulário associa o relato à tela/aula atual, categoria, resumo, descrição e captura de tela opcional.
- Capturas raster (JPEG/PNG/WebP) são redimensionadas e recodificadas no navegador, removendo metadados. Tamanho codificado máximo: 220 KB; arquivos originais até 8 MB.
- **Minha conta → Meus feedbacks** ou menu lateral **Meus feedbacks**: lista, situação, marcação de nova atualização, conversa e histórico.
- Em falha de rede, conteúdo do formulário continua no modal; reenvio usa o mesmo nonce e não duplica o registro.

## Administração
- Rota SPA: \`#admin/feedback\`; entrada direta: \`/admin/feedback\` (com fallback da SPA).
- Visível apenas para administradores; endpoint \`GET /api/admin/feedback\` exige perfil admin.
- Filtro por situação, paginação 30/vez, alteração de situação e prioridade, respostas aos alunos e visualização protegida de anexo.
- Situações: novo, em análise, planejado, resolvido, encerrado. Prioridades: baixa, normal, alta, crítica.
- Respostas e transições permanecem registradas. Alunos somente veem relatos próprios.

## Infraestrutura e custo
A API usa a instância de SQLite já mantida pela autenticação do Cloudflare Durable Objects e, no modo self-hosted, o \`server/platform.mjs\` (Node.js + SQLite). Não requer R2, D1, provedores de e-mail, IA, analytics ou serviços externos; implantação sujeita às cotas gratuitas Cloudflare. Os dados permanecem no SQLite configurado pelo operador.

Novas tabelas idempotentes: \`feedback_reports\`, \`feedback_messages\`, \`feedback_events\`. Não altera a sessão, o cadastro, as chaves de progresso ou o esquema preexistente.

## Segurança
- Autenticação obrigatória; acesso por autor ou administrador, exceto lista geral e mudança de status/prioridade (admin).
- Verificação de origin para POST/PATCH herdada do backend atual; cookie de sessão HttpOnly SameSite=Lax.
- Validação server-side, limites de 10 relatos/hora e 20 mensagens/hora por usuário, SQL parametrizado, anexos não enviados em listagens.
- Conteúdo exibido como texto em React; imagens somente de tipos raster permitidos.
- Fotos e descrições podem conter dados pessoais: evite incluí-los; defina política de retenção e atendimento de solicitações de exclusão antes de uso comercial em escala.

## QA
\`\`\`sh
npm run test:platform
npm run build
npm run test:worker
\`\`\`
Execute QA manual desktop e mobile com aluno e administrador reais, incluindo navegação por teclado, envio offline/falha de rede, retorno a aula, visualização de anexo, resposta/status e acesso negado entre dois alunos.

Notificações são **internas por indicador de nova atualização em Meus feedbacks**. Não há e-mail/push; a página precisa ser aberta para visualizar a novidade.
