# Laboratório 05 — Vídeo com IA: Pika, Flow e Steve

**Objetivo:** Comparar vídeos generativos comerciais e modelos locais sem tornar serviços online necessários para concluir o módulo.

**Percurso obrigatório:** R$ 0; conteúdo original, computador local e ferramentas gratuitas. Nenhum serviço externo pago é requisito.

## Antes de executar

Núcleo R$ 0: produza duas imagens autorais (ou SVG), gere dois trechos de 5 segundos com FFmpeg/Kdenlive e junte-os. Compare serviços apenas depois. Faça a ficha de créditos e licença sem exigir cadastro.

## Procedimento

1. Monte gratuitamente duas cenas em imagem própria e defina suas durações.
2. Crie vídeo local com FFmpeg ou exporte pelo Kdenlive, sem necessidade de modelo de geração.
3. Preencha uma ficha comparativa de Pika, Google Flow, Steve AI e um modelo local.
4. Substitua mentalmente qualquer serviço indisponível pela cena local e documente por que a narrativa continua válida.

## Evidências e aceite

- [ ] Há vídeo de duas cenas no percurso gratuito
- [ ] Licenças das imagens foram verificadas
- [ ] Pika, Flow e Steve constam somente como comparação
- [ ] Alternativa sem GPU foi documentada
- [ ] Vídeo mantém sentido narrativo sem serviço pago

## Ferramentas para conhecer

- **FFmpeg** — núcleo gratuito/local. Render local sem GPU obrigatória. https://ffmpeg.org/
- **Kdenlive** — núcleo gratuito/local. Montagem local. https://kdenlive.org/en/
- **ComfyUI** — opcional, validar custos/licença/hardware. Interface local para modelos que exigem hardware. https://github.com/comfyanonymous/ComfyUI
- **Wan 2.2** — opcional, validar custos/licença/hardware. Pesos/modelos de vídeo; conferir licença e VRAM. https://github.com/Wan-Video/Wan2.2
- **Pika** — opcional, validar custos/licença/hardware. Free não inclui licença comercial no plano consultado. https://pika.art/pricing
- **Google Flow** — opcional, validar custos/licença/hardware. Créditos gratuitos limitados, acesso por conta. https://labs.google/fx/tools/flow
- **Steve AI** — opcional, validar custos/licença/hardware. Freemium de geração/montagem de vídeo. https://www.steve.ai/
- **Runway** — opcional, validar custos/licença/hardware. Ferramenta comercial opcional. https://runwayml.com/pricing

## Transferência

O plano gratuito de uma ferramenta não oferece licença comercial. Monte um plano de contingência para publicar sem usá-la.

## Política de publicação

Não publique automaticamente. Confira fatos, consentimento, direitos de mídia, licenças comerciais, eventuais exigências de identificação de IA e aprovação editorial humana. Se usar ferramentas externas, não envie segredos nem dados de terceiros.



## Laboratório executável, versão gratuita e reproduzível

**Pré-requisito:** Node.js 20+ instalado gratuitamente no computador. Abra o terminal na pasta raiz do repositório `cyber-study-hub`. **A mídia e os dados são demonstrativos; não publique o resultado sem revisão.**

Execute:

```bash
node public/course-labs/channel-dark/engine.mjs --module 5 --out ./meu-canal
```

**Saída esperada:** `05-video/scene-01.ppm + 05-video/scene-02.ppm + 05-video/render.sh` dentro de `meu-canal/`. A mensagem no terminal indica onde os arquivos foram criados.

**Critério verificável:** Há dois arquivos de imagem válidos e um comando que renderiza vídeo sem API.

**Interpretação:** As cenas .ppm são imagens sintéticas produzidas localmente com Node. `sh render.sh` cria vídeo de demonstração **sem narração**, que ainda requer edição e revisão.

**Gerar vídeo efetivo:** após instalar FFmpeg, execute `cd meu-canal/05-video && sh render.sh` no terminal Linux/macOS/WSL/Git Bash. O arquivo produzido chama-se `episodio-demo-sem-audio.mp4`. O material ainda precisa de narração, revisão de conteúdo e direitos.

**Teste independente dos exemplos e dos casos negativos:**

```bash
npm run test:channel-dark
```

## Diagnóstico e recuperação

- FFmpeg não localizado
- Instale a versão gratuita do FFmpeg, confira ffmpeg -version e rode novamente o script
- Não confunda prévia sem narração com episódio pronto

## Evidência a anexar ao registro da aula

Anote a entrada, o comando executado, o arquivo encontrado, a diferença entre previsão e resultado, a revisão humana pendente e como corrigiria o caso negativo. O teste automatizado demonstra apenas comportamento do kit; não comprova qualidade da narração, direitos comerciais, veracidade das fontes nem aceitação do público.
