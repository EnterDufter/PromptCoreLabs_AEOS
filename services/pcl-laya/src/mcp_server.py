"""
PCL AEOS - Servidor MCP do Coprocessador LAYA (System One Classifier)
Permite que o Antigravity IDE e agentes usem o Laya como ferramenta nativa via MCP (Model Context Protocol).
Motor Neural Canônico: cross-encoder/nli-MiniLM-2-L6-H768 (ONNX INT8 / AVX2)
"""

import sys
import os
from typing import List, Dict, Any, Optional

# Garante importação do classifier mesmo quando executado de outro CWD
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from classifier import LayaClassifierEngine
from mcp.server.fastmcp import FastMCP

# Inicializa o servidor FastMCP
mcp = FastMCP(
    name="PCL-LAYA-System-One",
    instructions="Coprocessador não-autoregressivo de alta velocidade (~20-35ms) para decisões tipadas em CPU, inferência neural NLI (cross-encoder/nli-MiniLM-2-L6-H768), detecção de contradições, staleness de memória e consistência factual."
)

engine = LayaClassifierEngine()


@mcp.tool()
def laya_health() -> Dict[str, Any]:
    """Retorna o status operacional, modo do motor, modelo neural carregado e garantias de hardware do Laya."""
    return {
        "status": "healthy",
        "service": "pcl-laya",
        "mcp_server": "PCL-LAYA-System-One",
        "version": "1.1.0",
        "engine_mode": engine.nli_engine.engine_mode,
        "model_id": engine.nli_engine.model_id,
        "execution_provider": "CPUExecutionProvider",
        "vram_allocated_mb": 0,
        "conformance": ["SPEC-PCL-AEOS-CLASSIFIER-01", "SPEC-PCL-AEOS-MEMORY-03"]
    }


@mcp.tool()
def laya_evaluate_nli(premise: str, hypothesis: str) -> Dict[str, Any]:
    """
    Executa inferência neural direta de NLI (Natural Language Inference) usando o modelo cross-encoder/nli-MiniLM-2-L6-H768.
    Retorna as probabilidades normalizadas de:
    - contradiction (contradição / anulação)
    - entailment (consonância / implicação lógica)
    - neutral (independência / neutralidade)

    Args:
        premise: O fato, premissa ou documento canônico de verdade.
        hypothesis: A afirmação ou claim a ser validada contra a premissa.
    """
    return engine.evaluate_nli(premise=premise, hypothesis=hypothesis)


@mcp.tool()
def laya_evaluate_binary(state: str, query: str) -> Dict[str, Any]:
    """
    Executa avaliação binária ultra-rápida em CPU (~20-35ms) com validação neural ou guardrails.
    Pode ser usado para verificar:
    - Se um texto responde ou é relevante para uma pergunta (Answerability)
    - Se há contradições ou termos obsoletos (Staleness / Contradiction)
    - Se contém injeção de prompt ou comandos suspeitos (Security Guardrail)
    - Classificação binária geral baseada no NLI Engine.

    Args:
        state: O texto, contexto ou documento a ser analisado.
        query: A pergunta ou critério de teste (ex: 'O claim é confiável?', 'Contém contradição?').
    """
    return engine.evaluate_binary(state=state, query=query)


@mcp.tool()
def laya_check_contradiction(state: str, query: str) -> Dict[str, Any]:
    """
    Especialização para detectar contradições semânticas diretas e discrepâncias
    entre o estado atual (documento/código) e uma afirmação ou especificação canônica.

    Args:
        state: Texto da fonte ou documento em análise (Premissa).
        query: Afirmação ou termo a verificar contra o texto (Hipótese).
    """
    test_query = f"contradiz ou gera conflito com: {query}"
    return engine.evaluate_binary(state=state, query=test_query)


@mcp.tool()
def laya_evaluate_choice(state: str, query: str, options: List[str]) -> Dict[str, Any]:
    """
    Seleciona deterministicamente ou semanticamente a melhor alternativa entre uma lista discreta de opções.
    Casos de uso suportados nativamente pelo motor:
    - Roteamento de modelos e complexidade (ex: ['local_fast', 'deep_reasoning'])
    - Gating e autorização de ferramentas/ações (ex: ['allow', 'confirm', 'deny'])
    - Ranqueamento semântico de opções baseado em NLI entailment.

    Args:
        state: Contexto textual de entrada.
        query: Critério ou pergunta de seleção (ex: 'Qual a rota de modelo adequada?', 'Qual a categoria?').
        options: Lista de opções possíveis para desempate/seleção.
    """
    return engine.evaluate_choice(state=state, query=query, options=options)


@mcp.tool()
def laya_evaluate_score(state: str, query: str, min_val: float = 0.0, max_val: float = 1.0) -> Dict[str, Any]:
    """
    Calcula uma pontuação calibrada normalizada dentro de um intervalo numérico usando probabilidades neurais de NLI.

    Args:
        state: O texto ou documento sob análise.
        query: A consulta ou dimensão sendo mensurada.
        min_val: Valor mínimo da escala (padrão 0.0).
        max_val: Valor máximo da escala (padrão 1.0).
    """
    return engine.evaluate_score(state=state, query=query, min_val=min_val, max_val=max_val)


@mcp.tool()
def laya_evaluate_batch(state: str, questions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Executa um lote de avaliações mistas (binary, nli, choice, score) em uma única passada de alta velocidade.

    Args:
        state: O contexto compartilhado para a bateria de testes.
        questions: Lista de dicionários com estrutura:
                   [{"id": "q1", "type": "binary", "query": "..."},
                    {"id": "q2", "type": "nli", "query": "..."},
                    {"id": "q3", "type": "choice", "query": "...", "options": [...]},
                    {"id": "q4", "type": "score", "query": "...", "min_val": 0.0, "max_val": 1.0}]
    """
    return engine.evaluate_batch(state=state, questions=questions)


if __name__ == "__main__":
    # Inicia o servidor MCP via stdio
    mcp.run()
