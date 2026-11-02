import React, { useState, useEffect } from 'react';
import { 
  Cpu, Plus, Download, Upload, Edit3, Trash2, CheckCircle, 
  FileText, Code, Search, ShieldCheck, Zap, Power, Layers, 
  ExternalLink, Check, AlertCircle, X, HelpCircle
} from 'lucide-react';
import { skillsService, RichSkillDefinition, SkillDomain } from '../../services/admin/skillsService';

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<RichSkillDefinition[]>(skillsService.getSkills());
  const [selectedSkill, setSelectedSkill] = useState<RichSkillDefinition | null>(skills[0] || null);
  const [selectedDomain, setSelectedDomain] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'markdown' | 'schema' | 'security'>('markdown');
  
  // Custom skill creation modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newName, setNewName] = useState('');
  const [newDomain, setNewDomain] = useState<SkillDomain>('Arquitetura & Engenharia');
  const [newDesc, setNewDesc] = useState('');
  const [newProvider, setNewProvider] = useState<'CPU INT8' | 'GPU RTX 3050' | 'Cloud API' | 'Sandbox Shell'>('CPU INT8');
  const [newMarkdown, setNewMarkdown] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = skillsService.subscribe(updated => {
      setSkills(updated);
      if (selectedSkill) {
        const found = updated.find(s => s.id === selectedSkill.id);
        if (found) setSelectedSkill(found);
      }
    });
    return () => unsubscribe();
  }, [selectedSkill]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const domains: string[] = [
    'Todas',
    'Segurança & Governança',
    'Arquitetura & Engenharia',
    'Reuniões & Áudio',
    'FinOps & Custos',
    'Automação & Orquestração'
  ];

  // Filtering
  const filteredSkills = skills.filter(skill => {
    const matchesDomain = selectedDomain === 'Todas' || skill.domain === selectedDomain;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleToggleSkill = (skillId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    skillsService.toggleSkill(skillId);
    showToast('Status da skill atualizado com sucesso.');
  };

  const handleSaveSkillContent = () => {
    if (!selectedSkill) return;
    skillsService.updateSkill(selectedSkill.id, {
      markdownContent: selectedSkill.markdownContent
    });
    showToast('Alterações no arquivo SKILL.md gravadas com sucesso!');
  };

  const handleExportMarkdown = (skill: RichSkillDefinition) => {
    const blob = new Blob([skill.markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${skill.key}.SKILL.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Arquivo ${skill.key}.SKILL.md exportado!`);
  };

  const handleCreateSkill = () => {
    if (!newKey.trim() || !newName.trim()) return;
    const created = skillsService.addSkill({
      key: newKey.toLowerCase().replace(/\s+/g, '-'),
      name: newName,
      domain: newDomain,
      description: newDesc,
      sourcePath: `c:\\PromptCore_Labs\\.agents\\skills\\${newKey}\\SKILL.md`,
      mode: 'Editable',
      enabled: true,
      version: '1.0.0',
      executionProvider: newProvider,
      sandboxMode: 'Standard Sandbox',
      usedByAgents: ['Cortex Master'],
      triggerCommand: `/${newKey}`,
      inputSchemaJson: JSON.stringify({ type: 'object', properties: { input: { type: 'string' } } }, null, 2),
      outputSchemaJson: JSON.stringify({ type: 'object', properties: { result: { type: 'string' } } }, null, 2),
      markdownContent: newMarkdown || `# ${newName}\n${newDesc}`
    });
    setSelectedSkill(created);
    setIsCreateModalOpen(false);
    showToast(`Skill "${newName}" criada com sucesso!`);
  };

  const handleDeleteSkill = (skillId: string, skillName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a skill "${skillName}"?`)) {
      skillsService.deleteSkill(skillId);
      if (selectedSkill?.id === skillId) {
        setSelectedSkill(skills[0] || null);
      }
      showToast(`Skill "${skillName}" excluída.`);
    }
  };

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-slate-100 select-none pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-600 text-white flex items-center space-x-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="font-semibold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Gestor Geral de Habilidades & Ferramentas (Skills)
              </h2>
            </div>
            <p className="text-slate-400 text-xs max-w-2xl leading-relaxed">
              Catálogo central de capacidades executáveis pelos Agentes do PCL Cockpit. Inspecione contratos JSON-Schema, ative/desative rotinas e defina níveis de sandbox e execução.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setNewKey('');
                setNewName('');
                setNewDesc('');
                setNewMarkdown('');
                setIsCreateModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center space-x-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Nova Skill</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Deseja restaurar todas as skills para o catálogo original do PCL AEOS?')) {
                  skillsService.resetToDefaults();
                  showToast('Skills padrão restauradas!');
                }
              }}
              className="px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition"
            >
              Restaurar Padrões
            </button>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-slate-800/80">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedDomain === dom
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome da skill, chave ou comando de disparo..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {filteredSkills.length} habilidade(s) encontrada(s)
        </span>
      </div>

      {/* Main Grid: Left List (1 col) & Right Inspector (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left List of Skills */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkill?.id === skill.id;
            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2.5 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header: Name + Toggle Switch */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {skill.name}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        skill.enabled
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {skill.enabled ? 'ATIVA' : 'INATIVA'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {skill.triggerCommand}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleToggleSkill(skill.id, e)}
                    className={`p-1.5 rounded-lg border transition ${
                      skill.enabled
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                    title={skill.enabled ? 'Desativar Skill' : 'Ativar Skill'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {skill.description}
                </p>

                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[9px]">
                  <span className="px-2 py-0.5 rounded font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {skill.domain}
                  </span>
                  <span className="px-1.5 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {skill.executionProvider}
                  </span>
                  <span className="px-1.5 py-0.5 rounded font-mono text-slate-400">
                    v{skill.version}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredSkills.length === 0 && (
            <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <Cpu className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-xs text-slate-500">Nenhuma skill encontrada com estes filtros.</p>
            </div>
          )}
        </div>

        {/* Right Inspector & Editor */}
        {selectedSkill ? (
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            {/* Inspector Top Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedSkill.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
                    {selectedSkill.key}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {selectedSkill.sourcePath}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExportMarkdown(selectedSkill)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[11px] transition flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar .md</span>
                </button>
                {selectedSkill.mode === 'Editable' && (
                  <button
                    onClick={() => handleDeleteSkill(selectedSkill.id, selectedSkill.name)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition"
                    title="Excluir Skill Customizada"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Inspector Navigation Tabs */}
            <div className="flex items-center space-x-1 border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('markdown')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  activeTab === 'markdown'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Instruções (SKILL.md)</span>
              </button>
              <button
                onClick={() => setActiveTab('schema')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  activeTab === 'schema'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Contrato JSON-Schema</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  activeTab === 'security'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Segurança & Sandbox</span>
              </button>
            </div>

            {/* Tab 1: Markdown Editor */}
            {activeTab === 'markdown' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    Modo: <strong>{selectedSkill.mode}</strong> {selectedSkill.mode === 'Read-Only' && '(Protegida pelo Kernel)'}
                  </span>
                  {selectedSkill.mode === 'Editable' && (
                    <button
                      onClick={handleSaveSkillContent}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center space-x-1 text-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Salvar SKILL.md</span>
                    </button>
                  )}
                </div>
                <textarea
                  readOnly={selectedSkill.mode === 'Read-Only'}
                  value={selectedSkill.markdownContent}
                  onChange={e => setSelectedSkill({ ...selectedSkill, markdownContent: e.target.value })}
                  rows={15}
                  className="w-full bg-slate-950 text-slate-100 font-mono text-[11px] p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 custom-scrollbar leading-relaxed"
                />
              </div>
            )}

            {/* Tab 2: JSON-Schema Contracts */}
            {activeTab === 'schema' && (
              <div className="space-y-4">
                <div>
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
                    Input Schema (JSON Schema)
                  </span>
                  <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
                    {selectedSkill.inputSchemaJson}
                  </pre>
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
                    Output Schema (Retorno Tipado)
                  </span>
                  <pre className="p-3 rounded-xl bg-slate-950 text-indigo-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
                    {selectedSkill.outputSchemaJson}
                  </pre>
                </div>
              </div>
            )}

            {/* Tab 3: Security & Sandbox Policies */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Políticas de Isolamento & Sandbox</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono block">Nível de Sandbox</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedSkill.sandboxMode}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono block">Provedor de Execução</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedSkill.executionProvider}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono block">Comando de Disparo</span>
                      <strong className="font-mono text-indigo-600 dark:text-indigo-400">{selectedSkill.triggerCommand}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-mono block">Agentes Autorizados</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {selectedSkill.usedByAgents ? selectedSkill.usedByAgents.join(', ') : 'Todos'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-800 dark:text-indigo-300 text-xs flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Esta skill está em conformidade com a norma <code>PCL-AEOS-NORM-01</code>. Comandos potencialmente destrutivos são filtrados pelo coprocessador Laya antes de qualquer execução física.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-7 py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <Cpu className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Selecione uma skill na lista ao lado para inspecionar</p>
          </div>
        )}
      </div>

      {/* MODAL: CRIAR NOVA SKILL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Criar Nova Habilidade Corporativa (Skill)
                </h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nome da Habilidade *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Validador de Balanços SAP"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Chave Identificadora (Slug) *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: sap-balance-validator"
                    value={newKey}
                    onChange={e => setNewKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Domínio Corporativo
                  </label>
                  <select
                    value={newDomain}
                    onChange={e => setNewDomain(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Arquitetura & Engenharia">Arquitetura & Engenharia</option>
                    <option value="Segurança & Governança">Segurança & Governança</option>
                    <option value="FinOps & Custos">FinOps & Custos</option>
                    <option value="Reuniões & Áudio">Reuniões & Áudio</option>
                    <option value="Automação & Orquestração">Automação & Orquestração</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Ambiente de Execução
                  </label>
                  <select
                    value={newProvider}
                    onChange={e => setNewProvider(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-mono"
                  >
                    <option value="CPU INT8">CPU INT8 (Host Local - 0 MB VRAM)</option>
                    <option value="GPU RTX 3050">GPU Host (Ollama / Local Neural)</option>
                    <option value="Sandbox Shell">Sandbox Shell (Isolado)</option>
                    <option value="Cloud API">Nuvem Externa / API</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Descrição do Propósito
                </label>
                <input
                  type="text"
                  placeholder="Ex: Realiza a conciliação de lançamentos contábeis confrontando com extratos bancários..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Instruções Canônicas (SKILL.md)
                </label>
                <textarea
                  rows={6}
                  placeholder="# Instruções da Skill..."
                  value={newMarkdown}
                  onChange={e => setNewMarkdown(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSkill}
                disabled={!newName.trim() || !newKey.trim()}
                className={`px-4 py-2 rounded-lg font-bold text-slate-950 transition ${
                  newName.trim() && newKey.trim()
                    ? 'bg-emerald-500 hover:bg-emerald-400'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                Criar Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
