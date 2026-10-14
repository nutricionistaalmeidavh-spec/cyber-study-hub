# Auditoria editorial A — Aulas 081 a 090

**Revisão:** 13/10/2026. **Natureza:** segunda passagem crítica por IA; não há validação com alunos reais, especialistas externos humanos ou certificação.

## Escopo

- 10 aulas canônicas de Blue Team, do Wireshark ao DFIR; títulos e IDs intactos.
- Cada aula tem mecanismo temático, entrada sintética, contraprova, laboratório Node 22 sem rede, seis questões específicas e gabarito individual.
- Os 12 testes Node verificam comportamento, fronteiras, falso positivo e casos negativos; o teste estrutural valida as 10 oficinas e os links.
- Registro `quality/registry.json` vincula **SHA-256 do markdown exato** a seis dimensões e aos gates. O relatório independente `quality/reviews/a81-90-2026-10-13.json` preserva fontes e limitações por aula.
- CI inicial antes da promoção: https://github.com/nutricionistaalmeidavh-spec/cyber-study-hub/actions/runs/38499842574 — testes específicos e build com regressões anteriores aprovados.

## Como retestar

```bash
npm ci --no-audit --no-fund
npm run test:a-81-90
npm run test:grade-a-81-90
npm run verify:quality
npm run build
```

O gate canônico deve falhar se qualquer uma das 10 aulas for editada sem atualizar revisão e hash. A nota A é **editorial por IA** e não é indicação de domínio de alunos.

## Fronteiras e confiabilidade

- No core, **R$ 0 / open source / self-hosted**. Não há chaves, APIs pagas, captura de tráfego de terceiros ou infraestrutura obrigatória.
- O laboratório de Wireshark não interpreta PCAP; Suricata não é engine inline; Sigma/YARA não são parsers completos; SIEM não ingere dados de produção; hunting, IR e DFIR são simulações restritas.
- Evite afirmações de detecção completa, autoria de ataque, validade jurídica de cadeia de custódia ou eficácia operacional a partir do sucesso de um teste unitário.
- Não modificar login, OAuth, rotas, catálogo ou segredos nesta entrega.
