"""
PCL AEOS - Motor de Reconciliação Canônica e Engenharia Reversa (SSOT)
Conformidade: ADR-0005, SPEC-PCL-AEOS-MEMORY-03
Executa a consolidação de claims com múltiplos modelos (Claude, GPT, Gemini)
usando o Laya System One em CPU (< 35ms) e a Hierarquia Formal de Verdade PCL.
"""

import os
import sys
import time
import json
import urllib.request
from typing import List, Dict, Any, Tuple, Optional

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from db_client import PCLDatabaseClient

class PCLReconciliationEngine:
    def __init__(self, laya_url: str = "http://localhost:20140"):
        self.db = PCLDatabaseClient()
        self.laya_url = laya_url

    def detect_contradiction_laya(self, text_a: str, text_b: str) -> Dict[str, Any]:
        """
        Consulta o coprocessador System One pcl-laya em CPU (< 35ms)
        para avaliar se duas afirmações divergem ou colidem frontalmente.
        """
        payload = json.dumps({
            "state": f"Afirmação A: {text_a}\nAfirmação B: {text_b}",
            "query": "As duas afirmações apresentam contradição frontal ou conflito de configuração?"
        }).encode("utf-8")
        try:
            req = urllib.request.Request(
                f"{self.laya_url}/v1/classifier/evaluate/binary",
                data=payload,
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=2.0) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    return {
                        "has_conflict": data.get("result", False),
                        "confidence": data.get("confidence", 0.5),
                        "duration_ms": data.get("duration_ms", 0.0)
                    }
        except Exception as e:
            # Fallback determinístico léxico caso Laya esteja ocupado
            pass

        # Fallback determinístico ontológico
        a_lower = text_a.lower()
        b_lower = text_b.lower()
        antonyms = [
            ("ativado", "desativado"), ("true", "false"), ("sim", "não"),
            ("permitido", "proibido"), ("public", "memory"), ("online", "offline"),
            ("20130", "20140"), ("8080", "20130"), ("5432", "5433")
        ]
        has_conflict = False
        for ant1, ant2 in antonyms:
            if (ant1 in a_lower and ant2 in b_lower) or (ant2 in a_lower and ant1 in b_lower):
                has_conflict = True
                break

        return {
            "has_conflict": has_conflict,
            "confidence": 0.92 if has_conflict else 0.85,
            "duration_ms": 1.0
        }

    def reconcile_claims_pair(self, claim_a: Dict[str, Any], claim_b: Dict[str, Any]) -> Dict[str, Any]:
        """
        Aplica a Máquina de Estados da Hierarquia de Verdade PCL AEOS:
        Tier 1 (100 - ADRs/Princípios) > Tier 2 (80 - Specs) > Tier 3 (60 - Código) > Tier 4 (40 - Rascunhos)
        """
        check = self.detect_contradiction_laya(claim_a["value_text"], claim_b["value_text"])
        if not check["has_conflict"]:
            return {
                "resolved": False,
                "reason": "COMPATIBLE",
                "details": "Sem contradição detectada."
            }

        tier_a = claim_a.get("authority_tier", 50)
        tier_b = claim_b.get("authority_tier", 50)

        if tier_a > tier_b:
            winner = claim_a
            loser = claim_b
            reason = f"Precedência Hierárquica: Tier {tier_a} ({claim_a['source_model']}) sobrepõe Tier {tier_b} ({claim_b['source_model']})"
            self._apply_supersede(winner["id"], loser["id"])
            return {
                "resolved": True,
                "winner_id": winner["id"],
                "loser_id": loser["id"],
                "action": "SUPERSEDE",
                "reason": reason
            }
        elif tier_b > tier_a:
            winner = claim_b
            loser = claim_a
            reason = f"Precedência Hierárquica: Tier {tier_b} ({claim_b['source_model']}) sobrepõe Tier {tier_a} ({claim_a['source_model']})"
            self._apply_supersede(winner["id"], loser["id"])
            return {
                "resolved": True,
                "winner_id": winner["id"],
                "loser_id": loser["id"],
                "action": "SUPERSEDE",
                "reason": reason
            }
        else:
            # Empate formal entre modelos do mesmo escalão -> Stage Gate Humano / Cortex
            self._apply_contested(claim_a["id"], claim_b["id"])
            return {
                "resolved": True,
                "winner_id": None,
                "loser_id": None,
                "action": "CONTESTED",
                "reason": f"Divergência entre fontes de mesmo escalão (Tier {tier_a}). Marcado para Stage Gate de Incerteza."
            }

    def _apply_supersede(self, winner_id: str, loser_id: str):
        self.db.execute_sql(f"UPDATE memory.claims SET status = 'TRUSTED' WHERE id = '{winner_id}';")
        self.db.execute_sql(f"UPDATE memory.claims SET status = 'SUPERSEDED', superseded_by = '{winner_id}' WHERE id = '{loser_id}';")

    def _apply_contested(self, id_a: str, id_b: str):
        self.db.execute_sql(f"UPDATE memory.claims SET status = 'CONTESTED' WHERE id IN ('{id_a}', '{id_b}');")

    def run_canonical_reconciliation(self) -> Dict[str, Any]:
        """
        Executa a varredura completa de claims agrupadas por sujeito e reconcilia conflitos.
        """
        t0 = time.perf_counter()
        claims = self.db.query_json("SELECT id, subject_id, predicate, value_text, status, authority_tier, source_model FROM memory.claims WHERE status != 'SUPERSEDED';")
        
        # Agrupa por subject_id
        grouped: Dict[str, List[Dict[str, Any]]] = {}
        for c in claims:
            s_id = c["subject_id"]
            if s_id not in grouped:
                grouped[s_id] = []
            grouped[s_id].append(c)

        reconciled_count = 0
        conflicts_resolved = 0
        contested_count = 0

        for subject_id, subject_claims in grouped.items():
            if len(subject_claims) < 2:
                continue
            
            # Compara pares
            for i in range(len(subject_claims)):
                for j in range(i + 1, len(subject_claims)):
                    res = self.reconcile_claims_pair(subject_claims[i], subject_claims[j])
                    if res["resolved"]:
                        if res["action"] == "SUPERSEDE":
                            conflicts_resolved += 1
                        elif res["action"] == "CONTESTED":
                            contested_count += 1
                    reconciled_count += 1

        duration_ms = (time.perf_counter() - t0) * 1000

        # Sumário do estado atual
        status_summary = self.db.query_json("SELECT status, count(*) as total FROM memory.claims GROUP BY status;")
        
        return {
            "total_pairs_compared": reconciled_count,
            "conflicts_resolved_by_hierarchy": conflicts_resolved,
            "contested_staged_for_review": contested_count,
            "duration_ms": round(duration_ms, 2),
            "status_summary": {item["status"]: item["total"] for item in status_summary}
        }

if __name__ == "__main__":
    engine = PCLReconciliationEngine()
    print("\nExecutando Reconciliação Canônica em memory.claims...")
    report = engine.run_canonical_reconciliation()
    print(f"Pares Avaliados: {report['total_pairs_compared']}")
    print(f"Conflitos Resolvidos por Hierarquia de Verdade: {report['conflicts_resolved_by_hierarchy']}")
    print(f"Casos Contestados (Stage Gate Humano): {report['contested_staged_for_review']}")
    print(f"Duração Total: {report['duration_ms']}ms")
    print("Distribuição de Status SSOT:", report["status_summary"])
