# Kit financeiro — transação e classificação

**Origem:** [artisys-finance-domain](https://github.com/nutricionistaalmeidavh-spec/utilidades/tree/main/modules/artisys-finance-domain), **implemented 0.1.0**, DevKitTools **DKT-GEST-012** em preparação.

**Não é um ERP nem gateway de cobrança.** É um domínio puro para normalização, classificação, fingerprints, conciliação assistida e diferenciação entre operações iguais e reimportação duplicada.

1. Conclua o módulo 6 e salve backup de um banco *fictício* antes de mudar o projeto.
2. Instale no consumidor: `npm install /caminho/utilidades/modules/artisys-finance-domain` (Node 22+).
3. Copie `transaction.mjs` e `classify-demo.mjs`; rode `node finance/classify-demo.mjs ./decisao-financeira.json`.
4. Compare `sourceFingerprint` e `businessFingerprint`: duas operações iguais de origens distintas NÃO devem ser apagadas como duplicatas.
5. Faça caso negativo: `amountCents=0` deve ser rejeitado pela normalização. Só depois adapte para tabelas e rotas no seu sistema.

**Entregável:** decisão JSON explicável, casos válido/negativo e identificação da origem. Não conectar extratos bancários reais neste laboratório.
