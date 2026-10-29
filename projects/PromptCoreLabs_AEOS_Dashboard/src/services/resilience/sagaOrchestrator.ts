/**
 * PCL AEOS — Saga Orchestrator (Distributed Transactions & Compensating Rollbacks)
 * Camada 2 da Tríade de Resiliência Distribuída
 */

export interface SagaStep<TInput, TOutput> {
  name: string;
  execute: (input: TInput) => Promise<TOutput>;
  compensate: (output: TOutput) => Promise<void>;
}

export interface SagaExecutionLog {
  stepName: string;
  status: 'PENDING' | 'SUCCESS' | 'COMPENSATED' | 'FAILED';
  latencyMs: number;
  timestamp: string;
}

export class SagaOrchestrator {
  private executionHistory: SagaExecutionLog[] = [];

  public async runPipeline<TInitial, TFinal>(
    sagaName: string,
    initialPayload: TInitial,
    steps: SagaStep<any, any>[]
  ): Promise<{ result: TFinal; logs: SagaExecutionLog[]; wasCompensated: boolean }> {
    const completedSteps: { step: SagaStep<any, any>; output: any }[] = [];
    let currentPayload = initialPayload;
    const logs: SagaExecutionLog[] = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const start = performance.now();

      try {
        const output = await step.execute(currentPayload);
        const latencyMs = Math.round(performance.now() - start);

        completedSteps.push({ step, output });
        currentPayload = output;

        logs.push({
          stepName: step.name,
          status: 'SUCCESS',
          latencyMs,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        const latencyMs = Math.round(performance.now() - start);
        logs.push({
          stepName: step.name,
          status: 'FAILED',
          latencyMs,
          timestamp: new Date().toISOString()
        });

        // Aciona o Rollback Compensatório em ordem reversa
        for (let j = completedSteps.length - 1; j >= 0; j--) {
          const compensation = completedSteps[j];
          try {
            await compensation.step.compensate(compensation.output);
            logs.push({
              stepName: `Compensação: ${compensation.step.name}`,
              status: 'COMPENSATED',
              latencyMs: 5,
              timestamp: new Date().toISOString()
            });
          } catch (compErr) {
            console.error(`Erro ao compensar etapa ${compensation.step.name}:`, compErr);
          }
        }

        return {
          result: currentPayload as unknown as TFinal,
          logs,
          wasCompensated: true
        };
      }
    }

    return {
      result: currentPayload as unknown as TFinal,
      logs,
      wasCompensated: false
    };
  }
}

export const sagaOrchestrator = new SagaOrchestrator();
