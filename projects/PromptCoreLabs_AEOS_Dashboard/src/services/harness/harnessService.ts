export interface HarnessPipelineStage {
  id: string;
  name: string;
  type: 'build' | 'security_gate' | 'approval' | 'deploy';
  status: 'passed' | 'running' | 'pending' | 'failed';
  durationMs: number;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  targetSquads: string[];
}

class HarnessService {
  private featureFlags: Record<string, boolean> = {
    'ff_cortex_trace_motion': true,
    'ff_ollama_hybrid_router': true,
    'ff_strict_2_devices_guard': true,
    'ff_sha256_iso_audit': true,
    'ff_pii_guard_lgpd': true,
  };

  private stages: HarnessPipelineStage[] = [
    { id: 'stg-1', name: 'Stage Gate 1: Arquitetura Cortex', type: 'security_gate', status: 'passed', durationMs: 450 },
    { id: 'stg-2', name: 'Stage Gate 2: TypeScript & Lint Rules', type: 'build', status: 'passed', durationMs: 1200 },
    { id: 'stg-3', name: 'Stage Gate 3: Testes Unitários QA', type: 'build', status: 'passed', durationMs: 890 },
    { id: 'stg-4', name: 'Stage Gate 4: Auditoria SHA-256 ISO', type: 'security_gate', status: 'passed', durationMs: 320 },
  ];

  public isFeatureEnabled(flagKey: string): boolean {
    return this.featureFlags[flagKey] ?? false;
  }

  public getPipelineStages(): HarnessPipelineStage[] {
    return this.stages;
  }

  public async triggerDeploymentPipeline(environment: 'staging' | 'prod'): Promise<{ success: boolean; pipelineId: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          pipelineId: `harness-pipe-${Date.now()}-${environment}`,
        });
      }, 500);
    });
  }
}

export const harnessService = new HarnessService();
