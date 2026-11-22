"""
PCL AEOS — Motor e Adaptador Hexagonal de Grafo Estrutural de Código (PCL Code Graph Port)
Conformidade: SPEC-PCL-AEOS-CODEGRAPH-04, PCL-AEOS-NORM-01, AGENTS.md
Modo: 100% Determinístico (--no-llm / AST em CPU) | 0 MB VRAM | Custo $0.00 | Zero Mocks
"""

from __future__ import annotations

import ast
import fnmatch
import hashlib
import json
import math
import os
import re
import subprocess
import time
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple


# Mapeamento Canônico dos 4 Subgrafos Modulares do Monorepo PCL AEOS
CANONICAL_MODULES: Dict[str, Dict[str, str]] = {
    "cockpit": {
        "graph_file": "cockpit-graph.json",
        "title": "PCL Cockpit v3.9/v4.0 (:3001)",
        "rel_path": "projects/PromptCoreLabs_AEOS_Dashboard",
        "description": "Cabine de Comando Executiva e Técnica (React 19, TypeScript, Vite, Middlewares AEOS e MCP Soberano)"
    },
    "laya": {
        "graph_file": "laya-graph.json",
        "title": "Coprocessador Laya System One (:20140)",
        "rel_path": "services/pcl-laya",
        "description": "Sensor Neural NLI e Classificador Não-Autorregressivo em CPU INT8 (0 MB VRAM, FastAPI & FastMCP)"
    },
    "omniroute": {
        "graph_file": "omniroute-graph.json",
        "title": "OmniRoute AI Gateway (:20130)",
        "rel_path": "OmniRoute",
        "description": "Gateway Soberano de Roteamento Multi-Modelo, SSE Streaming, Resiliência e Failover"
    },
    "paperclip": {
        "graph_file": "paperclip-graph.json",
        "title": "PaperClip Squad Orchestrator (:3100)",
        "rel_path": "PaperClip",
        "description": "Motor de Orquestração de Squads Agênticos, Empresas Virtuais e Persistência Drizzle/PostgreSQL"
    }
}

SUPPORTED_EXTENSIONS: Set[str] = {
    ".py", ".ts", ".tsx", ".js", ".mjs", ".cjs", ".sql"
}


class PCLCodeGraphEngine:
    """
    Implementação agnóstica do contrato hexagonal 'PCL Code Graph Port' (SPEC-PCL-AEOS-CODEGRAPH-04).
    Suporta integração com Graphify (graphifyy) e motor AST determinístico multi-linguagem nativo em CPU.
    """

    def __init__(self, workspace_root: Optional[str] = None) -> None:
        if workspace_root:
            self.workspace_root = Path(workspace_root).resolve()
        else:
            # Resolve a raiz do monorepo a partir de services/pcl-codegraph/src/engine.py
            self.workspace_root = Path(__file__).resolve().parents[3]

        self.output_dir = self.workspace_root / "data" / "codegraphs"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.ignore_patterns = self._load_graphifyignore()

    def _load_graphifyignore(self) -> List[str]:
        ignore_file = self.workspace_root / ".graphifyignore"
        patterns: List[str] = [
            "node_modules", ".pnpm", ".pnpm-store", ".venv", "venv", "__pycache__",
            "dist", "build", "out", ".next", ".vite", ".vite-aeos", ".wrangler",
            "ui-dist", "coverage", ".git", "data", "db-data", "omniroute-data",
            "paperclip-storage", "backups", "logs", "scratch", "graphify-out",
            "external-references", "legacy", "tools", "projects/crialli",
            "projects/maquina-de-receita-pcl", "projects/esteira-diaria-conteudo",
            "*.min.js", "*.bundle.js", "*.map", "*.onnx", "*.lock",
            "package-lock.json", "pnpm-lock.yaml", "yarn.lock", "*.d.ts", "*.d.mts"
        ]
        if ignore_file.exists():
            for line in ignore_file.read_text(encoding="utf-8", errors="ignore").splitlines():
                cleaned = line.strip()
                if cleaned and not cleaned.startswith("#"):
                    patterns.append(cleaned.rstrip("/"))
        return list(dict.fromkeys(patterns))

    def _is_ignored(self, rel_path_posix: str) -> bool:
        parts = rel_path_posix.split("/")
        filename = parts[-1]
        if filename.endswith(".d.ts") or filename.endswith(".d.mts") or filename.endswith(".min.js"):
            return True
        for pattern in self.ignore_patterns:
            clean_pat = pattern.rstrip("/")
            if clean_pat in parts:
                return True
            if fnmatch.fnmatch(filename, clean_pat) or fnmatch.fnmatch(rel_path_posix, clean_pat):
                return True
        return False

    def _get_git_commit_sha(self) -> str:
        try:
            res = subprocess.run(
                ["git", "rev-parse", "--short", "HEAD"],
                cwd=str(self.workspace_root),
                capture_output=True,
                text=True,
                timeout=3
            )
            if res.returncode == 0:
                return res.stdout.strip()
        except Exception:
            pass
        return "local-uncommitted"

    @staticmethod
    def _compute_sha256(content: str) -> str:
        return hashlib.sha256(content.encode("utf-8", errors="ignore")).hexdigest()

    # =========================================================================
    # PARSERS AST DETERMINÍSTICOS (--no-llm | 0 Tokens | 0 MB VRAM)
    # =========================================================================

    def _parse_python_ast(
        self,
        content: str,
        rel_file: str,
        module_key: str
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Tuple[str, str, int]]]:
        """Extrai classes, funções, endpoints MCP/FastAPI, importações e chamadas via Python AST."""
        nodes: List[Dict[str, Any]] = []
        edges: List[Dict[str, Any]] = []
        unresolved_calls: List[Tuple[str, str, int]] = []

        file_node_id = f"file:{rel_file}"
        try:
            tree = ast.parse(content, filename=rel_file)
        except SyntaxError:
            return nodes, edges, unresolved_calls

        for item in tree.body:
            if isinstance(item, (ast.Import, ast.ImportFrom)):
                line_no = getattr(item, "lineno", 1)
                if isinstance(item, ast.Import):
                    for alias in item.names:
                        edges.append({
                            "source": file_node_id,
                            "target": f"import:{alias.name}",
                            "relation": "IMPORTS",
                            "confidence": "EXTRACTED",
                            "line": line_no
                        })
                elif isinstance(item, ast.ImportFrom) and item.module:
                    edges.append({
                        "source": file_node_id,
                        "target": f"import:{item.module}",
                        "relation": "IMPORTS",
                        "confidence": "EXTRACTED",
                        "line": line_no
                    })

            elif isinstance(item, ast.ClassDef):
                cls_id = f"symbol:{rel_file}::{item.name}"
                line_start = getattr(item, "lineno", 1)
                line_end = getattr(item, "end_lineno", line_start)
                nodes.append({
                    "id": cls_id,
                    "label": item.name,
                    "type": "class",
                    "language": "python",
                    "file": rel_file,
                    "module": module_key,
                    "line_start": line_start,
                    "line_end": line_end,
                    "tokens_est": max(10, (line_end - line_start + 1) * 8)
                })
                edges.append({
                    "source": file_node_id,
                    "target": cls_id,
                    "relation": "DEFINES",
                    "confidence": "EXTRACTED",
                    "line": line_start
                })
                for sub in item.body:
                    if isinstance(sub, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        m_id = f"symbol:{rel_file}::{item.name}.{sub.name}"
                        m_start = getattr(sub, "lineno", line_start)
                        m_end = getattr(sub, "end_lineno", m_start)
                        nodes.append({
                            "id": m_id,
                            "label": f"{item.name}.{sub.name}",
                            "type": "method",
                            "language": "python",
                            "file": rel_file,
                            "module": module_key,
                            "line_start": m_start,
                            "line_end": m_end,
                            "tokens_est": max(8, (m_end - m_start + 1) * 7)
                        })
                        edges.append({
                            "source": cls_id,
                            "target": m_id,
                            "relation": "DEFINES",
                            "confidence": "EXTRACTED",
                            "line": m_start
                        })
                        for call_node in ast.walk(sub):
                            if isinstance(call_node, ast.Call):
                                callee = self._extract_py_call_name(call_node)
                                if callee:
                                    unresolved_calls.append((m_id, callee, getattr(call_node, "lineno", m_start)))

            elif isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)):
                fn_id = f"symbol:{rel_file}::{item.name}"
                line_start = getattr(item, "lineno", 1)
                line_end = getattr(item, "end_lineno", line_start)
                fn_type = "function"
                for dec in item.decorator_list:
                    dec_str = ast.unparse(dec) if hasattr(ast, "unparse") else ""
                    if "mcp.tool" in dec_str:
                        fn_type = "mcp_tool"
                    elif any(v in dec_str for v in ("app.get", "app.post", "app.put", "app.delete", "router.")):
                        fn_type = "api_endpoint"

                nodes.append({
                    "id": fn_id,
                    "label": item.name,
                    "type": fn_type,
                    "language": "python",
                    "file": rel_file,
                    "module": module_key,
                    "line_start": line_start,
                    "line_end": line_end,
                    "tokens_est": max(8, (line_end - line_start + 1) * 7)
                })
                edges.append({
                    "source": file_node_id,
                    "target": fn_id,
                    "relation": "DEFINES",
                    "confidence": "EXTRACTED",
                    "line": line_start
                })
                for call_node in ast.walk(item):
                    if isinstance(call_node, ast.Call):
                        callee = self._extract_py_call_name(call_node)
                        if callee:
                            unresolved_calls.append((fn_id, callee, getattr(call_node, "lineno", line_start)))

        return nodes, edges, unresolved_calls

    @staticmethod
    def _extract_py_call_name(call_node: ast.Call) -> Optional[str]:
        if isinstance(call_node.func, ast.Name):
            return call_node.func.id
        if isinstance(call_node.func, ast.Attribute):
            return call_node.func.attr
        return None

    def _parse_ts_js_ast(
        self,
        content: str,
        rel_file: str,
        module_key: str
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Tuple[str, str, int]], List[Tuple[str, int]]]:
        """
        Extrator sintático determinístico para TypeScript/TSX/JavaScript/MJS.
        Mapeia importações ES/CJS, componentes React, Hooks, Classes, Interfaces, Funções, Rotas de API e chamadas.
        """
        nodes: List[Dict[str, Any]] = []
        edges: List[Dict[str, Any]] = []
        unresolved_calls: List[Tuple[str, str, int]] = []
        raw_imports: List[Tuple[str, int]] = []

        file_node_id = f"file:{rel_file}"
        lines = content.splitlines()

        # 1. Extração de Imports (ES6 import/export from & CommonJS require)
        import_re = re.compile(
            r"""(?:import|export)\s+(?:type\s+)?(?:[\w*\s{},]+?\s+from\s+)?['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)"""
        )
        # 2. Extração de Declarações de Símbolos (Classes, Interfaces, Funções, Componentes React, Hooks)
        class_re = re.compile(r"^\s*(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+([A-Za-z_]\w*)")
        iface_re = re.compile(r"^\s*(?:export\s+)?interface\s+([A-Za-z_]\w*)")
        func_re = re.compile(
            r"^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+([A-Za-z_]\w*)\s*[<(]"
        )
        const_fn_re = re.compile(
            r"^\s*(?:export\s+)?const\s+([A-Za-z_]\w*)\s*(?::\s*[^=]+)?=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_]\w*)\s*=>"
        )
        api_route_re = re.compile(
            r"""['"](/api/[A-Za-z0-9_/\-:]+|/v1/[A-Za-z0-9_/\-:]+)['"]"""
        )

        defined_symbols_in_file: List[Tuple[str, str, int]] = []

        for idx, line in enumerate(lines, start=1):
            stripped = line.strip()
            if stripped.startswith("//") or stripped.startswith("/*") or stripped.startswith("*"):
                continue

            for m_imp in import_re.finditer(line):
                imp_target = m_imp.group(1) or m_imp.group(2)
                if imp_target:
                    raw_imports.append((imp_target, idx))

            m_cls = class_re.match(line)
            if m_cls:
                sym_name = m_cls.group(1)
                sym_id = f"symbol:{rel_file}::{sym_name}"
                defined_symbols_in_file.append((sym_id, sym_name, idx))
                nodes.append({
                    "id": sym_id,
                    "label": sym_name,
                    "type": "class",
                    "language": "typescript",
                    "file": rel_file,
                    "module": module_key,
                    "line_start": idx,
                    "line_end": min(len(lines), idx + 45),
                    "tokens_est": 180
                })
                edges.append({
                    "source": file_node_id,
                    "target": sym_id,
                    "relation": "DEFINES",
                    "confidence": "EXTRACTED",
                    "line": idx
                })
                continue

            m_iface = iface_re.match(line)
            if m_iface:
                sym_name = m_iface.group(1)
                sym_id = f"symbol:{rel_file}::{sym_name}"
                nodes.append({
                    "id": sym_id,
                    "label": sym_name,
                    "type": "interface",
                    "language": "typescript",
                    "file": rel_file,
                    "module": module_key,
                    "line_start": idx,
                    "line_end": min(len(lines), idx + 20),
                    "tokens_est": 75
                })
                edges.append({
                    "source": file_node_id,
                    "target": sym_id,
                    "relation": "DEFINES",
                    "confidence": "EXTRACTED",
                    "line": idx
                })
                continue

            m_fn = func_re.match(line) or const_fn_re.match(line)
            if m_fn:
                sym_name = m_fn.group(1)
                sym_id = f"symbol:{rel_file}::{sym_name}"
                if sym_name.startswith("use") and len(sym_name) > 3 and sym_name[3].isupper():
                    sym_type = "react_hook"
                elif sym_name[0].isupper() and (rel_file.endswith(".tsx") or rel_file.endswith(".jsx")):
                    sym_type = "react_component"
                else:
                    sym_type = "function"

                defined_symbols_in_file.append((sym_id, sym_name, idx))
                nodes.append({
                    "id": sym_id,
                    "label": sym_name,
                    "type": sym_type,
                    "language": "typescript",
                    "file": rel_file,
                    "module": module_key,
                    "line_start": idx,
                    "line_end": min(len(lines), idx + 40),
                    "tokens_est": 160
                })
                edges.append({
                    "source": file_node_id,
                    "target": sym_id,
                    "relation": "DEFINES",
                    "confidence": "EXTRACTED",
                    "line": idx
                })
                continue

            for m_route in api_route_re.finditer(line):
                route_path = m_route.group(1)
                route_id = f"endpoint:{rel_file}::{route_path}"
                if not any(n["id"] == route_id for n in nodes):
                    nodes.append({
                        "id": route_id,
                        "label": route_path,
                        "type": "api_endpoint",
                        "language": "typescript",
                        "file": rel_file,
                        "module": module_key,
                        "line_start": idx,
                        "line_end": min(len(lines), idx + 25),
                        "tokens_est": 110
                    })
                    edges.append({
                        "source": file_node_id,
                        "target": route_id,
                        "relation": "DEFINES",
                        "confidence": "EXTRACTED",
                        "line": idx
                    })

        # 3. Extração de Chamadas e Componentes JSX (<ComponentName ou funcName())
        call_token_re = re.compile(r"\b([A-Za-z_][A-Za-z0-9_]{2,})\s*\(|<([A-Z][A-Za-z0-9_]+)\b")
        ignored_keywords = {
            "if", "for", "while", "switch", "catch", "function", "return", "typeof",
            "Array", "Object", "String", "Number", "Boolean", "Promise", "Map", "Set",
            "Error", "Date", "Math", "JSON", "console", "window", "document", "process",
            "setTimeout", "clearTimeout", "setInterval", "clearInterval", "fetch",
            "require", "import", "export", "super", "describe", "it", "test", "expect",
            "get", "set", "log", "error", "warn", "info", "debug", "parse", "stringify",
            "update", "delete", "list", "create", "read", "write", "map", "filter",
            "reduce", "forEach", "find", "some", "every", "includes", "push", "pop",
            "shift", "slice", "splice", "join", "split", "trim", "replace", "match",
            "toString", "valueOf", "keys", "values", "entries", "from", "assign",
            "freeze", "then", "finally", "resolve", "reject", "json", "text", "status",
            "send", "end", "next", "use", "on", "emit", "off", "close", "open", "start",
            "stop", "run", "init", "reset", "clear", "add", "remove", "has", "format",
            "render", "mount", "unmount", " focus", "blur", "click", "submit", "post",
            "put", "patch", "head", "options", "connect", "disconnect", "execute", "query"
        }

        caller_source = defined_symbols_in_file[0][0] if defined_symbols_in_file else file_node_id
        for idx, line in enumerate(lines, start=1):
            # Atualiza o símbolo chamador conforme avançamos pelas linhas do arquivo
            for s_id, _, s_line in defined_symbols_in_file:
                if idx >= s_line:
                    caller_source = s_id
            for m_call in call_token_re.finditer(line):
                callee = m_call.group(1) or m_call.group(2)
                if callee and callee not in ignored_keywords:
                    unresolved_calls.append((caller_source, callee, idx))

        return nodes, edges, unresolved_calls, raw_imports

    def _parse_sql_ast(
        self,
        content: str,
        rel_file: str,
        module_key: str
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """Extrai tabelas e chaves estrangeiras de migrações SQL."""
        nodes: List[Dict[str, Any]] = []
        edges: List[Dict[str, Any]] = []
        file_node_id = f"file:{rel_file}"
        table_re = re.compile(r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([A-Za-z0-9_.]+)", re.IGNORECASE)
        ref_re = re.compile(r"REFERENCES\s+([A-Za-z0-9_.]+)", re.IGNORECASE)

        lines = content.splitlines()
        current_table_id: Optional[str] = None
        for idx, line in enumerate(lines, start=1):
            m_tbl = table_re.search(line)
            if m_tbl:
                tbl_name = m_tbl.group(1)
                current_table_id = f"table:{rel_file}::{tbl_name}"
                nodes.append({
                    "id": current_table_id,
                    "label": tbl_name,
                    "type": "sql_table",
                    "language": "sql",
                    "file": rel_file,
                    "module": module_key,
                    "line_start": idx,
                    "line_end": min(len(lines), idx + 20),
                    "tokens_est": 95
                })
                edges.append({
                    "source": file_node_id,
                    "target": current_table_id,
                    "relation": "DEFINES",
                    "confidence": "EXTRACTED",
                    "line": idx
                })
            m_ref = ref_re.search(line)
            if m_ref and current_table_id:
                target_tbl = m_ref.group(1)
                edges.append({
                    "source": current_table_id,
                    "target": f"table_ref:{target_tbl}",
                    "relation": "REFERENCES",
                    "confidence": "EXTRACTED",
                    "line": idx
                })
        return nodes, edges

    def _resolve_import_path(
        self,
        importer_rel_file: str,
        raw_import: str,
        known_files: Set[str],
        module_rel_root: str
    ) -> Optional[str]:
        """Resolve caminhos relativos ('./foo', '../bar', '@/baz') para o nó de arquivo real no subgrafo."""
        importer_dir = Path(importer_rel_file).parent
        candidates: List[Path] = []

        if raw_import.startswith("."):
            base = (self.workspace_root / importer_dir / raw_import).resolve()
            try:
                rel_base = base.relative_to(self.workspace_root)
                candidates.append(rel_base)
            except ValueError:
                return None
        elif raw_import.startswith("@/"):
            sub = raw_import[2:]
            candidates.append(Path(module_rel_root) / "src" / sub)
            candidates.append(Path(module_rel_root) / sub)
        else:
            # Verifica se corresponde a um módulo Python local no mesmo diretório
            sibling = importer_dir / raw_import.replace(".", "/")
            candidates.append(sibling)
            candidates.append(Path(module_rel_root) / "src" / raw_import.replace(".", "/"))

        extensions = ["", ".ts", ".tsx", ".js", ".mjs", ".cjs", ".py", "/index.ts", "/index.tsx", "/index.js"]
        for cand in candidates:
            cand_posix = cand.as_posix()
            for ext in extensions:
                test_path = f"{cand_posix}{ext}"
                if test_path in known_files:
                    return f"file:{test_path}"
        return None

    # =========================================================================
    # 1. PRIMITIVA CANÔNICA: codegraph_index
    # =========================================================================

    def codegraph_index(
        self,
        module_key: str = "all",
        incremental: bool = True
    ) -> Dict[str, Any]:
        """
        Indexa deterministicamente 1 ou todos os 4 subgrafos modulares usando AST em CPU (0 Tokens, 0 MB VRAM).
        """
        if module_key == "all":
            results = {}
            for key in CANONICAL_MODULES:
                results[key] = self._index_single_module(key)
            return {
                "status": "completed",
                "mode": "deterministic_ast_no_llm",
                "vram_mb": 0,
                "llm_tokens_used": 0,
                "modules": results
            }

        if module_key not in CANONICAL_MODULES:
            raise ValueError(f"Módulo desconhecido '{module_key}'. Opções válidas: {list(CANONICAL_MODULES.keys())}")

        return self._index_single_module(module_key)

    def _index_single_module(self, module_key: str) -> Dict[str, Any]:
        start_ts = time.perf_counter()
        mod_cfg = CANONICAL_MODULES[module_key]
        mod_root = self.workspace_root / mod_cfg["rel_path"]

        if not mod_root.exists():
            raise FileNotFoundError(f"Diretório do módulo não encontrado: {mod_root}")

        nodes: List[Dict[str, Any]] = []
        edges: List[Dict[str, Any]] = []
        known_files: Set[str] = set()
        file_contents: Dict[str, str] = {}
        file_hashes: Dict[str, str] = {}
        total_raw_chars = 0
        total_lines = 0

        # Passada 1: Descoberta de arquivos filtrados pelo .graphifyignore
        for root, dirs, files in os.walk(mod_root):
            # Filtra diretórios in-place para performance O(1) em pastas ignoradas (ex: node_modules)
            filtered_dirs = []
            for d in dirs:
                d_rel = Path(root, d).resolve().relative_to(self.workspace_root).as_posix()
                if not self._is_ignored(d_rel):
                    filtered_dirs.append(d)
            dirs[:] = filtered_dirs

            for fname in files:
                ext = Path(fname).suffix.lower()
                if ext not in SUPPORTED_EXTENSIONS:
                    continue
                fpath = Path(root, fname).resolve()
                rel_posix = fpath.relative_to(self.workspace_root).as_posix()
                if self._is_ignored(rel_posix):
                    continue

                try:
                    text = fpath.read_text(encoding="utf-8", errors="ignore")
                except Exception:
                    continue

                known_files.add(rel_posix)
                file_contents[rel_posix] = text
                f_sha = self._compute_sha256(text)
                file_hashes[rel_posix] = f_sha

                n_lines = len(text.splitlines())
                n_chars = len(text)
                n_tokens = max(1, math.ceil(n_chars / 4.0))
                total_raw_chars += n_chars
                total_lines += n_lines

                nodes.append({
                    "id": f"file:{rel_posix}",
                    "label": Path(rel_posix).name,
                    "full_path": rel_posix,
                    "type": "file",
                    "language": ext.lstrip("."),
                    "file": rel_posix,
                    "module": module_key,
                    "line_start": 1,
                    "line_end": n_lines,
                    "lines": n_lines,
                    "tokens_est": n_tokens,
                    "sha256": f_sha
                })

        # Passada 2: Extração AST de Símbolos, Imports e Chamadas
        all_unresolved_calls: List[Tuple[str, str, int, str]] = []
        symbol_index_by_name: Dict[str, List[str]] = defaultdict(list)

        for rel_posix, text in file_contents.items():
            ext = Path(rel_posix).suffix.lower()
            if ext == ".py":
                f_nodes, f_edges, f_calls = self._parse_python_ast(text, rel_posix, module_key)
                nodes.extend(f_nodes)
                edges.extend(f_edges)
                for src_id, callee, line_no in f_calls:
                    all_unresolved_calls.append((src_id, callee, line_no, rel_posix))
                for n in f_nodes:
                    short_name = n["label"].split(".")[-1]
                    symbol_index_by_name[short_name].append(n["id"])
                # Resolve imports Python locais
                for e in list(f_edges):
                    if e["relation"] == "IMPORTS" and e["target"].startswith("import:"):
                        raw_imp = e["target"].split("import:", 1)[1]
                        resolved = self._resolve_import_path(rel_posix, raw_imp, known_files, mod_cfg["rel_path"])
                        if resolved:
                            e["target"] = resolved

            elif ext in {".ts", ".tsx", ".js", ".mjs", ".cjs"}:
                f_nodes, f_edges, f_calls, raw_imps = self._parse_ts_js_ast(text, rel_posix, module_key)
                nodes.extend(f_nodes)
                edges.extend(f_edges)
                for src_id, callee, line_no in f_calls:
                    all_unresolved_calls.append((src_id, callee, line_no, rel_posix))
                for n in f_nodes:
                    symbol_index_by_name[n["label"]].append(n["id"])
                for raw_imp, line_no in raw_imps:
                    resolved = self._resolve_import_path(rel_posix, raw_imp, known_files, mod_cfg["rel_path"])
                    if resolved and resolved != f"file:{rel_posix}":
                        edges.append({
                            "source": f"file:{rel_posix}",
                            "target": resolved,
                            "relation": "IMPORTS",
                            "confidence": "EXTRACTED",
                            "line": line_no
                        })

            elif ext == ".sql":
                f_nodes, f_edges = self._parse_sql_ast(text, rel_posix, module_key)
                nodes.extend(f_nodes)
                edges.extend(f_edges)

        # Passada 3: Resolução de Chamadas entre Símbolos do Subgrafo (CALLS)
        node_ids_set = {n["id"] for n in nodes}
        seen_edges: Set[Tuple[str, str, str]] = set()
        deduped_edges: List[Dict[str, Any]] = []

        for e in edges:
            if e["source"] in node_ids_set and e["target"] in node_ids_set and e["source"] != e["target"]:
                key = (e["source"], e["target"], e["relation"])
                if key not in seen_edges:
                    seen_edges.add(key)
                    deduped_edges.append(e)

        # Mapa de arquivos importados por cada arquivo para resolução precisa de chamadas inter-arquivos
        imported_files_by_src: Dict[str, Set[str]] = defaultdict(set)
        for e in deduped_edges:
            if e["relation"] == "IMPORTS" and e["source"].startswith("file:") and e["target"].startswith("file:"):
                s_f = e["source"].split("file:", 1)[1]
                t_f = e["target"].split("file:", 1)[1]
                imported_files_by_src[s_f].add(t_f)

        for src_id, callee, line_no, src_file in all_unresolved_calls:
            if callee in symbol_index_by_name:
                targets = symbol_index_by_name[callee]
                chosen_target: Optional[str] = None
                # 1. Prioriza símbolo definido em arquivo explicitamente importado por src_file
                for t_id in targets:
                    if t_id.startswith("symbol:"):
                        t_file = t_id.split("symbol:", 1)[1].split("::", 1)[0]
                        if t_file in imported_files_by_src.get(src_file, set()):
                            chosen_target = t_id
                            break
                # 2. Ou símbolo definido no próprio arquivo
                if not chosen_target:
                    for t_id in targets:
                        if t_id.startswith(f"symbol:{src_file}::"):
                            chosen_target = t_id
                            break
                # 3. Ou símbolo único de domínio específico (nome >= 6 caracteres e único no módulo)
                if not chosen_target and len(targets) == 1 and len(callee) >= 6:
                    chosen_target = targets[0]

                if chosen_target and src_id in node_ids_set and chosen_target in node_ids_set and src_id != chosen_target:
                    key = (src_id, chosen_target, "CALLS")
                    if key not in seen_edges:
                        seen_edges.add(key)
                        deduped_edges.append({
                            "source": src_id,
                            "target": chosen_target,
                            "relation": "CALLS",
                            "confidence": "EXTRACTED",
                            "line": line_no
                        })

        # Passada 4: Cálculo de Centralidade, PageRank e Identificação dos God Nodes
        in_deg: Counter[str] = Counter()
        out_deg: Counter[str] = Counter()
        cross_file_in: Counter[str] = Counter()
        cross_file_out: Counter[str] = Counter()
        node_map: Dict[str, Dict[str, Any]] = {n["id"]: n for n in nodes}

        for e in deduped_edges:
            u, v, rel = e["source"], e["target"], e["relation"]
            out_deg[u] += 1
            in_deg[v] += 1
            u_file = node_map[u].get("file", "")
            v_file = node_map[v].get("file", "")
            if u_file != v_file or rel in ("IMPORTS", "CALLS"):
                cross_file_out[u] += 1
                cross_file_in[v] += 1

        # PageRank Iterativo Determinístico (15 iterações, damping = 0.85)
        n_total = max(1, len(nodes))
        pr: Dict[str, float] = {n["id"]: 1.0 / n_total for n in nodes}
        adj_out: Dict[str, List[str]] = defaultdict(list)
        for e in deduped_edges:
            adj_out[e["source"]].append(e["target"])

        for _ in range(15):
            new_pr: Dict[str, float] = {nid: (1.0 - 0.85) / n_total for nid in node_map}
            for u, nbrs in adj_out.items():
                if nbrs:
                    share = 0.85 * pr[u] / len(nbrs)
                    for v in nbrs:
                        new_pr[v] += share
            pr = new_pr

        for n in nodes:
            nid = n["id"]
            n["in_degree"] = in_deg[nid]
            n["out_degree"] = out_deg[nid]
            n["total_degree"] = in_deg[nid] + out_deg[nid]
            n["cross_file_degree"] = cross_file_in[nid] * 2 + cross_file_out[nid]
            n["pagerank"] = round(pr[nid] * 1000.0, 4)
            # God Score pondera conexões inter-arquivos, grau total e centralidade PageRank
            n["god_score"] = round(
                (cross_file_in[nid] * 3.5) + (cross_file_out[nid] * 1.8) + (in_deg[nid] * 1.2) + (out_deg[nid] * 0.5) + (n["pagerank"] * 2.0),
                2
            )

        # Ranqueia Top 5 God Nodes (priorizando arquivos/serviços/componentes centrais)
        sorted_gods = sorted(nodes, key=lambda x: (x["god_score"], x["total_degree"]), reverse=True)
        top_god_nodes: List[Dict[str, Any]] = []
        seen_labels: Set[str] = set()
        for cand in sorted_gods:
            if cand["total_degree"] == 0:
                continue
            key_lbl = f"{cand['file']}::{cand['label']}"
            if key_lbl in seen_labels:
                continue
            seen_labels.add(key_lbl)
            top_god_nodes.append({
                "rank": len(top_god_nodes) + 1,
                "id": cand["id"],
                "label": cand["label"],
                "type": cand["type"],
                "file": cand["file"],
                "in_degree": cand["in_degree"],
                "out_degree": cand["out_degree"],
                "total_degree": cand["total_degree"],
                "god_score": cand["god_score"],
                "pagerank": cand["pagerank"],
                "tokens_est": cand["tokens_est"]
            })
            if len(top_god_nodes) >= 5:
                break

        # Passada 5: Auditoria Matemática Realista de Economia de Tokens (Padrão ADR-0017: Sem Exagero Comercial)
        total_raw_tokens = max(1, math.ceil(total_raw_chars / 4.0))
        # Cenário Realista de Benchmark (Tarefa Multi-Arquivo):
        # - Sem Graphify (Força Bruta): O agente lê em média os 8 arquivos mais acoplados do módulo (ou 100% se <= 8 arquivos)
        #   limitando leituras por arquivo a janelas realistas de 800 linhas (~3.500 tokens por read_file).
        # - Com Graphify (Subgrafo 2-Hops + Leitura Cirúrgica): O agente consome o payload JSON do subgrafo (~450-850 tokens)
        #   e lê apenas os blocos de linhas exatos (L_start-L_end) de 2 símbolos/funções alvo (~750-1.350 tokens).
        file_nodes_by_centrality = sorted(
            [n for n in nodes if n["type"] == "file"],
            key=lambda x: (x.get("god_score", 0), x.get("tokens_est", 0)),
            reverse=True
        )
        sampled_files = file_nodes_by_centrality[:min(10, max(1, len(file_nodes_by_centrality)))]
        brute_force_orientation_tokens = sum(min(4200, f["tokens_est"]) for f in sampled_files)
        if len(file_nodes_by_centrality) <= 5:
            brute_force_orientation_tokens = total_raw_tokens

        subgraph_json_tokens = min(920, max(280, int(len(top_god_nodes) * 110 + 220)))
        surgical_line_range_tokens = max(420, int(brute_force_orientation_tokens * 0.165))
        graphify_assisted_tokens = subgraph_json_tokens + surgical_line_range_tokens

        token_savings_pct = round(
            max(0.0, (1.0 - (graphify_assisted_tokens / max(1, brute_force_orientation_tokens))) * 100.0),
            1
        )

        elapsed_ms = round((time.perf_counter() - start_ts) * 1000.0, 2)
        commit_sha = self._get_git_commit_sha()

        graph_payload: Dict[str, Any] = {
            "schema_version": "SPEC-PCL-AEOS-CODEGRAPH-04/v1.0",
            "module": module_key,
            "title": mod_cfg["title"],
            "description": mod_cfg["description"],
            "root_path": mod_cfg["rel_path"],
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "git_commit_sha": commit_sha,
            "engine_mode": "deterministic_ast_no_llm",
            "hardware_invariants": {
                "execution_provider": "CPU",
                "vram_allocated_mb": 0,
                "llm_tokens_consumed": 0,
                "cost_usd": 0.0,
                "indexing_latency_ms": elapsed_ms
            },
            "metrics": {
                "files_count": len(known_files),
                "total_lines": total_lines,
                "nodes_count": len(nodes),
                "edges_count": len(deduped_edges),
                "total_raw_module_tokens": total_raw_tokens,
                "brute_force_orientation_tokens": brute_force_orientation_tokens,
                "graphify_subgraph_tokens": graphify_assisted_tokens,
                "token_reduction_pct": token_savings_pct
            },
            "top_god_nodes": top_god_nodes,
            "file_hashes": file_hashes,
            "nodes": nodes,
            "edges": deduped_edges
        }

        graph_json_str = json.dumps(graph_payload, ensure_ascii=False, indent=2)
        graph_sha256 = self._compute_sha256(graph_json_str)
        graph_payload["graph_sha256"] = graph_sha256

        out_file = self.output_dir / mod_cfg["graph_file"]
        out_file.write_text(json.dumps(graph_payload, ensure_ascii=False, indent=2), encoding="utf-8")

        return {
            "module": module_key,
            "graph_file": str(out_file),
            "graph_sha256": graph_sha256,
            "git_commit_sha": commit_sha,
            "indexing_latency_ms": elapsed_ms,
            "metrics": graph_payload["metrics"],
            "top_god_nodes": top_god_nodes
        }

    # =========================================================================
    # 2. PRIMITIVA CANÔNICA: codegraph_query
    # =========================================================================

    def _load_subgraph(self, module_key: str) -> Dict[str, Any]:
        if module_key not in CANONICAL_MODULES:
            raise ValueError(f"Módulo inválido: {module_key}")
        fpath = self.output_dir / CANONICAL_MODULES[module_key]["graph_file"]
        if not fpath.exists():
            self._index_single_module(module_key)
        return json.loads(fpath.read_text(encoding="utf-8"))

    def codegraph_query(
        self,
        query: str,
        module_key: str = "cockpit",
        max_hops: int = 2,
        token_budget: int = 1500
    ) -> Dict[str, Any]:
        """
        Busca no subgrafo AST os nós mais relevantes para a query e expande a vizinhança em até max_hops.
        """
        modules_to_search = list(CANONICAL_MODULES.keys()) if module_key == "all" else [module_key]
        terms = [t.lower() for t in re.split(r"[\s,/._\-:]+", query.strip()) if len(t) >= 2]

        matched_nodes: List[Dict[str, Any]] = []
        all_edges: List[Dict[str, Any]] = []
        node_lookup: Dict[str, Dict[str, Any]] = {}

        for m_key in modules_to_search:
            g = self._load_subgraph(m_key)
            for n in g["nodes"]:
                node_lookup[n["id"]] = n
                haystack = f"{n['label']} {n.get('file', '')} {n.get('type', '')}".lower()
                score = sum(3 if t == n["label"].lower() else (1 if t in haystack else 0) for t in terms)
                if score > 0:
                    n_copy = dict(n)
                    n_copy["match_score"] = score + (n.get("god_score", 0) * 0.05)
                    matched_nodes.append(n_copy)
            all_edges.extend(g["edges"])

        matched_nodes.sort(key=lambda x: x["match_score"], reverse=True)
        seed_ids = {n["id"] for n in matched_nodes[:8]}

        # Expansão BFS por max_hops
        visited_ids = set(seed_ids)
        frontier = set(seed_ids)
        subgraph_edges: List[Dict[str, Any]] = []

        for _ in range(max(1, max_hops)):
            next_frontier: Set[str] = set()
            for e in all_edges:
                u, v = e["source"], e["target"]
                if u in frontier or v in frontier:
                    subgraph_edges.append(e)
                    if u not in visited_ids:
                        visited_ids.add(u)
                        next_frontier.add(u)
                    if v not in visited_ids:
                        visited_ids.add(v)
                        next_frontier.add(v)
            frontier = next_frontier
            if len(visited_ids) >= 35:
                break

        result_nodes = [
            {
                "id": nid,
                "label": node_lookup[nid]["label"],
                "type": node_lookup[nid]["type"],
                "file": node_lookup[nid]["file"],
                "lines": f"L{node_lookup[nid].get('line_start', 1)}-L{node_lookup[nid].get('line_end', 1)}",
                "god_score": node_lookup[nid].get("god_score", 0)
            }
            for nid in visited_ids if nid in node_lookup
        ]

        return {
            "query": query,
            "module": module_key,
            "max_hops": max_hops,
            "nodes_returned": len(result_nodes),
            "edges_returned": len(subgraph_edges[:60]),
            "estimated_response_tokens": min(token_budget, len(result_nodes) * 28 + len(subgraph_edges[:60]) * 14),
            "subgraph_nodes": result_nodes[:30],
            "relationships": subgraph_edges[:60]
        }

    # =========================================================================
    # 3. PRIMITIVA CANÔNICA: codegraph_impact_radius
    # =========================================================================

    def codegraph_impact_radius(
        self,
        symbol_or_file: str,
        module_key: str = "cockpit",
        depth: int = 2
    ) -> Dict[str, Any]:
        """
        Calcula o raio de impacto (blast radius): quem chama ou importa o arquivo/símbolo alvo.
        """
        modules_to_search = list(CANONICAL_MODULES.keys()) if module_key == "all" else [module_key]
        target_lower = symbol_or_file.lower()

        target_ids: Set[str] = set()
        node_lookup: Dict[str, Dict[str, Any]] = {}
        all_edges: List[Dict[str, Any]] = []

        for m_key in modules_to_search:
            g = self._load_subgraph(m_key)
            for n in g["nodes"]:
                node_lookup[n["id"]] = n
                if target_lower in n["id"].lower() or target_lower == n["label"].lower():
                    target_ids.add(n["id"])
            all_edges.extend(g["edges"])

        dependents: Set[str] = set()
        dependencies: Set[str] = set()
        frontier_in = set(target_ids)
        frontier_out = set(target_ids)

        for _ in range(max(1, depth)):
            next_in: Set[str] = set()
            next_out: Set[str] = set()
            for e in all_edges:
                if e["target"] in frontier_in and e["source"] not in target_ids:
                    dependents.add(e["source"])
                    next_in.add(e["source"])
                if e["source"] in frontier_out and e["target"] not in target_ids:
                    dependencies.add(e["target"])
                    next_out.add(e["target"])
            frontier_in = next_in
            frontier_out = next_out

        affected_files = sorted({
            node_lookup[nid]["file"] for nid in (dependents | target_ids) if nid in node_lookup
        })

        risk_level = "HIGH" if len(affected_files) >= 8 else ("MEDIUM" if len(affected_files) >= 3 else "LOW")

        return {
            "target": symbol_or_file,
            "module": module_key,
            "depth": depth,
            "risk_level": risk_level,
            "affected_files_count": len(affected_files),
            "affected_files": affected_files,
            "upstream_dependents_count": len(dependents),
            "downstream_dependencies_count": len(dependencies),
            "upstream_callers": [
                {"id": nid, "label": node_lookup[nid]["label"], "file": node_lookup[nid]["file"]}
                for nid in list(dependents)[:25] if nid in node_lookup
            ]
        }

    # =========================================================================
    # 4. PRIMITIVA CANÔNICA: codegraph_god_nodes
    # =========================================================================

    def codegraph_god_nodes(
        self,
        module_key: str = "all",
        top_k: int = 5
    ) -> Dict[str, Any]:
        """Retorna os Top-K God Nodes (nós de maior acoplamento e centralidade arquitetural)."""
        if module_key == "all":
            by_module = {}
            all_candidates = []
            for m_key in CANONICAL_MODULES:
                g = self._load_subgraph(m_key)
                by_module[m_key] = g["top_god_nodes"][:top_k]
                for item in g["top_god_nodes"]:
                    entry = dict(item)
                    entry["module"] = m_key
                    all_candidates.append(entry)
            all_candidates.sort(key=lambda x: x["god_score"], reverse=True)
            return {
                "scope": "all",
                "global_top_god_nodes": all_candidates[:top_k],
                "by_module": by_module
            }

        g = self._load_subgraph(module_key)
        return {
            "scope": module_key,
            "top_god_nodes": g["top_god_nodes"][:top_k]
        }

    # =========================================================================
    # 5. PRIMITIVA CANÔNICA: codegraph_check_freshness
    # =========================================================================

    def codegraph_check_freshness(
        self,
        module_key: str = "all"
    ) -> Dict[str, Any]:
        """
        Deterministic Staleness Verifier (SPEC-PCL-AEOS-MEMORY-03 & SPEC-PCL-AEOS-CODEGRAPH-04):
        Compara o SHA-256 gravado em cada subgrafo com os arquivos físicos atuais no disco (0 Tokens).
        """
        modules_to_check = list(CANONICAL_MODULES.keys()) if module_key == "all" else [module_key]
        report: Dict[str, Any] = {}
        any_stale = False

        for m_key in modules_to_check:
            g = self._load_subgraph(m_key)
            recorded_hashes: Dict[str, str] = g.get("file_hashes", {})
            dirty_files: List[str] = []

            for rel_file, old_sha in recorded_hashes.items():
                fpath = self.workspace_root / rel_file
                if not fpath.exists():
                    dirty_files.append(f"DELETED:{rel_file}")
                else:
                    curr_sha = self._compute_sha256(fpath.read_text(encoding="utf-8", errors="ignore"))
                    if curr_sha != old_sha:
                        dirty_files.append(f"MODIFIED:{rel_file}")

            is_stale = len(dirty_files) > 0
            if is_stale:
                any_stale = True
            report[m_key] = {
                "is_stale": is_stale,
                "last_indexed_commit": g.get("git_commit_sha"),
                "generated_at": g.get("generated_at"),
                "dirty_files_count": len(dirty_files),
                "dirty_files": dirty_files[:20]
            }

        return {
            "overall_status": "STALE" if any_stale else "TRUSTED",
            "current_git_commit": self._get_git_commit_sha(),
            "modules": report
        }
