# AULA-096 — gabarito e rubrica: Exploit Protection

## Respostas à prova final

1. NX/DEP limita execução em páginas de dados quando a plataforma e a política permitem; não elimina a falha de corrupção de memória.
2. ASLR diminui previsibilidade dos endereços, mas não elimina bugs nem impede vazamentos ou todas as técnicas.
3. CFG ausente é gap quando a plataforma suporta CFG e a política deveria habilitá-lo; em plataforma incompatível, não se pode reportar a ausência como falha de configuração.
4. É preciso observar separadamente suporte da plataforma e política efetivamente habilitada no processo.
5. Retestar a inicialização e as rotinas legítimas do aplicativo, compatibilidade, estabilidade e desempenho, com plano de reversão documentado.
6. Comparar máquina com cfgSupported=true/cfg=false, que gera gap, com cfgSupported=false/cfg=false e NX/ASLR ativos, que não deve gerar gap CFG.

## Rubrica de correção (100 pontos)

- Mecanismo NX, ASLR e CFG corretamente delimitado: 20.
- Fixture positiva e explicação causal: 20.
- Controle negativo de incompatibilidade e falso positivo evitado: 20.
- Defesa, compatibilidade e reteste: 20.
- Fontes, limites e documentação reproduzível: 20.

**Erro eliminatório:** confundir a presença das mitigações com correção de bug, ou declarar uma ausência de funcionalidade não suportada como vulnerabilidade confirmada.

**Referência:** https://learn.microsoft.com/en-us/defender-endpoint/exploit-protection

Classificação editorial por IA; não equivale à nota de aluno nem à validação humana independente.
