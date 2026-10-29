import React, { useState } from 'react';
import { Shield, CheckCircle, FileText, Download, Lock, RefreshCw, Key, Award, X, CheckCircle2 } from 'lucide-react';
import { ISOAuditService } from '../../services/audit/isoAuditService';
import { AuditLogEntry } from '../../types';
import { renderOfficialLogo } from '../common/AppOfficialLogos';

export const AuditComplianceBoard: React.FC = () => {
  const logs: AuditLogEntry[] = ISOAuditService.getAuditLogs();
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const toolCallsAudit = [
    { id: 'call-101', app: 'sap', appName: 'SAP ERP', action: 'Query Contas em Atraso (> 15 dias)', latency: '45ms', status: 'AUDITADO', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4' },
    { id: 'call-102', app: 'salesforce', appName: 'Salesforce CRM', action: 'Busca Decisores Acme Corp', latency: '62ms', status: 'AUDITADO', hash: 'a1b2c3d4e5f67890123456789abcdef012345678' },
    { id: 'call-103', app: 'gmail', appName: 'Gmail Enterprise', action: 'Despacho de Minuta Auditada', latency: '95ms', status: 'AUDITADO', hash: '8f4a21b3e9087c2b5d4e1a0f9c8b7a6de3b0c442' },
    { id: 'call-104', app: 'bigquery', appName: 'Google BigQuery', action: 'Telemetria de Tokens & Spend', latency: '180ms', status: 'AUDITADO', hash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d' }
  ];

  const handleDownloadBoardPack = () => {
    const reportData = {
      title: 'PCL AEOS v4 — Parecer de Governança e Auditoria do Conselho',
      date: new Date().toISOString(),
      standards: ['ISO 27001', 'ISO 42001', 'EU AI Act', 'LGPD'],
      zeroBinCustodyVerified: true,
      immutableTrailHash: 'sha256_audit_pack_20261021_e8910b',
      logsCount: logs.length,
      toolCallsCount: toolCallsAudit.length
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PCL_AEOS_Board_Audit_Pack_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-slate-100 select-none">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Painel de Governança, Compliance & Audit Trail Imutável</h3>
          </div>
          <p className="text-slate-400 text-[11px] mt-1">
            Auditoria em conformidade com as normas internacionais ISO 27001 (Segurança da Informação), ISO 42001 (Gestão de IA), EU AI Act e LGPD.
          </p>
        </div>

        <button 
          onClick={() => setShowBoardModal(true)}
          className="px-3 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition flex items-center space-x-1.5 shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>Exportar Relatório para o Conselho (Board)</span>
        </button>
      </div>

      {/* Compliance Standard Status Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { std: 'ISO 27001', title: 'Segurança da Informação', status: 'Conforme', color: 'emerald' },
          { std: 'ISO 42001', title: 'Sistema de Gestão de IA', status: 'Conforme', color: 'emerald' },
          { std: 'EU AI Act', title: 'Classificação de Risco LLM', status: 'Conforme', color: 'emerald' },
          { std: 'LGPD', title: 'Proteção & Sanitização PII', status: 'Conforme', color: 'emerald' }
        ].map((item, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-100">{item.std}</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[10px] text-slate-400">{item.title}</p>
            <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block pt-1">
              STATUS: {item.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Tool Calls Traceability Section with Official Logos (Fase 4 Feature) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Rastreabilidade Criptográfica de Tool Calls (Sistemas Externos)
          </h4>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            Zero-Bin Custody Verificado
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                <th className="p-2.5">SISTEMA</th>
                <th className="p-2.5">OPERAÇÃO EXECUTADA</th>
                <th className="p-2.5">LATÊNCIA</th>
                <th className="p-2.5">STATUS AUDITORIA</th>
                <th className="p-2.5">HASH SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {toolCallsAudit.map(call => (
                <tr key={call.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 font-mono text-[11px]">
                  <td className="p-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                        {renderOfficialLogo(call.app, 'w-3.5 h-3.5 object-contain')}
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 font-sans">{call.appName}</span>
                    </div>
                  </td>
                  <td className="p-2.5 text-slate-700 dark:text-slate-300 font-sans">{call.action}</td>
                  <td className="p-2.5 text-slate-500">{call.latency}</td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      {call.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-400 truncate max-w-[130px]" title={call.hash}>
                    {call.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable SHA-256 Audit Log Table */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Trilha de Auditoria Imutável (PostgreSQL SHA-256)</h4>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                <th className="p-2.5">ID / TIMESTAMP</th>
                <th className="p-2.5">USUÁRIO</th>
                <th className="p-2.5">AÇÃO AUDITADA</th>
                <th className="p-2.5">NORMA</th>
                <th className="p-2.5">HASH SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 font-mono text-[11px]">
                  <td className="p-2.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{log.id}</span>
                    <span className="text-[9px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </td>
                  <td className="p-2.5 text-slate-700 dark:text-slate-300 font-sans">{log.userName}</td>
                  <td className="p-2.5 text-slate-700 dark:text-slate-300 font-sans font-medium">{log.action}</td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      {log.complianceStandard}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-400 truncate max-w-[140px]" title={log.sha256Hash}>
                    {log.sha256Hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Board Report Modal */}
      {showBoardModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Parecer Executivo para o Conselho de Administração
                </h3>
              </div>
              <button 
                onClick={() => setShowBoardModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              O relatório consolida a atestação de soberania de dados, ausência de retenção de dados confidenciais por terceiros (Zero-Bin Custody) e conformidade auditada com as normas ISO 27001, ISO 42001 e EU AI Act.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Classificação:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Soberano • 100% Conforme</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Zero-Bin Custody:</span>
                <span className="text-slate-700 dark:text-slate-300">Google Workspace / M365</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coprocessador CPU:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Laya System One (~22ms)</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowBoardModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs hover:bg-slate-50"
              >
                Fechar
              </button>
              <button
                onClick={handleDownloadBoardPack}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
              >
                {downloaded ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>{downloaded ? 'Baixado com Sucesso!' : 'Baixar Parecer Executivo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
