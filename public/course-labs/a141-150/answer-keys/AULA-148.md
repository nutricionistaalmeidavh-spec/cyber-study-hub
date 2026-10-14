# Gabarito AULA-148: Memory Forensics

Responda sem consultar esta referência. As saídas são exclusivamente sintéticas.

### Questão 1: Que combinação produz review?

**Resposta comentada:** Permissões incluindo w e x com proprietário desconhecido.

### Questão 2: Ausência de RWX exclui malware?

**Resposta comentada:** Não, o indicador é apenas parcial.

### Questão 3: Por que JIT pode gerar falso positivo?

**Resposta comentada:** Compiladores JIT podem usar páginas graváveis/executáveis em etapas controladas.

### Questão 4: Que dado ajuda identificar região legítima?

**Resposta comentada:** Mapeamento de módulo, processo, assinatura, alocação e tempo.

### Questão 5: Quais precauções precedem aquisição real?

**Resposta comentada:** Autorização, custódia, hash e minimização de dados privados.

### Questão 6: Qual conclusão não se permite?

**Resposta comentada:** Confirmar injeção ou comprometimento a partir de ficha sintética.

## Rubrica de correção

- 20 pontos — mecanismo e causa.
- 20 pontos — hipótese e resultado positivo.
- 20 pontos — contraprova e falso positivo.
- 20 pontos — defesa, continuidade legítima e reteste.
- 20 pontos — escopo seguro, evidência e limites.

**Erro eliminatório:** afirmar malware ou C2 real a partir de simulação, executar amostras desconhecidas, habilitar rede indevida ou omitir autorização.

**Nota:** sem teste com estudante ou revisor humano independente.
