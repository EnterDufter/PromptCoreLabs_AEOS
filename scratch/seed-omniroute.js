import Database from 'better-sqlite3';

const db = new Database('/var/lib/omniroute/storage.sqlite');
const now = new Date().toISOString();

console.log("⚙️ Iniciando Seeding do Banco OmniRoute...");

try {
  const runSeeder = db.transaction(() => {
    // 1. Inserir a Chave de API de acesso principal (se não existir)
    db.prepare(`
      INSERT OR REPLACE INTO api_keys (id, name, key, allowed_models, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'key-aeos-default', 
      'AEOS Default Key', 
      'omniroute-api-key-2026', 
      '[]', 
      now
    );

    // 2. Cadastrar os Nós Locais (Ollama e LM Studio)
    db.prepare(`
      INSERT OR REPLACE INTO provider_nodes (id, type, name, prefix, api_type, base_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'oac-chat-ollama', 
      'openai-compatible', 
      'Ollama Local', 
      'ollama', 
      'chat', 
      'http://host.docker.internal:11434/v1', 
      now, 
      now
    );

    db.prepare(`
      INSERT OR REPLACE INTO provider_nodes (id, type, name, prefix, api_type, base_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'oac-chat-lmstudio', 
      'openai-compatible', 
      'LM Studio', 
      'lm-studio', 
      'chat', 
      'http://host.docker.internal:1234/v1', 
      now, 
      now
    );

    // 3. Cadastrar as conexões Cloud bases (com chaves placeholders)
    db.prepare(`
      INSERT OR IGNORE INTO provider_connections (id, provider, auth_type, name, is_active, api_key, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'pc-gemini-cloud', 
      'gemini', 
      'apikey', 
      'Gemini AI Studio', 
      1, 
      'PLACEHOLDER_INSIRA_SUA_CHAVE_AQUI', 
      now, 
      now
    );

    db.prepare(`
      INSERT OR IGNORE INTO provider_connections (id, provider, auth_type, name, is_active, api_key, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'pc-anthropic-cloud', 
      'anthropic', 
      'apikey', 
      'Anthropic API', 
      1, 
      'PLACEHOLDER_INSIRA_SUA_CHAVE_AQUI', 
      now, 
      now
    );

    // 4. Configurar o Combo de Roteamento aeos-coding-fallback
    const comboPayload = {
      id: 'combo-aeos-default',
      name: 'aeos-coding-fallback',
      models: [
        'gemini/gemini-2.5-flash',
        'lm-studio/qwen3-coder-30b',
        'ollama/gemma3:4b'
      ],
      strategy: 'priority',
      config: {
        maxRetries: 3,
        retryDelayMs: 1000,
        timeoutMs: 25000,
        healthCheckEnabled: true
      },
      createdAt: now,
      updatedAt: now
    };

    db.prepare(`
      INSERT OR REPLACE INTO combos (id, name, data, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      comboPayload.id, 
      comboPayload.name, 
      JSON.stringify(comboPayload), 
      now, 
      now
    );
  });

  runSeeder();
  console.log("✅ Seeding concluído com sucesso no banco SQLite!");
} catch (error) {
  console.error("❌ Erro durante o seeding:", error);
  process.exit(1);
}
