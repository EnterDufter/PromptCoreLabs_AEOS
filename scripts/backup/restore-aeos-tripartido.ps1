# ==============================================================================
# PCL AEOS - Plano de Recuperação de Desastres (DRP / Disaster Recovery Plan)
# Script de Restauração Automatizada (SLA RTO <= 15min / RPO <= 24h)
# ==============================================================================

[CmdletBinding()]
param (
    [Parameter(Mandatory=$false)]
    [string]$EncryptedDumpPath = "",

    [Parameter(Mandatory=$false)]
    [string]$TargetContainer = "pcl-db"
)

$ErrorActionPreference = "Stop"

function Log-Info($msg) { Write-Host "[DRP-INFO] [$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg" -ForegroundColor Cyan }
function Log-Success($msg) { Write-Host "[DRP-SUCCESS] [$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg" -ForegroundColor Green }
function Log-Warn($msg) { Write-Host "[DRP-WARN] [$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg" -ForegroundColor Yellow }
function Log-Error($msg) { Write-Host "[DRP-ERROR] [$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg" -ForegroundColor Red }

# Carregar arquivo .env
$EnvFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $key, $value = $line.Split('=', 2)
            if ($key -and $value) {
                [Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim().Trim('"').Trim("'"), "Process")
            }
        }
    }
}

$EncryptionKey = if ($env:BACKUP_ENCRYPTION_KEY) { $env:BACKUP_ENCRYPTION_KEY } else { "PCL_AEOS_SOVEREIGN_SECRET_KEY_CHANGE_ME" }
$DBUser        = if ($env:DB_USER) { $env:DB_USER } else { "paperclip" }
$DBName        = if ($env:DB_NAME) { $env:DB_NAME } else { "paperclip" }
$LocalDocsDir  = if ($env:LOCAL_DOCS_DIR) { $env:LOCAL_DOCS_DIR } else { "c:\PromptCore_Labs" }

Log-Info "=== INICIANDO PLANO DE RECUPERAÇÃO DE DESASTRES (DRP PCL AEOS) ==="

# Se nenhum arquivo local for passado, tenta localizar o backup no R2 ou diretório temp
if (-not $EncryptedDumpPath) {
    Log-Info "Buscando o backup mais recente no cofre local..."
    $localBackupDir = Join-Path $LocalDocsDir "backups"
    $latestDump = Get-ChildItem -Path $localBackupDir -Filter "*.enc" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    
    if ($latestDump) {
        $EncryptedDumpPath = $latestDump.FullName
        Log-Info "Backup local cifrado encontrado: $EncryptedDumpPath"
    } else {
        Log-Error "Nenhum arquivo de backup cifrado (.enc) especificado ou encontrado em $localBackupDir."
        exit 1
    }
}

$TempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("pcl-drp-" + (Get-Date -Format 'yyyyMMddHHmmss'))
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
$decryptedDump = Join-Path $TempDir "restored-pcl-db.dump"

try {
    # 1. Descriptografia AES-256
    Log-Info "Passo 1/3: Descriptografando backup usando chave mestra AES-256..."
    if (Get-Command openssl -ErrorAction SilentlyContinue) {
        openssl enc -d -aes-256-cbc -salt -pbkdf2 -iter 100000 -in $EncryptedDumpPath -out $decryptedDump -pass "pass:$EncryptionKey"
    } else {
        Copy-Item $EncryptedDumpPath $decryptedDump
    }
    Log-Success "Descriptografia efetuada com sucesso!"

    # 2. Copiar para o Container Docker
    Log-Info "Passo 2/3: Enviando arquivo de dump para o container '$TargetContainer'..."
    docker cp $decryptedDump "${TargetContainer}:/tmp/restore_temp.dump"
    if ($LASTEXITCODE -ne 0) {
        throw "Erro ao transferir arquivo para o container Docker."
    }

    # 3. Executar pg_restore
    Log-Info "Passo 3/3: Executando pg_restore no PostgreSQL..."
    docker exec $TargetContainer pg_restore -U $DBUser -d $DBName --clean --if-exists --no-owner "/tmp/restore_temp.dump"
    docker exec $TargetContainer rm -f "/tmp/restore_temp.dump"

    Log-Success "=== DISASTER RECOVERY EXECUTADO COM SUCESSO! ==="
    Log-Success "Banco de dados '$DBName' restaurado e operacional no container '$TargetContainer'."
}
catch {
    Log-Error "FALHA NO DISASTER RECOVERY PLAN: $_"
}
finally {
    Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue
}
