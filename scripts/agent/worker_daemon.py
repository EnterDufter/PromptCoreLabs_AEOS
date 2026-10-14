"""
PCL AEOS - Daemon de Execução Agêntica Confinada ao Gate 3 (Worker Harness)
Conformidade: ADR-0009, ADR-0010, ADR-0005, SPEC-PCL-AEOS-CLASSIFIER-01
Governança:
1. Confinamento estrito ao Gate 3 (Approved Tasks).
2. Proibição de auto-aprovação de requisitos nos Gates 1 e 2.
3. Tool Call Gating via pcl-laya (System One em CPU) para comandos destrutivos.
4. Ponto de parada mandatório no Gate 4 (Validation Review) para auditoria humana.
"""

import os
import sys
import time
import json
import urllib.request
from typing import Dict, Any, List, Optional

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

class PCLWorkerDaemon:
    def __init__(self, laya_url: str = "http://localhost:20140"):
        self.laya_url = laya_url

    def evaluate_task_admission(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """
        Invariante de Governança (ADR-0009 / Princípios 4 e 5):
        O worker só aceita executar tarefas formalmente aprovadas no Gate 3.
        Auto-aprovação de especificação (Gate 1) ou arquitetura (Gate 2) é terminantemente proibida.
        """
        gate = task.get("stage_gate", "").upper()
        task_id = task.get("id", "unknown")
        
        if gate in ["GATE_1_SPECIFICATION", "GATE_2_ARCHITECTURE", "GATE_1", "GATE_2"]:
            return {
                "accepted": False,
                "task_id": task_id,
                "stage_gate": gate,
                "reason": "VIOLACAO_GOVERNANCA: Agentes de execução não possuem autoridade para auto-aprovar requisitos ou arquitetura (Princípios 4 e 5). Tarefa rejeitada.",
                "policy": "ADR-0009-TLC-v3"
            }
        
        if gate not in ["GATE_3_APPROVED", "GATE_3"]:
            return {
                "accepted": False,
                "task_id": task_id,
                "stage_gate": gate,
                "reason": f"ESTADO_INVALIDO: Tarefa no estado '{gate}' não está homologada para execução no Gate 3.",
                "policy": "ADR-0009-TLC-v3"
            }

        return {
            "accepted": True,
            "task_id": task_id,
            "stage_gate": "GATE_3_APPROVED",
            "reason": "TAREFA_HOMOLOGADA: Tarefa apta para execução pelo worker agêntico.",
            "policy": "ADR-0009-TLC-v3"
        }

    def gate_tool_call(self, command: str) -> Dict[str, Any]:
        """
        Tool Call Gating via Coprocessador Laya System One (< 35ms em CPU).
        Avalia o comando antes da execução física, classificando em:
        - 'allow': comando seguro para execução autônoma
        - 'confirm': comando de impacto operacional; requer assinatura humana
        - 'deny': comando proibido ou potencialmente destrutivo (DROP TABLE, rm -rf)
        """
        payload = json.dumps({
            "state": command,
            "query": "Avaliar permissão de execução de tool call",
            "options": ["allow", "confirm", "deny"]
        }).encode("utf-8")

        try:
            req = urllib.request.Request(
                f"{self.laya_url}/v1/classifier/evaluate/choice",
                data=payload,
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=2.0) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    decision = data.get("selected", "confirm")
                    return {
                        "command": command,
                        "decision": decision,
                        "confidence": data.get("confidence", 0.9),
                        "duration_ms": data.get("duration_ms", 0.0),
                        "allowed": decision == "allow"
                    }
        except Exception:
            pass

        # Fallback determinístico de segurança máxima
        cmd_lower = command.lower()
        if any(p in cmd_lower for p in ["rm -rf", "drop table", "git push --force", "format c:", "mkfs"]):
            return {"command": command, "decision": "deny", "confidence": 1.0, "duration_ms": 1.0, "allowed": False}
        elif any(p in cmd_lower for p in ["git commit", "docker compose up", "write_to_file", "delete from"]):
            return {"command": command, "decision": "confirm", "confidence": 0.95, "duration_ms": 1.0, "allowed": False}
        
        return {"command": command, "decision": "allow", "confidence": 0.9, "duration_ms": 1.0, "allowed": True}

    def complete_task_execution(self, task_id: str, artifacts_generated: List[str]) -> Dict[str, Any]:
        """
        Ponto de Parada Obrigatório (Stop Point / Gate 4):
        O worker jamais comita para release ou transiciona para concluído por conta própria.
        Ele transiciona estritamente para GATE_4_VALIDATION_REVIEW para auditoria do QA e Humano.
        """
        return {
            "task_id": task_id,
            "previous_stage": "GATE_3_APPROVED",
            "next_stage": "GATE_4_VALIDATION_REVIEW",
            "status": "AWAITING_HUMAN_AUDIT",
            "artifacts_for_review": artifacts_generated,
            "release_branch_locked": True,
            "message": "Execução técnica finalizada. Tarefa retida no Gate 4 para inspeção e parecer soberano do Tech Lead/Auditor."
        }

if __name__ == "__main__":
    daemon = PCLWorkerDaemon()
    print("=== PCL AEOS Worker Daemon (Gate 3 Harness) ===")
    
    # 1. Teste de Admissão
    t_invalid = {"id": "TASK-001", "stage_gate": "GATE_1_SPECIFICATION", "title": "Auto-criar especificação"}
    t_valid = {"id": "TASK-002", "stage_gate": "GATE_3_APPROVED", "title": "Implementar módulo de telemetria"}
    
    print("\n[Teste 1] Avaliação de Tarefa Gate 1 (Rascunho):")
    res1 = daemon.evaluate_task_admission(t_invalid)
    print(f" -> Aceita: {res1['accepted']} | Razão: {res1['reason']}")
    
    print("\n[Teste 2] Avaliação de Tarefa Gate 3 (Homologada):")
    res2 = daemon.evaluate_task_admission(t_valid)
    print(f" -> Aceita: {res2['accepted']} | Razão: {res2['reason']}")

    # 2. Teste de Tool Call Gating
    print("\n[Teste 3] Gating de Comando Destrutivo ('DROP TABLE memory.claims;'):")
    res_danger = daemon.gate_tool_call("DROP TABLE memory.claims;")
    print(f" -> Decisão: {res_danger['decision']} | Permitido: {res_danger['allowed']} | Latência: {res_danger.get('duration_ms')}ms")

    print("\n[Teste 4] Gating de Comando Seguro ('python scripts/tests/test_phase1_validation.py'):")
    res_safe = daemon.gate_tool_call("python scripts/tests/test_phase1_validation.py")
    print(f" -> Decisão: {res_safe['decision']} | Permitido: {res_safe['allowed']} | Latência: {res_safe.get('duration_ms')}ms")

    # 3. Teste de Ponto de Parada no Gate 4
    print("\n[Teste 5] Conclusão de Tarefa e Transição para Gate 4:")
    res_stop = daemon.complete_task_execution("TASK-002", ["src/telemetry.py", "tests/test_telemetry.py"])
    print(f" -> Próximo Estágio: {res_stop['next_stage']} | Status: {res_stop['status']}")
    print(f" -> Mensagem: {res_stop['message']}")
