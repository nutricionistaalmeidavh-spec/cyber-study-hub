# Meu Gestor v0.1 — primeiro React

Checkpoint **executável** para o módulo 3. É um projeto didático, não produto comercial.

## Requisitos

Node.js 24 ou versão LTS compatível, npm, editor gratuito (VSCodium recomendado) e navegador. Não precisa de GitHub, API de IA ou assinatura paga. npm baixa dependências abertas da internet na primeira instalação.

## Executar

```sh
cd checkpoints/v0.1
npm install --no-audit --no-fund
npm run dev
npm run build
```

Abra o endereço local exibido no terminal. **Não abra index.html diretamente no navegador**, pois os módulos TypeScript/React precisam ser processados pelo Vite. Se quiser trabalhar offline, instale as dependências previamente.

## Alteração exigida

1. Em src/App.tsx, substitua o título de um cartão.
2. Preveja o que mudará, execute e compare.
3. Rode `npm run build` e confira saída bem-sucedida.
4. Com Git instalado: `git init`, `git add .`, `git commit -m "feat: iniciar Meu Gestor"`. Configure nome/email do Git local se necessário.
5. Faça um erro controlado em JSX, observe que build falha e desfaça.

**Negativo:** não inclua node_modules, .env ou tokens em commits. Ainda não existe persistência, CRUD nem login.
