# Auditoria A editorial assistida por IA — aulas 091–100

**Escopo:** dez aulas Antivírus/EDR. **Continuidade obrigatória:** 95 notas A anteriores + 10 novas = 105. O registro canônico fica em `quality/registry.json`; hashes e seis evidências por aula em `quality/reviews/a91-100-2026-10-13.json`.

Cada aula ganhou oficina específica, caso positivo, controle negativo e seis questões abertas, com gabarito e rubrica separados. Os testes usam Node 22 e dados sintéticos sem serviços pagos.

| Aula | Modelo de prática | Contraprova necessária |
| --- | --- | --- |
| 091 | Decisão de antivírus | Desconhecido legítimo não é necessariamente malicioso |
| 092 | Comparação de SHA-256 | Referência não confiável |
| 093 | Score heurístico | Macro isolada abaixo do limiar |
| 094 | Sequência comportamental | GUID ou tempo não correspondem |
| 095 | Pré-voo de isolamento | Snapshot/rede ausentes |
| 096 | NX, ASLR e CFG | Plataforma sem suporte a CFG |
| 097 | Integridade da telemetria | Campo ausente ou sensor silencioso |
| 098 | Árvore de processos | Pai ausente ou ciclo |
| 099 | Precisão e recall | Denominador zero indefinido |
| 100 | Hipótese de detecção | Rotina autorizada ou sensor offline |

**Comandos locais:** `node --test public/course-labs/a91-100/lab.test.mjs` e `node scripts/test-grade-a-91-100.mjs`. Validação integral via `npm run build` no GitHub Actions.

**Limites:** qualificação editorial por IA, `humanLearnerTesting=not_performed`. A segunda passagem de IA não constitui revisão humana independente; resultados do laboratório não certificam ferramentas comerciais ou eficácia com estudantes. As fontes técnicas são opcionais; o percurso obrigatório é R$ 0 e offline.
