"""
PCL AEOS - Database Client Helper para pcl-db (PostgreSQL 17)
Conformidade: ADR-0005, SPEC-PCL-AEOS-MEMORY-03
Isolamento: Executa comandos SQL via Docker de forma resiliente e portável (sem dependência de C wheels).
"""

import subprocess
import json
from typing import List, Dict, Any, Optional

class PCLDatabaseClient:
    def __init__(self, container_name: str = "pcl-db", user: str = "paperclip", db: str = "paperclip"):
        self.container_name = container_name
        self.user = user
        self.db = db

    def execute_sql(self, sql: str) -> str:
        """Executa um comando SQL arbitrário no contêiner pcl-db."""
        cmd = [
            "docker", "exec", "-i", self.container_name,
            "psql", "-U", self.user, "-d", self.db, "-c", sql
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        if result.returncode != 0:
            raise RuntimeError(f"Erro ao executar SQL no {self.container_name}: {result.stderr.strip()}")
        return result.stdout.strip()

    def query_json(self, sql: str) -> List[Dict[str, Any]]:
        """Executa uma consulta SQL e retorna os dados em formato de lista de dicionários via json_agg."""
        clean_sql = sql.strip().rstrip(";")
        if clean_sql.upper().startswith(("INSERT", "UPDATE", "DELETE")):
            wrapped_sql = f"""
                WITH affected AS (
                    {clean_sql}
                )
                SELECT coalesce(json_agg(t), '[]'::json)::text FROM affected t;
            """
        else:
            wrapped_sql = f"""
                SELECT coalesce(json_agg(t), '[]'::json)::text 
                FROM ({clean_sql}) t;
            """
        cmd = [
            "docker", "exec", "-i", self.container_name,
            "psql", "-U", self.user, "-d", self.db, "-t", "-A", "-c", wrapped_sql
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        if result.returncode != 0:
            raise RuntimeError(f"Erro na query_json: {result.stderr.strip()}")
        raw_output = result.stdout.strip()
        if not raw_output:
            return []
        try:
            return json.loads(raw_output)
        except json.JSONDecodeError as e:
            raise ValueError(f"Falha ao decodificar JSON do psql: {raw_output}. Erro: {e}")
