# ARCHITECTURE — Platform Modules

## Metadados

| Campo | Valor |
|--------|-------|
| Documento | architecture/modules.md |
| Tipo | Documento Arquitetural Fundacional |
| Status | Aprovado pelo Usuário |
| Versão | 1.0 |
| Camada | Architecture |
| Autoridade | Fonte Oficial de Verdade |

---

# Objetivo

Este documento define a decomposição arquitetural do PromptCoreLabs_AEOS.

Seu propósito é estabelecer as grandes capacidades permanentes da plataforma, separando responsabilidades e evitando acoplamentos indevidos.

Cada módulo representa um domínio arquitetural independente.

Implementações futuras deverão preservar essa separação.

---

# Visão Geral

O PromptCoreLabs_AEOS é concebido como um Sistema Operacional de Engenharia Assistida por Inteligência Artificial.

Sua arquitetura organiza conhecimento, processos, agentes, modelos e execução em módulos especializados.

Nenhum módulo deverá concentrar responsabilidades pertencentes a outro domínio.

---

# Módulos Arquiteturais

## 1. Architecture

Responsável pelos artefatos arquiteturais permanentes.

Contém:

- visão;
- princípios;
- módulos;
- glossário;
- mapa arquitetural;
- roadmap;
- demais documentos estruturantes.

É a camada que define a identidade do AEOS.

---

## 2. Governance

Responsável pela governança da engenharia.

Inclui:

- TLC Spec-Driven v3;
- fluxos de aprovação;
- gates;
- auditoria;
- Architecture Decision Records (ADR);
- políticas;
- padrões;
- critérios de qualidade.

Seu objetivo é garantir consistência, rastreabilidade e disciplina arquitetural.

---

## 3. Knowledge

Responsável pelo conhecimento estruturado da plataforma.

Inclui:

- documentação permanente;
- padrões reutilizáveis;
- playbooks;
- catálogos;
- documentação técnica;
- documentação funcional.

Conhecimento deverá existir independentemente dos agentes que o utilizam.

---

## 4. Memory

Responsável pela memória organizacional.

Inclui:

- RAG;
- embeddings;
- índices;
- memória semântica;
- histórico de decisões;
- contexto persistente.

Seu objetivo é preservar conhecimento utilizável ao longo do tempo.

---

## 5. Agents

Responsável pelos agentes especializados.

Exemplos:

- arquiteto;
- planejador;
- executor;
- auditor;
- revisor;
- documentador;
- pesquisador;
- testador;
- orquestrador.

Cada agente deverá possuir responsabilidade claramente definida.

---

## 6. Runtime

Responsável pela execução operacional da plataforma.

Inclui:

- Harness Engineering;
- pipelines;
- workflows;
- orquestração;
- execução de agentes;
- filas;
- automações.

O Runtime executa.

Ele não define arquitetura.

---

## 7. Models

Responsável pela abstração dos modelos de IA.

Inclui:

- provedores cloud;
- modelos locais;
- Ollama;
- LM Studio;
- OpenAI;
- Anthropic;
- Gemini;
- futuros provedores.

Seu objetivo é permitir substituição transparente de modelos.

---

## 8. Integrations

Responsável pela comunicação com sistemas externos.

Exemplos:

- GitHub;
- Docker;
- Tailscale;
- Amazon Q;
- IDEs;
- bancos de dados;
- APIs;
- MCP Servers;
- ferramentas futuras.

Integrações nunca deverão conter lógica arquitetural.

---

## 9. Projects

Responsável pelos projetos construídos utilizando o AEOS.

Cada projeto deverá possuir isolamento próprio.

Projetos não deverão alterar a arquitetura do AEOS.

---

## 10. Templates

Responsável pelos artefatos reutilizáveis.

Inclui:

- templates TLC;
- templates de agentes;
- templates de documentação;
- templates de projetos;
- templates de ADR;
- templates de especificações.

---

## 11. Observability

Responsável pelo monitoramento da plataforma.

Inclui:

- logs;
- métricas;
- eventos;
- telemetria;
- auditoria operacional;
- tracing.

Seu objetivo é tornar o comportamento da plataforma observável.

---

## 12. Security

Responsável pelos aspectos de segurança.

Inclui:

- credenciais;
- políticas;
- controle de acesso;
- gerenciamento de segredos;
- conformidade;
- auditoria de segurança.

Nenhum segredo deverá ser armazenado em documentação permanente.

---

## 13. Bootstrap

Módulo oficial de primeiro nível da arquitetura do PromptCoreLabs_AEOS.

Sua implementação documental será realizada posteriormente.

---

# Relação entre os módulos

A plataforma deverá respeitar a seguinte organização conceitual:

Architecture
↓
Governance
↓
Bootstrap
↓
Knowledge
↓
Memory
↓
Agents
↓
Runtime
↓
Models
↓
Integrations
↓
Projects

Observability e Security atuam transversalmente sobre toda a plataforma.

Bootstrap é reconhecido como módulo permanente do ecossistema AEOS.

---

# Princípios de Dependência

A arquitetura deverá obedecer às seguintes regras:

- módulos superiores não dependem de módulos inferiores para definir sua identidade;
- conhecimento não depende da execução;
- agentes não armazenam conhecimento permanente;
- runtime executa processos, mas não governa a arquitetura;
- modelos são componentes substituíveis;
- integrações são adaptadores, não regras de negócio;
- projetos utilizam o AEOS, mas não redefinem sua arquitetura.

---

# Harness Engineering

O Harness Engineering deixa de representar a plataforma como um todo.

Dentro da arquitetura do PromptCoreLabs_AEOS, ele passa a constituir exclusivamente o subsistema Runtime.

Sua responsabilidade é executar os fluxos definidos pela arquitetura.

Ele não possui autoridade para alterar princípios arquiteturais, governança ou conhecimento permanente.

---

# Evolução da Plataforma

Novos módulos poderão ser incorporados futuramente.

Entretanto, qualquer novo módulo deverá:

- possuir responsabilidade claramente definida;
- evitar sobreposição funcional;
- respeitar os princípios arquiteturais;
- manter baixo acoplamento;
- preservar alta coesão.

Toda criação de novos módulos deverá ser formalmente registrada por meio de um Architecture Decision Record (ADR).

---

# Estado Arquitetural

Este documento estabelece a decomposição arquitetural oficial do PromptCoreLabs_AEOS.

Ele deverá servir como referência para a organização lógica da plataforma, independentemente da estrutura física adotada pelo repositório.
