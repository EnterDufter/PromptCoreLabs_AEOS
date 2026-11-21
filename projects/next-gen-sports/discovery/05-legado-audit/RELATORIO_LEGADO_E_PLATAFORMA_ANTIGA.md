# Auditoria Técnica de Legado — NextGen Sports (NGS)

**Data:** 2026-11-20  
**Responsável:** Cipher DevSec (Engenharia TLC & DevSecOps)  
**Escopo:** Investigação e inventário técnico (zero código novo) para subsidiar a nova fase do produto (rede social especializada / possível base FeedHive White Label).

---

## 1. Inventário do Legado Auditado

### 1.1 `C:\PromptCore_Labs\legacy\NextGenSports`

| Caminho | Tipo / Conteúdo | Estado Atual |
|---|---|---|
| `README.md` | Visão inicial focada em kart, telemetria e Digital Twin | Desatualizado (PoC inicial) |
| `skill_tree.json` | JSON com 3 categorias (`Técnica de Pista`, `Preparação Física`, `Gestão de Carreira`), 6 níveis, XP e badges | Conceito aproveitável (estrutura simples) |
| `telemetry_simulator.py` | Script Python CLI (`random`, `statistics`, `json`) simulando 10 voltas e validando badge (`<= 0.5s`) com CTAs RevOps/LMS hardcoded | Obsoleto (simulação aleatória + URLs fictícias) |
| `docs\Jornadas\` | 6 PNGs de fluxos/jornadas (Atleta, Profissional, Liga, Mercado, Visão Macro, Timeline) | Referência visual histórica |
| `mvp\docs\` | Diretório vazio | Sem artefatos |
| `landing-page-project\` | Projeto **Next.js 14.2.33 + React 18.3.1 + TypeScript 5.8.3 + Tailwind CSS 3.4.17** (`next/font` Inter), docs `00` a `08`, prompts `.codex/`, `src/data/landingContent.ts`, 8 seções em `src/sections/` e 5 componentes em `src/components/` | Protótipo estático funcional, sem backend/API |

### 1.2 `C:\Users\eduma\Downloads\Edu Organizar\00 -  PromptCore Labs Projetos 2026\02 - Plataforma NGS`

> **Nota de cautela:** Documentação **muito desatualizada** (concebida como vertical do antigo *PromptCore ProjectOS*, antes do pivô para rede social especializada).

| Artefato | Conteúdo Principal | Estado Atual |
|---|---|---|
| `ngs_codex_complete_pack_v2/` (+ `.zip`) | 14 arquivos (`00` a `11`, `README`, `PROMPT_CURTO`): Product Planning, PRD, SDD, Estrutura de Pastas, Backlog, UX, Critérios de Aceite, Compatibilidade ProjectOS, Mock Data Guide e Roadmap. Propunha app Next.js + React + TS + Tailwind **100% frontend com dados mockados** (`src/data/mock*.ts`) dividido em 4 macroáreas (`League Experience`, `Talent Network`, `Sponsorship OS`, `Impact / Incentive OS`) + `Admin White-label`. | Obsoleto na arquitetura e escopo |
| `ngs_process_first_addendum.zip` | 14 arquivos (`README.md`, `MANIFEST.md`, `docs/01` a `12`) acoplando a NGS ao motor *Process First* do ProjectOS: `Athlete Journey Canvas`, `Sports Funding Canvas`, `Fast-Track Documental`, `Evidence Layer Esportivo`, `Readiness Score` (7 dimensões), integração LMS/CRM/Telemetria e visão Edge/Cloud. | Conceitos isolados reaproveitáveis; acoplamento obsoleto |

---

## 2. O Que Está Completamente Obsoleto (Descartar)

1. **Acoplamento ao "PromptCore ProjectOS" e ao motor "Process First":** A documentação de `02 - Plataforma NGS` subordina a plataforma a um motor genérico de editais, fast-track documental e prestação de contas públicas, incompatível com o foco atual de rede social especializada.
2. **Escopo monolítico de 4 OS paralelos no MVP (`League Operations`, `Impact / Incentive OS`, `CRM Territorial`):** Gestão operacional de grid/check-in de ligas, leis de incentivo e articulação com secretarias/ONGs fogem do núcleo social/comunidade.
3. **Diretriz "frontend-only / sem backend / sem auth" (`03_SDD_NGS_MVP.md`):** Inviável para uma rede social com perfis reais, feed, relacionamentos e controle de acesso.
4. **Simulador `telemetry_simulator.py`:** Apenas um script de demonstração com `random.uniform` e links inexistentes (`https://nextgen.sports/premium`, `https://lms.nextgen.sports/...`).
5. **Diretório vazio `mvp\docs\` e prompts `.codex/` antigos:** Sem valor técnico residual.

---

## 3. O Que É Realmente Reaproveitável para a Nova Fase

Mesmo com a mudança de direcionamento para **rede social especializada** (e eventual uso de **base FeedHive White Label**), os seguintes ativos conceituais e de domínio têm valor direto:

1. **Modelo de Perfil do Atleta e Sub-scores (`03_SDD_NGS_MVP.md` & `07_readiness_score_e_indicadores.md`):**
   - Os tipos `Athlete` (`level`, `readinessScore`, `performanceScore`, `brandScore`, `evidenceScore`, `seekingSponsorship`, `availableForAcademy`, `tags`) e `ReadinessBreakdown` fornecem uma base clara para **perfil rico de usuário/talento** e filtros de descoberta na rede.
   - A regra de negócio de que **todo score deve ser explicável e baseado em evidências** (sem julgamento opaco) é um diferencial forte.
2. **Conceito de Evidence Layer (`05_evidence_layer_esportivo.md`):**
   - Estrutura de comprovação (tipo, origem, mídia/arquivo, data, responsável, validação humana) pode ser adaptada para **posts verificados, conquistas no feed e mídia-kit dinâmico** do atleta.
3. **Taxonomia de Gamificação (`skill_tree.json`):**
   - A divisão em trilhas (`Técnica`, `Preparação Física`, `Gestão de Carreira`) com XP e badges é reaproveitável como **mecânica de engajamento e reputação** no perfil social.
4. **Identidade e Copy Institucional (`landing-page-project/docs/00` e `01`, `src/data/landingContent.ts`):**
   - Tom sóbrio e profissional (*engineering dossier*, evitando estética gamer/infantil e promessas irreais) e paleta/tipografia (`Inter`, azul petróleo, grafite, off-white) servem como referência para a camada institucional/onboarding.
5. **Requisitos de Segurança e LGPD (`09_infraestrutura_ia_edge_cloud_ngs.md`):**
   - Diretrizes de **proteção de dados de menores**, consentimento explícito, segregação por organização/tenant (essencial em modelo White Label) e trilha de auditoria.

---

## 4. Veredito Técnico

- **Código aproveitável diretamente:** Praticamente **zero** (apenas referência visual/copy da `landing-page-project` em Next.js 14 e o JSON simples de `skill_tree.json`).
- **Conhecimento de domínio aproveitável:** **Alto** no que diz respeito ao modelo de perfil do atleta (`Talent Network`), `Readiness Score` explicável, `Evidence Layer` e requisitos de LGPD para menores.
- **Recomendação:** Arquivar o pacote `02 - Plataforma NGS` apenas como referência histórica de domínio e iniciar a nova especificação (SDD/PRD) já ancorada na arquitetura da rede social especializada / avaliação técnica da base FeedHive White Label.
