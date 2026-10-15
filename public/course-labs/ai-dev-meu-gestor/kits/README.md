# Biblioteca de kits funcionais — Meu Gestor

**Papel:** oferecer código pronto, documentação e ponto de partida para integrar funcionalidades ao *seu* aplicativo, sem confundir kit de produção, exercício e projeto final. Cada exemplo usa dados sintéticos. Kits são **opt-in** e não bloqueiam os oito módulos básicos.

## Ordem recomendada

1. Termine o checkpoint do laboratório correspondente.
2. Consulte o [catálogo com maturidade e origem](./catalog.json).
3. Teste o exemplo com dados fictícios e observe o negativo.
4. Só depois instale o pacote de origem por caminho local, fixe sua versão e implemente o adaptador na pasta do aplicativo.
5. Registre o commit, versões, saída, falha e reteste; não copie `node_modules`, bancos, credenciais ou gabaritos.

| Kit | A partir de | Fonte técnica / DevKitTools | Resultado |
| --- | --- | --- | --- |
| [UI](./ui/README.md) | Módulo 4 | frontEnds privado como referência; DKT-UI-003 | Card reutilizável acessível |
| [Relatórios](./reporting/README.md) | Módulo 5 | artisys-reporting, DKT-GEST-015 | CSV de ordens fictícias |
| [Financeiro](./finance/README.md) | Módulo 6 | artisys-finance-domain, DKT-GEST-012 | Regras explicáveis / idempotência |
| [QA](./scan/README.md) | Módulo 7 | artisysScan / artisys-qa | Evidência e relatório sem falso PASS |
| [PDF](./pdf/README.md) | Após Módulo 8 | artisys-pdf, DKT-DOC-005 | Ordem de serviço em PDF |
| [Balança](./serial/README.md) | Após Módulo 8 | artisys-serialport, DKT-DESK-003 | Leitura simulada e interface de hardware |

## Testar os exemplos educacionais

Na raiz do `cyber-study-hub` ou do ZIP do repositório:

```bash
node --test public/course-labs/ai-dev-meu-gestor/kits/tests/*.test.mjs
```

Para executar um adaptador com pacote `@artisys/*`, consulte o README dele e instale a dependência a partir de um checkout versionado de `utilidades`. **Não existem serviços pagos obrigatórios**. Os ZIPs do DevKitTools são produtos em preparação; o catálogo não implica que estejam publicados ou liberados gratuitamente. Verifique condições de licenciamento antes de redistribuir.

## Limites de segurança

- O `v1.0` não tem autenticação, autorização, TLS ou proteção para exposição pública.
- Nunca peça a um aluno para subir o serviço local em um domínio público nem adicionar tokens no repositório.
- Serial real exige equipamento autorizado e driver/protocolo compatíveis. O simulador não homologa hardware.
- O scanner deve executar somente sobre projetos controlados e com autorização. Falta de ferramenta não equivale a PASS.
- O `frontEnds` é privado: componentes importados diretamente dele não podem ser publicados no Hub sem pacote e licença de distribuição explicitamente aprovados.
