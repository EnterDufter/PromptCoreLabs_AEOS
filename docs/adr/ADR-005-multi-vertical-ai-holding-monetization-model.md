# ADR-005: Modelo de Holding Digital AI-Orchestrated e Verticais Monetizáveis B2B (3 Camadas PCL-AEOS)

## Status

**Aprovado** (4 de Agosto de 2026)

---

## Contexto

O sistema operacional **PromptCoreLabs_AEOS** foi concebido para orquestrar agentes e acelerar iniciativas de engenharia e negócios. 

Historicamente, os 9 squads da empresa (Estratégia, RevOps, BizOps, PeopleOps, Vibe-Coding, Criação, Growth & DS, Infra & Segurança, Back Office FinOps) eram organizados sob a mentalidade de "departamentos internos de suporte" (centros de custo).

Entretanto, para maximizar o potencial de monetização e valor de mercado da PromptCore Labs, fez-se necessária a evolução estratégica para um modelo de **Holding Digital AI-Orchestrated (AI-as-a-Service / Profit Centers)** com **Custo Marginal Zero de Expansão ($0 cost)**.

---

## Decisão Arquitetural

Decidimos formalizar e estruturar o ecossistema **PCL-AEOS** em um **Modelo em 3 Camadas**:

```text
PROMPTCORE LABS (Holding Digital)
│
├── Camada 1: Plataforma Core PCL-AEOS (Infraestrutura Compartilhada $0 Cost)
│   ├── Cortex (Intelligence & Living Architecture)
│   ├── OmniRoute :20130 (EBITDA Shield & Token Routing)
│   ├── Paperclip :3100 (Agent Orchestration & Persistent State)
│   ├── PGVector RAG :5432 (Memória Vetorial Compartilhada 768D)
│   ├── TLC Agent Skills Engine (Habilidades de Alta Performance)
│   └── 5 Stage Gates (Governança & QA Inviolável)
│
├── Camada 2: 15 Verticais de Negócio B2B (AI-as-a-Service / Clusters de Agentes)
│   ├── 1. Software Engineering Studio (Vibe-Coding & Modernização)
│   ├── 2. Marketing, Branding & Growth (Programmatic SEO & UGC Ads)
│   ├── 3. RevOps, CRM & Automação (Salesforce, HubSpot, Signal Routing, SDR AI)
│   ├── 4. AI Consulting & Advisory (Diagnóstico, ROI & Roadmaps de IA)
│   ├── 5. Data & Analytics (BI, Dashboards, Data Warehousing)
│   ├── 6. Educação & AI Academy (Treinamentos, Cursos & Capacitação)
│   ├── 7. Jurídico & Compliance (LGPD, NDA, Análise de Contratos)
│   ├── 8. RH, People & Recrutamento (Triagem, Entrevistas, PDI)
│   ├── 9. Financeiro, Pricing & FinOps (Precificação de IA, Forecast, EBITDA)
│   ├── 10. Customer Success & Retention (Churn Reduction, Health Score)
│   ├── 11. Conteúdo, Mídia & Podcasts (Roteirização, Podcasts, Newsletters)
│   ├── 12. Venture Studio (Incubação de Startups & Micro-SaaS PCL)
│   ├── 13. DevSecOps & Security Studio (Auditoria de Código & Cloud AWS/GCP)
│   ├── 14. E-Commerce & Dynamic Pricing (Inteligência de Vendas e Estoque)
│   └── 15. GovTech & RFP Automation (Análise de Editais Públicos e Licitações)
│
└── Camada 3: Modelos de Monetização & Entregáveis de Produto
    ├── Projetos Fechados & Propostas (High Ticket)
    ├── Retainers & Fees Mensais Consultivos
    ├── Micro-SaaS & Soluções White-Label (Kraken CRM, Project.OS, etc.)
    ├── APIs & Agentes Especializados Reutilizáveis
    └── Cursos, Assinaturas & Licenciamentos
```

### Princípios Mantidos
1. **Fidelidade à Precedência Operacional**: A precedência `Architecture ➔ Governance ➔ Knowledge ➔ Memory ➔ Execution ➔ Validation ➔ Learning` é 100% preservada. As verticais operam na Camada 7 (`Projects & Verticals`).
2. **Qualidade Inviolável pelos Stage Gates**: Qualquer entregável das Verticais deve ser auditado e validado através dos 5 Stage Gates oficiais (*Idea ➔ Spec ➔ Design ➔ Execution ➔ Release*).

---

## Consequências

### Positivas
- **Custo Marginal Zero**: Toda nova vertical de negócio utiliza a mesma infraestrutura nativa local (OmniRoute, Paperclip, PGVector, Cortex).
- **Flywheel de Valor**: Serviços prestados geram históricos e aprendizados no PGVector que são transformados em SaaS e produtos recorrentes.
- **Transparência Arquitetural**: Organograma e atribuições claros para clientes e agentes no Paperclip.

### Riscos e Mitigações
- *Risco*: Dispersão de foco por excesso de verticais.
- *Mitigação*: Cada vertical ativa seus clusters de agentes sob demanda via Stage Gates PCL-AEOS, sem overhead de servidorocioso.
