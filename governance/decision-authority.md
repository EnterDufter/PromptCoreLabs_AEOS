=========================================
OBJETIVO
=========================================

Definir o modelo oficial de autoridade do AEOS.

Este documento estabelece quem possui autoridade para tomar decisões, quem pode executar ações, quem pode aprovar artefatos e quem atua apenas como apoio técnico.

O objetivo é impedir ambiguidades em ambientes multiagentes e garantir que nenhuma IA possa alterar arquitetura, escopo ou governança por conta própria.

O princípio fundamental é:

"A autoridade pertence ao sistema de governança, nunca ao modelo de IA."

Modelos LLM são instrumentos de execução e raciocínio.

Nunca são autoridades.

=========================================
PRINCÍPIOS
=========================================

O documento deve estabelecer claramente:

•

Toda decisão possui um responsável.

•

Toda aprovação possui um responsável.

•

Toda execução possui um executor.

•

Toda revisão possui um revisor.

•

Nenhum executor aprova o próprio trabalho.

•

Nenhum agente altera governança.

•

Nenhum LLM cria autoridade.

•

Nenhum modelo promove artefatos sozinho.

•

Toda decisão relevante deixa rastreabilidade.

•

Toda autoridade pode ser auditada.

=========================================
NÍVEIS DE AUTORIDADE
=========================================

Definir os seguintes níveis.

Nível 1

Sponsor

Responsável pela visão estratégica.

Pode:

aprovar

cancelar

priorizar

redirecionar iniciativas

Não participa da implementação técnica.

————————————

Nível 2

Chief Architect

Responsável pela arquitetura do AEOS.

Pode:

aprovar arquitetura

aprovar mudanças estruturais

aprovar ADRs

aprovar novos módulos

aprovar mudanças fundacionais

Não executa implementação operacional.

————————————

Nível 3

Project Architect

Responsável pela arquitetura de um projeto específico.

Pode:

aprovar Design

aprovar SDD

aprovar decisões técnicas do projeto

Não altera arquitetura fundacional do AEOS.

————————————

Nível 4

Reviewer / Auditor

Responsável por auditoria.

Pode:

aprovar qualidade

reprovar entregas

solicitar retrabalho

abrir não conformidades

Nunca implementa diretamente.

————————————

Nível 5

Builder

Responsável pela implementação.

Pode:

escrever código

criar documentos

executar tarefas

produzir artefatos

Nunca aprova o próprio trabalho.

————————————

Nível 6

Execution Cell

Representa a unidade operacional do Runtime.

Pode:

executar workflows

invocar agentes

coordenar modelos

coordenar memória

coordenar ferramentas

Nunca altera governança.

Nunca aprova arquitetura.

Nunca altera escopo.

————————————

Nível 7

Agent

Especialista operacional.

Pode executar apenas sua especialidade.

Exemplos:

Builder Agent

Reviewer Agent

Documentation Agent

Testing Agent

Security Agent

Migration Agent

Planner Agent

Nunca decide políticas.

Nunca aprova mudanças estruturais.

————————————

Nível 8

LLM

Representa qualquer modelo de IA.

Exemplos:

GPT

Claude

Gemma

Qwen

DeepSeek

Llama

Mistral

etc.

Pode:

gerar texto

raciocinar

escrever código

explicar

sugerir

analisar

Nunca possui autoridade.

Nunca aprova.

Nunca altera governança.

Nunca cria decisões oficiais.

=========================================
AUTHORITY MATRIX
=========================================

Criar uma matriz semelhante à seguinte.

                Decide  Aprova  Executa  Revisa  Observa

Sponsor            ✓        ✓        —        —        ✓

Chief Architect    ✓        ✓        —        ✓        ✓

Project Architect  ✓        ✓        —        ✓        ✓

Reviewer           —        ✓        —        ✓        ✓

Builder            —        —        ✓        —        ✓

Execution Cell     —        —        ✓        —        ✓

Agent              —        —        ✓        —        —

LLM                —        —      Auxilia    —        —

Adicionar uma explicação detalhada de cada coluna.

=========================================
REGRAS FUNDAMENTAIS
=========================================

Registrar explicitamente regras como:

Uma autoridade não pode delegar responsabilidade sem registro.

Execução não implica aprovação.

Raciocínio não implica autoridade.

Automação não implica autonomia.

Fallback não altera autoridade.

Troca de modelo não altera governança.

Troca de IDE não altera governança.

Troca de executor não altera responsabilidade.

=========================================
SEPARAÇÃO ENTRE PAPEL E TECNOLOGIA
=========================================

Explicar claramente que:

Codex

Cursor

Claude Code

Amazon Q

Ollama

LM Studio

OpenAI

Anthropic

Gemini

são tecnologias.

Não são papéis.

O papel "Builder" pode utilizar qualquer tecnologia.

O papel "Reviewer" pode utilizar qualquer tecnologia.

O papel "Architect" pode utilizar qualquer tecnologia.

O papel permanece.

A ferramenta muda.

=========================================
EXECUTION CELL
=========================================

Explicar que a Execution Cell opera por delegação.

Ela coordena.

Ela nunca governa.

Ela recebe autoridade.

Nunca cria autoridade.

=========================================
DECISION TRACEABILITY
=========================================

Toda decisão relevante deve registrar:

ID

Autoridade responsável

Data

Contexto

Justificativa

Impacto

Artefatos afetados

ADR relacionado (quando existir)

=========================================
RELAÇÃO COM OUTROS DOCUMENTOS
=========================================

Explicar que este documento será utilizado por:

operating-model.md

roles.md

stage-gates.md

runtime/

agents/

policies/

standards/

ADR Process

Architecture

