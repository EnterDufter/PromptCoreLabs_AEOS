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
flowchart LR
    classDef ide fill:#0f172a,stroke:#38bdf8,stroke-width:1.5px,color:#ffffff;
    classDef srv fill:#064e3b,stroke:#34d399,stroke-width:1.2px,color:#ffffff;
    classDef db fill:#1e3a8a,stroke:#60a5fa,stroke-width:1.2px,color:#ffffff;

    subgraph Cliente ["1. Interface & Agentes"]
        direction TB
        IDE["<b>Antigravity IDE & Terminal</b><br/>Console Operacional do Arquiteto"]:::ide
        Config["<b>mcp.config.json</b><br/>Manifesto de Barramento MCP"]:::ide
        IDE --> Config
    end

    subgraph Servidores ["2. Servidores MCP"]
        direction TB
        MCP_Cortex["<b>pcl-cortex :20150</b><br/>Geração de Diagramas & Specs"]:::srv
        MCP_Ntb["<b>gemini-notebooklm</b><br/>Pesquisa Profunda & Síntese RAG"]:::srv
        MCP_Laya["<b>pcl-laya :20140</b><br/>NLI System One em CPU INT8"]:::srv
    end

    subgraph Dados ["3. Acervo & Persistência"]
        direction TB
        Repo["<b>Repositório Git PCL AEOS</b><br/>Código Fonte, RFCs & Documentos"]:::db
        PG["<b>PostgreSQL / PGVector :5432</b><br/>Memória Tripartida & Embeddings"]:::db
    end

    Config -->|"Visualização"| MCP_Cortex
    Config -->|"Pesquisa"| MCP_Ntb
    Config -->|"Classificação"| MCP_Laya

    MCP_Cortex -->|"Armazena Docs"| Repo
    MCP_Ntb -->|"Consulta Acervo"| Repo
    MCP_Laya -->|"Grava Vetores"| PG
```

---

## 4. INTEGRAÇÃO COM OS DIAGRAMAS INTERATIVOS
- 🔵 **[mcp-interconnection.html](../../diagrams/interactive/mcp-interconnection.html)**: Mapa de interconexão entre o cliente de IA, servidores MCP e o workspace.
