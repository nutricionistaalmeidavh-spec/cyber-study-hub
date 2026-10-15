# AULA-190 — Capstone — Purple Team Exercise: laboratório guiado

**Identidade canônica:** AULA-190. **Tipo:** experimento defensivo local, baseado em eventos 100% fictícios. **Custo:** R$0. **Ambiente:** Node.js 22+, repositório HubEstudos, sem internet e sem privilégios administrativos.

## O que vamos construir e por quê

Uma decisão rastreável de análise Purple Team para **Capstone — Purple Team Exercise**. O aluno deve saber distinguir evento de hipótese, preservar evidência e interromper testes fora do escopo. Compare quantidade de alertas com completude da investigação.

## Arquivos disponíveis

- `../models.mjs`: implementação do mecanismo de autorização e classificação.
- `../run.mjs`: executa especificamente AULA-190.
- `../run.test.mjs` e `../lab.test.mjs`: verificações executáveis.
- `public/course-library/main/190.md`: teoria e roteiro canônico (abra também dentro do Hub).

## Execução reproduzível (na raiz do repositório)

```sh
node public/course-labs/a181-190/run.mjs 190
node --test public/course-labs/a181-190/run.test.mjs public/course-labs/a181-190/lab.test.mjs
```

**Hipótese positiva:** 4 registros, 2 sinais de revisão e 1 lacuna. **Controle negativo:** 2 registros benignos, cobertura completa. **Saída que deve interpretar:** 2 alertas com cobertura incompleta versus relatório benigno completo.

## Desafio independente

1. Escreva a decisão esperada para os dois casos, antes de executar o runner.
2. Execute ambos e guarde a saída JSON, com Node e data do experimento.
3. Abra `models.mjs` e explique qual condição decide o resultado.
4. Faça uma cópia local da fixture e mude exatamente um atributo (categoria, ativo ou ação). Antecipe o novo resultado.
5. Reexecute os testes; produza três linhas de relatório: **evidência → inferência → limitação**. Se não houver telemetria, registre investigação **incompleta**, nunca sucesso.

## Critérios para aprovação

O aluno demonstra dois resultados distintos, reproduz os comandos, identifica a função real usada, explica a decisão e declara o que faltaria para testar em um SOC de verdade. A conclusão no portal não executa este código.

**Limite importante:** nenhuma emulação ofensiva ativa, coleta de credenciais, movimentação lateral ou comunicação C2 é realizada. O runner só processa objetos inertes.
