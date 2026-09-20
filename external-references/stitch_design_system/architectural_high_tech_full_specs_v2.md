# Design System: Architectural High-Tech (Full Specification)

Este documento detalha as especificações visuais, técnicas e comportamentais do sistema de design **Architectural High-Tech**, desenvolvido para a **PromptCore Labs**. O sistema é otimizado para interfaces de "centro de comando", priorizando alto contraste, rigor técnico e legibilidade.

---

## 1. Fundamentos Visuais

### Paleta de Cores (CROMO_ARCH)
- **Primary Background (Deep Navy):** `#0c1324`
- **Main Accent (Cyan):** `#22d3ee` (Data connections, structural logic, primary CTAs).
- **System Status (Neon Green):** `#4ade80` (Online indicators, success states).
- **Human Intervention (Vibrant Orange):** `#fb923c` (Critical alerts, Human-in-the-loop nodes).
- **Structural Lines:** `#1e293b` (Borders and grids with 30-50% opacity).

---

## 2. Tipografia (SPEC_TYPE)

A tipografia utiliza a **Space Grotesk** para evocar precisão geométrica e clareza técnica.

| Categoria | Peso | Tamanho | Line Height | Tracking | Uso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Headline L** | Bold (700) | 48px | 1.1 | -0.02em | Títulos de Hero / Impacto |
| **Headline M** | Medium (500) | 32px | 1.2 | -0.01em | Títulos de Seção |
| **Headline S** | Medium (500) | 24px | 1.2 | 0 | Subtítulos de Módulo |
| **Body Large** | Regular (400) | 18px | 1.6 | 0 | Parágrafos Principais |
| **Body Small** | Regular (400) | 14px | 1.5 | +0.01em | Textos Auxiliares / Captions |
| **Mono Data** | Medium (500) | 14px | 1.4 | 0 | Terminais, Código, Logs |

---

## 3. Efeitos de Iluminação e Brilho (GLOW_SPECS)

Os efeitos de "glow" são funcionais, não apenas decorativos, indicando vitalidade e processamento ativo.

### Text Glow (Títulos)
Aplicado via `text-shadow` em elementos críticos:
- **Cyan Glow:** `text-shadow: 0 0 10px rgba(34, 211, 238, 0.6), 0 0 20px rgba(34, 211, 238, 0.2);`
- **Green Status:** `text-shadow: 0 0 8px rgba(74, 222, 128, 0.5);`

### Surface Glow (Componentes)
Aplicado via `box-shadow` em botões e cards ativos:
- **Interactive:** `box-shadow: 0 0 15px rgba(34, 211, 238, 0.15), inset 0 0 2px rgba(34, 211, 238, 0.3);`
- **Alert:** `box-shadow: 0 0 20px rgba(251, 146, 60, 0.2);`

---

## 4. Comportamento e Animações (MOTION_CORE)

As animações devem parecer instantâneas mas suaves, simulando a resposta de um hardware de alta performance.

### Transições de Estado
- **Duração:** `250ms` (Fast) a `400ms` (Standard).
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard para fluidez técnica).

### Efeitos de Interface
- **Terminal Pulse:** Indicadores de status utilizam uma animação de opacidade (0.4 to 1.0) em um ciclo de `2s`.
- **Typing Simulation:** Logs de terminal aparecem sequencialmente com um atraso de `20ms` por caractere.
- **Data Stream:** Linhas de conexão em diagramas utilizam um gradiente animado (`background-position` shift) para indicar fluxo direcional.

---

## 5. Estrutura e Grid (ARCH_GRID)

- **Baseline:** Grid de 8px para todos os espaçamentos e alinhamentos.
- **Background Grid:** Overlay sutil de linhas horizontais e verticais a cada 16px ou 32px com opacidade de 5% (`#ffffff10`).
- **Corner Radius:** Rigorosamente quadrado ou com raio mínimo (`ROUND_FOUR` - 4px) para reforçar o aspecto industrial.

---
*Documento Técnico Gerado por Stitch para a PromptCore Labs. Versão 2.1 - Sistema Operacional.*