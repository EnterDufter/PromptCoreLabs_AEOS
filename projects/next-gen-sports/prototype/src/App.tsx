import React from 'react';
import { NgsProvider, useNgs } from './context/NgsContext';
import { TopBar } from './components/layout/TopBar';
import { SideNav } from './components/layout/SideNav';
import { MobileNav } from './components/layout/MobileNav';
import { HubFeed3Col } from './components/hub/HubFeed3Col';
import { LeaguesView } from './components/modules/LeaguesView';
import { AthletePortalView } from './components/modules/AthletePortalView';
import { CommerceHubView } from './components/modules/CommerceHubView';
import { SponsorshipView } from './components/modules/SponsorshipView';
import { TalentNetworkView } from './components/modules/TalentNetworkView';
import { LgpdConsentModal } from './components/lgpd/LgpdConsentModal';
import { ReadinessDrawer } from './components/lgpd/ReadinessDrawer';
import { CopyAiModal } from './components/hub/CopyAiModal';

const AppShell: React.FC = () => {
  const { activeModule, toastMessage } = useNgs();

  const renderModule = () => {
    switch (activeModule) {
      case 'hub':
        return <HubFeed3Col />;
      case 'leagues':
        return <LeaguesView />;
      case 'athlete_portal':
        return <AthletePortalView />;
      case 'commerce':
        return <CommerceHubView />;
      case 'sponsorship':
        return <SponsorshipView />;
      case 'talent_network':
        return <TalentNetworkView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] pb-20 text-[#263238] lg:pb-8">
      <TopBar />

      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-5 lg:px-6">
        <SideNav />
        <main className="min-w-0 flex-1">{renderModule()}</main>
      </div>

      <footer className="mx-auto mt-6 max-w-[1440px] border-t border-[#D9E3EA] px-4 py-4 text-[11px] text-slate-500 lg:px-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <p>
            <strong>Ambiente de Demonstração (Protótipo Navegável NGS):</strong> Perfis,
            pontuações, telemetria, métricas e oportunidades exibidas são dados simulados para
            validação de experiência, sem vínculo contratual ou tratamento de dados pessoais reais
            em produção.
          </p>
          <span className="shrink-0 font-semibold text-[#031B33]">
            Next Gen Sports | Powered by PromptCore Labs
          </span>
        </div>
      </footer>

      <MobileNav />
      <LgpdConsentModal />
      <ReadinessDrawer />
      <CopyAiModal />

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-20 right-4 z-50 max-w-sm rounded-xl bg-[#031B33] px-4 py-3 text-xs font-medium text-white shadow-xl lg:bottom-6"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <NgsProvider>
      <AppShell />
    </NgsProvider>
  );
}
