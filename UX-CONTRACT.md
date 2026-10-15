# Hub UX contract — home and catalog

The canonical 218 main and 325 parallel entries come from src/curriculum/catalog.json. The interactive viewer uses src/data/lessons.ts plus src/content/registry.ts; Markdown-only units use the document viewer.

On first login, point learners to main lesson 001. For a returning learner, prefer a recent unfinished interactive item with recorded progress, then an unfinished interactive item if relevant. Never infer reading completion from opening a Markdown document.

Dashboard metrics state their actual denominators: total catalog items, supported interactive completions and due FSRS review cards. User progress always comes from the authenticated account via accountStorage, not anonymous browser state.

Catalog journey: first render the 17 canonical main modules (grouped by catalog.main.block) or 13 parallel subject modules (grouped by catalog.parallel.track), not a flat list of the canonical catalog units. Selecting a module uses #lessons?mode=...&module=... and reveals only its lessons. Existing deep links with track are interpreted as the corresponding module. Search on the module index matches both module names and lesson titles; inside a module it filters only its lessons. The first 24 results appear, with explicit load-more, result count and no-results recovery. Back-to-modules and browser history restore higher-level navigation without changing account state. The document viewer returns to the correct module. Parallel activity flags continue to be stored in curriculumState by original trackCode, including groups with more than one code.

Mobile navigation: six labeled and reachable routes on desktop and phone; native links and visible focus; safe area and bottom padding so content remains reachable. Account/admin security and all API routes are unchanged.

Source-of-truth map: visual tokens in src/styles.css; home in src/components/Dashboard.tsx with home.css; catalog in src/components/curriculum/CurriculumBrowser.tsx; authentication in PlatformGate and Worker; persisted learning state in src/lib.

Required QA: npm run build, test:hub-ux, platform auth regression and manual mobile/desktop check for first time, returning learner, empty searches, next 24, deep link to parallel and keyboard focus. Static QA alone does not establish WCAG compliance.

## Inventário ampliado de etapas (trilhas guiadas)

O **catálogo único `src/curriculum/catalog.json`** registra 607 IDs canônicos e imutáveis: 218 `AULA-XXX`, 325 códigos de trilhas paralelas e 64 `guided` (`DEV-IA-001…032` e `CANAL-IA-001…032`). Cada etapa guiada declara origem, módulo, `stepId` legado, `href` e tipo. As 16 etapas de referência possuem ID de navegação e de progresso próprio; 8 reutilizam unidades paralelas em `aliasOf`, mas **nunca as marcam como concluídas automaticamente**. O estado legado `getStudyDraft('ai-dev'/'channel-dark')` é mantido, e `syncCanonicalGuidedProgress` materializa o progresso individualizado por ID na MESMA chave autenticada `cyber-study-learning-v2`, sem remover notas, checklists nem mudar a API. Relatórios originais `status-543.*` continuam históricos; `npm run report:quality` gera também `reports/quality/canonical-inventory.{json,csv}` com 607 entradas e proveniência de notas. Uma avaliação editorial A do **módulo guiado** não concede nota A automática a seus quatro passos; essa diferença é explícita no relatório.
