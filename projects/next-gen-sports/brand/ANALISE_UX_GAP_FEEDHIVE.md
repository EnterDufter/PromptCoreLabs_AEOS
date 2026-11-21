# Análise de UX/UI, Zero AI Slop & Gap FeedHive White Label — Next Gen Sports (NGS)

**Fase:** 2 — Análise Especializada (Zero código novo)  
**Responsável:** Builder UI (`UI, Web Design, Stitch & 3D Studio`)  
**Data:** 2026-11-20  
**Insumos Auditados:**
- `C:\PromptCore_Labs\projects\next-gen-sports\discovery\04-assets-mockups\RELATORIO_MOCKUPS_INTENCAO.md`
- `C:\PromptCore_Labs\projects\next-gen-sports\discovery\01-parque-santo-andre\RELATORIO_PARQUE_TECNOLOGICO.md`
- Inspeção visual direta de mockups em `06 - Mockup NGS\` (`01 - Painel Central NGS.png`, `03 - Portal do Atleta.png`, `04 - Talent Network.png`, `05 - Sponsorshio OS.png`, `10 - Admin Panel & White-Label.png`, `NGS - Academy (1) Trilhas.png`)

---

## 1. Diagnóstico Visual & Auditoria "Zero AI Slop" dos Mockups Existentes

Os mockups da pasta `06 - Mockup NGS` estabelecem uma base **SportTech Institucional** coerente em cor e propósito, mas apresentam **gaps estruturais de UX, consistência e mobile-first** que precisam ser corrigidos antes do protótipo navegável do **Plano de Hiperfoco 60 Dias**:

1. **Desalinhamento de Canonização Terminológica (`SOURCE_OF_TRUTH`):**
   - `01 - Painel Central NGS.png` usa rótulos obsoletos na barra lateral (`Início` e `Atletas` em vez de `Painel Central NGS` e `Portal do Atleta`).
   - `03 - Portal do Atleta.png` exibe o título **`Portal do Piloto`** no `<h1>`, prendendo a interface ao automobilismo e contradizendo a escalabilidade multiesporte já presente em `04 - Talent Network.png` (futebol, basquete, vôlei, futsal, natação).
2. **Quebra de Sistema Visual no `NGS Academy`:**
   - `NGS - Academy (1) Trilhas.png` rompe o padrão da suíte: troca a sidebar `#031B33` por fundo branco, exibe o **Readiness Score na escala `782 / 1000`** (conflitando com a escala `0–100` usada no Portal do Atleta `87/100` e no Talent Network `92`, `88`, `81`) e coloca um selo gráfico *"Powered by PromptCore Labs"* em estilo microchip no cabeçalho direito, competindo com o selo discreto `PCL Inside` da sidebar.
3. **Hiperdensidade SaaS Desktop-Only (Sinal de "Template Dashboard"):**
   - As telas atuais replicam um padrão de *back-office* 1440px superlotado (faixa de 5–6 KPIs no topo + 3 a 4 colunas de cards simultâneos). Para um atleta em pista, quadra ou academia, essa arquitetura **não gera "Momento Wow" mobile-first** nem estimula retorno diário como **rede social especializada**.
4. **Falta de Camada Social Viva e Fluxo de Consentimento:**
   - O "DNA social" existe apenas como widgets estáticos (*"Últimas atividades"*, *"Minha rede NGS"*, *"Endossos de treinadores"*), sem **Feed de Provas/Conquistas** interativo.
   - Não há tela de **Onboarding & Consentimento LGPD**, crítica porque os próprios mockups de `Talent Network` listam atletas menores de idade (`15 a 17 anos`).

---

## 2. Separação Arquitetural de UX: (a) FeedHive White Label vs. (b) Core Social Proprietário

A decisão estratégica mais importante desta Fase 2 é **não confundir motor de distribuição externa com rede social proprietária**:

### (a) O que o FeedHive White Label já cobre (Content Ops & Distribuição Externa)
O **FeedHive White Label** (plano Agency/White Label: até 100 workspaces com marca própria e 500 contas sociais) deve ser acoplado como **motor invisível ou módulo "Distribuição & Mídia"** para ligas, clubes e atletas:

| Capacidade / Fluxo | Papel do FeedHive White Label | Onde se conecta nos Mockups NGS |
|---|---|---|
| **Workspaces White-Label por Liga** | Cada liga/organização opera seu próprio espaço de publicação com logo, domínio e aprovação editorial. | Complementa `10 - Admin Panel & White-Label.png` (que hoje só configura tema, domínio e módulos, sem fila de posts). |
| **Agendamento & Reciclagem Multicanal** | Publicação e reciclagem automática para Instagram, LinkedIn, YouTube e X a partir de templates com IA. | Executa as tarefas de *"Post no Instagram com parceiro"* visíveis em `05 - Sponsorshio OS.png`. |
| **Fluxo de Aprovação Marca ↔ Atleta** | Patrocinador, liga ou treinador aprova posts de contrapartida antes de irem ao ar nas redes externas. | Evita construir um agendador/editor de redes sociais do zero no MVP de 60 dias. |
| **Transformação de Marcos em Conteúdo** | Recebe gatilhos do core NGS (ex.: novo badge, pódio, atualização de Readiness) e gera rascunhos prontos para divulgação externa. | Alimenta o *Growth Loop* orgânico e o retorno de mídia para patrocinadores. |

> **Limite claro:** O FeedHive **não** possui feed comunitário interno, grafo de atletas/scouts, cálculo de Readiness Score, trilhas de aprendizagem ou trilha auditável de evidências.

---

### (b) Telas Essenciais do Core Social Proprietário (Hiperfoco 60 Dias)

Para o protótipo navegável enxuto (Dias 1–30 do Plano de Hiperfoco) e evolução imediata pós-validação, o **core proprietário NGS** precisa cobrir **5 telas essenciais**, desenhadas **mobile-first** sobre a paleta canônica SportTech (**Deep Navy `#031B33`**, **Navy `#0D47A1`**, **Teal `#17B3B3`**, fundo claro **`#FAFAFB`**, bordas **`#D9E3EA`**, semântica **`#0E9F6E` / `#F59E0B`**) e tipografia **`Sora`** (títulos/números de destaque) + **`Inter`** (UI/leitura):

| # | Tela Core Proprietária | Objetivo & "Momento Wow" | Gaps Resolvidos em Relação aos Mockups v1 |
|---|---|---|---|
| **1** | **Feed de Provas & Conquistas** *(Nova tela central)* | Feed vertical limpo de *Proof of Talent*: cards de evolução real (upload de treino/volta, badge da Academy, endosso de treinador, resultado homologado de liga) com reações técnicas, filtros por modalidade e ação **"Compartilhar nas redes"** (ponte direta para o FeedHive). | Substitui o widget passivo *"Últimas atividades"* por uma experiência de rede social especializada sem ruído de rede genérica. |
| **2** | **Perfil 360º do Atleta + Readiness Score** | Cartão de identidade esportiva com **Readiness Score `0–1000`** explicável nos 5 pilares (*Técnico, Físico, Mental, Consistência, Equipamento*), linha de evolução, endossos verificados, *"Minha rede NGS"* e **Mídia-Kit Dinâmico** exportável. | Corrige o título `Portal do Piloto` → **`Portal do Atleta`**, padroniza a escala única `0–1000` (ex.: `782/1000`) e adapta o layout de 3 colunas para leitura fluida no celular. |
| **3** | **NGS Academy (Trilhas & Upload de Evidência)** | Catálogo enxuto estilo Trailhead: trilha recomendada para o próximo nível de Readiness, módulo curto com checklist/quiz e **upload de evidência prática (Capstone)** que publica automaticamente uma prova no Feed e soma XP. | Reconcilia `NGS - Academy (1) Trilhas.png` com a paleta `#031B33` / `#0D47A1` / `#17B3B3`, escala única `0–1000` e selo único `PCL Inside`. |
| **4** | **Sponsor Ops & Marketplace (Ativação Contextual)** | Visão unificada e enxuta para conectar atletas/ligas a oportunidades de patrocínio, *Vouchers de Desenvolvimento* e *Kits de Performance* recomendados pelo gap do Readiness Score, com checklist de contrapartidas ligado ao FeedHive. | Transforma `05 - Sponsorshio OS.png` + `06 - Commerce Hub.png` de um CRM/loja genérica em ativação contextual da jornada (sem inflar escopo no protótipo de 30 dias). |
| **5** | **Onboarding & Consentimento (LGPD + Rede Externa)** *(Nova tela obrigatória)* | Fluxo em 3 passos: (1) escolha de perfil (*Atleta, Especialista de Performance, Liga, Patrocinador*); (2) modalidade e nível inicial; (3) **termo LGPD + autorização de responsável legal para menores de 18 anos** e conexão opcional de contas sociais para o módulo FeedHive. | Supre a ausência total de governança de entrada e proteção a menores identificada na auditoria documental. |

---

## 3. Diretrizes Visuais "Zero AI Slop" para a Próxima Etapa (Protótipo Navegável)

1. **Hierarquia antes de volume:** Máximo de **3 blocos primários por viewport** no desktop e **1 coluna limpa** no mobile (`390px`), evitando painéis com 6 KPI cards idênticos lado a lado.
2. **Dados com explicabilidade:** Todo `Readiness Score` (`0–1000`) deve mostrar de forma clicável/expansível *quais evidências* sustentam a nota (sem caixas opacas de "IA mágica").
3. **Vocabulário Canônico Obrigatório:** Usar sempre `Painel Central NGS`, `Portal do Atleta`, `Liga Esportiva`, `Especialista de Performance`, `Artefato / Evidência`, `Setup / Kit de Performance` e `PCL Inside`.
4. **Separação clara de marca:** Manter `Next Gen Sports | Powered by PromptCore Labs` discreto na assinatura institucional e usar os recursos de co-branding do `Admin White-Label` apenas no cabeçalho da liga e nas entregas externas via FeedHive.
