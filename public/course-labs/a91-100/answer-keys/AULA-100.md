# AULA-100 — gabarito: Detection Engineering aplicado

1. Detectar relação document_editor → script_runner sem automação aprovada, exigindo parentRole, childRole, approvedAutomation e sensorHealthy.
2. A relação também ocorre em tarefas legítimas, e approvedAutomation distingue casos autorizados; a exceção deve ter escopo e evidência.
3. SensorHealthy falso significa insuficiência de dados para interpretar o evento; retorno insufficient_data, não normalidade.
4. Registrar finalidade, proprietário, identificador específico, vigência, condição de expiração e reteste periódico.
5. Hipótese, fonte, campos, lógica, fixtures positivas e negativas, versão, proprietário, referência, risco, plano de triagem e histórico de tuning.
6. Executar casos de alerta, rotina aprovada e sensor indisponível em cada versão, comparar saídas e documentar diferenças pretendidas.

## Rubrica de correção (100 pontos)

- Hipótese e contrato de dados: 20.
- Fixture positiva com decisão rastreável: 20.
- Controle negativo de contexto legítimo: 20.
- Tratamento de ausência de sensor e reteste: 20.
- Documentação e limites operacionais: 20.

**Erro eliminatório:** substituir insufficient_data por no_alert quando o sensor está fora, ou omitir controle negativo de rotina autorizada.

Referência complementar: https://sigmahq.io/docs/basics/rules.html
