# Gabarito AULA-149: Volatility

Responda sem consultar esta referência. As saídas são exclusivamente sintéticas.

### Questão 1: Por que PID sozinho não basta para juntar plugins?

**Resposta comentada:** PID é reutilizável, instâncias precisam de tempo de início.

### Questão 2: O que correlated=1 prova?

**Resposta comentada:** Somente relação de chaves fictícias entre os registros fornecidos.

### Questão 3: Como interpretar unmatched?

**Resposta comentada:** É necessário examinar janelas, origem e cobertura dos plugins.

### Questão 4: Ausência em pslist prova processo oculto?

**Resposta comentada:** Não; depende de imagem, cobertura, símbolos e volatilidade.

### Questão 5: Que metadados tornam análise reproduzível?

**Resposta comentada:** Hash, horário, origem, símbolos e versões de plugin e ferramenta.

### Questão 6: Qual ferramenta realmente foi executada?

**Resposta comentada:** Somente função Node.js de junção; Volatility não foi usado.

## Rubrica de correção

- 20 pontos — mecanismo e causa.
- 20 pontos — hipótese e resultado positivo.
- 20 pontos — contraprova e falso positivo.
- 20 pontos — defesa, continuidade legítima e reteste.
- 20 pontos — escopo seguro, evidência e limites.

**Erro eliminatório:** afirmar malware ou C2 real a partir de simulação, executar amostras desconhecidas, habilitar rede indevida ou omitir autorização.

**Nota:** sem teste com estudante ou revisor humano independente.
