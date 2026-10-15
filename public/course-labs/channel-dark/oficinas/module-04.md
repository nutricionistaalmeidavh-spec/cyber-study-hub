# Oficina 04 — Storyboard, cenas e thumbnail própria

**Integração pronta.** Complementa o laboratório demonstrativo antigo com código reutilizável e arquivos reais de saída. Esta oficina é a entrega prática principal do módulo.

## Código que você vai reutilizar

1. [utilidades / modules/artisys-media/src/index.mjs](https://github.com/nutricionistaalmeidavh-spec/utilidades/blob/9414210529545fed1995a4dfc90efedf6a04918c/modules/artisys-media/src/index.mjs) — Monta o manifesto determinístico de cenas com resolução e duração definidas. **Acesso:** público, MIT. **Modo:** MIT vendorizado em oficinas/vendor/artisys-media/index.mjs.

2. [frontEnds / library/marketing-sections/components.tsx](https://github.com/nutricionistaalmeidavh-spec/frontEnds/blob/7f783aff53959cc716412dd20b2fb753850a1969/library/marketing-sections/components.tsx) — Pode dar identidade à futura página de apresentação do canal, se houver acesso privado. **Acesso:** privado, exige permissão. **Modo:** referência de UI opcional, sem cópia para o HubEstudos.

## Como executar no computador

1. Clone ou baixe o [repositório HubEstudos](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub) na branch `feat/trilha-canal-dark-ia` e abra o terminal na raiz da pasta.
2. Instale Node.js 24+. Para M03/M05/M06, instale também FFmpeg e use terminal Linux/macOS/WSL/Git Bash para scripts .sh.
3. Execute a oficina:

```bash
node public/course-labs/channel-dark/oficinas/workshop.mjs --module 4 --out ./meu-canal
```

4. Confira os arquivos criados dentro de `meu-canal/`:

   - `module-04/motion-canvas.json`
   - `module-04/thumbnail.svg`

5. **Modificação obrigatória:** Abra o SVG no navegador ou editor, altere texto e cores; substitua os IDs de cena no manifesto.
6. **Por quê:** O aluno entrega um SVG editável e um manifesto de cenas que alimenta ferramentas de animação, preservando autoria visual.

## Integração concreta: quais arquivos copiar e onde encaixar

- **Origem:** `modules/artisys-media/src/index.mjs` no repositório `utilidades` na versão `9414210529545fed1995a4dfc90efedf6a04918c`.
- **Cópia pronta e licenciada:** `public/course-labs/channel-dark/oficinas/vendor/artisys-media/index.mjs` e licença MIT na mesma pasta.
- **Ponto de integração:** `public/course-labs/channel-dark/oficinas/workshop.mjs`, dentro do bloco `if(module===4)`. Modifique a entrada e execute novamente para observar o efeito no arquivo gerado.
- **Execução real (quando necessária):** `public/course-labs/channel-dark/oficinas/ffmpeg-adapter.mjs` para cortes de vídeo; FFmpeg CLI para áudio e Short. As demais integrações usam as funções JS originais do ArtiSys.

## Limites, correção e prova de aprendizado

O manifesto Motion Canvas é um contrato de cenas, não um renderizador.

Execute `npm run test:channel-dark` para verificar comportamentos e erros. Anote no HubEstudos: arquivo de origem, arquivo que você modificou, comando, antes/depois, saída produzida e uma falha que resolveu.

**Gratuidade:** nenhuma assinatura ou API paga é requisito. Os módulos MIT são públicos; os componentes do `frontEnds` são **privados** e aparecem apenas como referências, não são copiados nem necessários. Não forneça credenciais. Antes de publicar conteúdo verifique fatos, licenças comerciais, consentimento e identificação de mídia sintética quando exigida.
