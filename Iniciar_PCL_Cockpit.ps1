# ===================================================================
# ⚡ PROMPTCORE LABS - PCL COCKPIT v3.8.0
# Cognitive Engineering Platform Launcher
# ===================================================================

$dashboardDir = "C:\PromptCore_Labs\projects\PromptCoreLabs_AEOS_Dashboard"
Set-Location $dashboardDir

$portActive = (Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue)

if ($portActive) {
    Write-Host "[OK] PCL Cockpit ja esta ativo na porta 3001!" -ForegroundColor Cyan
    Write-Host "Abrindo navegador em http://localhost:3001 ..." -ForegroundColor Gray
    Start-Process "http://localhost:3001"
    exit
}

Write-Host "[1/2] Iniciando servidor Vite na porta 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-WindowStyle", "Minimized", "-Command", "Set-Location '$dashboardDir'; npm run dev"

Write-Host "[2/2] Aguardando 3 segundos para inicializacao..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host "[OK] Abrindo PCL Cockpit no navegador padrao..." -ForegroundColor Green
Start-Process "http://localhost:3001"
