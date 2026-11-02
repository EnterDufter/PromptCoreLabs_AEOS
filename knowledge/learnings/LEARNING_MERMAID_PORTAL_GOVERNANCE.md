---
title: "Registro de Aprendizado Canônico: Governança Física de Diagramas Mermaid & Impressão (PCL AEOS v3.6)"
system_scope: "PCL AEOS / Cortex / Living Architecture"
kernel_version: "v3.6.0"
type: "Learning"
status: "Approved"
rag_tags: [cortex, mermaid, visual_governance, print_css, erd_scaling, anti_clipping, learnings, v3.6]
created_at: "2026-11-02"
last_updated: "2026-11-02"
author: "PCL Architecture & Cortex Intelligence"
normative_ref: "PCL-AEOS-NORM-01"
---

# 🧠 Diretriz Canônica de Governança Mermaid, Anti-Clipping & Impressão Perfeita

> **Contexto & Incidente Técnico:** Durante as iterações de visualização da documentação no PCL Cockpit e GitHub Pages, identificou-se que tentativas empíricas de centralização via CSS flexbox e forçamento de `nowrap` causaram o colapso de SVGs para `0px x 0px`, a criação de colunas estreitas verticais de uma palavra por linha, distorções em diagramas ERD e páginas em branco na impressão.
>
> **Objetivo:** Estabelecer as quatro leis físicas invioláveis para renderização de diagramas Mermaid na tela e em `@media print`, eliminando o retrabalho em documentação.

---

## 1. As Quatro Leis Físicas Invioláveis do Mermaid

### Lei 1: O Contêiner Estável (Zero Flex, Zero Width Auto no SVG)
- **Causa da Falha:** Em motores baseados em Blink/WebKit (Chrome, Edge, Safari), elementos SVG com `width="100%"` posicionados dentro de um contêiner com `display: flex !important;` e estilizados com `width: auto !important;` colapsam suas dimensões para `0px x 0px` devido à ausência de dimensões intrínsecas fixas em pixels.
- **Invariante Mandatório:**
  - O contêiner `.mermaid-box` deve ser estritamente `display: block !important; overflow-x: auto !important;`.
  - O SVG do Mermaid deve manter `max-width: 100% !important; height: auto !important; display: block !important; margin: 0 auto !important;`.
  - É proibido aplicar `transform: translateY(...) !important;` no SVG, pois essa regra anula as coordenadas dos títulos de subgrafos.

### Lei 2: Soberania Tipográfica Estrita
- **Invariante Mandatório:** Agentes e scripts de build **jamais** devem injetar `font-size` ou `font-weight` arbitrários em classes internas do Mermaid (`.node`, `.cluster`, `.edgeLabel`). A tipografia pertence ao tema do portal/IDE (Inter / JetBrains Mono) e deve permanecer intacta.

### Lei 3: Largura Mínima e Multilinhas Livres (Fim das Colunas Estreitas)
- **Causa da Falha:** O algoritmo Dagre do Mermaid v10, ao encontrar `white-space: normal !important;` sem largura mínima, calcula a caixa do nó pela menor palavra única (~80px). Isso faz com que frases inteiras sejam espremidas em colunas verticais estreitas onde cada palavra vira uma linha.
- **Invariante Mandatório:**
  ```css
  .mermaid svg [clip-path] { clip-path: none !important; }
  .mermaid svg .node foreignObject { overflow: visible !important; }
  .mermaid svg .node foreignObject div {
    overflow: visible !important;
    word-break: normal !important;
    white-space: normal !important;
    text-align: center !important;
    line-height: 1.4 !important;
    padding: 8px 16px !important;
    min-width: 185px !important;
    box-sizing: border-box !important;
  }
  ```
- **Zero Supressão de Texto:** É terminantemente proibido tentar forçar textos em "2 linhas". Diagramas multilinha com 3, 4 ou mais linhas descritivas de engenharia devem fluir livremente sem cortes ou truncamento.

### Lei 4: Impressão Perfeita (@media print) & Harmonização de ERDs
- **Causa da Falha:** Diagramas extensos (como esquemas de banco de dados `erDiagram` de ~850px de altura) combinados com `break-inside: avoid;` e `max-height: none` forçam o navegador a empurrar o diagrama para a página seguinte, gerando páginas anteriores com até 80% de espaço em branco ou páginas órfãs.
- **Invariante Mandatório para Impressão:**
  - Limite de altura proporcional de segurança: `max-height: 175mm !important;` no contêiner `.mermaid` e `max-height: 160mm !important;` no SVG com `object-fit: contain !important;`. O diagrama escala suavemente para caber na folha A4 útil sem empurrar o conteúdo nem forçar páginas vazias.
  - Fundo claro de alto contraste e economia de tinta: fundo `#f8fafc`, bordas `#cbd5e1`, traços escuros `#334155` e textos `#0f172a`.
  - Harmonização de ERDs: esquemas ERD são limitados a `max-width: 680px` na tela e `max-height: 145mm` / `max-width: 90%` na impressão.

