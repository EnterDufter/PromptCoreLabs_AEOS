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
  isMinor: boolean;
  status: LgpdConsentStatus;
  guardianName?: string;
  guardianCpfMasked?: string;
  guardianEmail?: string;
  guardianRelation?: 'Mãe' | 'Pai' | 'Tutor(a) Legal';
  approvedAt?: string;
  permissions: {
    publicTalentNetwork: boolean;
    sponsorshipMatching: boolean;
    externalSocialShare: boolean;
  };
}

export type ReadinessPillar = 'technical' | 'physical' | 'mental' | 'consistency' | 'equipment';

export interface EvidenceItem {
  id: string;
  title: string;
  pillar: ReadinessPillar;
  sourceType: 'kart_timeslip_pdf' | 'academy_capstone' | 'coach_endorsement' | 'league_result';
  verifiedBy: string;
  date: string;
  impactPoints: number;
  summary: string;
}

export interface ReadinessBreakdown {
  total: number; // 0–100
  technical: number; // 0–20
  physical: number; // 0–20
  mental: number; // 0–20
  consistency: number; // 0–20
  equipment: number; // 0–20
  evidences: EvidenceItem[];
}

export interface AcademyProgress {
  xpTotal: number; // 0–1000
  rankLabel: string;
  normalizedReadinessContribution: number; // Math.round((xpTotal / 1000) * 20)
  completedModules: number;
  totalModules: number;
  badges: string[];
}

export interface AthleteProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  categoryLabel: string;
  primarySport: SportModality;
  secondarySports: SportModality[];
  bio: string;
  followers: number;
  connections: number;
  statusTag: string;
  lgpd: LgpdConsentState;
  readiness: ReadinessBreakdown;
  academy: AcademyProgress;
  leagueIds: string[];
  driverTelemetry?: {
    bestLap: string;
    avgDeviationSec: number;
    sectorDeltaS2: string;
    consistencyPct: number;
    kartTrack: string;
    lapsAnalyzed: number;
    insight: string;
  };
}

export type FeedCategory =
  | 'telemetry_proof'
  | 'academy_badge'
  | 'coach_endorsement'
  | 'league_podium'
  | 'sponsorship_opportunity';

export interface FeedComment {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRoleLabel: string;
  isOfficial?: boolean;
  sport: SportModality;
  location?: string;
  createdAt: string;
  category: FeedCategory;
  title: string;
  body: string;
  evidenceTag: string;
  readinessDelta?: string;
  telemetryHighlight?: {
    metricLabel: string;
    metricValue: string;
    consistencyLabel: string;
    statusLabel: string;
  };
  ctaLabel?: string;
  ctaTargetModule?: NavModule;
  reactionsCount: number;
  likedByMe?: boolean;
  endorsedBy?: string;
  comments: FeedComment[];
}

export interface LeagueStage {
  id: string;
  name: string;
  date: string;
  location: string;
  status: 'Inscrições Abertas' | 'Check-in Ativo' | 'Homologada';
  slotsFilled: number;
  slotsTotal: number;
}

export interface League {
  id: string;
  name: string;
  operatorName: string;
  sport: SportModality;
  season: string;
  athletesCount: number;
  capacityCount: number;
  proAthletesCount: number;
  monthlyFeeBrl: number;
  evidenceApprovalRatePct: number;
  avgReadiness: number;
  nextStageDate: string;
  nextStageLocation: string;
  pendingTimeSheets: number;
  whiteLabelDomain: string;
  stages: LeagueStage[];
}

export interface AcademyModule {
  id: string;
  title: string;
  trackName: string;
  pillar: ReadinessPillar;
  xpReward: number;
  duration: string;
  badgeReward: string;
  completed: boolean;
  description: string;
}

export interface PerformanceSpecialist {
  id: string;
  name: string;
  specialty:
    | 'Coach Técnico'
    | 'Preparador Físico'
    | 'Mecânico / Setup'
    | 'Nutricionista'
    | 'Psicólogo Esportivo';
  sportFocus: SportModality | 'Multiesporte';
  targetPillar: ReadinessPillar;
  city: string;
  rating: number;
  reviewsCount: number;
  ngsCertified: boolean;
  offerTitle: string;
  priceLabel: string;
  priceValue: number;
  ctaLabel: string;
}

export interface PerformanceKit {
  id: string;
  title: string;
  category: 'Setup de Performance' | 'Kit de Performance';
  targetPillar: ReadinessPillar;
  itemsSummary: string;
  voucherLabel: string;
  priceLabel: string;
}

export interface SponsorshipOpportunity {
  id: string;
  brandName: string;
  analystName: string;
  sector: string;
  sport: SportModality | 'Multiesporte';
  minReadiness: number;
  benefitType: 'Apoio Financeiro Direto' | 'Equipamento & Pneus' | 'Voucher de Desenvolvimento';
  budgetBrl: number;
  committedPct: number;
  evidencesDelivered: number;
  estimatedEmvBrl: number;
  requirementText: string;
  deliverables: string[];
  status: 'open' | 'in_review' | 'matched';
}
