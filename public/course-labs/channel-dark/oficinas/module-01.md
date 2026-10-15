# Oficina 01 — Agenda editorial reutilizável

**Integração pronta.** Complementa o laboratório demonstrativo antigo com código reutilizável e arquivos reais de saída. Esta oficina é a entrega prática principal do módulo.

## Código que você vai reutilizar

1. [utilidades / modules/artisys-planning/src/index.mjs](https://github.com/nutricionistaalmeidavh-spec/utilidades/blob/9414210529545fed1995a4dfc90efedf6a04918c/modules/artisys-planning/src/index.mjs) — Valida tarefas, datas e dependências, produzindo eventos de calendário reaproveitáveis. **Acesso:** público, MIT. **Modo:** MIT vendorizado em oficinas/vendor/artisys-planning/index.mjs.

2. [frontEnds / library/marketing-sections/components.tsx](https://github.com/nutricionistaalmeidavh-spec/frontEnds/blob/7f783aff53959cc716412dd20b2fb753850a1969/library/marketing-sections/components.tsx) — Ajuda a compor uma landing page futura do canal, sem ser condição do curso. **Acesso:** privado, exige permissão. **Modo:** referência de UI opcional, sem cópia para o HubEstudos.

## Como executar no computador

1. Clone ou baixe o [repositório HubEstudos](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub) na branch `feat/trilha-canal-dark-ia` e abra o terminal na raiz da pasta.
2. Instale Node.js 24+. Para M03/M05/M06, instale também FFmpeg e use terminal Linux/macOS/WSL/Git Bash para scripts .sh.
3. Execute a oficina:

```bash
node public/course-labs/channel-dark/oficinas/workshop.mjs --module 1 --out ./meu-canal
```

4. Confira os arquivos criados dentro de `meu-canal/`:

   - `module-01/plano-editorial.json`
   - `module-01/agenda-calendar.json`

5. **Modificação obrigatória:** Troque tarefas e datas na seção module===1 do arquivo workshop.mjs; adicione dependência inválida para observar o erro.
6. **Por quê:** O aluno obtém um planejamento verdadeiro com dependências e datas verificadas, não apenas lista de ideias.

## Integração concreta: quais arquivos copiar e onde encaixar

- **Origem:** `modules/artisys-planning/src/index.mjs` no repositório `utilidades` na versão `9414210529545fed1995a4dfc90efedf6a04918c`.
- **Cópia pronta e licenciada:** `public/course-labs/channel-dark/oficinas/vendor/artisys-planning/index.mjs` e licença MIT na mesma pasta.
- **Ponto de integração:** `public/course-labs/channel-dark/oficinas/workshop.mjs`, dentro do bloco `if(module===1)`. Modifique a entrada e execute novamente para observar o efeito no arquivo gerado.
- **Execução real (quando necessária):** `public/course-labs/channel-dark/oficinas/ffmpeg-adapter.mjs` para cortes de vídeo; FFmpeg CLI para áudio e Short. As demais integrações usam as funções JS originais do ArtiSys.

## Limites, correção e prova de aprendizado

O JSON de calendário não insere um evento em serviço de agenda.

Execute `npm run test:channel-dark` para verificar comportamentos e erros. Anote no HubEstudos: arquivo de origem, arquivo que você modificou, comando, antes/depois, saída produzida e uma falha que resolveu.

**Gratuidade:** nenhuma assinatura ou API paga é requisito. Os módulos MIT são públicos; os componentes do `frontEnds` são **privados** e aparecem apenas como referências, não são copiados nem necessários. Não forneça credenciais. Antes de publicar conteúdo verifique fatos, licenças comerciais, consentimento e identificação de mídia sintética quando exigida.
