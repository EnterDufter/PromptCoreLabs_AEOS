import React from 'react';
import { Award, Handshake, Home, ShoppingBag, Trophy, Users } from 'lucide-react';
import { useNgs } from '../../context/NgsContext';
import { NavModule } from '../../types/ngs';

const MOBILE_ITEMS: { id: NavModule; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'hub', label: 'Hub', icon: Home },
  { id: 'leagues', label: 'Ligas', icon: Trophy },
  { id: 'athlete_portal', label: 'Atleta', icon: Award },
  { id: 'talent_network', label: 'Talentos', icon: Users },
  { id: 'sponsorship', label: 'Marcas', icon: Handshake },
  { id: 'commerce', label: 'Commerce', icon: ShoppingBag },
];

export const MobileNav: React.FC = () => {
  const { activeModule, setActiveModule } = useNgs();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#D9E3EA] bg-white px-1 py-1.5 lg:hidden"
      aria-label="Navegação Mobile"
    >
      <div className="grid grid-cols-6 gap-0.5">
        {MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeModule === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveModule(item.id)}
              className={`flex flex-col items-center justify-center rounded-lg py-1 text-[10px] font-medium transition ${
                active ? 'bg-[#0D47A1]/10 text-[#0D47A1]' : 'text-slate-500'
              }`}
            >
              <Icon className={`mb-0.5 h-4 w-4 ${active ? 'text-[#0D47A1]' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
