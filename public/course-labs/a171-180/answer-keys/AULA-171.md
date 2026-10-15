# Gabarito da Aula 171 — Fuzzing de pacotes fictícios

### Questão 1
`PKT|2|AB` é aceito; `PKT|3|AB` é rejeitado por divergência do campo de tamanho.

### Questão 2
Mudar somente o campo `2` para `3` permite isolar a condição do parser.

### Questão 3
Um encerramento real poderia ser causado também por limites de recursos ou outro defeito. Exige diagnóstico de processo e logs antes de atribuir causa.

### Questão 4
Repetir casos legítimos `PKT|2|AB` e `PKT|0|`, ambos aceitos, e o caso truncado, rejeitado.

### Questão 5
Salvar seed, fixture, versão, campos e resultado esperado/observado, sem dados pessoais.

### Questão 6
O modelo Node valida contratos de cadeia textual; não realiza acesso a memória nativa nem prova exploração.

## Rubrica
Cada resposta vale 15 pontos; 10 pontos são reservados para evidências de entrada, saída, previsão e contraprova. **Erro eliminatório:** declarar impacto real ou realizar testes fora do escopo didático.
