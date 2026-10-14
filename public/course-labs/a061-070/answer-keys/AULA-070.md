# Gabarito independente — AULA-070: Active Directory fundamentals

**Use só após a tentativa.** A solução se refere a um cenário novo e exclusivamente fictício.

## Cenário da prova

Uma empresa move a conta `estagio01` para OU=Financeiro e aplica uma GPO de configuração de navegador. A conta não pertence ao grupo `AprovadoresPagamentos`, mas o gestor assume que já pode aprovar transações.

## Respostas técnicas e justificativas

### Questão 1

**Resposta:** OU determina organização/delegação e escopo de políticas; grupo de segurança define principal de autorização avaliado pelo recurso.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 2

**Resposta:** Define política/configuração para usuários/computadores no escopo, não autorização automática de aplicação.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 3

**Resposta:** ACL/política do ERP, grupos efetivos, membership direta/aninhada e identidade do principal.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 4

**Resposta:** Conta de teste no grupo autorizado executa aprovação sintética e produz log correto.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 5

**Resposta:** estagio01 sem papel aprova? Não: deve ser negado mesmo estando na OU Financeiro.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

### Questão 6

**Resposta:** Aninhamento/grupo, domínio/trust, políticas de aplicação, GPO, renovação de logon e emissão de token.

**Verificação:** conferir se houve distinção entre observação, autoridade, efeito e o que permanece incerto.

## Rubrica de correção — 100 pontos

| Dimensão | Pontos | Exigência |
|---|---:|---|
| Conceitos e hipóteses (Q1–2) | 30 | Conceito correto e ausência de inferência não demonstrada |
| Evidências e controles (Q3–4) | 30 | Fonte verificável, controle no componente certo |
| Reteste, limites e método (Q5–6) | 30 | Positivo e negativo; risco residual expresso |
| Escopo e clareza profissional | 10 | Autorização, mínimo necessário, sem segredos |

**Erro eliminatório:** Conceder ou assumir papel financeiro só por localização na OU.

**Referência de aprovação da atividade:** 80/100 sem erro eliminatório. Nenhum resultado de alunos humanos foi medido.
