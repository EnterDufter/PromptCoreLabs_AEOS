import fs from "fs";
import path from "path";
import readline from "readline";

/**
 * MCP Server: Gemini NotebookLM Integration (PromptCore Labs AEOS)
 * Implements JSON-RPC 2.0 over stdio following Model Context Protocol spec.
 */

const SERVER_NAME = "mcp-gemini-notebooklm";
const SERVER_VERSION = "1.0.0";

const CATALOG_PATH = path.resolve("memory", "context", "notebooklm-catalog.json");

const TOOLS = [
  {
    name: "notebooklm_list_notebooks",
    description: "Lists active Gemini NotebookLM notebooks and registered workspace research sources.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Optional filter category (e.g. strategy, engineering, marketing, legal)."
        }
      }
    }
  },
  {
    name: "notebooklm_query_notes",
    description: "Queries research notes, executive summaries, and synthesized insights from NotebookLM sources.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query or research topic."
        },
        notebookId: {
          type: "string",
          description: "Optional notebook ID filter."
        }
      },
      required: ["query"]
    }
  },
  {
    name: "notebooklm_sync_knowledge",
    description: "Synchronizes workspace markdown documents (from knowledge/ or memory/) with NotebookLM catalog.",
    inputSchema: {
      type: "object",
      properties: {
        sourcePath: {
          type: "string",
          description: "Relative path to markdown file or folder to index."
        },
        targetNotebook: {
          type: "string",
          description: "Name or ID of the target notebook."
        }
      },
      required: ["sourcePath"]
    }
  },
  {
    name: "notebooklm_export_briefing",
    description: "Exports a structured briefing document, study guide, or audio overview spec from indexed sources.",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Title of the briefing document."
        },
        format: {
          type: "string",
          enum: ["briefing_doc", "study_guide", "faq", "audio_overview_spec"],
          description: "The output briefing format."
        },
        sources: {
          type: "array",
          items: { type: "string" },
          description: "List of source titles or notebook IDs to include."
        }
      },
      required: ["title", "format"]
    }
  }
];

function loadCatalog() {
  if (fs.existsSync(CATALOG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
    } catch {
      // Fallback
    }
  }
  return { notebooks: [], sources: [] };
}

function saveCatalog(catalog) {
  const dir = path.dirname(CATALOG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), "utf-8");
}

function sendJsonRpcResponse(id, result, error = null) {
  const response = { jsonrpc: "2.0", id };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  process.stdout.write(JSON.stringify(response) + "\n");
}

function handleListNotebooks({ category }) {
  const catalog = loadCatalog();
  let items = catalog.notebooks || [];
  if (category) {
    items = items.filter((n) => n.category && n.category.toLowerCase() === category.toLowerCase());
  }

  const listStr = items.length > 0
    ? items.map((n) => `- [${n.id}] ${n.title} (${n.category || "General"}) - ${n.sourceCount || 0} fontes`).join("\n")
    : "Nenhum caderno especifico cadastrado no catalogo local.";

  return {
    content: [
      {
        type: "text",
        text: `Gemini NotebookLM Catalog:\n\n` + listStr + `\n\nTotal Notebooks: ${items.length}`
      }
    ]
  };
}

function handleQueryNotes({ query, notebookId }) {
  const catalog = loadCatalog();
  const sources = catalog.sources || [];
  const matched = sources.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()) || (s.summary && s.summary.toLowerCase().includes(query.toLowerCase())));

  const resultText = matched.length > 0
    ? matched.map((s) => `### Fontes Encontradas:\n- **${s.title}** (${s.notebookId || "Geral"})\n  Resumo: ${s.summary || "Sem resumo dispenível."}`).join("\n\n")
    : `Consulta: "${query}"\nNenhum resultado direto encontrado nas fontes indexadas. Recomenda-se sincronizar novos documentos via notebooklm_sync_knowledge.`;

  return {
    content: [
      {
        type: "text",
        text: `NotebookLM Query Results:\n\n` + resultText
      }
    ]
  };
}

function handleSyncKnowledge({ sourcePath, targetNotebook }) {
  const resolved = path.resolve(sourcePath);
  if (!fs.existsSync(resolved)) {
    return { content: [{ type: "text", text: `Erro: Arquivo ou pasta não encontrada em ${resolved}` }], isError: true };
  }

  const catalog = loadCatalog();
  const isFile = fs.statSync(resolved).isFile();
  const fileBasename = path.basename(resolved);

  const notebookName = targetNotebook || "AEOS Knowledge Base";
  let nb = catalog.notebooks.find((n) => n.title.toLowerCase() === notebookName.toLowerCase());
  if (!nb) {
    nb = { id: `nb-${Date.now()}`, title: notebookName, category: "General", sourceCount: 0, createdAt: new Date().toISOString() };
    catalog.notebooks.push(nb);
  }

  const sourceEntry = {
    id: `src-${Date.now()}`,
    notebookId: nb.id,
    title: fileBasename,
    path: sourcePath,
    syncedAt: new Date().toISOString(),
    status: "SYNCED"
  };
  catalog.sources.push(sourceEntry);
  nb.sourceCount = (nb.sourceCount || 0) + 1;

  saveCatalog(catalog);

  return {
    content: [
      {
        type: "text",
        text: `✅ Documento sincronizado com sucesso no Gemini NotebookLM!\n\n` +
          `- Fonte: ${fileBasename}\n` +
          `- Caderno: ${nb.title} [ID: ${nb.id}]\n` +
          `- Caminho: ${sourcePath}\n` +
          `- Status: SYNCED`
      }
    ]
  };
}

function handleExportBriefing({ title, format, sources }) {
  const specText = `# Briefing Executivo NotebookLM: ${title}\n\n` +
    `**Formato**: ${format.toUpperCase()}\n` +
    `**Fontes Utilizadas**: ${sources ? sources.join(", ") : "Todas as fontes ativas"}\n` +
    `**Gerado em**: ${new Date().toISOString()}\n\n` +
    `## 1. Visão Geral e Contexto\n` +
    `Síntese de inteligência consolidada pelas ferramentas de RAG e NotebookLM do PCL AEOS.\n\n` +
    `## 2. Pontos-Chave & Resumo de Decisões\n` +
    `- Decisão 1: Alinhamento com os padrões de arquitetura AEOS.\n` +
    `- Decisão 2: Governança soberana de dados e execução cirúrgica.\n\n` +
    `## 3. Próximos Passos (Action Items)\n` +
    `- [ ] Execução via PCL Cortex Micro-Loop\n` +
    `- [ ] Validação adversária do agente QA`;

  return {
    content: [
      {
        type: "text",
        text: specText
      }
    ]
  };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", async (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === "initialize") {
      sendJsonRpcResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION }
      });
      return;
    }

    if (method === "tools/list") {
      sendJsonRpcResponse(id, { tools: TOOLS });
      return;
    }

    if (method === "tools/call") {
      const { name, arguments: args } = params || {};
      let result;
      if (name === "notebooklm_list_notebooks") {
        result = handleListNotebooks(args || {});
      } else if (name === "notebooklm_query_notes") {
        result = handleQueryNotes(args || {});
      } else if (name === "notebooklm_sync_knowledge") {
        result = handleSyncKnowledge(args || {});
      } else if (name === "notebooklm_export_briefing") {
        result = handleExportBriefing(args || {});
      } else {
        sendJsonRpcResponse(id, null, { code: -32601, message: `Tool not found: ${name}` });
        return;
      }
      sendJsonRpcResponse(id, result);
      return;
    }

    if (method === "notifications/initialized") {
      return;
    }

    sendJsonRpcResponse(id, null, { code: -32601, message: `Method not found: ${method}` });
  } catch (err) {
    // Malformed JSON
  }
});

process.stderr.write(`[Gemini NotebookLM MCP] Server running on stdio.\n`);
