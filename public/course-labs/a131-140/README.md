# Oficinas de análise defensiva — aulas 131–140

**Requisitos:** Node.js 22+; nenhuma rede, amostra suspeita, serviço pago, VM ou licença necessária. Dados inertes e eventos fictícios em memória.

```sh
node public/course-labs/a131-140/run.mjs 131
node --test public/course-labs/a131-140/labs.test.mjs
```

Troque 131 por qualquer número de 132 a 140. Cada saída descreve o caso permitido `allowed`, o contraste `contrast`, as limitações `limit` e a evidência de que o simulador não executa malware. Não identifique eventos de fixture como telemetria real.

**135:** conserva o laboratório executável `/course-labs/phase16-memory/README.md`, que contém dados binários sintéticos e aferição independente de entropia. As oficinas Node são complementares.

**136–140:** REMnux e Sysinternals podem aprofundar trabalho em ambiente autorizado, mas são opcionais. Checklist de isolamento, correlação de PID e baseline de autorun não substituem VM validada, amostras assinadas ou investigação de incidentes reais.

Estas oficinas tratam **propriedades observáveis**, não detecção operacional de malware. Não criam persistência, não executam amostras, não contatam domínios, não carregam ferramentas de evasão e não fazem alterações no computador.
