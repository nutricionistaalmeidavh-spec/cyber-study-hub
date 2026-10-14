# Gabarito independente — AULA-082: IDS/IPS com Suricata

> Consulte somente depois de executar a oficina. Parecer automatizado/assistido por IA; não certificado de competência de estudantes.

## Respostas e evidência mínima

### Questão 1 (15 pontos)

Somente o GET HTTP estabelecido, indo ao servidor.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 2 (15 pontos)

Combina direção/estado/protocolo e reduz match fora de contexto.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 3 (15 pontos)

Alert é ação de detecção; bloqueio depende de rule action e sensor inline.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 4 (15 pontos)

Testar POST benigno, GET benigno e fluxo incompleto sob escopo local.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 5 (20 pontos)

SID, flow_id, origem/destino, porta e timestamp.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 6 (20 pontos)

Verificar modo inline, segurança operacional, rollback, medição de impacto e taxa de FP.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

## Rubrica de correção

- Q1–Q4: 15 pontos por resposta com a relação correta entre entrada, decisão e evidência.
- Q5–Q6: 20 pontos por resposta com refutação, segurança operacional e reteste mensurável.
- Parcial: metade dos pontos se acertar a decisão mas omitir a explicação técnica.
- Zero: afirmação incompatível com o cenário ou sem justificativa.
- **Erro eliminatório:** Confundir o alerta do modo IDS com bloqueio IPS efetivo.
- Avalie consistência e justificativa; não atribua nota de domínio humano sem prova independente.

## Limites da oficina

Modelo de eventos normalizados, não interpreta PCAP nem reproduz o motor Suricata. IPS exige implantação e validação separadas.

Fonte técnica: https://docs.suricata.io/en/latest/rules/intro.html
