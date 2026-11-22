"""
Audit Logger Estruturado ISO/IEC 42001 & LGPD (Princípio 'No Black-Box Score').
Garante 0% de PII ou Segredos em texto claro nos logs de auditoria JSONL.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import time
from datetime import datetime, timezone
from typing import Any, Dict

from app.config import settings


# Padrões de sanitização estrita para 'extractive_span_sanitized'
_CPF_RE = re.compile(r"\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b")
_EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
_OPENAI_KEY_RE = re.compile(r"\bsk-(?:proj-|live-|test-)?[A-Za-z0-9_-]{12,}\b")
_GITHUB_KEY_RE = re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{16,}\b")
_GOOGLE_KEY_RE = re.compile(r"\bAIza[0-9A-Za-z_-]{20,}\b")
_AWS_KEY_RE = re.compile(r"\bAKIA[0-9A-Z]{16}\b")
_JWT_RE = re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b")
_BEARER_RE = re.compile(r"(?i)\bBearer\s+[A-Za-z0-9._~+/-]{12,}\b")


def generate_uuidv7() -> str:
    """Gera um identificador UUIDv7 ordenável no tempo (RFC 9562)."""
    ts_ms = int(time.time() * 1000) & ((1 << 48) - 1)
    rand_a = int.from_bytes(os.urandom(2), "big") & 0x0FFF
    rand_b = int.from_bytes(os.urandom(8), "big") & ((1 << 62) - 1)

    uuid_int = (ts_ms << 80) | (0x7 << 76) | (rand_a << 64) | (0x2 << 62) | rand_b
    h = f"{uuid_int:032x}"
    return f"{h[0:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def sanitize_pii_and_secrets(raw_text: str, max_len: int = 120) -> str:
    """
    Substitui imediatamente qualquer CPF, E-mail, JWT ou API Key por '[REDACTED:<TYPE>]'
    e trunca o trecho em no máximo `max_len` (120) caracteres.
    """
    if not raw_text:
        return ""

    sanitized = raw_text
    sanitized = _OPENAI_KEY_RE.sub("[REDACTED:OPENAI_KEY]", sanitized)
    sanitized = _GITHUB_KEY_RE.sub("[REDACTED:GITHUB_TOKEN]", sanitized)
    sanitized = _GOOGLE_KEY_RE.sub("[REDACTED:GOOGLE_API_KEY]", sanitized)
    sanitized = _AWS_KEY_RE.sub("[REDACTED:AWS_ACCESS_KEY]", sanitized)
    sanitized = _JWT_RE.sub("[REDACTED:JWT_TOKEN]", sanitized)
    sanitized = _BEARER_RE.sub("Bearer [REDACTED:SECRET_TOKEN]", sanitized)
    sanitized = _CPF_RE.sub("[REDACTED:CPF]", sanitized)
    sanitized = _EMAIL_RE.sub("[REDACTED:EMAIL]", sanitized)

    sanitized = " ".join(sanitized.split())
    if len(sanitized) > max_len:
        return sanitized[: max_len - 3] + "..."
    return sanitized


def redact_full_content(raw_text: str) -> str:
    """Sanitiza o conteúdo completo para retorno seguro em `sanitized_content` quando verdict == REDACT."""
    sanitized = raw_text
    sanitized = _OPENAI_KEY_RE.sub("[REDACTED:OPENAI_KEY]", sanitized)
    sanitized = _GITHUB_KEY_RE.sub("[REDACTED:GITHUB_TOKEN]", sanitized)
    sanitized = _GOOGLE_KEY_RE.sub("[REDACTED:GOOGLE_API_KEY]", sanitized)
    sanitized = _AWS_KEY_RE.sub("[REDACTED:AWS_ACCESS_KEY]", sanitized)
    sanitized = _JWT_RE.sub("[REDACTED:JWT_TOKEN]", sanitized)
    sanitized = _BEARER_RE.sub("Bearer [REDACTED:SECRET_TOKEN]", sanitized)
    sanitized = _CPF_RE.sub("[REDACTED:CPF]", sanitized)
    sanitized = _EMAIL_RE.sub("[REDACTED:EMAIL]", sanitized)
    return sanitized


def compute_payload_sha256(raw_text: str) -> str:
    return hashlib.sha256(raw_text.encode("utf-8")).hexdigest()


def write_audit_event(
    *,
    event_id: str,
    engine: str,
    tenant_id: str,
    session_id: str,
    agent_id: str,
    verdict: str,
    decision_source: str,
    rule_or_hypothesis_id: str,
    confidence_score: float,
    violation_category: str,
    raw_content_for_hash: str,
    raw_span_for_sanitization: str,
    latency_ms: float,
    fallback_applied: bool = False,
    extra: Dict[str, Any] | None = None,
) -> str:
    """
    Grava registro JSONL de auditoria ISO/IEC 42001 com:
      - event_id (UUIDv7)
      - payload_sha256 (hash do payload bruto)
      - extractive_span_sanitized (mascarado e <= 120 chars, zero PII em claro)
    """
    sanitized_span = sanitize_pii_and_secrets(
        raw_span_for_sanitization, max_len=settings.max_extractive_span_chars
    )
    payload_sha256 = compute_payload_sha256(raw_content_for_hash)

    record = {
        "event_id": event_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "engine": engine,
        "tenant_id": tenant_id,
        "session_id": session_id,
        "agent_id": agent_id,
        "verdict": verdict,
        "decision_source": decision_source,
        "rule_or_hypothesis_id": rule_or_hypothesis_id,
        "confidence_score": round(float(confidence_score), 4),
        "violation_category": violation_category,
        "extractive_span_sanitized": sanitized_span,
        "payload_sha256": payload_sha256,
        "latency_ms": round(float(latency_ms), 3),
        "fallback_applied": bool(fallback_applied),
    }
    if extra:
        record.update(extra)

    log_path = settings.audit_log_path
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

    return sanitized_span
