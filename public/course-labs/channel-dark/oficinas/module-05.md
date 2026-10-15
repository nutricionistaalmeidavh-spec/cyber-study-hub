# Oficina 05 — Edição: contrato ArtiSys + FFmpeg funcionando

**Integração pronta.** Complementa o laboratório demonstrativo antigo com código reutilizável e arquivos reais de saída. Esta oficina é a entrega prática principal do módulo.

## Código que você vai reutilizar

1. [utilidades / modules/artisys-video-engine/src/index.mjs](https://github.com/nutricionistaalmeidavh-spec/utilidades/blob/9414210529545fed1995a4dfc90efedf6a04918c/modules/artisys-video-engine/src/index.mjs) — Compila contratos de vídeo e permite que um adapter execute um job concreto. **Acesso:** público, MIT. **Modo:** MIT vendorizado em oficinas/vendor/artisys-video-engine/index.mjs.

2. [utilidades / modules/artisys-media/src/index.mjs](https://github.com/nutricionistaalmeidavh-spec/utilidades/blob/9414210529545fed1995a4dfc90efedf6a04918c/modules/artisys-media/src/index.mjs) — Mantém configurações de mídia separadas do executor físico, permitindo outras saídas. **Acesso:** público, MIT. **Modo:** MIT vendorizado em oficinas/vendor/artisys-media/index.mjs.

## Como executar no computador

1. Clone ou baixe o [repositório HubEstudos](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub) na branch `feat/trilha-canal-dark-ia` e abra o terminal na raiz da pasta.
2. Instale Node.js 24+. Para M03/M05/M06, instale também FFmpeg e use terminal Linux/macOS/WSL/Git Bash para scripts .sh.
3. Execute a oficina:

```bash
node public/course-labs/channel-dark/oficinas/workshop.mjs --module 5 --out ./meu-canal
```

4. Confira os arquivos criados dentro de `meu-canal/`:

   - `module-05/video-job.json`
   - `module-05/corte-final.mp4 (após executar o adaptador)`

5. **Modificação obrigatória:** Gere vídeo com sh render.sh em meu-canal/05-video; execute o comando do adaptador indicado abaixo e abra o MP4.
6. **Por quê:** O aluno vê a diferença entre descrever um trabalho de vídeo e executá-lo com FFmpeg por meio de um adaptador.

## Integração concreta: quais arquivos copiar e onde encaixar

- **Origem:** `modules/artisys-video-engine/src/index.mjs` no repositório `utilidades` na versão `9414210529545fed1995a4dfc90efedf6a04918c`.
- **Cópia pronta e licenciada:** `public/course-labs/channel-dark/oficinas/vendor/artisys-video-engine/index.mjs` e licença MIT na mesma pasta.
- **Ponto de integração:** `public/course-labs/channel-dark/oficinas/workshop.mjs`, dentro do bloco `if(module===5)`. Modifique a entrada e execute novamente para observar o efeito no arquivo gerado.
- **Execução real (quando necessária):** `public/course-labs/channel-dark/oficinas/ffmpeg-adapter.mjs` para cortes de vídeo; FFmpeg CLI para áudio e Short. As demais integrações usam as funções JS originais do ArtiSys.

## Uso adicional

```bash
1) cd meu-canal/05-video && sh render.sh
2) Retorne à raiz do HubEstudos e execute: node public/course-labs/channel-dark/oficinas/ffmpeg-adapter.mjs --input ./meu-canal/05-video/episodio-demo-sem-audio.mp4 --output ./meu-canal/module-05/corte-final.mp4 --start 0 --end 3
```

## Limites, correção e prova de aprendizado

Adaptador suporta corte MP4; concatenação básica acontece no render.sh do módulo; não há Pika, Flow ou Steve AI embutidos.

Execute `npm run test:channel-dark` para verificar comportamentos e erros. Anote no HubEstudos: arquivo de origem, arquivo que você modificou, comando, antes/depois, saída produzida e uma falha que resolveu.

**Gratuidade:** nenhuma assinatura ou API paga é requisito. Os módulos MIT são públicos; os componentes do `frontEnds` são **privados** e aparecem apenas como referências, não são copiados nem necessários. Não forneça credenciais. Antes de publicar conteúdo verifique fatos, licenças comerciais, consentimento e identificação de mídia sintética quando exigida.
