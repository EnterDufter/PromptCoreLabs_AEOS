import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'node:os';
import path from 'node:path';
import {
  createAeosBackendMiddleware,
  omnirouteEndpoint,
  ollamaEndpoint,
  layaEndpoint
} from './server/aeosBackendApp';

/**
 * Ponte enxuta do Marco M0: delega todas as rotas `/api/aeos/*` ao servidor desacoplado
 * em `server/aeosBackendApp.ts`, preservando 100% da porta `:3001` e dos testes de integração.
 */
function pclAeosBackendPlugin(): Plugin {
  const middleware = createAeosBackendMiddleware();
  return {
    name: 'pcl-aeos-backend-middleware',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}

const cockpitPort = parseInt(process.env.COCKPIT_PORT || '3001', 10);

const apiProxyConfig = {
  '/api/omniroute': {
    target: omnirouteEndpoint.enabled ? omnirouteEndpoint.url : 'http://127.0.0.1:20130',
    changeOrigin: true,
    rewrite: (p: string) => p.replace(/^\/api\/omniroute/, '')
  },
  '/api/ollama': {
    target: ollamaEndpoint.enabled ? ollamaEndpoint.url : 'http://127.0.0.1:11434',
    changeOrigin: true,
    rewrite: (p: string) => p.replace(/^\/api\/ollama/, '')
  },
  '/api/laya': {
    target: layaEndpoint.enabled ? layaEndpoint.url : 'http://127.0.0.1:20140',
    changeOrigin: true,
    rewrite: (p: string) => p.replace(/^\/api\/laya/, '')
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  cacheDir: process.env.VITE_CACHE_DIR || path.join(os.tmpdir(), 'pcl-cockpit-vite-cache'),
  plugins: [react(), pclAeosBackendPlugin()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-mermaid': ['mermaid', 'markmap-lib', 'markmap-view'],
          'vendor-charts': ['echarts', '@antv/infographic'],
          'vendor-deck': ['reveal.js', 'pptxgenjs'],
          'vendor-docs': ['pdfjs-dist', 'mammoth', 'xlsx', '@orama/orama'],
          'vendor-table': ['@tanstack/react-table']
        }
      }
    }
  },
  server: {
    port: cockpitPort,
    host: true,
    proxy: apiProxyConfig
  },
  preview: {
    port: cockpitPort,
    host: true,
    proxy: apiProxyConfig
  }
});
