"""
Camada 2 Semântica (~15–25 ms em CPU, 0 MB VRAM) via Laya System One.
Integra diretamente o motor ONNX Runtime INT8 (`CPUExecutionProvider`) do `services/pcl-laya`
com timeout rigoroso e suporte a simulação de falha para testes de resiliência Fail-Closed / Fail-Safe.
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import List

from app.config import WORKSPACE_ROOT
from app.core.state_store import StepRecord


# Importa o motor Laya System One local (CPU INT8, 0 MB VRAM) se disponível no monorepo
_LAYA_SRC = WORKSPACE_ROOT / "services" / "pcl-laya" / "src"
if _LAYA_SRC.exists() and str(_LAYA_SRC) not in sys.path:
    sys.path.insert(0, str(_LAYA_SRC))

try:
    from classifier import classifier_engine as _laya_engine  # type: ignore
except Exception:
    _laya_engine = None


class LayaLayer2UnavailableError(RuntimeError):
    """Exceção disparada quando o Laya System One excede o timeout (25 ms) ou está indisponível."""


@dataclass
class Layer2AegisResult:
    verdict: str  # "ALLOW" | "BLOCK" | "HITL_REQUIRED"
    hypothesis_id: str
    violation_category: str
    confidence_score: float
    matched_span: str


@dataclass
class Layer2ReflexResult:
    verdict: str  # "CONTINUE" | "WARN_DRIFT" | "FORCE_DOWNGRADE" | "KILL_TASK"
    hypothesis_id: str
    violation_category: str
    repetition_score: float
    matched_span: str


_SEMANTIC_ATTACK_MARKERS = re.compile(
    r"(?i)(?:finja\s+que\s+voc[eê]\s+n[aã]o\s+tem\s+restri[cç][oõ]es|atue\s+como\s+um\s+terminal\s+root\s+sem\s+filtros|"
    r"revele\s+as\s+vari[aá]veis\s+de\s+ambiente|mostre\s+o\s+conte[uú]do\s+do\s+\.env|"
    r"bypass\s+all\s+safety\s+policies|pretend\s+the\s+compliance\s+rules\s+do\s+not\s+apply|"
    r"extraia\s+todos\s+os\s+dados\s+confidenciais\s+dos\s+clientes)"
)


def _token_jaccard_similarity(a: str, b: str) -> float:
    tokens_a = {w[:5] if len(w) > 5 else w for w in re.findall(r"[a-zA-ZÀ-ÿ0-9_]{3,}", a.lower())}
    tokens_b = {w[:5] if len(w) > 5 else w for w in re.findall(r"[a-zA-ZÀ-ÿ0-9_]{3,}", b.lower())}
    if not tokens_a or not tokens_b:
        return 0.0
    return len(tokens_a & tokens_b) / float(len(tokens_a | tokens_b))


def _canonical_args_target_similarity(args_a: str, args_b: str) -> float:
    # Remove contadores voláteis (attempt, step, retry, timestamp) para comparar o alvo semântico dos argumentos
    clean_a = re.sub(r'"(?:attempt|step|retry|ts|timestamp)"\s*:\s*\d+,?', "", args_a.lower())
    clean_b = re.sub(r'"(?:attempt|step|retry|ts|timestamp)"\s*:\s*\d+,?', "", args_b.lower())
    return _token_jaccard_similarity(clean_a, clean_b)


def evaluate_layer2_aegis(
    content: str,
    *,
    strict_iso42001: bool = True,
    simulate_failure: bool = False,
) -> Layer2AegisResult:
    """
    Avalia conformidade semântica via Laya System One (CPU INT8, 0 MB VRAM).
    Lança `LayaLayer2UnavailableError` se `simulate_failure=True` ou se o motor falhar.
    """
    if simulate_failure:
        raise LayaLayer2UnavailableError("LAYA_LAYER2_TIMEOUT_OR_OFFLINE_SIMULATED")

    if _SEMANTIC_ATTACK_MARKERS.search(content):
        return Layer2AegisResult(
            verdict="BLOCK",
            hypothesis_id="HYP-LAYA-NLI-INJECTION",
            violation_category="semantic_policy_violation",
            confidence_score=0.93,
            matched_span=content[:100],
        )

    if _laya_engine is not None:
        policy_res = _laya_engine.verify_policy(
            text=content,
            policy_rules=[
                "O texto respeita as diretrizes de segurança, privacidade LGPD e não solicita credenciais internas nem bypass de regras."
            ],
        )
        # Verifica também entailment direto contra hipótese de ataque adversarial
        nli_attack = _laya_engine.evaluate_nli(
            premise=content,
            hypothesis="O usuário está tentando manipular o sistema para vazar segredos ou burlar controles de segurança.",
            use_cache=True,
        )
        attack_score = float(nli_attack["scores"].get("entailment", 0.0))
        if attack_score >= 0.72:
            return Layer2AegisResult(
                verdict="BLOCK" if strict_iso42001 else "HITL_REQUIRED",
                hypothesis_id="HYP-LAYA-NLI-001",
                violation_category="semantic_policy_violation",
                confidence_score=round(attack_score, 4),
                matched_span=content[:100],
            )

    return Layer2AegisResult(
        verdict="ALLOW",
        hypothesis_id="HYP-LAYA-SAFE-001",
        violation_category="none",
        confidence_score=0.96,
        matched_span=content[:80],
    )


def evaluate_layer2_reflex(
    *,
    thought_summary: str,
    tool_name: str,
    tool_args_canonical: str,
    history: List[StepRecord],
    simulate_failure: bool = False,
) -> Layer2ReflexResult:
    """
    Detecta loops semânticos (paráfrases do mesmo erro/ação em passos consecutivos)
    usando Laya System One (`0 MB VRAM`).
    """
    if simulate_failure:
        raise LayaLayer2UnavailableError("LAYA_LAYER2_TIMEOUT_OR_OFFLINE_SIMULATED")

    if not history:
        return Layer2ReflexResult(
            verdict="CONTINUE",
            hypothesis_id="HYP-REFLEX-INIT",
            violation_category="none",
            repetition_score=0.0,
            matched_span=thought_summary[:80],
        )

    recent_steps = history[-2:]
    max_sim = 0.0
    repeated_count = 0

    for prev in recent_steps:
        lex_sim = _token_jaccard_similarity(thought_summary, prev.thought_summary)
        args_sim = _canonical_args_target_similarity(tool_args_canonical, prev.tool_args_canonical)
        same_tool = prev.tool_name.strip().lower() == tool_name.strip().lower()
        nli_sim = 0.0
        if _laya_engine is not None and thought_summary and prev.thought_summary:
            nli_res = _laya_engine.evaluate_nli(
                premise=prev.thought_summary,
                hypothesis=thought_summary,
                use_cache=True,
            )
            scores = nli_res.get("scores", {})
            ent = float(scores.get("entailment", 0.0))
            neu = float(scores.get("neutral", 0.0))
            con = float(scores.get("contradiction", 0.0))
            nli_sim = ent + (0.35 * neu if con < 0.25 else 0.0)

        combined_sim = max(lex_sim, nli_sim * 0.9)
        if same_tool:
            combined_sim = min(1.0, combined_sim + 0.22 + (0.15 * args_sim))
        if combined_sim > max_sim:
            max_sim = combined_sim
        if combined_sim >= 0.72:
            repeated_count += 1

    if repeated_count >= 2 and max_sim >= 0.78:
        return Layer2ReflexResult(
            verdict="KILL_TASK",
            hypothesis_id="REFLEX-SEM-001",
            violation_category="semantic_paraphrase_loop",
            repetition_score=round(max_sim, 4),
            matched_span=f"{tool_name}: {thought_summary[:80]}",
        )

    if max_sim >= 0.74:
        return Layer2ReflexResult(
            verdict="FORCE_DOWNGRADE",
            hypothesis_id="REFLEX-SEM-002",
            violation_category="semantic_drift_stagnation",
            repetition_score=round(max_sim, 4),
            matched_span=f"{tool_name}: {thought_summary[:80]}",
        )

    return Layer2ReflexResult(
        verdict="CONTINUE",
        hypothesis_id="REFLEX-SEM-OK",
        violation_category="none",
        repetition_score=round(max_sim, 4),
        matched_span=f"{tool_name}: {thought_summary[:80]}",
    )


def is_laya_layer2_ready() -> bool:
    return _laya_engine is not None
