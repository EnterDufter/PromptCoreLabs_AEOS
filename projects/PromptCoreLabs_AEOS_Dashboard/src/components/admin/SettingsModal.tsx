import React, { useState } from 'react';
import { X, Lock, Server, DollarSign, Users, Cpu, Shield, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { UserManagementSecurity } from './UserManagementSecurity';
import { IntegrationsLibrary } from './IntegrationsLibrary';
import { CostsTokenDashboard } from './CostsTokenDashboard';
import { AgentSquadOrgChart } from './AgentSquadOrgChart';
import { SkillsManager } from './SkillsManager';
import { AuditComplianceBoard } from './AuditComplianceBoard';
import { NoCodeAgentBuilder } from './NoCodeAgentBuilder';

interface SettingsModalProps {
  user: UserProfile;
  defaultTab?: string;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ user, defaultTab = 'security', onClose }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = [
    { id: 'security', label: 'Segurança & Sessões', icon: Lock },
    { id: 'integrations', label: 'Conexões & MCPs', icon: Server },
    { id: 'costs', label: 'Custos & Tokens Híbridos', icon: DollarSign },
    { id: 'squads', label: 'Squads & Agentes', icon: Users },
    { id: 'skills', label: 'Gestor de Skills', icon: Cpu },
    { id: 'audit', label: 'Audit ISO & Conselho', icon: Shield },
    { id: 'nocode', label: 'Criador No-Code', icon: Sparkles }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-5xl h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              PCL AEOS Administration Center
            </span>
            <h2 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Painel Geral de Configurações & Governança
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-4 text-xs font-medium overflow-x-auto custom-scrollbar">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-3 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'security' && <UserManagementSecurity user={user} />}
          {activeTab === 'integrations' && <IntegrationsLibrary />}
          {activeTab === 'costs' && <CostsTokenDashboard />}
          {activeTab === 'squads' && <AgentSquadOrgChart />}
          {activeTab === 'skills' && <SkillsManager />}
          {activeTab === 'audit' && <AuditComplianceBoard />}
          {activeTab === 'nocode' && <NoCodeAgentBuilder />}
        </div>
      </div>
    </div>
  );
};
