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
        (Markdown Headings # e ##).
        """
        lines = content.split("\n")
        sections = []
        current_title = "Introdução"
        current_lines = []

        for line in lines:
            if re.match(r"^#{1,3}\s+", line):
                if current_lines:
                    text_block = "\n".join(current_lines).strip()
                    if len(text_block) > 30: # Ignora blocos vazios
                        sections.append({
                            "title": current_title,
                            "content": text_block
                        })
                current_title = re.sub(r"^#{1,3}\s+", "", line).strip()
                current_lines = [line]
            else:
                current_lines.append(line)

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
            print(f"   * Processando chunk {idx+1}/{len(sections)}: '{sec['title'][:35]}...'")
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
            # Cria claim piloto
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
                # Cria recibo de evidência
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
        
        print(f"✅ Ingestão concluída com sucesso para: {doc_name}")

if __name__ == "__main__":
    ingestor = PCLDocumentIngestor()
    docs_to_ingest = [
        "architecture/principles.md",
        "architecture/modules.md",
        "governance/stage-gates.md"
    ]
    for doc in docs_to_ingest:
        ingestor.ingest_document(doc)
    print("\n🎉 Todos os documentos piloto foram ingeridos no schema 'memory' com vetores 768D e recibos de evidência!\n")
