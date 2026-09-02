<#
.SYNOPSIS
    Gatilho de Perda de Conectividade (Offline Event Trigger) - PCL AEOS
.DESCRIPTION
    Executado exclusivamente quando é detectada a ausência de conexão de rede/VPN.
    Subo o modelo local no LM Studio sob demanda na VRAM para garantir a continuidade dos agentes.
#>

[CmdletBinding()]
param (
    [int]$Port = 1234,
    [string]$ModelId = "qwen2.5-coder-7b-instruct",
    [string]$GpuAlloc = "max",
    [int]$ContextWindow = 8192,
    [string]$LogFile = "$PSScriptRoot\..\..\logs\network_failover.log"
)

# Garantir diretório de log
$logDir = Split-Path -Parent $LogFile
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

function Write-Log {
    param ([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] [OFFLINE-TRIGGER] [$Level] $Message"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line
}

Write-Log "--------------------------------------------------------"
Write-Log "ALERTA: QUEDA DE CONECTIVIDADE DETECTADA! Iniciando Failover Local..." "WARN"

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

if (-not $lmsCmd) {
    Write-Log "ERRO: CLI 'lms' do LM Studio nao encontrada no host." "ERROR"
    exit 1
}

# 1. Garantir que o servidor LM Studio esteja rodando
Write-Log "Garantindo servidor LM Studio na porta $Port..."
try {
    & $lmsCmd server start --port $Port 2>&1 | Out-String | ForEach-Object { Write-Log $_.Trim() }
} catch {
    Write-Log "Servidor LM Studio ja ativo ou inicializado."
}

Start-Sleep -Seconds 2

# 2. Carregar o Modelo Sob Demanda na GPU
Write-Log "Carregando modelo '$ModelId' na VRAM (GPU=$GpuAlloc, Context=$ContextWindow)..."
try {
    & $lmsCmd load $ModelId --gpu $GpuAlloc --ttl 1800 --context-length $ContextWindow 2>&1 | Out-String | ForEach-Object { Write-Log $_.Trim() }
    Write-Log "SUCESSO: Modelo local carregado na GPU para operacao Offline." "SUCCESS"
} catch {
    Write-Log "Falha ao carregar modelo local: $_" "ERROR"
}
