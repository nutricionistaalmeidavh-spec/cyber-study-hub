# Auditoria editorial A — aulas 031–040

**Data:** 13/10/2026. **Modalidade:** segunda passagem crítica por IA, não auditoria humana externa. **Estudantes humanos:** nenhum teste observacional realizado.

## O que foi alterado

As aulas 031–035 e 037–040 foram reescritas com narrativas específicas, pré-requisitos recomendados, vocabulário inicial, mecanismos causais, laboratórios Node, limites e detecção, provas independentes com seis questões e gabaritos separados. A aula 036, que já tinha diagrama STRIDE e modelo F1/F2/F3, **preservou o material existente** e recebeu expansão de laboratório e transferência.

O núcleo é **R$ 0**, open source, sem contas externas e sem API comercial; HTTP é executado apenas no loopback gerado na suíte. Ferramentas externas não são necessárias.

## Método e resultados registrados

Cada unidade possui seis dimensões A (80–100), parecer e SHA-256 do Markdown no arquivo `quality/registry.json` e evidências unitárias em `quality/reviews/a031-040-2026-10-13.json`. A revisão distingue hipótese de achado confirmado, efeito do teste, reteste positivo/negativo e limites dos modelos. A nota A é **editorial assistida por IA**; não mede eficácia pedagógica humana.

- 031: escopo exato por tempo, origem, porta e rota
- 032: inventário real de três rotas em loopback e status 200/401
- 033: pista, hipótese, confirmação e proteção
- 034: impacto qualitativo somente após evidência
- 035: finding completo, redação de segredo, reteste sem quebrar fluxo legítimo
- 036: STRIDE com fluxo, principal e autoridade de storage
- 037: alteração de nome autorizada, papel administrativo negado
- 038: SAST, DAST, SCA e secret scanning classificados corretamente
- 039: gate falha fechado com testes negativos
- 040: capstone do escopo ao reteste e gate

## Comandos de verificação

```sh
npm ci --no-audit --no-fund
npm run test:a-031-040
npm run verify:quality
npm run build
```

O workflow `Aulas 031-040 QA` é disparado em PR/workflow_dispatch. Os testes existentes dos 543 IDs e das 26 unidades A anteriores continuam intactos. O registro final deve conter **36 A** após o merge, se CI passar.

## Limitações e semântica dos gates

`didaticaInicianteValidada` significa caminhada editorial por IA simulando perspectiva do iniciante; não há coleta empírica com aluno. `avaliacaoIndependenteRevisada` é conferência por segunda passagem IA da prova sem antecipar respostas no documento. `revisorIndependente` é distinto da autoria em processo, mas **não é revisor humano externo**. As simulações não validam escopo legal, bancos de dados reais, provedor de autenticação, serviços cloud, CVSS nem segurança global de produção.

Fontes de método: [OWASP WSTG v4.2](https://wstg.owasp.org/v4.2/2-Introduction/), [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final) e [Microsoft STRIDE](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats).
