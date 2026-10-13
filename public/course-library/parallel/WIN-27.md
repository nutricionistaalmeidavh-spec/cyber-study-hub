# WIN-27 — Security Logs

**Trilha paralela:** Windows  
**Posição:** 27/30  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** WIN-26  
**Próxima recomendada:** WIN-28  
**Ambiente:** Windows/VM própria  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivos

Uma tentativa de entrada falhou e o operador consulta os dez últimos eventos do log **System**. Ele obtém eventos recentes, mas não observou a autenticação. Nesta aula você gera uma falha e um sucesso com uma conta local exclusiva em VM própria, consulta **Security**, interpreta campos XML e distingue ausência de evidência de falha de coleta.

Ao final, identifique canal, provedor, ID, tempo, identidade alvo, tipo de logon e motivo; explique por que um 4625 isolado não prova ataque e por que “zero resultados” não prova ausência de tentativa.

## Como a evidência nasce

Uma operação de logon passa por validação de credenciais e regras locais. Quando a política de auditoria correspondente está habilitada, o Windows registra o resultado no canal Security do computador envolvido. O evento 4624 registra uma sessão de logon criada; 4625 registra falha. Quem fez a solicitação (`Subject*`) e a conta que tentou entrar (`Target*`) têm papéis distintos. Correlacione computador, conta, janela e campos de origem antes de inferir sequência.

| Campo | Interpretação no lab | Limite |
|---|---|---|
| Provider | Microsoft-Windows-Security-Auditing | ID sozinho não identifica qualquer provedor |
| EventID | 4624 sucesso; 4625 falha | Não informa sozinho se houve intenção maliciosa |
| EventRecordID | Identificador do registro naquele canal/máquina | Não é identificador global de sessão |
| TimeCreated/SystemTime | Tempo do evento; exportar em UTC | Relógios podem divergir entre hosts |
| TargetUserName/TargetDomainName | Conta e autoridade local/domínio | Nome sem domínio pode ser ambíguo |
| LogonType | 2 interativo, 3 rede, 10 remoto interativo | Não confundir tipo 3 com RDP por padrão |
| Status/SubStatus | Códigos de falha, quando presentes | Podem variar conforme motivo e fluxo |
| TargetLogonId | Identificador local da sessão criada | Não esperar sessão válida equivalente na falha |

Leia propriedades pelo **nome no XML**, não por posição fixa em `Properties[n]`: versões e IDs têm campos diferentes. Um logon local pode ter endereço vazio ou `-`; não invente um IP remoto. Referências: [evento 4624](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624) e [evento 4625](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4625).

## Preparar a VM e a política

Use Windows 11 em VM própria descartável, conta administrativa para consultar/configurar auditoria e conta **local padrão exclusiva** `CshAluno`, criada na LAB-09 ou criada agora por administrador. Não use conta de domínio/corporativa. Inspecione `net accounts`: se a conta já estiver bloqueada ou próximo do limite de tentativas, interrompa e recrie o baseline; só faça **uma** tentativa incorreta.

Baixe [WIN-27-coletar.ps1](/course-labs/phase16-foundations/WIN-27-coletar.ps1). Abra Windows PowerShell de 64 bits elevado. Salve a configuração em pasta nova e ative sucesso/falha apenas em Audit Logon; o GUID evita depender da tradução do nome da subcategoria.

```powershell
$pasta = Join-Path $env:TEMP ('CSH-WIN27-' + [guid]::NewGuid())
New-Item -ItemType Directory -Path $pasta | Out-Null
$backup = Join-Path $pasta 'audit-policy.csv'
auditpol /backup /file:$backup
if ($LASTEXITCODE -ne 0) { throw 'Backup falhou; nao alterar politica' }
auditpol /get /subcategory:'{0CCE9215-69AE-11D9-BED3-505054503030}'
auditpol /set /subcategory:'{0CCE9215-69AE-11D9-BED3-505054503030}' /success:enable /failure:enable
if ($LASTEXITCODE -ne 0) { throw 'Politica nao aplicada' }
auditpol /get /subcategory:'{0CCE9215-69AE-11D9-BED3-505054503030}'
$inicio = Get-Date
```

Confirme na última saída sucesso e falha habilitados. Se a política for controlada por organização, não altere-a; use a VM própria. O backup é da política inteira e deve ser restaurado somente nesta VM sem alterações concorrentes. Referência de sintaxe: [auditpol set](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/auditpol-set).

## Falha, sucesso e controle negativo

Na mesma VM, use o terminal para iniciar um processo como `CshAluno`. A senha será pedida interativamente; não escreva senha no comando, script ou relatório.

```powershell
runas /user:.\CshAluno "cmd /k whoami"
# Uma senha errada propositalmente; aguarde a mensagem de falha.
runas /user:.\CshAluno "cmd /k whoami"
# Agora a senha correta; a nova janela deve mostrar MAQUINA\cshaluno.
$fim = Get-Date
.\WIN-27-coletar.ps1 -Inicio $inicio -Fim $fim -Conta CshAluno |
    Set-Content -Encoding UTF8 (Join-Path $pasta 'eventos.json')
Get-Content (Join-Path $pasta 'eventos.json')
Get-FileHash (Join-Path $pasta 'eventos.json') -Algorithm SHA256
```

Espere pelo menos um 4625 referente à tentativa incorreta e um 4624 ao logon bem-sucedido. Neste fluxo `runas` comum, espere tipo interativo 2; registre o tipo observado e investigue se divergir. Podem existir eventos adicionais legítimos; não exija “exatamente dois”. Senha errada pode aparecer como `Status=0xC000006D`, `SubStatus=0xC000006A`; se vier outro código, consulte a documentação e confronte com a ação realizada, em vez de reclassificá-lo automaticamente como senha errada.

Controle negativo: repita o coletor com `-Conta CSH_Conta_Que_Nao_Foi_Usada` na **mesma janela**, sem tentar autenticar essa conta. Espere `Quantidade: 0`. Isso testa o filtro de identidade sem gerar nova falha. Em um intervalo sem evento correspondente, o coletor devolve zero; se houver acesso negado, ele termina com erro, preservando a diferença.

## Detecção e falso positivo

Crie uma linha de investigação: conta local + host + janela curta + falha seguida de sucesso. Neste lab, essa sequência foi causada por uma digitação errada e retentativa legítima. Em operação real, acrescente origem, tipos, volume e contexto da conta antes de escalar. Não some registros de hosts diferentes pelo `RecordId`, nem use o ID de logon da tentativa falha para afirmar uma sessão que não foi criada.

O JSON reduz os dados ao conjunto necessário, mas ainda contém identidade e possivelmente origem. Mantenha-o no exercício; evite exportar o Security inteiro. O hash detecta mudança posterior do arquivo, não prova que o evento representa a verdade absoluta ou quem coletou.

## Correção, reteste e encerramento

Se a consulta trouxer zero para ambas as ações, confirme em ordem: VM correta, acesso ao canal Security, janela, nome/domínio da conta e política **Audit Logon** efetiva. Consulte um evento em XML com `Get-WinEvent`/Event Viewer para conferir `TargetUserName`. Não troque para System para “obter alguma saída”. Se for acesso negado, reabra a sessão administrativa da VM autorizada; não silencie a exceção.

Após corrigir a coleta/política, repita **uma** falha controlada e um sucesso, mais o filtro da conta não utilizada. Guarde política efetiva, horários, IDs e códigos observados. Feche a janela do usuário de teste. Na mesma sessão administrativa, restaure o backup e confira o retorno:

```powershell
auditpol /restore /file:$backup
if ($LASTEXITCODE -ne 0) { throw 'Restauracao falhou: consultar backup antes de encerrar' }
auditpol /get /subcategory:'{0CCE9215-69AE-11D9-BED3-505054503030}'
```

Não limpe o Security log para apagar a atividade. Se preferir restaurar o snapshot da VM, exporte antes a evidência do exercício: a restauração pode desfazer os próprios eventos que você pretende comparar.

## Prática parcial e desafio

Parcial: em um 4625, marque TargetUserName, LogonType, Status e SubStatus; diga quais campos não existem ou estão vazios. Independente: explique uma falha de **coleta** e uma falha de **logon**, mostrando como o coletor e o evento as representam de formas distintas. Gabarito parcial: erro PowerShell “acesso negado” vem do leitor; 4625 com código de falha vem da tentativa auditada. Um não substitui o outro.

## Quiz

1. **Para esta autenticação local, por que consultar Security?** A) Porque filtrar ID4625 em System consulta também Security. B) Porque 4624/4625 são eventos de auditoria nesse canal. C) Porque sucesso fica em System e só falha fica em Security.
2. **Tipo 3 prova RDP?** A) Sim, qualquer logon de rede é remoto interativo. B) Sim, se IpAddress estiver preenchido. C) Não, é logon de rede; remoto interativo é tipo 10.
3. **Acesso negado ao consultar equivale a zero eventos?** A) Não, a coleta falhou. B) Sim, porque nenhum registro foi retornado. C) Sim, se a janela de tempo foi informada corretamente.

**Gabarito:** 1 B; 2 C; 3 A. Canal, tipo e resultado da coleta são dimensões distintas.

## Flashcards

- **4624 / 4625** → Sessão criada / tentativa de logon falhou, conforme auditoria.
- **Target versus Subject** → Conta alvo do logon versus identidade que solicita a operação.
- **RecordId** → Identificador local de registro, não chave global de correlação.
- **Zero versus acesso negado** → Consulta válida sem correspondência versus falha de leitura.

## Referência de consulta

[Get-WinEvent e filtros](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent?view=powershell-7.6). O script usa recursos existentes no Windows PowerShell 5.1; a execução com eventos reais de Windows precisa ser registrada na sua VM.
