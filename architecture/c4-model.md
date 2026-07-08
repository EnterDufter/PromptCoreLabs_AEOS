# ARCHITECTURE — C4 Model Architecture

==================================================
METADADOS
==================================================

| Campo | Valor |
|---|---|
| Documento | architecture/c4-model.md |
| Tipo | Documento Arquitetural Corporativo |
| Status | Aprovado |
| Versão | v1.0 |
| Camada | Architecture |
| Autoridade | Fonte Oficial de Verdade |

---

==================================================
1. INTRODUÇÃO AO C4 MODEL
==================================================

O modelo C4 é uma notação gráfica simplificada projetada para descrever a arquitetura de sistemas de software em diferentes níveis de abstração. Ele organiza a visualização em quatro níveis: Contexto, Contêineres, Componentes e Código.

Para o **PromptCoreLabs_AEOS**, o C4 Model é a ferramenta oficial de representação macro de processos lógicos e físicos, integrando a documentação e os fluxos computacionais locais do Harness.

---

==================================================
2. C4 NÍVEL 1 — SYSTEM CONTEXT (CONTEXTO DO SISTEMA)
==================================================

O diagrama de contexto mostra a fronteira do ecossistema AEOS com os atores humanos e os sistemas externos em nuvem:

```mermaid
graph TB
    Operator[Operador Humano<br/>Arquiteto / Desenvolvedor] -->|Governa e executa tarefas| AEOS[PromptCoreLabs_AEOS<br/>AI Engineering OS]
    AEOS -->|Versiona código e RAG| GH[GitHub / Git Remote<br/>Repositório de Código]
    AEOS -->|Consome inferência em nuvem| LLM[Cloud LLM Providers<br/>Gemini / Claude API]
    
    style Operator fill:#1a365d,stroke:#3182ce,stroke-width:2px,color:#fff
    style AEOS fill:#2c5282,stroke:#4299e1,stroke-width:2px,color:#fff
    style GH fill:#2b6cb0,stroke:#63b3ed,stroke-width:2px,color:#fff
    style LLM fill:#4a5568,stroke:#a0aec0,stroke-width:2px,color:#fff
```

### Elementos do Contexto:
*   **Operador Humano:** Engenheiros de IA e Desenvolvedores que utilizam a metodologia TLC e instanciam templates para guiar as decisões.
*   **PromptCoreLabs_AEOS:** O sistema em escopo que organiza e persiste o conhecimento corporativo e a orquestração local.
*   **GitHub / Git Remote:** Plataforma de nuvem para guarda, versionamento e controle colaborativo do código e especificações.
*   **Cloud LLM Providers:** Serviços externos de IA de alto contexto (Gemini Pro, Claude Sonnet) para tarefas analíticas densas.

---

==================================================
3. C4 NÍVEL 2 — CONTAINER DIAGRAM (CONTÊINERES)
==================================================

O diagrama de contêineres abre a caixa do AEOS, mostrando as aplicações físicas em execução local e suas pontes de rede:

```mermaid
graph TB
    subgraph Host[Máquina Host Windows / WSL2]
        Workspace[Git Repo Workspace<br/>Arquivos Locais e Módulos]
        
        subgraph Docker[Harness Docker Compose Bridge Network]
            PC[PaperClip Container<br/>Dashboard de Agentes / Node.js]
            OR[OmniRoute Container<br/>AI Gateway / Node.js]
            DB[pcl-db Container<br/>PostgreSQL v17 + pgvector]
        end
        
        subgraph LocalModels[Modelos Locais GPU]
            LM[LM Studio Container/Process<br/>Porta 1234 / Qwen Coder]
            OL[Ollama Container/Process<br/>Porta 11434 / Gemma]
        end
        
        TS[Tailscale Agent<br/>VPN Mesh Tunnel]
    end
    
    Operator[Operador Humano] -->|Interage via Web UI| PC
    Operator -->|Edita markdown| Workspace
    
    PC -->|Lê/Grava especificações| Workspace
    PC -->|Persiste dados de IA| DB
    PC -->|Chama APIs de inferência| OR
    
    OR -->|Roteia / EBITDA Shield| LM
    OR -->|Roteia / EBITDA Shield| OL
    OR -->|Roteia requisições em nuvem| CloudLLM[Cloud LLM APIs]
    
    TS -->|Túnel criptografado seguro| Host
    
    style Docker fill:#1a365d,stroke:#3182ce,color:#fff
    style LocalModels fill:#2d3748,stroke:#4a5568,color:#fff
    style TS fill:#2b6cb0,stroke:#63b3ed,color:#fff
```

### Detalhamento dos Contêineres:
*   **Git Repo Workspace (File System):** Contém os módulos do AEOS (Foundation, Governance, etc.) e as pastas ativas de `/projects/` e `/tools/`.
*   **PaperClip (Web App / Node.js):** Gerencia os agentes inteligentes e permite ao operador acompanhar os logs das squads de desenvolvimento.
*   **OmniRoute (API Proxy / Node.js):** Gateway de roteamento com suporte a fallback dinâmico e prompt caching (EBITDA Shield).
*   **pcl-db (Database / PostgreSQL v17):** Banco de dados relacional para persistência de sessões e vetorial para indexação do RAG da memória organizacional.
*   **LM Studio / Ollama (Local AI Engines):** Motores locais de inferência consumidos para tarefas de baixo custo ou sem conexão externa.

---

==================================================
4. C4 NÍVEL 3 — COMPONENT DIAGRAM (COMPONENTES DO REPOSITÓRIO)
==================================================

O diagrama de componentes detalha a organização lógica do repositório Git e como as dependências fluem:

```mermaid
graph TD
    subgraph Repo[Git Repo Workspace]
        FD[foundation / governance<br/>Regras Constitucionais]
        BS[bootstrap<br/>Onboardings e Handoffs]
        KN[knowledge<br/>Playbooks e Padrões]
        MM[memory<br/>RAG e Logs de Células]
        AG[agents<br/>Planner / Builder / QA / Auditor]
        RT[runtime<br/>PaperClip e OmniRoute configs]
        TP[templates<br/>Scaffolding de Documentos]
        IN[integrations<br/>GitHub / MCP / Network]
    end
    
    BS -->|Verifica| FD
    KN -->|Implementa padrões de| FD
    MM -->|Indexa arquivos de| Repo
    AG -->|Consome playbook de| KN
    AG -->|Lê contexto de| MM
    RT -->|Orquestra| AG
    RT -->|Executa| IN
    TP -->|Usa padrões de| KN
    
    style FD fill:#1a365d,stroke:#3182ce,color:#fff
    style AG fill:#2c5282,stroke:#4299e1,color:#fff
```

---

==================================================
5. FONTES DE REFERÊNCIA
==================================================

architecture/architecture-map.md

architecture/principles.md

runtime/README.md
