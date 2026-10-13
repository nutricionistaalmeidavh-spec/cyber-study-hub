# Pesquisa aplicada ao Cyber Study Hub — 2026-09-02

Este arquivo espelha os achados salvos no Google Drive e registra apenas o que influencia decisões do produto.

## Evidência pedagógica

A pesquisa via Sider Scholar encontrou suporte para:

- worked examples para reduzir carga cognitiva de novatos;
- self-explanation;
- completion problems / faded worked examples;
- progressão de exemplo completo para resolução independente;
- redução de carga extrínseca;
- laboratórios hands-on como componente central de cybersecurity;
- retrieval practice e revisão espaçada como mecanismos de retenção.

## Repositórios estudados

- OWASP Juice Shop — desafios/AppSec/ambiente local deliberadamente vulnerável.
- OWASP WebGoat — aula + exercício + mitigação.
- OWASP crAPI — API Security e importância de ensinar o happy path antes da falha.
- Atomic Red Team — setup, técnica controlada, evidência, cleanup e MITRE ATT&CK.
- SigmaHQ/sigma — fonte defensiva para SIEM/Sigma/threat hunting/detection engineering.
- Yara-Rules/rules — exemplos de YARA, sujeitos a revisão de licença e atualidade.
- pwn.college dojo — referência arquitetural para challenges e progressão.
- open-spaced-repetition/ts-fsrs — candidato futuro para revisão espaçada local-first.

## Aplicação desta entrega

A Aula 47 v2 já adota:

1. problema concreto;
2. fundamentos progressivos;
3. mecanismo;
4. worked example;
5. autoexplicação;
6. completion exercise;
7. exercício independente;
8. laboratório;
9. detecção;
10. correção e reteste;
11. revisão específica.

Os repositórios externos foram catalogados, não copiados.

## Pesquisa complementar específica para cache/proxies

Também foram encontrados:

- `GrrrDog/weird_proxies` — cheatsheet de reverse proxies com referências para cache deception, cache poisoning, normalização e comportamentos divergentes. Como não há licença declarada no metadata consultado, será usado somente como referência.
- `PortSwigger/param-miner` — projeto ativo e relevante para pesquisa de parâmetros não-keyed e comportamento de cache. É mais útil para a Aula 46 e para análise de cache key do que como dependência direta da Aula 47.
- `SpiderLabs/Airachnid-Burp-Extension` — extensão histórica específica para Web Cache Deception. Último push observado em 2021; registrada apenas como referência histórica e não como ferramenta recomendada do curso.

A Aula 47 v2 mantém o laboratório próprio/local como padrão, evitando dependência de scanners externos.
