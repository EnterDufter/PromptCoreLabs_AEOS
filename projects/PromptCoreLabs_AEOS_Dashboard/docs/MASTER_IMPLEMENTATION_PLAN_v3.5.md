# 🚀 Master Implementation Plan v3.0.4 PROD & Sprint Roadmap
**PCL AEOS — Artificial Intelligence Engineering Operation System**  
**Subtítulo Oficial:** Cognitive Engineering Substrate  
*Plano de Implementação Mestre por Sprints — Engenharia Orientada a Especificação (Spec-Driven Development)*  
**Autor:** Eduardo Machado (Principal Systems & AI Architect | Founder, PromptCore Labs)  
**Co-Autor:** Antigravity IDE (Agentic Engineering Pair)  
**Versão Oficial:** v3.0.4 PROD  
**Design System Canônico:** `C:\PromptCore_Labs\legacy\liquid_glass_bento_grid_system.html`  
**Porta Normativa:** Stage Gates TLC v3 Homologation  

---

## 🏛️ Estrutura de Governança por Sprints & Definition of Done (DoD)

Cada Sprint obedece rigorosamente ao **TLC v3 Stage Gate Protocol**:
1. **Gate G-01 (Spec Compliance)**: Implementação alinhada 100% aos requisitos do [PRD](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/docs/PRD_PCL_AEOS_v3.5.md) e arquitetura do [SDD](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/docs/SDD_PCL_AEOS_v3.5.md).
2. **Gate G-02 (Type Integrity & Zero-Lint)**: Compilação TypeScript com zero warnings/errors (`tsc --noEmit`).
3. **Gate G-03 (Visual & Responsive Verification)**: Inspeção visual via navegador integrado/subagente em resoluções Desktop (1536px) e Mobile (390px).
4. **Gate G-04 (Build & Immutability)**: `npm run build` gerando bundle em `dist/` e atestação com hash SHA-256.

---

## 🗓️ Roadmap de Sprints

### Sprint 1: Identidade Oficial de Marca, Header Executivo & Higienização de Idiomas
- **Epic**: `EPIC-01: Brand Identity & Header Consolidation`
- **Tarefas de Engenharia**:
  1. Copiar `C:\PromptCore_Labs\assets\PCL_Logo_Transparente.png` para `public/assets/`.
  2. Refatorar [Header.tsx](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/layout/Header.tsx) para renderizar o logotipo oficial transparente e migrar os botões de idioma para dentro do dropdown do usuário e `SettingsModal`.
- **DoD**: Logo oficial nítido sem corte; header com altura padrão de 56px; zero quebras de CSS.

---

### Sprint 2: Left Sidebar Tier 1 (Google Material Symbols & Colapso Fluido)
- **Epic**: `EPIC-02: Left Rail Navigation Modernization`
- **Tarefas de Engenharia**:
  1. Refatorar [LeftSidebar.tsx](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/layout/LeftSidebar.tsx).
  2. Integrar ícones SVG modernos correspondentes aos Google Material Symbols: `auto_stories`, `folder_open`, `article`, `psychology`, `extension`.
  3. Adicionar flyout tooltips táteis com animação Tailwind para o estado recolhido (64px).
  4. Eliminar qualquer sigla solta (`CR`, `AR`, `DE`).
- **DoD**: Transição fluida de 240px para 64px sem travamento de layout; ausência de qualquer texto cortado.

---

### Sprint 3: PCL Sovereign Drawer (CX do Drawer & Redimensionamento)
- **Epic**: `EPIC-03: Sovereign In-Context Drawer & Lifecycle`
- **Tarefas de Engenharia**:
  1. Renomear e refatorar `BitrixSlideOver.tsx` para `src/components/workspace/PCLArtifactDrawer.tsx`.
  2. Implementar hook de mouse drag para redimensionamento de largura com persistência no `localStorage` (380px a 850px).
  3. Adicionar listener global para `Escape` e backdrop click.
  4. Atualizar os imports em `App.tsx` e `types/index.ts`.
- **DoD**: Drawer ancorado à direita sem deslocamento livre; botões de fechar e recolher evidentes; redimensionamento fluido a 60fps.

---

### Sprint 4: Dual-Plex Splitter Resizável & Cortex Canvas Mobile Drawer
- **Epic**: `EPIC-04: Dual-Plex Split & Responsive Architecture Canvas`
- **Tarefas de Engenharia**:
  1. Refatorar [DualPlexWorkspace.tsx](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/workspace/DualPlexWorkspace.tsx) para incluir um divisor interativo com mouse drag no modo `dual`.
  2. No [CortexCanvas.tsx](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/workspace/CortexCanvas.tsx), adicionar margem de segurança de zoom (`pr-14`) e suporte a renderização como view alternativa dentro do `PCLArtifactDrawer`.
  3. No [RightSidebarStatus.tsx](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/layout/RightSidebarStatus.tsx), calibrar o z-index da aba retrátil (`z-20`).
- **DoD**: Divisor arrastável funcionando no desktop; em mobile (< 768px), layout 100% focado no chat com botão de abertura do Canvas em full sheet.

---

### Sprint 5: Super-Composer, Chips Inferiores & Token Aqua Orb (Apple OS X)
- **Epic**: `EPIC-05: Tactile Composer & Morphic Aqua Context Meter`
- **Tarefas de Engenharia**:
  1. Criar `src/components/composer/TokenAquaOrb.tsx` com estilos vítreos radiais, reflexo especular e keyframes de animação de glow temporal (5s e 2s).
  2. Refatorar [SuperChatbubble.tsx](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/composer/SuperChatbubble.tsx) e [PresetChips.tsx](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/components/composer/PresetChips.tsx) para posicionar os chips abaixo do textarea e alinhar a barra inferior sem quebra de texto.
- **DoD**: Morfismo perfeito da esfera para pílula no hover; glow temporal oscilante de 5s e 2s estritamente validado; zero colisão com histórico de mensagens.

---

### Sprint 6: Spatial UI, Refração Dinâmica de Luz & Circuito PCL
- **Epic**: `EPIC-06: Dynamic Light Refraction & PCL Silicon Chipset Substrate`
- **Tarefas de Engenharia**:
  1. Implementar listener global de `pointermove` em [App.tsx](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/App.tsx) injetando `--mouse-x` e `--mouse-y`.
  2. Atualizar [globals.css](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/styles/globals.css) incorporando as classes canônicas de `liquid_glass_bento_grid_system.html` (`.liquid-glass-card`, `.liquid-glass-pill`, `.glass-well`, `.glass-peg`) com camada de refração dinâmica pseudo-elemento `::before`.
  3. Adicionar grafismo vetorial SVG de microcircuitos com opacidade atenuada (3% a 4%) no substrato dos cartões.
  4. Reduzir a inclinação física dos cards para micro-elevação tátil estável (1° a 1.5°).
- **DoD**: Efeito de refração dinâmica fluida a 60fps sem consumo excessivo de CPU; visual sofisticado e discreto.

---

### Sprint 7: Tríade de Resiliência Distribuída & Transparência Ininterrupta
- **Epic**: `EPIC-07: Operational Resilience & Continuous State Feedback`
- **Tarefas de Engenharia**:
  1. Criar `src/services/resilience/idempotencyManager.ts`:
     - Cálculo de chave SHA-256 via HMAC do payload normalizado + timestamp em janela de 10s.
     - Cache LRU em memória com TTL de 15 minutos e bloqueio de cliques múltiplos idênticos.
  2. Criar `src/services/resilience/sagaOrchestrator.ts`:
     - Orquestrador de transações distribuídas (Sanitização ➔ Cognição ➔ Enclave Local ➔ BYOS).
     - Mecanismo de rollback compensatório mantendo checkpoints intactos e emitindo eventos para o Canvas DAG.
  3. Criar `src/services/resilience/circuitBreaker.ts`:
     - Máquina de estados tri-state (`CLOSED`, `OPEN`, `HALF-OPEN`) com limiar de 3 falhas ou timeouts > 15s.
     - Fallback automático e transparente para Ollama local (Gemma-3 / Qwen 2.5 Coder 7B a 0 MB VRAM GPU).
     - Emissão de badge na UI (`⚡ Fallback Soberano Local Ativado`).
  4. Implementar skeleton loaders animados, shimmers e badges de estado não-bloqueantes no chat e no Cortex Canvas.
- **DoD**: Teste de stress de 10 cliques simultâneos sem duplicação; simulação de falha de nuvem com chaveamento instantâneo para Ollama; visualização do nó em compensação no Cortex Canvas com checkpoint restaurado.

---

### Sprint 8: Headless Storage / Bring Your Own Storage (BYOS)
- **Epic**: `EPIC-08: Decoupled Sovereign Storage Integration`
- **Tarefas de Engenharia**:
  1. Expandir contratos de dados em [types/index.ts](file:///c:/PromptCore_Labs/projects/PromptCoreLabs_AEOS_Dashboard/src/types/index.ts) com `StorageMetadata`, `StorageProvider` e `syncStatus`.
  2. Adicionar micro-badges de custódia (Google Drive, OneDrive, Local Enclave) nos artefatos da Left Sidebar.
  3. Adicionar botão `[Abrir no Google Docs / Word Online ↗]` e seletor de despacho no `PCLArtifactDrawer`.
  4. Adicionar seção "Conectores de Armazenamento Soberano (BYOS)" no `SettingsModal.tsx`.
- **DoD**: Contratos tipados estritamente; interface pronta para conexão OAuth2 de ponta a ponta.

---

---

### Sprint 10: Motor Cognitivo Híbrido, Fast-Path Gemini 3.5 Flash-Lite & Monorepo Unificado
- **Epic**: `EPIC-10: Hybrid Cognitive Grounding & Fast-Path Inference Homologation`
- **Data de Conclusão**: 2026-10-28
- **Tarefas de Engenharia**:
  1. Criação do middleware backend Node.js (`pclAeosBackendPlugin` em `vite.config.ts`) com rotas `/api/aeos/infer`, `/api/aeos/search` e `/api/aeos/status`.
  2. Implementação de Fast-Path direto via Google Gemini Cloud (`gemini-3.5-flash-lite` / `gemini-3.6-flash`) consumindo a credencial criptografada em AES-256-GCM do cofre do OmniRoute em memória, com latência real de ~3.4s a 6.4s.
  3. Adição de parser nativo para Server-Sent Events (SSE) do OmniRoute (`:20130`), eliminando o erro de sintaxe JSON.
  4. Implementação de fail-fast TCP sub-segundo (`300ms`) e failover imediato para Ollama local (`:11434`, `qwen2.5-coder:7b-instruct-q4_K_M`) com `keep_alive: '60m'`.
  5. Refatoração de `intelligentGroundingService.ts` e `localKnowledgeService.ts` com separação de contexto: consultas abertas recebem respostas naturais de mercado padrão Gemini, enquanto especificações canônicas (`ADR-0001` a `ADR-0005`) são injetadas estritamente sob demanda explícita.
  6. Eliminação completa de 100% de mocks estáticos ou respostas pré-fabricadas em `omniRouteService.ts`.
  7. Atualização do `MarkdownRenderer.tsx` com suporte a títulos de `#` a `######`, quebras `<br>` dentro de células de tabelas e separadores `<hr />`.
  8. Unificação arquitetural no Monorepo `EnterDufter/PromptCoreLabs_AEOS`.
- **DoD**: Teste E2E sobre taxonomia de RAG e Laya System One aprovado com sucesso em ~3.4s e ~6.4s; `npm run build` aprovado com Exit Code 0.

