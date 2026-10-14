# Gabarito independente — AULA-067: Vulnerability Scanning profissional — Nessus/OpenVAS/Nuclei

**Use só após a tentativa.** A solução se refere a um cenário novo e exclusivamente fictício.

## Cenário da prova

Um Nuclei de laboratório marca 3 endpoints; um OpenVAS autorizado marca 1 configuração. Um endpoint responde 404 porque a rota não existe mais e outro revela string em página estática. A diretoria pede '4 vulnerabilidades confirmadas'.

## Respostas técnicas e justificativas

### Questão 1

**Resposta:** Plugins podem detectar a mesma causa ou sinais correlatos e com coberturas diferentes.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 2

**Resposta:** Build, pacote real, versão, rota efetiva, método, autenticação e precondições.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 3

**Resposta:** Marcar rota removida e revisar caminhos substitutos e funcionalidade legítima, sem concluir segurança global.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 4

**Resposta:** Somente presença de texto/banner, não produto vulnerável em execução.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 5

**Resposta:** Comparação repetível de comportamento e controle no lab autorizado, com positivo/negativo e registro de versão.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 6

**Resposta:** Usar testes Node e ferramentas OSS opcionais; Nessus não é dependência silenciosa nem requisito.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

## Rubrica de correção — 100 pontos

| Dimensão | Pontos | Exigência |
|---|---:|---|
| Conceitos e hipóteses (Q1–2) | 30 | Conceito correto e ausência de inferência não demonstrada |
| Evidências e controles (Q3–4) | 30 | Fonte verificável, controle no componente certo |
| Reteste, limites e método (Q5–6) | 30 | Positivo e negativo; risco residual expresso |
| Escopo e clareza profissional | 10 | Autorização, mínimo necessário, sem segredos |

**Erro eliminatório:** Apresentar todas as assinaturas como vulnerabilidades confirmadas sem deduplicação ou evidência.

**Referência de aprovação da atividade:** 80/100 sem erro eliminatório. Nenhum resultado de alunos humanos foi medido.
