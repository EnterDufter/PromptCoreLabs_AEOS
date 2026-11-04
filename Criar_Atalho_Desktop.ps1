# ===================================================================
# ⚡ Cria Atalho do PCL Cockpit na Area de Trabalho (Desktop)
# ===================================================================

$desktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$shortcutPath = Join-Path $desktopPath "PCL Cockpit.lnk"
$targetBatch = "C:\PromptCore_Labs\Iniciar_PCL_Cockpit.bat"

$wshShell = New-Object -ComObject WScript.Shell
$shortcut = $wshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetBatch
$shortcut.WorkingDirectory = "C:\PromptCore_Labs"
$shortcut.Description = "PCL Cockpit v3.8 - Cognitive Engineering Platform"

# Icone do aplicativo se disponivel
$iconCandidate = "C:\PromptCore_Labs\OmniRoute\electron\assets\icon.ico"
if (Test-Path $iconCandidate) {
    $shortcut.IconLocation = "$iconCandidate, 0"
}

$shortcut.Save()
Write-Host "[SUCESSO] Atalho 'PCL Cockpit' criado na sua Area de Trabalho!" -ForegroundColor Green
Write-Host "Localizacao: $shortcutPath" -ForegroundColor Cyan
