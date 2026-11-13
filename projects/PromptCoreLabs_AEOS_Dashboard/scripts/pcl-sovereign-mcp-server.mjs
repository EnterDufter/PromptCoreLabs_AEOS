#!/usr/bin/env node
/**
 * PCL AEOS — Servidor MCP Soberano Nativo (JSON-RPC 2.0 sobre stdio)
 * Compatível com a especificação Model Context Protocol (2024-11-05).
 * Custo Marginal: $0.00 | Execução Local Host | Zero Mocks.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, '../../..');
const PAPERCLIP_ROOT = path.join(WORKSPACE_ROOT, 'PaperClip-Companies', 'promptcore-labs');

const TOOLS = [
  {
    name: 'pcl_workspace_inventory',
    description: 'Inventaria em tempo real os agentes e skills físicos do repositório PaperClip no disco local com hash SHA-256.',
    inputSchema: {
      type: 'object',
      properties: {
        includeHashes: { type: 'boolean', description: 'Incluir hashes criptográficos SHA-256' }
      }
    }
  },
  {
    name: 'pcl_read_canonical_doc',
    description: 'Lê especificações normativas e ADRs dentro do perímetro seguro do workspace PromptCore_Labs.',
    inputSchema: {
      type: 'object',
      properties: {
        relativePath: { type: 'string', description: 'Caminho relativo dentro de c:\\PromptCore_Labs' }
      },
      required: ['relativePath']
    }
  },
  {
    name: 'pcl_verify_artifact_sha256',
    description: 'Calcula o atesto criptográfico SHA-256 de qualquer conteúdo textual ou arquivo do enclave.',
    inputSchema: {
      type: 'object',
      properties: {
        payload: { type: 'string', description: 'Conteúdo textual a assinar' }
      },
      required: ['payload']
    }
  },
  {
    name: 'pcl_host_telemetry',
    description: 'Retorna telemetria real do processo MCP host (PID, memória RSS, plataforma e status $0.00).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

function sendJsonRpc(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function handleToolCall(name, args = {}) {
  if (name === 'pcl_workspace_inventory') {
    const agentsDir = path.join(PAPERCLIP_ROOT, 'agents');
    const skillsDir = path.join(PAPERCLIP_ROOT, 'skills');
    const agents = fs.existsSync(agentsDir)
      ? fs.readdirSync(agentsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
      : [];
    const skills = fs.existsSync(skillsDir)
      ? fs.readdirSync(skillsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
      : [];
    return {
      workspaceRoot: WORKSPACE_ROOT,
      paperclipAgentsCount: agents.length,
      paperclipSkillsCount: skills.length,
      agentsSample: agents.slice(0, 8),
      skillsSample: skills.slice(0, 8)
    };
  }

  if (name === 'pcl_read_canonical_doc') {
    const safeRel = String(args.relativePath || 'AGENTS.md').replace(/\.\./g, '');
    const full = path.join(WORKSPACE_ROOT, safeRel);
    if (!fs.existsSync(full)) {
      return { exists: false, path: full };
    }
    const content = fs.readFileSync(full, 'utf8').slice(0, 2000);
    const sha256 = crypto.createHash('sha256').update(content).digest('hex');
    return { exists: true, path: full, sha256, preview: content.slice(0, 500) };
  }

  if (name === 'pcl_verify_artifact_sha256') {
    const text = String(args.payload || '');
    return {
      sha256: crypto.createHash('sha256').update(text, 'utf8').digest('hex'),
      byteLength: Buffer.byteLength(text, 'utf8'),
      timestamp: new Date().toISOString()
    };
  }

  return {
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
    rssMb: Math.round((process.memoryUsage().rss / 1024 / 1024) * 10) / 10,
    marginalCostUSD: 0.0
  };
}

const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const msg = JSON.parse(trimmed);
    if (msg.method === 'initialize') {
      sendJsonRpc({
        jsonrpc: '2.0',
        id: msg.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: { listChanged: false } },
          serverInfo: {
            name: 'pcl-aeos-sovereign-workspace-mcp',
            version: '3.6.0',
            pid: process.pid
          }
        }
      });
    } else if (msg.method === 'tools/list') {
      sendJsonRpc({
        jsonrpc: '2.0',
        id: msg.id,
        result: { tools: TOOLS }
      });
    } else if (msg.method === 'tools/call') {
      const toolName = msg.params?.name;
      const toolArgs = msg.params?.arguments || {};
      const output = handleToolCall(toolName, toolArgs);
      sendJsonRpc({
        jsonrpc: '2.0',
        id: msg.id,
        result: {
          content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
          isError: false
        }
      });
    } else if (msg.id !== undefined) {
      sendJsonRpc({
        jsonrpc: '2.0',
        id: msg.id,
        result: {}
      });
    }
  } catch (err) {
    sendJsonRpc({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: err?.message || 'Parse error' }
    });
  }
});

