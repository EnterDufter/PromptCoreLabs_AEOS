# TLC Spec-Driven v3 - DESIGN

**Tipo**: Metodologia / design base  
**Entrada**: `C:\PromptCore_Labs\.specs\methodology\tlc-spec-driven-v3\specify.md`  
**Status**: Aprovado pelo usuario  
**Data**: 2026-06-30  
**Escopo**: Arquitetura detalhada da metodologia TLC Spec-Driven v3 no workspace `C:\PromptCore_Labs`  

## 1. Objetivo

Definir a arquitetura operacional da metodologia TLC Spec-Driven v3 para que iniciativas futuras sigam um fluxo governado, rastreavel e auditavel:

```text
SPECIFY -> DESIGN -> TASKS -> EXECUTE -> VALIDATE
```

Este documento descreve responsabilidades por etapa, regras de transicao, templates, convencoes de nomenclatura e padroes de rastreabilidade. Ele nao define arquitetura de software de nenhum app especifico.

## 2. Arquitetura Detalhada da Metodologia

### 2.1 Camadas

| Camada | Responsabilidade | Local |
|---|---|---|
| Metodologia | Define regras, templates, criterios e validacao TLC-v3. | `.specs\methodology\tlc-spec-driven-v3\` |
| Apps | Armazena specs de apps web, mobile ou futuras categorias. | `.specs\apps\<tipo>\<app-slug>\` |
| Projects | Armazena governanca, contexto fundacional e organizacional. | `.specs\projects\<project-slug>\` |
| Legacy | Preserva historico e redirecionamentos. | `.specs\archive\legacy\` e READMEs de ponte |

### 2.2 Fluxo Principal

```text
Entrada de iniciativa
  -> SPECIFY: escopo, requisitos, seguranca, qualidade
  -> Gate MCP-01: aprovacao de escopo
  -> DESIGN: arquitetura e decisoes tecnicas/metodologicas
  -> Gate MCP-02: aprovacao de design
  -> TASKS: backlog atomico e rastreavel
  -> Gate MCP-03: aprovacao de execucao
  -> EXECUTE: execucao controlada dos artefatos ou implementacao do projeto
  -> Gate MCP-04: handoff de validacao
  -> VALIDATE: auditoria, qualidade e aceite
  -> Registro RAG / STATE
```

### 2.3 Papel dos IDEs e Ferramentas

| Ferramenta | Papel previsto | Observacao |
|---|---|---|
| Codex | SPECIFY e instalacao documental controlada. | Deve evitar contaminacao de contexto entre projetos. |
| Antigravity | DESIGN, TASKS e EXECUTE. | Deve consumir specs aprovadas antes de agir. |
| Cursor | VALIDATE. | Deve revisar conformidade, qualidade e regressao. |
| PaperClip | Orquestracao futura do pipeline. | Triggers, heartbeats, monitoramento e registro no RAG. |
| OmniRoute | Gateway de modelos e fallback. | Roteamento cloud/local e estrategia EBITDA Shield. |
| MCPs | Pontos de governanca. | Controlam transicoes e validam pre-condicoes. |

## 3. Responsabilidades por Etapa

| Etapa | Responsavel principal previsto | Entrada | Saida | Nao deve fazer |
|---|---|---|---|---|
| SPECIFY | Codex | Ideia, contexto, fontes | `specify.md` | Design, tasks, codigo |
| DESIGN | Antigravity ou agente designado | `specify.md` aprovado | `design.md` | Implementar codigo |
| TASKS | Antigravity ou agente designado | `design.md` aprovado | `tasks.md` | Executar tarefas |
| EXECUTE | Antigravity ou executor aprovado | `tasks.md` aprovado | `execute.md`, artefatos, logs | Mudar escopo sem retorno ao SPECIFY |
| VALIDATE | Cursor ou auditor aprovado | Artefatos executados | `validate.md`, checklist, aceite | Corrigir sem registro ou nova task |

## 4. Regras de Transicao

| Gate | Transicao | Pre-condicoes | Registro |
|---|---|---|---|
| MCP-01 | SPECIFY -> DESIGN | `specify.md` existe, status aprovado, requisitos com IDs. | `rag.md` e status no artefato. |
| MCP-02 | DESIGN -> TASKS | `design.md` existe, decisoes e arquitetura aprovadas. | `rag.md`. |
| MCP-03 | TASKS -> EXECUTE | `tasks.md` existe, backlog aprovado e sem ambiguidades criticas. | `rag.md`. |
| MCP-04 | EXECUTE -> VALIDATE | Execucao documentada, artefatos gerados, desvios registrados. | `execute.md` e `rag.md`. |
| MCP-05 | VALIDATE -> DONE | Checklist validado, pendencias classificadas, aceite registrado. | `validate.md` e `rag.md`. |

### 4.1 Regra de Reabertura

Se uma etapa descobrir requisito novo, risco relevante ou mudanca de escopo, a iniciativa deve retornar para SPECIFY ou DESIGN conforme a origem do problema.

### 4.2 Regra de Bloqueio

Uma etapa com status `Aguardando aprovacao do usuario` bloqueia a criacao operacional da etapa seguinte, exceto quando o usuario autorizar explicitamente um pacote metodologico completo, como nesta instalacao.

## 5. Templates Para Apps Futuros

### 5.1 Web

Base em:

`C:\PromptCore_Labs\.specs\apps\web\_template\`

Uso esperado:

```text
C:\PromptCore_Labs\.specs\apps\web\<app-slug>\
  specify.md
  design.md
  tasks.md
  execute.md
  validate.md
```

### 5.2 Mobile

Base em:

`C:\PromptCore_Labs\.specs\apps\mobile\_template\`

Uso esperado:

```text
C:\PromptCore_Labs\.specs\apps\mobile\<app-slug>\
  specify.md
  design.md
  tasks.md
  execute.md
  validate.md
```

### 5.3 Projects

Base em:

`C:\PromptCore_Labs\.specs\projects\_template\`

Uso esperado:

```text
C:\PromptCore_Labs\.specs\projects\<project-slug>\
  specify.md
  design.md
  tasks.md
  execute.md
  validate.md
  STATE.md
```

## 6. Convencoes de Nomenclatura

- Slugs: minusculas, sem acentos, separados por hifen.
- IDs de metodologia: `TLC-<AREA>-NNN`.
- IDs de app web: `<APP>-WEB-<AREA>-NNN`.
- IDs de app mobile: `<APP>-MOB-<AREA>-NNN`.
- IDs de projeto: `<PROJECT>-PRJ-<AREA>-NNN`.
- Arquivos de etapa: `specify.md`, `design.md`, `tasks.md`, `execute.md`, `validate.md`.
- Arquivos de estado: `STATE.md`, `rag.md`, `README.md`.

## 7. Padroes de Rastreabilidade

Cada artefato deve declarar:

- entrada usada;
- saida esperada;
- status;
- data;
- etapa TLC;
- fontes de verdade;
- decisoes abertas;
- criterios de aceite;
- proxima etapa permitida.

Cada requisito deve ter:

- ID estavel;
- descricao;
- criterio de aceite;
- origem, quando relevante;
- impacto em etapas futuras, quando relevante.

## 8. PaperClip e Automacao Futura

PaperClip deve ser integrado como orquestrador, nao como substituto da aprovacao humana.

Responsabilidades futuras:

- disparar triggers por mudanca de status;
- emitir heartbeats por etapa;
- registrar eventos no RAG;
- acionar MCPs de transicao;
- solicitar modelos ao OmniRoute conforme complexidade;
- interromper fluxo quando criterios de entrada nao forem atendidos.

## 9. OmniRoute e Fallback

OmniRoute deve atuar como gateway de modelos para:

- roteamento cloud/local;
- fallback quando um provedor falhar;
- controle de custo;
- uso de modelos locais para tarefas de baixa/media criticidade;
- modelos cloud para raciocinio arquitetural ou auditorias de alto impacto.

O fallback nao deve alterar escopo nem aprovar transicoes sozinho.

## 10. Decisoes de Design Metodologico

| ID | Decisao | Status |
|---|---|---|
| TLC-DEC-001 | Separar metodologia de apps e projects. | Aprovada |
| TLC-DEC-002 | Usar templates por tipo de iniciativa. | Aprovada |
| TLC-DEC-003 | Tratar MCPs como gates de governanca. | Planejada |
| TLC-DEC-004 | Tratar PaperClip como orquestrador futuro. | Planejada |
| TLC-DEC-005 | Registrar decisoes em `rag.md`. | Aprovada |

## 11. Estado Atual

Design metodologico aprovado pelo usuario para suportar a metodologia TLC-v3.
