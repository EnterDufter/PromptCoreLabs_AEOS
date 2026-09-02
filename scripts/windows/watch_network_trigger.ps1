<#
.SYNOPSIS
    Monitor Reativo de Conectividade de Rede (Network Event Watcher) - PCL AEOS
.DESCRIPTION
    Monitor leve que verifica a conectividade com a internet a cada N segundos.
    Dispara 'on_offline_event.ps1' ao cair a rede e 'on_online_event.ps1' ao retornar a rede.
#>

[CmdletBinding()]
param (
    [int]$CheckIntervalSeconds = 10,
    [string[]]$TestEndpoints = @("1.1.1.1", "8.8.8.8", "openrouter.ai"),
    [string]$LogFile = "$PSScriptRoot\..\..\logs\network_watcher.log"
)

$logDir = Split-Path -Parent $LogFile
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

function Write-WatcherLog {
    param ([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] [WATCHER] [$Level] $Message"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line
}

function Test-IsOnline {
    foreach ($ep in $TestEndpoints) {
        if (Test-Connection -ComputerName $ep -Count 1 -Quiet -ErrorAction SilentlyContinue) {
            return $true
        }
    }
    return $false
}

Write-WatcherLog "Iniciando Monitor Reativo de Conectividade PCL AEOS..."
Write-WatcherLog "Intervalo de checagem: $CheckIntervalSeconds segundos."

# Estado Inicial (assumindo Online ao iniciar)
$isCurrentlyOnline = Test-IsOnline

if ($isCurrentlyOnline) {
    Write-WatcherLog "Estado inicial: ONLINE. VRAM mantida em 0 MB."
} else {
    Write-WatcherLog "Estado inicial: OFFLINE. Disparando failover inicial..." "WARN"
    & "$PSScriptRoot\on_offline_event.ps1"
}

try {
    while ($true) {
        Start-Sleep -Seconds $CheckIntervalSeconds
        $newOnlineStatus = Test-IsOnline

        # Transicao 1: Online -> Offline
        if ($isCurrentlyOnline -and -not $newOnlineStatus) {
            Write-WatcherLog "TRANSICAO DETECTADA: Online -> OFFLINE. Disparando gatilho de failover..." "WARN"
            $isCurrentlyOnline = $false
            & "$PSScriptRoot\on_offline_event.ps1"
        }
        # Transicao 2: Offline -> Online
        elseif (-not $isCurrentlyOnline -and $newOnlineStatus) {
            Write-WatcherLog "TRANSICAO DETECTADA: Offline -> ONLINE. Disparando gatilho de restauracao..." "INFO"
            $isCurrentlyOnline = $true
            & "$PSScriptRoot\on_online_event.ps1"
        }
    }
} finally {
    Write-WatcherLog "Monitor de Conectividade finalizado."
}
