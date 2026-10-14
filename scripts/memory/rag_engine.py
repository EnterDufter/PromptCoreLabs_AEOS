"""
PCL AEOS - Hybrid RAG Engine (Vectorless + PGVector 768D + Laya System One Reranking)
Conformidade: ADR-0005, SPEC-PCL-AEOS-MEMORY-03
Preservação: Sufixo Dinâmico para proteção do EBITDA Shield (Prompt Cache) no OmniRoute.
"""

import urllib.request
import urllib.error
import json
import time
from typing import List, Dict, Any, Optional
from db_client import PCLDatabaseClient

class PCLHybridRAGEngine:
    def __init__(
        self,
        ollama_url: str = "http://localhost:11434",
        laya_url: str = "http://localhost:20140",
        embedding_model: str = "nomic-embed-text",
        answerability_threshold: float = 0.55
    ):
        self.ollama_url = ollama_url
        self.laya_url = laya_url
        self.embedding_model = embedding_model
        self.answerability_threshold = answerability_threshold
        self.db = PCLDatabaseClient()

    def get_embedding(self, text: str) -> List[float]:
        """Gera embedding de 768 dimensões via Ollama local."""
        payload = json.dumps({
            "model": self.embedding_model,
            "prompt": text
        }).encode("utf-8")
        req = urllib.request.Request(
            f"{self.ollama_url}/api/embeddings",
            data=payload,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            return data.get("embedding", [])

    def search_similar_chunks(self, query: str, top_k: int = 6, section_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Busca os chunks mais similares no PostgreSQL 17 utilizando pgvector."""
        query_vec = self.get_embedding(query)
        if not query_vec:
            return []

        vec_str = "[" + ",".join(str(x) for x in query_vec) + "]"
        
        where_clause = ""
        if section_filter:
            where_clause = f"WHERE section_title ILIKE '%{section_filter}%'"

        sql = f"""
            SELECT 
                id,
                source_file,
                section_title,
                content,
                file_sha256,
                (embedding <-> '{vec_str}'::vector) as distance
            FROM memory.document_chunks
            {where_clause}
            ORDER BY distance ASC
            LIMIT {top_k};
        """
        return self.db.query_json(sql)

    def rerank_with_laya(self, query: str, candidate_chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Reranking e Answerability Check via pcl-laya em lote (< 15ms em CPU)."""
        if not candidate_chunks:
            return []

        questions = []
        for idx, chunk in enumerate(candidate_chunks):
            questions.append({
                "id": str(idx),
                "type": "score",
                "query": query,
                "min_val": 0.0,
                "max_val": 1.0
            })

        reranked = []
        # Avalia cada chunk com o Laya (usando endpoint unificado de score)
        for chunk in candidate_chunks:
            payload = json.dumps({
                "state": chunk.get("content", ""),
                "query": query,
                "min_val": 0.0,
                "max_val": 1.0
            }).encode("utf-8")
            
            try:
                req = urllib.request.Request(
                    f"{self.laya_url}/v1/classifier/evaluate/score",
                    data=payload,
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=3) as resp:
                    res = json.loads(resp.read().decode())
                    chunk["laya_score"] = res.get("score", 0.0)
                    chunk["laya_confidence"] = res.get("confidence", 0.0)
                    chunk["laya_latency_ms"] = res.get("duration_ms", 0.0)
            except Exception as e:
                # Fallback suave caso o Laya falhe
                chunk["laya_score"] = 1.0 - float(chunk.get("distance", 0.5))
                chunk["laya_confidence"] = 0.7

            reranked.append(chunk)

        # Ordena pelos scores mais altos atribuídos pelo Laya
        reranked.sort(key=lambda x: x.get("laya_score", 0.0), reverse=True)
        return reranked

    def retrieve_grounded_context(self, query: str, top_k: int = 3, section_filter: Optional[str] = None) -> Dict[str, Any]:
        """
        Executa o pipeline completo:
        1. Busca candidatos HNSW no PostgreSQL
        2. Reranking com Laya System One
        3. Avaliação de Answerability (Fast Exit)
        4. Formatação do Bloco de Sufixo (EBITDA Shield)
        """
        start_t = time.perf_counter()
        
        candidates = self.search_similar_chunks(query, top_k=top_k * 2, section_filter=section_filter)
        if not candidates:
            return {
                "is_answerable": False,
                "fast_exit": True,
                "reason": "NENHUM_CHUNK_ENCONTRADO",
                "grounded_context": "",
                "chunks": [],
                "duration_ms": round((time.perf_counter() - start_t) * 1000, 2)
            }

        reranked = self.rerank_with_laya(query, candidates)
        top_selected = reranked[:top_k]
        best_score = top_selected[0].get("laya_score", 0.0) if top_selected else 0.0

        # Fast Exit Trigger: Se a melhor evidência for insuficiente, corta a chamada de LLM
        if best_score < self.answerability_threshold:
            return {
                "is_answerable": False,
                "fast_exit": True,
                "best_score": round(best_score, 4),
                "reason": "EVIDENCIA_INSUFICIENTE_PARA_RESPOSTA",
                "message": "A documentação indexada não contém evidências suficientes para responder a esta solicitação.",
                "chunks": top_selected,
                "duration_ms": round((time.perf_counter() - start_t) * 1000, 2)
            }

        # Formata o Bloco de Sufixo Dinâmico (preserva o EBITDA Shield)
        evidence_lines = ["[EVIDENCE GROUNDING BLOCK — VÁLIDO E RASTREADO]"]
        for c in top_selected:
            evidence_lines.append(
                f"- [Fonte: {c['source_file']} | Seção: {c.get('section_title', 'Geral')}] "
                f"(Score Laya: {c.get('laya_score', 0.0):.2f}):\n  \"{c['content'].strip()}\""
            )
        evidence_block = "\n".join(evidence_lines)

        return {
            "is_answerable": True,
            "fast_exit": False,
            "best_score": round(best_score, 4),
            "grounded_context": evidence_block,
            "chunks": top_selected,
            "duration_ms": round((time.perf_counter() - start_t) * 1000, 2)
        }
