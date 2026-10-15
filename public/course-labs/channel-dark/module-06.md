# Laboratório 06 — Edição, legendas e Shorts

**Objetivo:** Montar episódio e Short derivado com áudio sincronizado, legendas revisadas e configurações de exportação reproduzíveis.

**Percurso obrigatório:** R$ 0; conteúdo original, computador local e ferramentas gratuitas. Nenhum serviço externo pago é requisito.

## Antes de executar

Monte com FFmpeg ou Kdenlive usando mídia e áudio aprovados. Arquive canal/episodio-piloto.mp4 e canal/short-piloto.mp4. Inclua um SRT revisado e um arquivo de comandos ou lista de passos.

## Procedimento

1. Organize gratuitamente uma pasta com narração, duas cenas, roteiro e assets autorizados.
2. Monte sequência em 16:9 e exporte a versão do episódio piloto.
3. Gere ou escreva um SRT curto, ajuste três timestamps e revise texto comparando com o áudio.
4. Prepare um Short 9:16 que responda uma pergunta completa sem exigir ter assistido ao episódio.

## Evidências e aceite

- [ ] Áudio está sincronizado com as cenas
- [ ] Legenda revisada não contém erros críticos
- [ ] Existe versão vertical com contexto próprio
- [ ] Arquivos-fonte e receita de edição permanecem disponíveis
- [ ] Edição básica funciona offline e sem custo

## Ferramentas para conhecer

- **FFmpeg** — núcleo gratuito/local. Montagem e exportação reproduzíveis. https://ffmpeg.org/
- **whisper.cpp** — núcleo gratuito/local. Transcrição offline. https://github.com/ggml-org/whisper.cpp
- **Kdenlive** — núcleo gratuito/local. Editor gráfico local. https://kdenlive.org/en/
- **Steve AI** — opcional, validar custos/licença/hardware. Montagem comercial como comparação. https://www.steve.ai/

## Transferência

No Short, a legenda encobre parte relevante da cena. Corrija a hierarquia e a área segura sem perder acessibilidade.

## Política de publicação

Não publique automaticamente. Confira fatos, consentimento, direitos de mídia, licenças comerciais, eventuais exigências de identificação de IA e aprovação editorial humana. Se usar ferramentas externas, não envie segredos nem dados de terceiros.



## Laboratório executável, versão gratuita e reproduzível

**Pré-requisito:** Node.js 20+ instalado gratuitamente no computador. Abra o terminal na pasta raiz do repositório `cyber-study-hub`. **A mídia e os dados são demonstrativos; não publique o resultado sem revisão.**

Execute:

```bash
node public/course-labs/channel-dark/engine.mjs --module 6 --out ./meu-canal
```

**Saída esperada:** `06-shorts/legendas.srt + 06-shorts/exportar-vertical.sh` dentro de `meu-canal/`. A mensagem no terminal indica onde os arquivos foram criados.

**Critério verificável:** Há um SRT sintaticamente válido e um arquivo de comando para 9:16.

**Interpretação:** O SRT é estimado, não alinhado por reconhecimento automático. Só o áudio real permite conferir timestamps. O Short exportado é uma **prévia sem narração**.

**Gerar prévia vertical:** renderize o checkpoint 5 com FFmpeg; em seguida execute `cd meu-canal/06-shorts && sh exportar-vertical.sh`. Verifique legendas e áudio manualmente antes de considerar o vídeo pronto.

**Teste independente dos exemplos e dos casos negativos:**

```bash
npm run test:channel-dark
```

## Diagnóstico e recuperação

- SRT mostra número errado
- Reouça o trecho, corrija texto e timestamps; nunca aceite ASR sem revisão
- Se não houver mídia, mantenha somente o SRT demonstrativo

## Evidência a anexar ao registro da aula

Anote a entrada, o comando executado, o arquivo encontrado, a diferença entre previsão e resultado, a revisão humana pendente e como corrigiria o caso negativo. O teste automatizado demonstra apenas comportamento do kit; não comprova qualidade da narração, direitos comerciais, veracidade das fontes nem aceitação do público.
