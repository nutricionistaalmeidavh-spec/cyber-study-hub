# Gabarito AULA-146: PCAP + Wireshark

Responda sem consultar esta referência. As saídas são exclusivamente sintéticas.

### Questão 1: Qual a diferença entre filtro e captura?

**Resposta comentada:** Captura registra bytes; filtro limita a visualização dos itens disponíveis.

### Questão 2: Por que streamId não equivale a protocolo?

**Resposta comentada:** Stream é identificador de conversa, protocolo é classificação do tráfego.

### Questão 3: O que parsedPcap=false informa?

**Resposta comentada:** Nenhum PCAP real foi interpretado: só objetos em memória.

### Questão 4: Filtro sem resultado prova ausência de tráfego?

**Resposta comentada:** Não; conjunto, filtro e sensor podem estar incompletos.

### Questão 5: Como preservar original forense?

**Resposta comentada:** Hash, origem, relógio, comando e cópia imutável.

### Questão 6: Qual limite impede extrair conteúdo TLS?

**Resposta comentada:** Sem bytes e chave legítima não há visibilidade de payload criptografado.

## Rubrica de correção

- 20 pontos — mecanismo e causa.
- 20 pontos — hipótese e resultado positivo.
- 20 pontos — contraprova e falso positivo.
- 20 pontos — defesa, continuidade legítima e reteste.
- 20 pontos — escopo seguro, evidência e limites.

**Erro eliminatório:** afirmar malware ou C2 real a partir de simulação, executar amostras desconhecidas, habilitar rede indevida ou omitir autorização.

**Nota:** sem teste com estudante ou revisor humano independente.
