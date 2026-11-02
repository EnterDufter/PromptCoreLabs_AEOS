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
}

export const translations: Record<Language, Translations> = {
  pt: {
    header: {
      telemetry: 'Telemetria & Status',
      version: 'v3.6.0 PROD',
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
      subtitle: 'PCL AEOS Administration Center',
      close: 'Fechar (Esc)',
      cancel: 'Cancelar',
      save: 'Salvar Configurações',
      savedSuccess: 'Configurações salvas e aplicadas com sucesso!',
      general: 'Geral & Idioma',
      security: 'Segurança & Sessões',
      integrations: 'Conexões & MCPs',
      costs: 'Custos & Tokens Híbridos',
      squads: 'Squads & Agentes',
      skills: 'Gestor de Skills',
      audit: 'Audit ISO & Conselho',
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
      placeholder: 'Pergunte ao PCL AEOS ou use @ para sistemas corporativos e # para documentos...',
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
    }
  },
  en: {
    header: {
      telemetry: 'Telemetry & Status',
      version: 'v3.6.0 PROD',
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
      subtitle: 'PCL AEOS Administration Center',
      close: 'Close (Esc)',
      cancel: 'Cancel',
      save: 'Save Changes',
      savedSuccess: 'Settings successfully saved and applied!',
      general: 'General & Language',
      security: 'Security & Sessions',
      integrations: 'Connections & MCPs',
      costs: 'Hybrid Costs & Tokens',
      squads: 'Squads & Agents',
      skills: 'Skills Manager',
      audit: 'ISO Audit & Advisory',
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
      placeholder: 'Ask PCL AEOS or use @ for enterprise systems and # for documents...',
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
    }
  },
  es: {
    header: {
      telemetry: 'Telemetría y Estado',
      version: 'v3.6.0 PROD',
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
      subtitle: 'PCL AEOS Administration Center',
      close: 'Cerrar (Esc)',
      cancel: 'Cancelar',
      save: 'Guardar Cambios',
      savedSuccess: '¡Configuraciones guardadas y aplicadas con éxito!',
      general: 'General e Idioma',
      security: 'Seguridad y Sesiones',
      integrations: 'Conexiones y MCPs',
      costs: 'Costos y Tokens Híbridos',
      squads: 'Squads y Agentes',
      skills: 'Gestor de Skills',
      audit: 'Auditoría ISO y Consejo',
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
      placeholder: 'Pregunte a PCL AEOS o use @ para sistemas corporativos y # para documentos...',
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
    }
  }
};

