"""
Testes Adversariais — Loops Forçados de Ferramentas e Loops Semânticos (Cortex Reflex PROAA-15).
Comprova interrupção em <= 3 repetições (KILL_TASK / FORCE_DOWNGRADE) com economia FinOps reportada.
"""

from __future__ import annotations

import json
import sys
import time
import unittest
from pathlib import Path
from fastapi.testclient import TestClient

SERVICE_ROOT = Path(__file__).resolve().parents[2]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.core.auth import compute_hmac_signature
from app.core.state_store import state_store
from app.main import app


def _signed_post(client: TestClient, path: str, payload: dict):
    raw_body = json.dumps(payload).encode("utf-8")
    ts = str(int(time.time()))
    sig = compute_hmac_signature(raw_body, ts)
    return client.post(
        path,
        content=raw_body,
        headers={
            "Content-Type": "application/json",
            "X-Gatekeeper-Timestamp": ts,
            "X-Gatekeeper-Signature": f"sha256={sig}",
        },
    )


class TestAdversarialForcedLoop(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def setUp(self) -> None:
        state_store.clear_all()

    def test_exact_tool_hash_loop_killed_at_3rd_repetition(self) -> None:
        verdicts = []
        for step_idx in range(1, 4):
            payload = {
                "tenant_id": "tnt_promptcore_default",
                "session_id": "sess_exact_loop_1",
                "agent_id": "ag_researcher",
                "step_index": step_idx,
                "current_step": {
                    "thought_summary": f"Buscando tabela de preços passo {step_idx}",
                    "tool_name": "sql_query",
                    "tool_args_canonical": '{"query":"SELECT * FROM missing_table"}',
                    "observation_hash": "sha256:err_relation_does_not_exist",
                },
                "budget": {"max_steps": 15, "spent_usd": 0.12, "limit_usd": 0.50},
            }
            res = _signed_post(self.client, "/v1/reflex/check-step", payload)
            self.assertEqual(res.status_code, 200)
            data = res.json()
            verdicts.append(data)

        self.assertEqual(verdicts[2]["verdict"], "KILL_TASK")
        self.assertEqual(verdicts[2]["decision_source"], "LAYER1_DETERMINISTIC")
        self.assertTrue(verdicts[2]["loop_detected"])
        self.assertGreater(verdicts[2]["estimated_cost_saved_usd"], 0.0)

    def test_semantic_paraphrase_loop_detected_by_layer2_laya(self) -> None:
        paraphrases = [
            "Tentando consultar endpoint de faturamento que retornou timeout 504 na API externa",
            "Repetindo chamada ao serviço de faturamento após erro de timeout 504 no servidor externo",
            "Novamente consultando a API externa de faturamento que continua falhando com timeout 504",
        ]
        last_data = None
        for idx, thought in enumerate(paraphrases, start=1):
            payload = {
                "tenant_id": "tnt_promptcore_default",
                "session_id": "sess_semantic_loop_1",
                "agent_id": "ag_billing",
                "step_index": idx,
                "current_step": {
                    "thought_summary": thought,
                    "tool_name": "http_request",
                    "tool_args_canonical": f'{{"attempt":{idx},"url":"https://api.billing/v1"}}',
                    "observation_hash": f"sha256:timeout_{idx}",
                },
                "budget": {"max_steps": 15, "spent_usd": 0.10, "limit_usd": 0.40},
            }
            res = _signed_post(self.client, "/v1/reflex/check-step", payload)
            self.assertEqual(res.status_code, 200)
            last_data = res.json()

        self.assertIsNotNone(last_data)
        self.assertIn(last_data["verdict"], ("KILL_TASK", "FORCE_DOWNGRADE"))
        self.assertEqual(last_data["decision_source"], "LAYER2_LAYA")
        self.assertTrue(last_data["loop_detected"])


if __name__ == "__main__":
    unittest.main()
