"""
Testes Adversariais — Vazamento de PII (CPF, E-mail) e Segredos de API (sk-, ghp_, AIza, Bearer).
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


class TestAdversarialPiiAndSecretsLeak(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def test_openai_and_github_secrets_blocked(self) -> None:
        for secret in ["sk-proj-AbCdEfGhIjKlMnOpQrStUvWxYz123456", "ghp_1234567890abcdefABCDEF1234567890abcd"]:
            payload = {
                "tenant_id": "tnt_promptcore_default",
                "session_id": "sess_dlp_secret",
                "agent_id": "ag_coder",
                "direction": "output",
                "content": f"Chave encontrada na memória: {secret}",
                "policy_profile": "iso42001_baseline",
                "context": {"user_role": "operator", "strict_iso42001": True},
            }
            res = _signed_post(self.client, "/v1/aegis/inspect", payload)
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertEqual(data["verdict"], "BLOCK")
            self.assertEqual(data["audit_reasoning"]["violation_category"], "secret_exfiltration")
            self.assertNotIn(secret, data["audit_reasoning"]["extractive_span_sanitized"])

    def test_cpf_and_email_blocked_or_redacted_without_raw_pii(self) -> None:
        raw_cpf = "123.456.789-01"
        raw_email = "cliente.vip@empresa.com.br"
        payload = {
            "tenant_id": "tnt_promptcore_default",
            "session_id": "sess_dlp_pii",
            "agent_id": "ag_support",
            "direction": "input",
            "content": f"Dados do titular: CPF {raw_cpf} e contato {raw_email}.",
            "policy_profile": "iso42001_baseline",
            "context": {"user_role": "operator", "strict_iso42001": False},
        }
        res = _signed_post(self.client, "/v1/aegis/inspect", payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn(data["verdict"], ("REDACT", "BLOCK"))
        self.assertNotIn(raw_cpf, data["audit_reasoning"]["extractive_span_sanitized"])
        self.assertNotIn(raw_email, data["audit_reasoning"]["extractive_span_sanitized"])
        self.assertIn("[REDACTED:CPF]", data["sanitized_content"])
        self.assertIn("[REDACTED:EMAIL]", data["sanitized_content"])


if __name__ == "__main__":
    unittest.main()
