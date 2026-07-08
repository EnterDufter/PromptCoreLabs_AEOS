# ARCHITECTURE — Repository Structure

## Objetivo

Definir a organização estrutural oficial do repositório do PromptCoreLabs_AEOS.

A estrutura do repositório deverá refletir a arquitetura da plataforma.

Pastas representam responsabilidades arquiteturais, nunca tecnologias.

---

# Estrutura Geral

```text
PromptCoreLabs_AEOS/

├── foundation/
├── bootstrap/
├── runtime/
├── memory/
├── knowledge/
├── agents/
├── templates/
├── integrations/
└── examples/
```

---

# Responsabilidades

## foundation/

Fundamentos permanentes da plataforma.

Vision.

Principles.

Modules.

Decision Framework.

ADR Process.

Glossary.

Architecture Map.

Governance.

---

## bootstrap/

Módulo oficial de primeiro nível.

Sua implementação documental será realizada posteriormente.

---

## runtime/

Harness Engineering.

Pipelines.

Workflows.

Scheduler.

Execution Engine.

---

## memory/

Memória organizacional e persistência computacional.

RAG (infraestrutura e bases vetoriais).

Embeddings (modelos e índices).

Contexto persistente e histórico de Execution Cells.

---

## knowledge/

Conhecimento explícito.

Templates de documentação.

Playbooks operacionais.

Padrões de engenharia.

Catálogos de melhores práticas.

---

## agents/

Especializações de agentes.

Planner.

Architect.

Builder.

Reviewer.

QA.

Auditor.

Orchestrator.

---

## templates/

Modelos reutilizáveis.

PRD.

SDD.

ADR.

Specifications.

Prompts.

Policies.

---

## integrations/

GitHub.

Docker.

Amazon Q.

Ollama.

LM Studio.

OpenAI.

Anthropic.

Google.

MCP Servers.

IDEs.

---

## examples/

Exemplos completos.

Projetos de demonstração.

Tutoriais.

Casos de referência.

---

## projects/

Projetos construídos utilizando o AEOS deverão ser organizados sob a responsabilidade arquitetural adequada.

Cada projeto possui autonomia.

Nenhum projeto altera a arquitetura.

---

## docs/

Documentação complementar deverá permanecer subordinada à responsabilidade arquitetural apropriada.

---

## scripts/

Automações e ferramentas auxiliares deverão permanecer subordinadas à responsabilidade arquitetural apropriada.

---

## tests/

Validação da própria plataforma deverá permanecer subordinada à responsabilidade arquitetural apropriada.

Testes de templates.

Testes de agentes.

Testes de Runtime.

---

# Regra Fundamental

A estrutura deverá permanecer orientada por responsabilidades.

Nunca reorganizar diretórios apenas para refletir tecnologias momentâneas.

---

# Evolução

Novas pastas somente poderão ser adicionadas quando representarem uma nova responsabilidade arquitetural.

---

# Estado Arquitetural

Esta estrutura constitui a organização oficial do repositório PromptCoreLabs_AEOS.
