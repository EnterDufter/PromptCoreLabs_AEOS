# SPEC-PCL-AEOS-ORCHESTRATION-03: PCL Pluggable Orchestration Framework Specification

**Versão:** 1.0-Agnostic  
**Status:** Approved for Implementation (Ports & Adapters Architecture)  
**Autor:** Forward Deployed Architecture (FDA) / PCL AI Squad  
**Escopo:** PCL AEOS Core, PaperClip Engine, External Orchestrator Adapters  
**Padrão Arquitetural:** Hexagonal Architecture (Ports & Adapters)  

---

## 1. Visão Geral e Necessidade de Agnosticism de Orquestrador

O **PCL AEOS** é um Sistema Operacional de Engenharia de IA soberano. Dependendo do ambiente do cliente, a camada de orquestração de fluxos complexos e agentes concorrentes pode exigir diferentes motores.

A arquitetura define o **`PCL Orchestrator Port`**, um contrato genérico de orquestração que permite trocar o motor de execução (ex: Paperclip, LangChain, LangGraph, AutoGen, CrewAI ou Amazon Bedrock Agent) sem alterar o núcleo de governança do AEOS.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PCL AEOS HARNESS                                     │
│  - Governança Dual: ISO 27001 & ISO 42001                                              │
│  - Stage Gates (TLC v3: Gate 1 Specify -> Gate 5 Deploy)                               │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                  PCL Orchestrator Port
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼                                 ▼                                 ▼
┌──────────────────┐              ┌──────────────────┐              ┌──────────────────┐
│ Provider Adapter │              │ Provider Adapter │              │ Provider Adapter │
│ Paperclip Engine │              │ LangChain/Graph  │              │ Cloud Managed    │
│ (Default PCL)    │              │ (Open Source)    │              │ (AWS / GCP / Azure)
└──────────────────┘              └──────────────────┘              └──────────────────┘
```

---

## 2. Requisitos do Porto `PCL Orchestrator Port`

Qualquer orquestrador plugado ao PCL AEOS deve implementar as seguintes interfaces de controle:

1. **`pipeline_init(spec_manifest) -> pipeline_id`**: Inicializa um pipeline de desenvolvimento com base em um manifesto de especificação.
2. **`gate_evaluate(pipeline_id, stage_gate_id) -> gate_result`**: Executa as validações do Stage Gate (TLC v3) exigidas pelo AEOS.
3. **`dispatch_agent_task(task_context, tools[]) -> execution_summary`**: Despacha subtarefas para os agentes especialistas do PCL Squad (15 agentes).
4. **`export_audit_trail(pipeline_id) -> audit_log`**: Exporta o log completo de rastreabilidade para auditoria ISO 27001.

---

## 3. Mapeamento de Adaptadores de Orquestração

1. **Paperclip Orchestrator (Reference Implementation):** Motor nativo leve do PCL AEOS para orquestração determinística guiada por arquivos markdown e Stage Gates.
2. **LangChain / LangGraph Adapter:** Permite rodar grafos de agentes complexos do ecossistema LangChain dentro da esteira do AEOS.
3. **Enterprise Cloud Adapter (AWS Bedrock / Azure AI Foundry):** Permite delegar a execução dos agentes para orquestradores gerenciados na nuvem pública do cliente.
