import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DASHBOARD_ROOT = path.resolve(__dirname, '..');
const WORKSPACE_ROOT = path.resolve(DASHBOARD_ROOT, '../..');

function loadEnvIfPresent() {
  const envPath = path.join(WORKSPACE_ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq <= 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (k && process.env[k] === undefined) process.env[k] = v;
  }
}

async function runMcpStdioTest({ name, command, args, callTool, callArgs, timeoutMs = 8000 }) {
  const startedAt = Date.now();
  return new Promise((resolve) => {
    let stdoutBuf = '';
    let stderrBuf = '';
    let resolved = false;
    let initResult = null;
    let toolsList = null;

    const child = spawn(command, args, {
      cwd: WORKSPACE_ROOT,
      windowsHide: true
    });

    const finish = (outcome) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      try { child.kill(); } catch {}
      resolve({ name, latencyMs: Date.now() - startedAt, ...outcome });
    };

    const timer = setTimeout(() => {
      finish({ ok: false, stage: 'timeout', error: `Timeout após ${timeoutMs}ms: ${stderrBuf.slice(0, 300)}` });
    }, timeoutMs);

    child.on('error', (err) => {
      finish({ ok: false, stage: 'spawn', error: err.message });
    });

    child.stderr?.on('data', (chunk) => {
      stderrBuf += chunk.toString();
    });

    child.stdout?.on('data', (chunk) => {
      stdoutBuf += chunk.toString();
      const lines = stdoutBuf.split(/\r?\n/);
      stdoutBuf = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('{')) continue;
        try {
          const msg = JSON.parse(trimmed);
          if (msg.id === 1) {
            initResult = msg.result;
            child.stdin?.write(
              JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n' +
              JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }) + '\n'
            );
          } else if (msg.id === 2) {
            toolsList = msg.result?.tools || [];
            if (callTool) {
              child.stdin?.write(
                JSON.stringify({
                  jsonrpc: '2.0',
                  id: 3,
                  method: 'tools/call',
                  params: { name: callTool, arguments: callArgs || {} }
                }) + '\n'
              );
            } else {
              finish({ ok: true, initResult, toolsList });
            }
          } else if (msg.id === 3) {
            if (msg.error) {
              finish({ ok: false, stage: 'tools/call', initResult, toolsList, error: JSON.stringify(msg.error) });
            } else {
              finish({ ok: true, initResult, toolsList, toolCallResult: msg.result });
            }
          }
        } catch {
          // Ignora linha parcial
        }
      }
    });

    child.stdin?.write(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'pcl-verify-mcps', version: '1.0.0' }
        }
      }) + '\n'
    );
  });
}

async function main() {
  loadEnvIfPresent();
  console.log('=== Suite 3: Live MCP JSON-RPC 2.0 Verification ===');

  let hasHardFailure = false;

  // 1. PCL Sovereign Workspace MCP (Critical)
  const testPayload = 'pcl-mcp-sha256-check';
  const expectedSha = crypto.createHash('sha256').update(testPayload, 'utf8').digest('hex');
  const sovScript = path.join(DASHBOARD_ROOT, 'scripts', 'pcl-sovereign-mcp-server.mjs');
  const sovRes = await runMcpStdioTest({
    name: 'mcp-pcl-sovereign',
    command: process.execPath,
    args: [sovScript],
    callTool: 'pcl_verify_artifact_sha256',
    callArgs: { payload: testPayload }
  });

  if (!sovRes.ok || !Array.isArray(sovRes.toolsList) || sovRes.toolsList.length < 4) {
    console.error(`[FAIL] mcp-pcl-sovereign: ${sovRes.error || 'Menos de 4 tools retornadas'}`);
    hasHardFailure = true;
  } else {
    const textOut = sovRes.toolCallResult?.content?.[0]?.text || '';
    if (!textOut.includes(expectedSha)) {
      console.error(`[FAIL] mcp-pcl-sovereign SHA-256 mismatch! Esperado ${expectedSha}, recebido: ${textOut}`);
      hasHardFailure = true;
    } else {
      console.log(`[PASS] mcp-pcl-sovereign (${sovRes.latencyMs}ms): ${sovRes.toolsList.length} tools | SHA-256 verificado (${expectedSha.slice(0, 12)}...)`);
    }
  }

  // 2. PCL Laya System One MCP (FastMCP Python)
  const layaScript = path.join(WORKSPACE_ROOT, 'services', 'pcl-laya', 'src', 'mcp_server.py');
  const layaModel = path.join(WORKSPACE_ROOT, 'services', 'pcl-laya', 'models', 'nli-minilm', 'model.onnx');
  if (!fs.existsSync(layaScript)) {
    console.error(`[FAIL] mcp-pcl-laya script ausente em ${layaScript}`);
    hasHardFailure = true;
  } else {
    const layaRes = await runMcpStdioTest({
      name: 'mcp-pcl-laya',
      command: 'python',
      args: [layaScript],
      callTool: 'laya_health',
      callArgs: {}
    });

    if (!layaRes.ok) {
      console.error(`[FAIL] mcp-pcl-laya: ${layaRes.error}`);
      hasHardFailure = true;
    } else {
      const layaText = layaRes.toolCallResult?.content?.[0]?.text || '{}';
      console.log(`[PASS] mcp-pcl-laya (${layaRes.latencyMs}ms): ${layaRes.toolsList.length} tools | ONNX asset=${fs.existsSync(layaModel)} | health=${layaText.replace(/\s+/g, ' ').slice(0, 180)}`);
    }
  }

  // 3. External MCP prereq transparency
  const ghToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || process.env.GITHUB_TOKEN;
  if (ghToken) {
    console.log('[PASS] mcp-github: GITHUB_PERSONAL_ACCESS_TOKEN detectado no ambiente.');
  } else {
    console.log('[WARN] mcp-github: GITHUB_PERSONAL_ACCESS_TOKEN ausente no .env (esperado enquanto integração externa não for habilitada).');
  }

  if (hasHardFailure) {
    process.exit(1);
  }
  console.log('=== Suite 3 Concluída com Sucesso ===');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
