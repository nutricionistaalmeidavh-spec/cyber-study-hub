# Laboratórios A071–080 — segurança e telemetria

Este pacote usa somente **Node.js 22+**, arquivos locais e dados inteiramente sintéticos. Nenhuma conexão AD, conta, licença Windows, credencial, domínio externo ou API comercial é necessária.

```sh
node public/course-labs/a071-080/run.mjs 71
node --test public/course-labs/a071-080/lab.test.mjs
```

Troque o número de 71 até 80. Antes de cada execução escreva hipóteses para `legitimate`, `contrast` e `retest`; a explicação detalhada está na aula e o gabarito da prova independente em `answer-keys/AULA-*.md`.

**Validade:** modelos de decisão isolados, NÃO ambiente Windows/AD/Kerberos/LDAP/Sysmon operacional. Não simulam detalhes de criptografia, autorização real, ordenação completa de GPO ou cobertura de telemetria na produção. Cenários são leituras e defesas, não técnicas de intrusão. Nenhum comando tem efeitos em hosts ou redes.
