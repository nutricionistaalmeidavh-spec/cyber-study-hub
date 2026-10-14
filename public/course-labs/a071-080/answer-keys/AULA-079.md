# AULA-079 — Respostas comentadas da prova independente

Abra depois de registrar sua tentativa. Nota A é avaliação editorial assistida por IA, não nota individual nem experimento com alunos.

**Cenário da atividade:** Um logon Windows às 13:00Z e sudo Linux às 10:05-03 foram ordenados pelo relógio de parede, fazendo Linux aparecer antes indevidamente.

## Questão 1

**Enunciado:** Qual evento ocorreu primeiro após conversão?

**Resposta e justificativa:** Windows 13:00Z, cinco minutos antes do Linux 13:05Z.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 2

**Enunciado:** Por que comparar 10:05 e 13:00 é errado?

**Resposta e justificativa:** Fusos diferentes podem inverter a ordem aparente.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 3

**Enunciado:** Como lidar com timestamp sem fuso?

**Resposta e justificativa:** Quarentenar/rejeitar e exigir metadado de origem, sem adivinhar.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 4

**Enunciado:** Que campos manter no índice?

**Resposta e justificativa:** Fonte, horário original, UTC, identidade, host e parser.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 5

**Enunciado:** Como provar que a correção preserva eventos?

**Resposta e justificativa:** Dois registros com fuso permanecem presentes e ordenados, inválido fica rastreável.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 6

**Enunciado:** O que impede concluir ausência de suspeita com dois logs?

**Resposta e justificativa:** Cobertura, retenção e coleta não foram comprovadas.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Rubrica de correção

- 6 perguntas × 15 pontos = 90. Avaliar decisão, mecanismo, evidência e contraexemplo.
- 10 pontos pela execução, reteste e explicação do limite.
- Aprovação do exercício: 80/100 sem erro eliminatório; separada da classificação editorial.
- **Erro eliminatório:** propor somente desligar o serviço legítimo, afirmar intrusão comprovada por simulação ou ignorar autorização.
- Limite técnico do cenário: Somente ordenação sintética, sem drift NTP, atraso de ingestão, EVTX ou syslog real.
