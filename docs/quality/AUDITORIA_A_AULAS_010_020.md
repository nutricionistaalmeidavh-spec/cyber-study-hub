# Auditoria A — Aulas 010 a 020

**Data:** 13/10/2026. **Tipo:** auditoria editorial assistida por IA em segunda passagem crítica, após CI. **Teste observacional com estudantes reais:** não realizado.

## Resultado

As onze aulas **AULA-010…AULA-020** passam à nota **A (editorial por IA)** no registro canônico `quality/registry.json`, sem alterar notas **históricas** da Fase 15. A nota não é progresso individual do estudante nem certificação de segurança.

A revisão examina seis dimensões (conteúdo técnico, didática, prática, defesa, avaliação, especificidade), possui ponteiros de evidência individualizados e SHA-256 do Markdown revisado. A tabela de pontuação e as limitações de cada unidade estão em `quality/reviews/a10-20-2026-10-13.json`.

## Verificação observada

- [Pilot A Lessons QA #7](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/actions/runs/38488529578): testes de **010–020**, programas locais, SSRF e OAuth/OIDC, regressões anteriores, build e qualidade.
- [Quality P0 #8](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/actions/runs/38488529572): registro editorial P0 e build.
- Revisão nova de cada unidade contém seis perguntas de **transferência de cenário**, rubrica e **gabarito separado** (11 arquivos `answer-keys/AULA-*.md`).
- As avaliações A se invalidam se o SHA-256 do conteúdo mudar; nenhuma métrica mecânica de tamanho promove automaticamente uma aula.

## Limitações por assunto

010: loopback/HTTP, não validação do Burp no navegador. 011–012 e 016–018: modelos em memória, não produção com persistência real. 013: cabeçalho `%PDF-` insuficiente para validação completa de arquivos. 014: teste de headers, não da política real de leitura do navegador. 015: SSRF simulado sem DNS rebinding/egress corporativo. 019: JWT com chave pública fictícia, sem teste de rotação/refresh real. 020: OIDC executado no mesmo processo, não em provedor federado remoto.

## Significado dos gates

`didaticaInicianteValidada` é walkthrough editorial **por IA**, não observação com alunos. `avaliacaoIndependenteRevisada` é leitura separada da prova e seu gabarito por processo IA. `revisorIndependente` é uma passagem crítica diferente da autoria, mas **não** uma pessoa revisora externa independente; a limitação deve aparecer no relatório. Portanto, nota A editorial IA não implica aprovação de pesquisa pedagógica humana.

## Reprodução

```sh
npm run test:a-10-20
npm run test:grade-a-10-20
npm run verify:quality
npm run build
```

Os laboratórios exigem apenas Node, Python e dependências gratuitas de projeto quando informadas. Sem API comercial obrigatória nem acesso externo em tempo de execução dos laboratórios.
