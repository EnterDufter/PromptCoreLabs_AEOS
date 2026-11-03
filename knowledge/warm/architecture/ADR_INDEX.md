---
title: "Índice Canônico de Decisões de Arquitetura (ADRs)"
system_scope: "PCL AEOS Kernel"
kernel_version: "v3.8.0"
type: "Architecture_Spec"
status: "Approved"
rag_tags: [adr, architecture, decisions, index, normative_hierarchy, v3.8]
created_at: "2026-10-29"
last_updated: "2026-11-03"
author: "PromptCore Labs Architecture & Cognitive Systems"
normative_ref: "PCL-AEOS-NORM-01"
---

# 📚 Índice Canônico de Decisões de Arquitetura (ADRs 0001–0013)

> [!IMPORTANT]
> **👔 Visão Executiva & Valor de Negócio:** Toda decisão estrutural do ecossistema **PromptCoreLabs_AEOS** é formalizada como um *Architecture Decision Record (ADR)* auditável. Esse catálogo unificado garante previsibilidade de custos (`$0.00` em operação soberana), soberania sobre dados corporativos e rastreabilidade normativa perante auditorias ISO/IEC 27001 e ISO/IEC 42001.

> [!NOTE]
> **🛠️ Visão de Engenharia & Invariantes:** Para eliminar divergências entre diretórios do monorepo, todos os ADRs reais do repositório estão harmonizados em **3 Trilhas Canônicas** (`architecture/decisions/`, `knowledge/warm/architecture/` e `projects/Living Architecture PCL AEOS/docs/adrs/`), sob a norma soberana **`PCL-AEOS-NORM-01`**.

---

## Trilha 1: Fundação do Kernel & Memória Tripartida (`ADR-0001` a `ADR-0005`)

| ADR ID | Título Oficial | Status | Arquivo Canônico & Foco Tecnológico |
| :--- | :--- | :---: | :--- |
| **`ADR-0001`** | Segregação do Módulo Memory do Módulo Knowledge & Isolamento por Schema | Accepted | `architecture/decisions/ADR-0001-memory-module-segregation.md` — Separação entre governança física (`knowledge/`) e persistência vetorial (`memory.*`). |
| **`ADR-0002`** | Bootstrap como Ponto de Entrada Oficial & Segregação Perimetral | Accepted | `architecture/decisions/ADR-0002-bootstrap-as-official-entry-point.md` — Onboarding padronizado Spec-Driven e topologia inicial segura. |
| **`ADR-0003`** | Higiene Constitucional da Foundation & Orquestração Soberana | Accepted | `architecture/decisions/ADR-0003-foundation-documentation-hygiene.md` — `FOUNDATION.md` como norma imutável e governança de gateways (`OmniRoute :20130`). |
| **`ADR-0004`** | Implementação Concorrente de Knowledge & Runtime Harness | Accepted | `architecture/decisions/ADR-0004-knowledge-runtime-concurrent-implementation.md` — Paralelismo disciplinado entre acervo declarativo e contêineres locais. |
| **`ADR-0005`** | Evolução da Memória Cognitiva Tripartida, Temporal Graph-RAG e Coprocessador System One (Laya) | Accepted | `architecture/decisions/ADR-0005-tripartite-memory-system-one-evolution.md` — PGVector no PostgreSQL 17 (`memory.*`) + Laya CPU INT8 (`0 MB VRAM`). |

---

## Trilha 2: Continuidade DRP & Evolução Cognitiva do Cockpit (`ADR-0006` e `ADR-0007`)

| ADR ID | Título Oficial | Status | Arquivo Canônico & Foco Tecnológico |
| :--- | :--- | :---: | :--- |
| **`ADR-0006`** | Plano de Continuidade de Negócios e Recuperação de Desastres (DRP Tripartido Cloudflare R2) | Accepted | `projects/Living Architecture PCL AEOS/docs/adrs/ADR-006-tripartite-memory-drp-cloudflare.md` — Backup off-site AES-256 gratuito com `RTO = 7,18s` (SLA `<= 15min`). |
| **`ADR-0007`** | Arquitetura de Memória Multi-Turn, Gating Inteligente e Desacoplamento de Fontes no PCL Cockpit v3.6 | Accepted | `knowledge/warm/architecture/ADR-0007.md` — Sliding Window multi-turn, Intention Gating Laya em CPU, pílula retrátil de fontes e auditoria SHA-256 (**4.95 / 5.0**). |

---

## Trilha 3: Governança Operacional, Volumes & Harness (`ADR-0008` a `ADR-0010`)

| ADR ID | Título Oficial | Status | Arquivo Canônico & Foco Tecnológico |
| :--- | :--- | :---: | :--- |
| **`ADR-0008`** | Governança de Persistência de Volumes Docker e Namespace Isolation | Accepted | `projects/Living Architecture PCL AEOS/docs/adrs/ADR-0008-docker-volume-persistence-governance.md` — Binding explícito de volumes e proteção contra perda de estado. |
| **`ADR-0009`** | Governança do Triage Gate e Abordagem Dual-Track SDD (Lean vs. Full) | Accepted | `projects/Living Architecture PCL AEOS/docs/adrs/ADR-0009-triage-gate-dual-track-sdd.md` — Triagem dinâmica entre rota enxuta (`tlc-spec-lean`) e 5 Stage Gates completos. |
| **`ADR-0010`** | Refatoração da Squad Prototyping e Integração Auditável do Antigravity Harness | Accepted | `projects/Living Architecture PCL AEOS/docs/adrs/ADR-0010-squad-prototyping-and-antigravity-harness-integration.md` — Acoplamento das squads sob ISO/IEC 27001 e ISO/IEC 42001. |

---

## Trilha 4: Governança HitL, Extensões & FinOps v3.8 (`ADR-0011` a `ADR-0013`)

| ADR ID | Título Oficial | Status | Arquivo Canônico & Foco Tecnológico |
| :--- | :--- | :---: | :--- |
| **`ADR-0011`** | Companion Extension Manifest V3 com Encapsulamento Shadow DOM e Inline Action Dock | Accepted | `knowledge/warm/architecture/ADR-0011.md` — Isolamento estrito por Shadow DOM em Salesforce, Jira e SAP, com Inline Action Dock in-situ (12.6ms) e zero CSS bleeding. |
| **`ADR-0012`** | Resiliência Human-in-the-Loop em 2 Estágios com Escalação N2 aos 60s e Descarte Seguro aos 120s | Accepted | `knowledge/warm/architecture/ADR-0012.md` — Escalação hierárquica automática via webhooks assinados com HMAC-SHA256 e descarte determinístico por TTL (0 memory leak). |
| **`ADR-0013`** | FinOps EBITDA Shield v2, Trava Física Hard Lock e Calculadora Soberana de ROI Corporativo | Accepted | `knowledge/warm/architecture/ADR-0013.md` — Proteção contra cobranças extrativas em dólar, cálculo de US$ 180k/ano poupados e custo marginal $0.00 com 0 MB VRAM Laya. |
