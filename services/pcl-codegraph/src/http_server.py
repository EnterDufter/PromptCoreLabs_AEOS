"""
PCL AEOS — Servidor HTTP FastAPI do Adaptador Hexagonal PCL Code Graph Port (:20150)
Conformidade: SPEC-PCL-AEOS-CODEGRAPH-04, Marco M5 & AGENTS.md
Invariantes: 100% CPU (--no-llm / AST determinístico) | 0 MB VRAM | Non-Root Container Ready
"""

import os
import sys
import time
from typing import Any, Dict

from fastapi import FastAPI
from pydantic import BaseModel, Field

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from engine import PCLCodeGraphEngine

app = FastAPI(
    title="PCL Code Graph Port HTTP Service",
    version="1.0.0",
    description=(
        "Serviço HTTP containerizado (:20150) do Adaptador Hexagonal PCL Code Graph Port. "
        "Opera 100% em CPU (--no-llm / AST determinístico, 0 MB VRAM, $0.00)."
    ),
)

engine = PCLCodeGraphEngine()
STARTED_AT = time.time()


class IndexRequest(BaseModel):
    module_name: str = Field(default="all", description="Subgrafo alvo: all, cockpit, laya, omniroute, paperclip")
    incremental: bool = Field(default=True, description="Reindexar apenas quando SHA-256 divergir")


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Termo ou símbolo para busca estrutural no AST")
    module_name: str = Field(default="cockpit")
    max_hops: int = Field(default=2, ge=1, le=5)
    token_budget: int = Field(default=1500, ge=200, le=8000)


class ImpactRadiusRequest(BaseModel):
    symbol_or_file: str = Field(..., min_length=1, description="Arquivo ou símbolo alvo para cálculo de blast radius")
    module_name: str = Field(default="cockpit")
    depth: int = Field(default=2, ge=1, le=5)


class GodNodesRequest(BaseModel):
    module_name: str = Field(default="all")
    top_k: int = Field(default=5, ge=1, le=25)


class FreshnessRequest(BaseModel):
    module_name: str = Field(default="all")


@app.get("/health")
@app.get("/ready")
def health_check() -> Dict[str, Any]:
    freshness = engine.codegraph_check_freshness(module_key="all")
    return {
        "status": "ok",
        "is_ready": True,
        "service": "pcl-codegraph",
        "port": int(os.environ.get("CODEGRAPH_PORT", "20150")),
        "engine_mode": "deterministic_ast_no_llm",
        "execution_provider": "CPUExecutionProvider",
        "vram_allocated_mb": 0,
        "marginal_cost_usd": 0.0,
        "uptime_seconds": round(time.time() - STARTED_AT, 2),
        "freshness_summary": freshness.get("overall_status", "TRUSTED"),
        "modules": list(engine.modules.keys()),
    }


@app.post("/v1/codegraph/index")
def http_codegraph_index(req: IndexRequest) -> Dict[str, Any]:
    return engine.codegraph_index(module_key=req.module_name, incremental=req.incremental)


@app.post("/v1/codegraph/query")
def http_codegraph_query(req: QueryRequest) -> Dict[str, Any]:
    return engine.codegraph_query(
        query=req.query,
        module_key=req.module_name,
        max_hops=req.max_hops,
        token_budget=req.token_budget,
    )


@app.post("/v1/codegraph/impact_radius")
def http_codegraph_impact_radius(req: ImpactRadiusRequest) -> Dict[str, Any]:
    return engine.codegraph_impact_radius(
        symbol_or_file=req.symbol_or_file,
        module_key=req.module_name,
        depth=req.depth,
    )


@app.post("/v1/codegraph/god_nodes")
def http_codegraph_god_nodes(req: GodNodesRequest) -> Dict[str, Any]:
    return engine.codegraph_god_nodes(module_key=req.module_name, top_k=req.top_k)


@app.post("/v1/codegraph/check_freshness")
def http_codegraph_check_freshness(req: FreshnessRequest) -> Dict[str, Any]:
    return engine.codegraph_check_freshness(module_key=req.module_name)


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("CODEGRAPH_PORT", "20150"))
    uvicorn.run(app, host="0.0.0.0", port=port)
