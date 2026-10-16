# SPEC-PCL-AEOS-AGENT-02: PCL Extended Memory & Autonomous Background Agent Specification

**Versão:** 2.0-Agnostic  
**Status:** Approved for Implementation (Ports & Adapters Architecture)  
**Autor:** Forward Deployed Architecture (FDA) / PCL AI Squad  
**Escopo:** PCL AEOS Engine, OmniRoute AI Gateway (:20130), Antigravity IDE  
**Padrão Arquitetural:** Hexagonal Architecture (Ports & Adapters)  
**Normas de Governança:** ISO/IEC 27001 & ISO/IEC 42001  

---

## 1. Visão Geral e Arquitetura Agnostic de Agentes

O **PCL AEOS** requer um subsistema autônomo de segundo plano (*background daemon*) para **assistência contínua, memória estendida persistente e criação dinâmica de habilidades (skills)**.

Para evitar dependência direta de ferramentas de terceiros ou termos proprietários na documentação do core, este componente é especificado sob a abstração **`PCL Extended Memory Agent Port`**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CANAIS EXTERNOS                                      │
│               (Slack, WhatsApp Cloud, Telegram, Email, Webhooks, Cron)                 │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                 PCL EXTENDED MEMORY AGENT PORT (CONTRATO DE INTERFACE)                 │
│  - Engine Daemon Assíncrono (Background Worker)                                        │
│  - Memória Dialética & Recuperação Cross-Session                                       │
│  - Repositório Dinâmico de Habilidades (.md / SKILL format)                            │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ PROVEDOR SELECIONADO (ADAPTER)                                                   │  │
│  │  - Default Reference: Hermes Agent (Nous Research Runtime)                       │  │
│  │  - Alternativas: OpenClaw Daemon / Amazon Bedrock Agent / Custom PCL Companion   │  │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘  │
└───────────────────────────────────────────┼────────────────────────────────────────────┘
                                            │
                                  Inferência & Triagem
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        OMNIROUTE AI GATEWAY (:20130)                                   │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ PCL Classifier Engine (Laya System One Triage / MCP Engine)                 │  │
│  │  - Intercepta requisições do Agente em <100ms sem custo de output                 │  │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘  │
│                                           │ (Se complexo)                              │
│                                           ▼                                            │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ EBITDA Shield Router (LLMs de Fronteira / Failover Local)                        │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Requisitos do Porto `PCL Extended Memory Agent`

Qualquer mecanismo de agente de plano de fundo plugado ao AEOS deve obrigatoriamente satisfazer os seguintes pilares:

1. **Memória Persistente Dialética:** Capacidade de armazenar e recuperar preferências, fatos e decisões históricas de sessões passadas sem inflar o contexto das chamadas ativas.
2. **Criação e Execução de Habilidades Portáveis (`SKILL.md`):** Capacidade de consolidar soluções de problemas complexos em arquivos de habilidades reutilizáveis no formato padronizado markdown (`SKILL.md`).
3. **Gateway Multicanal Desvinculado:** Suporte a pelo menos um canal de mensagens assíncronas (Slack, Telegram, WhatsApp, Email ou Webhook) com controle de segurança Zero Trust.
4. **Isolamento de Execução (Sandbox):** Execução de código e comandos em ambiente isolado (Docker / Sandbox) para prevenção de vazamento de credenciais e elevação de privilégios.

---

## 3. Mapeamento de Provedores (Adapters)

### **3.1. Provedor Padrão (Reference Implementation): Hermes Agent (Nous Research)**
- **Serviço no Docker:** `pcl-agent-extended-memory` (executando o runtime open-source do Hermes Agent).
- **Justificativa de Escolha:** Motor em Python 3.12 com memória SQLite/FTS5 local, suporte nativo a 25+ canais de comunicação, criação autônoma de `SKILL.md` e licença MIT aberta.
- **Roteamento de Inferência:** Todas as chamadas do Hermes para LLMs são forçadas a passar pelo **OmniRoute Gateway (:20130)** para aplicar a triagem do classificador System 1 e economizar tokens.

### **3.2. Provedor Alternativo A: OpenClaw / Custom Background Worker**
- **Serviço no Docker:** `pcl-agent-extended-memory` (executando o agente OpenClaw ou daemon interno do PCL Cortex Engine).
- **Caso de Uso:** Projetos onde a governança do cliente exige substituição do runtime por um motor desenvolvido internamente.

### **3.3. Provedor Alternativo B: Managed Cloud Agent (Amazon Bedrock / Quick / Google Vertex)**
- **Caso de Uso:** Implantações corporativas onde o cliente exige a utilização de agentes gerenciados na infraestrutura de nuvem pública contratada.

---

## 4. Ponte de Sincronização & Governança (ISO 27001 / ISO 42001)

Independente do provedor de agente utilizado no container `pcl-agent-extended-memory`:

1. **Sincronização de Memória com PGVector:** O serviço `pcl-agent-memory-sync` extrai os dados do banco local do agente (ex: SQLite do Hermes) e sincroniza na **Memória Tripartida no PostgreSQL 17/PGVector** do PCL AEOS.
2. **Governança de Habilidades (TLC v3 Stage Gate 4):** Toda nova habilidade criada autonomamente pelo agente é copiada para o diretório `.agent/skills/` do Antigravity IDE e submetida à auditoria de testes do **Stage Gate 4 (Validate)** antes da promoção final.
