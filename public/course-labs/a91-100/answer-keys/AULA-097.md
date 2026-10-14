# AULA-097 — gabarito independente: EDR e telemetria

## Questão 1
Sem alerta, uma regra pode ter analisado registros e não satisfeito a condição. Sem telemetria, não houve observação; reportar `no_telemetry` em vez de saúde.

## Questão 2
`parentGuid` associa o processo ao criador e sustenta reconstrução de cadeia. Se está ausente, a correlação pode ficar impossível ou enviesada; registrar `coverage_gap`.

## Questão 3
Heartbeat por host, atraso temporal, integridade de esquema, contagem de eventos, fonte, versão e preenchimento dos campos.

## Questão 4
Denominador deve ser a frota inventariada. No caso, 100/120 possuem cobertura completa, 15/120 parcial e 5/120 sem dados; esconder os 20 produziria métrica enganosa.

## Questão 5
Conferir evidência corroborada, risco operacional, autorização formal, impacto e alternativas proporcionais.

## Questão 6
`edrCoverage([eventoCompleto])` retorna usable; objeto sem parentGuid retorna coverage_gap; lista vazia retorna no_telemetry. Isso prova apenas a lógica do simulador.

## Rubrica de correção — 100 pontos
- Conceito de cobertura e ausência de dados: 20.
- Entradas e evidências positivas: 20.
- Casos negativos e falso senso de segurança: 20.
- Defesa, healthcheck e reteste: 20.
- Limites, proporções e fontes: 20.

**Erro eliminatório:** alegar que sensor sem eventos comprovou normalidade.

Referência: https://learn.microsoft.com/en-us/defender-endpoint/advanced-hunting-schema-tables
