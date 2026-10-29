"""
PCL AEOS - Microserviço pcl-laya
Conformidade: SPEC-PCL-AEOS-CLASSIFIER-01 & SPEC-PCL-AEOS-MEMORY-03
Motor Neural Canônico: cross-encoder/nli-MiniLM-2-L6-H768 (ONNX INT8 / AVX2)
Porta: 20140 (Rede interna Docker aeos-net)
"""

import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from classifier import (
    LayaClassifierEngine,
    NLIEvaluationRequest,
    BinaryEvaluationRequest,
    ChoiceEvaluationRequest,
    ScoreEvaluationRequest,
    BatchEvaluationRequest
)

app = FastAPI(
    title="PCL AEOS System One Classifier (Laya)",
    description="Coprocessador não-autoregressivo de alta velocidade (~20-35ms) com inferência neural NLI (cross-encoder/nli-MiniLM-2-L6-H768 ONNX INT8) em CPU com 0 MB VRAM e telemetria observável.",
    version="1.2.0"
)

engine = LayaClassifierEngine()

class UnifiedEvaluateRequest(BaseModel):
    state: str
    query: str
    mode: str = "binary" # 'binary', 'nli', 'choice', 'score'
    options: Optional[List[str]] = None
    min_val: Optional[float] = 0.0
    max_val: Optional[float] = 1.0
    threshold: Optional[float] = 0.60
    allow_abstain: Optional[bool] = False

@app.get("/health")
def health():
    """Retorna o estado de saúde do Laya ('healthy' vs 'degraded') com rastreabilidade de commit e telemetria."""
    return engine.get_health_status()

@app.get("/ready")
@app.get("/readiness")
def readiness():
    """
    Readiness probe do Laya.
    Se a variável LAYA_REQUIRE_NEURAL=1 estiver ativa e o serviço estiver em fallback,
    retorna HTTP 503 (Service Unavailable) para impedir roteamento em ambientes de produção estrita.
    """
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
