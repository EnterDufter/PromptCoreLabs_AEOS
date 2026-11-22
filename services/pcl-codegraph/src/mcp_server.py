"""
PCL AEOS — Servidor MCP do Adaptador Hexagonal PCL Code Graph Port (pcl-codegraph)
Conformidade: SPEC-PCL-AEOS-CODEGRAPH-04, ADR-0015 & AGENTS.md
Modo: 100% Determinístico (--no-llm / AST em CPU) | 0 MB VRAM | Custo $0.00
"""

import os
import sys
from typing import Any, Dict

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from engine import PCLCodeGraphEngine
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    name="PCL-CodeGraph-Port",
    instructions=(
        "Servidor MCP soberano de Grafo Estrutural de Código (SPEC-PCL-AEOS-CODEGRAPH-04). "
        "Opera 100% em CPU (--no-llm / AST determinístico, 0 MB VRAM, $0.00) sobre os 4 subgrafos do monorepo "
        "(cockpit, laya, omniroute, paperclip), reduzindo em >70% o consumo de tokens na navegação de código."
    )
)

engine = PCLCodeGraphEngine()


@mcp.tool()
def codegraph_index(module_name: str = "all", incremental: bool = True) -> Dict[str, Any]:
    """
    Executa a indexação AST determinística (--no-llm, 0 tokens, 0 MB VRAM) gerando os subgrafos JSON.
    Opções de module_name: 'all', 'cockpit', 'laya', 'omniroute', 'paperclip'.
    """
    return engine.codegraph_index(module_key=module_name, incremental=incremental)


@mcp.tool()
def codegraph_query(
    query: str,
    module_name: str = "cockpit",
    max_hops: int = 2,
    token_budget: int = 1500
) -> Dict[str, Any]:
    """
    Consulta o subgrafo estrutural de código para localizar arquivos, componentes, funções, endpoints e suas conexões
    sem precisar abrir dezenas de arquivos brutos (economia >70% de tokens).
    """
    return engine.codegraph_query(
        query=query,
        module_key=module_name,
        max_hops=max_hops,
        token_budget=token_budget
    )


@mcp.tool()
def codegraph_impact_radius(
    symbol_or_file: str,
    module_name: str = "cockpit",
    depth: int = 2
) -> Dict[str, Any]:
    """
    Calcula o raio de impacto (blast radius) de um arquivo, função ou componente antes de refatorações,
    retornando todos os arquivos e símbolos dependentes que podem ser afetados.
    """
    return engine.codegraph_impact_radius(
        symbol_or_file=symbol_or_file,
        module_key=module_name,
        depth=depth
    )


@mcp.tool()
def codegraph_god_nodes(module_name: str = "all", top_k: int = 5) -> Dict[str, Any]:
    """
    Retorna os Top-K God Nodes (nós de maior centralidade e acoplamento arquitetural) de cada subgrafo.
    """
    return engine.codegraph_god_nodes(module_key=module_name, top_k=top_k)


@mcp.tool()
def codegraph_check_freshness(module_name: str = "all") -> Dict[str, Any]:
    """
    Verifica deterministicamente via SHA-256 (0 tokens) se os subgrafos estão sincronizados ('TRUSTED')
    ou desatualizados ('STALE') em relação aos arquivos atuais do repositório.
    """
    return engine.codegraph_check_freshness(module_key=module_name)


if __name__ == "__main__":
    mcp.run()
