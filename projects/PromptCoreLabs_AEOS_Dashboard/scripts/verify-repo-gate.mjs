import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DASHBOARD_ROOT = path.resolve(__dirname, '..');
const WORKSPACE_ROOT = path.resolve(DASHBOARD_ROOT, '../..');

const EXCLUDED_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  '.vite-aeos',
  'test-results',
  'playwright-report',
  'coverage',
  '.venv',
  '__pycache__',
  'models',
  'vault'
]);

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.py',
  '.md',
  '.html',
  '.css',
  '.json',
  '.sql',
  '.yml',
  '.yaml',
  '.sh'
]);

const FORBIDDEN_NAMES_RE = new RegExp(`\\b(Fer${'nando'}|Mar${'celo'})\\b`, 'i');
const MOJIBAKE_RE = /(?:Ã¡|Ã©|Ã­|Ã³|Ãº|Ã§|Ã£|Ãµ|Ãª|Ã´|Ã€|Ã‰|â€”|â€“|â€œ|â€)/;
const LITERAL_ENC_V1_RE = new RegExp(`enc:${'v1'}:[A-Za-z0-9+/=]{16,}`);
const HARDCODED_FALLBACK_HEX_RE = new RegExp(`0f42bb4${'a78'}[a-f0-9]{10,}`, 'i');
const LIVE_TOKEN_RE = /(?:sk-[A-Za-z0-9_-]{24,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AIzaSy[A-Za-z0-9_-]{25,})/;

function walkFiles(dir, collector = []) {
  if (!fs.existsSync(dir)) return collector;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, collector);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (TEXT_EXTENSIONS.has(ext) && entry.name !== 'package-lock.json') {
        collector.push(fullPath);
      }
    }
  }
  return collector;
}

function main() {
  console.log('=== Suite 5: Repo Security, Hygiene & VPS Readiness Gate ===');
  const failures = [];
  const warnings = [];

  // 1. Critical runtime/VPS assets existence
  const criticalFiles = [
    path.join(WORKSPACE_ROOT, 'services', 'pcl-laya', 'src', 'mcp_server.py'),
    path.join(WORKSPACE_ROOT, 'services', 'pcl-laya', 'models', 'nli-minilm', 'model.onnx'),
    path.join(DASHBOARD_ROOT, 'scripts', 'pcl-sovereign-mcp-server.mjs'),
    path.join(WORKSPACE_ROOT, 'scripts', 'database', 'migrations', '002_create_cockpit_artifacts_schema.sql')
  ];

  for (const file of criticalFiles) {
    if (!fs.existsSync(file)) {
      failures.push(`Ativo crítico ausente: ${path.relative(WORKSPACE_ROOT, file)}`);
    } else {
      console.log(`[PASS] Asset presente: ${path.relative(WORKSPACE_ROOT, file)}`);
    }
  }

  // 2. PaperClip-Companies physical inventory check
  const paperClipCompanyDir = path.join(WORKSPACE_ROOT, 'PaperClip-Companies', 'promptcore-labs');
  if (!fs.existsSync(paperClipCompanyDir)) {
    failures.push('Diretório PaperClip-Companies/promptcore-labs ausente no workspace.');
  } else {
    const nestedCount = walkFiles(paperClipCompanyDir).length;
    if (nestedCount === 0) {
      failures.push('PaperClip-Companies/promptcore-labs não contém arquivos versionáveis.');
    } else {
      console.log(`[PASS] PaperClip-Companies inventariado (${nestedCount} arquivos de texto/config).`);
    }
  }

  // 3. Anti-regression guards in Dashboard security-sensitive files
  const viteConfigContent = fs.readFileSync(path.join(DASHBOARD_ROOT, 'vite.config.ts'), 'utf8');
  if (LITERAL_ENC_V1_RE.test(viteConfigContent) || HARDCODED_FALLBACK_HEX_RE.test(viteConfigContent)) {
    failures.push('vite.config.ts voltou a conter literal enc:v1: ou chave hexadecimal hardcoded.');
  }
  if (viteConfigContent.includes('142 * 1024 * 1024')) {
    failures.push('vite.config.ts voltou a conter piso fictício de 142 * 1024 * 1024 bytes.');
  }

  const integrationsContent = fs.readFileSync(
    path.join(DASHBOARD_ROOT, 'src', 'components', 'admin', 'IntegrationsLibrary.tsx'),
    'utf8'
  );
  if (!integrationsContent.includes('sessionConnectorSecrets') || !integrationsContent.includes('_masked')) {
    failures.push('IntegrationsLibrary.tsx não possui guarda sessionConnectorSecrets/_masked contra vazamento em localStorage.');
  }

  // 4. Scan active codebase & docs across workspace
  const scanRoots = [
    path.join(DASHBOARD_ROOT, 'src'),
    path.join(DASHBOARD_ROOT, 'scripts'),
    path.join(DASHBOARD_ROOT, 'tests'),
    path.join(DASHBOARD_ROOT, 'vite.config.ts'),
    path.join(WORKSPACE_ROOT, 'knowledge'),
    path.join(WORKSPACE_ROOT, 'docs'),
    path.join(WORKSPACE_ROOT, 'services')
  ];

  const scannedFiles = [];
  for (const root of scanRoots) {
    if (!fs.existsSync(root)) continue;
    const stat = fs.statSync(root);
    if (stat.isFile()) scannedFiles.push(root);
    else walkFiles(root, scannedFiles);
  }

  for (const filePath of scannedFiles) {
    const rel = path.relative(WORKSPACE_ROOT, filePath).replace(/\\/g, '/');
    if (filePath === __filename) continue;

    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.split(/\r?\n/);

    lines.forEach((line, idx) => {
      const lineRef = `${rel}:${idx + 1}`;
      if (FORBIDDEN_NAMES_RE.test(line)) {
        failures.push(`Nome confidencial restrito encontrado em ${lineRef}`);
      }
      if (LITERAL_ENC_V1_RE.test(line) && !rel.includes('tests/')) {
        failures.push(`Possível ciphertext literal enc:v1 em ${lineRef}`);
      }
      if (HARDCODED_FALLBACK_HEX_RE.test(line) && !rel.includes('tests/')) {
        failures.push(`Chave fallback hardcoded encontrada em ${lineRef}`);
      }
      if (LIVE_TOKEN_RE.test(line)) {
        failures.push(`Possível token/API key literal encontrada em ${lineRef}`);
      }
      if (MOJIBAKE_RE.test(line) && !rel.includes('verify-repo-gate.mjs')) {
        warnings.push(`Possível Mojibake UTF-8 detectado em ${lineRef}`);
      }
    });
  }

  // Check Root/Project UTF-8 clean HTML specs if present
  const livingArchDir = path.join(WORKSPACE_ROOT, 'projects');
  if (fs.existsSync(livingArchDir)) {
    for (const entry of fs.readdirSync(livingArchDir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name === 'PromptCoreLabs_AEOS_Dashboard') continue;
      for (const htmlOrMd of walkFiles(path.join(livingArchDir, entry.name))) {
        const rel = path.relative(WORKSPACE_ROOT, htmlOrMd).replace(/\\/g, '/');
        const content = fs.readFileSync(htmlOrMd, 'utf8');
        if (FORBIDDEN_NAMES_RE.test(content)) {
          failures.push(`Nome confidencial restrito em ${rel}`);
        }
      }
    }
  }

  console.log(`[INFO] Arquivos auditados: ${scannedFiles.length}`);
  if (warnings.length > 0) {
    console.warn(`[WARN] ${warnings.length} avisos de Mojibake encontrados (primeiros 10):`);
    warnings.slice(0, 10).forEach((w) => console.warn(`  - ${w}`));
  }

  if (failures.length > 0) {
    console.error(`[FAIL] ${failures.length} violações no Repo Gate:`);
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }

  console.log('=== Suite 5 Concluída com Sucesso (0 violações) ===');
}

main();
