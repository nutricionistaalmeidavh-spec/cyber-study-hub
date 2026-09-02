# Cyber Study Hub

PWA mobile-first para estudo visual de cibersegurança. Inclui aulas 43–100, quizzes, flashcards, revisão local e quatro motores de jogos: cruzadinha, associação, ordenação e cenários.

## Stack

- React + TypeScript + Vite
- PWA com manifest + service worker
- Persistência local via `localStorage`
- Cloudflare Workers Static Assets

## Rodar localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

A saída é criada em `dist/`.

## Cloudflare

O projeto já inclui `wrangler.toml` com SPA fallback.

No Cloudflare Workers Builds, use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Production branch: `main`

Ou, em uma máquina autenticada no Wrangler:

```bash
npm run deploy
```

## Atualização pelo iSH no iPhone

Este ZIP foi preparado para ser cumulativo. Com o repositório clonado em `~/projetos/cyber-study-hub` e o script `atualizar-projeto` já instalado:

```sh
atualizar-projeto cyber-study-hub ~/updates/CyberStudyHub_v1.0.0.zip "feat: publica Cyber Study Hub v1.0.0"
```

O script sincroniza o ZIP, remove arquivos antigos ausentes na versão cumulativa, cria commit e faz push.

## Segurança

O conteúdo é educacional e defensivo. Práticas devem ocorrer apenas em ambientes próprios, de laboratório ou explicitamente autorizados.


## v1.1 — Conteúdo e Materiais
- Conteúdo técnico completo nas aulas 43–100 com fluxo, código e laboratório.
- Biblioteca de materiais incorporada a partir da pasta `Aulas de Ethical Hacking` do Google Drive.
- PDFs acessíveis em `/materials/*`.
- Navegação mobile com acesso direto a Materiais.
