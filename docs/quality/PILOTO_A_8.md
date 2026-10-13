# Piloto rumo ao padrão A — oito aulas

## Escopo

AULA-001, AULA-009, AULA-047, AULA-160, AULA-166, LOG-01, PY-01 e NET-25.

As aulas foram enriquecidas para ultrapassar o baseline da Fase 16 por competências observáveis, exercícios independentes, feedback contextual, documentação de erros e laboratórios com resultados verificáveis. O conteúdo 047 é acessível tanto no documento curricular quanto na experiência V2 nativa.

## Identidade e classificação canônica

A fonte canônica dos 543 identificadores continua `src/curriculum/catalog.json`; a política de aprovação editorial é `quality/registry.json` na branch de base P0. **Não foi atribuída automaticamente classificação A** por quantidade de seções, texto, testes ou presença de laboratório.

**Estado de implementação:** conteúdo revisado e candidatável à nota A; **estado de certificação:** pendente de revisão independente do conteúdo, execução em ambientes declarados e teste com iniciante real para as competências cuja compreensão depende de usuários.

## Evidência nova por unidade

| Unidade | Mudança mensurável | Verificação |
| --- | --- | --- |
| 001 | caso novo de agendamento e retestes positivo/negativo | matriz de autorização e rubrica de transferência |
| 009 | distinção navegador/cliente/servidor, três versões da regra | testes HTTP existentes + quadro de estado |
| 047 | detecção de cache antigo, preservação de asset público, exercício V2 adicional | `lab.test.mjs`, exercícios e quiz nativos |
| 160 | relatório com cadeia de custódia, controle negativo e exercício de 11 segundos | `run.py investigate` e `analyze.py investigate` |
| 166 | capítulo reescrito sobre ASLR, PIE, offset, NX, exemplos e compilação Linux | `cc -fPIE -pie`, `cc -no-pie`, `check_aslr.py` |
| LOG-01 | mesa de limites + verificador de regra | `stock_rules.py`, `test_pilot.py` |
| PY-01 | rota de iniciante, diagnóstico, programa novo e dois casos de execução | `test_py_intro.py` |
| NET-25 | versão negociada vs permitida, autenticação e negativas | `tls_local.py` com dois positivos e negativas de CA/nome |

## Plano de verificação

Em ambiente Node.js 22+, Python 3.11+ e GCC Linux:

```sh
node scripts/test-pilot-a.mjs
python3 public/course-labs/pilot-a/test_pilot.py
cc -fPIE -pie -o /tmp/csh-pilot-pie public/course-labs/pilot-a/aslr_observe.c
cc -fno-pie -no-pie -o /tmp/csh-pilot-nopie public/course-labs/pilot-a/aslr_observe.c
python3 public/course-labs/pilot-a/check_aslr.py /tmp/csh-pilot-pie /tmp/csh-pilot-nopie
python3 public/course-labs/phase16-foundations/tls_local.py
python3 public/course-labs/phase16-memory/run.py investigate
```

Aulas CSRF 009 e Cache 047 precisam de `npm ci` em seus respectivos diretórios de laboratório antes de executar `node --test` devido a dependências específicas. Não executar esses testes e chamar de aprovado seria incorreto. O workflow PR do piloto instala dependências e valida o lote no GitHub Actions.

## Falhas que impedem nota A

- Qualquer conceito incorreto ou exercício que indique resultado não reproduzível no ambiente declarado;
- Quiz que revela resposta antes da tentativa para trilha de avaliação independente;
- Link de artefato inacessível ou tabela essencial ilegível no visualizador;
- Ausência de evidência de que um iniciante entende os objetivos, comandos e critérios sem instruções orais adicionais;
- Ausência de revisor/editor distinto do autor ou falta de ligação do parecer ao hash exato dos documentos;
- Confundir “teste passou” com “estudante domina a competência”.

## Limites

O laboratório ASLR foi executado localmente em Linux x86-64 com GCC. TLS foi executado usando Python 3.13. A amostra 160 é **sintética**, não prova infecção. Testes de cache e CSRF dependem de `npm ci` no ambiente de CI. Nenhum alvo externo deve ser usado. Os scripts não alteram política do kernel, infraestrutura externa nem dados pessoais.
