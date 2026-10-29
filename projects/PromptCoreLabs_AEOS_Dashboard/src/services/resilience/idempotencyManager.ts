/**
 * PCL AEOS — Idempotency Manager (SHA-256 Token Deduplication)
 * Camada 1 da Tríade de Resiliência Distribuída
 */

export interface IdempotentRequest<T> {
  key: string;
  timestamp: number;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  promise: Promise<T>;
  response?: T;
  error?: Error;
}

class IdempotencyManager {
  private cache: Map<string, IdempotentRequest<any>> = new Map();
  private readonly TTL_MS = 15 * 60 * 1000; // 15 minutos de TTL

  /**
   * Gera uma chave determinística SHA-256 no browser via SubtleCrypto
   */
  public async generateKey(sessionId: string, actionType: string, payload: any): Promise<string> {
    const timeWindow = Math.floor(Date.now() / 10000); // Bloco de 10 segundos
    const canonicalPayload = JSON.stringify(payload, Object.keys(payload || {}).sort());
    const rawString = `${sessionId}:${actionType}:${canonicalPayload}:${timeWindow}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(rawString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Executa a ação garantindo que múltiplos cliques ou reconexões WebSocket
   * não disparem execuções duplicadas.
   */
  public async execute<T>(
    key: string,
    action: () => Promise<T>
  ): Promise<{ data: T; isCached: boolean }> {
    this.cleanExpired();

    const existing = this.cache.get(key);
    if (existing) {
      if (existing.status === 'PENDING') {
        // Aguarda a mesma requisição em andamento (elimina duplo-clique)
        const data = await existing.promise;
        return { data, isCached: true };
      }
      if (existing.status === 'RESOLVED' && existing.response !== undefined) {
        return { data: existing.response, isCached: true };
      }
    }

    const promise = action();
    const requestRecord: IdempotentRequest<T> = {
      key,
      timestamp: Date.now(),
      status: 'PENDING',
      promise,
    };

    this.cache.set(key, requestRecord);

    try {
      const data = await promise;
      requestRecord.status = 'RESOLVED';
      requestRecord.response = data;
      return { data, isCached: false };
    } catch (err: any) {
      requestRecord.status = 'REJECTED';
      requestRecord.error = err;
      // Em caso de erro, expurga da chave após 15 segundos para permitir nova tentativa
      setTimeout(() => this.cache.delete(key), 15000);
      throw err;
    }
  }

  private cleanExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.TTL_MS) {
        this.cache.delete(key);
      }
    }
  }
}

export const idempotencyManager = new IdempotencyManager();
