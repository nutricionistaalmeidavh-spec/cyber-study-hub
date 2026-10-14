# Gabarito independente — AULA-083: SIEM

> Consulte somente depois de executar a oficina. Parecer automatizado/assistido por IA; não certificado de competência de estudantes.

## Respostas e evidência mínima

### Questão 1 (15 pontos)

Ana/pc1 tem 3 falhas; bia/pc1 tem 2 e não alcança limiar.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 2 (15 pontos)

A chave fica inconsistente e pode quebrar agrupamentos; medir nulls e normalizar.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 3 (15 pontos)

Erro humano, automação e ataque podem produzir falhas; precisa de contexto.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 4 (15 pontos)

Com duas falhas restantes o alerta deve desaparecer.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 5 (20 pontos)

Taxa de ingestão, última chegada, atrasos e saúde da fonte.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

### Questão 6 (20 pontos)

Mesmas janelas, mesma normalização, positivos/negativos, registrar exceção justificada.

**Critério:** citar explicitamente o dado, a hipótese ou controle e a limitação; não basta repetir o nome da ferramenta.

## Rubrica de correção

- Q1–Q4: 15 pontos por resposta com a relação correta entre entrada, decisão e evidência.
- Q5–Q6: 20 pontos por resposta com refutação, segurança operacional e reteste mensurável.
- Parcial: metade dos pontos se acertar a decisão mas omitir a explicação técnica.
- Zero: afirmação incompatível com o cenário ou sem justificativa.
- **Erro eliminatório:** Tratar alerta correlacionado como confirmação automática de invasão.
- Avalie consistência e justificativa; não atribua nota de domínio humano sem prova independente.

## Limites da oficina

Contador sintético por minutos, não SIEM real nem query KQL executada. Não modela timezone, ingestão tardia ou duplicação.

Fonte técnica: https://www.elastic.co/guide/en/security/current/detection-engine-overview.html
