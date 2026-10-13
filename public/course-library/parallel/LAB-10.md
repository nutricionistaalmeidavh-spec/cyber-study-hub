# LAB-10 — Snapshots

**Trilha paralela:** Laboratório e Ferramentas  
**Posição:** 10/30  
**Acesso:** livre; nenhum pré-requisito bloqueia a aula.  
**Anterior recomendado:** LAB-09  
**Próxima recomendada:** LAB-11  
**Ambiente:** VM/localhost/escopo autorizado  
**Profundidade v2:** normal — 25–40 min + prática

---

## Problema e objetivo

Você restaura uma VM após um experimento e presume que tudo voltou: arquivo do guest, relatório no host e credencial remota. Só o primeiro pertence necessariamente ao disco incluído no snapshot. Nesta aula você cria um estado A, altera para B e comprova quais objetos retornam a A, conservando evidência fora da VM.

## O que o snapshot representa

No VirtualBox, snapshot conserva configuração da VM e estado dos discos virtuais participantes; o estado de execução também pode ser salvo se a VM estiver ligada. Escritas posteriores em discos normais ficam em imagens diferenciais dependentes da cadeia anterior. Por isso snapshot rápido não é uma cópia independente e pode crescer. Perder o arquivo base ou a cadeia pode inviabilizar a recuperação. Discos em modos especiais, como write-through, exigem outra interpretação e ficam fora deste laboratório.

Restaurar escolhe um estado anterior e muda o estado atual do guest. Excluir um snapshot remove um ponto e pode exigir mesclagem de dados; **não** significa restaurar aquele estado. Desligar o guest antes de tirar o snapshot reduz a ambiguidade de caches e memória. Ainda assim, uma VM não controla transações já concluídas em outro servidor, e uma pasta compartilhada contém arquivos do host fora do disco normal do guest. Referência: [snapshots e trabalho com VMs no VirtualBox 7.2](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/working-with-vms.html).

| Objeto do experimento | Local | Esperado após restaurar A |
|---|---|---|
| estado.txt = baseline-A | Disco normal do guest, dentro do perfil usado | Volta a baseline-A, mesmo hash |
| posterior.txt criado em B | Mesmo disco do guest | Deixa de existir |
| testemunha.txt alterado em B | Pasta própria no host, sem compartilhamento | Continua em B |
| Relatório/hashes copiados ao host | Fora dos discos do guest | Continuam disponíveis |
| Efeito já enviado a serviço remoto | Outro sistema | Não é revertido pelo snapshot local |

## Preparação e testemunha externa

Use uma VM Windows própria conforme LAB-09 em VirtualBox, com um disco em modo **normal**, sem compartilhamentos e sem serviços externos. Registre nome/UUID da VM, hipervisor, discos incluídos, usuário, estado da rede e espaço livre do host. Baixe [LAB-10-estado.ps1](/course-labs/phase16-foundations/LAB-10-estado.ps1) no guest **antes** de criar o snapshot.

No host, crie uma pasta temporária própria e uma testemunha sem conectá-la ao guest. Em PowerShell no host:

```powershell
$fora = Join-Path $env:TEMP ('CSH-LAB10-host-' + [guid]::NewGuid())
New-Item -ItemType Directory -Path $fora | Out-Null
$testemunha = Join-Path $fora 'testemunha.txt'
'host-A' | Set-Content -Encoding UTF8 $testemunha
Get-FileHash $testemunha -Algorithm SHA256
```

Se o host for Linux/macOS, crie uma pasta nova com `mktemp -d`, grave `host-A` em um arquivo dentro dela e use `sha256sum`/`shasum -a 256`; os comandos de snapshot permanecem no hipervisor. Não use pasta de trabalho real como fixture.

## Estado A e snapshot desligado

No guest, entre como o mesmo usuário que será usado no reteste e execute:

```powershell
.\LAB-10-estado.ps1 -Acao init
.\LAB-10-estado.ps1 -Acao ler
```

Espere `Texto: baseline-A` e `PosteriorExiste: false`. Anote o SHA256 como **H_A** fora da VM, por transcrição ou fotografia. O caminho inclui o perfil do usuário; trocar de conta depois pode fazer parecer que o snapshot perdeu o arquivo.

Desligue pelo menu do guest e espere o hipervisor mostrar Powered Off. No painel Snapshots, crie `LAB10-A`, com descrição incluindo estado desligado, disco normal e H_A. Registre também o UUID do snapshot para desambiguar nomes repetidos. Ligue a VM e confirme `-Acao ler` ainda mostra A.

## Alteração B e negativo sem restauração

No guest:

```powershell
.\LAB-10-estado.ps1 -Acao alterar
.\LAB-10-estado.ps1 -Acao ler
```

Espere `alterado-B`, hash **H_B diferente de H_A**, e `PosteriorExiste: true`. No **host**, altere somente a testemunha:

```powershell
'host-B' | Set-Content -Encoding UTF8 $testemunha
Get-FileHash $testemunha -Algorithm SHA256
```

Controle negativo: reinicie normalmente a VM, sem restaurar snapshot. Execute `-Acao ler`. B deve continuar e posterior.txt deve existir. Um reboot não desfaz escritas persistidas no disco normal. Esse controle evita confundir reinicialização com rollback.

## Restaurar e comprovar

Exporte/transcreva H_B e o resultado negativo para a pasta de evidência no host. Desligue a VM. Selecione o snapshot **LAB10-A/UUID registrado** e Restore. A restauração descarta o estado atual do guest que não for preservado; aqui ele contém só a fixture criada para o exercício. Se a interface oferecer snapshot de proteção do estado atual, entenda a opção e use-a se precisar conservar B. Não restaure VM com trabalho alheio ou mudanças não documentadas.

Ligue e execute `-Acao ler` no mesmo usuário. Esperado: A, H_A exatamente igual e posterior.txt ausente. Leia a testemunha no host: ela continua host-B, com o hash de B. Você acabou de demonstrar a abrangência do snapshot com um caso que volta e outro que não volta. Não altere o host para “fazer o resultado combinar”.

## Detecção, correção e reteste

Se A não retornar, confira UUID selecionado, caminho e conta, modo/local do disco e se a restauração foi realmente aplicada. Se o arquivo posterior continuar, ele pode estar num disco excluído, volume compartilhado ou estado errado. Se o hash diferir apesar do texto aparentar A, compare bytes/encoding/quebra de linha: aparência não garante igualdade. Use o arquivo gerado pelo mesmo script para manter encoding constante.

Se a testemunha externa voltou a A, investigue se ela estava de fato no host ou se você leu outra pasta; o snapshot de um guest não reverte automaticamente seu host. Corrija somente a hipótese demonstrada e repita init em VM limpa → snapshot A → B → reboot B → restore A, mantendo registro externo. Não apague imagens `.vdi` diferenciais manualmente para liberar espaço; gerencie snapshots pelo hipervisor, com tempo e espaço para mesclagem.

## Persistência e uso responsável

Snapshot não revoga credenciais que vazaram, não apaga mensagens enviadas e não reverte serviços remotos. Restaurar relógio/estado de uma VM conectada a domínio ou aplicações distribuídas pode criar inconsistência; o lab usa conta local e fica offline. Relatórios e logs dentro do guest também voltam no tempo: guarde a evidência necessária fora dele antes do rollback. Backups independentes testados protegem contra perda da cadeia; snapshot favorece iteração local.

Após o exercício, preserve H_A/H_B/UUID e as observações exigidas. Remova somente fixtures e snapshots da VM descartável quando não forem mais necessários, pela interface do hipervisor. Não marque restauração validada se apenas criou o snapshot ou se o guest não pôde ser ligado.

## Prática parcial e desafio

Parcial: preencha a tabela A/B/reboot/restore para texto, hash, posterior.txt e testemunha do host. Independente: proponha como registrar uma transação remota **simulada em outro processo próprio**, explicando por que ela exige compensação separada. Não use serviço real externo. Gabarito parcial: reboot conserva B; restore recupera A no disco normal; host conserva B nas duas operações.

## Quiz

1. **Reiniciar o guest sem restaurar deve apagar posterior.txt?** A) Sim, iniciar a VM reaplica automaticamente o último snapshot. B) Não, ele está persistido no disco normal. C) Sim, todo disco diferencial é descartado ao reiniciar.
2. **Excluir snapshot equivale a restaurar seu estado?** A) Sempre. B) Só offline. C) Não, são operações distintas.
3. **Por que H_A precisa estar fora da VM?** A) Para sobreviver ao rollback e permitir comparação independente. B) Porque o hash dentro do guest muda automaticamente quando o snapshot é criado. C) Porque guardar só o hash externo permite reconstruir o disco se a cadeia for perdida.

**Gabarito:** 1 B; 2 C; 3 A.

## Flashcards

- **Imagem diferencial** → Guarda escritas posteriores e depende da cadeia/base.
- **Restore versus delete** → Escolher estado anterior versus remover ponto da cadeia.
- **Testemunha externa** → Objeto fora da abrangência do snapshot que evidencia seus limites.
- **Reboot versus rollback** → Reiniciar conserva disco; restaurar recupera estado selecionado.
