# ==============================================================================
# PCL AEOS - Deterministic Staleness Daemon Runner
# Executa a verificação determinística de integridade de hashes (Custo $0.00)
# ==============================================================================

[CmdletBinding()]
param (
    [Parameter(Mandatory=$false)]
    [switch]$Watch = $false,

    [Parameter(Mandatory=$false)]
    [int]$IntervalSeconds = 300
)

$RepoRoot = "c:\PromptCore_Labs"
$PythonScript = Join-Path $RepoRoot "scripts\memory\staleness_verifier.py"

function Run-StalenessCheck {
    Write-Host "[STALENESS-DAEMON] [$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Executando checagem determinística..." -ForegroundColor Cyan
    python $PythonScript
}

if ($Watch) {
    Write-Host "[STALENESS-DAEMON] Modo contínuo ativado (Intervalo: ${IntervalSeconds}s). Pressione Ctrl+C para encerrar." -ForegroundColor Yellow
    while ($true) {
        Run-StalenessCheck
        Start-Sleep -Seconds $IntervalSeconds
    }
} else {
    Run-StalenessCheck
}
