# Gabarito independente — AULA-038: SAST, DAST, SCA e Secret Scanning

**Princípio:** use apenas depois de registrar a própria tentativa. O estudo usa casos fictícios e não autoriza testes externos.

## Contexto da avaliação

CI apresenta um valor parecido com chave em fixture de testes, uma dependência com alerta de versão e uma rota de login que retorna 401. O gerente quer classificar os três como incidentes.

## Respostas esperadas

## Questão 1

Secret scanning, SCA e DAST; a ferramenta nomeia sinal, não incidente.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 2

O valor que seja de fato credencial ativa/exposta, não dummy; a rotação deve ser coordenada.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 3

É decisão possível de autenticação esperada; exigir teste legítimo e não autorizado.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 4

Conferir advisory, versão real, alcance de código/feature e mitigação, com owner.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 5

Mascaramento, proteção de segredos, secret scanning, não imprimir tokens e política de rotação.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Questão 6

Regras de negócio e autorização por objeto merecem testes funcionais próprios em contas fictícias.

**Evidência esperada:** o estudante indica um contexto autorizado, um resultado verificável e um limite do próprio raciocínio.

## Rubrica de correção

| Item | Pontos | Como conferir |
| --- | ---: | --- |
| Interpretação técnica das questões 1–2 | 30 | Identifica fronteiras, ativos, política e efeitos, sem trocar causa por sintoma |
| Casos e controles das questões 3–4 | 30 | Um cenário legítimo, um negativo isolado, evidência de resultado |
| Regresso, incertezas e método das questões 5–6 | 30 | Reteste rastreável, hipóteses alternativas, limites honestos |
| Clareza, autorização e proteção de dados | 10 | Evidência sem dados reais, escopo limitado, terminologia coerente |

**Erro eliminatório:** Exibir ou copiar segredo real para provar que o scanner funciona.

**Aprovação sugerida:** 80/100 sem erro eliminatório. Esta rubrica é avaliação de resposta, não demonstração observacional com alunos reais.
