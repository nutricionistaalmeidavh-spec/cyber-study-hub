# Meu Gestor — especificação v0.1 (modelo para preencher)

**Escopo:** oficina e clientes totalmente fictícios; sem autenticação, pagamentos, nuvem ou dados pessoais reais.

## 1. Problema e usuário

Atendente de oficina fictícia precisa acompanhar serviço do cadastro à conclusão e encontrar ordens sem perder seu estado.

## 2. Entidades

- Cliente: id estável C-XXX; nome fictício não vazio.
- Ordem: id OS-XXX; clientId existente; serviço não vazio; estado um de pendente, em andamento, concluído.
- Regra: uma ordem nova inicia pendente; avanço só pendente→em andamento→concluído; concluída não avança.
- Integridade: apagar cliente vinculado a OS é bloqueado nesta versão (decisão explícita).

## 3. Requisitos e provas

| ID | Dado | Quando | Então | Caso negativo |
|---|---|---|---|---|
| RF-01 | nome fictício válido | criar cliente | adiciona um id novo | nome vazio rejeitado |
| RF-02 | cliente existente e serviço preenchido | criar OS | nova ordem pendente | cliente inexistente rejeitado |
| RF-03 | OS pendente | avançar | fica em andamento | concluída não avança |
| RF-04 | lista com estados variados | filtrar pendentes | exibe somente pendentes | filtro não altera fonte |
| RF-05 | cliente sem ordens | excluir | cliente removido | cliente com OS permanece |

## 4. Perguntas ao solicitante (não inventar decisões)

- Existe necessidade de anotações adicionais em cada OS?
- A conclusão deve ser reversível com trilha de auditoria? **Fora de escopo inicial.**
- Há exigência de acesso simultâneo por usuários? **Fora de escopo inicial.**

## 5. Fluxos em papel

Fluxo válido: C-001 existe → inserir descrição → validar → criar OS pendente → avançar duas vezes → exibir concluída.

Fluxo inválido: C-999 não existe → inserir serviço → validar falha → manter dados inalterados e exibir erro.

## 6. Evidências exigidas

Cole as previsões, resultados e decisões, não dados pessoais nem segredos. Este é um modelo inicial: o estudante precisa criticá-lo e alterá-lo para apresentar autoria própria.
