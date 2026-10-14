# Gabarito independente — AULA-066: Nmap avançado e Service Fingerprinting

**Use só após a tentativa.** A solução se refere a um cenário novo e exclusivamente fictício.

## Cenário da prova

A infraestrutura Delta publica `Server: Apache/2.4.1` via proxy, mas o owner informa que a aplicação roda versão mais recente atrás da camada de borda. A equipe de SOC cria finding crítico pelo banner.

## Respostas técnicas e justificativas

### Questão 1

**Resposta:** Header real de componente antigo ou valor estático/reescrito pelo proxy; outras possibilidades exigem coleta.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 2

**Resposta:** Inventário do owner e build real, produto/versão e advisories aplicáveis à configuração.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 3

**Resposta:** Banner sugere versão, classificar como hipótese e documentar confiança e fontes.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 4

**Resposta:** Sonda permitida de cabeçalho em janela e endpoint autorizado com comparação a baseline.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 5

**Resposta:** Correlacionar banner, inventário e operação; separar observação e confirmação.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 6

**Resposta:** Configuração, módulos e fluxo explorável ainda devem ser examinados; versão afetada não prova impacto.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

## Rubrica de correção — 100 pontos

| Dimensão | Pontos | Exigência |
|---|---:|---|
| Conceitos e hipóteses (Q1–2) | 30 | Conceito correto e ausência de inferência não demonstrada |
| Evidências e controles (Q3–4) | 30 | Fonte verificável, controle no componente certo |
| Reteste, limites e método (Q5–6) | 30 | Positivo e negativo; risco residual expresso |
| Escopo e clareza profissional | 10 | Autorização, mínimo necessário, sem segredos |

**Erro eliminatório:** Declarar vulnerabilidade explorada apenas pelo banner HTTP.

**Referência de aprovação da atividade:** 80/100 sem erro eliminatório. Nenhum resultado de alunos humanos foi medido.
