# Oficinas defensivas A121–130

Requer **Node.js 22+**, arquivos locais, nenhum serviço pago e nenhuma ligação de rede. Não é necessário instalar Windows, ferramentas de RE nem abrir executáveis de terceiros para estas oficinas. Nenhuma chave privada real é distribuída.

```sh
node public/course-labs/a121-130/run.mjs 121
node --test public/course-labs/a121-130/labs.test.mjs
```

Substitua 121 por 122 até 130. Os testes 126/127 geram pares Ed25519 efêmeros em memória com o Node.js; não validam assinaturas de terceiros e não guardam nem compartilham segredos. O exercício 130 complementa — **não substitui** — o laboratório capstone Linux/ELF já presente em `phase16-memory`.

As saídas `legitimate`, `contrast`, `retest` e `limit` mostram decisões de risco e verificação positiva/negativa. São modelos didáticos para fins defensivos, não ferramentas de evasão de VM/debugger, bypass de licença nem unpacking operacional. Não inferir comprometimento, proveniência ou segurança de software real a partir de um modelo sintético.
