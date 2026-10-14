# Respostas e rubrica — AULA-063: Privilege Escalation Linux

**Abra só depois da sua tentativa.** Esta prova usa um caso de transferência independente, não é relatório de teste com alunos.

## Cenário contextualizado

O time Gama concede `sudo /usr/local/bin/healthcheck` para técnicos. O executável é root:root 0755, mas o arquivo de configuração lido pelo programa permite diretivas de shell e pode ser alterado pelo grupo técnicos.

## Questões comentadas

### Questão 1

**Resposta esperada:** Configuração gravável por técnicos é entrada de menor privilégio interpretada por processo root.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 2

**Resposta esperada:** O processo privilegiado usa configuração cujo conteúdo afeta comportamento; path do binário é apenas parte do grafo.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 3

**Resposta esperada:** Se diretivas são realmente executáveis/interpretadas e quais controles de parser existem.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 4

**Resposta esperada:** Remover capacidade de executar shell na configuração, restringir escrita e delegar comando com mínimo privilégio.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 5

**Resposta esperada:** Positivo: diagnóstico funciona com configuração aprovada; negativo: técnico não introduz diretiva arbitrária executável.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

### Questão 6

**Resposta esperada:** Validação do parser, permissões efetivas, contexto e logs; a mitigação pode ser decidida com evidência mínima, sem disparar payload.

**Justificativa a exigir:** enunciar a condição relevante, ligar a decisão ao principal/objeto correto e não exagerar o alcance da evidência.

## Rubrica independente

| Critério | Peso | Aceite |
|---|---:|---|
| Conceitos e fronteiras de confiança (Q1–2) | 30 | Causa específica, não só nome de ferramenta |
| Evidência e controle causal (Q3–4) | 30 | Variável pertinente, correção verificada |
| Caso positivo, negativo, limites (Q5–6) | 30 | Risco reduzido sem quebrar função legítima |
| Comunicação, autorização e minimização de dados | 10 | Sem credenciais, sem saída de escopo |
 
**Erro eliminatório:** Executar uma escalada real fora de sandbox para provar que um script gravável gera root.

**Referência de aprovação editorial da atividade:** 80/100 sem erro eliminatório. A rubrica não afirma que estudantes tenham executado a prova.
