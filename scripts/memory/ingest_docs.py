"""
PCL AEOS - Ingestão Piloto de Documentos (Hierarchical Vectorless + Temporal Graph Claims)
Conformidade: ADR-0005, SPEC-PCL-AEOS-MEMORY-03
Documentos Ingeridos: architecture/principles.md, architecture/modules.md, governance/stage-gates.md
"""

import os
import re
import sys
import hashlib
import subprocess
from typing import List, Dict, Any

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from db_client import PCLDatabaseClient
from rag_engine import PCLHybridRAGEngine

class PCLDocumentIngestor:
    def __init__(self, repo_root: str = "c:\\PromptCore_Labs"):
        self.repo_root = os.path.abspath(repo_root)
        self.db = PCLDatabaseClient()
        self.rag = PCLHybridRAGEngine()

    def get_file_metadata(self, relative_path: str) -> Dict[str, str]:
        clean_path = relative_path.replace("/", os.sep).replace("\\", os.sep)
        full_path = os.path.join(self.repo_root, clean_path)
        
        # 1. SHA-256
        sha256 = hashlib.sha256()
        with open(full_path, "rb") as f:
            while chunk := f.read(65536):
                sha256.update(chunk)
        file_hash = sha256.hexdigest()

        # 2. Git Commit Hash
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

    def parse_hierarchical_sections(self, content: str) -> List[Dict[str, str]]:
        """
        Navegação Vectorless: divide o documento respeitando os títulos de seção
        (Markdown Headings #, ##, ### e Banners === / ---).
        """
        lines = content.split("\n")
        sections = []
        current_title = "Introdução"
        current_lines = []

        i = 0
        while i < len(lines):
            line = lines[i]
            line_str = line.strip()
            
            # 1. Detecta Markdown Header (#, ##, ###)
            is_header = False
            header_title = ""
            if re.match(r"^#{1,4}\s+", line):
                is_header = True
                header_title = re.sub(r"^#{1,4}\s+", "", line).strip()
            
            # 2. Detecta Banner Header (=== ou --- abaixo de linha de texto)
            elif i + 1 < len(lines) and re.match(r"^={3,}$|^-{3,}$", lines[i+1].strip()) and line_str and not line_str.startswith("="):
                is_header = True
                header_title = line_str
                i += 1 # pula a linha de separador
            
            # 3. Detecta Banner Header centralizado (linha entre ===)
            elif re.match(r"^={3,}$|^-{3,}$", line_str) and i + 2 < len(lines) and re.match(r"^={3,}$|^-{3,}$", lines[i+2].strip()):
                is_header = True
                header_title = lines[i+1].strip()
                i += 2 # pula título e fechamento

            if is_header:
                if current_lines:
                    text_block = "\n".join(current_lines).strip()
                    if len(text_block) > 30:
                        sections.append({
                            "title": current_title,
                            "content": text_block
                        })
                current_title = header_title
                current_lines = [line]
            else:
                current_lines.append(line)
            
            i += 1

        if current_lines:
            text_block = "\n".join(current_lines).strip()
            if len(text_block) > 30:
                sections.append({
                    "title": current_title,
                    "content": text_block
                })

        return sections

    def ingest_document(self, relative_path: str):
        print(f"\n📄 Ingerindo documento: {relative_path}")
        meta = self.get_file_metadata(relative_path)
        
        with open(meta["full_path"], "r", encoding="utf-8") as f:
            content = f.read()

        sections = self.parse_hierarchical_sections(content)
        print(f" - Seções hierárquicas identificadas: {len(sections)}")

        # Limpa chunks anteriores do mesmo arquivo para garantir idempotência
        self.db.execute_sql(f"DELETE FROM memory.document_chunks WHERE source_file = '{meta['relative_path']}';")

        # 1. Inserção de Chunks Vetoriais 768D
        for idx, sec in enumerate(sections):
            vec = self.rag.get_embedding(sec["content"][:2000])
            vec_str = "[" + ",".join(str(x) for x in vec) + "]"
            
            clean_content = sec["content"].replace("'", "''")
            clean_title = sec["title"].replace("'", "''")
            
            sql_chunk = f"""
                INSERT INTO memory.document_chunks 
                (source_file, section_title, chunk_index, content, embedding, file_sha256)
                VALUES (
                    '{meta['relative_path']}',
                    '{clean_title}',
                    {idx},
                    '{clean_content}',
                    '{vec_str}'::vector,
                    '{meta['file_sha256']}'
                );
            """
            self.db.execute_sql(sql_chunk)

        # 2. Criação de Entidade e Claim no Grafo de Conhecimento
        doc_name = os.path.basename(relative_path)
        entity_sql = f"""
            INSERT INTO memory.entities (name, entity_type, metadata)
            VALUES ('{doc_name}', 'architecture_doc', '{{"source": "{meta['relative_path']}"}}'::jsonb)
            ON CONFLICT (name, entity_type) DO UPDATE SET metadata = EXCLUDED.metadata
            RETURNING id;
        """
        entity_res = self.db.query_json(entity_sql)
        entity_id = entity_res[0]["id"] if entity_res else None

        if entity_id:
            claim_text = f"Documento oficial {doc_name} define regras e principios com hash {meta['file_sha256'][:8]}."
            clean_claim_text = claim_text.replace("'", "''")
            claim_sql = f"""
                INSERT INTO memory.claims 
                (subject_id, predicate, value_text, status, source_model)
                VALUES (
                    '{entity_id}',
                    'defines_governance',
                    '{clean_claim_text}',
                    'TRUSTED',
                    'system_pilot'
                )
                RETURNING id;
            """
            claim_res = self.db.query_json(claim_sql)
            if claim_res:
                claim_id = claim_res[0]["id"]
                receipt_sql = f"""
                    INSERT INTO memory.evidence_receipts
                    (claim_id, source_file, file_sha256, git_commit_hash, section_anchor)
                    VALUES (
                        '{claim_id}',
                        '{meta['relative_path']}',
                        '{meta['file_sha256']}',
                        '{meta['git_commit_hash']}',
                        'root'
                    );
                """
                self.db.execute_sql(receipt_sql)
        
        print(f"✅ Ingestão concluída com sucesso para: {doc_name} ({len(sections)} chunks)")

if __name__ == "__main__":
    ingestor = PCLDocumentIngestor()
    docs_to_ingest = [
        "foundation/FOUNDATION.md",
        "architecture/principles.md",
        "architecture/modules.md",
        "architecture/decisions/ADR-0005-tripartite-memory-system-one-evolution.md",
        "governance/governance.md",
        "governance/operating-model.md",
        "governance/decision-authority.md",
        "governance/policies.md",
        "governance/roles.md",
        "governance/stage-gates.md",
        "memory/README.md",
        "specs/pcl-aeos-evolution/spec-pcl-aeos-temporal-graph-rag-and-reconciliation.md",
        "specs/pcl-aeos-evolution/spec-pcl-aeos-classifier-engine.md",
        "specs/pcl-aeos-evolution/spec-pcl-aeos-extended-memory-agent.md",
        "specs/pcl-aeos-evolution/spec-pcl-aeos-antigravity-rollout-playbook-v2.md"
    ]
    print(f"\n========================================================")
    print(f" INICIANDO INGESTÃO EM MASSA DE {len(docs_to_ingest)} DOCUMENTOS CORE ")
    print(f"========================================================")
    for doc in docs_to_ingest:
        ingestor.ingest_document(doc)
    print(f"\n🎉 Todos os {len(docs_to_ingest)} documentos core foram ingeridos no schema 'memory' com vetores 768D e recibos de evidência!\n")

