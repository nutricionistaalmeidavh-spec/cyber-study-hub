# Detecção e testes

- Gatilho didático: `identity !== alice && action=read:F001 && status=200`.
- Controle negativo: Bob recebe 403 e não gera alerta de acesso consumado.
- Falso positivo possível: [preencher]
- Limite: logs falsos ou incompletos não refletem SIEM de produção.
