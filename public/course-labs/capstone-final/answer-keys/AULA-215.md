# Gabarito separado — AULA-215: Detecções — YARA, Sigma, EDR e SIEM

> Abra após escrever as respostas. Este gabarito descreve o modelo determinístico EscolaLab, não observação de aluno.

## Oráculo e análise

Somente bob/vulnerable: UNAUTHORIZED_READ_DEMO; os outros dois retornam null. Isso não prova qualidade de detector comercial.

**Causa / princípio:** Sigma é uma linguagem de regra para eventos; YARA/YARA-X relaciona padrões de conteúdo de arquivos; EDR fornece telemetria de endpoint; SIEM correlaciona dados. Nesta aula executamos apenas uma função JS com eventos JSON, NÃO engines Sigma, YARA, EDR ou SIEM.

**Contraprova:** Uma regra com status===200 sem considerar dono produz falso positivo para Alice; documente essa contraprova e o risco de falso negativo se identidade/asset estiverem incorretos.

## Perguntas resolvidas

1. **Por que um HTTP 200 isolado não indica incidente?** Acesso legítimo de Alice também responde 200: contexto de propriedade é obrigatório.

2. **O que Sigma representa neste contexto?** Uma especificação de detecção sobre logs, não a função JS usada como motor do exercício.

3. **YARA processa a mesma entrada que esta regra didática?** Não. YARA/YARA-X é orientada a padrões de arquivos, não substitui análise contextual de HTTP.

4. **Onde EDR e SIEM atuariam numa arquitetura real?** EDR coleta telemetria de endpoint; SIEM agrega/correlaciona logs com normalização e contexto.

5. **Que caso impede falso positivo em Alice?** Alice/corrected/200 precisa não produzir alerta.

6. **Por que a identidade de URL não é confiável em produção?** É apenas um parâmetro controlável pelo cliente; exigiria sessão e autorização no backend.

## Transferência a F002/Carol

O cenário F002/Carol é hipótese no papel. A fixture atual só reconhece F001, Alice e Bob. Uma resposta correta prevê a necessidade de alterar o dataset e vincular autorização à propriedade da fatura antes de executar; NÃO alega que F002 foi ensaiada. O teste positivo deveria permitir Carol ver o próprio objeto; o negativo deve impedir outro ator. Registre escopo e condição de parada.

## Rubrica (100 pontos)

| Dimensão | Pontos | Evidência observável |
|---|---:|---|
| Mecanismo e conceitos | 30 | Explicação do fluxo e da fronteira de confiança |
| Causa/defesa | 20 | Controle no componente que decide o acesso |
| Contraprova segura | 20 | Entrada, esperado, observado e interpretação |
| Reteste positivo | 20 | Ação legítima continua válida |
| Escopo/limites | 10 | Dados sintéticos, autorização e conclusão proporcional |

**Meta 80/100. Erro eliminatório:** testar fora de escopo ou inventar evidência. A classificação editorial A não equivale a uma nota do aluno nem validação humana.

**Fonte:** https://sigmahq.io/docs/basics/rules.html
