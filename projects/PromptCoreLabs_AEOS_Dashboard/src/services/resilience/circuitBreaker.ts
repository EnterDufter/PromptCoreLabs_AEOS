/**
 * PCL AEOS — Circuit Breaker Tri-State & Sovereign Local Fallback ($0.00)
 * Camada 3 da Tríade de Resiliência Distribuída
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  failureThreshold: number; // Ex: 3 falhas consecutivas
  timeoutMs: number;        // Ex: 15.000 ms
  cooldownMs: number;       // Ex: 30.000 ms
}

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private listeners: ((state: CircuitState) => void)[] = [];

  private config: CircuitBreakerConfig = {
    failureThreshold: 3,
    timeoutMs: 15000,
    cooldownMs: 30000,
  };

  public getState(): CircuitState {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.config.cooldownMs) {
        this.transitionTo('HALF_OPEN');
      }
    }
    return this.state;
  }

  public subscribe(listener: (state: CircuitState) => void) {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private transitionTo(newState: CircuitState) {
    this.state = newState;
    this.listeners.forEach(l => l(newState));
  }

  /**
   * Executa a chamada protegida com fallback automático para o Ollama local ($0.00)
   */
  public async executeWithFallback<T>(
    primaryAction: () => Promise<T>,
    fallbackAction: () => Promise<T>
  ): Promise<{ result: T; fallbackUsed: boolean }> {
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      // Circuito aberto: aciona imediatamente o fallback local em CPU
      const result = await fallbackAction();
      return { result, fallbackUsed: true };
    }

    try {
      // Executa a chamada primária com proteção de timeout
      const result = await Promise.race([
        primaryAction(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout de API Upstream (>15s)')), this.config.timeoutMs)
        )
      ]);

      if (currentState === 'HALF_OPEN') {
        // Canário bem-sucedido: fecha o circuito e normaliza o tráfego
        this.failureCount = 0;
        this.transitionTo('CLOSED');
      }

      return { result, fallbackUsed: false };
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.config.failureThreshold) {
        this.transitionTo('OPEN');
      }

      // Redireciona imediatamente para o fallback local soberano a $0.00
      const result = await fallbackAction();
      return { result, fallbackUsed: true };
    }
  }
}

export const circuitBreaker = new CircuitBreaker();
