# ARCHITECTURE — Architecture Map

## Metadados

| Campo | Valor |
|--------|-------|
| Documento | architecture/architecture-map.md |
| Tipo | Documento Arquitetural Fundacional |
| Status | Aprovado pelo Usuário |
| Versão | 1.0 |
| Camada | Architecture |
| Autoridade | Fonte Oficial de Verdade |

---

# Objetivo

Este documento descreve a organização arquitetural do PromptCoreLabs_AEOS em alto nível.

Seu propósito é demonstrar como os diferentes domínios da plataforma se relacionam, quais dependências são permitidas e como o conhecimento percorre toda a arquitetura.

Para uma representação gráfica e mapeamento de processos segundo o padrão de arquitetura corporativa, consulte [C4 Model Architecture](file:///c:/PromptCore_Labs/architecture/c4-model.md).

Este documento deverá ser utilizado como referência para qualquer evolução estrutural da plataforma.


---

# Visão Geral

O PromptCoreLabs_AEOS é concebido como um Sistema Operacional de Engenharia Assistida por Inteligência Artificial.

Sua arquitetura é organizada em camadas permanentes, separando claramente:

- identidade arquitetural;
- governança;
- bootstrap;
- conhecimento;
- memória;
- inteligência operacional;
- execução;
- integração;
- projetos.

Essa separação reduz acoplamento, aumenta a rastreabilidade e permite evolução contínua.

---

# Mapa Arquitetural

```text
                         +--------------------------------+
                         |         ARCHITECTURE           |
                         | Vision • Principles • Modules  |
                         +---------------+----------------+
                                         |
                                         ▼
                         +--------------------------------+
                         |         GOVERNANCE             |
                         | TLC • ADR • Policies • Gates   |
                         +---------------+----------------+
                                         |
                                         ▼
                         +--------------------------------+
                         |          BOOTSTRAP             |
                         | Official First-Level Module    |
                         +---------------+----------------+
                                         |
                                         ▼
             +---------------------------+---------------------------+
             |                                                       |
             ▼                                                       ▼
+-------------------------------+                 +-------------------------------+
|          KNOWLEDGE            |                 |            MEMORY             |
| Docs • Patterns • Playbooks   |                 | RAG • Context • Embeddings   |
+---------------+---------------+                 +---------------+---------------+
                \                               /
                 \                             /
                  \                           /
                   +-----------+-------------+
                               |
                               ▼
                  +---------------------------+
                  |          AGENTS           |
                  | Planner • Builder • QA    |
                  +-------------+-------------+
                                |
                                ▼
                  +---------------------------+
                  |          RUNTIME          |
                  | Harness • Pipelines       |
                  +-------------+-------------+
                                |
                                ▼
                  +---------------------------+
                  |          MODELS           |
                  | Cloud • Local • Routing   |
                  +-------------+-------------+
                                |
                                ▼
                  +---------------------------+
                  |       INTEGRATIONS        |
                  | IDEs • APIs • Docker      |
                  +-------------+-------------+
                                |
                                ▼
                  +---------------------------+
                  |         PROJECTS          |
                  | Apps • Products • Clients |
                  +---------------------------+

        +-----------------------------------------------+
        | SECURITY + OBSERVABILITY (Transversal Layer) |
        +-----------------------------------------------+
```

---

# Camadas Arquiteturais

## 1. Architecture

Define a identidade permanente da plataforma.

Nada acima desta camada existe.

Toda evolução parte daqui.

---

## 2. Governance

Transforma princípios em regras operacionais.

É responsável por disciplinar como a engenharia acontece.

A metodologia TLC Spec-Driven v3 reside nesta camada.

---

## 3. Knowledge

Representa o conhecimento explícito da plataforma.

Documentação.

Templates.

Padrões.

Playbooks.

Catálogos.

---

## 4. Bootstrap

Módulo oficial de primeiro nível da arquitetura do PromptCoreLabs_AEOS.

Sua implementação documental será realizada posteriormente.

---

## 5. Memory

Representa conhecimento computacional persistente.

Contexto.

RAG.

Embeddings.

Histórico.

Memória semântica.

Knowledge e Memory são complementares.

---

## 6. Agents

Representam inteligência operacional especializada.

Os agentes não possuem conhecimento próprio.

Eles utilizam Knowledge e Memory.

---

## 7. Runtime

Responsável pela execução.

Aqui vive o Harness Engineering.

O Runtime não toma decisões arquiteturais.

Ele executa processos.

---

## 8. Models

Representa os modelos de IA disponíveis.

Cloud.

Local.

Open Source.

Proprietários.

Todos acessados através de abstrações.

---

## 9. Integrations

Responsável pela comunicação com o mundo externo.

GitHub.

Docker.

Tailscale.

Amazon Q.

MCP Servers.

IDEs.

APIs.

---

## 10. Projects

Representa os produtos construídos utilizando o AEOS.

O AEOS existe para servir projetos.

Projetos não modificam a arquitetura.

---

# Fluxo do Conhecimento

O conhecimento nasce na Architecture.

É operacionalizado pela Governance.

Reconhece Bootstrap como módulo oficial de primeiro nível.

É registrado em Knowledge.

É indexado pela Memory.

É consumido pelos Agents.

É executado pelo Runtime.

É processado pelos Models.

É conectado ao mundo pelas Integrations.

Finalmente gera valor através dos Projects.

---

# Dependências Permitidas

As dependências deverão seguir preferencialmente o fluxo descendente da arquitetura.

Camadas superiores definem.

Camadas inferiores executam.

Dependências ascendentes deverão ser evitadas.

Quando inevitáveis, deverão ocorrer exclusivamente através de interfaces bem definidas.

---

# Capacidades Transversais

Security e Observability não pertencem a uma camada específica.

Elas atravessam toda a arquitetura.

Security protege.

Observability mede.

Ambas deverão estar presentes em todos os módulos.

---

# Papel do Harness Engineering

O Harness Engineering constitui exclusivamente a camada Runtime.

Sua responsabilidade é coordenar a execução da plataforma.

Ele não define arquitetura.

Ele não substitui governança.

Ele não preserva conhecimento.

Ele materializa decisões previamente estabelecidas.

---

# Evolução Arquitetural

Esta arquitetura foi concebida para suportar evolução contínua.

Novas capacidades deverão ser adicionadas preferencialmente como módulos independentes.

Alterações estruturais deverão preservar:

- baixo acoplamento;
- alta coesão;
- independência tecnológica;
- rastreabilidade;
- modularidade.

Mudanças significativas deverão ser registradas por meio de Architecture Decision Records (ADR).

---

# Estado Arquitetural

Este documento representa o mapa arquitetural oficial do PromptCoreLabs_AEOS.

Toda documentação futura deverá ser consistente com esta organização.
