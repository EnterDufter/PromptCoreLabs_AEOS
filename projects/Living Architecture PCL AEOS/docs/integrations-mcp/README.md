# Artigo Técnico: Integrações & Protocolo MCP (Model Context Protocol) — PCL AEOS

==================================================
1. VISÃO GERAL DO PROTOCOLO MCP NO PCL AEOS
==================================================

O **Model Context Protocol (MCP)** é o padrão de integração assíncrona baseado em JSON-RPC via stdio que conecta a IDE do desenvolvedor (Antigravity) aos servidores de ferramentas especializadas no host.

---

## 2. SERVIDORES MCP REGISTRADOS

1. **`pcl-cortex` MCP Server**: Servidor nativo do Cortex para validação, renderização e compilação da suíte visual do motor PCL Cortex Engine CLI (`cortex.mjs`).
2. **`pcl-laya` MCP Server**: Servidor nativo do coprocessador System One e motor neural NLI INT8 para classificação ultrarrápida, detecção de contradições e roteamento (`http://localhost:20140`).
3. **`gemini-notebooklm` MCP Server**: Servidor de pesquisa, síntese de documentos e consulta a cadernos de conhecimento.

---

## 3. TOPOLOGIA DE CONEXÃO MCP

```mermaid
graph TD
    classDef client fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#ffffff
    classDef config fill:#0c2340,stroke:#60a5fa,stroke-width:2px,color:#ffffff
    classDef server fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#ffffff
    classDef target fill:#2e1065,stroke:#c084fc,stroke-width:2px,color:#ffffff

    subgraph ClientLayer["IDE / Cliente Agente"]
        IDE["Antigravity IDE / Terminal Agent<br/>(Engenharia & Orquestração)"]:::client
    end

    subgraph ConfigLayer["Manifesto MCP"]
        CONF["mcp.config.json<br/>(Registros stdio & HTTP SSE)"]:::config
    end

    subgraph MCPServers["Servidores MCP Ativos"]
        CX_MCP["pcl-cortex MCP Server<br/>(Cortex Visual Engine v2.12)"]:::server
        LAYA_MCP["pcl-laya MCP Server<br/>(System One & NLI Neural :20140)"]:::server
        NLM_MCP["gemini-notebooklm MCP Server<br/>(Pesquisa & RAG Context)"]:::server
    end

    subgraph TargetWorkspace["Host Filesystem & Runtime"]
        WS["Repositório PCL AEOS<br/>(Workspace & Documentação Viva)"]:::target
        MEM["Memória Híbrida & Vector DB<br/>(pcl-db PostgreSQL / pgvector)"]:::target
    end

    IDE --> CONF
    IDE -->|Invoca Ferramentas Visuais| CX_MCP
    IDE -->|Classificação & Contradições| LAYA_MCP
    IDE -->|Consultas de Pesquisa| NLM_MCP
    CX_MCP -->|Gera HTML Interativo & SVG| WS
    LAYA_MCP -->|Validação Semântica Rápida| MEM
    NLM_MCP -->|Leitura de Contexto & KIs| WS
```

---

## 4. INTEGRAÇÃO COM OS DIAGRAMAS INTERATIVOS
- 🔵 **[mcp-interconnection.html](../../diagrams/interactive/mcp-interconnection.html)**: Mapa de interconexão entre o cliente de IA, servidores MCP e o workspace.
