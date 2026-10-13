# Auditoria editorial A — lote piloto (8 unidades)

**Data:** 13/10/2026. **Tipo de avaliação:** auditoria editorial por IA (segunda passagem crítica). **Validação com aprendizes reais:** não realizada.

A classificação A é referente **à qualidade editorial do material** sob as seis dimensões da rubrica, não comprova que um aluno individual dominou a competência. Os gabaritos finais foram separados das aulas para reduzir vazamento de resposta.

| Unidade | Técnica | Didática | Prática | Defesa | Avaliação | Especificidade | Nota editorial |
|---|---:|---:|---:|---:|---:|---:|---|
| AULA-001 | 94 | 92 | 89 | 92 | 93 | 96 | **A (IA)** |
| AULA-009 | 95 | 92 | 94 | 94 | 92 | 97 | **A (IA)** |
| AULA-047 | 96 | 91 | 96 | 95 | 94 | 97 | **A (IA)** |
| AULA-160 | 91 | 90 | 94 | 93 | 93 | 96 | **A (IA)** |
| AULA-166 | 95 | 91 | 94 | 95 | 92 | 97 | **A (IA)** |
| LOG-01 | 92 | 94 | 93 | 91 | 93 | 96 | **A (IA)** |
| PY-01 | 91 | 95 | 94 | 91 | 94 | 96 | **A (IA)** |
| NET-25 | 95 | 92 | 95 | 95 | 93 | 97 | **A (IA)** |

## Evidência verificável

- Fontes técnicas oficiais: referências específicas em `quality/reviews/pilot-a-2026-10-13.json`, incluindo NIST, OWASP, Linux/GCC, RFC 8446 e documentação Python.
- Evidências independentes do texto: testes negativos e positivos, exercícios de transferência com seis questões não idênticas aos exemplos, gabaritos em `/course-labs/pilot-a/answer-keys/`, critérios eliminatórios e rubricas.
- Integridade: cada parecer está preso ao SHA-256 do respectivo Markdown e fica inválido se o conteúdo mudar.
- Verificações reexecutáveis: `node scripts/test-pilot-grade-a.mjs`, `npm run verify:quality`, `npm run build`, workflow `Pilot A Lessons QA`.
- Testes já observados antes da prova final: GitHub Actions [laboratórios](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/actions/runs/38482223979) e [build/qualidade](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/actions/runs/38482223998). Os novos gabaritos e os hashes exigem CI fresco no commit desta auditoria.

## Interpretação dos gates editoriais

- `didaticaInicianteValidada=true`: corresponde a um **walkthrough editorial por IA com conhecimento prévio zero presumido**, checando vocabulário, previsão/ação/feedback, instruções, erro e recuperação. Não representa observação de pessoas reais.
- `avaliacaoIndependenteRevisada=true`: uma segunda checagem do novo caso de transferência, separada da explicação guiada e com gabarito em documento diferente. Ainda se recomenda estudo observacional com aprendizes.
- `revisorIndependente=true`: identifica a **passagem de auditoria editorial por IA**, distinta da fase de autoria e com fonte/metodologia registradas; não indica revisão por profissional humano externo.
- `humanLearnerTesting="not_performed"`: é obrigatório que essa ausência permaneça visível até estudo real; nenhum teste de software deve alterar esse campo automaticamente.

## Limites da conclusão

Esta auditoria não constitui certificação oficial NIST/OWASP, nem equivalência a curso acreditado, nem avaliação de acessibilidade com tecnologias assistivas ou eficácia com pessoas reais. A nota A depende de evidências editoriais documentadas e regressão técnica, não da contagem de palavras. Não há promessa de segurança fora dos ambientes laboratoriais fornecidos.

## Como reproduzir

```sh
npm run verify:quality
node scripts/test-pilot-grade-a.mjs
npm run build
```

Práticas que exigem Node/Python/GCC constam do workflow de laboratório. Scripts não fazem login, rede externa nem alteram configurações de proteção do host.
