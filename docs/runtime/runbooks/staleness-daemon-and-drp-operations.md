# Runbook de Operações: Deterministic Staleness Daemon & DRP
> **Código de Referência:** RUNBOOK-PCL-OPS-001  
> **Classificação:** Governança Operacional & Resiliência Contínua  
> **Versão:** 2.0.0 (Soberana)

---

## 1. Deterministic Staleness Daemon (Sentinela de Conhecimento)

### 1.1 Objetivo e Funcionamento
O **Deterministic Staleness Daemon** monitora continuamente a integridade das 220 premissas atômicas (`memory.claims`) cadastradas no PostgreSQL 17 (`pcl-db`), garantindo que nenhuma alteração em arquivos de especificação ou código passe despercebida pelos agentes de IA.

* **Tempo de Execução:** ~0,2 segundo.
* **Custo Computacional:** 0 tokens de nuvem ($0.00).
* **Mecanismo:** Cálculo do hash criptográfico SHA-256 do arquivo-fonte e comparação direta com o recibo de evidência registrado em `memory.evidence_receipts`.

### 1.2 Gatilho Automático via Git Hook
Sempre que um desenvolvedor ou agente realiza um commit no repositório, o hook `.git/hooks/post-commit` dispara automaticamente a verificação:

```bash
# Executado automaticamente após cada commit Git:
powershell.exe -ExecutionPolicy Bypass -File scripts/memory/run_staleness_daemon.ps1
```

**Resultado Esperado:**
```
--- [PCL AEOS] Deterministic Staleness Verification Summary ---
Total de Claims Verificados: 220
Claims Válidos Mantidos (TRUSTED): 220
Claims Obsoletos Marcados (STALE): 0
Arquivos Não Encontrados: 0
```

Se um arquivo de especificação foi modificado e um claim foi impactado, o status da premissa é imediatamente marcado como `STALE`, forçando o RAG a despriorizar aquela informação até que o `claim_extractor.py` atualize a evidência.

---

## 2. Rotina Automatizada de Backup & DRP (Disaster Recovery Plan)

### 2.1 Agendamento no Sistema Operacional
O backup frio da Memória Tripartida é executado diariamente às **03:00 da madrugada** via Windows Task Scheduler através da tarefa `PCL_AEOS_DRP_DailyBackup`.

* **Script de Instalação e Auditoria:** `scripts/backup/setup-drp-scheduled-task.ps1`
* **Escopo do Backup:** Schemas `public` e `memory` do banco PostgreSQL 17 (`pcl-db`).
* **Criptografia:** Simétrica AES-256-CBC com derivação PBKDF2 (100.000 iterações).
* **Destino:** Bucket S3 soberano no Cloudflare R2 (`pcl-backup-memoria-tripartida`) com custo $0.00 e zero taxa de egresso (*Zero Egress*).

### 2.2 Procedimento de Restauração em Caso de Desastre
Caso ocorra pane de hardware, corrupção de disco ou exclusão acidental:

1. **Garantir que os containers básicos estejam rodando:**
   ```powershell
   docker compose up -d pcl-db pcl-laya pcl-omniroute pcl-paperclip
   ```

2. **Disparar o script de restauração com chave mestra:**
   ```powershell
   powershell.exe -ExecutionPolicy Bypass -File scripts/backup/restore-aeos-tripartido.ps1
   ```

3. **Métricas de Homologação Auditadas:**
   * **RTO (Recovery Time Objective):** **7,18 segundos** (tempo medido entre o download do snapshot, descriptografia AES-256 e `pg_restore --clean` completo).
   * **RPO (Recovery Point Objective):** <= 24h para backup frio SQL e <= 1h para eventos e especificações versionadas no Git.
