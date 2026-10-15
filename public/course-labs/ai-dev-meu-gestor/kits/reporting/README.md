# Kit de relatórios — exportação CSV

**Origem:** [artisys-reporting](https://github.com/nutricionistaalmeidavh-spec/utilidades/tree/main/modules/artisys-reporting), versão **implemented 0.1.0**, DevKitTools **DKT-GEST-015** em preparação. A biblioteca já implementa `filterRows`, `groupBy`, `aggregate` e `toCsv`, mas **não fornece uma tela de relatórios pronta**.

1. Conclua Meu Gestor v0.3 (CRUD); para dados persistidos, use v0.4/v1.0.
2. Em uma cópia do projeto, instale o módulo com `npm install /caminho/utilidades/modules/artisys-reporting` (Node 22+).
3. Copie `rows.mjs` e `export-orders.mjs` para a pasta do consumidor. Execute `node reporting/export-orders.mjs ./ordens.csv`.
4. Substitua os dados fictícios somente após conectar o adaptador à resposta autorizada `GET /api/orders` e `GET /api/clients`.
5. Abra o CSV e compare registros e cabeçalhos. Teste `clientId` inexistente e fórmulas iniciadas com `=` para confirmar rejeição/neutralização.

**Entregável:** CSV de ordens de serviço e evidência de duas verificações. **Limite:** exportar linhas não equivale a contabilidade, conciliação ou validação de planilhas. A segurança de autorização depende do backend consumidor.
