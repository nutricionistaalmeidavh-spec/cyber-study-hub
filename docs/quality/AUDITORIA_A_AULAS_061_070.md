# Auditoria A editorial por IA — aulas 061 a 070

**Data:** 13/10/2026. **Natureza:** segunda passagem editorial IA com modelo de evidências; não é aprovação por revisor humano, prova de eficácia com alunos ou exploração em ambiente produtivo.

## Diagnóstico e alterações

As dez aulas já continham conceitos introdutórios, mas testes e quizzes eram predominantemente genéricos, sem cenários de transferência e registros experimentais específicos. Elas agora apresentam explicação causal, caso concreto, contraexemplo, laboratório Node verificável, positivo/negativo, controles e reteste, seis perguntas novas e gabarito com rubrica/erro eliminatório separado.

| Unidade | Demonstração específica |
|---|---|
| AULA-061 | Linux: permissão octal de job root versus SUID legítimo |
| AULA-062 | Windows: identidade LocalSystem e ACE Users:Modify versus LocalService com Read |
| AULA-063 | Elevação Linux: configuração e script sudo delegados criam caminho de privilégio condicionado |
| AULA-064 | Elevação Windows: unquoted service path só é preocupante com ACL de prefixo e principal elevado |
| AULA-065 | Hardening: retirar escrita de Everyone, preservando Service:Read |
| AULA-066 | Fingerprinting: status HTTP e banner sintético não comprovam versão ou CVE |
| AULA-067 | Scanning: falso positivo, match parcial e confirmação contextual em laboratório |
| AULA-068 | CVE/CWE/CVSS: advisory fictício e correlação estrita de produto/versão; CVSS não é prioridade |
| AULA-069 | PoC segura: ownership, isolamento, snapshot, limites e proibição de efeitos destrutivos |
| AULA-070 | Active Directory: nesting de grupos efetivos com ciclos, distinguindo membership de OU e GPO |

## Acesso e custo

Núcleo **R$0**, sem serviços comerciais ou credenciais. Requer Node.js 22+; modelos em memória e listener de rede estritamente local 127.0.0.1. Nmap, Nuclei, PowerShell, Active Directory real e produtos de fornecedores são materiais opcionais: não são executados por CI nem exigidos para concluir o percurso.

## Evidências e revisão

- 10 arquivos Markdown vinculados aos mesmos caminhos do catálogo canônico (218 principais + 325 paralelas = 543 IDs intactos).
- 10 answer-keys em `public/course-labs/a061-070/answer-keys`; 60 questões de transferência e respectivos comentários.
- `public/course-labs/a061-070/models.mjs` contém dez modelos de decisão isolados, sem acessar ativos de terceiros. `lab.test.mjs` valida os 10 positivos/negativos.
- 10 pareceres com 6 dimensões, seis evidências, todos os gates e `contentSha256` de cada arquivo. A classificação histórica não foi modificada.
- Preservadas as 55 classificações A editoriais anteriores; **65 A editoriais** em toda a coleção após o registro.

## CI canônico

```sh
npm ci --no-audit --no-fund
npm run test:a-061-070
npm run verify:quality
npm run build
```

GitHub Actions: `Aulas 061-070 QA`, `Quality P0` e os demais workflows afetados pela mudança em `package.json`/registro.

## Limitações honestas

`didaticaInicianteValidada=true` registra apenas walkthrough editorial por IA. `revisorIndependente=true` descreve uma segunda etapa crítica assistida por IA, **não pessoa externa**. `praticaVerificada=true` é aplicado à fixture Node testada em CI, não à confirmação de bugs em sistemas reais. Avaliação com alunos reais, Windows/AD nativos, diretórios Linux do host e eficácia na prática permanecem fora do escopo.

Fontes das 10 aulas estão individualizadas em `quality/reviews/a061-070-2026-10-13.json` e nos documentos de curso.
