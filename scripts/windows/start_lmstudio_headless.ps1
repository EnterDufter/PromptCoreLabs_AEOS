<#
.SYNOPSIS
    Inicia o LM Studio Server em modo Headless no Windows com alocação GPU máxima e carrega o modelo alvo.
.DESCRIPTION
    Script projetado para automação via Windows Task Scheduler no boot/logon.
    Garante que o LM Studio esteja pronto na porta 1234 para o gateway OmniRoute (PCL AEOS).
#>

[CmdletBinding()]
param (
    [int]$Port = 1234,
    [string]$ModelId = "qwen2.5-coder-7b-instruct",
    [string]$GpuAlloc = "max",
    [int]$ContextWindow = 8192,
    [string]$LogFile = "$PSScriptRoot\..\..\logs\lmstudio_autostart.log"
)

# Garantir diretório de logs
$logDir = Split-Path -Parent $LogFile
if (-not (Test-Path -Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

function Write-Log {
    param ([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "[$timestamp] [$Level] $Message"
    Write-Host $logLine
    Add-Content -Path $LogFile -Value $logLine
}

Write-Log "Iniciando automacao Headless do LM Studio Server..."

# Localizar executavel CLI 'lms'
$lmsCmd = Get-Command "lms" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $lmsCmd) {
    $possiblePaths = @(
        "$env:USERPROFILE\.cache\lm-studio\bin\lms.exe",
        "$env:LOCALAPPDATA\Programs\LM-Studio\resources\app\.webpack\main\lms.exe",
        "$env:USERPROFILE\.lmstudio\bin\lms.exe"
    )
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $lmsCmd = $path
            break
        }
    }
}

if (-not $lmsCmd) {
    Write-Log "ERRO CRITICO: CLI 'lms' do LM Studio nao foi encontrada no PATH ou diretórios padrao." "ERROR"
    Write-Log "Certifique-se de habilitar o 'lms' CLI nas configuracoes do LM Studio (Developer Settings)." "ERROR"
    exit 1
}

Write-Log "CLI lms localizada em: $lmsCmd"

# 1. Iniciar o Servidor LM Studio
Write-Log "Iniciando servidor LM Studio na porta $Port..."
try {
    & $lmsCmd server start --port $Port 2>&1 | Out-String | ForEach-Object { Write-Log $_.Trim() }
} catch {
    Write-Log "Aviso ao iniciar servidor: $_ (Verificando se ja esta rodando...)" "WARN"
}

Start-Sleep -Seconds 3

# 2. Carregar o Modelo Alvo
Write-Log "Carregando modelo '$ModelId' com GPU=$GpuAlloc, TTL=0 e ContextWindow=$ContextWindow..."
try {
    & $lmsCmd load $ModelId --gpu $GpuAlloc --ttl 0 --context-length $ContextWindow 2>&1 | Out-String | ForEach-Object { Write-Log $_.Trim() }
    Write-Log "Comando de carga do modelo executado com sucesso."
} catch {
    Write-Log "Erro ao carregar o modelo '$ModelId': $_" "ERROR"
}

# 3. Teste de Saude (Health Check)
Write-Log "Realizando Health Check em http://localhost:$Port/v1/models..."
Start-Sleep -Seconds 2

try {
    $response = Invoke-RestMethod -Uri "http://localhost:$Port/v1/models" -Method Get -TimeoutSec 5
    if ($response.data) {
        Write-Log "LM Studio Server ONLINE! Modelos ativos no host:"
        foreach ($m in $response.data) {
            Write-Log " - Modelo: $($m.id)"
        }
    } else {
        Write-Log "LM Studio respondeu, mas nenhum modelo foi retornado." "WARN"
    }
} catch {
    Write-Log "Falha no Health Check: $_" "ERROR"
}

Write-Log "Script de automacao concluido."
