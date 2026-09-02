<#
.SYNOPSIS
    Gatilho de Restauração de Conectividade (Online Event Trigger) - PCL AEOS
.DESCRIPTION
    Executado quando a conexão com a internet/VPN é restabelecida.
    Descarrega o modelo local da GPU (lms unload), liberando 100% da VRAM da RTX 3050.
#>

[CmdletBinding()]
param (
    [string]$ModelId = "qwen2.5-coder-7b-instruct",
    [string]$LogFile = "$PSScriptRoot\..\..\logs\network_failover.log"
)

function Write-Log {
    param ([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] [ONLINE-TRIGGER] [$Level] $Message"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line
}

Write-Log "--------------------------------------------------------"
Write-Log "CONEXAO RESTABELECIDA! Iniciando descarregamento do modelo local..." "INFO"

# Localizar CLI 'lms'
$lmsCmd = Get-Command "lms" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $lmsCmd) {
    $paths = @(
        "$env:USERPROFILE\.cache\lm-studio\bin\lms.exe",
        "$env:LOCALAPPDATA\Programs\LM-Studio\resources\app\.webpack\main\lms.exe",
        "$env:USERPROFILE\.lmstudio\bin\lms.exe"
    )
    foreach ($p in $paths) { if (Test-Path $p) { $lmsCmd = $p; break } }
}

if ($lmsCmd) {
    Write-Log "Executando descarregamento do modelo '$ModelId' para liberar VRAM..."
    try {
        & $lmsCmd unload --all 2>&1 | Out-String | ForEach-Object { Write-Log $_.Trim() }
        Write-Log "SUCESSO: VRAM liberada! Modelo local descarregado da GPU." "SUCCESS"
    } catch {
        Write-Log "Aviso ao descarregar modelo: $_" "WARN"
    }
} else {
    Write-Log "CLI 'lms' nao encontrada. Certifique-se de que o LM Studio esteja configurado." "WARN"
}
