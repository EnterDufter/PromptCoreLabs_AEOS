import { Language } from '../types';

export interface Translations {
  header: {
    telemetry: string;
    version: string;
    cortexArchitect: string;
    chatStream: string;
    dualPlex: string;
    settings: string;
    online: string;
  };
  sidebar: {
    newChat: string;
    search: string;
    chat: string;
    meetings: string;
    flows: string;
    projects: string;
    artifacts: string;
    today: string;
    yesterday: string;
    last7days: string;
    last15days: string;
    last30days: string;
    sqliteLocal: string;
    synchronized: string;
  };
  settings: {
    title: string;
    subtitle: string;
    close: string;
    cancel: string;
    save: string;
    savedSuccess: string;
    general: string;
    security: string;
    integrations: string;
    costs: string;
    squads: string;
    skills: string;
    audit: string;
    nocode: string;
    languageTitle: string;
    languageSubtitle: string;
    themeTitle: string;
    themeSubtitle: string;
    themeLight: string;
    themeDark: string;
    active: string;
    enclaveActive: string;
  };
  composer: {
    placeholder: string;
    web: string;
    send: string;
    audioWhisper: string;
    autonomousRouting: string;
  };
  meetings: {
    title: string;
    actionItems: string;
    privateNotes: string;
    exportNotes: string;
    savedLocally: string;
    lensExecutive: string;
    lensTechnical: string;
    lensCommercial: string;
    lensGovernance: string;
    transcription: string;
  };
  flows: {
    title: string;
    nodeCatalog: string;
    executionTrail: string;
    viewJson: string;
    minimap: string;
    searchNodes: string;
  };
  cortex: {
    title: string;
    architecture: string;
    stageGates: string;
    sourcesConsulted: string;
    copyCitation: string;
    citationCopied: string;
  };
  finops: {
    title: string;
    subtitle: string;
    sovereigntyRatio: string;
    dollarsSaved: string;
    vramCpu: string;
    vramAllocated: string;
    hardLockActive: string;
    hardLockDesc: string;
    spendThisMonth: string;
    availableBudget: string;
    dailyAverage: string;
    projectedMonth: string;
    squadAllocation: string;
    exportLedger: string;
    exportSuccess: string;
    roiCalculator: string;
    roiSubtitle: string;
    employeesCount: string;
    marketCloudCost: string;
    pclSovereignCost: string;
    monthlySavings: string;
    annualSavings: string;
    exportRoiDossier: string;
    roiSimulate: string;
  };
  audit: {
    title: string;
    subtitle: string;
    exportDossier: string;
    verifyChain: string;
    chainIntact: string;
    tamperDetected: string;
    toolCallsTitle: string;
    zeroBinVerified: string;
    officialStandards: string;
    downloadSuccess: string;
    generateReport: string;
  };
}

export const translations: Record<Language, Translations> = {
  pt: {
    header: {
      telemetry: 'Telemetria & Status',
      version: 'v3.7.0 PROD',
      cortexArchitect: 'Cortex Canvas',
      chatStream: 'Chat Stream',
      dualPlex: 'Dual-Plex (Split)',
      settings: 'Configurações',
      online: 'Bunker Online'
    },
    sidebar: {
      newChat: 'Nova Conversa',
      search: 'Buscar conversas...',
      chat: 'Chat Stream & IA',
      meetings: 'Reuniões & Atas',
      flows: 'Fluxos de Automação',
      projects: 'Projetos',
      artifacts: 'Artefatos',
      today: 'Hoje',
      yesterday: 'Ontem',
      last7days: 'Últimos 7 dias',
      last15days: 'Últimos 15 dias',
      last30days: 'Últimos 30 dias',
      sqliteLocal: 'PCL SQLite Local',
      synchronized: 'Sincronizado'
    },
    settings: {
      title: 'Painel Geral de Configurações & Governança',
      subtitle: 'PCL Cockpit Administration Center',
      close: 'Fechar (Esc)',
      cancel: 'Cancelar',
      save: 'Salvar Configurações',
      savedSuccess: 'Configurações salvas e aplicadas com sucesso!',
      general: 'Geral & Idioma',
      security: 'Segurança & Sessões',
      integrations: 'Conexões & MCPs',
      costs: 'FinOps & Teto Orçamentário',
      squads: 'Squads & Agentes',
      skills: 'Gestor de Skills',
      audit: 'Audit ISO & Dossiê',
      nocode: 'Criador No-Code',
      languageTitle: 'Idioma da Interface (Internationalization)',
      languageSubtitle: 'Selecione o idioma de navegação para todos os menus, rótulos e diálogos do PCL Cockpit.',
      themeTitle: 'Aparência & Estilo Visual',
      themeSubtitle: 'Alterne entre os modos claro e escuro calibrados no padrão Liquid Glass WCAG AAA.',
      themeLight: 'Modo Claro',
      themeDark: 'Modo Escuro',
      active: 'Ativo',
      enclaveActive: 'Enclave de Governança Ativo • Criptografia AES-256-GCM • SHA-256'
    },
    composer: {
      placeholder: 'Pergunte ao PCL Cockpit ou use @ para sistemas corporativos e # para documentos...',
      web: 'Web',
      send: 'Enviar',
      audioWhisper: 'Áudio Local (Whisper)',
      autonomousRouting: 'Roteamento Autônomo...'
    },
    meetings: {
      title: 'Inteligência de Reuniões & WhisperX',
      actionItems: 'Action Items & Deliberações',
      privateNotes: 'Anotações Pessoais (BYOS)',
      exportNotes: 'Exportar Notas (.md)',
      savedLocally: 'Salvo localmente (Zero resíduo em nuvem)',
      lensExecutive: 'Diretoria (Executivo)',
      lensTechnical: 'Técnica (Engenharia)',
      lensCommercial: 'Comercial (Negócios)',
      lensGovernance: 'Governança & Risco',
      transcription: 'Transcrição WhisperX'
    },
    flows: {
      title: 'Fluxos de Automação & Canvas DAG',
      nodeCatalog: 'Catálogo de Nós',
      executionTrail: 'Rastro de Execução',
      viewJson: 'Ver Payload JSON',
      minimap: 'Minimapa Reativo',
      searchNodes: 'Buscar nós e agentes...'
    },
    cortex: {
      title: 'Cortex Enterprise Engine',
      architecture: 'Arquitetura Viva',
      stageGates: 'TLC v3 Stage Gates',
      sourcesConsulted: 'Fontes Consultadas',
      copyCitation: 'Copiar Citação',
      citationCopied: 'Citação copiada!'
    },
    finops: {
      title: 'Livro-Razão FinOps Soberano & Controle Orçamentário',
      subtitle: 'Auditoria de custos marginais locais ($0.00), consumo de nuvem externa e trava física rígida (Hard Lock).',
      sovereigntyRatio: 'Taxa de Soberania Local ($0.00 Host)',
      dollarsSaved: 'Dólares Poupados Este Mês',
      vramCpu: 'Invariante de VRAM CPU',
      vramAllocated: '0 MB VRAM (CPU INT8)',
      hardLockActive: 'Trava Física Hard Lock Ativa',
      hardLockDesc: 'Suspende automaticamente chamadas a APIs externas ao atingir 100% do teto, redirecionando o tráfego para a inferência local.',
      spendThisMonth: 'Gasto Consolidado no Mês',
      availableBudget: 'Saldo Disponível',
      dailyAverage: 'Média Diária',
      projectedMonth: 'Projeção de Faturamento',
      squadAllocation: 'Rateio Orçamentário por Squad',
      exportLedger: 'Exportar Livro-Razão FinOps (.csv)',
      exportSuccess: 'Relatório Contábil exportado com sucesso!',
      roiCalculator: 'Simulador de ROI Soberano CFO',
      roiSubtitle: 'Cálculo executivo da economia obtida ao substituir faturas recorrentes de nuvens fechadas pela infraestrutura soberana PCL Cockpit.',
      employeesCount: 'Número de Colaboradores / Licenças',
      marketCloudCost: 'Custo de Mercado Nuvem Externa (US$ 60/mês/usuário)',
      pclSovereignCost: 'Custo PCL Cockpit Soberano (Custo Marginal $0.00)',
      monthlySavings: 'Economia Mensal Retida',
      annualSavings: 'Economia Anual Líquida',
      exportRoiDossier: 'Exportar Parecer Financeiro CFO (.json)',
      roiSimulate: 'Simular Cenário de Economia'
    },
    audit: {
      title: 'Painel de Governança, Compliance & Audit Trail Imutável',
      subtitle: 'Auditoria formal em conformidade com as normas ISO 27001, ISO 42001, EU AI Act e LGPD.',
      exportDossier: 'Gerar Dossiê de Auditoria ISO / Conselho',
      verifyChain: 'Recalcular Integridade da Cadeia SHA-256',
      chainIntact: 'Cadeia Criptográfica Auditada: 100% Íntegra • Zero Adulterações',
      tamperDetected: 'Alerta de Auditoria: Inconsistência na assinatura SHA-256 detectada!',
      toolCallsTitle: 'Rastreabilidade Criptográfica de Tool Calls (Sistemas Externos)',
      zeroBinVerified: 'Segredo Corporativo Blindado (Resíduo Zero / BYOS)',
      officialStandards: 'Normas de Conformidade Ativas',
      downloadSuccess: 'Dossiê Oficial gerado e baixado com sucesso!',
      generateReport: 'Baixar Parecer Executivo do Conselho'
    }
  },
  en: {
    header: {
      telemetry: 'Telemetry & Status',
      version: 'v3.7.0 PROD',
      cortexArchitect: 'Cortex Canvas',
      chatStream: 'Chat Stream',
      dualPlex: 'Dual-Plex (Split)',
      settings: 'Settings',
      online: 'Bunker Online'
    },
    sidebar: {
      newChat: 'New Chat',
      search: 'Search chats...',
      chat: 'Chat Stream & AI',
      meetings: 'Meetings & Minutes',
      flows: 'Automation Flows',
      projects: 'Projects',
      artifacts: 'Artifacts',
      today: 'Today',
      yesterday: 'Yesterday',
      last7days: 'Last 7 days',
      last15days: 'Last 15 days',
      last30days: 'Last 30 days',
      sqliteLocal: 'PCL SQLite Local',
      synchronized: 'Synchronized'
    },
    settings: {
      title: 'General Settings & Governance Panel',
      subtitle: 'PCL Cockpit Administration Center',
      close: 'Close (Esc)',
      cancel: 'Cancel',
      save: 'Save Changes',
      savedSuccess: 'Settings successfully saved and applied!',
      general: 'General & Language',
      security: 'Security & Sessions',
      integrations: 'Connections & MCPs',
      costs: 'FinOps & Budget Hard Lock',
      squads: 'Squads & Agents',
      skills: 'Skills Manager',
      audit: 'ISO Audit & Dossier',
      nocode: 'No-Code Builder',
      languageTitle: 'Interface Language (Internationalization)',
      languageSubtitle: 'Select your preferred language across all menus, labels, and dialogs in PCL Cockpit.',
      themeTitle: 'Appearance & Visual Theme',
      themeSubtitle: 'Switch between light and dark modes calibrated with Liquid Glass WCAG AAA standards.',
      themeLight: 'Light Mode',
      themeDark: 'Dark Mode',
      active: 'Active',
      enclaveActive: 'Governance Enclave Active • AES-256-GCM Encryption • SHA-256'
    },
    composer: {
      placeholder: 'Ask PCL Cockpit or use @ for enterprise systems and # for documents...',
      web: 'Web',
      send: 'Send',
      audioWhisper: 'Local Audio (Whisper)',
      autonomousRouting: 'Autonomous Routing...'
    },
    meetings: {
      title: 'Meeting Intelligence & WhisperX',
      actionItems: 'Action Items & Resolutions',
      privateNotes: 'Private Notes (BYOS)',
      exportNotes: 'Export Notes (.md)',
      savedLocally: 'Saved locally (Zero cloud residual)',
      lensExecutive: 'Board (Executive)',
      lensTechnical: 'Technical (Engineering)',
      lensCommercial: 'Commercial (Business)',
      lensGovernance: 'Governance & Risk',
      transcription: 'WhisperX Transcription'
    },
    flows: {
      title: 'Automation Flows & DAG Canvas',
      nodeCatalog: 'Node Catalog',
      executionTrail: 'Execution Trail',
      viewJson: 'View JSON Payload',
      minimap: 'Reactive Minimap',
      searchNodes: 'Search nodes and agents...'
    },
    cortex: {
      title: 'Cortex Enterprise Engine',
      architecture: 'Living Architecture',
      stageGates: 'TLC v3 Stage Gates',
      sourcesConsulted: 'Sources Consulted',
      copyCitation: 'Copy Citation',
      citationCopied: 'Citation copied!'
    },
    finops: {
      title: 'Sovereign FinOps Ledger & Budget Enforcer',
      subtitle: 'Auditing local marginal costs ($0.00), external cloud spend, and hardware budget hard lock.',
      sovereigntyRatio: 'Local Sovereignty Ratio ($0.00 Host)',
      dollarsSaved: 'Dollars Saved This Month',
      vramCpu: 'CPU VRAM Physical Invariant',
      vramAllocated: '0 MB VRAM (CPU INT8)',
      hardLockActive: 'Physical Hard Lock Active',
      hardLockDesc: 'Automatically suspends external cloud calls at 100% budget cap, seamlessly routing traffic to local sovereign models.',
      spendThisMonth: 'Consolidated Spend This Month',
      availableBudget: 'Available Balance',
      dailyAverage: 'Daily Average',
      projectedMonth: 'Projected Monthly Spend',
      squadAllocation: 'Budget Allocation by Squad',
      exportLedger: 'Export FinOps Ledger (.csv)',
      exportSuccess: 'Accounting report exported successfully!',
      roiCalculator: 'CFO Sovereign ROI Simulator',
      roiSubtitle: 'Executive projection of savings achieved by replacing closed external cloud subscriptions with PCL Cockpit sovereign infrastructure.',
      employeesCount: 'Number of Employees / Seats',
      marketCloudCost: 'Market Cloud Cost ($60/user/mo)',
      pclSovereignCost: 'PCL Cockpit Sovereign ($0.00 marginal cost)',
      monthlySavings: 'Retained Monthly Savings',
      annualSavings: 'Net Annual Savings',
      exportRoiDossier: 'Export CFO Financial Dossier (.json)',
      roiSimulate: 'Simulate Savings Scenario'
    },
    audit: {
      title: 'Governance, Compliance & Immutable Audit Trail',
      subtitle: 'Formal compliance auditing adhering to ISO 27001, ISO 42001, EU AI Act, and LGPD standards.',
      exportDossier: 'Generate ISO / Board Audit Dossier',
      verifyChain: 'Recalculate SHA-256 Chain Integrity',
      chainIntact: 'Cryptographic Chain Audited: 100% Immutable • Zero Tampering',
      tamperDetected: 'Audit Warning: Discrepancy detected in cryptographic signature!',
      toolCallsTitle: 'Cryptographic Traceability of Tool Calls (External Systems)',
      zeroBinVerified: 'Shielded Corporate Secret (Zero Data Residual / BYOS)',
      officialStandards: 'Active Compliance Standards',
      downloadSuccess: 'Official Audit Dossier generated and downloaded!',
      generateReport: 'Download Executive Board Report'
    }
  },
  es: {
    header: {
      telemetry: 'Telemetría y Estado',
      version: 'v3.7.0 PROD',
      cortexArchitect: 'Cortex Canvas',
      chatStream: 'Chat Stream',
      dualPlex: 'Dual-Plex (Split)',
      settings: 'Configuraciones',
      online: 'Bunker Online'
    },
    sidebar: {
      newChat: 'Nueva Conversación',
      search: 'Buscar conversaciones...',
      chat: 'Chat Stream e IA',
      meetings: 'Reuniones y Actas',
      flows: 'Flujos de Automatización',
      projects: 'Proyectos',
      artifacts: 'Artefactos',
      today: 'Hoy',
      yesterday: 'Ayer',
      last7days: 'Últimos 7 días',
      last15days: 'Últimos 15 días',
      last30days: 'Últimos 30 días',
      sqliteLocal: 'PCL SQLite Local',
      synchronized: 'Sincronizado'
    },
    settings: {
      title: 'Panel General de Configuraciones y Gobernanza',
      subtitle: 'PCL Cockpit Administration Center',
      close: 'Cerrar (Esc)',
      cancel: 'Cancelar',
      save: 'Guardar Cambios',
      savedSuccess: '¡Configuraciones guardadas y aplicadas con éxito!',
      general: 'General e Idioma',
      security: 'Seguridad y Sesiones',
      integrations: 'Conexiones y MCPs',
      costs: 'FinOps y Teto Presupuestario',
      squads: 'Squads y Agentes',
      skills: 'Gestor de Skills',
      audit: 'Auditoría ISO y Dossier',
      nocode: 'Creador No-Code',
      languageTitle: 'Idioma de la Interfaz (Internacionalización)',
      languageSubtitle: 'Seleccione el idioma de navegación para todos los menús, etiquetas y diálogos de PCL Cockpit.',
      themeTitle: 'Apariencia y Estilo Visual',
      themeSubtitle: 'Alterne entre los modos claro y oscuro calibrados con el estándar Liquid Glass WCAG AAA.',
      themeLight: 'Modo Claro',
      themeDark: 'Modo Oscuro',
      active: 'Activo',
      enclaveActive: 'Enclave de Gobernanza Activo • Criptografía AES-256-GCM • SHA-256'
    },
    composer: {
      placeholder: 'Pregunte a PCL Cockpit o use @ para sistemas corporativos y # para documentos...',
      web: 'Web',
      send: 'Enviar',
      audioWhisper: 'Audio Local (Whisper)',
      autonomousRouting: 'Enrutamiento Autónomo...'
    },
    meetings: {
      title: 'Inteligencia de Reuniones y WhisperX',
      actionItems: 'Action Items y Resoluciones',
      privateNotes: 'Notas Privadas (BYOS)',
      exportNotes: 'Exportar Notas (.md)',
      savedLocally: 'Guardado localmente (Residuo cero en nube)',
      lensExecutive: 'Junta Directiva (Ejecutivo)',
      lensTechnical: 'Técnica (Ingeniería)',
      lensCommercial: 'Comercial (Negocios)',
      lensGovernance: 'Gobernanza y Riesgo',
      transcription: 'Transcripción WhisperX'
    },
    flows: {
      title: 'Flujos de Automatización y Canvas DAG',
      nodeCatalog: 'Catálogo de Nodos',
      executionTrail: 'Rastro de Ejecución',
      viewJson: 'Ver Payload JSON',
      minimap: 'Minimapa Reactivo',
      searchNodes: 'Buscar nodos y agentes...'
    },
    cortex: {
      title: 'Cortex Enterprise Engine',
      architecture: 'Arquitectura Viva',
      stageGates: 'TLC v3 Stage Gates',
      sourcesConsulted: 'Fuentes Consultadas',
      copyCitation: 'Copiar Cita',
      citationCopied: '¡Cita copiada!'
    },
    finops: {
      title: 'Libro Mayor FinOps Soberano y Control Presupuestario',
      subtitle: 'Auditoría de costos marginales locales ($0.00), consumo de nube externa y traba física estricta (Hard Lock).',
      sovereigntyRatio: 'Tasa de Soberanía Local ($0.00 Host)',
      dollarsSaved: 'Dólares Ahorrados Este Mes',
      vramCpu: 'Invariante Físico de VRAM CPU',
      vramAllocated: '0 MB VRAM (CPU INT8)',
      hardLockActive: 'Traba Física Hard Lock Activa',
      hardLockDesc: 'Suspende automáticamente llamadas a APIs externas al alcanzar el 100% del presupuesto, redirigiendo el tráfico a modelos locales.',
      spendThisMonth: 'Gasto Consolidado del Mes',
      availableBudget: 'Saldo Disponible',
      dailyAverage: 'Promedio Diario',
      projectedMonth: 'Proyección Mensual',
      squadAllocation: 'Distribución Presupuestaria por Squad',
      exportLedger: 'Exportar Libro Mayor FinOps (.csv)',
      exportSuccess: '¡Reporte contable exportado con éxito!',
      roiCalculator: 'Simulador de ROI Soberano CFO',
      roiSubtitle: 'Cálculo ejecutivo del ahorro obtenido al sustituir suscripciones de nubes cerradas por la infraestructura soberana PCL Cockpit.',
      employeesCount: 'Número de Colaboradores / Licencias',
      marketCloudCost: 'Costo de Mercado Nube Externa ($60/mes/usuario)',
      pclSovereignCost: 'Costo PCL Cockpit Soberano (Costo Marginal $0.00)',
      monthlySavings: 'Ahorro Mensual Retenido',
      annualSavings: 'Ahorro Anual Neto',
      exportRoiDossier: 'Exportar Informe Financiero CFO (.json)',
      roiSimulate: 'Simular Escenario de Ahorro'
    },
    audit: {
      title: 'Panel de Gobernanza, Cumplimiento y Audit Trail Inmutable',
      subtitle: 'Auditoría formal en conformidad con las normas ISO 27001, ISO 42001, EU AI Act y LGPD.',
      exportDossier: 'Generar Dossier de Auditoría ISO / Junta',
      verifyChain: 'Recalcular Integridad de Cadena SHA-256',
      chainIntact: 'Cadena Criptográfica Auditada: 100% Íntegra • Cero Adulteraciones',
      tamperDetected: '¡Alerta de Auditoría: Discrepancia detectada en la firma criptográfica!',
      toolCallsTitle: 'Trazabilidad Criptográfica de Tool Calls (Sistemas Externos)',
      zeroBinVerified: 'Secreto Corporativo Blindado (Residuo Cero / BYOS)',
      officialStandards: 'Normas de Conformidad Activas',
      downloadSuccess: '¡Dossier Oficial generado y descargado!',
      generateReport: 'Descargar Dictamen Ejecutivo de la Junta'
    }
  }
};
