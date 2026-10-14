# Auditoria A das aulas 071–080

**Data:** 13/10/2026. **Tipo:** revisão editorial assistida por IA, não teste pedagógico com seres humanos.

## Mudanças

- Dez oficinas específicas com cenário realista sintético, mecanismo, controle legítimo e negativo, defesa, 6 perguntas de transferência com gabarito separado e rubrica.
- **Active Directory:** 071–078; **Blue Team/logs:** 079–080.
- Laboratórios locais e determinísticos Node 22+ com 21 testes, sem login, acesso externo, Windows ou dependência paga obrigatória.
- Hash SHA-256 por unidade em `quality/registry.json` e `quality/reviews/a071-080-2026-10-13.json` para invalidar o parecer quando conteúdo mudar.
- Preservadas 55 notas anteriores e a distribuição histórica; registro passa a 65 notas A editoriais.

## Limitações

A nota A registra parecer editorial por IA em seis dimensões, não progresso do aluno, auditoria operacional de AD/Sysmon ou revisão por pessoa independente. Os gates didáticos refletem walkthrough por IA; a prática confirma só modelos sintéticos. Uso real exige autorização, máquina/testes próprios e validação de versão e cobertura.

## Reprodução

```sh
npm run test:a-071-080
npm run test:grade-a-071-080
npm run verify:quality
npm run build
```

**Núcleo:** R$ 0, self-hosted e open source; nenhum SaaS obrigatório.
