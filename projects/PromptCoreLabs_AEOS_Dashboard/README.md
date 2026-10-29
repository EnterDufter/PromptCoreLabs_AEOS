# 🚀 PromptCoreLabs_AEOS_Dashboard (PCL AEOS v3.5 PROD)

Painel Principal Autônomo e Sistema Operacional de Empresa da **PromptCore Labs** (PCL AEOS).
Cockpit unificado de orquestração cognitiva, governança em tempo real e visualização arquitetural.

---

## 🌟 Principais Recursos & Diferenciais de Arquitetura

### 1. Motor Cognitivo Híbrido & Inferência Fast-Path (~3.4s)
- **Fast-Path Google Gemini Cloud (`gemini-3.5-flash-lite` / `gemini-3.6-flash`)**: Descriptografia nativa em memória da credencial do cofre AES-256-GCM do OmniRoute (`pc-gemini-cloud`), permitindo inferência ultraveloz em ~3s a 6s mesmo quando o Docker Desktop estiver desligado.
- **Integração com OmniRoute Gateway (`:20130`)**: Suporte a streaming nativo SSE (`open-sse`) e combos de modelos de alta disponibilidade.
- **Fail-Fast TCP Sub-Segundo (`checkTcpPort` em 250ms–300ms)**: Detecção instantânea de serviços offline sem esperas desnecessárias de timeout.
- **Failover Soberano Local Ollama (`:11434`, `$0.00`)**: Roteamento automático ou sob demanda para o modelo local `qwen2.5-coder:7b-instruct-q4_K_M` em GPU RTX com `keep_alive: '60m'`.
- **Zero Mocks**: Eliminação integral de qualquer texto estático ou pré-fabricado; 100% das respostas são processadas pelos motores de inferência.

### 2. Triagem Semântica Laya System One (CPU INT8 / 0 MB VRAM)
- Coprocessador não-autorregressivo em CPU host (MiniLM2 INT8 / ONNX Runtime) operando em **~20ms a 35ms** com **0 MB de VRAM** alocada na GPU NVIDIA RTX 3050.
- Executa triagem de intenção, verificação de *RAG Answerability*, detecção de *Staleness/Contradições* e *Tool Gating*, preservando a memória de vídeo para os LLMs gerativos.

### 3. Grounding Híbrido Inteligente & Busca Web sem CORS
- **Separação Contextual Estrita**: Consultas gerais de mercado e tecnologia (ex: RAG, benchmarks, salários, comparativos abertos) recebem respostas naturais, fluidas e universais sem jargões internos forçados.
- **RAG Canônico PCL AEOS**: Injeção de especificações internas (`ADR-0001` a `ADR-0005`) acionada de forma precisa apenas quando o usuário menciona explicitamente termos do ecossistema (`PCL`, `AEOS`, `ADR`) ou seleciona documentos via `#`.
- **Pesquisa Web Integrada no Backend Node.js**: Endpoint `/api/aeos/search` com consulta paralela à Wikipedia API, ArXiv e referências acadêmicas verificadas sem restrições de CORS.

### 4. Interface Minimalista Hyper-Clean (Design System Liquid Glass)
- **Layout de 3 Colunas Retráteis**:
  - **Left Sidebar**: Acordeão de Projetos (`Next Gen Sports`, `Arch Living`, `Defesa B2B`) com conversas aninhadas, histórico por período e colapso fluido para 64px com tooltips táteis.
  - **Central Workspace**: Visualização **Dual-Plex** com alternância instantânea entre *Chat Stream*, *Cortex Canvas* ou tela dividida (*Split Dual-Plex*).
  - **Right Sidebar (Status Real-Time)**: Painel de telemetria de agentes, serviços e Stage Gates TLC v3, com aba flutuante vertical quando recolhida.
- **Cortex Canvas Interativo**: Grafo acíclico dirigido (DAG) de observabilidade em tempo real com **Inspector Lateral de 3 Abas**:
  1. *Telemetria & Logs*: Duração de nós, status e consumo de hardware.
  2. *Inspeção de Payload*: Visualização do JSON bruto e prompts processados.
  3. *Governança & Ações*: Histórico de auditoria SHA-256 e acionadores de ação.
- **Super-Chatbubble Composer**:
  - Esfera Tridimensional **TokenAquaOrb** com reflexo vítreo e animação de glow temporal (Aqua OS X).
  - **Console de Orquestração Cognitiva PCL**: Seleção de 4 perfis (*Síntese Executiva*, *Raciocínio Profundo & Código*, *Soberano Local $0.00*, *Roteamento Autônomo OmniRoute*).
  - **PII Guard LGPD**: Sanitização dinâmica de CPF, e-mails, cartões e tokens antes do envio.
  - **Menções Rápidas**: `@` para sistemas corporativos (BigQuery, SAP, Salesforce, RD Station) e `#` para documentos.
  - **Live Execution Stepper**: Stepper interativo de 5 etapas com cronômetro em tempo real, telemetria detalhada e cards de referências externas clicáveis.
- **PCL Artifact Drawer (Soberano)**: Gaveta lateral retrátil e redimensionável por mouse drag (380px a 850px) para leitura de relatórios, especificações e atas com abas de Auditoria SHA-256, Custos/Tokens e PII.

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologias Utilizadas |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, TailwindCSS, Lucide React, Canvas API |
| **Backend & Middlewares** | Node.js (Vite Plugin Middleware), Proxy Reverso, TCP Socket Probes |
| **Inferência & Roteamento** | OmniRoute Gateway (`:20130`), Google Gemini API (`generativelanguage.googleapis.com`), Ollama (`:11434`) |
| **System One Coprocessor** | PCL Laya (`:20140`), ModernBERT / MiniLM2 ONNX Runtime INT8 (CPU) |
| **Governança & Persistência** | PostgreSQL 17 + PGVector (`:5432`), Stage Gates TLC v3, SHA-256 Crypto Audit Trail |

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- (Opcional para modo 100% offline) Ollama rodando localmente com `qwen2.5-coder:7b-instruct-q4_K_M`
- (Opcional para ambiente de containers) Docker Desktop com os containers PCL (`pcl-omniroute`, `pcl-laya`, `pcl-db`)

### Execução em Desenvolvimento
```bash
# Navegar até a pasta do dashboard
cd c:\PromptCore_Labs\projects\PromptCoreLabs_AEOS_Dashboard

# Instalar dependências
npm install

# Iniciar servidor dev (porta 3001)
npm run dev -- --port 3001 --host
```

Acesse o painel em seu navegador:  
👉 **`http://localhost:3001/`**

### Build de Produção
```bash
npm run build
```
O build compila TypeScript estrito (`tsc`) e empacota os artefatos otimizados em `dist/`.
