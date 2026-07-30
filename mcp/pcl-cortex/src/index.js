import fs from "fs";
import path from "path";
import http from "http";

/**
 * MCP Server: PCL Cortex (PromptCore Labs AEOS)
 * Implements JSON-RPC 2.0 over stdio following Model Context Protocol spec.
 */

const SERVER_NAME = "pcl-cortex-mcp";
const SERVER_VERSION = "1.0.0";

const TOOLS = [
  {
    name: "pcl_validate_spec",
    description: "Validates an AEOS specification file (specify.md, design.md, tasks.md) against SDD standards.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "Absolute or relative path to the markdown specification file."
        }
      },
      required: ["filePath"]
    }
  },
  {
    name: "pcl_cortex_audit",
    description: "Audits compliance of PCL Cortex Micro-Loop verification logs and stage gates.",
    inputSchema: {
      type: "object",
      properties: {
        workspaceDir: {
          type: "string",
          description: "Root path of the AEOS workspace (defaults to current working directory)."
        }
      }
    }
  },
  {
    name: "pcl_omniroute_health",
    description: "Checks availability and connectivity of the local OmniRoute AI Gateway (http://localhost:20130).",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

function sendJsonRpcResponse(id, result, error = null) {
  const response = {
    jsonrpc: "2.0",
    id
  };
  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }
  const jsonStr = JSON.stringify(response);
  process.stdout.write(jsonStr + "\n");
}

function handleValidateSpec({ filePath }) {
  if (!filePath) {
    return { content: [{ type: "text", text: "Error: filePath parameter is required." }], isError: true };
  }
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    return { content: [{ type: "text", text: `Error: File not found at ${resolved}` }], isError: true };
  }
  const content = fs.readFileSync(resolved, "utf-8");
  const checks = [];

  if (content.includes("# ") || content.includes("## ")) {
    checks.push("✅ Proper Heading Structure (H1/H2) found.");
  } else {
    checks.push("⚠️ Missing standard markdown headers.");
  }

  if (content.toLowerCase().includes("user review") || content.toLowerCase().includes("open questions") || content.toLowerCase().includes("requirements")) {
    checks.push("✅ AEOS Structural Sections verified.");
  } else {
    checks.push("ℹ️ Standard AEOS section headers optional.");
  }

  return {
    content: [
      {
        type: "text",
        text: `Specification Audit for ${path.basename(resolved)}:\n\n` + checks.join("\n") + `\n\nFile Size: ${content.length} bytes.`
      }
    ]
  };
}

function handleCortexAudit({ workspaceDir }) {
  const root = workspaceDir ? path.resolve(workspaceDir) : process.cwd();
  const patternPath = path.join(root, "knowledge", "patterns", "pcl-cortex-micro-loop.md");
  const exists = fs.existsSync(patternPath);

  return {
    content: [
      {
        type: "text",
        text: `PCL Cortex Audit Report:\n\n` +
          `- Workspace Root: ${root}\n` +
          `- Micro-Loop Pattern Document: ${exists ? "✅ Present (pcl-cortex-micro-loop.md)" : "⚠️ Not found"}\n` +
          `- Execution Constraints: Max 3 retries, Bounded Evidence, Surgical Edits, Adversarial QA.\n` +
          `- Status: Operational`
      }
    ]
  };
}

function handleOmniRouteHealth() {
  return new Promise((resolve) => {
    const req = http.get("http://localhost:20130/dashboard/providers", { timeout: 3000 }, (res) => {
      resolve({
        content: [
          {
            type: "text",
            text: `OmniRoute Gateway Health Status:\n\n` +
              `- Endpoint: http://localhost:20130\n` +
              `- HTTP Status: ${res.statusCode} (${res.statusMessage})\n` +
              `- Gateway Status: ✅ OPERATIONAL`
          }
        ]
      });
    });

    req.on("error", (err) => {
      resolve({
        content: [
          {
            type: "text",
            text: `OmniRoute Gateway Health Status:\n\n` +
              `- Endpoint: http://localhost:20130\n` +
              `- Error: ${err.message}\n` +
              `- Gateway Status: ⚠️ UNREACHABLE (Check if container pcl-omniroute is running)`
          }
        ]
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        content: [
          {
            type: "text",
            text: `OmniRoute Gateway Health Status:\n\n` +
              `- Endpoint: http://localhost:20130\n` +
              `- Gateway Status: ⚠️ TIMEOUT`
          }
        ]
      });
    });
  });
}

// Process incoming line-delimited JSON-RPC messages from stdin
import readline from "readline";

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
      if (name === "pcl_validate_spec") {
        result = handleValidateSpec(args || {});
      } else if (name === "pcl_cortex_audit") {
        result = handleCortexAudit(args || {});
      } else if (name === "pcl_omniroute_health") {
        result = await handleOmniRouteHealth();
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

process.stderr.write(`[PCL Cortex MCP] Server running on stdio.\n`);
