import React from 'react';
import {
  Award,
  Handshake,
  Home,
  ShoppingBag,
  Trophy,
  Users,
} from 'lucide-react';
import { useNgs } from '../../context/NgsContext';
import { NavModule } from '../../types/ngs';

const NAV_ITEMS: { id: NavModule; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'hub', label: 'Hub Central', icon: Home },
  { id: 'leagues', label: 'Gestão de Ligas', icon: Trophy },
  { id: 'athlete_portal', label: 'Portal do Atleta', icon: Award },
  { id: 'talent_network', label: 'Talent Network', icon: Users },
  { id: 'sponsorship', label: 'Sponsorship', icon: Handshake },
  { id: 'commerce', label: 'Commerce Hub', icon: ShoppingBag },
];

export const SideNav: React.FC = () => {
  const { activeModule, setActiveModule } = useNgs();

  return (
    <aside className="hidden w-60 shrink-0 flex-col justify-between rounded-2xl bg-[#031B33] p-4 text-white lg:flex">
      <div>
        <div className="mb-4 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Painel Central NGS
        </div>
        <nav className="space-y-1" aria-label="Navegação Principal">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveModule(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  active
                    ? 'bg-[#0D47A1] text-white shadow-sm'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-[#17B3B3]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 border-t border-white/10 pt-4">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-bold text-white">PCL Inside</span>
            <span className="h-2 w-2 rounded-full bg-[#17B3B3]" />
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
            Next Gen Sports | Powered by PromptCore Labs
          </p>
        </div>
      </div>
    </aside>
  );
};
