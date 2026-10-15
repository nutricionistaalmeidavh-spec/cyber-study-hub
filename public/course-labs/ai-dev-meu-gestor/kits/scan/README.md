# QA / ArtiSys Scan — revisão do Meu Gestor

**Referências reais:** [artisys-qa](https://github.com/nutricionistaalmeidavh-spec/utilidades/tree/main/modules/artisys-qa) (stable) e [artisysScan](https://github.com/nutricionistaalmeidavh-spec/artisysScan) (scanner local). Não exige CI always-on ou serviço pago. O scanner não deve ser instalado no runtime do aluno.

## Faça primeiro os checks nativos do projeto

No checkpoint `v0.5/` ou `v1.0/`:

```sh
npm install --no-audit --no-fund
npm test
npm run build
```

Guarde comando, versão do Node e saída. Introduza *temporariamente* bug controlado numa cópia, comprove teste vermelho, reverta e reteste. **Um scanner verde não substitui testes do domínio.**

## Scanner adicional local (opt-in)

Em checkout separado do `artisysScan`, com Node 22+:

```sh
npm install
npm run ci
npm run scan -- discover /caminho/do/meu-gestor
npm run scan -- security /caminho/do/meu-gestor
```

Essa análise de código depende de ferramentas externas opcionais disponíveis no PATH para cobertura completa (Semgrep CE, Trivy, Gitleaks, OSV-Scanner). Resultado incompleto deve constar `complete:false`, não PASS automático. Use `--allow-project-exec` apenas em projetos próprios preparados; não rode `--allow-active` contra alvos externos.

**Entregável:** relatório JSON/HTML quando disponível, teste falhando/restaurado, limitações e confirmação de que não houve acesso a dados reais. **Não copie secrets para relatórios nem compartilhe logs brutos.**
