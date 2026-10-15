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

## Oficinas por ID canônico (P2)

- [AULA-181 — Red Team Methodology](./workshops/AULA-181.md)
- [AULA-182 — Adversary Emulation](./workshops/AULA-182.md)
- [AULA-183 — Initial Access em laboratório](./workshops/AULA-183.md)
- [AULA-184 — Privilege Escalation em laboratório](./workshops/AULA-184.md)
- [AULA-185 — Persistence — ofensivo e defensivo](./workshops/AULA-185.md)
- [AULA-186 — Credential Access — conceitos e defesa](./workshops/AULA-186.md)
- [AULA-187 — Lateral Movement em laboratório](./workshops/AULA-187.md)
- [AULA-188 — Defense Evasion — conceitos e telemetria](./workshops/AULA-188.md)
- [AULA-189 — Arquitetura conceitual de C2](./workshops/AULA-189.md)
- [AULA-190 — Capstone — Purple Team Exercise](./workshops/AULA-190.md)

A execução demonstrável por aula é `node public/course-labs/a181-190/run.mjs 181` (substitua o ID), seguida de `node --test public/course-labs/a181-190/run.test.mjs`. Emulação ativa e ferramentas ofensivas não são requisito nem são executadas.
