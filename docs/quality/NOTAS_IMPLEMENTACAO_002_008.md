# Aulas 002–008 — escopo de integração e QA

- Sete documentos canônicos em `public/course-library/main/002.md` a `008.md`, preservando a identidade do catálogo `src/curriculum/catalog.json`.
- Sete provas de transferência (seis questões cada, 42 ao todo) com gabaritos separados em `/course-labs/a-002-008/answer-keys/`.
- Laboratórios locais reutilizáveis Node 22 (`core.mjs` + `core.test.mjs`) e Python/SQLite (`sql_lab.py`), com testes negativos e positivos; a 004 continua usando o laboratório de bcrypt já existente.
- Registro e pareceres A editoriais em `quality/registry.json` e `quality/reviews/a-002-008-2026-10-13.json`. Não inventar teste com alunos humanos.
- Testes preexistentes das primeiras 8 aulas A continuam obrigatórios. `scripts/test-pilot-grade-a.mjs` não pode exigir que nunca apareçam A adicionais.
- CI `Aulas 002-008 QA`: somente PR relevante ou execução manual; sem deploy, OAuth, secrets, bancos externos ou login.
- Retestar quando qualquer Markdown mudar: parecer SHA-256 deve invalidar.
