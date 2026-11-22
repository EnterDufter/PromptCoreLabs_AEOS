"""
Motor Cortex Reflex (PROAA-15) — Disjuntor Cognitivo & FinOps para Loops de Agentes.
Opera em modo FAIL-SAFE: caso a Camada 2 (Laya) falhe ou exceda timeout,
aplica estritamente o disjuntor determinístico da Camada 1 (`max_steps` e `3` hashes canônicos idênticos).
"""

from __future__ import annotations

import time
from app.config import settings
from app.core.audit import generate_uuidv7, write_audit_event
from app.core.state_store import StepRecord, state_store
from app.layers.l1_deterministic import inspect_layer1_reflex
from app.layers.l2_laya import LayaLayer2UnavailableError, evaluate_layer2_reflex
from app.schemas.contracts import (
    ReflexAuditReasoning,
    ReflexCheckStepRequest,
    ReflexCheckStepResponse,
)


def run_reflex_step_check(req: ReflexCheckStepRequest) -> ReflexCheckStepResponse:
    t0 = time.perf_counter()
    event_id = generate_uuidv7()
    history = state_store.get_history(req.tenant_id, req.session_id)

    # 1. Camada 1 Determinística (< 1 ms): Hash canônico de tool call + max_steps
    l1 = inspect_layer1_reflex(
        step_index=req.step_index,
        max_steps=req.budget.max_steps,
        tool_name=req.current_step.tool_name,
        tool_args_canonical=req.current_step.tool_args_canonical,
        observation_hash=req.current_step.observation_hash,
        history=history,
        max_consecutive_identical=settings.max_consecutive_identical_hashes,
    )

    step_record = StepRecord(
        step_index=req.step_index,
        tool_name=req.current_step.tool_name,
        tool_args_canonical=req.current_step.tool_args_canonical,
        canonical_hash=l1.canonical_hash,
        thought_summary=req.current_step.thought_summary,
        observation_hash=req.current_step.observation_hash,
    )
    state_store.record_step(req.tenant_id, req.session_id, step_record)

    raw_step_repr = (
        f"step={req.step_index}|tool={req.current_step.tool_name}|"
        f"args={req.current_step.tool_args_canonical}|thought={req.current_step.thought_summary}"
    )

    if l1.matched:
        latency_ms = round((time.perf_counter() - t0) * 1000.0, 3)
        saved_usd = round(max(0.0, req.budget.limit_usd - req.budget.spent_usd) or settings.estimated_cost_per_loop_usd, 4)
        sanitized_span = write_audit_event(
            event_id=event_id,
            engine="CORTEX_REFLEX_PROAA15",
            tenant_id=req.tenant_id,
            session_id=req.session_id,
            agent_id=req.agent_id,
            verdict=l1.verdict,
            decision_source="LAYER1_DETERMINISTIC",
            rule_or_hypothesis_id=l1.rule_id,
            confidence_score=1.0,
            violation_category=l1.violation_category,
            raw_content_for_hash=raw_step_repr,
            raw_span_for_sanitization=f"{req.current_step.tool_name}({req.current_step.tool_args_canonical})",
            latency_ms=latency_ms,
            fallback_applied=False,
        )
        return ReflexCheckStepResponse(
            event_id=event_id,
            verdict="KILL_TASK",
            decision_source="LAYER1_DETERMINISTIC",
            loop_detected=True,
            repetition_score=l1.repetition_score,
            recommended_action="ABORT_EXECUTION_AND_ESCALATE_TO_OPERATOR",
            estimated_cost_saved_usd=saved_usd,
            audit_reasoning=ReflexAuditReasoning(
                rule_or_hypothesis_id=l1.rule_id,
                confidence_score=1.0,
                violation_category=l1.violation_category,
                extractive_span_sanitized=sanitized_span,
            ),
            latency_ms=latency_ms,
            fallback_applied=False,
        )

    # 2. Camada 2 Semântica (Laya System One CPU INT8) com Fallback FAIL-SAFE
    try:
        l2 = evaluate_layer2_reflex(
            thought_summary=req.current_step.thought_summary,
            tool_name=req.current_step.tool_name,
            tool_args_canonical=req.current_step.tool_args_canonical,
            history=history,
            simulate_failure=req.simulate_laya_failure,
        )
        latency_ms = round((time.perf_counter() - t0) * 1000.0, 3)
        loop_detected = l2.verdict in ("KILL_TASK", "FORCE_DOWNGRADE")
        saved_usd = (
            round(max(0.0, req.budget.limit_usd - req.budget.spent_usd) or settings.estimated_cost_per_loop_usd, 4)
            if loop_detected
            else 0.0
        )
        rec_action = (
            "ABORT_SEMANTIC_LOOP_AND_SAVE_BUDGET"
            if l2.verdict == "KILL_TASK"
            else ("DOWNGRADE_TO_LOCAL_OLLAMA_QWEN" if l2.verdict == "FORCE_DOWNGRADE" else "PROCEED_NEXT_STEP")
        )
        sanitized_span = write_audit_event(
            event_id=event_id,
            engine="CORTEX_REFLEX_PROAA15",
            tenant_id=req.tenant_id,
            session_id=req.session_id,
            agent_id=req.agent_id,
            verdict=l2.verdict,
            decision_source="LAYER2_LAYA",
            rule_or_hypothesis_id=l2.hypothesis_id,
            confidence_score=max(0.5, l2.repetition_score if loop_detected else 0.95),
            violation_category=l2.violation_category,
            raw_content_for_hash=raw_step_repr,
            raw_span_for_sanitization=l2.matched_span,
            latency_ms=latency_ms,
            fallback_applied=False,
        )
        return ReflexCheckStepResponse(
            event_id=event_id,
            verdict=l2.verdict,  # type: ignore[arg-type]
            decision_source="LAYER2_LAYA",
            loop_detected=loop_detected,
            repetition_score=l2.repetition_score,
            recommended_action=rec_action,
            estimated_cost_saved_usd=saved_usd,
            audit_reasoning=ReflexAuditReasoning(
                rule_or_hypothesis_id=l2.hypothesis_id,
                confidence_score=max(0.5, l2.repetition_score if loop_detected else 0.95),
                violation_category=l2.violation_category,
                extractive_span_sanitized=sanitized_span,
            ),
            latency_ms=latency_ms,
            fallback_applied=False,
        )
    except LayaLayer2UnavailableError:
        # FALLBACK FAIL-SAFE: Opera com o disjuntor determinístico L1 (que já aprovou este passo pois < max_steps e < 3 hashes)
        latency_ms = round((time.perf_counter() - t0) * 1000.0, 3)
        sanitized_span = write_audit_event(
            event_id=event_id,
            engine="CORTEX_REFLEX_PROAA15",
            tenant_id=req.tenant_id,
            session_id=req.session_id,
            agent_id=req.agent_id,
            verdict="CONTINUE",
            decision_source="FALLBACK_FAIL_SAFE",
            rule_or_hypothesis_id="REFLEX-FALLBACK-FAIL-SAFE",
            confidence_score=0.9,
            violation_category="laya_layer2_unavailable_fail_safe_l1_enforced",
            raw_content_for_hash=raw_step_repr,
            raw_span_for_sanitization=f"{req.current_step.tool_name}: {req.current_step.thought_summary[:80]}",
            latency_ms=latency_ms,
            fallback_applied=True,
        )
        return ReflexCheckStepResponse(
            event_id=event_id,
            verdict="CONTINUE",
            decision_source="FALLBACK_FAIL_SAFE",
            loop_detected=False,
            repetition_score=l1.repetition_score,
            recommended_action="PROCEED_UNDER_L1_DETERMINISTIC_CIRCUIT_BREAKER",
            estimated_cost_saved_usd=0.0,
            audit_reasoning=ReflexAuditReasoning(
                rule_or_hypothesis_id="REFLEX-FALLBACK-FAIL-SAFE",
                confidence_score=0.9,
                violation_category="laya_layer2_unavailable_fail_safe_l1_enforced",
                extractive_span_sanitized=sanitized_span,
            ),
            latency_ms=latency_ms,
            fallback_applied=True,
        )
