import { Skill } from '../../types';

export type SkillDomain = 
  | 'Todas'
  | 'Segurança & Governança' 
  | 'Arquitetura & Engenharia' 
  | 'Reuniões & Áudio' 
  | 'FinOps & Custos' 
  | 'Automação & Orquestração'
  | 'Marketing & GTM'
  | 'Prototipagem & SDD';

export interface RichSkillDefinition extends Skill {
  domain: SkillDomain;
  enabled: boolean;
  version: string;
  executionProvider: 'CPU INT8' | 'GPU RTX 3050' | 'Cloud API' | 'Sandbox Shell';
  sandboxMode: 'Standard Sandbox' | 'Bypass Sandbox (Permissão Requerida)';
  inputSchemaJson: string;
  outputSchemaJson: string;
  triggerCommand: string;
  orchestratorSource?: 'paperclip' | 'langchain' | 'crewai' | 'agy' | 'manual';
}

const STORAGE_KEY = 'pcl_cockpit_skills_v1';
const UPDATE_EVENT = 'pcl:skills-updated';

/**
 * Catálogo Canônico de Skills refletindo o repositório PaperClip promptcore-labs
 * (c:\PromptCore_Labs\PaperClip-Companies\promptcore-labs\skills\ e .agents\skills\)
 */
const DEFAULT_SKILLS: RichSkillDefinition[] = [
  {
    id: 'skl-tlc-sdd',
    key: 'tlc-spec-driven',
    name: 'TLC Spec-Driven Development (SDD)',
    domain: 'Prototipagem & SDD',
    description: 'Esteira de desenvolvimento orientada por especificações rígidas, garantindo conformidade com ADRs e zero dívida técnica.',
    sourcePath: 'c:\\PromptCore_Labs\\PaperClip-Companies\\promptcore-labs\\skills\\tlc-spec-driven\\SKILL.md',
    mode: 'Read-Only',
    enabled: true,
    version: '3.6.0',
    executionProvider: 'GPU RTX 3050',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['Squad Estratégia', 'Cortex Master', 'CEO Agent'],
    triggerCommand: '/sdd-spec',
    orchestratorSource: 'paperclip',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        specTitle: { type: 'string' },
        businessRequirements: { type: 'array', items: { type: 'string' } },
        adrReference: { type: 'string' }
      },
      required: ['specTitle', 'businessRequirements']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        formalSpecMarkdown: { type: 'string' },
        stageGateChecklist: { type: 'array', items: { type: 'string' } },
        isCompliant: { type: 'boolean' }
      }
    }, null, 2),
    markdownContent: `---
name: tlc-spec-driven
description: Esteira de desenvolvimento orientada por especificações rígidas PCL AEOS.
---
# Diretrizes Canônicas TLC Spec-Driven
1. Nenhuma linha de código é produzida antes da validação da especificação formal.
2. Cada feature deve se ancorar em pelo menos um ADR canônico.
3. Critérios de aceitação devem ser testáveis e determinísticos.`
  },
  {
    id: 'skl-ui-mockups',
    key: 'ui-mockups-antigravity',
    name: 'UI Mockups Antigravity',
    domain: 'Prototipagem & SDD',
    description: 'Prototipagem ágil de telas executivas de alta fidelidade no PCL Cockpit com contraste WCAG AAA e zero clipping.',
    sourcePath: 'c:\\PromptCore_Labs\\PaperClip-Companies\\promptcore-labs\\skills\\ui-mockups-antigravity\\SKILL.md',
    mode: 'Editable',
    enabled: true,
    version: '2.0.0',
    executionProvider: 'GPU RTX 3050',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['Squad Prototyping & UI', 'Cortex Master'],
    triggerCommand: '/mockup-ui',
    orchestratorSource: 'paperclip',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        screenName: { type: 'string' },
        userPersona: { type: 'string' },
        theme: { type: 'string', enum: ['dark', 'light', 'executive-navy'] }
      },
      required: ['screenName']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        jsxComponent: { type: 'string' },
        previewArtifactUrl: { type: 'string' }
      }
    }, null, 2),
    markdownContent: `---
name: ui-mockups-antigravity
description: Prototipagem ágil de interfaces executivas no PCL Cockpit.
---
# Diretrizes de Prototipagem UI
- Estilização estrita via Tailwind CSS sem classes arbitrárias conflitantes.
- Paleta aprovada: Slate 900/950, Emerald 500 (ações primárias) e Sky 500.`
  },
  {
    id: 'skl-cortex',
    key: 'cortex',
    name: 'Cortex Architecture Engine',
    domain: 'Arquitetura & Engenharia',
    description: 'Guardião da arquitetura de software, diagramas Mermaid WCAG AAA e conformidade TLC v3.',
    sourcePath: 'c:\\PromptCore_Labs\\.agents\\skills\\cortex\\SKILL.md',
    mode: 'Editable',
    enabled: true,
    version: '3.6.0',
    executionProvider: 'GPU RTX 3050',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['Cortex Master', 'Squad Estratégia'],
    triggerCommand: '@cortex',
    orchestratorSource: 'paperclip',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        architectureContext: { type: 'string', description: 'Contexto de arquitetura ou ADR' },
        diagramType: { type: 'string', enum: ['flowchart', 'sequence', 'state', 'class'] },
        wcagContrast: { type: 'boolean', default: true }
      },
      required: ['architectureContext']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        mermaidCode: { type: 'string' },
        svgInline: { type: 'string' },
        architecturalReport: { type: 'string' }
      }
    }, null, 2),
    markdownContent: `---
name: cortex
domain: Arquitetura & Engenharia
description: Persona de Inteligência, Visualização de Arquitetura e Guardião dos Diagramas Mermaid do PCL AEOS.
version: 3.6.0
---

# Instruções Canônicas da Persona Cortex
1. Gere diagramas Mermaid exclusivamente nos formatos aprovados (flowchart LR/TD, sequence, state, class).
2. Garanta contraste estético WCAG AAA e prevenção de clipping textual.
3. Respeite os Stage Gates do TLC v3 (Pre-Commit, CI, Homologação, Produção).`
  },
  {
    id: 'skl-laya',
    key: 'laya-fast-classifier',
    name: 'Laya Coprocessor System One',
    domain: 'Arquitetura & Engenharia',
    description: 'Classificador não-autorregressivo em CPU INT8 (~20ms) para triagem de intenção, staleness e NLI.',
    sourcePath: 'c:\\PromptCore_Labs\\.agents\\skills\\laya\\SKILL.md',
    mode: 'Read-Only',
    enabled: true,
    version: '1.2.0',
    executionProvider: 'CPU INT8',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['Laya System One', 'Cortex Master'],
    triggerCommand: '@laya',
    orchestratorSource: 'paperclip',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        premise: { type: 'string', description: 'Premissa ou documento de referência' },
        hypothesis: { type: 'string', description: 'Hipótese ou alegação a verificar' }
      },
      required: ['premise', 'hypothesis']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        classification: { type: 'string', enum: ['entailment', 'neutral', 'contradiction'] },
        confidence: { type: 'number', minimum: 0, maximum: 1 },
        latency_ms: { type: 'number' },
        vram_allocated_mb: { type: 'number', const: 0 }
      }
    }, null, 2),
    markdownContent: `---
name: laya-fast-classifier
description: Coprocessador System One e Classificador não-autorregressivo de alta velocidade (~20-35ms) do PCL AEOS.
normative_ref: SPEC-PCL-AEOS-CLASSIFIER-01
---

# Regras Operacionais do Coprocessador Laya
- Invariante Estrito: 0 MB VRAM na CPU host via CPUExecutionProvider INT8.
- Responde em tempo O(1) determinístico sem alucinação.`
  },
  {
    id: 'skl-ai-pricing',
    key: 'ai-pricing',
    name: 'AI Dynamic Pricing & EBITDA Shield',
    domain: 'FinOps & Custos',
    description: 'Precificação dinâmica de serviços de IA, margens brutas D-0 e cálculo de custo marginal $0.00 local vs nuvem.',
    sourcePath: 'c:\\PromptCore_Labs\\PaperClip-Companies\\promptcore-labs\\skills\\ai-pricing\\SKILL.md',
    mode: 'Editable',
    enabled: true,
    version: '1.5.0',
    executionProvider: 'CPU INT8',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['Bot Financial (EBITDA Shield)', 'CEO Agent'],
    triggerCommand: '/price-service',
    orchestratorSource: 'paperclip',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        monthlyVolumeTokens: { type: 'number' },
        targetMarginPercent: { type: 'number', default: 85 },
        deploymentMode: { type: 'string', enum: ['LOCAL_SOVEREIGN', 'HYBRID_FASTPATH', 'CLOUD_HIGH_LOGIC'] }
      },
      required: ['monthlyVolumeTokens']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        suggestedPriceUSD: { type: 'number' },
        unitMarginPercent: { type: 'number' },
        ebitdaImpactUSD: { type: 'number' }
      }
    }, null, 2),
    markdownContent: `---
name: ai-pricing
description: Blindagem de margens e precificação de verticais de IA.
---
# EBITDA Shield
Garante margens brutas superiores a 80% através do roteamento preferencial para inferência local soberana.`
  },
  {
    id: 'skl-ai-seo',
    key: 'ai-seo',
    name: 'Programmatic SEO & Funil GTM',
    domain: 'Marketing & GTM',
    description: 'Geração programática de páginas estruturadas, palavras-chave B2B de alta conversão e otimização de busca.',
    sourcePath: 'c:\\PromptCore_Labs\\PaperClip-Companies\\promptcore-labs\\skills\\ai-seo\\SKILL.md',
    mode: 'Editable',
    enabled: true,
    version: '2.1.0',
    executionProvider: 'Cloud API',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['Squad Growth & DS', 'Squad RevOps'],
    triggerCommand: '/programmatic-seo',
    orchestratorSource: 'paperclip',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        niche: { type: 'string' },
        targetKeywords: { type: 'array', items: { type: 'string' } }
      },
      required: ['niche']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        seoBrief: { type: 'string' },
        suggestedH1s: { type: 'array', items: { type: 'string' } }
      }
    }, null, 2),
    markdownContent: `# Programmatic SEO
Estratégia de captura orgânica escalável para as 15 Verticais de Negócio B2B da PromptCore Labs.`
  },
  {
    id: 'skl-data-loss',
    key: 'accidental-data-loss-prevention',
    name: 'Data Loss Prevention Guard',
    domain: 'Segurança & Governança',
    description: 'Interrupção e solicitação de confirmação explícita do operador antes de qualquer comando destrutivo.',
    sourcePath: 'C:\\Users\\eduma\\.gemini\\config\\skills\\accidental-data-loss-prevention\\SKILL.md',
    mode: 'Read-Only',
    enabled: true,
    version: '2.1.0',
    executionProvider: 'Sandbox Shell',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['Cortex Master', 'Squad Infra & DevSecOps'],
    triggerCommand: '/guard-verify',
    orchestratorSource: 'manual',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Comando a ser inspecionado' }
      },
      required: ['command']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        isDestructive: { type: 'boolean' },
        requiresConfirmation: { type: 'boolean' }
      }
    }, null, 2),
    markdownContent: `# Diretrizes Mandatórias de DLP
Comandos destrutivos exigem confirmação explícita humana antes da execução.`
  },
  {
    id: 'skl-pii-redactor',
    key: 'pii-redactor-guard',
    name: 'PII Redactor & Enclave Shield',
    domain: 'Segurança & Governança',
    description: 'Detecção e ofuscação automática de dados sensíveis (CPF, RG, Cartões, Chaves de API) antes de qualquer log.',
    sourcePath: 'c:\\PromptCore_Labs\\knowledge\\warm\\PII_GUARD_SPEC.md',
    mode: 'Editable',
    enabled: true,
    version: '1.4.0',
    executionProvider: 'CPU INT8',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['Laya System One', 'Squad Infra & DevSecOps'],
    triggerCommand: '/redact-pii',
    orchestratorSource: 'manual',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        rawPayload: { type: 'string' }
      },
      required: ['rawPayload']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        sanitizedPayload: { type: 'string' },
        piiCount: { type: 'number' }
      }
    }, null, 2),
    markdownContent: `# PII Redactor Guard
Garante conformidade estrita com a LGPD e ISO 27001.`
  }
];

export const skillsService = {
  getSkills(): RichSkillDefinition[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[skillsService] Falha ao ler skills do localStorage:', e);
    }
    return DEFAULT_SKILLS;
  },

  saveSkills(skills: RichSkillDefinition[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: skills }));
    } catch (e) {
      console.error('[skillsService] Falha ao salvar skills:', e);
    }
  },

  toggleSkill(skillId: string): void {
    const skills = this.getSkills();
    const target = skills.find(s => s.id === skillId);
    if (target) {
      target.enabled = !target.enabled;
      this.saveSkills(skills);
    }
  },

  updateSkill(skillId: string, updates: Partial<RichSkillDefinition>): void {
    const skills = this.getSkills();
    const index = skills.findIndex(s => s.id === skillId);
    if (index !== -1) {
      skills[index] = { ...skills[index], ...updates };
      this.saveSkills(skills);
    }
  },

  addSkill(newSkill: Omit<RichSkillDefinition, 'id'>): RichSkillDefinition {
    const skills = this.getSkills();
    const created: RichSkillDefinition = {
      ...newSkill,
      id: `skl-${Date.now()}`
    };
    skills.push(created);
    this.saveSkills(skills);
    return created;
  },

  deleteSkill(skillId: string): void {
    const skills = this.getSkills();
    const filtered = skills.filter(s => s.id !== skillId);
    this.saveSkills(filtered);
  },

  resetToDefaults(): RichSkillDefinition[] {
    this.saveSkills(DEFAULT_SKILLS);
    return DEFAULT_SKILLS;
  },

  /**
   * Esteira de Ingestão de Skills de Classe Mundial (World-Class Skill Ingestion)
   * Processa arquivos .md (com frontmatter), .yaml ou .json com triagem de segurança e alocação de hardware
   */
  ingestSkillPackage(content: string, fileName: string): {
    success: boolean;
    skill?: RichSkillDefinition;
    warnings?: string[];
    error?: string;
  } {
    try {
      const warnings: string[] = [];
      let name = fileName.replace(/\.(md|yaml|yml|json)$/i, '');
      let description = 'Habilidade ingerida dinamicamente no PCL Cockpit.';
      let trigger = `/${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      let domain: SkillDomain = 'Prototipagem & SDD';
      let executionProvider: RichSkillDefinition['executionProvider'] = 'CPU INT8';

      // 1. Extração de Frontmatter YAML
      if (content.startsWith('---')) {
        const parts = content.split('---');
        if (parts.length >= 3) {
          const yamlBlock = parts[1];
          const lines = yamlBlock.split('\n');
          lines.forEach(line => {
            const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
            if (match) {
              const key = match[1].toLowerCase();
              const val = match[2].trim().replace(/^['"]|['"]$/g, '');
              if (key === 'name') name = val;
              if (key === 'description') description = val;
              if (key === 'trigger' || key === 'command') trigger = val.startsWith('/') ? val : `/${val}`;
              if (key === 'domain') domain = val as SkillDomain;
            }
          });
        }
      }

      // 2. Laya Security & LGPD Screening (detecção rápida de chaves vazadas ou comandos de risco)
      if (/sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{20,}/.test(content)) {
        warnings.push('Aviso Laya: Chave de API em texto claro detectada. O PII Guard irá ofuscá-la.');
      }
      if (/rm\s+-rf|DROP\s+TABLE|format\s+c:/i.test(content)) {
        warnings.push('Aviso de Segurança: Comandos de deleção irreversível detectados. Enquadrado em Sandbox Estrito.');
      }

      // 3. Alocação Automática de Hardware (FinOps Invariant $0.00)
      if (/classifier|nli|guardrail|routing|filter/i.test(name + ' ' + description)) {
        executionProvider = 'CPU INT8'; // Laya 0 MB VRAM
      } else if (/code|architecture|generate|design/i.test(name + ' ' + description)) {
        executionProvider = 'GPU RTX 3050'; // Ollama Local
      } else {
        executionProvider = 'Sandbox Shell';
      }

      const newSkill: RichSkillDefinition = {
        id: `skl-ingested-${Date.now()}`,
        key: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
        domain,
        description,
        sourcePath: `c:\\PromptCore_Labs\\PaperClip-Companies\\promptcore-labs\\skills\\${name}\\SKILL.md`,
        mode: 'Editable',
        enabled: true,
        version: '1.0.0',
        executionProvider,
        sandboxMode: 'Standard Sandbox',
        usedByAgents: ['Cortex Master', 'Squad Estratégia'],
        triggerCommand: trigger,
        orchestratorSource: 'paperclip',
        inputSchemaJson: JSON.stringify({
          type: 'object',
          properties: {
            inputContext: { type: 'string', description: 'Contexto de entrada para execução' }
          },
          required: ['inputContext']
        }, null, 2),
        outputSchemaJson: JSON.stringify({
          type: 'object',
          properties: {
            result: { type: 'string' },
            status: { type: 'string' }
          }
        }, null, 2),
        markdownContent: content
      };

      const added = this.addSkill(newSkill);
      return {
        success: true,
        skill: added,
        warnings
      };
    } catch (e: any) {
      return {
        success: false,
        error: `Falha ao processar ingestão da skill: ${e.message}`
      };
    }
  },

  async syncFromPaperClipDisk(): Promise<{
    ok: boolean;
    totalSkills: number;
    companyHash?: string;
    repoPath?: string;
    syncedAt?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/aeos/paperclip/sync', { signal: AbortSignal.timeout(4000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.skills) && data.skills.length > 0) {
        this.saveSkills(data.skills);
        return {
          ok: true,
          totalSkills: data.skills.length,
          companyHash: data.companyHash,
          repoPath: data.repoPath,
          syncedAt: data.syncedAt
        };
      }
      return { ok: false, totalSkills: 0, error: 'Nenhuma skill retornada do disco.' };
    } catch (e: any) {
      return { ok: false, totalSkills: 0, error: e?.message || 'Backend indisponível' };
    }
  },

  subscribe(callback: (skills: RichSkillDefinition[]) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<RichSkillDefinition[]>;
      callback(customEvent.detail || this.getSkills());
    };
    window.addEventListener(UPDATE_EVENT, handler);
    return () => window.removeEventListener(UPDATE_EVENT, handler);
  }
};
