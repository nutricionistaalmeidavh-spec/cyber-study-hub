---
version: alpha
colors:
  background: "#07111f"
  surface: "#0d1d2d"
  elevated: "#102438"
  border: "#1b3650"
  foreground: "#ecf7ff"
  muted: "#8ea7bb"
  primary: "#19d3bd"
  secondary: "#8b5cf6"
  warning: "#f0b557"
  danger: "#ff758a"
typography:
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
rounded:
  panel: "22px"
  control: "13px"
omitted:
  - section: spacing
    reason: "Existing styles.css owns component spacing without a global spacing token scale."
  - section: components
    reason: "Shared CSS classes are the existing component recipes, not a separate tokenized UI framework."
---

# Cyber Study Hub — Design

## Overview

Study workspace for Brazilian learners and instructors on mobile PWA and desktop. North star: answer where I am, what to study now and how to get back. The experience is a study tool, never a marketing landing page. Preserve the established midnight navy and teal identity.

## Colors

The runtime variables in src/styles.css are canonical. This document mirrors those values (ownership model B). Use teal for primary actions, activity progress and keyboard focus; purple is an accent, not a completion state. Every count and progress bar requires a corresponding textual explanation. A total of 543 catalog items never means 543 interactive completions are available.

## Typography

Inter/system stack with restrained editorial headings, short Portuguese labels and descriptive action verbs. Avoid generic advertising copy or unexplained technical jargon in navigation.

## Layout

Desktop uses the existing sidebar and centered reading region. Mobile has six consistent destinations with safe-area-aware bottom navigation, readable labels and enough document padding to reach the final line without obstruction. Main tasks are reachable above the fold; very long library lists load progressively in batches of 24.

## Elevation & Depth

One emphasized next-lesson card, neutral stats, understated navigation cards, limited gradients and quiet shadows. Do not invent celebratory states.

## Shapes

Panels between 18px and 25px, controls between 13px and 16px. Preserve the existing button and panel vocabulary.

## Components

Dashboard owns recommendation and catalog entry points. CurriculumBrowser owns filters, list browsing and parallel track activation. PlatformGate and accountStorage exclusively own identity, session and synchronized progress. Do not duplicate any of them.

## Do's and Don'ts

Do present Aula 001 as the beginner entry and use account-owned progress for returning users. Do maintain real deep links and accessible keyboard focus. Do not hardcode Aula 43 for new learners or misrepresent Markdown-only lessons as completed. Do not change private API contracts for a visual improvement.

## ArtiSys Editorial — aula e leitura (2026-10-14)

Scoped lesson-only design tokens live in `src/components/lesson-editorial.css`, imported after `src/styles.css`. Brand references: dark `#0a0716`, purple `#7037ad`, violet `#8745f7` and lilac `#f0eaf8`. Outfit is a preferred local font with system fallback; there are no hosted-font/API dependencies.

The learning surface (native V2, legacy, Markdown and AI development trail) uses dark hero/problem/mechanism/lab/review chapters and light text-heavy reading/practice chapters. Markdown groups content into semantic chapters at H1/H2 boundaries; dark treatments follow subject terms rather than arbitrary even/odd position. Dark code snippets retain syntax legibility even inside light reading chapters. All inputs, links, completion state, quizzes and deep links remain functional and keyboard-focused. The shell, navigation, catalog, account and API are not part of this visual change.

The **core is R$ 0, open source and self-hostable**; free third-party services or paid AI may only be identified as optional, never as silent dependencies.

## ArtiSys Hub — navegação editorial (branch `feat/artisys-hub-editorial-navigation-20261014`)

As áreas **Início**, **Aulas** (catálogo de módulos e sumário), **Materiais** e **Jogos** usam a folha `src/components/hub-editorial.css`, importada após `lesson-editorial.css`. O shell da plataforma continua escuro, agora com destaques violeta/roxo, enquanto cards de navegação e listagens recebem papel claro de alto contraste. Não alterar os componentes de autenticação, Workers, API, dados do catálogo, cache de conteúdo, persistência de progresso ou controle de acesso para aplicar esta identidade.

Hierarquia de navegação:
- Início mostra a aula recomendada, depois a escolha entre formação principal/trilhas/revisão e em seguida indicadores reais.
- Aulas mostra **módulos primeiro**; somente o módulo selecionado mostra a lista compacta de aulas e seus tipos reais (leitura/interativa).
- Jogos dá destaque aos quatro tipos de treino, filtra a lista por formato e trilha sem criar dados de progresso artificiais.
- Materiais reúne categorias com contagem baseada em `src/data/materials.ts` e arquivos reais acessíveis pelas rotas originais. A origem do Drive fica em painel recolhível.

Fontes preferenciais são locais com fallback de sistema; sem fontes remotas, novas bibliotecas, integrações comerciais ou dependências pagas. Deploy de produção permanece exclusivamente **Cloudflare Workers**, por meio de `wrangler.toml` e `npm run deploy`.


## Study continuity and Academy identity (2026-10-14)

`study-experience.css` is the final scoped refinement layer. AcademyBrand is shared by the landing, sign-in and workspace. Public course/catalog content and authentication contracts remain unchanged.

Section links retain the route (`#lesson/47?section=v2-lab`). Reading pages use a compact single title and a contextual outline, collapsed initially on narrow screens. Reading registration is reversible and is distinct from practical/assessment completion.

Study visits and AI step drafts extend entries in the existing account-owned `cyber-study-learning-v2` state, preserving legacy flags and quiz history. Parallel entries use `parallel:<code>`; AI uses `ai-dev`. Numeric-only consumers must ignore these namespaced entries. Old AI local notes are preserved and imported without overwriting account notes. Sync feedback reports local pending changes and confirms only completed server synchronization.
