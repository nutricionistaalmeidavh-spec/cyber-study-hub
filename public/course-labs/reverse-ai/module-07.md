# Módulo 07 — Reconstrução e testes diferenciais

**ID canônico do laboratório:** REV-IA-028 · **pré-requisito:** REV-IA-025. Esta oficina complementa a aula, não substitui a explicação.

## Problema concreto e entrega
Ao final, o estudante deverá escrever uma implementação nova sem copiar código ou ativos, com evidência local auditável e limite explícito de inferência.
**Entregue:** Relatório do módulo 7 com previsões, saídas observadas, um teste negativo e limitações. Produza um arquivo Markdown seu com escopo, versão de Node, previsão, resultado executado, erro esperado e limites.

## Materiais e links verificáveis
- Arquivos prontos no repositório: [lab.mjs](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/blob/main/public/course-labs/reverse-ai/lab.mjs), [reference.mjs](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/blob/main/public/course-labs/reverse-ai/reference.mjs), [candidate.mjs](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/blob/main/public/course-labs/reverse-ai/candidate.mjs), [sample.c](https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/blob/main/public/course-labs/reverse-ai/sample.c).
- Referência canônica: [AULA-129](/#course/main/129). Não marque a aula original como concluída apenas por ler sua referência.
- REA: https://github.com/morluto/rea — agente MCP opcional; Ghidra: https://github.com/NationalSecurityAgency/ghidra — alternativa gratuita para inspeção nativa. Hopper/serviços externos são opções pagas, não requisitos.

## Execução reproduzível — R$ 0, sem rede
Na raiz do repositório, com Node.js 22+ instalado:

```sh
node public/course-labs/reverse-ai/lab.mjs --module 7
node --test public/course-labs/reverse-ai/lab.test.mjs
```

A execução gera JSON com `input`, `observed`, `candidate`, `differentialMatch` e `negativeControl`; o teste de negativa precisa retornar `rejected: true`. O runner não executa REA nem Ghidra por você.

## Procedimento (previsão antes de resultado)
1. Leia o roteiro do módulo 7 e anote escopo, ambiente e autorização.
2. Antes de executar, preveja uma saída legítima e outra inválida para "escrever uma implementação nova sem copiar código ou ativos".
3. Execute o comando local e os testes; registre saída real e eventuais divergências.
4. Explique o que o artefato demonstra e o que não pode demonstrar; anexe evidências e limite de confiança.

## Caso de transferência
Atue como revisor de engenharia reversa defensiva. Analise APENAS um programa didático de minha autoria. Meta do módulo 7: escrever uma implementação nova sem copiar código ou ativos. Artefato: candidate.mjs é uma implementação independente que passa pelos mesmos testes da referência. Primeiro formule três hipóteses e indique como refutá-las. Depois escreva uma matriz com entrada legítima, fronteira e negativa, saídas observáveis, proveniência da evidência e limites de inferência. Não presuma acesso a código original nem declare equivalência completa. Não peça credenciais, não examine software de terceiros e não dependa de API paga. Dê uma alternativa totalmente manual/local e distinga sugestões de evidências reais.

**Teste de interpretação:** Leia a AULA-129 e explique em pelo menos 120 caracteres como seu conceito se conecta a "escrever uma implementação nova sem copiar código ou ativos". Compare uma evidência concreta com uma inferência possível e proponha um teste que refutaria a hipótese. Não copie o texto da referência.

## Checklist de aceitação
- [ ] Usei apenas arquivo próprio e ambiente local.
- [ ] Registrei uma previsão antes de executar.
- [ ] Executei um caso permitido e um inválido.
- [ ] Separei resultado medido de sugestão da IA.
- [ ] Documentei uma limitação e um reteste.

## Limites e correção
Verificar `differentialMatch: true` apenas prova igualdade para a entrada executada, não todos os possíveis valores ou todas as plataformas. Se modificar `candidate.mjs` e quebrar uma regra, o reteste deve falhar: explique a causa e repare. Nunca rode arquivos desconhecidos nem contorne mecanismos de licença.
