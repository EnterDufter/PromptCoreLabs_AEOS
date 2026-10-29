---
title: "Índice Canônico de Decisões de Arquitetura (ADRs)"
system_scope: "PCL AEOS Kernel"
kernel_version: "v3.5.0"
type: "Architecture_Spec"
status: "Approved"
rag_tags: [adr, architecture, decisions, index, normative_hierarchy]
created_at: "2026-10-29"
last_updated: "2026-10-29"
author: "PromptCore Labs Architecture"
normative_ref: "PCL-AEOS-NORM-01"
---

# 📚 Índice Canônico de Decisões de Arquitetura (ADRs)

| ADR ID | Título Oficial | Status | Foco Tecnológico |
| :--- | :--- | :--- | :--- |
| **ADR-0001** | Estruturação de Governança Determinística Orientada a Especificação (TLC Spec-Driven v3) | Accepted | Metodologia de desenvolvimento e conformidade de gates. |
| **ADR-0002** | Isolamento de Ambientes, Rede Mesh Tailscale e Segregação de Portas | Accepted | Segurança de rede local, Zero Trust e túneis encriptados. |
| **ADR-0003** | Arquitetura do Gateway Híbrido de Modelos OmniRoute (:20130) | Accepted | Roteamento multi-provedor (Cloud vs. Local Ollama) com auditoria. |
| **ADR-0004** | Orquestrador de Arquitetura e Guardião de Grafos DAG (Cortex Engine) | Accepted | Observabilidade, visualização de grafos e integridade de artefatos. |
| **ADR-0005** | Evolução da Memória Cognitiva Tripartida, Temporal Graph-RAG e Coprocessador System One (Laya) | Accepted | PGVector no PostgreSQL 17 + Laya em CPU (INT8 / 0 MB VRAM) vs. Jev (TypeSafe AI). |
| **ADR-0006** | Plano de Continuidade de Negócios e Recuperação de Desastres (DRP Tripartido Cloudflare R2) | Accepted | Backup e restore off-site criptografado em AES-256 com RTO < 15min. |
