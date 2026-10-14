# Meu Gestor v0.4 — SQLite com API local

**Projeto didático do módulo 6:** dados fictícios persistem em SQLite, sem serviços pagos, APIs externas ou IA obrigatória.

## Pré-requisitos

Node.js 24+ e npm (livres), editor opcional VSCodium. A primeira instalação de dependências open source requer internet.

\`\`\`sh
cd public/course-labs/ai-dev-meu-gestor/checkpoints/v0.4
npm install --no-audit --no-fund
npm run test
npm run build
\`\`\`

Em um terminal execute \`npm run dev:api\` (servidor HTTP/SQLite em 127.0.0.1:4173). Em outro execute \`npm run dev\` (frontend Vite em 127.0.0.1:5173, com proxy de /api). Use a URL exibida pelo Vite. Para a versão compilada, abra 127.0.0.1:4173 com a API ligada. O arquivo do banco é \`data/meu-gestor.sqlite\`.

## Exercício

1. Consulte \`/api/health\`, \`/api/clients\`, \`/api/orders\`. Compare as três ordens fictícias.
2. Cadastre cliente fictício e OS; ordem começa pendente.
3. Faça pedido inválido com cliente C-999 e serviço vazio: 422; cliente com OS não pode ser excluído: 409.
4. Conclua OS-002 duas vezes; a terceira operação não altera o número de concluídas.
5. Pare/reinicie a API e confirme o mesmo cliente/OS no SQLite; consulte os resultados de \`npm run test\`.

**Limitações:** apenas 127.0.0.1, sem login multiusuário/TLS e sem segurança para acesso pela internet. Não armazene dados reais ou abra a porta para redes externas. ChatGPT/Claude pelo navegador são apoio opcional; Ollama somente se o hardware comportar. Todo o laboratório funciona sem IA.
