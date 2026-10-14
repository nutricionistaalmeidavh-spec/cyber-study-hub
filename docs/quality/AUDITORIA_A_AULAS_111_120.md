# Auditoria editorial A — aulas 111–120 (Assembly & RE)

**Data editorial:** 13/10/2026 (America/São_Paulo). **Método:** segunda passagem crítica por IA, sem participação de revisor humano externo ou avaliação observacional com estudantes.

## Diagnóstico inicial

Os materiais 111–120 continham introduções e exemplos didáticos, porém os quizzes repetiam perguntas genéricas sobre evidência e correção, sem verificar as competências específicas de Assembly/Engenharia Reversa. Não era justificado apenas alterar o valor da nota no registro. As dez aulas agora apresentam um problema técnico concreto, conceitos corretos para a arquitetura/ABI, roteiro de prática com entrada, saída, negativo, três checkpoints e prova independente de transferência.

## Competências e evidências

- **AULA-111:** decodificação de 83 C0 ib (x86/EAX) e 48 83 C0 ib (x64/RAX), modo obrigatório. **Teste local:** decodeOwnBytes produz ADD EAX ou RAX com length 3/4 e recusa modo incompatível. **Limite:** Whitelist mínima de duas instruções, não decoder x86 completo.
- **AULA-112:** rastreio de MOV, ADD, CMP, registrador RAX e flag ZF, sem escrita pelo CMP. **Teste local:** executeRegisterTrace acompanha estados 4→6→6; ZF true após comparação igual e false no negativo. **Limite:** Inteiros JS, sem overflow/carry/RIP/RSP/flags completas.
- **AULA-113:** ABI System V AMD64 versus Microsoft x64 e shadow space Win64 de 32 bytes. **Teste local:** assignCallingArguments confirma seis registradores SysV, quatro Win64 e excedentes lógicos. **Limite:** Não representa layout físico da pilha, float, varargs, structs, prólogo/epílogo.
- **AULA-114:** CFG de categorias de entrada com blocos de reject/small/large e fronteira n=10. **Teste local:** traceBranches(-1,2,10) percorre somente blocos compatíveis com o predicado. **Limite:** Não modela RIP, otimização do compilador, branches indiretos e todas entradas.
- **AULA-115:** consistência entre entry/listing, destino de chamada e hipótese no Ghidra. **Teste local:** reviewStaticFunction aceita entry e targets alinhados; rejeita entry ausente no listing. **Limite:** Não executa Ghidra nem comprova equivalência do decompiler.
- **AULA-116:** estado de breakpoint antes da operação e estado final de programa próprio. **Teste local:** traceBreakpoint com [1,2,3] em PC lógico=1 mostra acum.1 antes, 6 depois. **Limite:** Simula bytecode e não depura executável x64dbg/Windows nativo.
- **AULA-117:** semântica de pseudocódigo e erro de limite entre n>=10 e n>10. **Teste local:** checkDecompilation aceita n>9 como equivalente na amostra e revela divergência n=10. **Limite:** Equivalência de casos testados não é prova formal; não modela UB/overflow.
- **AULA-118:** referências cruzadas e reachability estática de funções que usam strings/imports. **Teste local:** findReferences encontra entry→parse→logError e não encontra unused. **Limite:** Call graph sintético não implica execução efetiva e não cobre calls indiretos.
- **AULA-119:** regressão de desconto >=100 versus bug >100 em programa próprio. **Teste local:** investigateOwnBug([99,100,101]) identifica somente falha no 100; corrigido 0/10/10.1. **Limite:** Modelo didático de ponto flutuante arredondado, não motor financeiro real.
- **AULA-120:** reconstrução de política invalid/standard/priority a partir de traço e testes ocultos. **Teste local:** evaluateReconstruction rejeita hipótese n<=10 quando oracle n<10; contraexemplo 10. **Limite:** Cinco inputs não provam equivalência global nem recuperar source literal.

Cada unidade inclui seis perguntas de cenário distinto, seis respostas em `public/course-labs/a111-120/answer-keys/`, rubrica e erro eliminatório. Os hashes SHA-256 dos documentos estão bloqueados nos dez registros `quality/registry.json` e na auditoria `quality/reviews/a111-120-2026-10-13.json`.

## Laboratório canônico gratuito

```sh
npm ci --no-audit --no-fund
npm run test:a-111-120
npm run verify:quality
npm run build
```

Os 10 testes Node executam simulações próprias e determinísticas **sem acesso a dispositivos, processos, arquivos de terceiros ou internet**. Ghidra e x64dbg são ferramentas opcionais para experimentos no próprio computador, mas não condicionam concluir a aula ou passar no CI. A simulação de debugger não representa uma execução Windows nativa.

## Preservação de acervo e gates

Os **543 IDs canônicos** permanecem inalterados (218 principais + 325 paralelas). As 95 aulas editoriais A já existentes não podem ser removidas ou ter seus hashes alterados por esta PR; o total esperado após promoção é de **105 classificações A editoriais IA**. Workflow novo: `Aulas 111-120 QA`, disparado por PR ou manualmente; a pipeline histórica de qualidade e build também deve aprovar.

Os campos `didaticaInicianteValidada`, `avaliacaoIndependenteRevisada` e `revisorIndependente` descrevem avaliação editorial assistida por IA, e **não** estudo de eficácia com alunos nem revisão por pessoa externa.

## Referências técnicas

[Intel Software Developer Manual](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html), [Microsoft x64 ABI](https://learn.microsoft.com/en-us/cpp/build/x64-calling-convention?view=msvc-170), [Ghidra](https://ghidra-sre.org/), [x64dbg](https://help.x64dbg.com/en/latest/index.html) e [GDB](https://sourceware.org/gdb/current/onlinedocs/gdb.html).
