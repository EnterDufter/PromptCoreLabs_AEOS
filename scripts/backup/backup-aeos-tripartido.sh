#!/usr/bin/env bash
# ==============================================================================
# PCL AEOS - Motor de Backup e Sincronização de Memória Tripartida (v2.0 Sovereign)
# Versão Otimizada em Bash
# ==============================================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO] [$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS] [$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN] [$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR] [$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"; }

ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
    log_info "Carregando variáveis de ambiente de $ENV_FILE..."
    export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

DB_CONTAINER_NAME="${DB_CONTAINER_NAME:-pcl-db}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-postgres}"
CLOUDFLARE_R2_BUCKET="${CLOUDFLARE_R2_BUCKET:-pcl-aeos-backups}"
BACKUP_ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-PCL_AEOS_SOVEREIGN_SECRET_KEY}"
RCLONE_REMOTE_NAME="${RCLONE_REMOTE_NAME:-r2-backup}"
LOCAL_DOCS_DIR="${LOCAL_DOCS_DIR:-/c/PromptCore_Labs}"

TEMP_DIR="/tmp/pcl-backup-$(date +%s)"
mkdir -p "$TEMP_DIR"
trap 'rm -rf "$TEMP_DIR"; log_info "Limpeza de arquivos temporários concluída."' EXIT

backup_long_term_db() {
    log_info "Iniciando Cold Backup da Memória de Longo Prazo (pcl-db)..."
    local db_backup_file="${TEMP_DIR}/pcl-db-backup-$(date +%Y%m%d_%H%M%S).dump"
    local encrypted_db_file="${db_backup_file}.enc"

    log_info "Executando pg_dump -Fc no container '${DB_CONTAINER_NAME}'..."
    docker exec "$DB_CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" -Fc > "$db_backup_file"
    log_success "Dump gerado com sucesso em: $db_backup_file"

    log_info "Aplicando criptografia simétrica AES-256..."
    openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 \
        -in "$db_backup_file" \
        -out "$encrypted_db_file" \
        -pass pass:"$BACKUP_ENCRYPTION_KEY"
    log_success "Backup criptografado com sucesso: $(basename "$encrypted_db_file")"

    if command -v rclone &> /dev/null; then
        log_info "Enviando arquivo cifrado para o Cloudflare R2..."
        rclone copy "$encrypted_db_file" "${RCLONE_REMOTE_NAME}:${CLOUDFLARE_R2_BUCKET}/long-term/"
        log_success "Backup transferido com sucesso para o R2!"
    else
        log_warn "rclone não instalado. O arquivo criptografado está salvo em: $encrypted_db_file"
    fi
}

print_usage() {
    echo "Uso: $0 [--cron|--event|--force|--sync|--all|--help]"
}

case "${1:-}" in
    --cron)  backup_long_term_db ;;
    --all)   backup_long_term_db ;;
    *)       print_usage ;;
esac
