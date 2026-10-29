import React, { useState } from 'react';
import { 
  CheckCircle2, Loader2, Circle, Clock, ChevronDown, 
  ChevronUp, ShieldCheck, Database, Globe, Cpu, Sparkles 
} from 'lucide-react';

export interface ExecutionStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'skipped';
  durationMs?: number;
  detail?: string;
}

interface LiveExecutionStepperProps {
  steps: ExecutionStep[];
  activeStepIndex: number;
  elapsedSeconds: number;
  isProcessing: boolean;
  confidenceScore?: number;
}

export const LiveExecutionStepper: React.FC<LiveExecutionStepperProps> = ({
  steps,
  activeStepIndex,
  elapsedSeconds,
  isProcessing,
  confidenceScore
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const currentStep = steps[activeStepIndex] || steps[steps.length - 1];

  const getStepIcon = (step: ExecutionStep) => {
    if (step.status === 'completed') {
      return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
    }
    if (step.status === 'running') {
      return <Loader2 className="w-4 h-4 text-sky-500 animate-spin flex-shrink-0" />;
    }
    return <Circle className="w-4 h-4 text-slate-300 dark:text-slate-700 flex-shrink-0" />;
  };

  const getStepCategoryIcon = (id: string) => {
    switch (id) {
      case 'laya_coprocessor':
        return <Cpu className="w-3 h-3 text-amber-500 inline mr-1" />;
      case 'canonical_knowledge':
        return <Database className="w-3 h-3 text-indigo-500 inline mr-1" />;
      case 'web_search':
        return <Globe className="w-3 h-3 text-sky-500 inline mr-1" />;
      case 'omniroute_llm':
        return <Sparkles className="w-3 h-3 text-purple-500 inline mr-1" />;
      case 'audit_validation':
        return <ShieldCheck className="w-3 h-3 text-emerald-500 inline mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full my-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200">
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-900/60 transition"
      >
        <div className="flex items-center space-x-2.5 truncate">
          {isProcessing ? (
            <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          )}

          <div className="truncate">
            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
              <span>{isProcessing ? 'Executando Pipeline Cognitivo' : 'Pipeline Executado com Sucesso'}</span>
            </span>
            {isProcessing && currentStep && (
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium truncate block">
                {currentStep.label}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-400">
          {/* Cronômetro Dinâmico em Tempo Real */}
          <div className="flex items-center space-x-1 font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{elapsedSeconds.toFixed(1)}s</span>
          </div>

          {confidenceScore !== undefined && !isProcessing && (
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {(confidenceScore * 100).toFixed(0)}% Confiança
            </span>
          )}

          <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
        <div 
          className={`h-1 transition-all duration-300 ${
            isProcessing ? 'bg-sky-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Expanded Stepper Steps */}
      {isExpanded && (
        <div className="p-3 space-y-2 bg-white/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60">
          {steps.map((step) => {
            const isCurrent = step.status === 'running';
            const isDone = step.status === 'completed';

            return (
              <div 
                key={step.id}
                className={`flex items-start space-x-2.5 text-xs p-1.5 rounded-lg transition ${
                  isCurrent 
                    ? 'bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60' 
                    : isDone
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <div className="mt-0.5">{getStepIcon(step)}</div>

                <div className="flex-1 truncate">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${isCurrent ? 'text-sky-700 dark:text-sky-300 font-bold' : ''}`}>
                      {getStepCategoryIcon(step.id)}
                      {step.label}
                    </span>

                    {step.durationMs !== undefined && (
                      <span className="font-mono text-[10px] text-slate-400 ml-2">
                        {step.durationMs}ms
                      </span>
                    )}
                  </div>

                  {step.detail && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block mt-0.5 font-normal">
                      {step.detail}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
