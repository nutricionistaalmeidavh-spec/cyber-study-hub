# Meu Gestor v0.3 — CRUD local, regras e testes

Checkpoint do módulo 5. **Todas as entradas e os dados são fictícios e temporários.** Não possui persistência em banco, autenticação, pagamentos ou API externa.

## Executar

```sh
cd checkpoints/v0.3
npm install --no-audit --no-fund
npm run dev
npm run test
npm run build
```

Requer Node 24+ para executar nativamente os testes de domínio escritos em TypeScript. No navegador, abra a URL localhost exibida pelo Vite. Não execute index.html como arquivo local.

## Caminho do laboratório

1. Crie cliente fictício e OS associada; observe a OS iniciar pendente.
2. Tente uma descrição vazia e confirme erro, sem alterar número de ordens.
3. Conclua a OS-002 em duas ações. Confirme que concluídos vai de 1 para 2; um terceiro avanço não deve estar disponível.
4. Tente excluir o cliente C-001, que possui OS; a operação deve ser bloqueada.
5. Busque por Cliente Exemplo B, filtre estado pendente e confirme que os totais gerais não diminuem.
6. Edite e exclua uma OS pela ID, não pela posição no filtro. Recarregue o navegador: dados retornam às fixtures.

## Critério técnico

Os testes em `tests/domain.test.mjs` cobrem sucessos, entradas inválidas, conclusão repetida, integridade referencial e imutabilidade. Não são prova de segurança em produção: a próxima evolução exigirá backend com validação independente e SQLite.

## IA sem custo obrigatório

Pode usar ChatGPT ou Claude no navegador para discutir **uma função por vez** e conferir diffs. IA local com Ollama é facultativa conforme hardware. A execução local do app não depende de nenhum dos assistentes.
