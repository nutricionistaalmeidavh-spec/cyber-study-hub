# Oficinas reutilizáveis — origens e licenças

Os oito módulos copiados de [utilidades](https://github.com/nutricionistaalmeidavh-spec/utilidades/tree/9414210529545fed1995a4dfc90efedf6a04918c) provêm do commit `9414210529545fed1995a4dfc90efedf6a04918c`. Cada arquivo `vendor/artisys-*/index.mjs` tem licença correspondente `vendor/artisys-*/LICENSE` (MIT). Os novos arquivos `workshop.mjs` e `ffmpeg-adapter.mjs` compõem operações úteis sobre esse código.

O [frontEnds](https://github.com/nutricionistaalmeidavh-spec/frontEnds) é privado. **Nenhum código do frontEnds foi copiado ou tornado público**; os links nos guias exigem acesso concedido pelo proprietário e são opcionais. A oficina pública opera sem esses componentes.

O motor Video Engine implementa o **contrato** de um job, enquanto FFmpeg mais nosso adapter executam o vídeo. ArtiSys AI Quality gera configuração sem executar o modelo. ArtiSys Media cria contrato e manifesto, sem executar TTS. Os artefatos são locais, sem publicação ou conexões ao YouTube.

```bash
node public/course-labs/channel-dark/oficinas/workshop.mjs --module 1 --out ./meu-canal
npm run test:channel-dark
```
