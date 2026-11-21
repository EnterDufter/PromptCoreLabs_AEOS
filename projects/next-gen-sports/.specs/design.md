# Design Técnico do Protótipo Navegável (Gate G-01) — Next Gen Sports (NGS)

**Versão:** 1.0.0 (Gate G-01)  
**Data:** 2026-11-21  
**Base Canônica:** `.specs/specify.md` (v2.1.0-canonical) & `architecture/ARQUITETURA_HIBRIDA_FEEDHIVE_NGS.md`  
**Diretório Alvo:** `C:\PromptCore_Labs\projects\next-gen-sports\prototype\`  
**Stack:** `Vite + React 18 + TypeScript + Tailwind CSS` (build estático local, zero backend, zero APIs pagas, dados mockados tipados)

---

## 1. Arquitetura e Estrutura de Pastas (`prototype/`)

O protótipo será uma SPA estática com estado reativo em memória (`React Context` + `useState`), permitindo demonstrar em **10 a 15 minutos** a troca instantânea entre os 4 atores (`Atleta`, `Liga`, `Patrocinador`, `Responsável Legal`) e o impacto em tempo real do **Consentimento Parental LGPD (Art. 14)**.

```text
prototype/
├── index.html                    # Carrega fontes Google (Sora + Inter) e título NGS
├── package.json                  # Vite, React, TypeScript, Tailwind CSS, lucide-react
├── tailwind.config.js            # Tokens SportTech Institucional (#031B33, #0D47A1, #17B3B3, #FAFAFB)
├── tsconfig.json                 # Strict mode habilitado
└── src/
    ├── main.tsx
    ├── App.tsx                   # NgsProvider + AppShell + Roteamento por módulo
    ├── types/
    │   └── ngs.ts                # Contratos TypeScript canônicos (Seção 3)
    ├── data/
    │   ├── mockAthletes.ts       # Gabriel Almeida (16 anos, Kart/Multiesporte) + elenco fictício
    │   ├── mockFeed.ts           # Provas, folhas de tempo normalizadas, badges, endossos
    │   ├── mockLeagues.ts        # Ligas B2B2C, etapas, inscrições e súmulas/telemetria
    │   ├── mockAcademy.ts        # Trilhas LMS (0–1000 XP) e Capstones
    │   ├── mockCommerce.ts       # Especialistas de Performance, Kits e Vouchers simulados
    │   └── mockSponsorship.ts    # Oportunidades de marcas (filtro Readiness > 70, sem LIE/Token)
    ├── context/
    │   └── NgsContext.tsx        # Estado global: ator ativo, módulo ativo, LGPD, filtros, ações
    └── components/
        ├── layout/
        │   ├── TopBar.tsx        # Header com ActorSwitcher (Atleta/Liga/Patrocinador/Responsável)
        │   ├── SideNav.tsx       # Navegação 5 módulos + selo discreto PCL Inside
        │   └── MobileNav.tsx     # Bottom bar mobile-first (390px)
        ├── hub/
        │   ├── HubFeed3Col.tsx   # Hub Central em 3 colunas (Perfil/Nav | Feed Provas | Contexto)
        │   ├── PostCard.tsx      # Card de prova (Proof of Talent) + reações + IA Copy Modal
        │   └── CopyAiModal.tsx   # Simulação de IA nativa para copy/compartilhamento externo
        ├── modules/
        │   ├── LeaguesView.tsx       # 1. Gestão de Ligas (etapas, inscrições, súmula/folha kart)
        │   ├── AthletePortalView.tsx # 2. Portal do Atleta (Readiness 0-100 + Academy 0-1000 + Mídia-Kit)
        │   ├── CommerceHubView.tsx   # 3. Commerce Hub (Especialistas de Performance + Kits)
        │   ├── SponsorshipView.tsx   # 4. Sponsorship (Marcas, filtro Readiness > 70, sem LIE/CVM)
        │   └── TalentNetworkView.tsx # 5. Talent Network (Conexões, olheiros, endossos, trava LGPD)
        └── lgpd/
            ├── LgpdConsentModal.tsx  # Fluxo interativo Art. 14 LGPD (Privacy by Default < 18)
            └── ReadinessDrawer.tsx   # Drawer de explicabilidade do Readiness Score (Art. 20 LGPD)
```

---

## 2. Design System & Diretrizes Visuais ("Zero AI Slop")

- **Paleta Canônica:**
  - `deep-navy`: `#031B33` (sidebar/destaques institucionais)
  - `navy`: `#0D47A1` (ação primária, links ativos)
  - `teal`: `#17B3B3` (indicadores de prontidão, badges, gráficos)
  - `surface`: `#FAFAFB` (fundo principal claro) e `#FFFFFF` (cards)
  - `border`: `#D9E3EA` | `graphite`: `#263238`
  - Semânticos: `#0E9F6E` (aprovado/validado), `#F59E0B` (pendente LGPD/atenção), `#EF4444` (bloqueado), `#2563EB` (info).
- **Tipografia:** `Sora` para títulos e valores numéricos de destaque (`Readiness Score`); `Inter` para texto de UI, tabelas e metadados.
- **Regras de Layout:**
  - **Mobile-first (`390px`):** 1 coluna limpa, barra inferior fixa para alternar entre Hub e módulos.
  - **Desktop (`1440px`):** Hub Central em **3 colunas** (máximo 3 blocos primários por viewport, sem excesso de KPIs empilhados).
  - **Assinatura:** `Next Gen Sports | Powered by PromptCore Labs` e selo `PCL Inside` no rodapé da barra lateral.

---

## 3. Contratos TypeScript Principais (`src/types/ngs.ts`)

```typescript
export type ActorRole = 'athlete' | 'league' | 'sponsor' | 'guardian';

export type NavModule =
  | 'hub'
  | 'leagues'
  | 'athlete_portal'
  | 'commerce'
  | 'sponsorship'
  | 'talent_network';

export type SportModality =
  | 'Kart / Automobilismo'
  | 'Futebol'
  | 'Basquete'
  | 'Vôlei'
  | 'Natação'
  | 'Corrida / Endurance';

export type LgpdConsentStatus = 'pending' | 'approved' | 'revoked';

export interface LgpdConsentState {
  isMinor: boolean; // true para < 18 anos (Privacy by Default)
  status: LgpdConsentStatus;
  guardianName?: string;
  guardianCpfMasked?: string;
  approvedAt?: string;
  permissions: {
    publicTalentNetwork: boolean;
    sponsorshipMatching: boolean;
    externalSocialShare: boolean;
  };
}

export interface EvidenceItem {
  id: string;
  title: string;
  pillar: 'technical' | 'physical' | 'mental' | 'consistency' | 'equipment';
  sourceType: 'kart_timeslip_pdf' | 'academy_capstone' | 'coach_endorsement' | 'league_result';
  verifiedBy: string;
  date: string;
  impactPoints: number; // contribuição auditável para o Readiness Score
  summary: string;
}

export interface ReadinessBreakdown {
  total: number; // Escala oficial 0–100
  technical: number; // 0–20
  physical: number; // 0–20
  mental: number; // 0–20
  consistency: number; // 0–20
  equipment: number; // 0–20
  evidences: EvidenceItem[];
}

export interface AcademyProgress {
  xpTotal: number; // Escala oficial Academy LMS 0–1000
  rankLabel: string; // Ex.: 'Piloto de Base', 'Competidor Prata', 'All-Star'
  normalizedReadinessContribution: number; // Math.round((xpTotal / 1000) * 20)
  completedModules: number;
  totalModules: number;
  badges: string[];
}

export interface AthleteProfile {
  id: string;
  name: string; // Ex.: 'Gabriel Almeida' (proibido usar nomes vetados)
  age: number;
  city: string;
  primarySport: SportModality;
  secondarySports: SportModality[];
  bio: string;
  lgpd: LgpdConsentState;
  readiness: ReadinessBreakdown;
  academy: AcademyProgress;
  leagueIds: string[];
  driverTelemetry?: {
    // Exclusivo para módulo de automobilismo ('Driver' apenas aqui)
    bestLap: string;
    avgDeviationSec: number;
    kartTrack: string;
    lapsAnalyzed: number;
  };
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRoleLabel: string;
  sport: SportModality;
  createdAt: string;
  category: 'telemetry_proof' | 'academy_badge' | 'coach_endorsement' | 'league_podium';
  title: string;
  body: string;
  evidenceTag: string;
  readinessDelta?: string;
  reactionsCount: number;
  endorsedBy?: string;
}

export interface League {
  id: string;
  name: string;
  sport: SportModality;
  season: string;
  athletesCount: number;
  avgReadiness: number;
  nextStageDate: string;
  nextStageLocation: string;
  pendingTimeSheets: number;
}

export interface PerformanceSpecialist {
  id: string;
  name: string;
  specialty: 'Coach Técnico' | 'Preparador Físico' | 'Mecânico / Setup' | 'Nutricionista' | 'Psicólogo Esportivo';
  sportFocus: SportModality | 'Multiesporte';
  targetPillar: ReadinessBreakdown['evidences'][number]['pillar'];
  rating: number;
  ngsCertified: boolean;
  offerTitle: string; // "Setup / Kit de Performance"
  priceLabel: string;
}

export interface SponsorshipOpportunity {
  id: string;
  brandName: string;
  sector: string;
  sport: SportModality | 'Multiesporte';
  minReadiness: number; // Filtro padrão > 70
  benefitType: 'Apoio Financeiro Direto' | 'Equipamento & Pneus' | 'Voucher de Desenvolvimento';
  deliverables: string[];
  status: 'open' | 'in_review' | 'matched';
}
```

---

## 4. Regras de Negócio & Fluxos Obrigatórios no Protótipo

1. **Normalização `Academy (0–1000)` → `Readiness Score (0–100)`:**
   - O `Portal do Atleta` exibe o `Readiness Score` em **`0–100`** (soma dos 5 pilares de `0–20` cada) e o progresso da `NGS Academy` em **`0–1000 XP`**.
   - Ao concluir um módulo simulado na Academy, `xpTotal` sobe (ex.: `+100 XP`, teto `1000`), recalculando a contribuição normalizada no Readiness e publicando um novo card no `HubFeed3Col`.
2. **Fluxo Obrigatório LGPD Art. 14 (`Privacy by Default < 18`):**
   - O atleta principal `Gabriel Almeida` (16 anos) inicia com `lgpd.status = 'pending'` e `permissions.publicTalentNetwork = false`.
   - Enquanto `pending` ou `revoked`:
     - Na `Talent Network`, o perfil dele exibe aviso de **Privacidade Protegida (Aguardando Responsável Legal)** e fica oculto para olheiros/patrocinadores.
     - No módulo `Sponsorship`, o botão de candidatura exibe bloqueio explicativo com atalho para o fluxo do **Responsável Legal**.
   - Ao alternar o `ActorSwitcher` para `Responsável Legal` (ou abrir o `LgpdConsentModal`), o usuário preenche/confirma os checkboxes granulares e clica em **Validar Consentimento Parental**, liberando imediatamente a visibilidade auditável.
3. **Filtro `Readiness Score > 70` em `Sponsorship`:**
   - A tela `Sponsorship` inclui filtro ativo/toggle para exibir oportunidades compatíveis com `Readiness Score > 70` e lista de atletas elegíveis (respeitando a trava LGPD).
   - **Proibição absoluta:** Zero menções ou telas de incentivo fiscal esportivo, criptoativos/ativos digitais ou captação regulada de valores mobiliários.
4. **Leitura Simulada de Folha de Tempos (PLG Kart):**
   - Na aba `Gestão de Ligas` (ou botão rápido no Hub), um modal/painel permite simular o upload de uma folha de tempos de kart (PDF/CSV fictício) e gerar instantaneamente o card de `Proof of Talent` com desvio médio e recomendação de trilha no LMS.
