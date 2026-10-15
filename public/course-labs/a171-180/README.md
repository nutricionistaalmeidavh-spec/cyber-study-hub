# Laboratórios A171–A180 — pesquisa de vulnerabilidades sem alvos reais

São **10 experimentos determinísticos**, todos com código executável e roteiros específicos. Nenhum testa software de terceiros, cria exploits, baixa CVEs ou se declara prova de segurança de produção. Os laboratórios 171/172 de fuzzing são **modelos finitos de teste**, não motores de fuzzing; 173 mantém referência ao pacote real de sanitizer em `phase16-memory`.

| Aula | Prática | Roteiro |
| --- | --- | --- |
| 171 | Fuzzing | [AULA-171](./workshops/AULA-171.md) |
| 172 | Coverage-Guided Fuzzing | [AULA-172](./workshops/AULA-172.md) |
| 173 | Sanitizers | [AULA-173](./workshops/AULA-173.md) |
| 174 | Crash Triage | [AULA-174](./workshops/AULA-174.md) |
| 175 | Root Cause Analysis | [AULA-175](./workshops/AULA-175.md) |
| 176 | Reproduzir Vulnerabilidade | [AULA-176](./workshops/AULA-176.md) |
| 177 | Safe PoC | [AULA-177](./workshops/AULA-177.md) |
| 178 | Patch Diff | [AULA-178](./workshops/AULA-178.md) |
| 179 | Variant Analysis | [AULA-179](./workshops/AULA-179.md) |
| 180 | CVE Research | [AULA-180](./workshops/AULA-180.md) |

Da raiz do projeto, com Node 22+:

```bash
node public/course-labs/a171-180/run.mjs 171
node --test public/course-labs/a171-180/lab.test.mjs
```

Para cada aula, troque 171 pelo ID da atividade. Os testes cobrem resultado válido, negativo e entrada inválida. Os outputs são sintéticos. Registre entradas e saídas e tente uma alteração própria em cópia local.

A distribuição inclui apenas fontes, sem gabaritos individuais publicamente revelados. Este pacote é um **suplemento** dos conteúdos canônicos em `public/course-library/main`.
