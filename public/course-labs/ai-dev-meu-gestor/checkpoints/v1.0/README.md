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

## Extensões funcionais: P3 — acesso pela própria interface

Abra **Extensões (kits)** na navegação do Meu Gestor v1.0. Elas ficam dentro do mesmo React + API + SQLite; não são apenas links para outro repositório. A versão didática inclui:

| Kit | Onde funciona | O que é realmente entregue | O que continua opcional |
| --- | --- | --- | --- |
| Relatórios | UI → Exportar | CSV real com clientes e OS da base fictícia; neutraliza fórmulas | `utilidades/artisys-reporting` para agregações avançadas |
| PDF | UI → Ordem de serviço → Abrir | Página A4 preenchida com OS/cliente; navegador → Imprimir → Salvar como PDF | `utilidades/artisys-pdf` + pdfme para gerar PDF binário diretamente, conforme kit externo testado em CI |
| Financeiro | UI → Classificar lançamento | Valida centavos e categoria; mostra prévia sem gravar transação | `artisys-finance-domain` para fingerprints, regras e conciliação |
| Balança | UI → Simulador | Aceita `1,250 kg`, rejeita leituras inválidas | `artisys-serialport` e hardware real, após documentar protocolo da balança |
| Frontend | UI → Indicadores | Card mobile com contagens derivadas dos mesmos clientes e ordens | Kits privados `frontEnds`, somente com licença/acesso autorizado |
| QA/Scan | UI → Diagnóstico | Verificação real de integridade SQLite e chaves estrangeiras via API local | `artisysScan` para scans estáticos em checkout autorizado |

**Execução/avaliação:** Node 24+, `npm install`, `npm test`, `npm run build`, `npm run start:local`. As suítes `tests/extensions.test.mjs` validam CSV, PDF imprimível, financeiro, balança, endpoints e casos negativos. Os testes não afirmam que houve impressão física, homologação de balança ou execução automática do scanner.

**Segurança:** o servidor só escuta `127.0.0.1`; não aceita usuário autenticado, dados reais, tokens, pagamentos ou deploy público. A OS demonstrativa é intencionalmente fictícia. O documento de impressão usa escaping de HTML e `Cache-Control: no-store`; CSV sanitiza fórmulas. Extensões não mudam o schema nem criam pagamentos automáticos.

As implementações profissionais continuam nos [kits independentes](../../kits/README.md), onde estão as instruções para bibliotecas reais e ferramentas opcionais. Nenhuma API paga é exigida.
