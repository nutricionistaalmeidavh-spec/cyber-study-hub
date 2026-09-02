# Scanner Defensivo V4.0.0

Projeto didático para reconhecimento HTTP de **localhost e hosts explicitamente autorizados**.

## O que faz
- valida `scope.json` com Zod;
- fila e deduplicação de URLs;
- timeout e atraso entre requisições;
- crawler de links HTML com Cheerio;
- coleta status, headers, cookies, redirects, content-type e tempo;
- fingerprinting e extração de versões aparentes;
- correlação **didática** com uma base local de CVEs;
- findings com `INFO/POSSÍVEL/CONFIRMADO` (a V4 não confirma CVE só por versão);
- relatórios JSON e HTML.

## O que não faz
Não inclui brute force, exploração ativa automática, payloads ofensivos nem varredura irrestrita da internet.

## Instalação
```powershell
npm install
npm start
```

## Configuração
Edite `config/scope.json`. Por padrão, somente `localhost` e `127.0.0.1` são aceitos.

Para testar um servidor online seu ou autorizado, adicione **explicitamente** o hostname em `allowedHosts` e em `targets`.

## Estrutura
- `core/`: escopo, HTTP, fila e logs
- `discovery/`: links e parâmetros
- `checks/`: headers, cookies, fingerprint, versões e correlação
- `knowledge/`: base local didática
- `reports/`: relatórios gerados
