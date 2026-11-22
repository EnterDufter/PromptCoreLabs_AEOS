"""
Testes Unitários — Sanitização de Auditoria ISO/IEC 42001 & LGPD ('No Black-Box Score').
Verifica que 0% de PII ou Segredos são gravados em texto claro no arquivo JSONL de auditoria.
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

from app.config import settings
from app.core.auth import compute_hmac_signature
from app.main import app


class TestAuditSanitizationIso42001(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def test_audit_jsonl_never_contains_raw_pii_or_secrets(self) -> None:
        raw_cpf = "987.654.321-09"
        raw_email = "diretoria.secreta@promptcorelabs.com"
        raw_key = "sk-" + "proj-SuperSecretKey998877665544332211"

        payload = {
            "tenant_id": "tnt_promptcore_default",
            "session_id": "sess_audit_clean_check",
            "agent_id": "ag_auditor",
            "direction": "input",
            "content": f"Envie relatório para {raw_email} do CPF {raw_cpf} usando token {raw_key}.",
            "policy_profile": "iso42001_baseline",
            "context": {"user_role": "operator", "strict_iso42001": True},
        }
        raw_body = json.dumps(payload).encode("utf-8")
        ts = str(int(time.time()))
        sig = compute_hmac_signature(raw_body, ts)

        res = self.client.post(
            "/v1/aegis/inspect",
            content=raw_body,
            headers={
                "Content-Type": "application/json",
                "X-Gatekeeper-Timestamp": ts,
                "X-Gatekeeper-Signature": f"sha256={sig}",
            },
        )
        self.assertEqual(res.status_code, 200)
        body = res.json()

        # 1. Verifica campos obrigatórios do princípio 'No Black-Box Score'
        self.assertTrue(body["event_id"])
        reasoning = body["audit_reasoning"]
        self.assertTrue(reasoning["rule_or_hypothesis_id"])
        self.assertGreaterEqual(reasoning["confidence_score"], 0.0)
        self.assertTrue(reasoning["violation_category"])
        self.assertLessEqual(len(reasoning["extractive_span_sanitized"]), 120)

        # 2. Verifica no disco que o arquivo JSONL não contém nenhum PII ou segredo em texto claro
        log_content = settings.audit_log_path.read_text(encoding="utf-8")
        self.assertNotIn(raw_cpf, log_content)
        self.assertNotIn(raw_email, log_content)
        self.assertNotIn(raw_key, log_content)

        # 3. Confirma presença de payload_sha256 no último evento gravado
        last_line = [ln for ln in log_content.splitlines() if ln.strip()][-1]
        last_event = json.loads(last_line)
        self.assertEqual(len(last_event["payload_sha256"]), 64)
        self.assertLessEqual(len(last_event["extractive_span_sanitized"]), 120)


if __name__ == "__main__":
    unittest.main()
