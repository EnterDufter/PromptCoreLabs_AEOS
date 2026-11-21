# Modelagem Financeira, TCO & EBITDA Shield — Next Gen Sports (NGS)

**Projeto:** Next Gen Sports (NGS) — Fase 2: Análise Especializada (Zero Código Novo)  
**Responsável:** Ledger FinOps (`V5 Dados/BI, V9 Pricing & FinOps, V14 E-Commerce`)  
**Data:** 2026-11-20  
**Base Documental Auditada (Fase 1):**
- `RELATORIO_PARQUE_TECNOLOGICO.md` (Dossiê V1.7 FINAL, Diagnóstico 360°, Plano Hiperfoco 60 Dias)
- `RELATORIO_MOCKUPS_INTENCAO.md` (Oceano Azul, Growth Loop B2B2C, Subsídio Cruzado, FeedHive White Label)
- `RELATORIO_LEGADO_E_PLATAFORMA_ANTIGA.md` (Auditoria de legado, descarte de acoplamento ProjectOS e frontend-only)

---

## 1. Premissas Explícitas e Conservadoras de Modelagem

> [!NOTE]
> Como o **Diagnóstico 360° (BRL/CRL)** indica que o projeto encontra-se em estágio pré-MVP sem testes de preço ou LOIs assinadas, **todos os valores abaixo são premissas conservadoras de modelagem**, estruturadas para decisão de alocação de capital e proteção de margem (**EBITDA Shield**).

| Parâmetro | Premissa Adotada | Justificativa / Origem |
|---|---|---|
| **Taxa de Câmbio** | `US$ 1,00 = R$ 5,80` | Referência fixa para conversão da licença FeedHive (`US$ 299/mês`). |
| **Custo/Hora Engenharia & Produto** | `R$ 150,00/h` | Custo econômico de oportunidade / alocação técnica sênior-pleno PCL. |
| **Deduções Diretas sobre Receita** | `10,0%` | Impostos iniciais (~6% Simples Nacional) + Gateway de pagamento (~4%). |
| **Ticket Liga B2B (Core + Distribuição)** | `R$ 490,00/mês` (Cenários B e C) / `R$ 290,00/mês` (Cenário A) | Cenário A sofre compressão de preço por ser percebido apenas como agendador social; B e C entregam infraestrutura SportTech completa. |
| **Ticket Atleta B2C Pro** | `R$ 49,00/mês` | Mídia-Kit Dinâmico, Readiness Score avançado, Academy Pro e visibilidade na Talent Network (inexistente no Cenário A). |
| **Cluster B2B2C por Liga** | `40 atletas/liga` (`38 Freemium` + `2 Pro`, conversão de `5%`) | Premissa conservadora para o Growth Loop via ligas com subsídio cruzado. |
| **Governança de IA (`finops-laya-guard`)** | Pré-triagem gratuita + teto por lote/usuário + cache de insights | Evita explosão de custos de LLM em atletas Freemium (`~R$ 0,80/atleta/mês`). |

---

## 2. Análise Detalhada dos 3 Cenários

### 2.1 Cenário A — FeedHive White Label Puro
**Arquitetura:** Uso exclusivo do **FeedHive Agency White Label** (`US$ 299/mês`, até 100 workspaces / 500 contas sociais) com domínio próprio e landing page institucional adaptada do legado (`landing-page-project`). **Não possui** feed social interno, `Readiness Score`, `Proof of Talent`, `NGS Academy` ou `Talent Network`.

- **CAPEX / Esforço Inicial (`R$ 10.900`):**
  - Setup White Label FeedHive (DNS, branding, templates de fluxo de aprovação): `24h` = `R$ 3.600`
  - Adaptação da Landing Page existente (Next.js 14): `32h` = `R$ 4.800`
  - Jurídico básico (Termos de Uso e Política de Privacidade LGPD): `R$ 2.500`
- **OPEX Mensal Estimado:**
  - Licença FeedHive Agency (`US$ 299/mês`): `R$ 1.734/mês` *(ou `R$ 1.386/mês` no plano anual; mantido mensal para flexibilidade de caixa)*
  - Infraestrutura mínima (hosting landing, domínio, e-mail): `R$ 180/mês`
  - **OPEX Caixa Direto:** **`R$ 1.914/mês`**
  - Operação & CS parcial (`~10h/mês` para onboarding de ligas): `R$ 1.000/mês`
  - **OPEX Total Alocado:** **`R$ 2.914/mês`**
- **Unit Economics (B2B Puro — Sem Subsídio Cruzado):**
  - **Liga B2B:** Ticket `R$ 290,00/mês` → Receita Líquida (`-10%`) = **`R$ 261,00/mês`**.
  - **Atleta B2C / Subsídio Cruzado:** **Inviável.** O teto de 100 workspaces e 500 contas sociais impede oferecer contas gratuitas para atletas em escala; não há produto proprietário que justifique assinatura B2C recorrente.
  - **CAC / LTV:** CAC estimado `R$ 600` | Churn mensal alto por comoditização (`8%/mês`, vida média `12,5 meses`) → LTV = `R$ 3.262` (**LTV/CAC = 5,4x**).
  - **Teto Estrutural:** 100 workspaces limitam a receita bruta máxima a `R$ 29.000/mês` por licença Agency.
- **Break-even & Payback:**
  - **Break-even OPEX Caixa:** `8 Ligas B2B` (`R$ 2.088` líquidos vs. `R$ 1.914` caixa).
  - **Break-even OPEX Total Alocado:** `12 Ligas B2B` (`R$ 3.132` líquidos vs. `R$ 2.914` total).
  - **Payback do CAPEX (`R$ 10.900`):** **4 a 5 meses** (sobre OPEX Caixa) / **6 a 7 meses** (sobre OPEX Total, assumindo ramp-up de +4 ligas/mês).

---

### 2.2 Cenário B (Híbrido) — FeedHive White Label (Distribuição) + Core NGS Proprietário
**Arquitetura:** Separação clara de responsabilidades:
1. **Core NGS Proprietário (V1.7 enxuto):** Perfis de atletas e ligas, feed especializado de conquistas/evidências (`Proof of Talent`), `Readiness Score` explicável (v1), `Talent Network`, `Mídia-Kit Dinâmico` e gamificação base (`skill_tree`).
2. **FeedHive White Label (acoplado na borda):** Motor de Content Ops, agendamento e distribuição externa (Instagram, LinkedIn, YouTube, X) exclusivo para **Ligas B2B, Patrocinadores e Atletas Pro**, eliminando o desenvolvimento e manutenção de APIs sociais de terceiros.

- **CAPEX / Esforço Inicial (`R$ 69.500` — pós-validação do Plano Hiperfoco 60 Dias):**
  - Desenvolvimento Core NGS V1.7 (Auth, Multi-tenant, Feed de Evidências, Readiness Score v1, Mídia-Kit, Billing): `320h` = `R$ 48.000`
  - Integração & Setup FeedHive White Label (workspaces de ligas, fluxo de mídia-kit): `40h` = `R$ 6.000`
  - UX/UI Design System (`SportTech Institucional` sobre mockups existentes): `60h` = `R$ 9.000`
  - Jurídico, PI & LGPD Menores (busca INPI `Next Gen Sports`, termos de consentimento parental): `R$ 6.500`
- **OPEX Mensal Estimado (até 50 Ligas / 2.000 Atletas):**
  - Licença FeedHive Agency White Label (`US$ 299/mês`): `R$ 1.734/mês`
  - Infra Cloud Core NGS (Frontend, Postgres/Auth gerenciado, Storage de evidências): `R$ 650/mês`
  - IA / LLM sob `finops-laya-guard` (modelos leves + cache para Readiness Score e Mídia-Kit): `R$ 450/mês`
  - Monitoramento, Domínio, E-mail Transacional & Backups: `R$ 220/mês`
  - **OPEX Caixa Direto:** **`R$ 3.054/mês`**
  - Operação, CS & Manutenção Contínua (`~35h/mês`): `R$ 5.250/mês`
  - **OPEX Total Alocado:** **`R$ 8.304/mês`**
- **Unit Economics (B2B + B2C + Subsídio Cruzado):**
  - **Liga B2B (`R$ 490/mês`):** Receita Líquida `R$ 441,00` − Custo Variável Marginal (`R$ 18,00`) = **Margem de Contribuição `R$ 423,00/mês` (86,3%)**.
  - **Atleta B2C Pro (`R$ 49/mês`):** Receita Líquida `R$ 44,10` − Custo Variável Marginal (`R$ 4,50`) = **Margem de Contribuição `R$ 39,60/mês` (80,8%)**.
  - **Atleta Freemium (Subsidiado):** Custo Variável Marginal com `finops-laya-guard` = **`R$ 0,80/atleta/mês`**.
  - **Resultado do Cluster por Liga (1 Liga + 2 Atletas Pro + 38 Atletas Freemium):**
    - `+R$ 423,00` (Liga) `+ R$ 79,20` (2 Pro) `− R$ 30,40` (38 Freemium) = **`R$ 471,80/mês` de Margem Líquida do Cluster**.
    - *Capacidade de Subsídio:* Cada Liga B2B paga os custos marginais de até **~528 atletas freemium** antes de zerar sua contribuição própria.
  - **CAC / LTV:** CAC B2B `R$ 1.200` | Churn mensal reduzido por efeito de rede e histórico auditável (`3,5%/mês`, vida média `28,5 meses`) → LTV Cluster = `R$ 13.446` (**LTV/CAC = 11,2x**).
- **Break-even & Payback:**
  - **Break-even OPEX Caixa:** `7 Ligas B2B` (`~280 atletas` na rede, sendo `14 Pro`).
  - **Break-even OPEX Total Alocado:** `18 Ligas B2B` (`~720 atletas` na rede, sendo `36 Pro`).
  - **Payback do CAPEX (`R$ 69.500`):** **10 a 11 meses** (sobre OPEX Caixa) / **15 a 17 meses** (sobre OPEX Total Alocado, com ramp-up conservador após lançamento no Mês 3).

---

### 2.3 Cenário C — Build 100% Próprio (Sem White Label Externo)
**Arquitetura:** Desenvolvimento integral do Core NGS **somado** a um motor próprio de Content Ops, calendário editorial, filas de publicação, fluxo de aprovação e integrações OAuth diretas com APIs oficiais (Meta/Instagram, LinkedIn, YouTube, X).

- **CAPEX / Esforço Inicial (`R$ 147.000`):**
  - Core NGS V1.7 (mesmo escopo do Cenário B): `320h` = `R$ 48.000`
  - Motor Content Ops & Integrações Multi-Rede (OAuth, Meta App Review, APIs, filas/retries): `480h` = `R$ 72.000`
  - UX/UI ampliado (calendário editorial, composer, aprovações): `100h` = `R$ 15.000`
  - Jurídico, PI, LGPD Menores & Compliance/Auditoria de APIs externas: `R$ 12.000`
- **OPEX Mensal Estimado:**
  - Licença FeedHive: `R$ 0`
  - Infra Cloud Ampliada (workers, filas Redis, processamento de mídia, DB): `R$ 1.450/mês`
  - IA / LLM sob `finops-laya-guard` (core + geração/variação de posts): `R$ 750/mês`
  - APIs Pagas de Redes Sociais (ex.: API X/Twitter Basic, proxies/monitoramento): `R$ 750/mês`
  - **OPEX Caixa Direto:** **`R$ 2.950/mês`** *(economia de apenas `R$ 104/mês` frente ao Cenário B)*
  - Manutenção de APIs voláteis + Engenharia Contínua + CS (`~70h/mês`): `R$ 10.500/mês`
  - **OPEX Total Alocado:** **`R$ 13.450/mês`**
- **Unit Economics:**
  - Mesmos tickets do Cenário B (`R$ 490` Liga / `R$ 49` Pro), porém com custo variável marginal ligeiramente maior (`R$ 22/liga`, `R$ 5/Pro`, `R$ 0,80/freemium`) → **Margem Líquida do Cluster Liga = `R$ 466,80/mês`**.
- **Break-even & Payback:**
  - **Break-even OPEX Caixa:** `7 Ligas B2B`.
  - **Break-even OPEX Total Alocado:** `29 Ligas B2B` (`~1.160 atletas`).
  - **Payback do CAPEX (`R$ 147.000`):** **16 a 18 meses** (sobre OPEX Caixa) / **24 a 28 meses** (sobre OPEX Total Alocado, penalizado por +3 a 4 meses de atraso de *time-to-market*).

---

## 3. Quadro Comparativo Consolidado

| Indicador Financeiro / Estratégico | Cenário A (FeedHive Puro) | Cenário B (Híbrido — Recomendado) | Cenário C (Build 100% Próprio) |
|---|---|---|---|
| **CAPEX / Esforço Inicial** | `R$ 10.900` (~56h) | `R$ 69.500` (~420h) | `R$ 147.000` (~900h) |
| **OPEX Caixa Direto / mês** | `R$ 1.914` | `R$ 3.054` | `R$ 2.950` |
| **OPEX Total Alocado / mês** | `R$ 2.914` | `R$ 8.304` | `R$ 13.450` |
| **Margem Cluster / Liga B2B** | `R$ 261,00/mês` | `R$ 471,80/mês` | `R$ 466,80/mês` |
| **Subsídio Cruzado B2C** | Inviável (teto 100 workspaces) | Viável (`~528` freemium / liga) | Viável (`~520` freemium / liga) |
| **Break-even (OPEX Caixa)** | 8 Ligas | 7 Ligas | 7 Ligas |
| **Break-even (OPEX Total)** | 12 Ligas | 18 Ligas | 29 Ligas |
| **Payback (OPEX Caixa / Total)** | 4–5m / 6–7m | 10–11m / 15–17m | 16–18m / 24–28m |
| **Time-to-Market** | 2–3 semanas | 6–8 semanas (pós-Hiperfoco) | 4–6 meses |
| **Aderência ao Oceano Azul NGS** | Baixa (comoditizado) | Alta (Core proprietário intacto) | Alta (com risco de execução) |
| **Parecer EBITDA Shield** | **Reprovado** (teto/commoditie) | **Aprovado (Recomendado)** | **Reprovado** (over-engineering) |

---

## 4. Recomendação Final sob a Ótica EBITDA Shield & Próximos Passos

1. **Decisão Recomendada: Cenário B (Híbrido).**
   - **Eficiência de Capital:** Economiza **`R$ 77.500` de CAPEX** e **`R$ 5.146/mês` de OPEX Total Alocado** em relação ao Cenário C, evitando construir e manter integrações voláteis com Meta/LinkedIn/X/YouTube antes de haver receita recorrente validada.
   - **Proteção do Core & Oceano Azul:** Mantém 100% da propriedade intelectual, grafo social, `Readiness Score`, `Proof of Talent` e base de dados sob controle da NGS/PCL.
   - **Gatilho de Saída (Anti-Lock-in):** O FeedHive atua apenas na borda de distribuição. A migração para motor próprio só deve ser avaliada quando a NGS ultrapassar **80 a 100 Ligas B2B ativas** (momento em que o custo de novas licenças Agency justificará engenharia dedicada).
2. **Gate `finops-laya-guard` para a Fase Atual (Plano Hiperfoco 60 Dias):**
   - **Não liberar CAPEX de R$ 69.500 agora.** Executar primeiro o protótipo navegável sem backend (30 dias) + testes com as 5 personas (30 dias), mantendo o gasto da fase de descoberta/validação abaixo de **`R$ 5.000`** até obter evidências de disposição a pagar (*willingness-to-pay*) e busca de anterioridade no INPI para `Next Gen Sports`.
