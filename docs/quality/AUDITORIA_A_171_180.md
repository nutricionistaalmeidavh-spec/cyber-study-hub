# Auditoria A — aulas 171–180 (15/10/2026)

## Mudanças documentadas

Dez aulas do bloco Exploit Development & Vulnerability Research receberam oficinas específicas sem remover o material anterior. A prática central é gratuita e local em Node 22+, com fixtures sintéticas. Há dez testes com casos positivos, negativos e limites, além de 60 perguntas de transferência e respectivos gabaritos e rubricas em caminhos externos aos textos.

| Unidade | Evidência do exercício | Contraprova | Limitação |
| --- | --- | --- | --- |
| 171 Fuzzing | parser de PKT com comprimento consistente | comprimento divergente | nenhuma campanha nativa |
| 172 Coverage | caminhos do formato FORM | comprimento errado e ramo incompleto | não mede edges reais |
| 173 Sanitizers | classificação ASan temporal | UBSan e trace limpo | classificação JS não executa sanitizer |
| 174 Crash Triage | duas entradas mesmo grupo | classe/frame diferente | dedup é hipótese |
| 175 Root Cause | origem e capacidade separadas | tamanho de origem insuficiente | invariante modelada |
| 176 Reproducer | fixture+seed+oráculo | expectativa/versão divergente | nenhum crash real |
| 177 Safe PoC | fixture local sintética | rede/dados externos bloqueados | gate lógico, não sandbox |
| 178 Patch Diff | correção 4/3 + controle 3/3 | ausência de controles | não compara builds reais |
| 179 Variant Analysis | candidatos sem checagem de tamanho | função validada excluída | heurística, não SAST |
| 180 Capstone | advisory fictício completo | reteste ausente ou escopo externo | sem CVE atribuído, sem CVSS |

## Evidência e reexecução

- A identidade canônica permanece `src/curriculum/catalog.json`, preservando **218 aulas principais e 325 unidades paralelas**.
- `quality/registry.json` passa a registrar **183 notas A editoriais por IA**, das quais 10 correspondem a estas aulas.
- SHA-256 do texto exato, fonte técnica, dimensão e limitação em `quality/reviews/a171-180-2026-10-15.json`.
- Parecer AI-only: **não houve alunos reais, revisão humana externa, exploração de binários de terceiros nem serviço pago obrigatório**.
- Os modelos não certificam segurança de software real; ASan em C é abordado no laboratório nativo anterior, de execução opcional com compilador compatível.

Execute na raiz do repositório:

```bash
npm run test:grade-a-171-180
npm run verify:quality
npm run build
```

A suíte Node é determinística, não cria arquivos, não abre rede e não requer login. O CI de PR documenta os resultados executados. Não alterar OAuth, Cloudflare, segredos ou banco de dados.

## Fontes primárias

- LLVM: https://llvm.org/docs/LibFuzzer.html
- LLVM/Clang: https://clang.llvm.org/docs/AddressSanitizer.html
- MITRE CWE: https://cwe.mitre.org/data/definitions/20.html
- CVE Program: https://www.cve.org/About/Overview
