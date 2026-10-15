# Laboratório 07 — Automação com n8n e Node-RED

**Objetivo:** Criar pipeline idempotente de produção em Node-RED e comparar n8n fair-code, Python e Modal sem dependências de nuvem.

**Percurso obrigatório:** R$ 0, núcleo gratuito e local, sem serviço pago, API ou GPU. O aluno mantém arquivos e log próprios.

## Procedimento

1. Desenhe gratuitamente em Node-RED ou arquivo JSON estados e eventos de um episódio.
2. Crie entrada de pauta local e saída para pasta pendente_de_revisao, sem credenciais externas.
3. Teste duas execuções com o mesmo id e impeça que sejam criados dois jobs.
4. Implemente aprovação humana e simule falha de render e retomada com log.

## Evidências e aceite

- [ ] Há fluxo local sem conta em serviço pago
- [ ] Estado de aprovação controla o próximo passo
- [ ] Repetição de evento não duplica job
- [ ] Existem log e tratamento de falha
- [ ] Licença do n8n e custo do Modal estão documentados

## Recursos

- **Node-RED** (grátis local): Orquestração open source self-hosted. https://nodered.org/
- **Python** (grátis local): Tarefas locais e filas simples. https://www.python.org/
- **SQLite** (grátis local): Controle de idempotência. https://www.sqlite.org/
- **n8n** (opcional): Self-hosted gratuito sob licença fair-code, não OSI. https://docs.n8n.io/hosting/
- **Modal** (opcional): Nuvem com créditos e cobrança por excedente. https://modal.com/pricing

## Desafio de transferência

Um webhook chega três vezes e o fluxo gera três publicações. Como torná-lo idempotente sem esconder erros?

## Segurança e conformidade

Não envie senhas, tokens ou dados privados para assistentes. Verifique licenças de todos os ativos. Publicação depende de aprovação humana. Serviços em nuvem têm limites e cobrança variável; não são necessários ao laboratório.



## Laboratório executável, versão gratuita e reproduzível

**Pré-requisito:** Node.js 20+ instalado gratuitamente no computador. Abra o terminal na pasta raiz do repositório `cyber-study-hub`. **A mídia e os dados são demonstrativos; não publique o resultado sem revisão.**

Execute:

```bash
node public/course-labs/channel-dark/engine.mjs --module 7 --out ./meu-canal
```

**Saída esperada:** `07-automacao/fila.json (status pendente_revisao e aprovação false)` dentro de `meu-canal/`. A mensagem no terminal indica onde os arquivos foram criados.

**Critério verificável:** Segundo evento com mesmo ID mantém fila com apenas uma tarefa.

**Interpretação:** A fila didática funciona sem depender de Node-RED, n8n ou webhook externos. Replique o modelo visualmente nos orquestradores somente depois do teste local.

**Teste independente dos exemplos e dos casos negativos:**

```bash
npm run test:channel-dark
```

## Diagnóstico e recuperação

- Mesmo webhook cria duas tarefas
- Use id estável; queueJob retorna created:false e um único evento
- Ao falhar, repita o mesmo id em vez de gerar novo id

## Evidência a anexar ao registro da aula

Anote a entrada, o comando executado, o arquivo encontrado, a diferença entre previsão e resultado, a revisão humana pendente e como corrigiria o caso negativo. O teste automatizado demonstra apenas comportamento do kit; não comprova qualidade da narração, direitos comerciais, veracidade das fontes nem aceitação do público.
