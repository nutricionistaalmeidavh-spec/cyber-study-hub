# Gabarito — AULA-118: Xrefs, Strings e Imports

**Somente depois da tentativa.** Este é um caso independente da fixture e o material não implica estudo humano observado.

## Caso de transferência

Um binário educacional inclui import `WriteFile` e uma string `backup_done`, mas o fluxo normal chama somente `parseFile` e `reportStatus`. A função `saveBackup` possui a única referência a WriteFile e não há caminho de call de entry até ela no modelo.

## Soluções e critérios

### Questão 1

**Resposta fundamentada:** Dependência/símbolo referenciado no binário, não gravação efetiva.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 2

**Resposta fundamentada:** Pode ser recurso não utilizado, log ou texto fixo sem execução.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 3

**Resposta fundamentada:** Localizar referências ao endereço da import/string e rastrear callers, com endereços e funções.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 4

**Resposta fundamentada:** No grafo modelado, saveBackup não é alcançável a partir de entry, ressalvando incompletude estática.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 5

**Resposta fundamentada:** Arestas podem estar ausentes devido a function pointers, callbacks, dispatch ou imports dinâmicos.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

### Questão 6

**Resposta fundamentada:** Executar caso autorizado em pasta temporária, observar efeito de arquivo e correlacionar trace com função de escrita.

**Correção:** verificar hipótese, operação, consequência, evidência e limites de modo coerente.

## Rubrica de correção

| Categoria | Pontos | Evidência mínima |
|---|---:|---|
| Conceitos e mecanismo (Q1–2) | 30 | Sem confundir estado e interpretação |
| Evidência observável e hipóteses (Q3–4) | 30 | Contraexemplo e caso de fronteira |
| Regressão, limites e transferência (Q5–6) | 30 | Positivo e negativo sem extrapolar |
| Comunicação e escopo autorizado | 10 | Programa próprio e dados fictícios |

**Erro eliminatório:** Tratar presença de string, import ou Xref como prova de que operação ocorreu. Respostas com esse erro não atingem aprovação editorial.

**Critério de aprovação orientativo:** 80/100 sem erro eliminatório. Não há resultado medido com estudantes reais.
