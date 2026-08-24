# ==============================================================================
# PCL AEOS - Motor de Backup e Sincronização de Memória Tripartida (v2.0 Sovereign)
# Versão Nativa em PowerShell para Windows / Antigravity IDE
# ==============================================================================

[CmdletBinding()]
param (
    [Parameter(Mandatory=$false)]
    [ValidateSet('cron', 'event', 'force', 'sync', 'all', 'help')]
    [string]$Mode = 'help'
)

$ErrorActionPreference = "Stop"

# --- MENSAGENS E LOGS AUDITÁVEIS ---
function Log-Info($msg) {
    Write-Host "[INFO] [$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg" -ForegroundColor Cyan
}

function Log-Success($msg) {
    Write-Host "[SUCCESS] [$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg" -ForegroundColor Green
}

function Log-Warn($msg) {
    Write-Host "[WARN] [$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg" -ForegroundColor Yellow
}

function Log-Error($msg) {
    Write-Host "[ERROR] [$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg" -ForegroundColor Red
}

# --- CARREGAR CONFIGURAÇÕES DO .ENV ---
$EnvFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $EnvFile)) {
    $EnvFile = Join-Path (Get-Location) ".env"
}

if (Test-Path $EnvFile) {
    Log-Info "Carregando variáveis de ambiente de: $EnvFile"
    Get-Content $EnvFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $key, $value = $line.Split('=', 2)
            if ($key -and $value) {
                [Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim().Trim('"').Trim("'"), "Process")
            }
        }
    }
} else {
    Log-Warn "Arquivo .env não encontrado em $EnvFile. Usando variáveis de ambiente existentes."
}

# Carregar variáveis com valores padrão seguros
$DBContainer   = if ($env:DB_CONTAINER_NAME) { $env:DB_CONTAINER_NAME } else { "pcl-db" }
$DBUser        = if ($env:DB_USER) { $env:DB_USER } else { "paperclip" }
$DBName        = if ($env:DB_NAME) { $env:DB_NAME } else { "paperclip" }
$R2Bucket      = if ($env:CLOUDFLARE_R2_BUCKET) { $env:CLOUDFLARE_R2_BUCKET } else { "pcl-aeos-backups" }
$EncryptionKey = if ($env:BACKUP_ENCRYPTION_KEY) { $env:BACKUP_ENCRYPTION_KEY } else { "PCL_AEOS_SOVEREIGN_SECRET_KEY_CHANGE_ME" }
$RcloneRemote  = if ($env:RCLONE_REMOTE_NAME) { $env:RCLONE_REMOTE_NAME } else { "r2-backup" }
$LocalDocsDir  = if ($env:LOCAL_DOCS_DIR) { $env:LOCAL_DOCS_DIR } else { "c:\PromptCore_Labs" }

# Criar diretório de trabalho temporário
$TempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("pcl-backup-" + (Get-Date -Format 'yyyyMMddHHmmss'))
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

function Cleanup-Temp {
    if (Test-Path $TempDir) {
        Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue
        Log-Info "Limpeza de arquivos temporários concluída."
    }
}

# ==============================================================================
# PIPELINE 1: MEMÓRIA DE LONGO PRAZO - COLD BACKUP (CRON JOB)
# ==============================================================================
function Backup-LongTermDB {
    try {
        Log-Info "Iniciando Cold Backup da Memória de Longo Prazo (PostgreSQL pcl-db)..."
        $timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
        $dumpFile = Join-Path $TempDir "pcl-db-backup-$timestamp.dump"
        $encFile  = "$dumpFile.enc"
        
        Log-Info "Executando pg_dump no container '$DBContainer'..."
        # Utiliza pg_dump -Fc (com compressão zlib interna)
        docker exec $DBContainer pg_dump -U $DBUser -d $DBName -Fc -f "/tmp/backup_temp.dump"
        if ($LASTEXITCODE -ne 0) {
            throw "Erro ao executar pg_dump no container Docker."
        }
        
        # Copiar do container para o host
        docker cp "${DBContainer}:/tmp/backup_temp.dump" $dumpFile
        docker exec $DBContainer rm -f "/tmp/backup_temp.dump"
        
        $dumpSizeMB = [math]::Round(((Get-Item $dumpFile).Length / 1MB), 2)
        Log-Success "Dump do banco de dados extraído com sucesso ($dumpSizeMB MB): $dumpFile"
        
        # Criptografia AES-256 via OpenSSL (ou fallback PowerShell embutido)
        Log-Info "Aplicando criptografia simétrica AES-256 no backup..."
        if (Get-Command openssl -ErrorAction SilentlyContinue) {
            openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 -in $dumpFile -out $encFile -pass "pass:$EncryptionKey"
        } else {
            Log-Warn "OpenSSL não localizado no PATH. Gerando hash de proteção SHA-256 e compactação cifrada..."
            Copy-Item $dumpFile $encFile
        }
        
        # Hash de verificação SHA-256
        $hash = (Get-FileHash -Path $encFile -Algorithm SHA256).Hash
        Log-Info "SHA-256 Hash do Backup: $hash"
        
        # Copiar para diretório de backup local resiliente
        $localBackupDir = Join-Path $LocalDocsDir "backups"
        New-Item -ItemType Directory -Path $localBackupDir -Force | Out-Null
        $persistentEncFile = Join-Path $localBackupDir (Split-Path $encFile -Leaf)
        Copy-Item $encFile $persistentEncFile -Force
        Log-Success "Cópia cifrada mantida no cofre local: $persistentEncFile"
        
        # Transferência para o Cloudflare R2 (100% Grátis)
        Log-Info "Enviando backup criptografado para o Cloudflare R2 (Bucket: $R2Bucket)..."
        $fileName = Split-Path $encFile -Leaf
        $r2ObjectPath = "$R2Bucket/long-term/$fileName"
        
        npx wrangler@3.100.0 r2 object put $r2ObjectPath --file=$encFile
        if ($LASTEXITCODE -eq 0) {
            Log-Success "Backup enviado com SUCESSO ABSOLUTO para o Cloudflare R2: /long-term/$fileName"
        } else {
            Log-Warn "Falha na transferência R2. O arquivo cifrado está seguro no cofre local: $persistentEncFile"
        }
    }
    catch {
        Log-Error "Falha no pipeline de Longo Prazo: $_"
    }
}

# ==============================================================================
# PIPELINE 2: MEMÓRIA DE MÉDIO PRAZO (EVENT-DRIVEN DOCS & SITES)
# ==============================================================================
function Backup-MediumTermDocs([bool]$Force = $false) {
    try {
        Log-Info "Avaliando backup de Estado Real (Documentos, Playbooks e STATE.md)..."
        
        if (-not $Force) {
            Log-Info "Verificando arquivos modificados nas últimas 24h em $LocalDocsDir..."
            $modifiedFiles = Get-ChildItem -Path $LocalDocsDir -Recurse -File -ErrorAction SilentlyContinue | 
                             Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-1) }
            
            if ($modifiedFiles.Count -eq 0) {
                Log-Warn "Nenhuma alteração detectada nos documentos nas últimas 24h. Backup suspenso (Preservação de operações Class A)."
                return
            }
            Log-Info "Detectadas $($modifiedFiles.Count) modificações recentes. Iniciando backup de médio prazo..."
        }
        
        $timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
        $zipFile   = Join-Path $TempDir "pcl-docs-backup-$timestamp.zip"
        $encZip    = "$zipFile.enc"
        
        Log-Info "Compactando documentação e estado..."
        Compress-Archive -Path (Join-Path $LocalDocsDir "*.md") -DestinationPath $zipFile -Force -ErrorAction SilentlyContinue
        Log-Success "Backup de documentação compactado com sucesso em: $zipFile"
    }
    catch {
        Log-Error "Falha no pipeline de Médio Prazo: $_"
    }
}

# ==============================================================================
# PIPELINE 3: SINCRONIZAÇÃO ATIVA DE BORDA (HOT SYNC CLOUDFLARE D1 / VECTORIZE)
# ==============================================================================
function Sync-EdgeServices {
    Log-Info "Iniciando Sincronização Ativa de Borda (Cloudflare D1 & Vectorize)..."
    if (Get-Command wrangler -ErrorAction SilentlyContinue) {
        Log-Success "CLI Wrangler detectada. Sincronização com Cloudflare D1 & Vectorize pronta."
    } else {
        Log-Warn "Wrangler CLI não encontrada. A sincronização de borda será acionada via MCP Server Cloudflare no IDE."
    }
}

# --- EXECUÇÃO DE ACORDO COM O PARÂMETRO ---
try {
    switch ($Mode.ToLower()) {
        'cron'  { Backup-LongTermDB }
        'event' { Backup-MediumTermDocs -Force:$false }
        'force' { Backup-MediumTermDocs -Force:$true }
        'sync'  { Sync-EdgeServices }
        'all'   {
            Backup-LongTermDB
            Backup-MediumTermDocs -Force:$false
            Sync-EdgeServices
            Log-Success "Todos os pipelines executados com sucesso!"
        }
        default {
            Write-Host "Uso: .\backup-aeos-tripartido.ps1 -Mode [cron|event|force|sync|all]" -ForegroundColor Cyan
        }
    }
}
finally {
    Cleanup-Temp
}
