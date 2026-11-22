"""
FastAPI Sidecar Out-of-Band para Laya Security (PCL Aegis PROAA-16) & FinOps (Cortex Reflex PROAA-15).
Invariante de Hardware: 100% CPU (0 MB VRAM na GPU dedicada RTX 3050).
"""

from __future__ import annotations

from fastapi import Depends, FastAPI
from app.config import settings
from app.core.auth import verify_m2m_authentication
from app.engines.aegis import run_aegis_inspection
from app.engines.reflex import run_reflex_step_check
from app.layers.l2_laya import is_laya_layer2_ready
from app.schemas.contracts import (
    AegisInspectRequest,
    AegisInspectResponse,
    GatekeeperHealthResponse,
    ReflexCheckStepRequest,
    ReflexCheckStepResponse,
)

app = FastAPI(
    title="PCL AEOS — Laya Security & FinOps Gatekeeper Sidecar",
    description="PROAA-15 (Cortex Reflex) & PROAA-16 (PCL Aegis) Out-of-Band Gatekeeper (0 MB VRAM)",
    version=settings.service_version,
)


@app.get("/health", response_model=GatekeeperHealthResponse)
async def health_check() -> GatekeeperHealthResponse:
    policies = []
    if settings.iso42001_policy_path.exists():
        policies.append("iso42001_baseline.yaml")
    if settings.reflex_policy_path.exists():
        policies.append("reflex_thresholds.yaml")
    return GatekeeperHealthResponse(
        status="healthy",
        service=settings.service_name,
        version=settings.service_version,
        vram_allocated_mb=0,
        execution_provider="CPUExecutionProvider",
        laya_layer2_ready=is_laya_layer2_ready(),
        policies_loaded=policies,
    )


@app.post(
    "/v1/aegis/inspect",
    response_model=AegisInspectResponse,
    dependencies=[Depends(verify_m2m_authentication)],
)
async def aegis_inspect(payload: AegisInspectRequest) -> AegisInspectResponse:
    return run_aegis_inspection(payload)


@app.post(
    "/v1/reflex/check-step",
    response_model=ReflexCheckStepResponse,
    dependencies=[Depends(verify_m2m_authentication)],
)
async def reflex_check_step(payload: ReflexCheckStepRequest) -> ReflexCheckStepResponse:
    return run_reflex_step_check(payload)
