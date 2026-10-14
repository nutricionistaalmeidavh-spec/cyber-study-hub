# AULA-138 — Gabarito independente

**Cenário:** PID 20 foi usado às 10h e reutilizado às 11h; analista mistura dois processos num mesmo relatório.

**Observação:** exercício defensivo artificial; não executa malware e não representa validação de alunos por revisor humano.

## Questão 1

**Pergunta:** Por que PID sozinho é fraco?

**Resposta:** Pode ser reutilizado pelo SO.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 2

**Pergunta:** Que campo identifica instância?

**Resposta:** Horário de início do processo.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 3

**Pergunta:** O que diferencia as ferramentas?

**Resposta:** Procmon eventos e Explorer handles/processos.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 4

**Pergunta:** Qual erro ocorre na fusão de PID?

**Resposta:** Atribuição retrospectiva errada.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 5

**Pergunta:** Que controle benigno considerar?

**Resposta:** Aplicativo legítimo abre arquivo.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 6

**Pergunta:** Qual limite da oficina?

**Resposta:** Não vê eventos de kernel reais.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Rubrica de correção

- 6 respostas x 15 pontos = 90; exigir mecanismo e observação, não apenas definição.
- 10 pontos para positivo, negativo, controle, reteste e limite corretamente relatados.
- Aprovado com ≥80/100 sem erro eliminatório; essa não é a classificação editorial A.
- **Erro eliminatório:** confundir indício com prova de malware, executar código não autorizado, criar persistência ou declarar sandbox segura sem ensaio.
- **Limite:** Eventos são fixtures JSON; nenhuma coleta Sysinternals foi executada.
