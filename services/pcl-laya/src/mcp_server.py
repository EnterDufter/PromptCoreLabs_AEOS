"""
PCL AEOS - Servidor MCP do Coprocessador LAYA (System One Classifier v2.0 — PROAA-14)
Permite que o Antigravity IDE e agentes usem o Laya como ferramenta nativa via MCP (Model Context Protocol).
Motor Neural Canônico: cross-encoder/nli-MiniLM-2-L6-H768 (ONNX INT8 / AVX2 | 0 MB VRAM)
"""

import sys
import os
from typing import List, Dict, Any

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from classifier import LayaClassifierEngine
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    name="PCL-LAYA-System-One",
    instructions=(
        "Coprocessador não-autoregressivo System One v2.0 (PROAA-14, ~1-35ms, 0 MB VRAM) com predict_batch vetorizado, "
        "SemanticLRUCache (<1ms), laya.Learner (771d + Conformal Prediction), detecção de contradições, "
        "match_intent, deduplicate_memory, verify_policy e lightning_council."
    )
)

engine = LayaClassifierEngine()


@mcp.tool()
def laya_health() -> Dict[str, Any]:
    """Retorna o status operacional detalhado ('healthy' vs 'degraded'), telemetria de cache LRU, learner 771d e 0 MB VRAM."""
    health_data = engine.get_health_status()
    health_data["mcp_server"] = "PCL-LAYA-System-One"
    return health_data


@mcp.tool()
def laya_evaluate_nli(premise: str, hypothesis: str) -> Dict[str, Any]:
    """
    Executa inferência neural direta de NLI (Natural Language Inference) usando cross-encoder/nli-MiniLM-2-L6-H768.
    Retorna probabilidades de contradiction, entailment e neutral, além do conjunto preditivo Conformal.
    """
    return engine.evaluate_nli(premise=premise, hypothesis=hypothesis)


@mcp.tool()
def laya_evaluate_binary(state: str, query: str, threshold: float = 0.60, allow_abstain: bool = False) -> Dict[str, Any]:
    """
    Executa avaliação binária ultra-rápida em CPU (~1-25ms) com validação neural, cache LRU (<1ms) e suporte a abstenção conformal.
    """
    return engine.evaluate_binary(state=state, query=query, threshold=threshold, allow_abstain=allow_abstain)


@mcp.tool()
def laya_check_contradiction(state: str, query: str, threshold: float = 0.60) -> Dict[str, Any]:
    """
    Especialização para detectar contradições semânticas diretas e discrepâncias entre o estado atual e uma especificação canônica.
    """
    test_query = f"contradiz: {query}"
    return engine.evaluate_binary(state=state, query=test_query, threshold=threshold)


@mcp.tool()
def laya_evaluate_choice(state: str, query: str, options: List[str]) -> Dict[str, Any]:
    """
    Seleciona deterministicamente ou semanticamente a melhor alternativa entre uma lista discreta de opções em lote único.
    """
    return engine.evaluate_choice(state=state, query=query, options=options)


@mcp.tool()
def laya_evaluate_score(state: str, query: str, min_val: float = 0.0, max_val: float = 1.0) -> Dict[str, Any]:
    """
    Calcula uma pontuação calibrada normalizada dentro de um intervalo numérico usando probabilidades neurais de NLI.
    """
    return engine.evaluate_score(state=state, query=query, min_val=min_val, max_val=max_val)


@mcp.tool()
def laya_evaluate_batch(state: str, questions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Executa um lote de avaliações mistas (binary, nli, choice, score) em alta velocidade.
    """
    return engine.evaluate_batch(state=state, questions=questions)


# ============================================================================
# 4 NOVAS PRIMITIVAS MCP — PROAA-14 (Seção 4.2)
# ============================================================================

@mcp.tool()
def laya_match_intent(state: str, intents: List[str], threshold: float = 0.65) -> Dict[str, Any]:
    """
    [PROAA-14] Avalia múltiplas intenções candidatas em 1 único predict_batch() em CPU (0 MB VRAM).
    Retorna matched_intent, confidence, scores_by_intent e abstain se abaixo do limiar.
    """
    return engine.match_intent(state=state, intents=intents, threshold=threshold)


@mcp.tool()
def laya_deduplicate_memory(
    candidate: str,
    existing_memories: List[str],
    entailment_threshold: float = 0.88,
    contradiction_threshold: float = 0.70
) -> Dict[str, Any]:
    """
    [PROAA-14] Compara uma memória candidata contra Top-K memórias existentes em 1 único predict_batch().
    Retorna action: 'insert' | 'merge_duplicate' | 'supersede_contradiction' | 'uncertain', target_index e nli_probs.
    """
    return engine.deduplicate_memory(
        candidate=candidate,
        existing_memories=existing_memories,
        entailment_threshold=entailment_threshold,
        contradiction_threshold=contradiction_threshold
    )


@mcp.tool()
def laya_verify_policy(state: str, policy_rules: List[str], threshold: float = 0.65) -> Dict[str, Any]:
    """
    [PROAA-14] Verifica conformidade de um estado/ação contra uma lista de regras normativas em 1 único predict_batch().
    Retorna compliant (bool), violated_rules e decision ('allow' | 'confirm' | 'deny').
    """
    return engine.verify_policy(state=state, policy_rules=policy_rules, threshold=threshold)


@mcp.tool()
def laya_lightning_council(state: str, checks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    [PROAA-14] Conselho Relâmpago: executa 5+ micro-avaliações heterogêneas (noul, verify_policy, match_intent, score)
    coalescendo todos os pares NLI em 1 único predict_batch() vetorizado e retorna circuit_breaker.skip_llm.
    """
    return engine.lightning_council(state=state, checks=checks)


if __name__ == "__main__":
    mcp.run()
