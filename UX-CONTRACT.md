# Hub UX contract — home and catalog

The canonical 218 main and 325 parallel entries come from src/curriculum/catalog.json. The interactive viewer uses src/data/lessons.ts plus src/content/registry.ts; Markdown-only units use the document viewer.

On first login, point learners to main lesson 001. For a returning learner, prefer a recent unfinished interactive item with recorded progress, then an unfinished interactive item if relevant. Never infer reading completion from opening a Markdown document.

Dashboard metrics state their actual denominators: total catalog items, supported interactive completions and due FSRS review cards. User progress always comes from the authenticated account via accountStorage, not anonymous browser state.

Catalog journey: choose main or parallel mode from hash deep link, apply track and search filters, show first 24 entries, explicitly load more, show results and a no-results reset. Changing search or mode resets the visible window without dropping account state.

Mobile navigation: six labeled and reachable routes on desktop and phone; native links and visible focus; safe area and bottom padding so content remains reachable. Account/admin security and all API routes are unchanged.

Source-of-truth map: visual tokens in src/styles.css; home in src/components/Dashboard.tsx with home.css; catalog in src/components/curriculum/CurriculumBrowser.tsx; authentication in PlatformGate and Worker; persisted learning state in src/lib.

Required QA: npm run build, test:hub-ux, platform auth regression and manual mobile/desktop check for first time, returning learner, empty searches, next 24, deep link to parallel and keyboard focus. Static QA alone does not establish WCAG compliance.
