# Laboratório 04 — Imagens, cenas e thumbnails

**Objetivo:** Produzir imagens e um storyboard legíveis, rastreáveis e consistentes sem depender de geração visual em nuvem.

**Percurso obrigatório:** R$ 0; conteúdo original, computador local e ferramentas gratuitas. Nenhum serviço externo pago é requisito.

## Antes de executar

Crie canal/storyboard-001.csv com colunas cena,inicio_fim,objetivo,arquivo,fonte,licenca. Exporte imagem local em 1280x720 e versão pequena para avaliar legibilidade, sem precisar de IA visual.

## Procedimento

1. Monte gratuitamente um storyboard de seis cenas com duração e intenção editorial.
2. Desenhe três elementos visuais próprios no Krita ou com SVG gratuito.
3. Crie uma thumbnail com título curto e teste a legibilidade em tamanho pequeno.
4. Registre a origem e os termos de cada arquivo usado, deixando a cena sintética identificada.

## Evidências e aceite

- [ ] Storyboard tem seis cenas úteis
- [ ] Thumbnail é legível em dimensão reduzida
- [ ] Cada elemento tem fonte rastreável
- [ ] Há uma versão integralmente local/gratuita
- [ ] Cenas não simulam falsamente eventos reais

## Ferramentas para conhecer

- **Krita** — núcleo gratuito/local. Desenho e thumbnails offline. https://krita.org/en/
- **ImageMagick** — núcleo gratuito/local. Tratamento e conversão em lote. https://imagemagick.org/
- **ComfyUI** — opcional, validar custos/licença/hardware. Geração de imagem local com GPU, depende de modelo e licença. https://github.com/comfyanonymous/ComfyUI
- **Google Flow** — opcional, validar custos/licença/hardware. Serviço Google com créditos e limites variáveis. https://labs.google/fx/tools/flow

## Transferência

Uma imagem gerada parece fotografia de um acontecimento histórico. Como deve ser apresentada para não confundir espectadores?

## Política de publicação

Não publique automaticamente. Confira fatos, consentimento, direitos de mídia, licenças comerciais, eventuais exigências de identificação de IA e aprovação editorial humana. Se usar ferramentas externas, não envie segredos nem dados de terceiros.



## Laboratório executável, versão gratuita e reproduzível

**Pré-requisito:** Node.js 20+ instalado gratuitamente no computador. Abra o terminal na pasta raiz do repositório `cyber-study-hub`. **A mídia e os dados são demonstrativos; não publique o resultado sem revisão.**

Execute:

```bash
node public/course-labs/channel-dark/engine.mjs --module 4 --out ./meu-canal
```

**Saída esperada:** `04-visuais/storyboard.json + 04-visuais/thumbnail.svg` dentro de `meu-canal/`. A mensagem no terminal indica onde os arquivos foram criados.

**Critério verificável:** Cenas sem propósito, duração ou licença são rejeitadas pelo verificador.

**Interpretação:** O SVG é um exemplo próprio, não fotografia documental. Compare tamanho de 1280 × 720 e visualização reduzida antes de liberar o thumbnail.

**Teste independente dos exemplos e dos casos negativos:**

```bash
npm run test:channel-dark
```

## Diagnóstico e recuperação

- Thumbnail com texto cortado
- Teste a versão reduzida e reescreva o título com menos palavras
- Nunca chame cena artificial de fotografia de evento real

## Evidência a anexar ao registro da aula

Anote a entrada, o comando executado, o arquivo encontrado, a diferença entre previsão e resultado, a revisão humana pendente e como corrigiria o caso negativo. O teste automatizado demonstra apenas comportamento do kit; não comprova qualidade da narração, direitos comerciais, veracidade das fontes nem aceitação do público.
