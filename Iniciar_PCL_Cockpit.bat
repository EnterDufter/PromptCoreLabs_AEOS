@echo off
title PCL Cockpit v3.9.0 PROD - Cognitive Engineering Platform
color 0B

echo ===================================================================
echo   PROMPTCORE LABS - PCL COCKPIT v3.9.0 PROD
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

:: 2. Inicia o servidor Vite na porta 3001 mantendo o terminal ativo
echo [1/2] Iniciando o servidor Vite na porta 3001...
start "PCL Cockpit Server (:3001)" /d "%DASHBOARD_DIR%" cmd /k "npm run dev"

:: 3. Aguarda ativamente ate a porta 3001 estar escutando (evita ERR_CONNECTION_REFUSED)
echo [2/2] Aguardando inicializacao do servidor Vite na porta 3001...
set /a attempts=0

:WAIT_LOOP
ping -n 2 127.0.0.1 >nul
netstat -ano | findstr :3001 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 goto PORT_READY
set /a attempts+=1
if %attempts% geq 15 goto TIMEOUT_ERR
goto WAIT_LOOP

:PORT_READY
echo [OK] Servidor Vite ativo e pronto na porta 3001!
echo Abrindo PCL Cockpit no navegador padrao...
start http://localhost:3001
exit

:TIMEOUT_ERR
echo [AVISO] Tempo limite de espera atingido, abrindo navegador em http://localhost:3001 ...
start http://localhost:3001
exit
