"""
PCL AEOS - Microserviço pcl-laya (v2.0.0 — PROAA-14 System One Lab)
Conformidade: SPEC-PCL-AEOS-CLASSIFIER-01, SPEC-PCL-AEOS-MEMORY-03 & PROAA-14
Motor Neural Canônico: cross-encoder/nli-MiniLM-2-L6-H768 (ONNX INT8 / AVX2)
Porta: 20140 (Rede interna Docker aeos-net) | Invariante: 0 MB VRAM (CPUExecutionProvider)
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from classifier import (
    LayaClassifierEngine,
    NLIEvaluationRequest,
    BinaryEvaluationRequest,
    ChoiceEvaluationRequest,
    ScoreEvaluationRequest,
    BatchEvaluationRequest,
    SystemOneRequest
)

engine = LayaClassifierEngine()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await engine.scheduler.start()
    try:
        yield
    finally:
        await engine.scheduler.stop()


app = FastAPI(
    title="PCL AEOS System One Classifier (Laya v2.0 PROAA-14)",
    description=(
        "Coprocessador não-autoregressivo System One (~1-35ms) com inferência neural NLI vetorizada "
        "(predict_batch + Length-Bucketing), SemanticLRUCache (<1ms), laya.Learner (771d + Conformal Prediction) "
        "e 0 MB VRAM em CPU."
    ),
    version="2.0.0",
    lifespan=lifespan
)


class UnifiedEvaluateRequest(BaseModel):
    state: str
    query: str
    mode: str = "binary"  # 'binary', 'nli', 'choice', 'score'
    options: Optional[List[str]] = None
    min_val: Optional[float] = 0.0
    max_val: Optional[float] = 1.0
    threshold: Optional[float] = 0.60
    allow_abstain: Optional[bool] = False


@app.get("/health")
def health():
    """Retorna o estado de saúde do Laya ('healthy' vs 'degraded'), telemetria de cache LRU, learner 771d e 0 MB VRAM."""
    return engine.get_health_status()


@app.get("/ready")
@app.get("/readiness")
def readiness():
    health_info = engine.get_health_status()
    require_neural = os.environ.get("LAYA_REQUIRE_NEURAL", "0") in ("1", "true", "True")
    if require_neural and health_info["status"] != "healthy":
        raise HTTPException(
            status_code=503,
            detail={
                "message": "Coprocessador Laya em modo degradado; motor neural obrigatório não disponível.",
                "health": health_info
            }
        )
    return health_info


@app.post("/v1/systemone")
async def evaluate_systemone_endpoint(req: SystemOneRequest):
    """
    Contrato Unificado PROAA-14:
    Suporta mode in ['council', 'choice', 'score', 'noul', 'match_intent', 'deduplicate_memory', 'verify_policy'].
    """
    try:
        return engine.evaluate_systemone(req)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))


@app.post("/v1/classifier/evaluate")
def evaluate_unified(req: UnifiedEvaluateRequest):
    if req.mode == "binary":
        return engine.evaluate_binary(req.state, req.query, req.threshold or 0.60, req.allow_abstain or False)
    elif req.mode == "nli":
        return engine.evaluate_nli(premise=req.state, hypothesis=req.query)
    elif req.mode == "choice":
        if not req.options:
            raise HTTPException(status_code=400, detail="Modo 'choice' requer o campo 'options'.")
        return engine.evaluate_choice(req.state, req.query, req.options)
    elif req.mode == "score":
        return engine.evaluate_score(req.state, req.query, req.min_val or 0.0, req.max_val or 1.0)
    else:
        raise HTTPException(status_code=400, detail=f"Modo inválido: {req.mode}. Use 'binary', 'nli', 'choice' ou 'score'.")


@app.post("/v1/classifier/evaluate/nli")
def evaluate_nli(req: NLIEvaluationRequest):
    return engine.evaluate_nli(req.premise, req.hypothesis)


@app.post("/v1/classifier/evaluate/binary")
def evaluate_binary(req: BinaryEvaluationRequest):
    return engine.evaluate_binary(req.state, req.query, req.threshold or 0.60, req.allow_abstain or False)


@app.post("/v1/classifier/evaluate/choice")
def evaluate_choice(req: ChoiceEvaluationRequest):
    return engine.evaluate_choice(req.state, req.query, req.options)


@app.post("/v1/classifier/evaluate/score")
def evaluate_score(req: ScoreEvaluationRequest):
    return engine.evaluate_score(req.state, req.query, req.min_val, req.max_val)


@app.post("/v1/classifier/evaluate/batch")
def evaluate_batch(req: BatchEvaluationRequest):
    return engine.evaluate_batch(req.state, req.questions)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 20140))
    uvicorn.run(app, host="0.0.0.0", port=port)
