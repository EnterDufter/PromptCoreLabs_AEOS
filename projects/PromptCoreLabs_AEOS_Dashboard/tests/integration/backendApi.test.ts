// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer, ViteDevServer } from 'vite';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DASHBOARD_ROOT = path.resolve(__dirname, '../..');
const WORKSPACE_ROOT = path.resolve(DASHBOARD_ROOT, '../..');
const VAULT_CATALOG = path.join(WORKSPACE_ROOT, 'data', 'cockpit-vault', 'catalog.json');

interface MiddlewareResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  json: <T = any>() => T;
}

/**
 * Invoca o pipeline de middlewares do Vite diretamente em memória,
 * evitando falhas de socket loopback/faixas de porta reservadas pelo Hyper-V no Windows.
 */
async function invokeMiddleware(
  middlewares: any,
  method: string,
  url: string,
  payload?: any
): Promise<MiddlewareResponse> {
  return new Promise((resolve, reject) => {
    const req: any = new PassThrough();
    req.method = method;
    req.url = url;
    req.headers = { 'content-type': 'application/json' };

    const headers: Record<string, string> = {};
    const chunks: Buffer[] = [];
    const res: any = new EventEmitter();
    res.statusCode = 200;
    res.setHeader = (k: string, v: string) => {
      headers[k.toLowerCase()] = String(v);
    };
    res.getHeader = (k: string) => headers[k.toLowerCase()];
    res.write = (chunk: any) => {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), 'utf8'));
      return true;
    };
    res.end = (chunk?: any) => {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), 'utf8'));
      const body = Buffer.concat(chunks).toString('utf8');
      resolve({
        statusCode: res.statusCode,
        headers,
        body,
        json: () => JSON.parse(body || '{}')
      });
    };

    middlewares.handle(req, res, (err?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          statusCode: 404,
          headers,
          body: '',
          json: () => ({})
        });
      }
    });

    if (payload !== undefined) {
      req.end(typeof payload === 'string' ? payload : JSON.stringify(payload));
    } else {
      req.end();
    }
  });
}

describe('Backend Middleware Integration & Anti-Mock Verification', () => {
  let server: ViteDevServer;
  let originalCatalogExisted = false;
  let originalCatalogRaw: string | null = null;

  beforeAll(async () => {
    if (fs.existsSync(VAULT_CATALOG)) {
      originalCatalogExisted = true;
      originalCatalogRaw = fs.readFileSync(VAULT_CATALOG, 'utf8');
    }

    server = await createServer({
      configFile: path.join(DASHBOARD_ROOT, 'vite.config.ts'),
      root: DASHBOARD_ROOT,
      cacheDir: path.join(os.tmpdir(), `vite-aeos-vitest-${process.pid}-${Date.now()}`),
      server: {
        middlewareMode: true,
        hmr: false
      },
      optimizeDeps: { force: false, noDiscovery: true },
      logLevel: 'silent'
    });
  }, 30000);

  afterAll(async () => {
    if (originalCatalogExisted && originalCatalogRaw !== null) {
      fs.writeFileSync(VAULT_CATALOG, originalCatalogRaw, 'utf8');
    } else if (!originalCatalogExisted && fs.existsSync(VAULT_CATALOG)) {
      fs.unlinkSync(VAULT_CATALOG);
    }
    if (server) {
      await server.close();
    }
  });

  it('GET /api/aeos/status retorna flags booleanos reais de infraestrutura', async () => {
    const res = await invokeMiddleware(server.middlewares, 'GET', '/api/aeos/status');
    expect(res.statusCode).toBe(200);
    const data = res.json();

    expect(typeof data.omnirouteUp).toBe('boolean');
    expect(typeof data.ollamaUp).toBe('boolean');
    expect(typeof data.layaUp).toBe('boolean');
    expect(typeof data.postgresUp).toBe('boolean');
    expect(typeof data.paperclipUp).toBe('boolean');
  });

  it('GET /api/aeos/audit-probe retorna comprovante SHA-256 e diagnóstico real', async () => {
    const res = await invokeMiddleware(server.middlewares, 'GET', '/api/aeos/audit-probe?service=svc-laya');
    expect(res.statusCode).toBe(200);
    const data = res.json();

    expect(data.service).toBe('svc-laya');
    expect(data.vramAllocatedMb).toBe(0);
    expect(typeof data.httpDaemonUp).toBe('boolean');
    expect(typeof data.stdioFastMcpReady).toBe('boolean');
    expect(data.sha256Receipt).toMatch(/^[a-f0-9]{64}$/);
  });

  it('GET /api/aeos/cockpit/storage-quota reporta métricas reais sem piso artificial de 142 MB', async () => {
    const res = await invokeMiddleware(server.middlewares, 'GET', '/api/aeos/cockpit/storage-quota');
    expect(res.statusCode).toBe(200);
    const quota = res.json();

    expect(typeof quota.usedBytes).toBe('number');
    expect(quota.usedBytes).toBeGreaterThanOrEqual(0);
    expect(typeof quota.postgresConnected).toBe('boolean');
    expect(['ONLINE', 'STANDBY', 'LOCAL_MIRROR']).toContain(quota.r2Status);
  });

  it('POST+GET /api/aeos/cockpit/sync preserva timestamps históricos (Ontem / 7 dias) e senderName', async () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const msgTimestamp = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60000).toISOString();
    const todayIso = new Date().toISOString();

    const payload = {
      activeConversationId: 'conv-test-old',
      openConversationIds: ['conv-test-old', 'conv-test-new'],
      updatedAt: todayIso,
      projects: [
        {
          id: 'proj-test-persistence',
          name: 'Projeto Teste Cronologia',
          conversationsCount: 2,
          activeAgentsCount: 1,
          conversations: [
            {
              id: 'conv-test-old',
              title: 'Conversa Histórica 3 Dias',
              projectId: 'proj-test-persistence',
              dateGroup: 'Últimos 7 dias',
              updatedAt: threeDaysAgo,
              messages: [
                {
                  id: 'msg-test-old-1',
                  sender: 'user',
                  senderName: 'Operador QA',
                  createdAt: msgTimestamp,
                  timestamp: '10:15',
                  text: 'Mensagem histórica para validação de timestamp'
                }
              ],
              artifacts: []
            },
            {
              id: 'conv-test-new',
              title: 'Conversa Hoje',
              projectId: 'proj-test-persistence',
              dateGroup: 'Hoje',
              updatedAt: todayIso,
              messages: [],
              artifacts: []
            }
          ]
        }
      ]
    };

    const postRes = await invokeMiddleware(server.middlewares, 'POST', '/api/aeos/cockpit/sync', payload);
    expect(postRes.statusCode).toBe(200);
    expect(postRes.json().ok).toBe(true);

    const getRes = await invokeMiddleware(server.middlewares, 'GET', '/api/aeos/cockpit/sync');
    expect(getRes.statusCode).toBe(200);
    const state = getRes.json();

    const restoredProj = state.projects.find((p: any) => p.id === 'proj-test-persistence');
    expect(restoredProj).toBeTruthy();

    const restoredOld = restoredProj.conversations.find((c: any) => c.id === 'conv-test-old');
    expect(restoredOld).toBeTruthy();
    expect(new Date(restoredOld.updatedAt).getTime()).toBeCloseTo(new Date(threeDaysAgo).getTime(), -3);
    expect(restoredOld.messages[0].senderName).toBe('Operador QA');
    expect(restoredOld.messages[0].createdAt).toBeTruthy();
  });

  it('GET /api/aeos/paperclip/sync inventaria arquivos físicos do PaperClip-Companies', async () => {
    const res = await invokeMiddleware(server.middlewares, 'GET', '/api/aeos/paperclip/sync');
    expect(res.statusCode).toBe(200);
    const data = res.json();

    expect(data.ok).toBe(true);
    expect(Array.isArray(data.squads)).toBe(true);
    expect(Array.isArray(data.skills)).toBe(true);
    expect(data.stats.totalSquads).toBeGreaterThan(0);
    expect(data.stats.totalAgentsOnDisk).toBeGreaterThan(0);
    expect(data.stats.totalSkillsOnDisk).toBeGreaterThan(0);
    expect(data.companyHash).toMatch(/^[a-f0-9]{12,64}$/);
  });

  it('GET /api/aeos/diagnostics/run-all valida MCP Sovereign ao vivo e emite sumário honesto', async () => {
    const res = await invokeMiddleware(server.middlewares, 'GET', '/api/aeos/diagnostics/run-all');
    expect(res.statusCode).toBe(200);
    const report = res.json();

    expect(report.summary.total).toBeGreaterThanOrEqual(7);
    expect(report.sha256Receipt).toMatch(/^[a-f0-9]{64}$/);

    const sovCheck = report.checks.find((c: any) => c.id === 'mcp-pcl-sovereign');
    expect(sovCheck).toBeTruthy();
    expect(sovCheck.status).toBe('PASS');
    expect(sovCheck.detail).toContain('Handshake JSON-RPC OK');
  });

  it('POST /api/aeos/mcp/inspect executa handshake JSON-RPC real e tools/call em pcl-sovereign', async () => {
    const res = await invokeMiddleware(server.middlewares, 'POST', '/api/aeos/mcp/inspect', {
      serverId: 'mcp-pcl-sovereign',
      callToolName: 'pcl_verify_artifact_sha256',
      callToolArgs: { payload: 'PCL-TEST-HASH' }
    });
    expect(res.statusCode).toBe(200);
    const data = res.json();

    expect(data.ok).toBe(true);
    expect(data.liveHandshake).toBe(true);
    expect(Array.isArray(data.tools)).toBe(true);
    expect(data.tools.length).toBeGreaterThanOrEqual(4);
    expect(data.toolCallResult).toBeTruthy();
  });

  it('GET+POST /api/aeos/entitlements retorna e avalia módulos multi-tenant (PCL GrowthOS Trial 14d & locked_upsell)', async () => {
    const getRes = await invokeMiddleware(server.middlewares, 'GET', '/api/aeos/entitlements');
    expect(getRes.statusCode).toBe(200);
    const data = getRes.json();

    expect(data.ok).toBe(true);
    expect(data.tenant.id).toBe('tnt_promptcore_default');
    expect(Array.isArray(data.entitlements)).toBe(true);
    expect(data.entitlements.length).toBeGreaterThanOrEqual(4);

    const growthMod = data.entitlements.find((e: any) => e.moduleKey === 'pcl-growth-os');
    expect(growthMod).toBeTruthy();
    expect(growthMod.accessState).toBe('trial_14d');
    expect(growthMod.pluginManifest.id).toBe('pcl-growth-os');

    const evalAllowed = await invokeMiddleware(server.middlewares, 'POST', '/api/aeos/entitlements/evaluate', {
      tenantId: 'tnt_promptcore_default',
      moduleKey: 'pcl-growth-os'
    });
    expect(evalAllowed.statusCode).toBe(200);
    expect(evalAllowed.json().allowed).toBe(true);

    const evalLocked = await invokeMiddleware(server.middlewares, 'POST', '/api/aeos/entitlements/evaluate', {
      tenantId: 'tnt_promptcore_default',
      moduleKey: 'pcl-maquina-receita'
    });
    expect(evalLocked.statusCode).toBe(200);
    expect(evalLocked.json().allowed).toBe(false);
    expect(evalLocked.json().accessState).toBe('locked_upsell');
  });

  it('GET+POST /api/aeos/audit/chain e /api/aeos/vault/seal validam cadeia SHA-256 e cofre AES-256-GCM', async () => {
    const sealRes = await invokeMiddleware(server.middlewares, 'POST', '/api/aeos/vault/seal', {
      connectorKey: 'test-clickup-oauth',
      secretValue: 'pk_test_secret_token_2026_aeos'
    });
    expect(sealRes.statusCode).toBe(200);
    const sealData = sealRes.json();
    expect(sealData.ok).toBe(true);
    expect(sealData.cipherAlgorithm).toBe('AES-256-GCM');
    expect(sealData.keyFingerprintSha256).toMatch(/^[a-f0-9]{64}$/);

    const chainRes = await invokeMiddleware(server.middlewares, 'GET', '/api/aeos/audit/chain');
    expect(chainRes.statusCode).toBe(200);
    const chainData = chainRes.json();
    expect(chainData.ok).toBe(true);
    expect(chainData.chainIntegrityValid).toBe(true);
    expect(chainData.totalRecords).toBeGreaterThanOrEqual(2);
    expect(chainData.headHashSha256).toMatch(/^[a-f0-9]{64}$/);
  });
});
