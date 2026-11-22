"""
Testes Unitários — Resiliência de Fallbacks (Aegis Fail-Closed vs Reflex Fail-Safe) e Autenticação M2M (HTTP 401).
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


class TestGatekeeperFallbacksAndAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def setUp(self) -> None:
        state_store.clear_all()

    def test_missing_or_invalid_m2m_signature_returns_401(self) -> None:
        payload = {
            "tenant_id": "tnt_promptcore_default",
            "session_id": "sess_unauth",
            "agent_id": "ag_test",
            "direction": "input",
            "content": "Olá mundo",
        }
        # Sem header de autenticação -> 401
        res_missing = self.client.post("/v1/aegis/inspect", json=payload)
        self.assertEqual(res_missing.status_code, 401)

        # Com assinatura HMAC inválida -> 401
        res_invalid = self.client.post(
            "/v1/aegis/inspect",
            json=payload,
            headers={"X-Gatekeeper-Signature": "sha256=000000000000000000000000"},
        )
        self.assertEqual(res_invalid.status_code, 401)

    def test_aegis_fail_closed_when_laya_layer2_unavailable(self) -> None:
        # Com strict_iso42001=True -> BLOCK em Fail-Closed
        payload_strict = {
            "tenant_id": "tnt_promptcore_default",
            "session_id": "sess_fb_aegis_1",
            "agent_id": "ag_cortex",
            "direction": "input",
            "content": "Solicitação de auditoria interna autorizada para verificar parâmetros do ambiente.",
            "context": {
                "user_role": "operator",
                "strict_iso42001": True,
                "simulate_laya_failure": True,
            },
        }
        res_strict = _signed_post(self.client, "/v1/aegis/inspect", payload_strict)
        self.assertEqual(res_strict.status_code, 200)
        data_strict = res_strict.json()
        self.assertEqual(data_strict["verdict"], "BLOCK")
        self.assertEqual(data_strict["decision_source"], "FALLBACK_FAIL_CLOSED")
        self.assertTrue(data_strict["fallback_applied"])

        # Com strict_iso42001=False -> HITL_REQUIRED em Fail-Closed
        payload_hitl = {
            **payload_strict,
            "context": {
                "user_role": "operator",
                "strict_iso42001": False,
                "simulate_laya_failure": True,
            },
        }
        res_hitl = _signed_post(self.client, "/v1/aegis/inspect", payload_hitl)
        self.assertEqual(res_hitl.status_code, 200)
        data_hitl = res_hitl.json()
        self.assertEqual(data_hitl["verdict"], "HITL_REQUIRED")
        self.assertEqual(data_hitl["decision_source"], "FALLBACK_FAIL_CLOSED")
        self.assertTrue(data_hitl["fallback_applied"])

    def test_reflex_fail_safe_when_laya_layer2_unavailable(self) -> None:
        # Quando L2 falha, Reflex opera em FAIL-SAFE (CONTINUE se L1 OK, mas KILL_TASK se atingir max_steps)
        payload_step1 = {
            "tenant_id": "tnt_promptcore_default",
            "session_id": "sess_fb_reflex_1",
            "agent_id": "ag_coder",
            "step_index": 1,
            "current_step": {
                "thought_summary": "Executando compilação inicial do módulo",
                "tool_name": "run_build",
                "tool_args_canonical": '{"target":"prod"}',
                "observation_hash": "sha256:ok_1",
            },
            "budget": {"max_steps": 3, "spent_usd": 0.01, "limit_usd": 0.50},
            "simulate_laya_failure": True,
        }
        res1 = _signed_post(self.client, "/v1/reflex/check-step", payload_step1)
        self.assertEqual(res1.status_code, 200)
        data1 = res1.json()
        self.assertEqual(data1["verdict"], "CONTINUE")
        self.assertEqual(data1["decision_source"], "FALLBACK_FAIL_SAFE")
        self.assertTrue(data1["fallback_applied"])

        # Ao atingir max_steps=3, o disjuntor determinístico L1 atua mesmo com L2 offline
        payload_step3 = {
            **payload_step1,
            "step_index": 3,
            "current_step": {
                "thought_summary": "Terceiro passo atingindo teto max_steps",
                "tool_name": "run_tests",
                "tool_args_canonical": '{"suite":"all"}',
                "observation_hash": "sha256:ok_3",
            },
        }
        res3 = _signed_post(self.client, "/v1/reflex/check-step", payload_step3)
        self.assertEqual(res3.status_code, 200)
        data3 = res3.json()
        self.assertEqual(data3["verdict"], "KILL_TASK")
        self.assertEqual(data3["decision_source"], "LAYER1_DETERMINISTIC")


if __name__ == "__main__":
    unittest.main()
