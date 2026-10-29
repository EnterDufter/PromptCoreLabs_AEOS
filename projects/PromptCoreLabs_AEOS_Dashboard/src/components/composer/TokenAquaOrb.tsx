import React, { useState } from 'react';

interface TokenAquaOrbProps {
  usedTokens: number;
  maxTokens: number;
}

export const TokenAquaOrb: React.FC<TokenAquaOrbProps> = ({ usedTokens, maxTokens }) => {
  const [isHovered, setIsHovered] = useState(false);
  const percentage = Math.round((usedTokens / maxTokens) * 100);

  // Determinar paleta cromática e classes de glow dinâmico de 5s / 2s
  const isNormal = percentage < 70;
  const isAlert = percentage >= 70 && percentage <= 90;
  const isCritical = percentage > 90;

  const getOrbGradient = () => {
    if (isNormal) {
      return 'bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-700 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    }
    if (isAlert) {
      // Glow oscilando a cada 5 segundos
      return 'bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_10px_rgba(245,158,11,0.7)] animate-[pulse_5s_ease-in-out_infinite]';
    }
    // Glow crítico oscilando a cada 2 segundos
    return 'bg-gradient-to-b from-rose-400 via-rose-600 to-rose-800 shadow-[0_0_12px_rgba(244,63,94,0.9)] animate-[pulse_2s_ease-in-out_infinite]';
  };

  const getTextColor = () => {
    if (isNormal) return 'text-emerald-700 dark:text-emerald-300';
    if (isAlert) return 'text-amber-700 dark:text-amber-300';
    return 'text-rose-700 dark:text-rose-300';
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center select-none cursor-pointer group"
      title={`Janela de Contexto LLM: ${(usedTokens / 1000).toFixed(1)}k / ${(maxTokens / 1000).toFixed(0)}k tokens (${percentage}%)`}
    >
      <div
        style={{
          width: isHovered ? '135px' : '18px',
          height: '18px',
          transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        className={`rounded-full flex items-center px-1 overflow-hidden backdrop-blur-md border border-white/60 dark:border-white/20 ${
          isHovered
            ? 'bg-slate-100/95 dark:bg-slate-900/95 shadow-md border-slate-300/80 dark:border-slate-700'
            : 'bg-transparent'
        }`}
      >
        {/* Esfera Tridimensional Vítrea (Apple OS X Aqua Specular Flare) */}
        <div
          className={`relative w-4 h-4 rounded-full flex-shrink-0 transition-transform ${getOrbGradient()} ${
            isHovered ? 'scale-90' : 'group-hover:scale-110'
          }`}
        >
          {/* Ponto de Reflexo Especular Superior (Apple Aqua Glint) */}
          <div className="absolute top-[1.5px] left-[2.5px] w-2 h-1 bg-white/80 rounded-full blur-[0.3px] -rotate-12 pointer-events-none"></div>
          {/* Reflexo de borda inferior */}
          <div className="absolute bottom-[1px] right-[2px] w-1.5 h-1 bg-white/30 rounded-full blur-[0.4px] pointer-events-none"></div>
        </div>

        {/* Texto revelado na expansão on-hover */}
        <div
          className={`ml-1.5 text-[10px] font-mono font-bold whitespace-nowrap tracking-tight transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          } ${getTextColor()}`}
        >
          {(usedTokens / 1000).toFixed(1)}k / {(maxTokens / 1000).toFixed(0)}k ({percentage}%)
        </div>
      </div>
    </div>
  );
};
