# Especificação Canônica Full SDD (Gate G-00) — Next Gen Sports (NGS)

**Versão:** 2.1.0-canonical (Pós-Grill-Me)  
**Data:** 2026-11-21  
**Autor:** Cortex Platform + Arthur + Lucca (Validado com Eduardo Machado)  
**Status:** APROVADO PELO FUNDADOR (Gate G-00 Pós-Grill-Me — Base pronta para revisão final e sincronização GitHub)  
**Regra de Escopo:** Especificação funcional, arquitetural e regulatória (zero código nesta etapa).

---

## 1. Propósito e Decisões Canônicas Validadas (Pós-Grill-Me)

Este documento consolida a **Fonte Única de Verdade (SSOT)** do pré-projeto **Next Gen Sports (NGS)**, integrando a Arqueologia Profunda (`discovery/GENEALOGIA_DAS_IDEIAS.md`) e todas as decisões validadas pelo fundador em `qa/GRILL_ME_EDUARDO.md`.

| Eixo de Decisão | Posição Anterior / Divergente | Decisão Canônica Vigente (Validada pelo Fundador) | Origem da Decisão |
|---|---|---|---|
| **Natureza do Produto** | Plataforma monolítica de 4 OS (`02 - Plataforma NGS`) vs. dependência obrigatória de FeedHive White Label. | **Rede Social Especializada no Esporte** (ambiente digital de referência conectando atletas, pilotos, ligas, patrocinadores, ídolos e fãs), com **IA nativa** para copy/conteúdo e compartilhamento externo. *FeedHive White Label* fica apenas como opção condicional se o custo for absorvido por Marketplace + Área Premium. | `GRILL_ME_EDUARDO.md` (Q6), `NGS Mockup Rede Social.jpeg` |
| **Porta de Entrada (PLG + B2B2C)** | Isca PLG gratuita vs. entrada exclusiva via Ligas. | **Coexistência PLG + B2B2C:** piloto acessa livremente sem vínculo obrigatório, pode participar de múltiplas ligas ou criar sua própria liga. | `GRILL_ME_EDUARDO.md` (Q4) |
| **Ingestão Multi-Fonte (Telemetria & Saúde)** | Telemetria postergada indefinidamente vs. hardware proprietário. | **Implementação faseada obrigatória:** **Fase 1 (GPS/Telemetria):** `PDF/fotos folhas de tempo kart` → `Dragy App` → `MyLaps` → `RaceChrono` → `Alfano`; **Fase 2 (Fisiológico):** `Strava` e `Garmin` alimentando o Readiness Score. | `GRILL_ME_EDUARDO.md` (Q5), `GENEALOGIA_DAS_IDEIAS.md` |
| **Escala Oficial (Readiness vs. LMS)** | Conflito `0–100` vs. `0–1000` nos mockups. | **Readiness Score = `0–100`** em toda a plataforma; **Academy (LMS) = `0–1000`**, com conversão/normalização da pontuação do LMS para agregar ao Readiness Score. | `GRILL_ME_EDUARDO.md` (Q7) |
| **Hub Central & 5 Telas do Protótipo** | Telas isoladas sem ponto de entrada unificado. | **Feed Central da Rede Social** dando acesso às **5 telas**: (1) *Gestão de Ligas*, (2) *Portal do Piloto/Atleta*, (3) *Commerce Hub*, (4) *Sponsorship*, (5) *Talent Network* + fluxo LGPD parental (`NGS Jornada do Atleta -Revisitada-.jpeg`). | `GRILL_ME_EDUARDO.md` (Q8a/8b) |
| **Ordem de Monetização (Hipótese)** | Dúvida entre B2B Ligas, B2C Premium e Marketplace. | **`SaaS / White Label para Ligas (B2B)` → `Área Premium (B2C)` → `Marketplace Curado (Take Rate)`** (hipótese estratégica a validar no mercado). | `GRILL_ME_EDUARDO.md` (Q9) |
| **Módulos Regulatórios (`Capital/Token Hub` e `LIE`)** | Inclusão no MVP vs. exclusão total do pitch. | **Congelados no MVP técnico**, mas **mantidos no pitch** (há interesse comercial de **XP Investimentos** e **Mercado Bitcoin**). | `GRILL_ME_EDUARDO.md` (Q8c), `PARECER_COMPLIANCE_LGPD_PI.md` |
| **Hardware (Meia Inteligente / USCS / SENAI)** | Trilha simultânea ao MVP de software. | **Pausada até o software faturar** (preservada como trilha futura de P&D/fomento). Exige **NDA prévio** antes de novas agendas para evitar *prior art*. | `GRILL_ME_EDUARDO.md` (Q10a/10b) |
| **Marca, Tom Visual & Protagonismo** | *SAGA* vs. *NGS*, tema único fixo e menção a Arthur Vono. | Insistir em **NGS (Next Gen Sports)** (busca INPI prioritária); **não** citar Arthur Vono como Case Piloto/Embaixador; manter `Driver` apenas no módulo de motorsport; estética submetida a testes de opinião (visão futura de temas escolhidos pelo usuário). | `GRILL_ME_EDUARDO.md` (Q1, Q2, Q3) |
| **Parceiros, Editais & Captação** | `People2Biz / MeetIn`, `Pulsar Expo IPT`, `CaptSe`. | Irrelevantes no momento; **captação de recursos** é prioridade imediata após a consolidação deste projeto. | `GRILL_ME_EDUARDO.md` (Q11) |

---

## 2. Visão do Produto, Proposta de Valor e Canonização Terminológica

### 2.1 Definição Oficial
A **Next Gen Sports (NGS)** é uma **rede social especializada de performance, formação e prova de talento** (*SportTech Institucional*), projetada para eliminar o **"Vácuo Estratégico do Talento Invisível"** — o espaço entre o potencial esportivo bruto e as oportunidades reais de mercado.

- **Slogan Canônico:** *"Onde talento ganha estrutura para virar futuro."*
- **Assinatura Institucional:** `Next Gen Sports | Powered by PromptCore Labs` (com selo discreto `PCL Inside` na interface).
- **Mercado de Entrada (Beachhead):** Automobilismo de base e Kartismo (alta densidade de dados, forte apelo visual e cultura de telemetria), com arquitetura nativa **multiesporte** (futebol, basquete, vôlei, futsal, natação, endurance e modalidades olímpicas/paralímpicas).
- **Motor de Crescimento (Growth Loop B2B2C):** Ligas esportivas e projetos adotam workspaces *white-label* com menor CAC → trazem atletas para a rede → atletas geram provas verificáveis (`Proof of Talent`) e evoluem no `Readiness Score 0–100` → patrocinadores e especialistas conectam-se por evidência e contexto.

### 2.2 Vocabulário Canônico Obrigatório (Zero Termos Obsoletos)
| Termo Proibido / Obsoleto | Termo Canônico Obrigatório | Contexto de Uso |
|---|---|---|
| *Momento UOL* | **Momento Wow** | Percepção inicial de valor com dados/provas. |
| *Início* (menu) | **Painel Central NGS** | Visão principal / Feed central. |
| *Site Público* | **Liga Esportiva** | Área pública e operacional da liga/tenant. |
| *Portal do Piloto* | **Portal do Atleta** | Perfil 360º (garante escala multiesporte). |
| *MVP* (em pitch externo) | **Protótipo / Plataforma em validação / Experiência demonstrável** | Comunicação institucional e Parque Tecnológico. |
| *Freelancer / Loja / Cupom* | **Especialista de Performance / Vitrine de Parceiro / Voucher de Desenvolvimento** | Marketplace contextual e *Commerce Hub*. |
| *Briefing / Serviço / Documento* | **Neural Briefing / Setup (ou Kit) de Performance / Artefato (ou Evidência)** | Fluxos de IA, Academy e *Evidence Layer*. |
| Fundos escuros (seção 12 DS) | **Fundos claros (`#FAFAFB`) + Sidebar Deep Navy (`#031B33`)** | Identidade visual *SportTech Institucional* (`Sora` + `Inter`). |

---

## 3. Personas e Jornadas Core

1. **Atleta (Emergente ou Profissional):** Constrói perfil 360º auditável, publica provas de treino/competição no Feed, cumpre trilhas na `NGS Academy` (XP, Badges, Patentes), acompanha seu `Readiness Score 0–100`, gera `Mídia-Kit Dinâmico` e (no plano Pro) distribui conquistas para redes externas via FeedHive.
2. **Liga Esportiva / Organização (Tenant B2B):** Opera espaço *white-label* (co-branding), convida atletas, homologa resultados/evidências, acompanha maturidade do grupo e utiliza workspaces FeedHive para campanhas multicanal e ativações de patrocinadores.
3. **Especialista de Performance (Treinador, Preparador, Mecânico, Psicólogo, Nutricionista):** Recebe recomendações contextuais baseadas em lacunas do `Readiness Score`, emite **endossos verificados** no perfil de atletas e oferece *Setups/Kits de Performance*.
4. **Patrocinador / Marca:** Descobre talentos na `Talent Network` filtrando por modalidade, região e `Readiness Score 0–100` explicável, acompanha contrapartidas no `Sponsor Ops` e aprova publicações de ativação no fluxo integrado ao FeedHive.
5. **Responsável Legal (Pai/Mãe/Tutor — Obrigatório para < 18 anos):** Executa verificação de identidade e consentimento parental, controla visibilidade pública do perfil do menor (*Privacy by Default*) e aprova compartilhamento externo de mídia.

---

## 4. Escopo Funcional — Core NGS + Borda FeedHive (Cenário B Híbrido)

### 4.1 Requisitos Funcionais (RF)

- **RF-01 — Onboarding & Consentimento LGPD Verificável:** Fluxo em 3 passos (escolha de perfil → modalidade/nível → aceite LGPD). Para atletas `< 12 anos` (consentimento específico e verificável de responsável) e `12–18 anos` (assistência/autorização expressa para exposição pública e patrocínio). Perfis `< 18` nascem **privados por padrão**.
- **RF-02 — Feed de Provas & Conquistas (*Proof of Talent*):** Feed vertical mobile-first exibindo evidências esportivas estruturadas (tempo de volta/PDF normalizado, vídeo onboard/treino, conclusão de trilha Academy, resultado homologado de liga, endosso de treinador) com reações técnicas e botão **"Compartilhar nas redes"** (ponte desacoplada para o FeedHive).
- **RF-03 — Perfil 360º do Atleta (`Portal do Atleta`) & `Readiness Score 0–100`:** Identidade esportiva unificada com pontuação `0–1000` decomposta nos 5 pilares (*Técnico, Físico, Mental, Consistência, Equipamento*). Todo ponto do score deve exibir, ao clique/expansão, as **evidências que o compõem** (explicabilidade algorítmica — Art. 20 LGPD).
- **RF-04 — `NGS Academy` (LMS Modelo Trailhead):** Trilhas guiadas (*Trails*), módulos curtos, quizzes, upload de projeto prático (*Capstone*), sistema de XP, Badges nos 5 pilares e Patentes (*Ranks*), atualizando automaticamente o pilar correspondente do `Readiness Score` e publicando marco no Feed.
- **RF-05 — `Talent Network` (Descoberta & Scouting Auditável):** Diretório pesquisável de atletas (apenas perfis com opt-in público válido) com filtros por modalidade, faixa etária, região, `Readiness Score` e histórico de evidências.
- **RF-06 — `Sponsor Ops` & Ativação Contextual:** Gestão enxuta de oportunidades de patrocínio (funil/Kanban de prospecção a entrega de contrapartidas), **Gerador de Mídia-Kit Dinâmico** (com assistência de IA *human-in-the-loop* sob `finops-laya-guard`) e recomendação contextual de *Vouchers de Desenvolvimento* / *Kits de Performance* baseada nos gaps do atleta.
- **RF-07 — Borda de Distribuição Externa (`FeedHive White Label`):** Integração desacoplada via camada de abstração para Ligas B2B, Patrocinadores e Atletas Pro agendarem, reciclarem e aprovarem posts em redes externas (Instagram, LinkedIn, YouTube, X) a partir de conquistas geradas no Core NGS.
- **RF-08 — Multi-Tenancy & Co-Branding (`Admin White-Label`):** Segregação lógica estrita por organização/liga (domínio, paleta, tipografia, módulos habilitados), garantindo que dados de menores de um tenant nunca sejam expostos a outro sem consentimento.

### 4.2 Requisitos Não-Funcionais, Segurança e Compliance (RNF)

- **RNF-01 — Zero Dados Sensíveis/Biométricos no MVP:** É **expressamente proibido** coletar ou armazenar dados de saúde, frequência cardíaca, sono ou biometria de *wearables* no MVP (Art. 5º, II e Art. 11 LGPD). Apenas telemetria de pista não-sensível (tempos, traçado, setor) e evidências esportivas são permitidas.
- **RNF-02 — Fronteira de Dados com Fornecedor White Label:** **Nenhum dado pessoal de menor de 18 anos** ou registro bruto do `Evidence Layer` pode trafegar ou ser armazenado no FeedHive. Apenas ativos de mídia finalizados e aprovados seguem para publicação externa.
- **RNF-03 — Segurança & Auditoria:** Autenticação robusta, RBAC por tenant e perfil, moderação prévia de mídia envolvendo menores, trilha de auditoria de acessos de *scouts*/marcas e rotina de expurgo/anonimização imediata em caso de revogação de consentimento.
- **RNF-04 — UX "Zero AI Slop" & Mobile-First:** Layout responsivo prioritário para `390px` (1 coluna limpa) e desktop até `1440px` (máximo de 3 blocos primários por viewport), paleta `#FAFAFB` / `#031B33` / `#0D47A1` / `#17B3B3` e fontes `Sora` + `Inter`.
- **RNF-05 — Governança FinOps (`finops-laya-guard`):** Uso de modelos leves, pré-triagem determinística e cache de insights de IA para manter o custo marginal do atleta Freemium em **`~R$ 0,80/mês`** (limite de segurança para viabilizar o subsídio cruzado B2B2C).
- **RNF-06 — Desacoplamento Anti-Lock-in:** Toda comunicação com o FeedHive passa por interface/adapter próprio na NGS, com previsão contratual de DPA (Resolução CD/ANPD nº 19/2024), propriedade dos dados pela NGS e *opt-out* de treinamento de IA terceira.

---

## 5. Fora de Escopo Explícito (Isolamento Regulatório e de Fases)

Para proteger o projeto contra riscos jurídicos bloqueadores, dispersão de escopo e estouro de CAPEX, os itens abaixo estão **explicitamente fora do MVP e do protótipo de 60 dias**:

1. **`Capital Hub` e `Token Hub` (Isolamento CVM / AML / Banco Central):** Qualquer oferta, intermediação, *revenue share* ou tokenização de direitos econômicos/carreira de atletas configura Contrato de Investimento Coletivo (CIC — Lei 6.385/76, Parecer CVM 40/2022), exige PLD/FT/KYC (Lei 9.613/98, RCVM 50) e autorização VASP (Lei 14.478/2022), além de colidir com proteção a menores (Lei 14.597/2023). **Retorno permitido apenas pós-escala via parceiro regulado (RCVM 88) e restrito a maiores de idade.**
2. **`Impact / Incentive OS` e *Fast-Track* LIE Completo (Isolamento Lei 11.438/2006):** Startups com fins lucrativos não podem ser proponentes na Lei de Incentivo ao Esporte, e IA não pode atestar prestação de contas no SLIE/Transferegov. Na Fase 1, a NGS entrega apenas exportação de evidências esportivas (`Evidence Layer`) para uso de entidades proponentes parceiras sem fins lucrativos.
3. **Integrações Oficiais Automáticas com Confederações (CBA/Federações) e *Digital Twin 3D* em Tempo Real:** Postergados para as Fases de Expansão e Escala após validação do MVP.
4. **Wearables, Sensores Plantares e Dados Biométricos:** Postergados para Fase 4 (Escala) mediante adequação jurídica específica para dados sensíveis (Art. 11 LGPD).

---

## 6. Roadmap Canônico e Critérios de Gate (G-00 → Execução)

| Fase | Janela / Gate | Escopo Fechado | Critério de Avanço (Gate) |
|---|---|---|---|
| **Fase 0/1/2 — Discovery & SDD** | Concluída (`Gate G-00`) | Auditoria documental, pareceres UX/Sec/Compliance/FinOps e este `specify.md`. | Aprovação do `Auditor QA` na Fase 3 + Busca INPI (`Next Gen Sports`) + NDAs. |
| **Fase 3 — Hiperfoco 60 Dias (Protótipo + Validação)** | Dias 1–60 (`< R$ 5.000`) | Protótipo navegável **5 telas** sem backend real (Feed de Provas, Perfil 360º `0–1000`, Academy, Sponsor Ops, Onboarding LGPD) + testes com **5+ personas**. | Evidências documentadas de dor, fluxo validado e sinais de *willingness-to-pay* para retorno ao Parque Tecnológico. |
| **Fase 4 — MVP Produção (Cenário B Híbrido)** | 6–8 semanas pós-validação (`CAPEX R$ 69.500`) | Core NGS multi-tenant + LGPD menores + Readiness `0–1000` + Adapter FeedHive White Label para Ligas B2B e Atletas Pro. | Break-even caixa com `7 Ligas B2B`; operação dentro do teto `finops-laya-guard`. |
| **Fase 5 — Expansão & Pós-Escala** | Pós-validação de receita | Novas modalidades, integrações governadas com entidades oficiais, migração do motor de distribuição (gatilho `80–100 Ligas`), LIE via proponentes e eventuais parcerias reguladas. | Governança de dados, SLA B2B e compliance regulatório específicos por módulo. |
