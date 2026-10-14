# AULA-071 — Respostas comentadas da prova independente

Abra depois de registrar sua tentativa. Nota A é avaliação editorial assistida por IA, não nota individual nem experimento com alunos.

**Cenário da atividade:** O time encontrou eventos 4768, 4769, 4776 e uma consulta LDAP. Alguém rotulou todos como 'autenticação LDAP' e quer bloquear NTLM sem inventário.

## Questão 1

**Enunciado:** Que protocolo e fase correspondem a 4768, 4769, 4776 e uma busca LDAP?

**Resposta e justificativa:** 4768 TGT; 4769 service ticket; 4776 verificação NTLM; LDAP faz consulta de diretório.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 2

**Enunciado:** Por que 4769 não comprova acesso a dados restritos?

**Resposta e justificativa:** Obtenção de ticket não substitui autorização do serviço; correlacionar logs e permissão efetiva.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 3

**Enunciado:** Qual o risco de bloquear NTLM sem inventário?

**Resposta e justificativa:** Serviços legados podem perder autenticação; auditar dependências, migrar e testar reversão.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 4

**Enunciado:** Como diferenciar signing, TLS e channel binding?

**Resposta e justificativa:** Signing garante integridade em LDAP SASL, TLS protege transporte e CBT liga autenticação SASL à sessão TLS quando aplicável.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 5

**Enunciado:** Que negativo demonstra identificação de legado sem bloquear Kerberos?

**Resposta e justificativa:** 4776 é sinalizado para inventário; 4768/4769 seguem classificados e funcionais.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Questão 6

**Enunciado:** O que faltaria para auditar um domínio real?

**Resposta e justificativa:** Eventos íntegros de DC, clientes, tipos de bind, protocolos, horário e falhas reais.

**Exigência de evidência:** relacione a resposta ao dado concreto do cenário e diga qual limite impediria generalizar para produção.

## Rubrica de correção

- 6 perguntas × 15 pontos = 90. Avaliar decisão, mecanismo, evidência e contraexemplo.
- 10 pontos pela execução, reteste e explicação do limite.
- Aprovação do exercício: 80/100 sem erro eliminatório; separada da classificação editorial.
- **Erro eliminatório:** propor somente desligar o serviço legítimo, afirmar intrusão comprovada por simulação ou ignorar autorização.
- Limite técnico do cenário: Não há KDC, DC real, teste criptográfico ou sessão LDAP; apenas classificação estática de registros fictícios.
