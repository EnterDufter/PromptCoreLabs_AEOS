/**
 * PCL AEOS — Daemon HTTP Autônomo do PCL Cockpit (Marco M0 — Standalone Production Server)
 * Serve todas as rotas `/api/aeos/*` e os assets estáticos compilados em `dist/` sem depender do Vite Dev Server.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createAeosBackendMiddleware, DASHBOARD_ROOT, ensureCockpitPostgresSchema } from './aeosBackendApp';

const PORT = parseInt(process.env.AEOS_SERVER_PORT || process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.join(DASHBOARD_ROOT, 'dist');

const MIME_MAP: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const aeosMiddleware = createAeosBackendMiddleware();

export function createStandaloneHttpServer(): http.Server {
  return http.createServer(async (req, res) => {
    const urlPath = (req.url || '/').split('?')[0];

    // 1. Rotas da API Soberana (/api/aeos/*)
    if ((req.url || '').startsWith('/api/aeos/')) {
      await aeosMiddleware(req, res, () => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, error: `Rota AEOS não encontrada: ${req.url}` }));
      });
      return;
    }

    // 2. Servir bundle estático compilado de dist/ (Produção / VPS)
    if (fs.existsSync(DIST_DIR)) {
      const safeRel = path.normalize(urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, ''));
      let candidate = path.join(DIST_DIR, safeRel);
      if (!candidate.startsWith(DIST_DIR) || !fs.existsSync(candidate) || fs.statSync(candidate).isDirectory()) {
        candidate = path.join(DIST_DIR, 'index.html');
      }
      if (fs.existsSync(candidate)) {
        const ext = path.extname(candidate).toLowerCase();
        res.statusCode = 200;
        res.setHeader('Content-Type', MIME_MAP[ext] || 'application/octet-stream');
        fs.createReadStream(candidate).pipe(res);
        return;
      }
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: 'Recurso não encontrado.' }));
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  ensureCockpitPostgresSchema().finally(() => {
    const srv = createStandaloneHttpServer();
    srv.listen(PORT, HOST, () => {
      console.log(`[PCL AEOS Server M0] Servidor autônomo escutando em http://${HOST}:${PORT}`);
    });
  });
}
