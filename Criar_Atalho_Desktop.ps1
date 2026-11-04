# ===================================================================
# ⚡ Cria Atalho do PCL Cockpit na Area de Trabalho (Desktop)
# com o Icone Oficial PCL_Logo.ico (Microchip Cyan Glow)
# ===================================================================

$desktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$shortcutPath = Join-Path $desktopPath "PCL Cockpit.lnk"
$targetBatch = "C:\PromptCore_Labs\Iniciar_PCL_Cockpit.bat"
$iconPath = "C:\PromptCore_Labs\assets\PCL_Logo.ico"

# Se o icone ainda nao existir, gera a partir do PNG oficial
if (-not (Test-Path $iconPath)) {
    & powershell -ExecutionPolicy Bypass -File "C:\PromptCore_Labs\scripts\generate_ico.ps1"
}

$wshShell = New-Object -ComObject WScript.Shell
$shortcut = $wshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetBatch
$shortcut.WorkingDirectory = "C:\PromptCore_Labs"
$shortcut.Description = "PCL Cockpit v3.8 - Cognitive Engineering Platform"

if (Test-Path $iconPath) {
    $shortcut.IconLocation = "$iconPath, 0"
}

$shortcut.Save()

# Notifica o Windows Explorer para atualizar o cache de icones do Desktop imediatamente
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class ShellNotify {
    [DllImport("shell32.dll")]
    public static extern void SHChangeNotify(int wEventId, int uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
"@
[ShellNotify]::SHChangeNotify(0x08000000, 0, [IntPtr]::Zero, [IntPtr]::Zero) # SHCNE_ASSOCCHANGED

Write-Host "[SUCESSO] Atalho 'PCL Cockpit' atualizado na Area de Trabalho com o logo oficial PCL!" -ForegroundColor Green
Write-Host "Atalho: $shortcutPath" -ForegroundColor Cyan
Write-Host "Icone:  $iconPath" -ForegroundColor Cyan
