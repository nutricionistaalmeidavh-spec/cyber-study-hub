# Oficina 08 — Analytics local e relatório CSV

**Integração pronta.** Complementa o laboratório demonstrativo antigo com código reutilizável e arquivos reais de saída. Esta oficina é a entrega prática principal do módulo.

## Código que você vai reutilizar

1. [utilidades / modules/artisys-reporting/src/index.mjs](https://github.com/nutricionistaalmeidavh-spec/utilidades/blob/9414210529545fed1995a4dfc90efedf6a04918c/modules/artisys-reporting/src/index.mjs) — Agrega métricas numéricas e gera resumos reproduzíveis por episódio. **Acesso:** público, MIT. **Modo:** MIT vendorizado em oficinas/vendor/artisys-reporting/index.mjs.

2. [utilidades / modules/artisys-exporter/src/index.mjs](https://github.com/nutricionistaalmeidavh-spec/utilidades/blob/9414210529545fed1995a4dfc90efedf6a04918c/modules/artisys-exporter/src/index.mjs) — Exporta CSV com cabeçalhos explícitos; antes disso o integrador rejeita títulos com fórmula CSV. **Acesso:** público, MIT. **Modo:** MIT vendorizado em oficinas/vendor/artisys-exporter/index.mjs.

3. [frontEnds / library/dashboard-kit/components.tsx](https://github.com/nutricionistaalmeidavh-spec/frontEnds/blob/7f783aff53959cc716412dd20b2fb753850a1969/library/dashboard-kit/components.tsx) — Fornece componentes React de KPI cards para painel opcional, restrito a pessoas com permissão no repo. **Acesso:** privado, exige permissão. **Modo:** referência de UI opcional, sem cópia para o HubEstudos.

## Como executar no computador

1. Clone ou baixe o [repositório HubEstudos](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub) na branch `feat/trilha-canal-dark-ia` e abra o terminal na raiz da pasta.
2. Instale Node.js 24+. Para M03/M05/M06, instale também FFmpeg e use terminal Linux/macOS/WSL/Git Bash para scripts .sh.
3. Execute a oficina:

```bash
node public/course-labs/channel-dark/oficinas/workshop.mjs --module 8 --out ./meu-canal
```

4. Confira os arquivos criados dentro de `meu-canal/`:

   - `module-08/resumo.json`
   - `module-08/relatorio.csv`

5. **Modificação obrigatória:** Forneça um metricas.json via --analytics ./metricas.json (id, title, impressions, views, completed).
6. **Por quê:** O aluno transforma dados próprios de entrada em agregações e relatório exportável, sem pagamento ou OAuth.

## Integração concreta: quais arquivos copiar e onde encaixar

- **Origem:** `modules/artisys-reporting/src/index.mjs` no repositório `utilidades` na versão `9414210529545fed1995a4dfc90efedf6a04918c`.
- **Cópia pronta e licenciada:** `public/course-labs/channel-dark/oficinas/vendor/artisys-reporting/index.mjs` e licença MIT na mesma pasta.
- **Ponto de integração:** `public/course-labs/channel-dark/oficinas/workshop.mjs`, dentro do bloco `if(module===8)`. Modifique a entrada e execute novamente para observar o efeito no arquivo gerado.
- **Execução real (quando necessária):** `public/course-labs/channel-dark/oficinas/ffmpeg-adapter.mjs` para cortes de vídeo; FFmpeg CLI para áudio e Short. As demais integrações usam as funções JS originais do ArtiSys.

## Uso adicional

```bash
Crie metricas.json com [{"id":"ep-001","title":"Meu episódio","impressions":1000,"views":90,"completed":32}] e execute o comando incluindo --analytics ./metricas.json
```

## Limites, correção e prova de aprendizado

Sem API YouTube. A amostra padrão é declarada fictícia e importar arquivo não prova sua procedência.

Execute `npm run test:channel-dark` para verificar comportamentos e erros. Anote no HubEstudos: arquivo de origem, arquivo que você modificou, comando, antes/depois, saída produzida e uma falha que resolveu.

**Gratuidade:** nenhuma assinatura ou API paga é requisito. Os módulos MIT são públicos; os componentes do `frontEnds` são **privados** e aparecem apenas como referências, não são copiados nem necessários. Não forneça credenciais. Antes de publicar conteúdo verifique fatos, licenças comerciais, consentimento e identificação de mídia sintética quando exigida.

## Painel frontend pronto para abrir no navegador

Abra `meu-canal/module-08/painel.html` com duplo clique, escolha `resumo.json` e veja os indicadores em cards responsivos. É HTML original autocontido, sem servidor e sem enviar seus dados para fora. O arquivo-fonte está em `oficinas/templates/painel.html` e insere dados com `textContent`.

Para evoluir para React, consulte [frontEnds/dashboard-kit/components.tsx](https://github.com/nutricionistaalmeidavh-spec/frontEnds/blob/7f783aff53959cc716412dd20b2fb753850a1969/library/dashboard-kit/components.tsx). O repositório é privado, opcional e requer autorização do proprietário; o painel HTML funciona sem ele.
