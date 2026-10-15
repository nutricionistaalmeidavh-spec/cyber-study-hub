# Auditoria A editorial — AULAS 181–190 (Red/Purple Team)

**Data:** 15/10/2026. **Escopo:** `public/course-library/main/181.md` a `190.md`.

**Melhorias verificáveis:** reescrita dos conteúdos genéricos por mecanismos causais específicos; 10 laboratórios Node.js com status positivos e negativos; 10 gabaritos externos contendo 60 questões de transferência; critérios de passagem 5/6; revisão de controle, falso positivo, evidências, rollback/reteste e risco residual em cada tema.

**Execução observada:** [GitHub Actions run 38748677502](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/actions/runs/38748677502) concluiu com status `success`, incluindo Node unit tests e build antes das novas notas editoriais. A CI deste PR também deverá validar hashes dos conteúdos, avaliação e contagem das 183 notas A no registro.

**Seis dimensões:** conteúdo técnico, didática, prática, defesa, avaliação, especificidade. Evidências individuais e SHA-256: [parecer estruturado](../../quality/reviews/a181-190-2026-10-15.json). Conferir o valor do SHA calculado no CI; mudança textual invalida revisão anterior.

**Limites:** esta é revisão técnico-editorial feita por IA em segunda passagem, não avaliação observacional com estudantes nem revisão humana externa. Fixtures comprovam regras do simulador, não eficácia de SIEM/EDR em infraestrutura real. Não foram usados SaaS pagos nem alvos públicos. Ferramentas pagas são estritamente opcionais fora do core.

**O que falta medir com alunos:** entendimento sem ajuda, taxa de conclusão, tempo efetivo, retenção após intervalo e acessibilidade. Não inferir esses resultados da aprovação da CI.

**Comandos:**
```bash
node --test public/course-labs/a181-190/lab.test.mjs
npm run test:grade-a-181-190
npm run verify:quality
```
