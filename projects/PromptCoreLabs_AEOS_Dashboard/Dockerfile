# ==============================================================================
# PCL Cockpit (PromptCoreLabs_AEOS_Dashboard) — Multi-stage Production Image
# Serves built assets + /api/aeos/* Vite middleware via `vite preview`
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Skip Playwright browser downloads inside image build
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html tsconfig.json vite.config.ts tailwind.config.js postcss.config.js ./
COPY public ./public
COPY src ./src
COPY server ./server
COPY scripts ./scripts

RUN npm run build

# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
ENV VITE_CACHE_DIR=/tmp/pcl-cockpit-vite-cache
ENV AEOS_WORKSPACE_ROOT=/workspace

# vite.config.ts imports Vite/React plugin and server/aeosBackendApp at startup; keep runtime deps + config
COPY --from=builder /app/package.json /app/vite.config.ts /app/index.html ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

RUN mkdir -p /workspace/data/cockpit-vault /tmp/pcl-cockpit-vite-cache \
    && chown -R node:node /app /workspace /tmp/pcl-cockpit-vite-cache

USER node

EXPOSE 3001

HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3001/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npm", "run", "preview", "--", "--port", "3001", "--host", "0.0.0.0"]

