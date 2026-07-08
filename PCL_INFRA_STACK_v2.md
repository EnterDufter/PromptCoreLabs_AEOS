# PromptCore Labs (PCL) - Infraestrutura & Stack v2.0 (2026)

Este documento serve como fonte da verdade técnica para a **PromptCore Labs**, consolidando o Harness de IA, segurança e soberania de dados.

## 1. Fundação de Infraestrutura (The Harness)
- **Virtualização**: Docker Desktop (WSL2 / Windows / Ubuntu).
- **Rede Privada**: Tailscale (Túnel VPN ponto-a-ponto para acesso remoto seguro e soberania de rede).
- **Versionamento**: Git com Repositórios **100% Privados** (Proteção de IP e segredos de agentes).
- **Banco de Dados**: PostgreSQL v17 (Containerizado com volumes persistentes).

## 2. Abstração de Modelos (OmniRoute v3.5)
O OmniRoute atua como o **AI Gateway** central, implementando a estratégia **EBITDA Shield** (economia de tokens e performance).

### Hierarquia de Modelos (Tiering):
1. **Camada Cloud (High)**: Gemini 3.1 Pro / Claude 3.6 Sonnet (Arquitetura, PRDs, Raciocínio Complexo).
2. **Camada Cloud (Flash)**: Gemini 3 Flash (Escrita de código rápida, UI, tarefas de baixo contexto).
3. **Camada Local (Heavy Coding)**: LM Studio -> **Qwen3-Coder-30B** (Execução local via RTX 3050 para coding denso e sem custo de tokens).
4. **Camada Local (Audit/Logs)**: Ollama -> **Gemma 3 4B** (Roteamento de logs, auditoria rápida e tarefas de CLI).

## 3. Orquestração de Agentes (PaperClip)
- **Plataforma**: PaperClip (Dashboard de Agentes e Squads).
- **Estrutura**: Squads especializados (Strategist, Tech Lead, Creation, etc).
- **Integração**: Conectado diretamente ao OmniRoute para execução híbrida Cloud/Local.

## 4. Metodologia de Engenharia (TLC Spec-Driven)
A PCL adota o padrão **Zero Vibe-Coding** através da estrutura `.specs/`:
- **Specify**: Todo recurso começa com um `spec.md` (IDs rastreáveis).
- **Design**: Arquitetura definida em `design.md`.
- **Tasks**: Decomposição atômica em `tasks.md`.
- **Execute**: Ciclo Plan -> Implement -> Verify -> Commit.

## 5. Auditoria e Governança (NotebookLM)
- **Papel**: Cérebro de Auditoria e Contexto.
- **Integração**: NotebookLM MCP Server conecta o Antigravity (Execução) ao NotebookLM (Conhecimento).

---
*Gerado por Antigravity para PromptCore Labs – Abril/2026*
