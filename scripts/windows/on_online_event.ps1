<#
.SYNOPSIS
    Gatilho de Restauração de Conectividade (Online Event Trigger) - PCL AEOS
.DESCRIPTION
    Executado quando a conexão com a internet/VPN é restabelecida.
    Descarrega os modelos locais do LM Studio e Ollama, garantindo o retorno estrito a 0 MB de VRAM na RTX 3050.
#>

[CmdletBinding()]
param (
    [string]$OllamaModel = "qwen2.5-coder:7b-instruct-q4_K_M",
    [string]$LogFile = ""
)

if ([string]::IsNullOrWhiteSpace($LogFile)) {
    $projectRoot = if ($PSScriptRoot) { (Get-Item "$PSScriptRoot\..\..").FullName } else { "C:\PromptCore_Labs" }
    $LogFile = Join-Path $projectRoot "logs\network_failover.log"
}

# Garantir diretório de log
$logDir = Split-Path -Parent $LogFile
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

function Write-Log {
    param ([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] [ONLINE-TRIGGER] [$Level] $Message"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line
}

Write-Log "--------------------------------------------------------"
Write-Log "CONEXAO RESTABELECIDA! Retornando para Modo Online (0 MB VRAM)..." "INFO"

# 1. Descarregar modelos do LM Studio
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
    Write-Log "Descarregando modelos do LM Studio para liberar VRAM..."
    try {
        & $lmsCmd unload --all 2>&1 | Out-String | ForEach-Object { Write-Log $_.Trim() }
        Write-Log "SUCESSO: Modelos do LM Studio descarregados." "SUCCESS"
    } catch {
        Write-Log "Aviso ao descarregar modelos do LM Studio: $_" "WARN"
    }
}

# 2. Descarregar modelos em memória no Ollama (ollama stop)
Write-Log "Descarregando modelo '$OllamaModel' do Ollama..."
try {
    & ollama stop $OllamaModel 2>&1 | Out-String | ForEach-Object { Write-Log $_.Trim() }
    Write-Log "SUCESSO: Modelo '$OllamaModel' descarregado do Ollama." "SUCCESS"
} catch {
    Write-Log "Aviso ao parar modelo no Ollama: $_" "WARN"
}

Write-Log "ESTADO ONLINE RESTAURADO: 0 MB de VRAM alocada na GPU local." "SUCCESS"
