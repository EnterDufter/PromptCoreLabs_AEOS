"""
PCL AEOS - Deterministic Staleness Daemon (Verificador de Frescor de Evidências)
Conformidade: ADR-0005, SPEC-PCL-AEOS-MEMORY-03
Custo em Tokens de LLM: 0 (Zero Tokens - Verificação Determinística por Hash Criptográfico)
"""

import os
import sys
import hashlib
from typing import Dict, Any, List

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from db_client import PCLDatabaseClient

class DeterministicStalenessVerifier:
    def __init__(self, repo_root: str = "c:\\PromptCore_Labs"):
        self.repo_root = os.path.abspath(repo_root)
        self.db = PCLDatabaseClient()

    def calculate_file_hash(self, relative_path: str) -> str:
        """Calcula o SHA-256 do arquivo no repositório de forma normalizada."""
        # Suporta separadores de path normalizados
        clean_path = relative_path.replace("/", os.sep).replace("\\", os.sep)
        full_path = os.path.join(self.repo_root, clean_path)
        
        if not os.path.exists(full_path):
            return ""
        
        sha256 = hashlib.sha256()
        with open(full_path, "rb") as f:
            while chunk := f.read(65536):
                sha256.update(chunk)
        return sha256.hexdigest()

    def run_staleness_check(self) -> Dict[str, Any]:
        """
        Executa a verificação determinística de todos os claims com status TRUSTED
        contra os hashes atuais dos arquivos fonte no repositório.
        """
        sql = """
            SELECT 
                c.id as claim_id,
                c.value_text,
                c.status,
                r.id as receipt_id,
                r.source_file,
                r.file_sha256 as recorded_hash,
                r.git_commit_hash
            FROM memory.claims c
            JOIN memory.evidence_receipts r ON r.claim_id = c.id
            WHERE c.status = 'TRUSTED'
        """
        records = self.db.query_json(sql)
        
        total_checked = len(records)
        stale_flagged = 0
        trusted_retained = 0
        missing_files = 0
        details = []

        for row in records:
            claim_id = row["claim_id"]
            source_file = row["source_file"]
            recorded_hash = row["recorded_hash"]
            
            current_hash = self.calculate_file_hash(source_file)
            
            if not current_hash:
                # Arquivo foi excluído ou movido
                missing_files += 1
                stale_flagged += 1
                self._update_claim_status(claim_id, "STALE")
                details.append({
                    "claim_id": claim_id,
                    "source_file": source_file,
                    "reason": "FILE_NOT_FOUND",
                    "status": "STALE"
                })
            elif current_hash != recorded_hash:
                # O conteúdo do arquivo mudou (Memory Drift detectado!)
                stale_flagged += 1
                self._update_claim_status(claim_id, "STALE")
                details.append({
                    "claim_id": claim_id,
                    "source_file": source_file,
                    "reason": "HASH_MISMATCH",
                    "recorded_hash": recorded_hash[:12] + "...",
                    "current_hash": current_hash[:12] + "...",
                    "status": "STALE"
                })
            else:
                trusted_retained += 1

        return {
            "total_checked": total_checked,
            "trusted_retained": trusted_retained,
            "stale_flagged": stale_flagged,
            "missing_files": missing_files,
            "details": details
        }

    def _update_claim_status(self, claim_id: str, new_status: str):
        sql = f"UPDATE memory.claims SET status = '{new_status}' WHERE id = '{claim_id}';"
        self.db.execute_sql(sql)

if __name__ == "__main__":
    verifier = DeterministicStalenessVerifier()
    res = verifier.run_staleness_check()
    print("--- [PCL AEOS] Deterministic Staleness Verification Summary ---")
    print(f"Total de Claims Verificados: {res['total_checked']}")
    print(f"Claims Válidos Mantidos (TRUSTED): {res['trusted_retained']}")
    print(f"Claims Obsoletos Marcados (STALE): {res['stale_flagged']}")
    print(f"Arquivos Não Encontrados: {res['missing_files']}")
    if res["details"]:
        print("\nDetalhes dos Claims Sinalizados:")
        for d in res["details"]:
            print(f" - [{d['status']}] {d['source_file']}: {d['reason']}")
