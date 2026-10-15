# Hub UX contract — home and catalog

The canonical 218 main and 325 parallel entries come from src/curriculum/catalog.json. The interactive viewer uses src/data/lessons.ts plus src/content/registry.ts; Markdown-only units use the document viewer.

On first login, point learners to main lesson 001. For a returning learner, prefer a recent unfinished interactive item with recorded progress, then an unfinished interactive item if relevant. Never infer reading completion from opening a Markdown document.

Dashboard metrics state their actual denominators: total catalog items, supported interactive completions and due FSRS review cards. User progress always comes from the authenticated account via accountStorage, not anonymous browser state.

Catalog journey: first render the 17 canonical main modules (grouped by catalog.main.block) or 13 parallel subject modules (grouped by catalog.parallel.track), not a flat list of the canonical catalog units. Selecting a module uses #lessons?mode=...&module=... and reveals only its lessons. Existing deep links with track are interpreted as the corresponding module. Search on the module index matches both module names and lesson titles; inside a module it filters only its lessons. The first 24 results appear, with explicit load-more, result count and no-results recovery. Back-to-modules and browser history restore higher-level navigation without changing account state. The document viewer returns to the correct module. Parallel activity flags continue to be stored in curriculumState by original trackCode, including groups with more than one code.

Mobile navigation: six labeled and reachable routes on desktop and phone; native links and visible focus; safe area and bottom padding so content remains reachable. Account/admin security and all API routes are unchanged.

Source-of-truth map: visual tokens in src/styles.css; home in src/components/Dashboard.tsx with home.css; catalog in src/components/curriculum/CurriculumBrowser.tsx; authentication in PlatformGate and Worker; persisted learning state in src/lib.

Required QA: npm run build, test:hub-ux, platform auth regression and manual mobile/desktop check for first time, returning learner, empty searches, next 24, deep link to parallel and keyboard focus. Static QA alone does not establish WCAG compliance.

## Inventário ampliado de etapas (trilhas guiadas)

As 218 aulas principais e 325 unidades paralelas permanecem canônicas e **não** devem ser renumeradas. O Hub também possui as trilhas Meu Gestor com IA e Canal Dark, cada uma com 32 passos. O total exibido na landing e no painel vem de `src/lib/studyInventory.ts`, que soma os registros disponíveis nos manifests das duas trilhas ao catálogo: 543 + 32 + 32 = **607 etapas de navegação** na revisão de 2026-10-15. O total inclui **16 passos de referência**, dos quais 8 reutilizam unidades canônicas da trilha IA; não é uma contagem de 607 aulas inéditas. Contadores de conclusão continuam com seus denominadores próprios. Não altere `quality/registry.json` nem relatórios históricos de 543 IDs para tentar incorporar etapas guiadas como se fossem novos IDs canônicos.
