# Meu Gestor v0.2 — interfaces acessíveis

Checkpoint do módulo 4. **Dados demonstrativos somente**, sem CRUD ou persistência.

## Executar

```sh
cd checkpoints/v0.2
npm install --no-audit --no-fund
npm run dev
npm run build
```

Abra a URL `localhost` exibida pelo terminal, não o index.html diretamente. O projeto não exige API nem nuvem paga.

## Investigar

1. Navegue Visão geral → Clientes → Serviços por Tab + Enter e com mouse.
2. Compare total de ordens e concluídos com o array em `src/demo.ts`.
3. Modifique um estado fictício de pendente para concluído e veja o contador atualizar.
4. Use viewport 360 px e zoom de 200%; anote quebra de layout e foco.
5. Defina temporariamente `clients=[]` e `orders=[]` em `src/demo.ts` (ajuste os tipos, mantenha os exports) e confira estados vazios. Restaure a fixture.

### O que NÃO esperar

Não há formulário funcional. A ausência de backend ou banco é intencional; não descreva a tela como sistema persistente. Erros de TypeScript ou ESLint não devem ser ignorados. 
