# AULA-135 — Gabarito independente

**Cenário:** Um detector vê H=8 em bytes 00..FF em ordem e considera que isso prova malware cifrado.

**Observação:** exercício defensivo artificial; não executa malware e não representa validação de alunos por revisor humano.

## Questão 1

**Pergunta:** Quanto vale H(AABB)?

**Resposta:** 1 bit/byte para duas classes equiprováveis.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 2

**Pergunta:** Por que H(AAAA)=0?

**Resposta:** Apenas um símbolo ocorre.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 3

**Pergunta:** Como 00..FF tem H=8?

**Resposta:** Todos os símbolos ocorrem uma vez.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 4

**Pergunta:** Por que usar janelas?

**Resposta:** Localizar diferenças ocultas por média global.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 5

**Pergunta:** Qual cuidado com amostras pequenas?

**Resposta:** Distribuição fica enviesada por poucos bytes.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Questão 6

**Pergunta:** H alto prova o quê?

**Resposta:** Somente frequência aproximadamente uniforme.

**Evidência mínima:** apoiar esta resposta no modelo e explicar por que uma inferência mais forte exigiria dados externos.

## Rubrica de correção

- 6 respostas x 15 pontos = 90; exigir mecanismo e observação, não apenas definição.
- 10 pontos para positivo, negativo, controle, reteste e limite corretamente relatados.
- Aprovado com ≥80/100 sem erro eliminatório; essa não é a classificação editorial A.
- **Erro eliminatório:** confundir indício com prova de malware, executar código não autorizado, criar persistência ou declarar sandbox segura sem ensaio.
- **Limite:** Não detecta packer, stub, criptografia ou malware apenas por H.
