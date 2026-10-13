# Somente fixture propria em LOCALAPPDATA; snapshot e restauracao sao no hipervisor.
param([ValidateSet('init','alterar','ler')][string]$Acao='ler')
$ErrorActionPreference='Stop'
$pasta=Join-Path $env:LOCALAPPDATA 'CyberStudyHub-LAB10'
$arquivo=Join-Path $pasta 'estado.txt'
$selo=Join-Path $pasta 'fixture.txt'
if ($Acao -eq 'init') {
    if (Test-Path -LiteralPath $pasta) { throw 'Pasta existente: nao sobrescrever; use VM limpa' }
    New-Item -ItemType Directory -Path $pasta | Out-Null
    'fixture-CSH-LAB10' | Set-Content -LiteralPath $selo -Encoding UTF8
    'baseline-A' | Set-Content -LiteralPath $arquivo -Encoding UTF8
}
if (-not (Test-Path -LiteralPath $selo)) { throw 'Fixture nao inicializada' }
if ((Get-Content -LiteralPath $selo -Raw).Trim() -ne 'fixture-CSH-LAB10') { throw 'Fixture desconhecida' }
if ($Acao -eq 'alterar') {
    'alterado-B' | Set-Content -LiteralPath $arquivo -Encoding UTF8
    'criado-depois' | Set-Content -LiteralPath (Join-Path $pasta 'posterior.txt') -Encoding UTF8
}
[pscustomobject]@{
    Usuario=[Security.Principal.WindowsIdentity]::GetCurrent().Name
    Arquivo=$arquivo; Texto=(Get-Content -LiteralPath $arquivo -Raw).Trim()
    SHA256=(Get-FileHash -LiteralPath $arquivo -Algorithm SHA256).Hash
    PosteriorExiste=(Test-Path -LiteralPath (Join-Path $pasta 'posterior.txt'))
} | ConvertTo-Json
