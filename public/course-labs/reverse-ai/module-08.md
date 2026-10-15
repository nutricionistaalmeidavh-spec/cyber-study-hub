# Módulo 08: Capstone: auditoria e entrega

ID **REV-IA-032** · Relatório do módulo 8 com previsões, saídas observadas, um teste negativo e limitações.

Leia primeiro as etapas 29–31 e a referência canônica AULA-130. Na raiz do projeto execute:

```sh
node public/course-labs/reverse-ai/lab.mjs --module 8
node --test public/course-labs/reverse-ai/lab.test.mjs
```

## Roteiro
1. Leia o roteiro do módulo 8 e anote escopo, ambiente e autorização.
2. Antes de executar, preveja uma saída legítima e outra inválida para "entregar artefato, suíte de teste e dossiê final".
3. Execute o comando local e os testes; registre saída real e eventuais divergências.
4. Explique o que o artefato demonstra e o que não pode demonstrar; anexe evidências e limite de confiança.

Arquivos reais em `public/course-labs/reverse-ai/`: `reference.mjs`, `candidate.mjs`, `lab.mjs`, `lab.test.mjs` e `sample.c`. Para Ghidra, compile o C próprio; REA (https://github.com/morluto/rea) é opcional e sua execução não é fingida pelo runner.

## Checklist
- [ ] Usei apenas arquivo próprio e ambiente local.
- [ ] Registrei uma previsão antes de executar.
- [ ] Executei um caso permitido e um inválido.
- [ ] Separei resultado medido de sugestão da IA.
- [ ] Documentei uma limitação e um reteste.

## Interpretação
Explique por que `differentialMatch: true` só prova equivalência nas amostras verificadas, e por que `negativeControl.rejected: true` é indispensável. Núcleo local gratuito R$0, sem API, sem credenciais e sem binários alheios.
