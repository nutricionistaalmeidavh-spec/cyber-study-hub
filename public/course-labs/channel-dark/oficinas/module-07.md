# Oficina 07 — Fluxo de produção e aprovação

**Integração pronta.** Complementa o laboratório demonstrativo antigo com código reutilizável e arquivos reais de saída. Esta oficina é a entrega prática principal do módulo.

## Código que você vai reutilizar

1. [utilidades / modules/artisys-workflow-engine/src/index.mjs](https://github.com/nutricionistaalmeidavh-spec/utilidades/blob/9414210529545fed1995a4dfc90efedf6a04918c/modules/artisys-workflow-engine/src/index.mjs) — Implementa transições, guardas e histórico para que a aprovação não seja pulada. **Acesso:** público, MIT. **Modo:** MIT vendorizado em oficinas/vendor/artisys-workflow-engine/index.mjs.

2. [utilidades / modules/artisys-approvals/src/index.mjs](https://github.com/nutricionistaalmeidavh-spec/utilidades/blob/9414210529545fed1995a4dfc90efedf6a04918c/modules/artisys-approvals/src/index.mjs) — Cria solicitação pendente e registra quem decidiu uma aprovação no cenário de estudo. **Acesso:** público, MIT. **Modo:** MIT vendorizado em oficinas/vendor/artisys-approvals/index.mjs.

## Como executar no computador

1. Clone ou baixe o [repositório HubEstudos](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub) na branch `feat/trilha-canal-dark-ia` e abra o terminal na raiz da pasta.
2. Instale Node.js 24+. Para M03/M05/M06, instale também FFmpeg e use terminal Linux/macOS/WSL/Git Bash para scripts .sh.
3. Execute a oficina:

```bash
node public/course-labs/channel-dark/oficinas/workshop.mjs --module 7 --out ./meu-canal
```

4. Confira os arquivos criados dentro de `meu-canal/`:

   - `module-07/fluxo.json`
   - `module-07/aprovacao.json`
   - `07-automacao/fila.json`

5. **Modificação obrigatória:** Estude makeWorkflow e createApprovalDemonstration em workshop.mjs; teste aprovação com human:false e confirme o bloqueio.
6. **Por quê:** O aluno integra estados e aprovações reutilizáveis para evitar publicação duplicada ou sem revisão.

## Integração concreta: quais arquivos copiar e onde encaixar

- **Origem:** `modules/artisys-workflow-engine/src/index.mjs` no repositório `utilidades` na versão `9414210529545fed1995a4dfc90efedf6a04918c`.
- **Cópia pronta e licenciada:** `public/course-labs/channel-dark/oficinas/vendor/artisys-workflow-engine/index.mjs` e licença MIT na mesma pasta.
- **Ponto de integração:** `public/course-labs/channel-dark/oficinas/workshop.mjs`, dentro do bloco `if(module===7)`. Modifique a entrada e execute novamente para observar o efeito no arquivo gerado.
- **Execução real (quando necessária):** `public/course-labs/channel-dark/oficinas/ffmpeg-adapter.mjs` para cortes de vídeo; FFmpeg CLI para áudio e Short. As demais integrações usam as funções JS originais do ArtiSys.

## Limites, correção e prova de aprendizado

Sem autenticação e persistência de produção. n8n e Node-RED são camadas de orquestração opcionais a construir.

Execute `npm run test:channel-dark` para verificar comportamentos e erros. Anote no HubEstudos: arquivo de origem, arquivo que você modificou, comando, antes/depois, saída produzida e uma falha que resolveu.

**Gratuidade:** nenhuma assinatura ou API paga é requisito. Os módulos MIT são públicos; os componentes do `frontEnds` são **privados** e aparecem apenas como referências, não são copiados nem necessários. Não forneça credenciais. Antes de publicar conteúdo verifique fatos, licenças comerciais, consentimento e identificação de mídia sintética quando exigida.

## Fluxos prontos para importar: Node-RED e n8n

- `module-07/node-red-flow.json`: menu Import do Node-RED. Clique duas vezes no nó manual: um job pendente é criado e o segundo evento com mesmo ID é ignorado. Usa `flow.get` em memória; configure persistência antes de produção.
- `module-07/n8n-workflow.json`: menu Import from File do n8n. O workflow vem inativo, é disparado manualmente e apenas prepara um item pendente para revisão. Não tem upload nem idempotência persistente.

n8n é fair-code (não OSI). O fluxo é um ponto de partida de estudo, não um sistema publicado: para produção é preciso storage durável, autenticação de revisor e tratamento de falhas.
