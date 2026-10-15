# Auditoria A — Automação de Canais Dark com IA (M01–M08)

**Data:** 15/10/2026. **Parecer:** A editorial por IA. **Estudo com alunos reais:** não realizado. **Revisão humana independente:** não realizada.

## Escopo e resultado

São **8 módulos, 32 etapas, 8 laboratórios incrementais e 48 questões independentes** com gabaritos e rubricas separados. A classificação considera seis dimensões com evidências específicas em `quality/trails/channel-dark/reviews.json`.

| Módulo | Técnico | Didática | Prática | Defesa | Avaliação | Especificidade | Parecer |
|---|---:|---:|---:|---:|---:|---:|---|
| 01 · Estratégia do canal dark | 91 | 91 | 92 | 93 | 89 | 91 | A editorial IA |
| 02 · Pesquisa, pautas e roteiros | 91 | 91 | 92 | 93 | 89 | 91 | A editorial IA |
| 03 · Narração e TTS | 91 | 91 | 85 | 93 | 89 | 91 | A editorial IA |
| 04 · Imagens, cenas e thumbnails | 91 | 91 | 92 | 93 | 89 | 91 | A editorial IA |
| 05 · Vídeo com IA: Pika, Flow e Steve | 91 | 91 | 87 | 93 | 89 | 91 | A editorial IA |
| 06 · Edição, legendas e Shorts | 91 | 91 | 92 | 93 | 89 | 91 | A editorial IA |
| 07 · Automação com n8n e Node-RED | 91 | 91 | 92 | 93 | 89 | 91 | A editorial IA |
| 08 · Publicação, métricas e monetização | 91 | 91 | 92 | 93 | 89 | 91 | A editorial IA |

## Laboratórios e evidências

Cada módulo oferece comandos para gerar artefatos locais e testar falhas. O motor `public/course-labs/channel-dark/engine.mjs` é executável com Node e não exige conta em serviço externo. O conjunto `engine.test.mjs` testa os oito checkpoints, incluindo rejeição de briefing incompleto, fonte não verificada, voz sem consentimento, cenas sem direitos, render local via FFmpeg quando disponível, SRT, fila idempotente e pacote sem upload automático.

**Importante:** os arquivos gerados são *demonstrações*, não um canal em produção. O módulo TTS prepara segmentos e exige que o estudante grave voz ou use um modelo adequado; não gera áudio acabado sozinho. O vídeo-base é demonstrativo e sem narração. Os indicadores do módulo 8 são explicitamente fictícios. O pipeline não publica vídeos e não promete monetização.

## Integridade dos pareceres

A evidência está vinculada às versões revisadas por **SHA-256 do conteúdo JSON de cada módulo** e **SHA-1 de objeto Git (blob) dos oito guias, oito provas e oito gabaritos**, além do motor e testes. São verificações exatas de bytes: alterações sem revisão invalidam `npm run verify:channel-dark` e bloqueiam o build.

```sh
npm run verify:channel-dark
npm run build
npm run test:platform
```

O GitHub Actions executa testes da nova trilha e regressões. A `main` e a configuração de Cloudflare não foram modificadas nesta entrega.

## Limites da nota

- **A editorial IA não é certificação do aluno.** Conclusões são autodeclaradas e não houve avaliação com estudantes reais nem revisão por docente humano.
- Não foram executados todos os serviços externos reais (Pika, Flow, Steve AI, Modal e n8n), nem ensaio de vídeos prontos com público, monetização ou publicação em canais reais.
- Ferramentas pagas são opcionais. n8n usa licença **fair-code/Sustainable Use**, não licença open source OSI. O Pika Free/Starter não oferece licença comercial na tabela consultada em outubro de 2026.
- Fontes, mídia, voz, consentimento e políticas atuais do YouTube precisam ser revistos antes de publicar; material sintético realista significativo requer análise de declaração.
- A nota avalia didática, fundamentos e testes do kit, não a qualidade humana de narrações e vídeos que ainda serão produzidos pelos estudantes.

## Isolamento

A trilha é independente das **218 aulas principais e 325 paralelas** do catálogo original. O progresso usa chave própria e não altera autenticação, Worker nem endpoints.
