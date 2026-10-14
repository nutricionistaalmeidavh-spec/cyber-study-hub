# Gabarito independente — AULA-081: Wireshark

> Consulte somente depois de executar a oficina. Parecer automatizado/assistido por IA; não certificado de competência de estudantes.

## Respostas e evidência mínima

### Questão 1 (15 pontos)

protocol TCP + stream 7; dois pacotes.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 2 (15 pontos)

Nenhum byte do PCAP: é uma operação de visualização.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 3 (15 pontos)

Cobertura/interface incorreta, TLS, perda de pacotes ou HTTP ausente são hipóteses; DNS não prova HTTP.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 4 (15 pontos)

Horário, IP/porta de origem, destino e identificador ou rota do request.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 5 (20 pontos)

Somente registros cifrados sem material de decriptação não expõem payload HTTP.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 6 (20 pontos)

Repetir requisição local com interface e janela controladas; comparar PCAP e log.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

## Rubrica de correção

- Q1–Q4: 15 pontos por resposta com a relação correta entre entrada, decisão e evidência.
- Q5–Q6: 20 pontos por resposta com refutação, segurança operacional e reteste mensurável.
- Parcial: metade dos pontos se acertar a decisão mas omitir a explicação técnica.
- Zero: afirmação incompatível com o cenário ou sem justificativa.
- **Erro eliminatório:** Tratar DNS ou a presença de TCP como prova suficiente de conteúdo ou comprometimento.
- Avalie consistência e justificativa; não atribua nota de domínio humano sem prova independente.

## Limites da oficina

O modelo filtra registros sintéticos, não abre PCAP nem decodifica protocolos. Filtros de captura (BPF) não são equivalentes a display filters.

Fonte técnica: https://www.wireshark.org/docs/man-pages/wireshark-filter.html
