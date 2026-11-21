# Caderno de Validação ("Grill-Me") — Eduardo Machado

> **Objetivo:** Conduzir uma sessão interativa objetiva com o Eduardo para resolver **todas as tensões, conexões e bifurcações** reveladas pela Arqueologia Profunda **antes** de congelar `.specs/specify.md` e iniciar qualquer design ou código.  
> **Fontes integradas:** Achados do Lucca (`Frente 1`), `INVENTARIO_VISUAL_MOCKUPS.md` (`Builder UI`), `INVENTARIO_VISUAL_BRANDING_NGS.md` (`Pulse Brand`), `CONEXOES_TECNICAS_ARQUEOLOGIA.md` (`Cortex Platform`) e `03_chatgpt_meia_inteligente_uscs_senai.md` (`Arthur`).

---

## Bloco A — Identidade, Marca & Posicionamento (O Que É e Como Se Chama)

### 1. `NGS` vs. `SAGA` — Arquitetura de Marca
- **Contexto:** Encontramos guias visuais completos tanto de **NGS — Next Gen Sports** quanto de **SAGA — Ecossistema Esportivo ("Do Potencial à Oportunidade")**.
- **Pergunta:** O nome **SAGA** foi um antecessor que evoluiu para **NGS**, ou você enxerga **SAGA** como marca-mãe do ecossistema/rede social e **NGS** como um produto/vertical dentro dela?

### 2. Arquétipo-Mãe, Tom Visual & Tipografia da Marca
- **Contexto:** Os estudos testam 6+ arquétipos (*Confiança Analítica v06 `#0B2E59`*, *Inovação Fluida v07 Turquesa*, *Prestígio Roxo v11 Pantone*, *Prestígio Azul/Dourado v05*, *Energia v08*, *Poder Tático v10*), além de variação entre **Light Mode SaaS** (telas executivas) e **Dark Mode WOW** (`Digital Twin`), e **`Sora + Inter`** vs. **`Sora` pura**.
- **Perguntas:**
  - **(2a)** Qual arquétipo/paleta lidera a **marca-mãe NGS** na rede social especializada — mais **editorial/analítico claro (estilo Strava/LinkedIn esportivo, v06/V1.0)** ou **energético/dark imersivo (v08/v10/v11)**?
  - **(2b)** Os demais arquétipos viram **sub-temas contextuais** (ex.: Dark só no *Momento WOW/Telemetria*) ou **paletas de tenants White Label** (`CRM Liga v1–v4`)?
  - **(2c)** O selo **`Powered by PromptCore Labs` / `PCL Inside`** fica visível para o usuário final na rede social ou apenas na camada B2B/Institucional?

### 3. Papel do *Arthur Vono ("Mídia Viva")* & Nomenclatura Multiesporte
- **Contexto:** A raiz do projeto nasceu com *Vono NextGen Sports* (Arthur Vono como Atleta-Sistemas). Nos mockups, `03 - Portal do Atleta` ainda traz `<h1>Portal do Piloto</h1>` e `04 - Talent Network` já mostra multiesporte (futebol, basquete, vôlei, natação, 15–18 anos).
- **Perguntas:**
  - **(3a)** O Arthur Vono entra hoje como **Case Piloto / Atleta-Âncora / Embaixador** de uma rede aberta a todos, ou mantém co-protagonismo na marca de lançamento?
  - **(3b)** Devemos unificar **100%** para terminologia multiesporte desde a V1 (inclusive renomeando `Digital Twin Driver` → **`Digital Twin Athlete`**, ou mantendo *Driver* só na vertical `NGS Motorsport`)?

---

## Bloco B — Motor PLG, Ingestão Multi-Fonte & *FeedHive White Label* (Onde Mora o Diferencial)

### 4. Isca PLG Gratuita (Folha de Tempos / Ingestão Multi-Fonte) vs. B2B2C via Ligas
- **Contexto:** A arqueologia mostrou que a origem do projeto (`Data Input.png`, `04 - Folhas de tempo`, `telemetry_simulator.py`, `09b - Race Lap Chart`) era uma **isca PLG gratuita**: o atleta sobe uma folha de tempos (PDF/CSV/foto) ou conecta um app terceiro, recebe insights de IA (**Momento WOW**) e converte para assinatura/rede. Já o `specify.md` v2 priorizou entrada B2B2C via Ligas e postergou telemetria.
- **Pergunta:** No pós-protótipo (V1 real), qual é a porta de entrada principal — **Isca PLG gratuita de folha de tempos/dados** (mesmo sem 3D, só leitura analítica + card compartilhável), **B2B2C via Ligas**, ou ambos juntos?

### 5. Quais Apps/Fontes Externas Priorizar na Ingestão Multi-Fonte?
- **Contexto:** A tese *Oceano Azul* é atuar como middleware agnóstico que contextualiza e correlaciona dados de apps que o atleta já usa.
- **Pergunta:** Pensando no piloto inicial, quais são as **2 ou 3 fontes externas obrigatórias** para priorizarmos na ingestão (ex.: `PDF/foto de folha de tempo de kart`, `RaceChrono`, `MyLaps`, `Alfano`, `Strava`, `Garmin`)?

### 6. Papel Exato do *FeedHive White Label* na Rede Social Especializada
- **Contexto:** A análise técnica mostrou que o **FeedHive White Label** (Agency ~$299/mês, 100 workspaces) é um motor poderoso de **saída/distribuição externa** (agendamento, IA de copy, cross-posting para IG/TikTok/YouTube/LinkedIn), mas **não** entrega feed social interno proprietário nem *Readiness Score*.
- **Pergunta:** O FeedHive White Label entra como **módulo embutido de distribuição externa** (para atletas e ligas publicarem suas conquistas/Mídia Viva nas redes de fora a partir de cada workspace White Label), ou você imaginava outra função para ele?

---

## Bloco C — Escala, Escopo do Piloto & Regras de Produto

### 7. Escala Única do *Readiness Score* (`0–100` vs. `0–1000`)
- **Contexto:** `Portal do Atleta` e `Talent Network` usam **`0–100`**, `NGS Academy` usa **`0–1000`** (`782/1000`) e o `Token Hub` mistura ambos na mesma tela (`92/100` e `914/1000`).
- **Pergunta:** Qual escala oficial adotamos em **toda** a plataforma: **`0–100`** (mais intuitiva para mercado/patrocinadores) ou **`0–1000`** (mais granular para evolução no LMS/Score)?

### 8. Recorte Exato das 5 Telas do Hiperfoco (30 dias) & Piloto ABC
- **Contexto:** O diagrama `01_53_51 (5)` define o Piloto Santo André/ABC (`2–3 ligas/escolas, 100–300 atletas, 1 dashboard, 1 trilha, 1 relatório de impacto`), e o Hiperfoco pede **5 telas navegáveis sem backend** (orçamento < R$ 5 mil). Ao mesmo tempo, `04 - Talent Network` exibe atletas de **15–17 anos** sem tela de consentimento parental (LGPD).
- **Perguntas:**
  - **(8a)** Quais **5 telas exatas** entram no protótipo navegável para validar no Parque Tecnológico?
  - **(8b)** Já incluímos o **fluxo de Consentimento Parental / LGPD para menores** dentro dessas 5 telas ou apenas como regra documentada na apresentação?
  - **(8c)** Confirmamos que `Token Hub`, `Capital Hub` e `LIE` ficam formalmente congelados para fases futuras (fora do MVP e do pitch de curto prazo)?

### 9. Ordem de Monetização pós-Rede Social Base
- **Contexto:** Temos 3 motores desenhados: *Marketplace curado estilo Fiverr* (take rate), *White Label para Ligas* (SaaS B2B2C + workspaces) e *Sponsor Ops / Mídia Viva*.
- **Pergunta:** Na sequência imediata após a rede social base, qual motor você quer ver faturando primeiro?

---

## Bloco D — Hardware, ICTs (Inova USCS / SENAI), PI & Parceiros

### 10. Trilha Paralela: Meia Inteligente (Sensores Plantares) + Inova USCS + SENAI
- **Contexto:** O histórico completo (`03_chatgpt_meia_inteligente_uscs_senai.md`) mostra uma tese madura inspirada na *Sensoria Fitness* (fibras condutivas na trama + módulo no tornozelo) com 3 narrativas (esporte, saúde/Anvisa/trombose, sim racing) para **Inova USCS + SENAI Robótica/4.0 + SENAI Têxtil**. Além disso, software puro não é patenteável no Brasil — o hardware têxtil é o caminho para **Patente de Modelo de Utilidade** e fomento (**FINEP / FAPESP PIPE / EMBRAPII / Pulsar Expo IPT / CaptSe**).
- **Perguntas:**
  - **(10a)** Você quer conduzir a **Meia Inteligente + Inova USCS/SENAI** como uma **trilha paralela de P&D / Editais de Subvenção** (desacoplada do software MVP para não atrasar a rede social), ou pausada até o software faturar?
  - **(10b)** Antes de novas agendas no Parque Tecnológico/USCS, quer **proteger o conceito sob NDA** (evitando *prior art* que inviabilize Modelo de Utilidade) e priorizar a **busca/registro da marca `NGS` no INPI**?

### 11. Parceiros & Editais (`People2Biz / MeetIn`, `Pulsar Expo IPT`, `CaptSe`)
- **Contexto:** Encontramos em `Parceiros\` a apresentação da **People2Biz / MeetIn** (reputação executiva e creators B2B) e em `06 - Editais\` o **Regulamento Pulsar Expo IPT** e a plataforma **CaptSe**.
- **Pergunta:** A **People2Biz / MeetIn** é um parceiro estratégico pensado para o **NGS** (ex.: reputação/creators esportivos) ou para a **PromptCore Labs** como holding? E o **Pulsar Expo IPT / CaptSe** está ativo no seu radar de captação agora?


---

## Decisões Validadas pelo Fundador (Eduardo Machado — Grill-Me Concluído)

### Bloco A — Marca, Identidade & Posicionamento
- **Q1 (`NGS` vs. `SAGA`):** Insistir na marca **NGS (Next Gen Sports)**, ciente de que ainda passará por validação/busca no INPI. `SAGA` não segue como marca-mãe.
- **Q2 (Tom Visual & Arquétipos):** Não fechar um tema único agora; submeter a testes de opinião e manter a visão futura de permitir que usuários escolham padrões visuais de sua preferência.
- **Q3 (Arthur Vono & Multiesporte):** **Não** mencionar Arthur Vono como Case Piloto / Embaixador. Manter o termo `Driver` apenas no módulo de motorsport. A evolução para rede social facilitará naturalmente o acolhimento futuro de novos esportes.

### Bloco B — Motor PLG, Ingestão Multi-Fonte & *FeedHive White Label*
- **Q4 (Porta de Entrada):** Coexistência de **PLG gratuito + B2B2C via Ligas**. O piloto pode entrar sem vínculo com liga, inscrever-se em múltiplas ligas ou até criar a própria liga.
- **Q5 (Fontes Externas Prioritárias — Faseado):**
  - **Fase 1 (GPS & Telemetria):** (1) PDF/fotos de folhas de tempo de kart → (2) **Dragy App** → (3) **MyLaps** → (4) **RaceChrono** → (5) **Alfano**.
  - **Fase 2 (Fisiológico & Performance):** **Strava** e **Garmin** alimentando o *Readiness Score* e insights de evolução.
- **Q6 (*FeedHive White Label* vs. Rede Social Especializada):** Foco na construção da **rede social especializada no esporte** (ambiente de referência conectando atletas, pilotos, ligas, patrocinadores, ídolos e fãs), com **IA nativa** para criação de conteúdo/copy e compartilhamento para outras redes. Custo do FeedHive considerado alto para o modelo acessível inicial — só entra se realmente agregar valor e for absorvido por **Marketplace + Área Premium**.

### Bloco C — Escala, Protótipo & Monetização
- **Q7 (Escala Oficial):** **Readiness Score = `0 a 100`** em toda a plataforma; **Academy (LMS) = `0 a 1000`** (com conversão/normalização da pontuação do LMS para agregar ao Readiness Score).
- **Q8 (Protótipo 5 Telas + LGPD + Congelamentos):**
  - **(8a) Hub Central:** **Feed Central da Rede Social** (`NGS Mockup Rede Social.jpeg`) dando acesso às **5 telas**: (1) *Gestão de Ligas*, (2) *Portal do Piloto/Atleta*, (3) *Commerce Hub*, (4) *Sponsorship*, (5) *Talent Network*.
  - **(8b) LGPD Menores:** Validado pelo fluxo da `NGS Jornada do Atleta -Revisitada-.jpeg` (etapa explícita de validação de acesso e termos LGPD pelo responsável/pai/tutor).
  - **(8c) Token Hub, Capital Hub e LIE completo:** **Formalmente congelados no MVP técnico**, mas **mantidos no pitch**, pois já há interesse comercial de **XP Investimentos** e **Mercado Bitcoin**.
- **Q9 (Ordem de Monetização — Hipótese a Validar):** **`SaaS / White Label para Ligas (B2B)` → `Área Premium (B2C)` → `Marketplace Curado (Take Rate)`**.

### Bloco D — Hardware, ICTs, PI & Parceiros
- **Q10 (Meia Inteligente / USCS / SENAI & PI):** **(10a)** Trilha da Meia Inteligente + USCS/SENAI fica **pausada até o software faturar**; **(10b)** **Sim** para NDA prévio (proteção contra *prior art*) e prioridade na busca/registro da marca `NGS` no INPI.
- **Q11 (Parceiros & Editais):** `People2Biz / MeetIn`, `Pulsar Expo IPT` e `CaptSe` **irrelevantes no momento**; porém **captação de recursos** é prioridade imediata logo após a consolidação do projeto.
