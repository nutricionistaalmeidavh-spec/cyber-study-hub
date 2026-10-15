# Laboratórios A171–A180 — Vulnerability Research (ambiente de teste)

Este é um **toy parser** local, com testes determinísticos e sem alvo externo. Ele permite exercitar fluxo de entrada, crash triage conceitual, corpus, regressão e correção. **Não é fuzzing completo, não executa sanitizer de memória real e não valida CVE**; não o use como prova sobre softwares externos.

```sh
node --test public/course-labs/a171-180/lab.test.mjs
```

| Aula | Prática concreta | Evidência |
| --- | --- | --- |
| 171 Fuzzing | Gere variações de `LAB:03:abc` com `mutate`. | Qual entrada foi aceita ou rejeitada? |
| 172 Coverage-guided | Use `inspectCorpus` para observar ramos FORMAT/LENGTH/CHARSET/ACCEPT. | Diferencie instrumentação didática de cobertura real de LLVM. |
| 173 Sanitizers | Observe rejeição por limites; compare como complemento com `phase16-memory` (C sanitizers). | Diga por que JS não prova ASan/UBSan. |
| 174 Crash Triage | Use `triage` e repita exatamente a entrada. | Registre erro, versão e entrada minimizada. |
| 175 Root Cause | Compare `unguardedAccept` com `parseFrame`. | Demonstre causa e fronteira da validação. |
| 176 Reprodução | Rode mesma entrada duas vezes sem mudar ambiente. | Resultado repetido; nada sobre software de terceiros. |
| 177 Safe PoC | Construa um teste mínimo de uma condição inválida fictícia. | Sem exploração nem rede. |
| 178 Patch Diff | Faça o diff entre check de prefixo e parser corrigido. | Caso válido continua aceito, inválido recusado. |
| 179 Variant Analysis | Troque tamanho e charset independentemente. | Matriz de variantes com controle negativo. |
| 180 Capstone | Consolide corpus, causas, correção e reteste. | Relatório de hipótese, evidência e limite. |

**Extensão nativa opcional:** [phase16-memory](../phase16-memory/README.md) contém projetos C para experimentos de memória com regras próprias. Requer toolchain e isolamento adicionais. Ferramentas de teste em `utilidades` e `artisysScan` podem gerar evidências, mas não substituem execução de sanitizer/fuzzer real.

Rubrica editorial sugerida 0–2 em: escopo, hipótese, execução, controle negativo, correção e limite. **Não conceder status A por simples leitura ou clique.**
