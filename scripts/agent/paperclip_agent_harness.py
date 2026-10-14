"""
PCL AEOS - Paperclip Agent Harness
Conformidade: ADR-0005, ADR-0009, ADR-0010
Integra o Paperclip (:3100), OmniRoute (:20130) e o Laya System One (:20140)
ao ecossistema de memória cognitiva (schema memory.*).
"""

import os
import sys
import time
import json
import urllib.request
from typing import Dict, Any, List, Optional

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "memory")))

from db_client import PCLDatabaseClient
from rag_engine import PCLHybridRAGEngine
from worker_daemon import PCLWorkerDaemon

class PCLPaperclipHarness:
    def __init__(self, 
                 omniroute_url: str = "http://localhost:20130", 
                 laya_url: str = "http://localhost:20140"):
        self.omniroute_url = omniroute_url
        self.laya_url = laya_url
        self.db = PCLDatabaseClient()
        self.rag = PCLHybridRAGEngine()
        self.worker = PCLWorkerDaemon(laya_url=laya_url)

    def prepare_task_context(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """
        Recebe uma tarefa do Paperclip, valida o Gate e enriquece com a Memória Cognitiva.
        """
        admission = self.worker.evaluate_task_admission(task)
        if not admission["accepted"]:
            return {
                "status": "REJECTED",
                "admission": admission,
                "enriched_prompt": None
            }

        # Recupera contexto fundamentado no schema memory.* via RAG Híbrido
        query = task.get("title", "") + " " + task.get("description", "")
        retrieval = self.rag.retrieve_grounded_context(query.strip(), top_k=3)

        system_prompt = (
            "Você é o agente Builder do PCL AEOS executando uma tarefa aprovada no Gate 3.\n"
            "Diretrizes:\n"
            "1. Siga estritamente as regras de arquitetura e padrões do repositório.\n"
            "2. Não altere especificações nem aprove gates por conta própria.\n"
            "3. Todas as modificações devem ser cirúrgicas e auditáveis.\n"
        )

        user_content = task.get("description", task.get("title", ""))
        if retrieval["is_answerable"] and retrieval["grounded_context"]:
            user_content += f"\n\n{retrieval['grounded_context']}"

        return {
            "status": "READY_FOR_EXECUTION",
            "task_id": task.get("id"),
            "stage_gate": "GATE_3_APPROVED",
            "system_prompt": system_prompt,
            "user_prompt": user_content,
            "has_grounded_evidence": retrieval["is_answerable"],
            "fast_exit": retrieval.get("fast_exit", False)
        }

    def execute_safe_tool(self, command: str) -> Dict[str, Any]:
        """Executa um comando através da triagem de segurança do Laya."""
        gating = self.worker.gate_tool_call(command)
        if not gating["allowed"]:
            return {
                "executed": False,
                "reason": f"Comando bloqueado pelo Tool Call Gating ({gating['decision']})",
                "gating": gating
            }
        return {
            "executed": True,
            "command": command,
            "gating": gating
        }

    def finalize_task(self, task_id: str, artifacts: List[str]) -> Dict[str, Any]:
        """Finaliza a tarefa transicionando compulsoriamente para o Gate 4 (Validação)."""
        return self.worker.complete_task_execution(task_id, artifacts)

if __name__ == "__main__":
    harness = PCLPaperclipHarness()
    print("=== PCL AEOS Paperclip Agent Harness ===")
    
    # Simula tarefa aprovada no Gate 3
    task_sample = {
        "id": "TASK-AEOS-101",
        "title": "Implementar endpoint de telemetria",
        "description": "Configurar telemetria e checagem de saúde seguindo as regras do operating-model e ADR-0005.",
        "stage_gate": "GATE_3_APPROVED"
    }
    
    print("\n[Passo 1] Preparando contexto da tarefa:")
    prep = harness.prepare_task_context(task_sample)
    print(f"Status da Admissão: {prep['status']}")
    print(f"Evidência Fundamentada Presente: {prep['has_grounded_evidence']}")
    if prep["has_grounded_evidence"]:
        print(f"Trecho do Contexto Injetado:\n{prep['user_prompt'][-250:]}")

    print("\n[Passo 2] Testando gating de ferramenta do agente:")
    t_safe = harness.execute_safe_tool("python scripts/memory/staleness_verifier.py")
    print(f"Comando Seguro -> Executado: {t_safe['executed']} (Decisão: {t_safe['gating']['decision']})")

    t_danger = harness.execute_safe_tool("DROP TABLE memory.document_chunks;")
    print(f"Comando Perigoso -> Executado: {t_danger['executed']} (Decisão: {t_danger['gating']['decision']})")

    print("\n[Passo 3] Finalizando tarefa no Gate 4 para auditoria humana:")
    fin = harness.finalize_task("TASK-AEOS-101", ["src/telemetry.py"])
    print(f"Status Final: {fin['status']} | Próximo Estágio: {fin['next_stage']}")
    print(f"Mensagem: {fin['message']}")
