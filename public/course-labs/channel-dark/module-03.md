# Laboratório 03 — Narração e TTS

**Objetivo:** Gerar narração inteligível em português e tratar áudio localmente, comparando Kokoro, Piper e opções avançadas.

**Percurso obrigatório:** R$ 0; conteúdo original, computador local e ferramentas gratuitas. Nenhum serviço externo pago é requisito.

## Antes de executar

Trabalhe com um parágrafo original de até 400 caracteres. Confira primeiro uma voz pt_BR licenciada no Piper; se a síntese não rodar no equipamento, grave sua voz com Audacity e faça o mesmo tratamento de áudio. Kokoro/Chatterbox são extensões opcionais.

## Procedimento

1. Separe gratuitamente o roteiro em cinco blocos de narração com pausas e pronúncias.
2. Gere um teste com Piper e uma voz portuguesa de uso permitido; o teste pode ser curto.
3. Ouça, anote erros e ajuste as frases sem alterar o conteúdo factual.
4. Normalize no Audacity ou FFmpeg e arquive a versão aprovada com registro de licença da voz.

## Evidências e aceite

- [ ] Modelo, voz e licença identificados
- [ ] Português testado na prática antes de usar
- [ ] Existem original e arquivo revisado
- [ ] Registro de ajustes de pronúncia e volume
- [ ] Nenhuma ferramenta paga é necessária

## Ferramentas para conhecer

- **Piper TTS** — núcleo gratuito/local. Vozes locais, selecionar voz pt_BR e conferir licença. https://github.com/OHF-Voice/piper1-gpl
- **Audacity** — núcleo gratuito/local. Tratamento local de áudio. https://www.audacityteam.org/
- **Kokoro** — opcional, validar custos/licença/hardware. Open weights Apache-2.0; checar idiomas/vozes. https://huggingface.co/hexgrad/Kokoro-82M
- **Chatterbox** — opcional, validar custos/licença/hardware. Modelo aberto mais pesado, inclui português. https://github.com/resemble-ai/chatterbox
- **ElevenLabs** — opcional, validar custos/licença/hardware. Serviço comercial opcional. https://elevenlabs.io/pricing

## Transferência

A narração é realista, mas a licença da voz não está clara. Você deve publicar? Proponha alternativa verificável.

## Política de publicação

Não publique automaticamente. Confira fatos, consentimento, direitos de mídia, licenças comerciais, eventuais exigências de identificação de IA e aprovação editorial humana. Se usar ferramentas externas, não envie segredos nem dados de terceiros.



## Laboratório executável, versão gratuita e reproduzível

**Pré-requisito:** Node.js 20+ instalado gratuitamente no computador. Abra o terminal na pasta raiz do repositório `cyber-study-hub`. **A mídia e os dados são demonstrativos; não publique o resultado sem revisão.**

Execute:

```bash
node public/course-labs/channel-dark/engine.mjs --module 3 --out ./meu-canal
```

**Saída esperada:** `03-audio/narracao.json (manifesto, ainda sem WAV até gravar/rodar TTS)` dentro de `meu-canal/`. A mensagem no terminal indica onde os arquivos foram criados.

**Critério verificável:** Uma voz sem consentimento, licença, português testado ou escuta não recebe aprovação.

**Interpretação:** Este checkpoint **não gera voz sozinho**. Entrega segmentos com pronúncia e duração estimada; Piper pt-BR ou gravação própria são a prática de áudio do estudante.

**Teste independente dos exemplos e dos casos negativos:**

```bash
npm run test:channel-dark
```

## Diagnóstico e recuperação

- Piper indisponível ou voz pt-BR ausente
- Não invente áudio: grave voz própria no Audacity, confirme licença e execute a escuta
- Se perder a fala, regrave somente o segmento e preserve o original

## Evidência a anexar ao registro da aula

Anote a entrada, o comando executado, o arquivo encontrado, a diferença entre previsão e resultado, a revisão humana pendente e como corrigiria o caso negativo. O teste automatizado demonstra apenas comportamento do kit; não comprova qualidade da narração, direitos comerciais, veracidade das fontes nem aceitação do público.
