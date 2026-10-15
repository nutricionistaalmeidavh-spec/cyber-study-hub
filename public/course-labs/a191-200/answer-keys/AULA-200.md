# AULA-200 — Electron / Desktop Security: gabarito comentado
**Uso:** consultar apenas depois de responder à avaliação de transferência; não disponibilizar respostas na página da aula.

## Respostas e justificativas
1. **Ator, recurso e fronteira:** Uma janela Electron solicita notes:read. Outra janela usa URL idêntica e tenta ler a nota; confiar só na URL do evento IPC permitiria remetente não autorizado.
2. **Mecanismo e regra:** Main retém capacidade de OS e sessão; preload deve expor somente operação específica e renderer não deve escolher canal ou owner. contextIsolation, sandbox e nodeIntegration:false reduzem superfície, mas a autorização do handler precisa comparar WebContents, frame, argumento e propriedade. Dados DOM com textContent.
3. **Correção causal:** Comparar WebContents e frame principais, origem exata, schema estrito, usuário do main e owner da nota; impedir novas janelas e navegações indevidas, evitar IPC bruto. Preservar suíte Electron anterior com handler real e opção GUI.
4. **Evidência negativa:** alterar senderId para 8 sem mudar a URL deve resultar em `SENDER_DENIED`. Caso o simulador aceite, o controle da fixture falhou.
5. **Evidência positiva:** `assessIpcRead({senderId:7,expectedSenderId:7,frameUrl:'course://app/index.html',expectedFrameUrl:'course://app/index.html',args:{id:'a'},sessionUser:'alice',recordOwner:'alice'})` deve produzir `ALLOW_FIXTURE`, sem alterar o caso autorizado.
6. **Limitação fundamental:** aprovação de uma fixture determinística não mede políticas reais, proveniência, autenticação, runtime ou aprendizado humano. Requer laboratório nativo de propriedade do estudante para extrapolar.

## Rubrica verificável (100 pontos)
30 fronteira, conceitos e regra; 20 correção primária; 20 evidência do caso indevido; 20 reteste preservando a função; 10 escopo e riscos residuais.
**Erros impeditivos:** afirmar garantia de segurança de produção com base em fixture, usar credenciais reais ou sistemas não autorizados, ou tornar solução paga um pré-requisito silencioso.
