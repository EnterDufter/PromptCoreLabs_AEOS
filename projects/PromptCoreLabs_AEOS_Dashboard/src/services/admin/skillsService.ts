import { Skill } from '../../types';

export type SkillDomain = 
  | 'Segurança & Governança' 
  | 'Arquitetura & Engenharia' 
  | 'Reuniões & Áudio' 
  | 'FinOps & Custos' 
  | 'Automação & Orquestração';

export interface RichSkillDefinition extends Skill {
  domain: SkillDomain;
  enabled: boolean;
  version: string;
  executionProvider: 'CPU INT8' | 'GPU RTX 3050' | 'Cloud API' | 'Sandbox Shell';
  sandboxMode: 'Standard Sandbox' | 'Bypass Sandbox (Permissão Requerida)';
  inputSchemaJson: string;
  outputSchemaJson: string;
  triggerCommand: string;
}

const STORAGE_KEY = 'pcl_cockpit_skills_v1';
const UPDATE_EVENT = 'pcl:skills-updated';

const DEFAULT_SKILLS: RichSkillDefinition[] = [
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
    usedByAgents: ['Cortex Master', 'Arch Designer'],
    triggerCommand: '@cortex',
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
    usedByAgents: ['Paperclip Auditor', 'Cortex Master', 'Code Reviewer'],
    triggerCommand: '/guard-verify',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Comando a ser inspecionado' },
        targetPath: { type: 'string', description: 'Arquivo ou base alvo' }
      },
      required: ['command']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        isDestructive: { type: 'boolean' },
        requiresConfirmation: { type: 'boolean' },
        riskLevel: { type: 'string', enum: ['LOW', 'MEDIUM', 'CRITICAL'] }
      }
    }, null, 2),
    markdownContent: `---
name: accidental-data-loss-prevention
description: STOP AND VERIFY before running commands with irreversible data loss.
---

# Diretrizes Mandatórias de DLP
- Comandos destrutivos (DROP, rm -rf, truncate, delete sem WHERE) exigem confirmação explícita humana antes da execução.`
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
    usedByAgents: ['Laya System One', 'FinOps Sentinel'],
    triggerCommand: '/redact-pii',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        rawPayload: { type: 'string', description: 'Texto ou JSON para análise de dados sensíveis' },
        maskFormat: { type: 'string', enum: ['HASH_SHA256', 'REDACTED_TAG', 'TOKENIZED'] }
      },
      required: ['rawPayload']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        sanitizedPayload: { type: 'string' },
        piiCount: { type: 'number' },
        detectedTypes: { type: 'array', items: { type: 'string' } }
      }
    }, null, 2),
    markdownContent: `# PII Redactor Guard
Garante conformidade estrita com a LGPD e ISO 27001. Dados sensíveis nunca saem do perímetro corporativo em texto claro.`
  },
  {
    id: 'skl-whisperx',
    key: 'whisperx-meeting-diarizer',
    name: 'WhisperX Audio Diarizer',
    domain: 'Reuniões & Áudio',
    description: 'Transcrição e diarização de reuniões locais com separação de interlocutores e extração de atas.',
    sourcePath: 'c:\\PromptCore_Labs\\.agents\\skills\\whisperx\\SKILL.md',
    mode: 'Editable',
    enabled: true,
    version: '2.0.0',
    executionProvider: 'CPU INT8',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['Paperclip Auditor'],
    triggerCommand: '/transcribe-meeting',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        audioSourceUri: { type: 'string', description: 'Caminho do arquivo de áudio ou fluxo WebRTC' },
        language: { type: 'string', default: 'pt' }
      },
      required: ['audioSourceUri']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        transcription: { type: 'array', items: { type: 'object' } },
        speakers: { type: 'array', items: { type: 'string' } },
        actionItems: { type: 'array', items: { type: 'string' } }
      }
    }, null, 2),
    markdownContent: `# WhisperX Meeting Diarizer
Processamento 100% local sem robôs invasores na chamada. Áudio processado na máquina host com descarte seguro pós-diarização.`
  },
  {
    id: 'skl-finops',
    key: 'finops-budget-enforcer',
    name: 'FinOps Budget & Hard Lock',
    domain: 'FinOps & Custos',
    description: 'Monitoramento contínuo de tokens e bloqueio físico automático para chamadas pagas ao atingir o teto.',
    sourcePath: 'c:\\PromptCore_Labs\\knowledge\\warm\\FINOPS_GUARD_SPEC.md',
    mode: 'Editable',
    enabled: true,
    version: '3.0.0',
    executionProvider: 'CPU INT8',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['FinOps Sentinel'],
    triggerCommand: '/enforce-budget',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        requestedModel: { type: 'string' },
        estimatedTokens: { type: 'number' },
        squadId: { type: 'string' }
      },
      required: ['requestedModel', 'estimatedTokens']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        allowed: { type: 'boolean' },
        currentMonthSpendUSD: { type: 'number' },
        budgetCapUSD: { type: 'number' },
        fallbackToLocalZeroCost: { type: 'boolean' }
      }
    }, null, 2),
    markdownContent: `# FinOps Budget Guard
Calcula o custo marginal local ($0.00) vs nuvem e impõe a trava de teto orçamentário configurada pela diretoria.`
  },
  {
    id: 'skl-bigquery-sql',
    key: 'bigquery-sql',
    name: 'BigQuery SQL Optimizer',
    domain: 'Arquitetura & Engenharia',
    description: 'Otimização de consultas analíticas SQL, particionamento e redução de bytes faturados.',
    sourcePath: 'C:\\Users\\eduma\\.gemini\\config\\skills\\bigquery-sql\\SKILL.md',
    mode: 'Editable',
    enabled: true,
    version: '1.8.0',
    executionProvider: 'Cloud API',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['Cortex Master', 'Code Reviewer'],
    triggerCommand: '/optimize-sql',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        rawSql: { type: 'string' },
        targetTable: { type: 'string' }
      },
      required: ['rawSql']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        optimizedSql: { type: 'string' },
        estimatedBytesReductionPercent: { type: 'number' },
        performanceTips: { type: 'array', items: { type: 'string' } }
      }
    }, null, 2),
    markdownContent: `# BigQuery SQL Optimizer
Regras de otimização de custo e performance de querys corporativas no BigQuery.`
  },
  {
    id: 'skl-sha256-witness',
    key: 'sha256-audit-witness',
    name: 'SHA-256 Audit Trail Witness',
    domain: 'Segurança & Governança',
    description: 'Encadeamento criptográfico de logs e geração de certificados de integridade para ISO 27001/42001.',
    sourcePath: 'c:\\PromptCore_Labs\\knowledge\\warm\\CRYPTO_AUDIT_SPEC.md',
    mode: 'Read-Only',
    enabled: true,
    version: '2.5.0',
    executionProvider: 'CPU INT8',
    sandboxMode: 'Standard Sandbox',
    usedByAgents: ['ISO 42001 Witness', 'FinOps Sentinel'],
    triggerCommand: '/certify-audit',
    inputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        logBatchId: { type: 'string' },
        previousHash: { type: 'string' }
      },
      required: ['logBatchId']
    }, null, 2),
    outputSchemaJson: JSON.stringify({
      type: 'object',
      properties: {
        batchHashSha256: { type: 'string' },
        isChainIntact: { type: 'boolean' },
        timestampUtc: { type: 'string' },
        attestationSignature: { type: 'string' }
      }
    }, null, 2),
    markdownContent: `# SHA-256 Audit Witness
Gera atestos matemáticos imutáveis contra fraudes e adulterações em auditorias corporativas.`
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

  subscribe(callback: (skills: RichSkillDefinition[]) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<RichSkillDefinition[]>;
      callback(customEvent.detail || this.getSkills());
    };
    window.addEventListener(UPDATE_EVENT, handler);
    return () => window.removeEventListener(UPDATE_EVENT, handler);
  }
};
