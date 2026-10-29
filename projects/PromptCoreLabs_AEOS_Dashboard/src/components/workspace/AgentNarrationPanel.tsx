import React, { useState } from 'react';
import { Play, Pause, FastForward, Radio, CheckCircle, Clock } from 'lucide-react';

interface AgentNarrationPanelProps {
  agentName: string;
  taskTitle: string;
  currentStepIndex: number;
  totalSteps: number;
  steps: string[];
}

export const AgentNarrationPanel: React.FC<AgentNarrationPanelProps> = ({
  agentName,
  taskTitle,
  currentStepIndex,
  totalSteps,
  steps
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<'1x' | '5x'>('1x');

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs select-none">
      {/* Agent & Task Narration */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center font-bold text-xs flex-shrink-0">
          <Radio className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-emerald-400">{agentName}</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
              Passo {currentStepIndex} de {totalSteps}
            </span>
          </div>
          <p className="text-slate-300 text-[11px] font-mono truncate max-w-md">
            {steps[currentStepIndex - 1] || taskTitle}
          </p>
        </div>
      </div>

      {/* Playback Controls & Timeline Bar */}
      <div className="flex items-center space-x-4">
        {/* Progress Bar */}
        <div className="w-32 md:w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(currentStepIndex / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded border border-slate-700">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded hover:bg-slate-700 text-slate-200 transition"
            title={isPlaying ? 'Pausar Narração' : 'Continuar Narração'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button
            onClick={() => setSpeed(speed === '1x' ? '5x' : '1x')}
            className={`px-1.5 py-0.5 rounded font-mono text-[10px] transition ${
              speed === '5x' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Alternar Velocidade (1x / 5x)"
          >
            {speed}
          </button>
        </div>
      </div>
    </div>
  );
};
