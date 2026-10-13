# Leitura do estado: nenhum usuario, politica ou servico e alterado.
$ErrorActionPreference = 'Stop'
$cv = Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion'
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
$defender = try {
    $d = Get-MpComputerStatus -ErrorAction Stop
    @{Estado='consultado'; AntivirusEnabled=$d.AntivirusEnabled;
      RealTimeProtectionEnabled=$d.RealTimeProtectionEnabled;
      Assinaturas=$d.AntivirusSignatureVersion}
} catch { @{Estado='nao-consultado'; Motivo=$_.Exception.Message} }
[pscustomobject]@{
    Utc=(Get-Date).ToUniversalTime().ToString('o')
    Computer=$env:COMPUTERNAME
    Usuario=$identity.Name; Sid=$identity.User.Value
    TokenElevado=$principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    Build=$cv.CurrentBuild; UBR=$cv.UBR; DisplayVersion=$cv.DisplayVersion
    PowerShell=$PSVersionTable.PSVersion.ToString()
    Interfaces=@(Get-NetAdapter | Select-Object Name, Status, MacAddress, InterfaceDescription)
    Rotas=@(Get-NetRoute -AddressFamily IPv4 | Select-Object DestinationPrefix, NextHop, InterfaceIndex)
    Firewall=@(Get-NetFirewallProfile | Select-Object Name, Enabled)
    Defender=$defender
} | ConvertTo-Json -Depth 5
