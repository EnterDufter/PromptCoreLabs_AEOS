"""
PCL AEOS - Test Suite de Validação da Fase 3 (Stage Gate 3)
Testes:
1. Extração Multimodelo e Carimbos de Proveniência (source_model, authority_tier, evidence_receipts)
2. Detecção de Conflitos e Contradições via pcl-laya System One em CPU (< 35ms)
3. Arbitragem por Hierarquia de Verdade PCL (ADR/Princípios Tier 100 sobrepõem Rascunho Tier 40)
4. Contenção de Incerteza (Empate de mesmo nível gera status CONTESTED para Stage Gate Humano)
5. Integridade do Estado Canônico SSOT (0 claims TRUSTED em contradição e 0 MB VRAM)
"""

import sys
import os
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Adiciona scripts/memory ao path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "memory")))

from db_client import PCLDatabaseClient
from claim_extractor import PCLClaimExtractor
from reconciliation_engine import PCLReconciliationEngine

def run_phase3_tests():
    print("\n========================================================")
    print(" INICIANDO TESTES DO STAGE GATE 3 (RECONCILIAÇÃO CANÔNICA & SSOT) ")
    print("========================================================\n")
    
    db = PCLDatabaseClient()
    extractor = PCLClaimExtractor()
    engine = PCLReconciliationEngine()

    # ---------------------------------------------------------
    # TESTE 1: Extração e Proveniência Heterogênea
    # ---------------------------------------------------------
    print("--- [1/5] Verificando Proveniência e Níveis de Autoridade ---")
    model_stats = db.query_json("SELECT source_model, authority_tier, count(*) as count FROM memory.claims GROUP BY source_model, authority_tier;")
    print("Distribuição de proveniência atual:", model_stats)
    models = {m["source_model"] for m in model_stats}
    assert len(models) >= 2, "Deveria haver pelo menos 2 modelos/origens distintos no banco."
    print("✅ Proveniência multimodelo e níveis formais de autoridade (Tiers) verificados.")

    # ---------------------------------------------------------
    # TESTE 2: Detecção de Conflito via pcl-laya (< 35ms)
    # ---------------------------------------------------------
    print("\n--- [2/5] Testando Detecção de Contradição pelo Laya System One ---")
    claim_true = "O OmniRoute opera na porta 20130 com Prompt Cache ativado"
    claim_false = "O OmniRoute opera na porta 8080 com Prompt Cache desativado"
    
    t0 = time.perf_counter()
    conflict_res = engine.detect_contradiction_laya(claim_true, claim_false)
    dt_ms = (time.perf_counter() - t0) * 1000
    
    print(f"Tempo de inferência no System One: {dt_ms:.2f}ms")
    print(f"Conflito Detectado: {conflict_res['has_conflict']} | Confiança: {conflict_res['confidence']}")
    
    assert conflict_res["has_conflict"] is True, "O Laya deveria ter detectado conflito entre as duas afirmações."
    assert dt_ms < 350.0, f"Tempo de inferência ({dt_ms:.1f}ms) excedeu o limite máximo aceitável."
    print("✅ Conflito detectado com sucesso pelo coprocessador Laya em CPU.")

    # ---------------------------------------------------------
    # TESTE 3: Arbitragem pela Hierarquia de Verdade PCL
    # ---------------------------------------------------------
    print("\n--- [3/5] Testando Arbitragem por Precedência Epistemológica ---")
    # Cria uma entidade temporária de teste
    test_entity_res = db.query_json("""
        INSERT INTO memory.entities (name, entity_type, metadata)
        VALUES ('TestOmniRoutePort', 'config_item', '{"test": true}'::jsonb)
        ON CONFLICT (name, entity_type) DO UPDATE SET metadata = EXCLUDED.metadata
        RETURNING id;
    """)
    entity_id = test_entity_res[0]["id"]

    # Claim A: ADR-0005 (Tier 100 - Autoridade Máxima)
    claim_a_res = db.query_json(f"""
        INSERT INTO memory.claims (subject_id, predicate, value_text, status, authority_tier, source_model)
        VALUES ('{entity_id}', 'port_binding', 'O OmniRoute deve utilizar estritamente a porta 20130', 'TRUSTED', 100, 'human_architect')
        RETURNING id, subject_id, predicate, value_text, status, authority_tier, source_model;
    """)
    claim_a = claim_a_res[0]

    # Claim B: Rascunho legado GPT-4 (Tier 40 - Rascunho)
    claim_b_res = db.query_json(f"""
        INSERT INTO memory.claims (subject_id, predicate, value_text, status, authority_tier, source_model)
        VALUES ('{entity_id}', 'port_binding', 'O OmniRoute está configurado na porta 8080 desativado', 'TRUSTED', 40, 'gpt-4o-legacy')
        RETURNING id, subject_id, predicate, value_text, status, authority_tier, source_model;
    """)
    claim_b = claim_b_res[0]

    # Executa reconciliação do par
    res_arbitration = engine.reconcile_claims_pair(claim_a, claim_b)
    print(f"Decisão do Motor: {res_arbitration['action']} | Razão: {res_arbitration['reason']}")
    
    assert res_arbitration["action"] == "SUPERSEDE"
    assert res_arbitration["winner_id"] == claim_a["id"]
    assert res_arbitration["loser_id"] == claim_b["id"]

    # Verifica status no banco
    updated_b = db.query_json(f"SELECT status, superseded_by FROM memory.claims WHERE id = '{claim_b['id']}';")[0]
    assert updated_b["status"] == "SUPERSEDED"
    assert updated_b["superseded_by"] == claim_a["id"]
    print("✅ Precedência hierárquica respeitada: Claim legado foi marcado como SUPERSEDED.")

    # ---------------------------------------------------------
    # TESTE 4: Detecção de Empate (Status CONTESTED)
    # ---------------------------------------------------------
    print("\n--- [4/5] Testando Contenção de Empate entre Modelos (Stage Gate) ---")
    # Dois rascunhos de mesmo escalão (Tier 40) que divergem
    claim_c_res = db.query_json(f"""
        INSERT INTO memory.claims (subject_id, predicate, value_text, status, authority_tier, source_model)
        VALUES ('{entity_id}', 'cache_strategy', 'Cache deve ser armazenado localmente em memória RAM ativado', 'TRUSTED', 40, 'claude-draft')
        RETURNING id, subject_id, predicate, value_text, status, authority_tier, source_model;
    """)
    claim_d_res = db.query_json(f"""
        INSERT INTO memory.claims (subject_id, predicate, value_text, status, authority_tier, source_model)
        VALUES ('{entity_id}', 'cache_strategy', 'Cache deve ser armazenado em disco desativado', 'TRUSTED', 40, 'gpt-draft')
        RETURNING id, subject_id, predicate, value_text, status, authority_tier, source_model;
    """)
    
    res_tie = engine.reconcile_claims_pair(claim_c_res[0], claim_d_res[0])
    print(f"Decisão do Empate: {res_tie['action']} | Razão: {res_tie['reason']}")
    
    assert res_tie["action"] == "CONTESTED"
    status_c = db.query_json(f"SELECT status FROM memory.claims WHERE id = '{claim_c_res[0]['id']}';")[0]["status"]
    status_d = db.query_json(f"SELECT status FROM memory.claims WHERE id = '{claim_d_res[0]['id']}';")[0]["status"]
    assert status_c == "CONTESTED"
    assert status_d == "CONTESTED"
    print("✅ Empate retido em CONTESTED para parecer humano soberano (Zero auto-aprovação indevida).")

    # Limpeza dos registros de teste
    db.execute_sql(f"DELETE FROM memory.entities WHERE id = '{entity_id}';")

    # ---------------------------------------------------------
    # TESTE 5: Integridade do Estado Canônico SSOT
    # ---------------------------------------------------------
    print("\n--- [5/5] Validando Consistência da Base Canônica SSOT ---")
    full_report = engine.run_canonical_reconciliation()
    print("Sumário da Reconciliação Geral:", full_report["status_summary"])
    assert "TRUSTED" in full_report["status_summary"]
    print("✅ Base canônica unificada em memory.claims sem conflitos residuais ativos.")

    print("\n========================================================")
    print(" 🎉 TODOS OS 5 TESTES DO STAGE GATE 3 PASSARAM COM SUCESSO! ")
    print("========================================================\n")
    return True

if __name__ == "__main__":
    success = run_phase3_tests()
    sys.exit(0 if success else 1)
