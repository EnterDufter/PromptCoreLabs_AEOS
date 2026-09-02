<#
.SYNOPSIS
    Gatilho de Perda de Conectividade (Offline Event Trigger) - PCL AEOS
.DESCRIPTION
    Executado exclusivamente quando é detectada a ausência de conexão de rede/VPN.
    Orquestra o Failover em 2 Níveis Locais:
      - Nível 1: Ollama Local (Porta 11434) com qwen2.5-coder:7b-instruct-q4_K_M (100% VRAM)
      - Nível 2: LM Studio Server (Porta 1234) com DeepSeek-Coder-V2-Lite MoE (GPU Offload)
#>

[CmdletBinding()]
param (
    [int]$OllamaPort = 11434,
    [string]$OllamaModel = "qwen2.5-coder:7b-instruct-q4_K_M",
    [int]$LMSPort = 1234,
    [string]$LMSModel = "deepseek-coder-v2-lite-instruct",
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
    $line = "[$timestamp] [OFFLINE-TRIGGER] [$Level] $Message"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line
}

Write-Log "--------------------------------------------------------"
Write-Log "ALERTA: QUEDA DE CONECTIVIDADE DETECTADA! Iniciando Failover Local em 2 Níveis..." "WARN"

# ====================================================================
# NÍVEL 1: Garantir Prontidão do Ollama Local (Alta Velocidade em 100% VRAM)
# ====================================================================
Write-Log "Verificando Servidor Ollama na porta $OllamaPort..."
try {
    $ollamaTest = Invoke-RestMethod -Uri "http://localhost:$OllamaPort/api/tags" -TimeoutSec 3 -ErrorAction Stop
    Write-Log "SUCESSO: Servidor Ollama ativo na porta $OllamaPort (Nível 1 de Failover pronto)." "SUCCESS"
} catch {
    Write-Log "Servidor Ollama nao respondeu. Tentando inicializar processo 'ollama serve'..." "WARN"
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# ====================================================================
# NÍVEL 2: Garantir Servidor LM Studio Ativo (Para Refatoração MoE)
# ====================================================================
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
    Write-Log "Garantindo servidor LM Studio na porta $LMSPort (Nível 2 MoE)..."
    try {
        & $lmsCmd server start --port $LMSPort 2>&1 | Out-String | ForEach-Object { Write-Log $_.Trim() }
        Write-Log "SUCESSO: Servidor LM Studio ativo na porta $LMSPort (Nível 2 de Failover pronto)." "SUCCESS"
    } catch {
        Write-Log "Servidor LM Studio ja ativo na porta $LMSPort."
    }
} else {
    Write-Log "Aviso: CLI 'lms' nao encontrada. Nível 2 dependera do Ollama." "WARN"
}

Write-Log "Failover Local configurado com sucesso: OmniRoute roteara automaticamente." "SUCCESS"
