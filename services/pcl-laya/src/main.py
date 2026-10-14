"""
PCL AEOS - Microserviço pcl-laya
Conformidade: SPEC-PCL-AEOS-CLASSIFIER-01 & SPEC-PCL-AEOS-MEMORY-03
Porta: 20140 (Rede interna Docker aeos-net)
"""

import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from classifier import (
    LayaClassifierEngine,
    BinaryEvaluationRequest,
    ChoiceEvaluationRequest,
    ScoreEvaluationRequest,
    BatchEvaluationRequest
)

app = FastAPI(
    title="PCL AEOS System One Classifier (Laya)",
    description="Coprocessador não-autoregressivo de alta velocidade (~35ms) para decisões tipadas em CPU.",
    version="1.0.0"
)

engine = LayaClassifierEngine()

class UnifiedEvaluateRequest(BaseModel):
    state: str
    query: str
    mode: str = "binary" # 'binary', 'choice', 'score'
    options: Optional[List[str]] = None
    min_val: Optional[float] = 0.0
    max_val: Optional[float] = 1.0

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "pcl-laya",
        "version": "1.0.0",
        "execution_provider": "CPUExecutionProvider",
        "vram_allocated_mb": 0,
        "conformance": ["SPEC-PCL-AEOS-CLASSIFIER-01", "SPEC-PCL-AEOS-MEMORY-03"]
    }

@app.post("/v1/classifier/evaluate")
def evaluate_unified(req: UnifiedEvaluateRequest):
    if req.mode == "binary":
        return engine.evaluate_binary(req.state, req.query)
    elif req.mode == "choice":
        if not req.options:
            raise HTTPException(status_code=400, detail="Modo 'choice' requer o campo 'options'.")
        return engine.evaluate_choice(req.state, req.query, req.options)
    elif req.mode == "score":
        return engine.evaluate_score(req.state, req.query, req.min_val or 0.0, req.max_val or 1.0)
    else:
        raise HTTPException(status_code=400, detail=f"Modo inválido: {req.mode}. Use 'binary', 'choice' ou 'score'.")

@app.post("/v1/classifier/evaluate/binary")
def evaluate_binary(req: BinaryEvaluationRequest):
    return engine.evaluate_binary(req.state, req.query)

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
