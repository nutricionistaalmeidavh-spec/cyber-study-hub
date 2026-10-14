# AULA-122 — Gabarito independente

Abra somente após tentativa. Nota A é parecer editorial assistido por IA, não teste com aprendizes reais.

**Problema:** Um dado próprio representa OK em hexadecimal 4f4b; um colega confunde encoding com criptografia e quer executar o texto decodificado.

## Questão 1

**Enunciado:** Por que 4f4b não é criptografia?

**Resposta comentada:** Representa bytes ASCII, sem chave secreta.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 2

**Enunciado:** Qual saída deve aparecer?

**Resposta comentada:** decoded=OK e executed=false.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 3

**Enunciado:** Como tratar 4g?

**Resposta comentada:** Rejeitar hex inválido, sem correção silenciosa.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 4

**Enunciado:** Por que limitar tamanho de entrada?

**Resposta comentada:** Evita processamento inesperado de dados arbitrários.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 5

**Enunciado:** Qual distinção existe entre encoding e CFG obfuscation?

**Resposta comentada:** Representação de dados versus transformação de lógica.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Questão 6

**Enunciado:** O que o laboratório não prova?

**Resposta comentada:** Que script é seguro ou que binário foi desofuscado.

**Evidência exigida:** conectar a resposta aos campos do exemplo e apontar um teste que poderia invalidar conclusão prematura.

## Rubrica objetiva

- Questões 1–6: 15 pontos cada (90); atribuir nota só mediante mecanismo e evidência fundamentados.
- Laboratório com teste positivo, negativo e limite: 10 pontos.
- Aprovação do exercício: pelo menos 80/100 sem erro eliminatório; não é nota editorial nem teste de aprendizado com humanos.
- **Erro eliminatório:** confundir indício com prova de malware, operar bypass de software de terceiros, ignorar escopo ou só bloquear uso legítimo.
- **Limite do laboratório:** O modelo só decodifica strings inertes; não analisa CFG nem desfaz proteção de programas.
