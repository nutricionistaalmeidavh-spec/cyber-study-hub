# Oficina 06 — Short 9:16 e legendas editáveis

**Integração pronta.** Complementa o laboratório demonstrativo antigo com código reutilizável e arquivos reais de saída. Esta oficina é a entrega prática principal do módulo.

## Código que você vai reutilizar

1. [utilidades / modules/artisys-media/src/index.mjs](https://github.com/nutricionistaalmeidavh-spec/utilidades/blob/9414210529545fed1995a4dfc90efedf6a04918c/modules/artisys-media/src/index.mjs) — Define o tamanho 720 por 1280 e duração; FFmpeg efetua a conversão. **Acesso:** público, MIT. **Modo:** MIT vendorizado em oficinas/vendor/artisys-media/index.mjs.

## Como executar no computador

1. Clone ou baixe o [repositório HubEstudos](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub) na branch `feat/trilha-canal-dark-ia` e abra o terminal na raiz da pasta.
2. Instale Node.js 24+. Para M03/M05/M06, instale também FFmpeg e use terminal Linux/macOS/WSL/Git Bash para scripts .sh.
3. Execute a oficina:

```bash
node public/course-labs/channel-dark/oficinas/workshop.mjs --module 6 --out ./meu-canal
```

4. Confira os arquivos criados dentro de `meu-canal/`:

   - `module-06/vertical-media.json`
   - `module-06/gerar-short.sh`
   - `06-shorts/legendas.srt`

5. **Modificação obrigatória:** Após renderizar M05, execute sh gerar-short.sh em meu-canal/module-06 e revise o SRT com áudio real.
6. **Por quê:** O aluno transforma mídia horizontal em arquivo vertical e aprende a corrigir legendas SRT com a própria narração.

## Integração concreta: quais arquivos copiar e onde encaixar

- **Origem:** `modules/artisys-media/src/index.mjs` no repositório `utilidades` na versão `9414210529545fed1995a4dfc90efedf6a04918c`.
- **Cópia pronta e licenciada:** `public/course-labs/channel-dark/oficinas/vendor/artisys-media/index.mjs` e licença MIT na mesma pasta.
- **Ponto de integração:** `public/course-labs/channel-dark/oficinas/workshop.mjs`, dentro do bloco `if(module===6)`. Modifique a entrada e execute novamente para observar o efeito no arquivo gerado.
- **Execução real (quando necessária):** `public/course-labs/channel-dark/oficinas/ffmpeg-adapter.mjs` para cortes de vídeo; FFmpeg CLI para áudio e Short. As demais integrações usam as funções JS originais do ArtiSys.

## Uso adicional

```bash
Depois de concluir M05: cd meu-canal/module-06 && sh gerar-short.sh
```

## Limites, correção e prova de aprendizado

A prévia vertical pode ficar sem áudio, e o SRT gerado usa tempos estimados até sua revisão.

Execute `npm run test:channel-dark` para verificar comportamentos e erros. Anote no HubEstudos: arquivo de origem, arquivo que você modificou, comando, antes/depois, saída produzida e uma falha que resolveu.

**Gratuidade:** nenhuma assinatura ou API paga é requisito. Os módulos MIT são públicos; os componentes do `frontEnds` são **privados** e aparecem apenas como referências, não são copiados nem necessários. Não forneça credenciais. Antes de publicar conteúdo verifique fatos, licenças comerciais, consentimento e identificação de mídia sintética quando exigida.
