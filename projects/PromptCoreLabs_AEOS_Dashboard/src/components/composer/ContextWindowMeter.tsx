import React from 'react';

interface ContextWindowMeterProps {
  usedTokens: number;
  maxTokens: number;
}

export const ContextWindowMeter: React.FC<ContextWindowMeterProps> = ({ usedTokens, maxTokens }) => {
  const percentage = Math.round((usedTokens / maxTokens) * 100);

  const getStatusColor = () => {
    if (percentage < 70) return 'bg-emerald-500 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
    if (percentage < 90) return 'bg-amber-500 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    return 'bg-rose-500 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
  };

  return (
    <div
      className={`px-2 py-0.5 rounded-full border text-[10px] font-mono flex items-center space-x-1 shadow-sm select-none ${getStatusColor()}`}
      title={`Janela de Contexto LLM: ${(usedTokens / 1000).toFixed(1)}k de ${(maxTokens / 1000).toFixed(0)}k tokens acumulados (${percentage}%)`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${percentage < 70 ? 'bg-emerald-500' : percentage < 90 ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
      <span>{(usedTokens / 1000).toFixed(1)}k / {(maxTokens / 1000).toFixed(0)}k ({percentage}%)</span>
    </div>
  );
};
