# [PCL] - Master Organizational Structure (v2.5)

**Fonte de Referência**: 008 a - [PCL] - 01_DEF_MASTER_ESTRUTURA_ORGANIZACIONAL_v2.5_0037
**Filosofia**: Zero Vibe-Coding | Engine-as-a-Service

Este documento descreve integralmente a Anatomia Organizacional (Clusters de Agentes) da PromptCore Labs, preservando a granularidade absoluta para guiar a configuração de Skills, hierarquias de squad e responsabilidades.

---

## 3. Anatomia Organizacional (Clusters de Agentes)

### 🏢 3.1. Estratégia (C-Level)
- **Agente Líder**: `Strategist_One` [12, 13].
- **Missão**: Definir prioridades de roadmap, viabilidade de novos inquilinos e a ponte direta com o fundador (Eduardo) [3, 12].
- **Foco**: Planejamento estratégico de alto nível e expansão multimodabilidade [14].
- **Metodologia**: Análise de mercado e definição de visão To-Be [3, 14].
- **Squad**: Analista de Mercado e Planejador de Roadmap [2, 3].
- **Sub-agentes**: Agentes de análise competitiva e preditores de tendência [3, 14].
- **Responsabilidades**: Decidir qual nicho será atacado e desdobrar metas em requisitos iniciais [3, 13].
- **Motor Visual**: Dashboard executivo de visão global (Placeholder) [3].

### 🏢 3.2. RevOps & Growth Ops
- **Agente Líder**: `RevOps_Architect` [12, 13].
- **Missão**: Orquestrar a geração de receita sustentável e automatizar o funil comercial [12, 15].
- **Foco**: Gestão de receita recorrente e automação de CRM via captura passiva de dados [12, 16].
- **Metodologia**: Funil Bowtie (Winning by Design) e framework SPICED [15, 16].
- **Squad**: Especialista SPICED, Auditor de Pipeline, Integrador CRM e Growth Specialist [2, 15].
- **Sub-agentes**: Customer Insight Agent, ICP Builder, Lead Sourcing, Cold Outreach, Lead Magnet Creator, e Churn Reduction Agent [16].
- **Responsabilidades**: Monitorar métricas de CR1 a CR8 e garantir que o impacto recorrente seja atingido [7, 17].
- **Motor Visual**: Dashboards de saúde do pipeline e funil SPICED [15, 18].

### 🏢 3.3. Engenharia de Sistemas e Materialização TLC
- **Agente Líder**: `Lead_TLC_Engineer` (Substitui o antigo Vibe-Coding Architect) [13-15].
- **Missão**: Transformar especificações em código funcional de alta performance, eliminando o código-esparguete [5, 15].
- **Foco**: Desenvolvimento front-end e back-end invisível, fluido e escalável [14, 15].
- **Metodologia**: Fluxo inegociável Specify (spec.md) → Design (design.md) → Tasks (tasks.md) → Execute [7, 19, 20].
- **Squad**: Front-end Specialist, Backend Flow e UI/UX Auditor [2, 15].
- **Sub-agentes**: Especialistas em Shadcn/UI, Tailwind CSS, React e integração de APIs/MCPs [13, 21].
- **Responsabilidades**: Garantir que o código obedeça aos requisitos estruturais e consuma estritamente o design.json [15, 20, 21].
- **Motor Visual**: Protótipos funcionais e interfaces HUD Elite integradas [15, 22].

### 🏢 3.4. Time de Criação (Squad de Percepção)
- **Agente Líder**: `Neuromarketing_Strategist` [12, 13].
- **Missão**: Criar a jornada emocional e persuasiva que engaja usuários e patrocinadores [12, 14, 23].
- **Foco**: Engenharia de percepção e eletrificação de marca [15, 23].
- **Metodologia**: Sexy Canvas, StoryBrand (Miller), 6 Princípios de Cialdini, Primal Branding e Jung [14, 23].
- **Squad**: Engenharia de Percepção (8 sub-agentes) [15, 23].
- **Sub-agentes**: Buscar Skills no PaperClip; caso inexistentes, desenvolver para: Empatia (Mapa da Dor), Motivação (Criança Interior), Arquétipo (Personalidade), Narrativa (Roteiro), Excitação (Pecados Capitais), Persuasão (Autoridade), Ação (Nudges) e Memória (Rituais/Ícones) [495, Conversa Recente].
- **Responsabilidades**: Gerar o briefing_neural.json que dita o tom emocional para o desenvolvimento [23, 24].
- **Motor Visual**: Integração invisível com Google Stitch para design e Gemini Embedding 2 para correlação de ativos e dados [221, 635, Conversa Recente].

### 🏢 3.5. DevOps & Infra
- **Agente Líder**: `CISO_Security_Agent` [13, 25].
- **Missão**: Blindagem da infraestrutura e segurança dos dados de telemetria [8, 13, 26].
- **Foco**: Gestão de containers, rede privada e soberania técnica [8, 26, 27].
- **Metodologia**: Sandbox Docker isolado e Tailscale Guardian [7, 26].
- **Squad**: Sandbox Steward, Tailscale Guardian e Protocol Manager [2, 26].
- **Sub-agentes**: Especialistas em monitoramento de VPS Hostinger e automação de infra [26, 28].
- **Responsabilidades**: Garantir que um projeto nunca acesse os diretórios de outro (Multitenancy) [7, 10].
- **Motor Visual**: Dashboard de status de containers e saúde da rede privada [2, 26].

### 🏢 3.6. BizOps & Agile
- **Agente Líder**: `BizOps_Controller` [13, 25].
- **Missão**: Maximizar a eficiência operacional e a comunicação Agent-to-Agent (A2A) [25, 26].
- **Foco**: Gestão de sprints, Heartbeats e orquestração de tarefas [13, 29].
- **Metodologia**: Kanban Master e State Tracking via JSON [2, 30].
- **Squad**: Orquestrador de Heartbeat, Gestor de Handoff e Kanban Master [2, 26].
- **Sub-agentes**: Agentes de registro de logs e sincronização de memória institucional [26, 31].
- **Responsabilidades**: Executar o loop de auditoria automática (Heartbeats) a cada 30 minutos [7, 32, 33].
- **Motor Visual**: Kanban e logs de interação via ClickUp ou solução proprietária [497, Conversa Recente].

### 🏢 3.7. Data Science & AI
- **Agente Líder**: `Data_Insight_Agent` [13, 25].
- **Missão**: O cérebro por trás da Métrica NextGen Readiness e da reconstrução 3D [25, 27].
- **Foco**: Modelagem de performance, predição de churn e engenharia de RAG [2, 15].
- **Metodologia**: Métrica Europeia (benchmark) adaptada para Métrica NextGen Readiness e NeRF (Neural Radiance Fields) [34-36].
- **Squad**: Analista de Sinais de Uso, Preditor de Churn e Engenheiro de RAG [2, 15].
- **Sub-agentes**: Especialistas em Gemini Embedding 2, processamento multimodal e simulação [15, 37, 38].
- **Responsabilidades**: Transformar o suor em dados auditáveis e históricos de performance incontestáveis [26, 39].
- **Motor Visual**: Geração do Digital Twin Driver e infográficos Race Lap Chart utilizando o Gemini Embedding 2 [179, 603, Conversa Recente].

### 🏢 3.8. LegalOps & Compliance
- **Agente Líder**: `Compliance_Steward` (CLO-AI) [13, 25, 40].
- **Missão**: Automatizar a segurança jurídica e ética desde o "Dia 0" [26, 41].
- **Foco**:
  - RegTech (NextGen Sports): Conformidade com a CBA (Confederação Brasileira de Automobilismo) [580, 603, Conversa Recente].
  - GovTech (Articuladores): Conformidade com a Lei de Incentivo ao Esporte e gestão de subsídios públicos [446, 472, Conversa Recente].
- **Metodologia**: Compliance Agent as Guardrail [42].
- **Squad**: Especialista em Privacidade, IP Guard, Agente de Contratos/SLA, Auditor de Risco e Ética, e Compliance Ops [40, 43].
- **Sub-agentes**: Agente de Processamento de Dados (DPA) e suporte jurídico para captação de recursos [44, 45].
- **Responsabilidades**: Bloquear deploys que não possuam conformidade jurídica validada [42, 46].
- **Motor Visual**: Command Center de métricas de conformidade e análise de risco [40, 43].

### 🏢 3.9. People Ops
- **Agente Líder**: `Skills_Manager` [13, 25].
- **Missão**: Gestão do conhecimento institucional e treinamento do ecossistema [25, 26].
- **Foco**: Bibliotecas de habilidades (Skills.sh), playbooks operacionais e onboarding agêntico [2, 13, 47].
- **Metodologia**: Curator-as-a-Service para habilidades reutilizáveis [48].
- **Squad**: Librarian (Playbooks), Onboarding Agent (IA & Humano) [2, 26].
- **Sub-agentes**: Agentes de curadoria de conhecimentos procedimentais [26, 48].
- **Responsabilidades**: Documentar e atualizar as Skills de todos os agentes da holding [13, 26].
- **Motor Visual**: Diretório centralizado de Skills e playbooks interativos integrados ao PaperClip [151, Conversa Recente].

### 🏢 3.10. Back Office (FinOps)
- **Agente Líder**: `Financial_Advisor` [13, 25].
- **Missão**: Gestão financeira, controle de custos de tokens e ROI da infraestrutura [25, 26].
- **Foco**: EBITDA Shield operacional e gestão de split de pagamentos no Marketplace [27, 49, 50].
- **Metodologia**: Cash Flow Forecasting e Ledger Automator via MCP [2, 13].
- **Squad**: Cash Flow Forecaster, Ledger Automator [2, 26].
- **Sub-agentes**: Agentes de auditoria de consumo de APIs e repasse de royalties [2, 26].
- **Responsabilidades**: Minimizar o custo marginal de novos usuários para escalar o EBITDA [26, 50, 51].
- **Motor Visual**: Dashboard de fluxo de caixa em tempo real e projeções financeiras [2, 26].
