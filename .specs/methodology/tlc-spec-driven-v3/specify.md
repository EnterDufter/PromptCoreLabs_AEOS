# TLC Spec-Driven v3 - SPECIFY

**Tipo**: Metodologia / spec base  
**Escopo**: Processo TLC Spec-Driven v3 para projetos em `C:\PromptCore_Labs`  
**Saida**: `C:\PromptCore_Labs\.specs\methodology\tlc-spec-driven-v3\specify.md`  
**Status**: Aprovado pelo usuario  
**Data**: 2026-06-30  
**Etapa TLC**: SPECIFY  

## 1. Controle de Escopo

### 1.1 Objetivo

Definir uma especificacao base, limpa e reutilizavel para o uso do TLC Spec-Driven v3 dentro do workspace `C:\PromptCore_Labs`, sem misturar metodologia com requisitos de apps, produtos ou iniciativas antigas.

Esta especificacao descreve o processo, os artefatos, as regras de rastreabilidade, os criterios de seguranca e os criterios de qualidade que devem orientar projetos futuros antes de qualquer etapa de design, tasking ou execucao.

### 1.2 Dentro do Escopo

- Estrutura padrao de pastas `.specs`.
- Separacao entre metodologia, apps, projetos fundacionais e legado.
- Regras para a etapa SPECIFY.
- Regras de aprovacao entre etapas.
- Requisitos funcionais da metodologia.
- Requisitos nao funcionais da metodologia.
- Arquitetura conceitual do fluxo TLC.
- Arquitetura de dados dos artefatos de especificacao.
- Criterios de seguranca documental e operacional.
- Criterios de qualidade para specs.

### 1.3 Fora do Escopo

- Codigo de aplicacao.
- Design visual.
- `design.md`.
- `tasks.md`.
- Execucao tecnica.
- Decisoes especificas de produto, web, mobile, backend ou infraestrutura.
- Conteudo comercial de apps como PromptCore Labs Website, NextGen Sports ou Project.OS.

## 2. Estrutura Padrao de Pastas

```text
C:\PromptCore_Labs\.specs\
  methodology\
    tlc-spec-driven-v3\
      specify.md

  apps\
    web\
      <app-slug>\
        specify.md
    mobile\
      <app-slug>\
        specify.md

  projects\
    <project-slug>\
      PROJECT.md
      STATE.md
      ORG_CHART.md
      <outros-documentos-fundacionais>.md

  archive\
    legacy\
      README.md
```

## 3. Requisitos Funcionais

| ID | Requisito | Criterios de Aceite |
|---|---|---|
| TLC-FR-001 | A metodologia deve separar specs de metodologia e specs de apps. | Nenhum requisito de app deve ficar em `methodology\tlc-spec-driven-v3`. |
| TLC-FR-002 | Toda iniciativa deve iniciar em SPECIFY. | Antes de design, tasks ou codigo, deve existir um `specify.md` aprovado. |
| TLC-FR-003 | Toda spec deve declarar escopo. | O documento deve conter dentro do escopo, fora do escopo e objetivo. |
| TLC-FR-004 | Todo requisito deve ter ID estavel. | Requisitos funcionais, nao funcionais, seguranca e qualidade devem usar IDs rastreaveis. |
| TLC-FR-005 | Toda spec deve conter criterios de aceite. | Cada requisito deve indicar como sera validado ou considerado aceito. |
| TLC-FR-006 | A metodologia deve impedir avanco automatico de etapa. | DESIGN, TASKS e EXECUTE so podem ocorrer apos aprovacao explicita do usuario. |
| TLC-FR-007 | A metodologia deve preservar rastreabilidade de reorganizacoes. | Caminhos antigos relevantes devem manter README apontando para a nova fonte de verdade. |
| TLC-FR-008 | A metodologia deve separar projetos fundacionais de apps. | Governanca, estado e estrutura organizacional devem ficar em `projects`, nao em `apps`. |
| TLC-FR-009 | A metodologia deve suportar multiplos tipos de app. | Specs de web, mobile e futuras categorias devem ter pastas proprias. |
| TLC-FR-010 | A metodologia deve registrar pendencias e decisoes abertas. | Toda spec deve explicitar decisoes pendentes quando houver incerteza relevante. |

## 4. Requisitos Nao Funcionais

| ID | Requisito | Criterios de Aceite |
|---|---|---|
| TLC-NFR-001 | Clareza. | Um leitor deve entender rapidamente se o documento e metodologia, app, projeto fundacional ou legado. |
| TLC-NFR-002 | Baixo acoplamento. | Mudancas em uma spec de app nao devem exigir alteracao da spec base da metodologia. |
| TLC-NFR-003 | Simplicidade operacional. | A estrutura deve ser facil de navegar manualmente pelo filesystem. |
| TLC-NFR-004 | Auditabilidade. | Movimentos e fontes de verdade devem ficar documentados por README ou metadados no arquivo. |
| TLC-NFR-005 | Evolutividade. | A estrutura deve aceitar novos apps e projetos sem reescrever a metodologia. |
| TLC-NFR-006 | Nao ambiguidade. | Arquivos genericos como `apps\web\specify.md` devem ser evitados; usar sempre um slug de app. |
| TLC-NFR-007 | Preservacao historica. | Conteudo legado nao deve ser apagado sem aprovacao explicita. |
| TLC-NFR-008 | Consistencia linguistica. | Specs devem usar termos previsiveis: SPECIFY, DESIGN, TASKS, EXECUTE, requisitos e criterios de aceite. |

## 5. Arquitetura de Software da Metodologia

### 5.1 Fluxo TLC

```text
Ideia / iniciativa
  -> SPECIFY
  -> aprovacao explicita
  -> DESIGN
  -> aprovacao explicita
  -> TASKS
  -> aprovacao explicita
  -> EXECUTE
  -> verificacao
  -> registro de estado
```

### 5.2 Responsabilidades por Etapa

| Etapa | Responsabilidade | Artefato Esperado |
|---|---|---|
| SPECIFY | Definir o que deve existir e quais criterios governam o escopo. | `specify.md` |
| DESIGN | Definir solucao, arquitetura detalhada e decisoes tecnicas. | `design.md` |
| TASKS | Quebrar o design aprovado em tarefas executaveis. | `tasks.md` |
| EXECUTE | Implementar, validar e registrar resultado. | Codigo, testes, logs e estado atualizado |

### 5.3 Regra de Bloqueio

Enquanto uma etapa estiver com status "Aguardando aprovacao do usuario", nenhuma etapa seguinte deve ser criada ou executada.

## 6. Arquitetura de Dados

### 6.1 Entidades Documentais

| ID | Entidade | Campos Esperados |
|---|---|---|
| TLC-DATA-001 | SpecDocument | titulo, tipo, escopo, status, data, etapa, fontes, requisitos |
| TLC-DATA-002 | Requirement | id, descricao, criterio_de_aceite, prioridade opcional |
| TLC-DATA-003 | ScopeBlock | dentro_do_escopo, fora_do_escopo, premissas |
| TLC-DATA-004 | ArchitectureBlock | visao_conceitual, responsabilidades, restricoes |
| TLC-DATA-005 | SecurityCriterion | id, criterio, aceite |
| TLC-DATA-006 | QualityCriterion | id, criterio, aceite |
| TLC-DATA-007 | TraceabilityRecord | origem, destino, motivo, data |
| TLC-DATA-008 | DecisionRecord | id, decisao, status, data, impacto |

### 6.2 Convencoes de Nomes

- Slugs devem usar letras minusculas e hifens.
- Apps web devem ficar em `.specs\apps\web\<app-slug>\`.
- Apps mobile devem ficar em `.specs\apps\mobile\<app-slug>\`.
- Projetos fundacionais devem ficar em `.specs\projects\<project-slug>\`.
- Metodologias devem ficar em `.specs\methodology\<methodology-slug>\`.
- Caminhos antigos devem receber README quando forem substituidos por nova fonte de verdade.

## 7. Criterios de Seguranca

| ID | Criterio | Aceite |
|---|---|---|
| TLC-SEC-001 | Nao expor segredos em specs. | Specs nao devem conter chaves, tokens, senhas ou credenciais. |
| TLC-SEC-002 | Preservar repositorios privados. | Documentos devem respeitar a politica PCL de repositorios privados para IP e segredos. |
| TLC-SEC-003 | Separar contexto sensivel. | Dados sensiveis de clientes, leads ou operacoes devem ser minimizados ou referenciados fora da spec publica. |
| TLC-SEC-004 | Registrar premissas. | Quando uma fonte externa nao puder ser verificada, a spec deve declarar a premissa. |
| TLC-SEC-005 | Evitar escopo implicito. | Nenhum agente deve inferir implementacao sensivel sem aprovacao explicita. |
| TLC-SEC-006 | Manter rastreabilidade de movimentos. | Reorganizacoes devem deixar apontadores para evitar perda de contexto. |

## 8. Criterios de Qualidade

| ID | Criterio | Aceite |
|---|---|---|
| TLC-QUAL-001 | Separacao de preocupacoes. | Metodologia, apps e projetos fundacionais devem estar em pastas distintas. |
| TLC-QUAL-002 | Rastreabilidade. | Requisitos e documentos movidos devem poder ser encontrados por caminho novo ou README no caminho antigo. |
| TLC-QUAL-003 | Precisao de escopo. | A spec deve dizer claramente o que nao sera feito. |
| TLC-QUAL-004 | Simplicidade. | O documento deve ser suficiente para governar a etapa sem excesso de cerimonia. |
| TLC-QUAL-005 | Aprovacao explicita. | Cada transicao de etapa deve depender de aprovacao do usuario. |
| TLC-QUAL-006 | Reusabilidade. | A spec base deve servir para novos apps sem conter detalhes de app especifico. |
| TLC-QUAL-007 | Consistencia de IDs. | IDs devem ser unicos dentro do documento e seguir prefixo coerente. |
| TLC-QUAL-008 | Nao contaminacao contextual. | Specs novas nao devem herdar requisitos de projetos antigos sem declaracao de fonte e motivo. |

## 9. Estado Atual

Esta especificacao base da metodologia foi aprovada pelo usuario.

**Proxima etapa permitida mediante solicitacao explicita: DESIGN.**
