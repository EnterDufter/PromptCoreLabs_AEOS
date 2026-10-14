# ==============================================================================
# PCL AEOS - Configurador de Tarefa Agendada de Backup DRP (Windows Task Scheduler)
# Agendamento resiliente de cold backup multi-schema para Cloudflare R2
# ==============================================================================

[CmdletBinding()]
param (
    [Parameter(Mandatory=$false)]
    [string]$Time = "03:00",

    [Parameter(Mandatory=$false)]
    [switch]$Install,

    [Parameter(Mandatory=$false)]
    [switch]$Uninstall,

    [Parameter(Mandatory=$false)]
    [switch]$Status
)

$TaskName = "PCL_AEOS_DRP_DailyBackup"
$ScriptPath = "c:\PromptCore_Labs\scripts\backup\backup-aeos-tripartido.ps1"

function Show-Status {
    $existing = schtasks /query /tn $TaskName /fo LIST 2>$null
    if ($existing) {
        Write-Host "[DRP-TASK] Tarefa '$TaskName' ESTÁ CONFIGURADA E ATIVA no Windows Task Scheduler:" -ForegroundColor Green
        $existing | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    } else {
        Write-Host "[DRP-TASK] Tarefa '$TaskName' NÃO está registrada atualmente." -ForegroundColor Yellow
    }
}

function Install-Task {
    Write-Host "[DRP-TASK] Registrando tarefa diária '$TaskName' para às $Time..." -ForegroundColor Cyan
    $action = "powershell.exe -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -File `"$ScriptPath`" -Mode all"
    
    # Cria a tarefa agendada
    schtasks /create /tn $TaskName /tr $action /sc daily /st $Time /f | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[DRP-TASK] Tarefa agendada com SUCESSO! Backup diário executará às $Time." -ForegroundColor Green
    } else {
        Write-Host "[DRP-TASK] Falha ao registrar tarefa via schtasks. Verifique permissões." -ForegroundColor Red
    }
}

function Uninstall-Task {
    Write-Host "[DRP-TASK] Removendo tarefa agendada '$TaskName'..." -ForegroundColor Yellow
    schtasks /delete /tn $TaskName /f 2>$null | Out-Null
    Write-Host "[DRP-TASK] Tarefa removida com sucesso." -ForegroundColor Green
}

if ($Uninstall) {
    Uninstall-Task
} elseif ($Install) {
    Install-Task
} else {
    Show-Status
}
