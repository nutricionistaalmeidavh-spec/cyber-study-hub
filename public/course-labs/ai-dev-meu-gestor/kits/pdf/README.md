# Kit PDF — ordem de serviço

**Origem real:** [artisys-pdf](https://github.com/nutricionistaalmeidavh-spec/utilidades/tree/main/modules/artisys-pdf) (**stable 1.0.0**) · DevKitTools **DKT-DOC-005** (catálogo em preparação, ZIP não presumido). Não é a apostila em PDF: é **um motor para o software gerar PDFs**.

## Preparação

Use um checkout local e versionado de `utilidades`. No diretório da sua cópia do projeto consumidor:

```sh
npm install /caminho/para/utilidades/modules/artisys-pdf @pdfme/generator@^6 @pdfme/schemas@^6 @pdfme/common@^6
```

Copie esta pasta `pdf/` para uma pasta educacional no consumidor, ajustando o caminho de execução. O módulo usa Node 22+ (o Meu Gestor v1.0 requer Node 24+).

```sh
node pdf/generate-pdf.mjs ./ordem-servico.pdf
```

Substitua os quatro valores **fictícios** no `generate-pdf.mjs` pelos campos da OS selecionada **somente depois** de conferir autorização de acesso; não exponha PDF de outro cliente. `payload.mjs` define o template, dimensões e campos. Para comparar, teste `makeOrderPdfPayload` com serviço vazio ou estado desconhecido e confirme rejeição.

**Saída:** arquivo PDF novo, com campos de OS. Confirme visualmente a diagramação e que valores vêm da OS correta. A geração depende das bibliotecas instaladas localmente, e sua versão deve ser fixada na aplicação real. **Nunca gerar pelo navegador usando segredos do servidor.**

**Limite:** Exemplo mínimo; não é layout fiscal, contrato nem documento juridicamente validado. A integração ao botão real do Meu Gestor requer uma rota autorizada e controle de conteúdo; o checkpoint v1.0 não possui autenticação e não pode servir dados reais.
