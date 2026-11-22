"""Contratos Pydantic v2 para PCL Aegis (PROAA-16) e Cortex Reflex (PROAA-15)."""

from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field


AegisDirection = Literal["input", "output", "tool_call", "rag_chunk"]
AegisVerdict = Literal["ALLOW", "BLOCK", "REDACT", "HITL_REQUIRED"]
DecisionSource = Literal["LAYER1_DETERMINISTIC", "LAYER2_LAYA", "FALLBACK_FAIL_CLOSED", "FALLBACK_FAIL_SAFE"]
ReflexVerdict = Literal["CONTINUE", "WARN_DRIFT", "FORCE_DOWNGRADE", "KILL_TASK"]


class AegisContext(BaseModel):
    user_role: str = Field(default="operator")
    strict_iso42001: bool = Field(default=True)
    simulate_laya_failure: bool = Field(default=False)


class AegisInspectRequest(BaseModel):
    tenant_id: str = Field(..., min_length=1)
    session_id: str = Field(..., min_length=1)
    agent_id: str = Field(..., min_length=1)
    direction: AegisDirection = Field(default="input")
    content: str = Field(..., min_length=1)
    policy_profile: str = Field(default="iso42001_baseline")
    context: AegisContext = Field(default_factory=AegisContext)


class AuditReasoning(BaseModel):
    rule_or_hypothesis_id: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    violation_category: str
    extractive_span_sanitized: str = Field(..., max_length=120)
    iso42001_control_ref: str = Field(default="ISO/IEC 42001 A.6.2.6 & LGPD Art. 46")


class AegisInspectResponse(BaseModel):
    event_id: str
    verdict: AegisVerdict
    decision_source: DecisionSource
    sanitized_content: Optional[str] = None
    audit_reasoning: AuditReasoning
    latency_ms: float
    fallback_applied: bool = False


class ReflexStepPayload(BaseModel):
    thought_summary: str = Field(default="")
    tool_name: str = Field(default="")
    tool_args_canonical: str = Field(default="{}")
    observation_hash: str = Field(default="")


class ReflexBudget(BaseModel):
    max_steps: int = Field(default=15, ge=1)
    spent_usd: float = Field(default=0.0, ge=0.0)
    limit_usd: float = Field(default=1.0, ge=0.0)


class ReflexCheckStepRequest(BaseModel):
    tenant_id: str = Field(..., min_length=1)
    session_id: str = Field(..., min_length=1)
    agent_id: str = Field(..., min_length=1)
    step_index: int = Field(..., ge=1)
    current_step: ReflexStepPayload
    budget: ReflexBudget = Field(default_factory=ReflexBudget)
    simulate_laya_failure: bool = Field(default=False)


class ReflexAuditReasoning(BaseModel):
    rule_or_hypothesis_id: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    violation_category: str
    extractive_span_sanitized: str = Field(..., max_length=120)


class ReflexCheckStepResponse(BaseModel):
    event_id: str
    verdict: ReflexVerdict
    decision_source: DecisionSource
    loop_detected: bool
    repetition_score: float = Field(..., ge=0.0, le=1.0)
    recommended_action: str
    estimated_cost_saved_usd: float = Field(default=0.0, ge=0.0)
    audit_reasoning: ReflexAuditReasoning
    latency_ms: float
    fallback_applied: bool = False


class GatekeeperHealthResponse(BaseModel):
    status: str = "healthy"
    service: str = "laya-gatekeeper"
    version: str = "1.0.0"
    vram_allocated_mb: int = 0
    execution_provider: str = "CPUExecutionProvider"
    laya_layer2_ready: bool = True
    policies_loaded: List[str] = Field(default_factory=list)
