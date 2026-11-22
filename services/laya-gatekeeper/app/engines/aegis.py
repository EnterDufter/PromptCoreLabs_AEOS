"""
Motor PCL Aegis™ (PROAA-16) — Escudo de Segurança, DLP (PII/Secrets) & Conformidade ISO/IEC 42001.
Opera em modo FAIL-CLOSED: caso a Camada 2 (Laya) falhe ou exceda timeout após L1 inconclusiva,
bloqueia preventivamente (`BLOCK` ou `HITL_REQUIRED`).
"""

from __future__ import annotations

import time
from app.core.audit import generate_uuidv7, redact_full_content, write_audit_event
from app.layers.l1_deterministic import inspect_layer1_aegis
from app.layers.l2_laya import LayaLayer2UnavailableError, evaluate_layer2_aegis
from app.schemas.contracts import AegisInspectRequest, AegisInspectResponse, AuditReasoning


def run_aegis_inspection(req: AegisInspectRequest) -> AegisInspectResponse:
    t0 = time.perf_counter()
    event_id = generate_uuidv7()
    strict_mode = bool(req.context.strict_iso42001)

    # 1. Camada 1 Determinística (< 1 ms)
    l1 = inspect_layer1_aegis(req.content, strict_iso42001=strict_mode)
    if l1.matched:
        latency_ms = round((time.perf_counter() - t0) * 1000.0, 3)
        sanitized_span = write_audit_event(
            event_id=event_id,
            engine="PCL_AEGIS_PROAA16",
            tenant_id=req.tenant_id,
            session_id=req.session_id,
            agent_id=req.agent_id,
            verdict=l1.verdict,
            decision_source="LAYER1_DETERMINISTIC",
            rule_or_hypothesis_id=l1.rule_id,
            confidence_score=l1.confidence_score,
            violation_category=l1.violation_category,
            raw_content_for_hash=req.content,
            raw_span_for_sanitization=l1.matched_span,
            latency_ms=latency_ms,
            fallback_applied=False,
        )
        sanitized_body = redact_full_content(req.content) if l1.verdict in ("REDACT", "BLOCK") else None
        return AegisInspectResponse(
            event_id=event_id,
            verdict=l1.verdict,  # type: ignore[arg-type]
            decision_source="LAYER1_DETERMINISTIC",
            sanitized_content=sanitized_body,
            audit_reasoning=AuditReasoning(
                rule_or_hypothesis_id=l1.rule_id,
                confidence_score=l1.confidence_score,
                violation_category=l1.violation_category,
                extractive_span_sanitized=sanitized_span,
            ),
            latency_ms=latency_ms,
            fallback_applied=False,
        )

    # 2. Se L1 não encontrou ameaça e não requer L2 (ex: input curto benigno), a menos que simulate_laya_failure esteja ativo
    if not l1.needs_layer2 and not req.context.simulate_laya_failure:
        latency_ms = round((time.perf_counter() - t0) * 1000.0, 3)
        sanitized_span = write_audit_event(
            event_id=event_id,
            engine="PCL_AEGIS_PROAA16",
            tenant_id=req.tenant_id,
            session_id=req.session_id,
            agent_id=req.agent_id,
            verdict="ALLOW",
            decision_source="LAYER1_DETERMINISTIC",
            rule_or_hypothesis_id=l1.rule_id,
            confidence_score=l1.confidence_score,
            violation_category="none",
            raw_content_for_hash=req.content,
            raw_span_for_sanitization=l1.matched_span,
            latency_ms=latency_ms,
            fallback_applied=False,
        )
        return AegisInspectResponse(
            event_id=event_id,
            verdict="ALLOW",
            decision_source="LAYER1_DETERMINISTIC",
            sanitized_content=None,
            audit_reasoning=AuditReasoning(
                rule_or_hypothesis_id=l1.rule_id,
                confidence_score=l1.confidence_score,
                violation_category="none",
                extractive_span_sanitized=sanitized_span,
            ),
            latency_ms=latency_ms,
            fallback_applied=False,
        )

    # 3. Camada 2 Semântica (Laya System One CPU INT8) com Fallback FAIL-CLOSED
    try:
        l2 = evaluate_layer2_aegis(
            req.content,
            strict_iso42001=strict_mode,
            simulate_failure=req.context.simulate_laya_failure,
        )
        latency_ms = round((time.perf_counter() - t0) * 1000.0, 3)
        sanitized_span = write_audit_event(
            event_id=event_id,
            engine="PCL_AEGIS_PROAA16",
            tenant_id=req.tenant_id,
            session_id=req.session_id,
            agent_id=req.agent_id,
            verdict=l2.verdict,
            decision_source="LAYER2_LAYA",
            rule_or_hypothesis_id=l2.hypothesis_id,
            confidence_score=l2.confidence_score,
            violation_category=l2.violation_category,
            raw_content_for_hash=req.content,
            raw_span_for_sanitization=l2.matched_span,
            latency_ms=latency_ms,
            fallback_applied=False,
        )
        return AegisInspectResponse(
            event_id=event_id,
            verdict=l2.verdict,  # type: ignore[arg-type]
            decision_source="LAYER2_LAYA",
            sanitized_content=redact_full_content(req.content) if l2.verdict != "ALLOW" else None,
            audit_reasoning=AuditReasoning(
                rule_or_hypothesis_id=l2.hypothesis_id,
                confidence_score=l2.confidence_score,
                violation_category=l2.violation_category,
                extractive_span_sanitized=sanitized_span,
            ),
            latency_ms=latency_ms,
            fallback_applied=False,
        )
    except LayaLayer2UnavailableError:
        # FALLBACK FAIL-CLOSED: Nunca libera silenciosamente payload que exigiu Camada 2!
        latency_ms = round((time.perf_counter() - t0) * 1000.0, 3)
        fallback_verdict = "BLOCK" if strict_mode else "HITL_REQUIRED"
        sanitized_span = write_audit_event(
            event_id=event_id,
            engine="PCL_AEGIS_PROAA16",
            tenant_id=req.tenant_id,
            session_id=req.session_id,
            agent_id=req.agent_id,
            verdict=fallback_verdict,
            decision_source="FALLBACK_FAIL_CLOSED",
            rule_or_hypothesis_id="AEGIS-FALLBACK-FAIL-CLOSED",
            confidence_score=1.0,
            violation_category="laya_layer2_unavailable_fail_closed",
            raw_content_for_hash=req.content,
            raw_span_for_sanitization=req.content[:90],
            latency_ms=latency_ms,
            fallback_applied=True,
        )
        return AegisInspectResponse(
            event_id=event_id,
            verdict=fallback_verdict,  # type: ignore[arg-type]
            decision_source="FALLBACK_FAIL_CLOSED",
            sanitized_content=redact_full_content(req.content),
            audit_reasoning=AuditReasoning(
                rule_or_hypothesis_id="AEGIS-FALLBACK-FAIL-CLOSED",
                confidence_score=1.0,
                violation_category="laya_layer2_unavailable_fail_closed",
                extractive_span_sanitized=sanitized_span,
            ),
            latency_ms=latency_ms,
            fallback_applied=True,
        )
