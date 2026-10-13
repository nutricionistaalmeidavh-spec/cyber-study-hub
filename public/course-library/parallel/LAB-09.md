# LAB-09 — Windows VM

**Trilha paralela:** Laboratório e Ferramentas  
**Posição:** 9/30  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** LAB-08  
**Próxima recomendada:** LAB-10  
**Ambiente:** VM/localhost/escopo autorizado  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Uma imagem Windows inicia, mas ninguém sabe sua procedência, build, usuário efetivo, conexão de rede ou capacidade de gerar logs. “Ligou” não torna a VM um laboratório reproduzível. O objetivo é preparar uma VM licenciada/avaliativa, separar conta administrativa e conta de prática, registrar o baseline e confirmar logging com um marcador benigno único.

## Imagem, estado e identidade

Baixe a ISO da Microsoft usando uma licença adequada ou os termos da avaliação disponível. Registre edição, URL, data, SHA-256 e condições/prazo da avaliação; não distribua ISO nem contorne ativação. Compare o hash com o fornecedor quando ele o disponibilizar: calcular um hash local sem comparação só identifica aquele arquivo. Fontes: [Windows 11 Enterprise Evaluation](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise) e [requisitos do Windows 11](https://learn.microsoft.com/en-us/windows/whats-new/windows-11-requirements).

Escolha hipervisor compatível, arquitetura correspondente à ISO e recursos exigidos. Para Windows 11, confira CPU compatível, UEFI/Secure Boot e vTPM 2.0, além de memória e disco. Não use bypasses do instalador. Reserve recursos com folga para host e guest; disco virtual dinâmico ainda pode preencher o host. Registre as escolhas, inclusive qualquer integração host–guest.

O usuário tem SID e associação a grupos; o processo recebe um token. Pertencer a Administrators não significa que toda janela esteja elevada: UAC pode fornecer token filtrado. Nesta aula `CshAluno` pertence somente ao grupo padrão Users; o administrador da VM será usado apenas para preparação e teste de logging.

## Instalação e preparação

1. Crie VM nova, disco novo e adaptador NAT apenas para instalar e atualizar pelos serviços oficiais. Não use bridge. Desative clipboard, drag-and-drop, pastas compartilhadas e passthrough USB.
2. Instale a edição escolhida pelo fluxo oficial. Use identidade de laboratório conforme opções suportadas pela edição; não associe contas de produção. Conclua atualizações e reinicie quando solicitado.
3. Baixe os arquivos desta aula no guest. Anote o nome da VM, edição, build e estado da avaliação. Desligue e faça snapshot `windows-base-atualizado`.
4. Para a prática offline, remova NAT e use adaptador desconectado ou Internal Network sem gateway, conforme LAB-03. Documente todos os adaptadores. Não confunda instalar atualizações com validar isolamento.

Baixe [LAB-09-baseline.ps1](/course-labs/phase16-foundations/LAB-09-baseline.ps1). Ele lê build, SID, elevação, interfaces, rotas, perfis de firewall e estado consultável do Defender; falha ao consultar Defender é registrada como `nao-consultado`, sem desabilitá-lo.

## Conta padrão explícita

Em Windows PowerShell **64 bits elevado** da VM, confirme que o nome não existe e crie uma senha própria no prompt. O grupo é resolvido pelo SID conhecido, evitando depender de “Users” versus “Usuários”.

```powershell
if (Get-LocalUser -Name CshAluno -ErrorAction SilentlyContinue) {
    throw 'Nome ja existe; nao modificar conta preexistente'
}
$senha = Read-Host 'Senha exclusiva do laboratorio' -AsSecureString
New-LocalUser -Name CshAluno -Password $senha -Description 'Pratica CSH local'
$grupoPadrao = Get-LocalGroup -SID 'S-1-5-32-545'
Add-LocalGroupMember -Group $grupoPadrao -Member CshAluno
Get-LocalGroupMember -Group $grupoPadrao
```

Não adicione CshAluno a Administrators. A criação pode exigir senha conforme política; use o erro para ajustar uma senha do lab, sem enfraquecer a política. A API usada está em [New-LocalUser](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/new-localuser?view=powershell-5.1).

Saia da conta administrativa e entre como CshAluno. Baixe/copie o script para o perfil desse usuário antes de desconectar a rede, ou use diretório de material local preparado na instalação. Execute sem elevação:

```powershell
whoami /user
whoami /groups
.\LAB-09-baseline.ps1 | Set-Content -Encoding UTF8 .\baseline-aluno.json
Get-Content .\baseline-aluno.json
```

Espere SID da conta de prática e `TokenElevado: false`. Controle negativo: tente criar um arquivo de teste em `C:\Windows\CSH-LAB09-nao-deve-criar.txt` **somente se esse nome ainda não existir**, com `New-Item -ItemType File -ErrorAction Stop`. Espere acesso negado. Não substitua a conta por administrador para forçar o sucesso: o objetivo é demonstrar o limite. Se conseguir criar, investigue token e ACL; o baseline não está aprovado. Remova apenas esse arquivo recém-criado após registrar a divergência.

## Logging benigno e evidência

Volte à conta administrativa e abra Windows PowerShell elevado. Crie uma fonte exclusiva no log **Application** e um marcador aleatório. Esse teste valida escrita/leitura desse canal; autenticação em **Security** é o exercício separado da WIN-27.

```powershell
$fonte = 'CSH-LAB09-' + [guid]::NewGuid().ToString('N')
$marcador = 'pratica-' + [guid]::NewGuid().ToString('N')
$inicio = Get-Date
New-EventLog -LogName Application -Source $fonte
Write-EventLog -LogName Application -Source $fonte -EventId 100 -EntryType Information -Message $marcador
$eventos = @(Get-WinEvent -FilterHashtable @{
    LogName='Application'; ProviderName=$fonte; Id=100; StartTime=$inicio
} -ErrorAction Stop)
$eventos | Select-Object TimeCreated, ProviderName, Id, RecordId, Message
if (-not ($eventos | Where-Object { $_.Message -match [regex]::Escape($marcador) })) {
    throw 'Marcador nao encontrado'
}
.\LAB-09-baseline.ps1 | Set-Content -Encoding UTF8 .\baseline-admin.json
Get-FileHash .\baseline-admin.json -Algorithm SHA256
```

Referências de escrita/cleanup: [New-EventLog](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/new-eventlog?view=powershell-5.1) e [Remove-EventLog](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/remove-eventlog?view=powershell-5.1).

Espere ID100, fonte exatamente igual à criada e mensagem contendo o marcador. Faça o controle negativo procurando outro marcador não emitido **nos mesmos eventos**: o filtro deve resultar vazio. Não use contagem global de Application, pois programas do sistema geram eventos em paralelo. Se uma fonte recém-criada não estiver disponível de imediato, aguarde a atualização do serviço e repita com o mesmo nome; não limpe o canal.

## Diagnóstico, correção e reteste

| Divergência | Investigar | Retestar |
|---|---|---|
| Aluno elevado ou escreve em Windows | Conta usada, grupos e ACL do caminho | Token sem elevação e criação negada |
| Rota default ainda presente no modo offline | Segundo adaptador, NAT deixado ativo | Configuração do hipervisor + rotas do guest |
| Defender não consultável | Edição, componente, permissões e erro salvo | Consulta compatível; não inventar estado “protegido” |
| Marcador não localizado | Canal, ProviderName, janela e retorno da escrita | Mesmo marcador e controle não emitido |
| Build diferente após reboot | Atualização aplicada/pendente, UBR | Novo baseline com hora e edição |

Conserve o firewall e proteções nativas habilitados. Se precisar de exceção em outro laboratório, trate uma regra mínima como parte daquele escopo. Após o teste, remova a **fonte criada nesta sessão** com `Remove-EventLog -Source $fonte`; isso não deve apagar o canal Application. Saia de CshAluno antes de removê-lo, se a conta não for usada na WIN-27. Alternativamente restaure o snapshot após exportar seus relatórios, reconhecendo que eventos e perfis do guest podem voltar ao estado anterior.

## Prática parcial e desafio

Parcial: compare `baseline-aluno.json` e `baseline-admin.json`; identifique SID e elevação sem concluir que o computador mudou. Independente: escreva uma ficha preenchida com ISO/hash/edição/build/UBR/recursos/rede/identidades/horário/ID do marcador. Diga quais propriedades vieram de observação e quais só da configuração declarada. O aceite exige conta padrão funcional, negativo de permissão, logging do marcador e fronteiras conferidas; apenas boot ou tamanho de arquivo não basta.

## Quiz

1. **Um hash calculado localmente comprova fornecedor da ISO?** A) Sim, porque SHA-256 identifica quem publicou o arquivo. B) Não; precisa comparação confiável e procedência. C) Sim, se o hash permanecer igual em duas leituras locais.
2. **CshAluno padrão criou arquivo em C:\Windows. O resultado é:** A) Esperado, porque uma conta padrão controla todos os arquivos locais. B) Esperado, porque UAC protege apenas instalações de programas. C) Divergência a investigar em token/ACL.
3. **O ID100 em Application comprova que 4625 é auditado em Security?** A) Não, canais e políticas são distintos. B) Sim, todos os canais usam a mesma política de auditoria. C) Sim, pois conseguir escrever um evento garante auditoria de logon.

**Gabarito:** 1 B; 2 C; 3 A.

## Flashcards

- **Baseline Windows** → Edição/build/UBR, identidade/token, rede e controles medidos num horário.
- **Conta padrão** → Identidade de prática sem associação administrativa e sem elevação.
- **Marcador de logging** → Evento benigno com fonte e mensagem exclusivas para correlação.
- **Hash da ISO** → Identificador de conteúdo; autenticidade exige procedência e comparação confiável.
