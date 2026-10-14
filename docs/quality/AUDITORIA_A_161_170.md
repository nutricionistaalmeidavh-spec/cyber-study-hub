# Aulas 161–170 — auditoria A editorial IA (14/10/2026)

## Diagnóstico e decisões de preservação

As aulas 161–165 **já tinham laboratórios nativos C com AddressSanitizer**, fixtures e casos de regressão. Seus materiais anteriores foram mantidos e enriquecidos com cenários novos, avaliação independente, gabarito e suíte de contratos JS sem efeitos colaterais. As aulas 167–170 tinham exemplos de mitigação e questões genéricas; agora são complementadas com decisões defensivas específicas e prova de transferência.

A **AULA-166 (ASLR) já era A**, com experimento PIE/ASLR validado anteriormente e gabarito em `public/course-labs/pilot-a/answer-keys/AULA-166.md`. Seu documento, seu hash, parecer e laboratórios **não foram editados**. Assim, este grupo promove **9 novas aulas** para A e preserva a décima em A.

## Resultados avaliados

- **AULA-161:** Espacial vs temporal: offset, width, capacity e lifetime; preservação do laboratório ASan nativo. **Teste:** classifyMemoryAccess: offset 7/8 com width 1 e alive false geram VALID/SPATIAL_OOB/TEMPORAL_UAF. **Limite:** JS não toca memória nativa nem mede exploitability; experimentos ASan C são prévios.
- **AULA-162:** Overflow de string C: NUL precisa de capacidade e comprimento declarado não é corpo disponível. **Teste:** validateBoundedCopy: n=7/cap=8 aceita; n=8 rejeita NUL; source 6 para n=7 rejeita. **Limite:** Modelo não usa memcpy; confirmação nativa pertence ao laboratório C existente.
- **AULA-163:** Crash triage: log AddressSanitizer classifica acesso mas não confirma exploração. **Teste:** triageSanitizer: stack-buffer-overflow é reconhecido, mas exploitability é NOT_ESTABLISHED; log normal sem evidência. **Limite:** Classificador simples não emula debugger/ASan real, logs podem mudar por plataforma.
- **AULA-164:** Diferença entre stack exhaustion por frames e stack-buffer-overflow espacial de objeto. **Teste:** limitRecursionDepth: profundidade 4 é aceita em budget 8; 100000 rejeitada; -1 inválida. **Limite:** Não usa threads/stack OS, simula apenas orçamento de recursão.
- **AULA-165:** Heap lifetime e aliasing: NULL do owner não invalida cópia do ponteiro após free. **Teste:** checkHeapAlias: objeto vivo offset 0 aceito; freed true rejeitado; offset 4/len4 fora da faixa. **Limite:** JS não simula allocator, race, double-free; testes ASan C ficam preservados.
- **AULA-167:** NX, DEP, W^X e interpretação de R/W/X sem alegar que mitigação corrige OOB. **Teste:** checkPagePermissions: rw- nega execute e permite write; r-x executa; rwx recebe W_AND_X. **Limite:** Nenhuma permissão de processo ou DEP real alterada; W^X é política abstrata.
- **AULA-168:** Canary: detector de integridade de frame, não prova universal de segurança. **Teste:** verifyCanary: mismatch dispara ABORT_FUNCTION e igualdade permanece memorySafe UNKNOWN. **Limite:** Não testa compilador -fstack-protector-strong nem canaries em binário real.
- **AULA-169:** ROP conceitual sem payload: NX versus integridade do fluxo e destino esperado de retorno. **Teste:** checkReturnTarget: destino allowlist aceito, destino inesperado rejeitado; sem gadget chain. **Limite:** Modelo não simula ROP, CFI real, CET/shadow stack ou cobertura de compilador.
- **AULA-170:** Capstone de mitigadores: ASLR/NX/canaries/CFI separados da correção de bounds. **Teste:** assessMitigationMatrix: quatro camadas com bug aberto continuam OPEN; fixed registra apenas FIXED_IN_FIXTURE. **Limite:** Não comprova proteções binárias reais nem correção de software de terceiros.

- 9 provas independentes de transferência, **54 questões comentadas** e 9 rubricas.
- 9 testes Node.js 22 em memória, sem executar payload, inspecionar processos reais ou acessar rede.
- Laboratórios C/GCC/Python da fase16-memory intactos; no currículo original são opcionais e requerem Linux/GCC/ASan.
- Os conteúdos das aulas 161–170 continuam no **catálogo com 218 main e 325 trilhas paralelas = 543 IDs**.
- Registros A anteriores preservados: 144 (incluindo 166 e as novas A151–159), adicionados: 9, total esperado **153**.
- SHA-256 de cada um dos 9 documentos alterados, seis dimensões de nota, gates e método no registro `quality/registry.json`.

## Execução no CI

```bash
npm ci --no-audit --no-fund
npm run test:a-161-170
npm run verify:quality
npm run build
```

Workflow novo `Aulas 161-170 QA` dispara em PR e manual, não a cada commit. Os workflows históricos são verificados pelos comandos do build do projeto. Não houve alteração de OAuth, autenticação, Cloudflare, secrets, banco de dados ou configuração de deploy.

## Limitações explícitas

Uma nota A **editorial assistida por IA** não equivale a estudo de aprendizagem com estudantes reais, revisão humana ou relatório de exploração em produção. Os modelos abstratos de NX, canary e CFI não garantem que mitigadores estão ativos num executável real. Semântica de corrupção espacial/temporal é demonstrada no código próprio do laboratório preexistente, não em sistema de terceiros.

**Fontes técnicas:** [AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html), [GCC options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html), [proc maps Linux](https://man7.org/linux/man-pages/man5/proc_pid_maps.5.html). Fontes por unidade no arquivo de auditoria.
