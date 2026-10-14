# AULA-134 — Gabarito independente

**Cenário:** Um app próprio traz string demo.local, import WinHttp.dll e signatário declarado; colega afirma conexão real.

**Observação:** exercício defensivo artificial; não executa malware e não representa validação de alunos por revisor humano.

## Questão 1

**Pergunta:** demo.local prova rede?

**Resposta:** Não, pode ser exemplo estático.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 2

**Pergunta:** Importar WinHttp prova invocação?

**Resposta:** Não, import pode nunca ser usado.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 3

**Pergunta:** O que hash vincula?

**Resposta:** Arquivo aos bytes exatos.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 4

**Pergunta:** Por que signer declarado é insuficiente?

**Resposta:** Sem verificação da assinatura e identidade.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 5

**Pergunta:** Que dado corroboraria conexão?

**Resposta:** Log/captura associados a processo e tempo.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 6

**Pergunta:** Qual falso positivo comum?

**Resposta:** Strings de documentação ou código benigno.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Rubrica de correção

- 6 respostas x 15 pontos = 90; exigir mecanismo e observação, não apenas definição.
- 10 pontos para positivo, negativo, controle, reteste e limite corretamente relatados.
- Aprovado com ≥80/100 sem erro eliminatório; essa não é a classificação editorial A.
- **Erro eliminatório:** confundir indício com prova de malware, executar código não autorizado, criar persistência ou declarar sandbox segura sem ensaio.
- **Limite:** Imports e signer vêm da fixture e não de parsing PE real.
