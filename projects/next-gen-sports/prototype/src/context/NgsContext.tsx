import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  AcademyModule,
  ActorRole,
  AthleteProfile,
  FeedCategory,
  FeedPost,
  League,
  NavModule,
  SportModality,
} from '../types/ngs';
import { INITIAL_ATHLETES } from '../data/mockAthletes';
import { INITIAL_FEED_POSTS } from '../data/mockFeed';
import { INITIAL_LEAGUES } from '../data/mockLeagues';
import { INITIAL_ACADEMY_MODULES } from '../data/mockAcademy';

interface ApproveLgpdPayload {
  guardianName: string;
  guardianCpf: string;
  guardianEmail: string;
  guardianRelation: 'Mãe' | 'Pai' | 'Tutor(a) Legal';
}

interface NgsContextValue {
  activeActor: ActorRole;
  setActiveActor: (actor: ActorRole) => void;
  activeModule: NavModule;
  setActiveModule: (mod: NavModule) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  athletes: AthleteProfile[];
  primaryAthlete: AthleteProfile;
  feedPosts: FeedPost[];
  leagues: League[];
  academyModules: AcademyModule[];
  scoutingBoardIds: string[];
  connectedIds: string[];
  appliedSponsorshipIds: string[];
  lgpdModalOpen: boolean;
  openLgpdModal: () => void;
  closeLgpdModal: () => void;
  readinessDrawerOpen: boolean;
  openReadinessDrawer: () => void;
  closeReadinessDrawer: () => void;
  copyAiPost: FeedPost | null;
  openCopyAiModal: (post: FeedPost) => void;
  closeCopyAiModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  publishPost: (body: string, category: FeedCategory, evidenceTag: string, sport?: SportModality) => void;
  toggleEndorsePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  completeAcademyModule: (moduleId: string) => void;
  simulateTimeslipUpload: (leagueId: string, fileName: string) => void;
  approveLgpdConsent: (payload: ApproveLgpdPayload) => void;
  keepProfilePrivate: () => void;
  toggleScoutingBoard: (athleteId: string) => void;
  toggleConnect: (targetId: string, targetName: string) => void;
  applyToSponsorship: (oppId: string, brandName: string) => void;
}

const NgsContext = createContext<NgsContextValue | undefined>(undefined);

function maskCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length >= 9) {
    return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
  }
  return '***.***.***-**';
}

export const NgsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeActor, setActiveActorState] = useState<ActorRole>('athlete');
  const [activeModule, setActiveModule] = useState<NavModule>('hub');
  const [searchQuery, setSearchQuery] = useState('');
  const [athletes, setAthletes] = useState<AthleteProfile[]>(INITIAL_ATHLETES);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
  const [leagues, setLeagues] = useState<League[]>(INITIAL_LEAGUES);
  const [academyModules, setAcademyModules] = useState<AcademyModule[]>(INITIAL_ACADEMY_MODULES);
  const [scoutingBoardIds, setScoutingBoardIds] = useState<string[]>(['ath-marina']);
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [appliedSponsorshipIds, setAppliedSponsorshipIds] = useState<string[]>([]);
  const [lgpdModalOpen, setLgpdModalOpen] = useState(false);
  const [readinessDrawerOpen, setReadinessDrawerOpen] = useState(false);
  const [copyAiPost, setCopyAiPost] = useState<FeedPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4200);
  };

  const primaryAthlete = useMemo(
    () => athletes.find((a) => a.id === 'ath-gabriel') ?? athletes[0],
    [athletes]
  );

  const setActiveActor = (actor: ActorRole) => {
    setActiveActorState(actor);
    if (actor === 'guardian' && primaryAthlete.lgpd.status === 'pending') {
      setLgpdModalOpen(true);
    }
  };

  const publishPost = (
    body: string,
    category: FeedCategory,
    evidenceTag: string,
    sport: SportModality = primaryAthlete.primarySport
  ) => {
    const trimmed = body.trim();
    if (!trimmed) return;

    const actorMeta: Record<ActorRole, { id: string; name: string; role: string; official?: boolean }> = {
      athlete: {
        id: primaryAthlete.id,
        name: primaryAthlete.name,
        role: `${primaryAthlete.primarySport.split(' ')[0]} • ${primaryAthlete.categoryLabel}`,
      },
      league: {
        id: 'lg-paulista-kart',
        name: 'Liga Paulista de Kart',
        role: 'Liga Esportiva',
        official: true,
      },
      sponsor: {
        id: 'sp-powerup',
        name: 'PowerUp Brasil',
        role: 'Patrocinador • Hidratação',
        official: true,
      },
      guardian: {
        id: 'guard-renata',
        name: 'Renata Almeida',
        role: 'Responsável Legal • Tutora LGPD',
      },
    };

    const meta = actorMeta[activeActor];
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      authorId: meta.id,
      authorName: meta.name,
      authorRoleLabel: meta.role,
      isOfficial: meta.official,
      sport,
      location: 'São Paulo, SP',
      createdAt: 'agora',
      category,
      title: evidenceTag,
      body: trimmed,
      evidenceTag,
      reactionsCount: 1,
      likedByMe: true,
      comments: [],
    };

    setFeedPosts((prev) => [newPost, ...prev]);
    showToast('Publicação adicionada ao Hub Central.');
  };

  const toggleEndorsePost = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const liked = !post.likedByMe;
        return {
          ...post,
          likedByMe: liked,
          reactionsCount: liked ? post.reactionsCount + 1 : Math.max(0, post.reactionsCount - 1),
        };
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const authorByActor: Record<ActorRole, { name: string; role: string }> = {
      athlete: { name: primaryAthlete.name, role: 'Atleta' },
      league: { name: 'Carlos Menezes', role: 'Operador de Liga' },
      sponsor: { name: 'Juliana Prado', role: 'PowerUp Brasil' },
      guardian: { name: 'Renata Almeida', role: 'Responsável Legal' },
    };
    const a = authorByActor[activeActor];
    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `c-${Date.now()}`,
                  authorName: a.name,
                  authorRole: a.role,
                  text: clean,
                  createdAt: 'agora',
                },
              ],
            }
          : post
      )
    );
  };

  const completeAcademyModule = (moduleId: string) => {
    const mod = academyModules.find((m) => m.id === moduleId);
    if (!mod || mod.completed) return;

    setAcademyModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, completed: true } : m)));

    setAthletes((prev) =>
      prev.map((ath) => {
        if (ath.id !== 'ath-gabriel') return ath;
        const newXp = Math.min(1000, ath.academy.xpTotal + mod.xpReward);
        const normContrib = Math.round((newXp / 1000) * 20);
        const pillarKey = mod.pillar;
        const nextPillarVal = Math.min(20, ath.readiness[pillarKey] + 2);
        const updatedReadiness = {
          ...ath.readiness,
          [pillarKey]: nextPillarVal,
        };
        const newTotal =
          updatedReadiness.technical +
          updatedReadiness.physical +
          updatedReadiness.mental +
          updatedReadiness.consistency +
          updatedReadiness.equipment;

        const newEvidence = {
          id: `ev-${Date.now()}`,
          title: `Capstone Validado: ${mod.title}`,
          pillar: mod.pillar,
          sourceType: 'academy_capstone' as const,
          verifiedBy: 'NGS Academy • Evidência Auditável',
          date: '21/05/2026',
          impactPoints: 2,
          summary: `Conclusão com entrega prática (+${mod.xpReward} XP na escala Academy 0–1000).`,
        };

        return {
          ...ath,
          academy: {
            ...ath.academy,
            xpTotal: newXp,
            normalizedReadinessContribution: normContrib,
            completedModules: Math.min(ath.academy.totalModules, ath.academy.completedModules + 1),
            badges: ath.academy.badges.includes(mod.badgeReward)
              ? ath.academy.badges
              : [...ath.academy.badges, mod.badgeReward],
          },
          readiness: {
            ...updatedReadiness,
            total: Math.min(100, newTotal),
            evidences: [newEvidence, ...ath.readiness.evidences],
          },
        };
      })
    );

    const badgePost: FeedPost = {
      id: `post-ac-${Date.now()}`,
      authorId: primaryAthlete.id,
      authorName: primaryAthlete.name,
      authorRoleLabel: 'Kart • Graduados',
      sport: primaryAthlete.primarySport,
      location: primaryAthlete.city,
      createdAt: 'agora',
      category: 'academy_badge',
      title: `Evidência validada: ${mod.title}`,
      body: `Enviei minha evidência prática na trilha '${mod.trackName}' na NGS Academy (+${mod.xpReward} XP) e desbloqueei a badge ${mod.badgeReward}.`,
      evidenceTag: `${mod.badgeReward} • NGS Academy`,
      readinessDelta: '+2 pts no Readiness',
      reactionsCount: 1,
      likedByMe: true,
      comments: [],
    };
    setFeedPosts((prev) => [badgePost, ...prev]);
    showToast(`+${mod.xpReward} XP na Academy! Readiness Score recalculado.`);
  };

  const simulateTimeslipUpload = (leagueId: string, fileName: string) => {
    setLeagues((prev) =>
      prev.map((lg) =>
        lg.id === leagueId
          ? {
              ...lg,
              pendingTimeSheets: Math.max(0, lg.pendingTimeSheets - 1),
              evidenceApprovalRatePct: Math.min(99, lg.evidenceApprovalRatePct + 1),
            }
          : lg
      )
    );

    setAthletes((prev) =>
      prev.map((ath) => {
        if (ath.id !== 'ath-gabriel') return ath;
        const nextConsistency = Math.min(20, ath.readiness.consistency + 1);
        const updated = { ...ath.readiness, consistency: nextConsistency };
        const total =
          updated.technical +
          updated.physical +
          updated.mental +
          updated.consistency +
          updated.equipment;
        return {
          ...ath,
          readiness: {
            ...updated,
            total: Math.min(100, total),
            evidences: [
              {
                id: `ev-ts-${Date.now()}`,
                title: `Folha de Tempos Normalizada (${fileName})`,
                pillar: 'consistency',
                sourceType: 'kart_timeslip_pdf',
                verifiedBy: 'Telemetry Hub • Liga Paulista de Kart',
                date: '21/05/2026',
                impactPoints: 3,
                summary: 'Voltas normalizadas com desvio de 0.11s; recomendação gerada para pilar Equipamento.',
              },
              ...ath.readiness.evidences,
            ],
          },
        };
      })
    );

    const telemetryPost: FeedPost = {
      id: `post-ts-${Date.now()}`,
      authorId: 'ath-gabriel',
      authorName: 'Gabriel Almeida',
      authorRoleLabel: 'Kart • Graduados',
      sport: 'Kart / Automobilismo',
      location: 'Interlagos, SP',
      createdAt: 'agora',
      category: 'telemetry_proof',
      title: `Folha de Tempos Homologada (${fileName})`,
      body: 'Nova sessão normalizada pelo Telemetry Hub! Ritmo estável em 0:52.09 com recomendação automática para trilha de Setup na NGS Academy.',
      evidenceTag: 'Proof of Talent • Folha de Tempos',
      readinessDelta: '+1 pt Consistência',
      telemetryHighlight: {
        metricLabel: 'Melhor Volta',
        metricValue: '0:52.09',
        consistencyLabel: 'Desvio Médio: 0.11s',
        statusLabel: 'Digital Twin Driver: Atualizado',
      },
      reactionsCount: 1,
      likedByMe: true,
      comments: [],
    };
    setFeedPosts((prev) => [telemetryPost, ...prev]);
    showToast(`Folha "${fileName}" normalizada e publicada como Proof of Talent!`);
  };

  const approveLgpdConsent = (payload: ApproveLgpdPayload) => {
    setAthletes((prev) =>
      prev.map((ath) => {
        if (ath.id !== 'ath-gabriel') return ath;
        return {
          ...ath,
          lgpd: {
            ...ath.lgpd,
            status: 'approved',
            guardianName: payload.guardianName,
            guardianCpfMasked: maskCpf(payload.guardianCpf),
            guardianEmail: payload.guardianEmail,
            guardianRelation: payload.guardianRelation,
            approvedAt: '21/05/2026 • Agora',
            permissions: {
              publicTalentNetwork: true,
              sponsorshipMatching: true,
              externalSocialShare: true,
            },
          },
        };
      })
    );
    setLgpdModalOpen(false);
    showToast('Consentimento Parental LGPD aprovado! Perfil liberado no Talent Network e Sponsorship.');
  };

  const keepProfilePrivate = () => {
    setAthletes((prev) =>
      prev.map((ath) => {
        if (ath.id !== 'ath-gabriel') return ath;
        return {
          ...ath,
          lgpd: {
            ...ath.lgpd,
            status: 'pending',
            permissions: {
              publicTalentNetwork: false,
              sponsorshipMatching: false,
              externalSocialShare: false,
            },
          },
        };
      })
    );
    setLgpdModalOpen(false);
    showToast('Perfil mantido privado (Privacy by Default ativo).');
  };

  const toggleScoutingBoard = (athleteId: string) => {
    setScoutingBoardIds((prev) =>
      prev.includes(athleteId) ? prev.filter((id) => id !== athleteId) : [...prev, athleteId]
    );
  };

  const toggleConnect = (targetId: string, targetName: string) => {
    setConnectedIds((prev) => {
      const exists = prev.includes(targetId);
      showToast(exists ? `Conexão com ${targetName} removida.` : `Conectado a ${targetName}!`);
      return exists ? prev.filter((id) => id !== targetId) : [...prev, targetId];
    });
  };

  const applyToSponsorship = (oppId: string, brandName: string) => {
    if (primaryAthlete.lgpd.isMinor && primaryAthlete.lgpd.status !== 'approved') {
      setLgpdModalOpen(true);
      showToast('Autorização do Responsável Legal obrigatória antes de enviar Mídia-Kit.');
      return;
    }
    setAppliedSponsorshipIds((prev) => (prev.includes(oppId) ? prev : [...prev, oppId]));
    showToast(`Mídia-Kit Auditável enviado para ${brandName}!`);
  };

  return (
    <NgsContext.Provider
      value={{
        activeActor,
        setActiveActor,
        activeModule,
        setActiveModule,
        searchQuery,
        setSearchQuery,
        athletes,
        primaryAthlete,
        feedPosts,
        leagues,
        academyModules,
        scoutingBoardIds,
        connectedIds,
        appliedSponsorshipIds,
        lgpdModalOpen,
        openLgpdModal: () => setLgpdModalOpen(true),
        closeLgpdModal: () => setLgpdModalOpen(false),
        readinessDrawerOpen,
        openReadinessDrawer: () => setReadinessDrawerOpen(true),
        closeReadinessDrawer: () => setReadinessDrawerOpen(false),
        copyAiPost,
        openCopyAiModal: (post) => setCopyAiPost(post),
        closeCopyAiModal: () => setCopyAiPost(null),
        toastMessage,
        showToast,
        publishPost,
        toggleEndorsePost,
        addComment,
        completeAcademyModule,
        simulateTimeslipUpload,
        approveLgpdConsent,
        keepProfilePrivate,
        toggleScoutingBoard,
        toggleConnect,
        applyToSponsorship,
      }}
    >
      {children}
    </NgsContext.Provider>
  );
};

export function useNgs(): NgsContextValue {
  const ctx = useContext(NgsContext);
  if (!ctx) {
    throw new Error('useNgs deve ser usado dentro de NgsProvider');
  }
  return ctx;
}
