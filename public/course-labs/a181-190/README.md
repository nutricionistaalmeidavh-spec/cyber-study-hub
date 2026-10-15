# Laboratórios A181–A190 — Red / Purple Team com telemetria fictícia

**Não são técnicas ativas em rede.** O pacote modela eventos sintéticos de uma organização com dois ativos de laboratório (`LAB01`/`LAB02`) e critérios de detecção. Não cria tarefas agendadas, não coleta credenciais, não movimenta lateralmente e não inicia C2.

```sh
node --test public/course-labs/a181-190/lab.test.mjs
```

| Aula | Atividade | Comprovação |
| --- | --- | --- |
| 181 Methodology | Escrever escopo e ROE de `LAB01`/`LAB02`. | `inScope()` aceita cenário previsto e rejeita externo. |
| 182 Adversary Emulation | Definir hipótese e evento benigno de referência. | Sem acionamento de ferramenta ofensiva. |
| 183 Initial Access | Classificar evento `unapproved-login`. | ALERTA em fixture, não tentativa real. |
| 184 Escalada | Classificar `unexpected-privilege`. | Distinguir desvio de privilégio e conta legítima. |
| 185 Persistence | Analisar `new-persistence` fictício. | Positivo + controle negativo `normal-service`. |
| 186 Credential Access | Usar categoria `credential-read` sem ler secrets. | Regra aciona review e não expõe dados. |
| 187 Lateral Movement | Avaliar `remote-hop` fictício. | Matriz de alcance; não há host externo. |
| 188 Defense Evasion | Remover uma observação na fixture. | `INCOMPLETE_TELEMETRY`, nunca falso PASS. |
| 189 C2 | Desenhar fluxo conceitual de controle e detecção. | Somente JSON, sem comunicação de rede. |
| 190 Purple Team | Consolidar relatório com sinais e limitações. | `buildPurpleReport` totaliza e marca incompletude. |

**Kit prático opcional:** `artisysScan` oferece coleta de evidências em aplicações autorizadas e `utilidades/modules/artisys-qa` suporte aos checks locais. **Não são plataformas Red Team.** Para um laboratório ativo, seria necessário ambiente próprio preparado e autorização explícita, fora deste conjunto seguro.

Entregável A editorial: hipótese, caso válido, negativo, evento, regra de detecção, falha do registro e decisão. Testes sintéticos não comprovam detecção em SIEM real.
