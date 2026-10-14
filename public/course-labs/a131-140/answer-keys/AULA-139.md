# AULA-139 — Gabarito independente

**Cenário:** Instalação autorizada cria entrada de inicialização; equipe quer excluí-la com todas as tarefas.

**Observação:** exercício defensivo artificial; não executa malware e não representa validação de alunos por revisor humano.

## Questão 1

**Pergunta:** Nova entrada é malware?

**Resposta:** Não necessariamente.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 2

**Pergunta:** Que dado evidencia mudança?

**Resposta:** Diff de baselines por identidade.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 3

**Pergunta:** Por que verificar publisher?

**Resposta:** Determinar origem e confiança.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 4

**Pergunta:** Por que não remover tudo?

**Resposta:** Quebra componentes legítimos.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 5

**Pergunta:** Como retestar mudança?

**Resposta:** Preservar entrada autorizada após remediação.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 6

**Pergunta:** O que falta no diff?

**Resposta:** Contexto de execução e intenção.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Rubrica de correção

- 6 respostas x 15 pontos = 90; exigir mecanismo e observação, não apenas definição.
- 10 pontos para positivo, negativo, controle, reteste e limite corretamente relatados.
- Aprovado com ≥80/100 sem erro eliminatório; essa não é a classificação editorial A.
- **Erro eliminatório:** confundir indício com prova de malware, executar código não autorizado, criar persistência ou declarar sandbox segura sem ensaio.
- **Limite:** Não edita registro Windows, serviços ou tarefas reais.
