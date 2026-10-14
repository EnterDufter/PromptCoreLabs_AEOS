"""
PCL AEOS - Motor de Extração de Claims com Proveniência Epistemológica
Conformidade: ADR-0005, SPEC-PCL-AEOS-MEMORY-03
Extrai claims e triplas ontológicas com carimbo de modelo, hash SHA-256 e nível de autoridade.
"""

import os
import re
import sys
import hashlib
import subprocess
from typing import List, Dict, Any, Optional

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from db_client import PCLDatabaseClient

class PCLClaimExtractor:
    def __init__(self, repo_root: str = "c:\\PromptCore_Labs"):
        self.repo_root = os.path.abspath(repo_root)
        self.db = PCLDatabaseClient()

    def determine_authority_tier(self, relative_path: str) -> int:
        """
        Calcula o nível formal de autoridade conforme a Hierarquia de Verdade PCL:
        Tier 1 (100): Princípios Fundamentais e ADRs Aprovados
        Tier 2 (80):  Especificações Técnicas Formais (TLC v3 / specs)
        Tier 3 (60):  Código em Execução e Infraestrutura Ativa (docker-compose, services)
        Tier 4 (40):  Documentos Históricos, Rascunhos e Projetos Exploratórios
        """
        norm_path = relative_path.replace("\\", "/").lower()
        if norm_path.startswith("architecture/principles") or norm_path.startswith("architecture/decisions") or norm_path.startswith("governance/"):
            return 100
        elif norm_path.startswith("specs/") or "spec-" in norm_path:
            return 80
        elif norm_path.startswith("services/") or "docker-compose" in norm_path or norm_path.startswith("scripts/"):
            return 60
        else:
            return 40

    def infer_source_model(self, relative_path: str, content: str) -> str:
        """Infere ou detecta o modelo gerador / proveniência do documento."""
        lower_content = content[:1500].lower()
        if "claude" in lower_content:
            return "claude-3-5-sonnet"
        elif "gpt-4" in lower_content or "openai" in lower_content:
            return "gpt-4o"
        elif "gemini" in lower_content:
            return "gemini-1-5-pro"
        elif "adr-" in relative_path.lower() or "principles" in relative_path.lower():
            return "human_architect"
        return "legacy_model_agent"

    def get_file_metadata(self, relative_path: str) -> Dict[str, str]:
        clean_path = relative_path.replace("/", os.sep).replace("\\", os.sep)
        full_path = os.path.join(self.repo_root, clean_path)
        
        sha256 = hashlib.sha256()
        with open(full_path, "rb") as f:
            while chunk := f.read(65536):
                sha256.update(chunk)
        file_hash = sha256.hexdigest()

        commit_hash = "HEAD"
        try:
            res = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                cwd=self.repo_root,
                capture_output=True,
                text=True
            )
            if res.returncode == 0:
                commit_hash = res.stdout.strip()
        except Exception:
            pass

        return {
            "full_path": full_path,
            "relative_path": relative_path.replace("\\", "/"),
            "file_sha256": file_hash,
            "git_commit_hash": commit_hash
        }

    def extract_claims_from_file(self, relative_path: str, source_model_override: Optional[str] = None) -> List[Dict[str, Any]]:
        meta = self.get_file_metadata(relative_path)
        with open(meta["full_path"], "r", encoding="utf-8") as f:
            content = f.read()

        authority = self.determine_authority_tier(relative_path)
        model = source_model_override or self.infer_source_model(relative_path, content)
        doc_name = os.path.basename(relative_path)

        claims = []
        lines = content.split("\n")
        current_section = "Introdução"

        for line in lines:
            line_str = line.strip()
            if re.match(r"^#{1,3}\s+", line_str):
                current_section = re.sub(r"^#{1,3}\s+", "", line_str).strip()
                continue
            
            # Detecta afirmações arquiteturais (linhas com marcadores fortes ou diretrizes)
            if any(k in line_str.lower() for k in ["princípio", "deve", "não pode", "proibido", "porta", "requer", "isolamento", "porta:"]):
                if len(line_str) > 20 and len(line_str) < 300:
                    claims.append({
                        "entity_name": doc_name,
                        "entity_type": "architecture_doc",
                        "predicate": "asserts_rule",
                        "value_text": line_str,
                        "authority_tier": authority,
                        "source_model": model,
                        "source_file": meta["relative_path"],
                        "file_sha256": meta["file_sha256"],
                        "git_commit_hash": meta["git_commit_hash"],
                        "section_anchor": current_section
                    })

        # Se nenhuma linha específica foi capturada, cria uma claim macro do documento
        if not claims:
            summary = content[:200].replace("\n", " ").strip()
            claims.append({
                "entity_name": doc_name,
                "entity_type": "architecture_doc",
                "predicate": "defines_module",
                "value_text": summary,
                "authority_tier": authority,
                "source_model": model,
                "source_file": meta["relative_path"],
                "file_sha256": meta["file_sha256"],
                "git_commit_hash": meta["git_commit_hash"],
                "section_anchor": "header"
            })

        return claims

    def persist_claims(self, claims: List[Dict[str, Any]]) -> List[str]:
        inserted_ids = []
        for c in claims:
            # 1. Garante a Entidade
            clean_name = c["entity_name"].replace("'", "''")
            clean_type = c["entity_type"].replace("'", "''")
            entity_sql = f"""
                INSERT INTO memory.entities (name, entity_type, metadata)
                VALUES ('{clean_name}', '{clean_type}', '{{"source": "{c['source_file']}"}}'::jsonb)
                ON CONFLICT (name, entity_type) DO UPDATE SET metadata = EXCLUDED.metadata
                RETURNING id;
            """
            entity_res = self.db.query_json(entity_sql)
            if not entity_res:
                continue
            entity_id = entity_res[0]["id"]

            # 2. Insere a Claim
            clean_val = c["value_text"].replace("'", "''")
            clean_pred = c["predicate"].replace("'", "''")
            clean_model = c["source_model"].replace("'", "''")
            
            claim_sql = f"""
                INSERT INTO memory.claims 
                (subject_id, predicate, value_text, status, authority_tier, source_model)
                VALUES (
                    '{entity_id}',
                    '{clean_pred}',
                    '{clean_val}',
                    'TRUSTED',
                    {c['authority_tier']},
                    '{clean_model}'
                )
                RETURNING id;
            """
            claim_res = self.db.query_json(claim_sql)
            if not claim_res:
                continue
            claim_id = claim_res[0]["id"]
            inserted_ids.append(claim_id)

            # 3. Insere Recibo de Evidência
            clean_anchor = c["section_anchor"].replace("'", "''")
            receipt_sql = f"""
                INSERT INTO memory.evidence_receipts
                (claim_id, source_file, file_sha256, git_commit_hash, section_anchor)
                VALUES (
                    '{claim_id}',
                    '{c['source_file']}',
                    '{c['file_sha256']}',
                    '{c['git_commit_hash']}',
                    '{clean_anchor}'
                );
            """
            self.db.execute_sql(receipt_sql)

        return inserted_ids

if __name__ == "__main__":
    extractor = PCLClaimExtractor()
    print("Iniciando extração em massa de claims com carimbos de proveniência e Tiers de autoridade...")
    core_files = [
        ("foundation/FOUNDATION.md", "human_architect"),
        ("architecture/principles.md", "human_architect"),
        ("architecture/modules.md", "human_architect"),
        ("architecture/decisions/ADR-0005-tripartite-memory-system-one-evolution.md", "human_architect"),
        ("governance/governance.md", "human_architect"),
        ("governance/operating-model.md", "human_architect"),
        ("governance/decision-authority.md", "human_architect"),
        ("governance/policies.md", "human_architect"),
        ("governance/roles.md", "human_architect"),
        ("governance/stage-gates.md", "human_architect"),
        ("memory/README.md", "human_architect"),
        ("specs/pcl-aeos-evolution/spec-pcl-aeos-temporal-graph-rag-and-reconciliation.md", "claude-3-5-sonnet"),
        ("specs/pcl-aeos-evolution/spec-pcl-aeos-classifier-engine.md", "claude-3-5-sonnet"),
        ("specs/pcl-aeos-evolution/spec-pcl-aeos-extended-memory-agent.md", "claude-3-5-sonnet"),
        ("specs/pcl-aeos-evolution/spec-pcl-aeos-antigravity-rollout-playbook-v2.md", "claude-3-5-sonnet")
    ]
    total = 0
    for file_path, model in core_files:
        claims = extractor.extract_claims_from_file(file_path, source_model_override=model)
        ids = extractor.persist_claims(claims)
        print(f"📄 {file_path} -> {len(ids)} claims persistidas (Tier {extractor.determine_authority_tier(file_path)}, Modelo: {model})")
        total += len(ids)
    print(f"\n🎉 Total de {total} claims com rastreabilidade persistidas com sucesso!\n")
