# Meu Gestor v1.0 — entrega final local

Capstone do módulo 8. Node 24+ / React / SQLite, apenas uso didático local e dados fictícios. Sem login, TLS ou autorização: **não exponha à internet** e não utilize dados reais.

```sh
npm install --no-audit --no-fund
npm run test
npm run build
npm run start:local
```

Abra `http://127.0.0.1:4173`; confira `/api/health`. O banco local fica em `./data/meu-gestor.sqlite`.

Backup e restauração em **destinos novos**, com integridade e chaves estrangeiras:

```sh
npm run backup -- ./data/meu-gestor.sqlite ./backups/copia.sqlite
npm run restore -- ./backups/copia.sqlite ./backups/restaurado.sqlite
```

Restaure apenas em arquivo separado; nunca sobrescreva o banco em uso. Para comparar, pare o servidor e inicie `DB_FILE=./backups/restaurado.sqlite npm run start:local` (shell POSIX), depois consulte OS e clientes.

Apresente: problema, cadastro válido, erro 409 em cliente vinculado, reinício com persistência, build, testes, backup e limite de segurança. Assistentes ChatGPT/Claude pelo navegador são opcionais; Ollama é facultativo conforme hardware. Nenhum serviço pago é necessário.
