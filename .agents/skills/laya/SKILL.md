---
name: laya
description: Coprocessador System One e Classificador não-autoregressivo de alta velocidade (~20-35ms) do PCL AEOS. Invocado para decisões tipadas em CPU (0 MB VRAM), verificação instantânea de staleness e contradições entre documentos/claims, answerability check para RAG, triagem de guardrails e roteamento de modelos. Integrado nativamente via MCP Server (pcl-laya).
license: MIT
metadata:
  version: "1.0.0"
  author: PromptCore Labs
  conformance:
    - SPEC-PCL-AEOS-CLASSIFIER-01
    - SPEC-PCL-AEOS-MEMORY-03
---

# Laya — Coprocessador System One (PCL AEOS)

O **LAYA** é o coprocessador não-autoregressivo de decisão ultrarrápida do ecossistema **PCL AEOS**. Projetado para operar com latência determinística (~20 a 35ms) 100% em CPU com **0 MB de VRAM alocada**, liberando a GPU e o LLM autoregressivo de tarefas de classificação simples e repetitivas.

## Capacidades Principais

1. **Staleness & Contradiction Check**: Identifica contradições ontológicas e discrepâncias entre versões de documentos, claims ou especificações canônicas.
2. **RAG Answerability**: Testa em milissegundos se um contexto recuperado contém sobreposição léxico-semântica suficiente para responder a uma consulta.
3. **Guardrail Screening**: Detecta padrões de injeção de prompt, bypass de instruções ou comandos potencialmente destrutivos.
4. **Tool Gating & Routing**: Classificação tipada discreta (`choice`) entre opções para roteamento de modelos ou autorização de chamadas de ferramentas.
5. **Score Normalizado**: Pontuação calibrada para ranqueamento rápido de aderência factual.

## Formas de Consumo

### 1. Via MCP Server no Antigravity IDE (`pcl-laya`)
O Laya está configurado como um servidor MCP local rodando via stdio:
- Comando: `python C:\PromptCore_Labs\services\pcl-laya\src\mcp_server.py`
- Ferramentas disponíveis:
  - `laya_health()`: Diagnóstico do coprocessador.
  - `laya_evaluate_binary(state, query)`: Avaliação binária rápida.
  - `laya_check_contradiction(state, query)`: Detecção específica de conflito ou obsolescência.
  - `laya_evaluate_choice(state, query, options)`: Seleção tipada discreta.
  - `laya_evaluate_score(state, query, min_val, max_val)`: Cálculo de score numérico.
  - `laya_evaluate_batch(state, questions)`: Avaliação em lote.

### 2. Via CLI / Python Direto
```bash
python -c "import sys; sys.path.insert(0, 'C:/PromptCore_Labs/services/pcl-laya/src'); from classifier import LayaClassifierEngine; engine = LayaClassifierEngine(); print(engine.evaluate_binary('texto', 'pergunta'))"
```

### 3. Via Microserviço REST / Docker
- Arquivo: `services/pcl-laya/src/main.py`
- Porta interna: `20140`
