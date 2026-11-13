# ===================================================================
# PROMPTCORE LABS - PCL COCKPIT v3.9.0 PROD
# Cognitive Engineering Platform Launcher
# ===================================================================

$dashboardDir = "C:\PromptCore_Labs\projects\PromptCoreLabs_AEOS_Dashboard"
Set-Location $dashboardDir

$portActive = (Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue)

if ($portActive) {
    Write-Host "[OK] PCL Cockpit v3.9.0 ja esta ativo na porta 3001!" -ForegroundColor Cyan
    Write-Host "Abrindo navegador em http://localhost:3001 ..." -ForegroundColor Gray
    Start-Process "http://localhost:3001"
    exit
}

Write-Host "[1/2] Iniciando servidor Vite na porta 3001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-WindowStyle", "Normal", "-Command", "Set-Location '$dashboardDir'; npm run dev"

Write-Host "[2/2] Aguardando inicializacao do Vite na porta 3001..." -ForegroundColor Gray
$ready = $false
for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 500
    if (Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue) {
        $ready = $true
        break
    }
}

if ($ready) {
    Write-Host "[OK] Servidor pronto! Abrindo PCL Cockpit v3.9.0 no navegador..." -ForegroundColor Green
} else {
    Write-Host "[AVISO] O servidor esta demorando para responder, abrindo navegador..." -ForegroundColor Yellow
}
Start-Process "http://localhost:3001"
