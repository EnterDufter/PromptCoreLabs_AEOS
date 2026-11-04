@echo off
title PCL Cockpit v3.8 - Cognitive Engineering Platform
color 0B

echo ===================================================================
echo   PROMPTCORE LABS - PCL COCKPIT v3.8.0
echo   Cognitive Engineering Platform (Porta :3001)
echo ===================================================================
echo.

set "DASHBOARD_DIR=C:\PromptCore_Labs\projects\PromptCoreLabs_AEOS_Dashboard"
cd /d "%DASHBOARD_DIR%"

:: 1. Verifica se a porta 3001 ja esta ativa
netstat -ano | findstr :3001 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] O servidor PCL Cockpit ja esta ativo na porta 3001!
    echo Abrindo navegador em http://localhost:3001 ...
    start http://localhost:3001
    ping -n 3 127.0.0.1 >nul
    exit
)

:: 2. Inicia o servidor Vite na porta 3001
echo [1/2] Iniciando o servidor Vite na porta 3001...
start "PCL Cockpit Server (:3001)" /d "%DASHBOARD_DIR%" cmd /c "npm run dev"

:: 3. Aguarda 3 segundos de inicializacao
echo [2/2] Aguardando inicializacao do Vite...
ping -n 4 127.0.0.1 >nul

:: 4. Abre o navegador padrao
echo [OK] Abrindo PCL Cockpit no navegador padrao...
start http://localhost:3001

echo.
echo ===================================================================
echo   PCL Cockpit aberto com sucesso em: http://localhost:3001
echo ===================================================================
echo.
ping -n 3 127.0.0.1 >nul
exit
