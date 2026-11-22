"""
PCL AEOS — Gerador dos 4 Subgrafos Modulares e Visualizador Interativo graph.html
Conformidade: SPEC-PCL-AEOS-CODEGRAPH-04 (PoC Local Graphify / PCL Code Graph Port)
Execução: 100% Determinística (--no-llm / AST em CPU) | 0 MB VRAM | $0.00 | UTF-8 Puro
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List

current_dir = Path(__file__).resolve().parent
src_dir = current_dir.parent / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from engine import CANONICAL_MODULES, PCLCodeGraphEngine


def build_interactive_html(
    workspace_root: Path,
    subgraphs_data: Dict[str, Dict[str, Any]]
) -> str:
    """
    Constrói o mapa visual interativo graph.html autocontido (Modo Claro Executivo + Canvas Dark Interativo de Grafo)
    com os 4 subgrafos, Top 5 God Nodes por módulo e auditoria real de economia de tokens.
    """
    # Prepara um payload compacto para o visualizador interativo de grafo (Top 45 nós mais conectados + arestas entre eles por módulo)
    viz_payload: Dict[str, Any] = {}
    total_files_all = 0
    total_lines_all = 0
    total_nodes_all = 0
    total_edges_all = 0
    total_brute_tokens = 0
    total_graph_tokens = 0

    for mod_key, g in subgraphs_data.items():
        m = g["metrics"]
        total_files_all += m["files_count"]
        total_lines_all += m["total_lines"]
        total_nodes_all += m["nodes_count"]
        total_edges_all += m["edges_count"]
        total_brute_tokens += m["brute_force_orientation_tokens"]
        total_graph_tokens += m["graphify_subgraph_tokens"]

        sorted_nodes = sorted(
            g["nodes"],
            key=lambda x: (x.get("god_score", 0), x.get("total_degree", 0)),
            reverse=True
        )
        top_viz_nodes = sorted_nodes[:42]
        top_ids = {n["id"] for n in top_viz_nodes}

        # Inclui vizinhos diretos dos Top 5 God Nodes para garantir conectividade visual rica
        god_ids = {gn["id"] for gn in g["top_god_nodes"]}
        for e in g["edges"]:
            if e["source"] in god_ids and len(top_ids) < 56:
                top_ids.add(e["target"])
            elif e["target"] in god_ids and len(top_ids) < 56:
                top_ids.add(e["source"])

        node_lookup = {n["id"]: n for n in g["nodes"]}
        final_viz_nodes = [
            {
                "id": nid,
                "label": node_lookup[nid]["label"],
                "type": node_lookup[nid]["type"],
                "file": node_lookup[nid].get("file", ""),
                "lines": f"L{node_lookup[nid].get('line_start', 1)}-L{node_lookup[nid].get('line_end', 1)}",
                "in_degree": node_lookup[nid].get("in_degree", 0),
                "out_degree": node_lookup[nid].get("out_degree", 0),
                "total_degree": node_lookup[nid].get("total_degree", 0),
                "god_score": node_lookup[nid].get("god_score", 0),
                "tokens_est": node_lookup[nid].get("tokens_est", 0),
                "is_god": nid in god_ids
            }
            for nid in top_ids if nid in node_lookup
        ]
        final_viz_edges = [
            {
                "source": e["source"],
                "target": e["target"],
                "relation": e["relation"],
                "line": e.get("line", 1)
            }
            for e in g["edges"]
            if e["source"] in top_ids and e["target"] in top_ids
        ]

        viz_payload[mod_key] = {
            "title": g["title"],
            "description": g["description"],
            "root_path": g["root_path"],
            "git_commit_sha": g["git_commit_sha"],
            "graph_sha256": g["graph_sha256"][:16],
            "latency_ms": g["hardware_invariants"]["indexing_latency_ms"],
            "metrics": m,
            "top_god_nodes": g["top_god_nodes"],
            "viz_nodes": final_viz_nodes,
            "viz_edges": final_viz_edges[:140]
        }

    global_savings_pct = round(
        (1.0 - (total_graph_tokens / max(1, total_brute_tokens))) * 100.0, 1
    )

    # Monta linhas da Tabela Resumo dos 4 Subgrafos
    summary_rows_html = []
    for mod_key in ["cockpit", "laya", "omniroute", "paperclip"]:
        g = subgraphs_data[mod_key]
        m = g["metrics"]
        summary_rows_html.append(f"""
          <tr>
            <td><strong>{mod_key}-graph.json</strong><br/><span style="color:#64748b;font-size:11px;">{g['root_path']}</span></td>
            <td>{m['files_count']:,} arqs<br/><span style="color:#64748b;font-size:11px;">{m['total_lines']:,} linhas</span></td>
            <td><strong>{m['nodes_count']:,}</strong> nós</td>
            <td><strong>{m['edges_count']:,}</strong> arestas</td>
            <td>{m['brute_force_orientation_tokens']:,} tok</td>
            <td><strong style="color:#15803d;">{m['graphify_subgraph_tokens']:,} tok</strong></td>
            <td><span class="tag tag-success">-{m['token_reduction_pct']}% tokens</span></td>
          </tr>
        """)

    # Monta cartões dos Top 5 God Nodes por Subgrafo
    god_cards_html = []
    for mod_key in ["cockpit", "laya", "omniroute", "paperclip"]:
        g = subgraphs_data[mod_key]
        rows = []
        for gn in g["top_god_nodes"]:
            rows.append(f"""
              <tr>
                <td><strong>#{gn['rank']}</strong></td>
                <td><code>{gn['label']}</code><br/><span style="color:#64748b;font-size:10.5px;">{gn['file']}</span></td>
                <td><span class="tag tag-primary">{gn['type']}</span></td>
                <td>In: <strong>{gn['in_degree']}</strong> | Out: <strong>{gn['out_degree']}</strong><br/>Total: <strong>{gn['total_degree']}</strong></td>
                <td><strong>{gn['god_score']}</strong></td>
              </tr>
            """)
        god_cards_html.append(f"""
          <div class="milestone-card avoid-break">
            <div class="milestone-header">
              <div class="milestone-title">{g['title']} — Top 5 God Nodes (<code>{mod_key}-graph.json</code>)</div>
              <span class="milestone-tag">SHA-256: {g['graph_sha256'][:12]}...</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width:7%;">Rank</th>
                  <th style="width:43%;">Nó / Caminho Canônico</th>
                  <th style="width:16%;">Tipo AST</th>
                  <th style="width:20%;">Conexões (Grau)</th>
                  <th style="width:14%;">God Score</th>
                </tr>
              </thead>
              <tbody>
                {''.join(rows)}
              </tbody>
            </table>
          </div>
        """)

    embedded_json = json.dumps(viz_payload, ensure_ascii=False)

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PCL AEOS CodeGraph Visualizer — PoC Local Graphify (SPEC-PCL-AEOS-CODEGRAPH-04)</title>
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    :root {{
      --primary: #0284c7;
      --primary-dark: #0369a1;
      --primary-light: #e0f2fe;
      --slate-950: #020617;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-200: #e2e8f0;
      --slate-100: #f1f5f9;
      --slate-50: #f8fafc;
      --success: #15803d;
      --success-bg: #dcfce7;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--slate-900);
      background: #f8fafc;
      line-height: 1.5;
      font-size: 13.5px;
    }}
    .container {{
      max-width: 1080px;
      margin: 20px auto;
      background: #ffffff;
      padding: 36px 44px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border-radius: 8px;
    }}
    .action-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--slate-900);
      color: #fff;
      padding: 12px 20px;
      border-radius: 6px;
      margin-bottom: 22px;
    }}
    .action-bar .brand {{
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .btn {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      border: none;
      background: #38bdf8;
      color: var(--slate-900);
    }}
    .btn:hover {{ background: #0ea5e9; color: #fff; }}
    .doc-badge {{
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--primary-light);
      color: var(--primary-dark);
      margin-bottom: 8px;
    }}
    h1 {{ font-size: 23px; font-weight: 800; color: var(--slate-900); margin-bottom: 6px; }}
    h2 {{
      font-size: 16.5px;
      font-weight: 700;
      color: var(--slate-900);
      border-bottom: 1.5px solid var(--slate-200);
      padding-bottom: 6px;
      margin: 26px 0 14px 0;
    }}
    .kpi-grid {{
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      margin: 16px 0 22px 0;
    }}
    .kpi-card {{
      background: var(--slate-50);
      border: 1px solid var(--slate-200);
      border-top: 3px solid var(--primary);
      border-radius: 6px;
      padding: 12px 14px;
    }}
    .kpi-card.green {{ border-top-color: #16a34a; background: #f0fdf4; }}
    .kpi-card strong {{
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      color: var(--slate-600);
      margin-bottom: 4px;
    }}
    .kpi-card .val {{
      font-size: 20px;
      font-weight: 800;
      color: var(--slate-900);
    }}
    .kpi-card.green .val {{ color: #15803d; }}
    .kpi-card .sub {{ font-size: 11px; color: var(--slate-600); margin-top: 2px; }}

    /* Palco Interativo do Grafo (graph.html) */
    .graph-stage {{
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 16px;
      color: #f8fafc;
      margin-bottom: 24px;
    }}
    .graph-toolbar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid #1e293b;
    }}
    .tab-group {{ display: flex; gap: 8px; flex-wrap: wrap; }}
    .tab-btn {{
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }}
    .tab-btn.active {{
      background: #0284c7;
      color: #ffffff;
      border-color: #38bdf8;
    }}
    .search-input {{
      background: #0f172a;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      width: 240px;
    }}
    .graph-workspace {{
      display: grid;
      grid-template-columns: 1fr 290px;
      gap: 14px;
      align-items: stretch;
    }}
    .svg-box {{
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 8px;
      height: 440px;
      position: relative;
      overflow: hidden;
    }}
    #graph-svg {{ width: 100%; height: 100%; display: block; cursor: grab; }}
    .inspector-panel {{
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 14px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }}
    .inspector-title {{
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: #38bdf8;
      font-weight: 700;
      margin-bottom: 8px;
    }}
    .legend-bar {{
      display: flex;
      gap: 14px;
      font-size: 11px;
      color: #94a3b8;
      margin-top: 10px;
      flex-wrap: wrap;
    }}
    .dot {{
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
    }}
    table {{ width: 100%; border-collapse: collapse; margin: 12px 0 18px 0; font-size: 12px; }}
    th, td {{ padding: 8px 10px; border: 1px solid var(--slate-200); text-align: left; vertical-align: top; }}
    th {{ background: var(--slate-100); font-weight: 700; font-size: 11px; text-transform: uppercase; }}
    tr:nth-child(even) td {{ background: var(--slate-50); }}
    .tag {{
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10.5px;
      font-weight: 700;
    }}
    .tag-success {{ background: var(--success-bg); color: var(--success); }}
    .tag-primary {{ background: var(--primary-light); color: var(--primary-dark); }}
    .milestone-card {{
      border: 1px solid var(--slate-200);
      border-left: 4px solid var(--primary);
      border-radius: 0 6px 6px 0;
      padding: 14px 16px;
      margin-bottom: 16px;
    }}
    .milestone-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }}
    .milestone-title {{ font-size: 14px; font-weight: 700; }}
    .milestone-tag {{
      font-family: monospace;
      font-size: 11px;
      background: var(--slate-100);
      padding: 2px 8px;
      border-radius: 4px;
    }}
    code {{
      font-family: Consolas, monospace;
      font-size: 11.5px;
      background: var(--slate-100);
      padding: 1px 5px;
      border-radius: 3px;
    }}
    @media print {{
      .no-print {{ display: none !important; }}
      .container {{ box-shadow: none !important; padding: 0 !important; max-width: 100% !important; }}
      .avoid-break {{ break-inside: avoid !important; page-break-inside: avoid !important; }}
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="action-bar no-print">
      <div class="brand">
        <span>PROMPTCORE LABS &bull; PCL AEOS CODEGRAPH PORT (SPEC-PCL-AEOS-CODEGRAPH-04)</span>
      </div>
      <div>
        <button class="btn" onclick="window.print()">Imprimir / Salvar Relatório PDF</button>
      </div>
    </div>

    <div class="doc-badge">Prova de Conceito Local Homologada &bull; Modo Determinístico AST (--no-llm)</div>
    <h1>Mapa Visual de Subgrafos de Código &amp; Auditoria de God Nodes (`graph.html`)</h1>
    <p style="color:var(--slate-600);font-size:13px;">
      Gerado 100% em CPU pelo adaptador hexagonal <code>services/pcl-codegraph</code> com <strong>0 MB de VRAM</strong> e <strong>custo $0.00</strong>, respeitando o manifesto <code>.graphifyignore</code>.
    </p>

    <div class="kpi-grid">
      <div class="kpi-card">
        <strong>Arquivos Indexados</strong>
        <div class="val">{total_files_all:,}</div>
        <div class="sub">{total_lines_all:,} linhas de código</div>
      </div>
      <div class="kpi-card">
        <strong>Total de Nós AST</strong>
        <div class="val">{total_nodes_all:,}</div>
        <div class="sub">4 subgrafos modulares</div>
      </div>
      <div class="kpi-card">
        <strong>Total de Arestas</strong>
        <div class="val">{total_edges_all:,}</div>
        <div class="sub">IMPORTS &bull; DEFINES &bull; CALLS</div>
      </div>
      <div class="kpi-card green">
        <strong>Economia de Tokens</strong>
        <div class="val">-{global_savings_pct}%</div>
        <div class="sub">{total_brute_tokens:,} ➔ {total_graph_tokens:,} tok</div>
      </div>
      <div class="kpi-card">
        <strong>Invariante Hardware</strong>
        <div class="val">0 MB VRAM</div>
        <div class="sub">CPU AST &bull; $0.00 LLM</div>
      </div>
    </div>

    <!-- PALCO INTERATIVO DO GRAFO -->
    <div class="graph-stage">
      <div class="graph-toolbar">
        <div class="tab-group">
          <button class="tab-btn active" onclick="selectModule('cockpit', this)">1. PCL Cockpit (:3001)</button>
          <button class="tab-btn" onclick="selectModule('laya', this)">2. Laya System One (:20140)</button>
          <button class="tab-btn" onclick="selectModule('omniroute', this)">3. OmniRoute (:20130)</button>
          <button class="tab-btn" onclick="selectModule('paperclip', this)">4. PaperClip (:3100)</button>
        </div>
        <input type="text" id="node-search" class="search-input" placeholder="Filtrar nó ou arquivo (ex: Laya, vite)..." oninput="renderGraph()"/>
      </div>

      <div class="graph-workspace">
        <div class="svg-box">
          <svg id="graph-svg" viewBox="0 0 740 440"></svg>
        </div>
        <div class="inspector-panel">
          <div>
            <div class="inspector-title">Inspetor de Nó AST &amp; Blast Radius</div>
            <div id="node-details">
              <p style="color:#cbd5e1;margin-bottom:8px;">Clique em qualquer nó do grafo ao lado para inspecionar seu caminho canônico, linhas, conexões e raio de impacto.</p>
            </div>
          </div>
          <div style="border-top:1px solid #1e293b;padding-top:10px;color:#94a3b8;font-size:11px;">
            <div id="module-meta-box"></div>
          </div>
        </div>
      </div>

      <div class="legend-bar">
        <span><span class="dot" style="background:#f59e0b;"></span><strong>God Node (Top 5 Hub Central)</strong></span>
        <span><span class="dot" style="background:#38bdf8;"></span>Arquivo / Módulo (<code>file</code>)</span>
        <span><span class="dot" style="background:#34d399;"></span>Componente / Classe / Função</span>
        <span><span class="dot" style="background:#c084fc;"></span>Endpoint API / MCP Tool</span>
      </div>
    </div>

    <h2>1. Tabela Consolidada dos 4 Subgrafos Modulares &amp; Economia de Tokens</h2>
    <table>
      <thead>
        <tr>
          <th>Subgrafo JSON</th>
          <th>Arquivos &amp; Linhas</th>
          <th>Total de Nós</th>
          <th>Total de Arestas</th>
          <th>Leitura Bruta (Sem Grafo)</th>
          <th>Subgrafo Cirúrgico (2-Hops)</th>
          <th>Redução Auditada</th>
        </tr>
      </thead>
      <tbody>
        {''.join(summary_rows_html)}
      </tbody>
    </table>

    <h2>2. Top 5 God Nodes Identificados por Subgrafo (Risco de Acoplamento &amp; Centralidade)</h2>
    {''.join(god_cards_html)}
  </div>

  <script>
    const GRAPH_DATA = {embedded_json};
    let currentModule = 'cockpit';

    function selectModule(modKey, btnEl) {{
      currentModule = modKey;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');
      renderGraph();
    }}

    function getNodeColor(n) {{
      if (n.is_god) return '#f59e0b';
      if (n.type === 'file') return '#38bdf8';
      if (n.type === 'api_endpoint' || n.type === 'mcp_tool') return '#c084fc';
      return '#34d399';
    }}

    function showNodeInspector(n) {{
      const box = document.getElementById('node-details');
      box.innerHTML = `
        <div style="margin-bottom:8px;">
          <span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:700;background:#1e293b;color:#38bdf8;">
            ${{n.type.toUpperCase()}} ${{n.is_god ? '★ GOD NODE' : ''}}
          </span>
        </div>
        <div style="font-size:14px;font-weight:700;color:#fff;word-break:break-all;margin-bottom:6px;">${{n.label}}</div>
        <div style="font-family:monospace;font-size:11px;color:#94a3b8;word-break:break-all;margin-bottom:10px;">
          ${{n.file}} (${{n.lines}})
        </div>
        <div style="background:#020617;padding:10px;border-radius:6px;border:1px solid #1e293b;">
          <div style="margin-bottom:4px;"><strong>God Score:</strong> <span style="color:#fbbf24;">${{n.god_score}}</span></div>
          <div style="margin-bottom:4px;"><strong>Dependentes (In-Degree):</strong> ${{n.in_degree}}</div>
          <div style="margin-bottom:4px;"><strong>Dependências (Out-Degree):</strong> ${{n.out_degree}}</div>
          <div style="margin-bottom:4px;"><strong>Grau Total:</strong> ${{n.total_degree}} conexões</div>
          <div><strong>Tokens Estimados do Nó:</strong> ~${{n.tokens_est}} tok</div>
        </div>
      `;
    }}

    function renderGraph() {{
      const mod = GRAPH_DATA[currentModule];
      const svg = document.getElementById('graph-svg');
      const filterText = (document.getElementById('node-search').value || '').toLowerCase().trim();

      document.getElementById('module-meta-box').innerHTML = `
        <div><strong>Módulo:</strong> ${{mod.title}}</div>
        <div><strong>Nós / Arestas:</strong> ${{mod.metrics.nodes_count}} nós &bull; ${{mod.metrics.edges_count}} arestas</div>
        <div><strong>Economia:</strong> <span style="color:#34d399;font-weight:700;">-${{mod.metrics.token_reduction_pct}}% tokens</span> (${{mod.latency_ms}} ms em CPU)</div>
      `;

      const nodes = mod.viz_nodes.filter(n => !filterText || n.label.toLowerCase().includes(filterText) || n.file.toLowerCase().includes(filterText));
      const nodeIds = new Set(nodes.map(n => n.id));
      const edges = mod.viz_edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));

      const W = 740, H = 440;
      const cx = W / 2, cy = H / 2;

      // Posicionamento Orbital Determinístico em 3 Anéis (God Nodes no centro, Arquivos no anel médio, Símbolos no anel externo)
      const pos = {{}};
      const gods = nodes.filter(n => n.is_god);
      const files = nodes.filter(n => !n.is_god && n.type === 'file');
      const syms = nodes.filter(n => !n.is_god && n.type !== 'file');

      gods.forEach((n, i) => {{
        const angle = (2 * Math.PI * i) / Math.max(1, gods.length);
        const r = gods.length === 1 ? 0 : 62;
        pos[n.id] = {{ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), node: n }};
      }});

      files.forEach((n, i) => {{
        const angle = (2 * Math.PI * i) / Math.max(1, files.length) + 0.25;
        const r = 135;
        pos[n.id] = {{ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), node: n }};
      }});

      syms.forEach((n, i) => {{
        const angle = (2 * Math.PI * i) / Math.max(1, syms.length) + 0.12;
        const r = 192;
        pos[n.id] = {{ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), node: n }};
      }});

      let svgParts = [];

      // Halo de fundo
      svgParts.push(`<circle cx="${{cx}}" cy="${{cy}}" r="65" fill="none" stroke="#1e293b" stroke-dasharray="4 4"/>`);
      svgParts.push(`<circle cx="${{cx}}" cy="${{cy}}" r="135" fill="none" stroke="#1e293b" stroke-dasharray="3 5"/>`);
      svgParts.push(`<circle cx="${{cx}}" cy="${{cy}}" r="192" fill="none" stroke="#0f172a"/>`);

      // Arestas
      edges.forEach(e => {{
        const p1 = pos[e.source];
        const p2 = pos[e.target];
        if (!p1 || !p2) return;
        const color = e.relation === 'IMPORTS' ? '#38bdf8' : (e.relation === 'CALLS' ? '#f59e0b' : '#475569');
        const opacity = e.relation === 'CALLS' ? '0.65' : '0.38';
        svgParts.push(`<line x1="${{p1.x.toFixed(1)}}" y1="${{p1.y.toFixed(1)}}" x2="${{p2.x.toFixed(1)}}" y2="${{p2.y.toFixed(1)}}" stroke="${{color}}" stroke-width="1.3" stroke-opacity="${{opacity}}"/>`);
      }});

      // Nós
      nodes.forEach(n => {{
        const p = pos[n.id];
        if (!p) return;
        const color = getNodeColor(n);
        const radius = n.is_god ? 11 : (n.type === 'file' ? 7.5 : 5.5);
        const shortLbl = n.label.length > 20 ? n.label.slice(0, 18) + '..' : n.label;
        const encoded = encodeURIComponent(JSON.stringify(n));
        svgParts.push(`
          <g transform="translate(${{p.x.toFixed(1)}}, ${{p.y.toFixed(1)}})" style="cursor:pointer;" onclick="showNodeInspector(JSON.parse(decodeURIComponent('${{encoded}}')))">
            <circle r="${{radius}}" fill="${{color}}" stroke="#020617" stroke-width="1.8"/>
            <text y="${{radius + 11}}" fill="${{n.is_god ? '#fde68a' : '#cbd5e1'}}" font-size="${{n.is_god ? '10' : '8.5'}}" font-weight="${{n.is_god ? '700' : '400'}}" text-anchor="middle">${{shortLbl}}</text>
          </g>
        `);
      }});

      svg.innerHTML = svgParts.join('');
      if (gods.length > 0) {{
        showNodeInspector(gods[0]);
      }}
    }}

    window.addEventListener('DOMContentLoaded', () => renderGraph());
  </script>
</body>
</html>
"""
    return html


def main() -> None:
    engine = PCLCodeGraphEngine()
    print("=== [PCL AEOS] Iniciando Indexação AST Determinística dos 4 Subgrafos (--no-llm | 0 MB VRAM) ===")
    summary = engine.codegraph_index(module_key="all", incremental=False)

    subgraphs_loaded: Dict[str, Dict[str, Any]] = {}
    for mod_key, cfg in CANONICAL_MODULES.items():
        json_path = engine.output_dir / cfg["graph_file"]
        subgraphs_loaded[mod_key] = json.loads(json_path.read_text(encoding="utf-8"))
        m = subgraphs_loaded[mod_key]["metrics"]
        print(
            f" -> [{cfg['graph_file']}] Arquivos: {m['files_count']} | "
            f"Nós: {m['nodes_count']} | Arestas: {m['edges_count']} | "
            f"Redução de Tokens: -{m['token_reduction_pct']}% "
            f"({m['brute_force_orientation_tokens']} -> {m['graphify_subgraph_tokens']} tok)"
        )

    html_content = build_interactive_html(engine.workspace_root, subgraphs_loaded)

    out_html_data = engine.output_dir / "graph.html"
    out_html_docs = engine.workspace_root / "docs" / "graphify_pilot_dashboard.html"
    out_html_data.write_text(html_content, encoding="utf-8")
    out_html_docs.write_text(html_content, encoding="utf-8")

    print(f"=== [PCL AEOS] Visualizador graph.html gerado com sucesso: ===")
    print(f" 1) {out_html_data}")
    print(f" 2) {out_html_docs}")


if __name__ == "__main__":
    main()
