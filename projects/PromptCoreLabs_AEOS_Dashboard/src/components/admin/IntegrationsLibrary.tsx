import React, { useState } from 'react';
import { Server, Globe, Cpu, CheckCircle, Plus, Search, ExternalLink } from 'lucide-react';
import { Integration } from '../../types';
import { renderOfficialLogo } from '../common/AppOfficialLogos';

export const IntegrationsLibrary: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todas');

  const integrations = [
    { id: 'int-sap', appId: 'sap', name: 'SAP ERP S/4HANA', category: 'Sistemas Core & ERP', description: 'Módulo financeiro, conciliação bancária, faturas e contas a pagar/receber.', status: 'Connected' },
    { id: 'int-rd', appId: 'rdstation', name: 'RD Station Marketing', category: 'Marketing & Vendas', description: 'Automação de inbound marketing, pontuação de leads (lead scoring) e conversões.', status: 'Connected' },
    { id: 'int-pipedrive', appId: 'pipedrive', name: 'Pipedrive CRM', category: 'Marketing & Vendas', description: 'Pipeline visual de vendas, atividades comerciais e negócios ganhos.', status: 'Connected' },
    { id: 'int-bq', appId: 'bigquery', name: 'Google BigQuery', category: 'Data & Analytics', description: 'Data warehouse corporativo com auditoria de consultas e petabytes de telemetria.', status: 'Connected' },
    { id: 'int-sheets', appId: 'sheets', name: 'Google Sheets', category: 'Produtividade', description: 'Sincronização bidirecional de planilhas e relatórios contábeis.', status: 'Connected' },
    { id: 'int-hubspot', appId: 'hubspot', name: 'HubSpot', category: 'Marketing & Vendas', description: 'Automação de marketing, pipeline de deals e fluxos de nutrição.', status: 'Connected' },
    { id: 'int-salesforce', appId: 'salesforce', name: 'Salesforce CRM', category: 'Sistemas Core & ERP', description: 'Gestão de contas corporativas e contratos enterprise.', status: 'Connected' },
    { id: 'int-jira', appId: 'jira', name: 'Jira Software', category: 'Engenharia & Squads', description: 'Sincronização de épicos, histórias de usuário e bugs em tempo real.', status: 'Connected' },
    { id: 'int-gmail', appId: 'gmail', name: 'Gmail Enterprise', category: 'Produtividade', description: 'Disparo de comunicados auditados e leitura de minutas contratuais.', status: 'Connected' },
    { id: 'int-cal', appId: 'calendar', name: 'Google Agenda', category: 'Produtividade', description: 'Agendamento de reuniões de comitê e sincronização de convites.', status: 'Connected' },
    { id: 'int-stitch', appId: 'mcp', name: 'StitchMCP Server', category: 'MCP Servers', description: 'Geração e inspeção de telas e projetos visuais via Model Context Protocol.', status: 'Active' },
    { id: 'int-nb', appId: 'mcp', name: 'Notebooks MCP Server', category: 'MCP Servers', description: 'Criação e execução de células de código Python e estatística.', status: 'Active' }
  ];

  const categories = ['Todas', 'Sistemas Core & ERP', 'Produtividade', 'Data & Analytics', 'MCP Servers', 'Marketing & Vendas'];

  return (
    <div className="space-y-4 text-xs text-slate-800 dark:text-slate-100 select-none">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm">Biblioteca de Conexões Externas & MCPs</h3>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Conectores corporativos com autenticação BYOS (Zero-Bin Custody) e auditoria criptográfica SHA-256.
          </p>
        </div>
        <button className="px-3 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition flex items-center space-x-1.5 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Conectar Novo Sistema</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap text-xs ${
              activeCategory === cat
                ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Integrations with Official Logos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {integrations
          .filter(i => activeCategory === 'Todas' || i.category === activeCategory)
          .map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-slate-400 transition shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {renderOfficialLogo(item.appId, 'w-5 h-5 object-contain') || <Cpu className="w-5 h-5 text-indigo-500" />}
                  </div>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">{item.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[9px] font-bold">
                  {item.status}
                </span>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                {item.description}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono text-[9px]">{item.category}</span>
                <button className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 font-medium">
                  <span>Configurar</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
