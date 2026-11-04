@echo off
title PCL Cockpit v3.8 - Cognitive Engineering Platform
color 0B
chcp 65001 >nul

echo ===================================================================
echo   ⚡ PROMPTCORE LABS - PCL COCKPIT v3.8.0
echo   Cognitive Engineering Platform (Porta :3001)
echo ===================================================================
echo.

cd /d "C:\PromptCore_Labs\projects\PromptCoreLabs_AEOS_Dashboard"

:: Verifica se a porta 3001 já está ativa
netstat -ano | findstr :3001 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] O servidor PCL Cockpit ja esta ativo na porta 3001!
    echo Abrindo navegador em http://localhost:3001 ...
    start http://localhost:3001
    timeout /t 2 >nul
    exit
)

echo [1/2] Iniciando o servidor Vite na porta 3001...
start "PCL Cockpit Server (:3001)" /min cmd /c "npm run dev"

echo [2/2] Aguardando inicializacao do Vite (3 segundos)...
timeout /t 3 /nobreak >nul

echo [OK] Abrindo PCL Cockpit no navegador padrao...
start http://localhost:3001

echo.
echo ===================================================================
echo   PCL Cockpit aberto com sucesso em: http://localhost:3001
echo   O servidor continua rodando em segundo plano.
echo ===================================================================
echo.
timeout /t 3 >nul
exit

