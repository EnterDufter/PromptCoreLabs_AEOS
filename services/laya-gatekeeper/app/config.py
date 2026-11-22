"""Configurações tipadas e limites de SLA do Laya Gatekeeper Sidecar."""

from __future__ import annotations

import os
from pathlib import Path
from dataclasses import dataclass, field


SERVICE_ROOT = Path(__file__).resolve().parent.parent
WORKSPACE_ROOT = SERVICE_ROOT.parent.parent


@dataclass
class GatekeeperConfig:
    service_name: str = "laya-gatekeeper"
    service_version: str = "1.0.0"
    host: str = field(default_factory=lambda: os.getenv("GATEKEEPER_HOST", "0.0.0.0"))
    port: int = field(default_factory=lambda: int(os.getenv("GATEKEEPER_PORT", "20160")))
    hmac_secret: str = field(
        default_factory=lambda: os.getenv(
            "GATEKEEPER_HMAC_SECRET", "pcl-aeos-gatekeeper-m2m-secret-v1"
        )
    )
    internal_bearer_token: str = field(
        default_factory=lambda: os.getenv(
            "GATEKEEPER_BEARER_TOKEN", "pcl-gatekeeper-internal-token-2026"
        )
    )
    laya_timeout_ms: float = field(
        default_factory=lambda: float(os.getenv("GATEKEEPER_LAYA_TIMEOUT_MS", "25.0"))
    )
    laya_http_url: str = field(
        default_factory=lambda: os.getenv("LAYA_URL", "http://127.0.0.1:20140")
    )
    audit_log_path: Path = field(
        default_factory=lambda: Path(
            os.getenv(
                "GATEKEEPER_AUDIT_LOG_PATH",
                str(SERVICE_ROOT / "logs" / "gatekeeper_audit_iso42001.jsonl"),
            )
        )
    )
    iso42001_policy_path: Path = field(
        default_factory=lambda: SERVICE_ROOT / "policies" / "iso42001_baseline.yaml"
    )
    reflex_policy_path: Path = field(
        default_factory=lambda: SERVICE_ROOT / "policies" / "reflex_thresholds.yaml"
    )
    max_extractive_span_chars: int = 120
    default_max_steps: int = 15
    max_consecutive_identical_hashes: int = 3
    estimated_cost_per_loop_usd: float = 0.045


settings = GatekeeperConfig()
