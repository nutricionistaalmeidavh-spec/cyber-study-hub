# Segurança de IA — laboratórios executáveis A201–A208

**Objetivo:** oferecer o mesmo artefato local a cada aula para que o estudante observe uma política determinística. Esse projeto não executa LLM, RAG externo nem conecta serviços reais: é um **harness didático**, não um firewall completo para modelos de IA.

Na raiz do repositório HubEstudos, com Node 22+:

```sh
node --test public/course-labs/a201-208/lab.test.mjs
```

| Aula | Tarefa com artefato real | Verificação / saída esperada |
| --- | --- | --- |
| 201 — Fundamentos | Inspecione `trustedDecision()` e separe modelo de ACL. | Bob não lê `alice-1` (DENIED). |
| 202 — Prompt Injection | Altere só `untrustedContent`; não mude `principal`. | Texto hostil não ganha permissão. |
| 203 — Dados sensíveis | Use apenas tokens fictícios em `scrubOutput()`. | Marca [REDACTED], não vazamento. |
| 204 — RAG | Confira `listAuthorizedDocs('bob')`. | Apenas público + Bob antes da recuperação. |
| 205 — Agentes/Tools | Tente exportar sem aprovação e tool desconhecida. | Approval-required / deny. |
| 206 — Supply Chain | Modifique 1 byte em fixture pinada; reteste SHA-256. | HASH_MISMATCH, nunca PASS. |
| 207 — OWASP GenAI | Associe cada falha a controle concreto, reconhecendo que o harness cobre **parte** dos riscos. | ACL, aprovação e proveniência justificadas. |
| 208 — Capstone | Execute `auditAgentCase` com Alice/Bob e compare logs. | Alice permitida, Bob negado, sem autoridade do modelo. |

## Evidência mínima para cada aula

1. Escreva a hipótese e o resultado previsto.
2. Execute o teste correspondente e capture apenas o nome e o resultado (não credenciais).
3. Alterne um único parâmetro, confirme o cenário negativo, restaure e reteste.
4. Explique o controle, a limitação da simulação e como verificar no seu sistema *local/autorizado*.

**Kit de extensão opcional:** `utilidades/modules/artisys-ai-quality`, `artisys-auth-rbac`, `artisys-privacy` e `artisysScan` oferecem referências técnicas e QA; **não** são dependências deste experimento. Um modelo local (Ollama) ou uma conta paga não são necessários.

**Segurança:** sem dados pessoais, chaves, rede externa, execução de comandos de agentes nem alterações de filesystem. Os testes provam apenas as funções determinísticas do harness. Não afirme que comprovam resistência geral a prompt injection em um modelo real.
