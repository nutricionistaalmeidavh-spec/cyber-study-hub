# AULA-080 — Respostas comentadas da prova independente

Abra depois de registrar sua tentativa. Nota A é avaliação editorial assistida por IA, não nota individual nem experimento com alunos.

**Cenário da atividade:** Event ID 1 cria cmd.exe ProcessGuid P-7; Event 3 registra rede de P-7. Outro processo tem mesmo PID=123, mas GUID P-8.

## Questão 1

**Enunciado:** Como associar ProcessCreate e NetworkConnect?

**Resposta e justificativa:** Usar ProcessGuid de Event 1 e Event 3, preservando parent e imagem.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 2

**Enunciado:** Por que não unir por PID=123?

**Resposta e justificativa:** PID pode ser reutilizado; GUID separa instâncias.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 3

**Enunciado:** Como tratar conexão sem processo correspondente?

**Resposta e justificativa:** Manter unmatched e investigar cobertura e retenção, sem atribuição falsa.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 4

**Enunciado:** Qual cuidado com Event 3 e Event 7?

**Resposta e justificativa:** Event 3 costuma ser desabilitado por padrão; Event 7 exige calibração por volume.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 5

**Enunciado:** Qual positivo deve continuar no reteste?

**Resposta e justificativa:** P-7 com conexão correspondente continua associado.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 6

**Enunciado:** O que faltaria antes de declarar cobertura real?

**Resposta e justificativa:** EVTX e configuração reais, eventos habilitados, retenção, timestamp e validação host.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Rubrica de correção

- 6 perguntas × 15 pontos = 90. Avaliar decisão, mecanismo, evidência e contraexemplo.
- 10 pontos pela execução, reteste e explicação do limite.
- Aprovação do exercício: 80/100 sem erro eliminatório; separada da classificação editorial.
- **Erro eliminatório:** propor somente desligar o serviço legítimo, afirmar intrusão comprovada por simulação ou ignorar autorização.
- Limite técnico do cenário: Não executa Sysmon/EVTX nem mede Event 7, impacto da filtragem, cobertura EDR ou driver real.
