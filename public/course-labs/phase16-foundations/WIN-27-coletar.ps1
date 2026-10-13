# Somente leitura do Security log; saida JSON em stdout. Executar na VM propria.
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][datetime]$Inicio,
    [Parameter(Mandatory=$true)][datetime]$Fim,
    [string]$Conta = 'CshAluno'
)
$ErrorActionPreference = 'Stop'
if ($Inicio -ge $Fim) { throw 'Inicio deve ser anterior a Fim' }
try {
    $eventos = @(Get-WinEvent -FilterHashtable @{
        LogName='Security'; Id=4624,4625; StartTime=$Inicio; EndTime=$Fim
    } -ErrorAction Stop)
} catch {
    if ($_.FullyQualifiedErrorId -like 'NoMatchingEventsFound*') { $eventos = @() }
    else { throw } # Acesso negado nao pode virar "zero eventos".
}
$linhas = @(
    foreach ($evento in $eventos) {
        [xml]$xml = $evento.ToXml()
        $dados = @{}
        foreach ($item in $xml.Event.EventData.Data) {
            $dados[[string]$item.Name] = [string]$item.'#text'
        }
        if ($dados['TargetUserName'] -ne $Conta) { continue }
        [pscustomobject]@{
            TimeUtc=$evento.TimeCreated.ToUniversalTime().ToString('o')
            Computer=$evento.MachineName; Provider=$evento.ProviderName
            EventId=$evento.Id; RecordId=$evento.RecordId
            TargetUser=$dados['TargetUserName']; TargetDomain=$dados['TargetDomainName']
            LogonType=$dados['LogonType']; TargetLogonId=$dados['TargetLogonId']
            Status=$dados['Status']; SubStatus=$dados['SubStatus']
            IpAddress=$dados['IpAddress']; ProcessName=$dados['ProcessName']
        }
    }
)
[pscustomobject]@{
    InicioUtc=$Inicio.ToUniversalTime().ToString('o')
    FimUtc=$Fim.ToUniversalTime().ToString('o')
    Conta=$Conta; Quantidade=$linhas.Count; Eventos=$linhas
} | ConvertTo-Json -Depth 5
