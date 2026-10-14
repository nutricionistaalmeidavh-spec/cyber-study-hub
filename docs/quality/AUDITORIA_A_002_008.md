# Auditoria editorial A — aulas 002–008

**Data:** 13/10/2026. **Escopo:** A editorial técnica/didática por IA, não certificação oficial ou estudo com alunos reais. A revisão é uma segunda passagem crítica documentada sobre o material e evidências executáveis; não afirmamos revisor humano independente.

| Aula | Conteúdo técnico | Didática | Prática | Defesa | Avaliação | Especificidade | Nota |
|---|---:|---:|---:|---:|---:|---:|---|
| AULA-002 | 94 | 91 | 92 | 93 | 94 | 96 | A editorial (IA) |
| AULA-003 | 95 | 92 | 92 | 95 | 94 | 96 | A editorial (IA) |
| AULA-004 | 96 | 93 | 92 | 95 | 94 | 97 | A editorial (IA) |
| AULA-005 | 93 | 94 | 95 | 95 | 94 | 96 | A editorial (IA) |
| AULA-006 | 95 | 92 | 94 | 95 | 94 | 97 | A editorial (IA) |
| AULA-007 | 96 | 93 | 96 | 95 | 94 | 97 | A editorial (IA) |
| AULA-008 | 95 | 93 | 90 | 95 | 94 | 97 | A editorial (IA) |

## Metodologia

- Documento da aula preserva a identidade no catálogo existente. O antigo quiz genérico das aulas 002/003/005–008 foi substituído por exemplos específicos, laboratório e prova independente; a aula 004, já aprofundada na Fase 16, recebeu prática de migração e nova prova.
- Prova de seis perguntas por unidade, **42 itens** e sete arquivos de gabarito comentado, com erros eliminatórios. O gabarito é público; o aluno escolhe consultá-lo após registrar tentativa. Uma nota A da aula **não** representa que o aluno obteve nota A na atividade.
- Execução reproduzível: seis casos Node com variações positivas/negativas, quatro casos SQLite em memória e testes bcrypt existentes no diretório `phase16-web-p0`. CI deve executar Node, Python, bcrypt, verificadores curriculares, integridade de hashes e build.
- Cada uma das seis dimensões possui método, referência ao material concreto e resultado no arquivo JSON em `quality/reviews/a-002-008-2026-10-13.json`.
- Testes de interface real com estudantes, navegadores reais e plataformas externas ainda são desejáveis; não afirmamos sua execução.

## Segurança e limites

As amostras são defensivas e locais. O código JWT é **apenas demonstrativo**; aplicações reais devem usar bibliotecas auditadas e políticas adicionais de issuer, key rotation e revogação. O SQLite usa `:memory:` e entradas sintéticas, sem alcançar serviços reais. O XSS demonstra texto literal e encoding; o teste Node **não** valida todos os contextos de browser. O bcrypt reaproveita o laboratório existente e não altera credenciais de usuários.

## Condições para manutenção do A

Alterações nos sete arquivos Markdown mudam SHA-256 e invalidam parecer, exigindo nova revisão. Não há promoção automática por contagem de palavras, quantidade de questões ou build verde; os resultados editoriais foram fundamentados, e o sistema não mede aprendizado humano.
