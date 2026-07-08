# ARCHITECTURE — Glossary

## Metadados

| Campo | Valor |
|--------|-------|
| Documento | architecture/glossary.md |
| Tipo | Documento Arquitetural Fundacional |
| Status | Aprovado pelo Usuário |
| Versão | 1.0 |
| Camada | Architecture |
| Autoridade | Fonte Oficial de Verdade |

---

# Objetivo

Este documento estabelece o vocabulário oficial do PromptCoreLabs_AEOS.

Seu propósito é garantir que pessoas, agentes, IDEs e modelos de linguagem utilizem os mesmos conceitos com os mesmos significados, reduzindo ambiguidades e deriva semântica ao longo da evolução da plataforma.

Sempre que um termo definido neste documento aparecer em outro artefato do AEOS, seu significado deverá ser interpretado conforme aqui estabelecido.

---

# Regras Gerais

- Cada conceito possui um único significado oficial.
- Sinônimos não alteram o significado do termo.
- Termos novos deverão ser adicionados formalmente.
- Alterações relevantes deverão ser registradas por meio de ADR.
- Este documento possui prioridade semântica sobre interpretações implícitas de modelos de IA.

---

# Glossário Oficial

## AEOS

**AI Engineering Operating System.**

Plataforma arquitetural utilizada para conceber, governar, construir, executar e evoluir projetos de engenharia assistida por Inteligência Artificial.

O AEOS é o sistema.

Não é um projeto.

Não é um produto específico.

---

## Architecture

Camada responsável pela identidade permanente do AEOS.

Define visão, princípios, módulos, mapas arquiteturais e demais fundamentos estruturais.

Architecture responde:

**"Como o sistema deve existir?"**

---

## Governance

Conjunto de regras que disciplinam a engenharia realizada dentro do AEOS.

Inclui metodologias, políticas, gates, auditorias e padrões.

Governance responde:

**"Como o trabalho deve acontecer?"**

---

## TLC Spec-Driven v3

Metodologia oficial atualmente adotada para especificação, planejamento, execução e validação de iniciativas.

No AEOS, ela constitui uma capacidade da camada Governance.

Não representa toda a plataforma.

---

## Module

Grande domínio arquitetural da plataforma.

Um módulo representa uma responsabilidade permanente.

Exemplos:

- Runtime
- Knowledge
- Memory
- Agents

---

## Component

Implementação específica pertencente a um módulo.

Componentes podem evoluir ou ser substituídos sem alterar a definição do módulo.

---

## Capability

Capacidade arquitetural oferecida pelo AEOS.

Uma capability pode ser composta por diversos módulos, componentes e processos.

---

## Project

Iniciativa construída utilizando o AEOS.

Cada projeto possui ciclo de vida próprio.

Projetos não alteram a arquitetura da plataforma.

---

## Product

Resultado entregue por um projeto.

Um projeto pode produzir um ou mais produtos.

---

## Knowledge

Conhecimento explícito.

Inclui documentação, padrões, templates, playbooks, catálogos e documentação técnica.

Knowledge é legível por humanos e agentes.

---

## Memory

Conhecimento computacional persistente.

Inclui:

- RAG
- Embeddings
- Contexto
- Índices
- Histórico

Memory otimiza recuperação de conhecimento.

---

## RAG

Retrieval-Augmented Generation.

Processo utilizado para recuperar conhecimento antes da geração de respostas.

No AEOS, o RAG constitui uma capacidade pertencente ao módulo Memory.

---

## Context

Conjunto de informações fornecidas para uma execução específica.

Contexto é temporário.

Memory é permanente.

---

## Agent

Entidade especializada responsável por executar uma função bem definida.

Exemplos:

- Planner
- Architect
- Builder
- Reviewer
- QA
- Auditor

Agentes utilizam conhecimento.

Não são proprietários do conhecimento.

---

## Orchestrator

Agente responsável por coordenar outros agentes.

Não executa necessariamente tarefas especializadas.

Coordena.

Distribui.

Supervisiona.

---

## Runtime

Camada responsável pela execução operacional do AEOS.

Coordena pipelines, workflows, automações e agentes.

---

## Harness Engineering

Subsistema pertencente ao Runtime.

Responsável por executar fluxos arquiteturalmente definidos.

Não possui autoridade para alterar arquitetura ou governança.

---

## Workflow

Sequência estruturada de atividades executadas por agentes.

---

## Pipeline

Fluxo operacional composto por múltiplos workflows.

---

## Model

Modelo de Inteligência Artificial utilizado durante uma execução.

Pode ser:

- Cloud
- Local
- Open Source
- Proprietário

---

## Provider

Fornecedor responsável por disponibilizar modelos.

Exemplos:

- OpenAI
- Anthropic
- Google
- Ollama
- LM Studio

Provider não é sinônimo de Model.

---

## Fallback

Estratégia utilizada quando um modelo não puder atender uma solicitação.

Fallback deverá preservar contexto, rastreabilidade e continuidade da execução.

---

## Routing

Processo responsável por selecionar dinamicamente qual modelo deverá ser utilizado.

---

## Integration

Adaptador responsável pela comunicação com sistemas externos.

Integrações não implementam regras arquiteturais.

---

## IDE

Ambiente de engenharia utilizado para interação com o AEOS.

Exemplos:

- Codex
- Cursor
- Antigravity
- futuros ambientes compatíveis.

---

## Specification

Documento que descreve o que deverá existir.

Não representa implementação.

---

## Template

Artefato reutilizável utilizado para padronizar documentação ou processos.

---

## ADR

Architecture Decision Record.

Documento utilizado para registrar decisões arquiteturais permanentes.

---

## Source of Truth

Documento oficialmente reconhecido como autoridade para determinado assunto.

Toda informação derivada deverá respeitar sua Fonte Oficial.

---

## Semantic Drift

Processo pelo qual um conceito passa a adquirir significados diferentes ao longo do tempo.

O Glossary existe para impedir Semantic Drift.

---

## Cognitive Drift

Perda gradual de alinhamento entre pessoas, agentes e modelos durante a evolução do sistema.

Governance, ADRs e Glossary existem para minimizar esse risco.

---

## Cross-Cutting Capability

Capacidade transversal que atua sobre todos os módulos.

Exemplos:

- Security
- Observability

---

# Hierarquia Conceitual

A interpretação dos conceitos deverá respeitar a seguinte ordem:

Architecture

↓

Governance

↓

Glossary

↓

Specifications

↓

Templates

↓

Agents

↓

Runtime

↓

Projects

Nenhum documento poderá redefinir conceitos estabelecidos neste Glossary sem uma decisão arquitetural formal.

---

# Evolução

Novos termos poderão ser incorporados ao Glossary.

Entretanto:

- cada termo deverá possuir definição única;
- definições não poderão conflitar entre si;
- sinônimos deverão ser explicitamente documentados;
- alterações estruturais deverão ser registradas por meio de ADR.

---

# Estado Arquitetural

Este documento estabelece a ontologia oficial do PromptCoreLabs_AEOS.

Seu conteúdo deverá servir como referência semântica para toda documentação, agentes, modelos de IA, integrações e projetos desenvolvidos sobre a plataforma.
