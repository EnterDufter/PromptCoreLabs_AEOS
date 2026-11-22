"""Autenticação M2M Zero-Trust via HMAC-SHA256 (X-Gatekeeper-Signature) ou Internal Bearer Token."""

from __future__ import annotations

import hashlib
import hmac
import time
from typing import Optional
from fastapi import HTTPException, Request, status

from app.config import settings


def compute_hmac_signature(raw_body: bytes, timestamp_str: str, secret: Optional[str] = None) -> str:
    """Calcula assinatura HMAC-SHA256 canônica sobre '<timestamp>.<raw_body>'."""
    key = (secret or settings.hmac_secret).encode("utf-8")
    msg = timestamp_str.encode("utf-8") + b"." + raw_body
    return hmac.new(key, msg, hashlib.sha256).hexdigest()


async def verify_m2m_authentication(request: Request) -> None:
    """
    Valida autenticação M2M em todos os endpoints /v1/* do Gatekeeper.
    Aceita:
      1. X-Gatekeeper-Signature (HMAC-SHA256) + X-Gatekeeper-Timestamp (opcional, default body-only se omitido)
      2. Authorization: Bearer <internal_bearer_token>
    Retorna HTTP 401 se ausente ou inválido.
    """
    sig_header = request.headers.get("X-Gatekeeper-Signature", "").strip()
    ts_header = request.headers.get("X-Gatekeeper-Timestamp", "").strip()
    auth_header = request.headers.get("Authorization", "").strip()

    if sig_header:
        raw_body = await request.body()
        if ts_header:
            try:
                ts_val = int(ts_header)
                if abs(int(time.time()) - ts_val) > 300:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="GATEKEEPER_AUTH_EXPIRED_TIMESTAMP",
                    )
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="GATEKEEPER_AUTH_INVALID_TIMESTAMP",
                )
            expected = compute_hmac_signature(raw_body, ts_header)
        else:
            expected = hmac.new(
                settings.hmac_secret.encode("utf-8"), raw_body, hashlib.sha256
            ).hexdigest()

        clean_sig = sig_header.replace("sha256=", "")
        if hmac.compare_digest(clean_sig, expected):
            return
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="GATEKEEPER_AUTH_INVALID_HMAC_SIGNATURE",
        )

    if auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
        if hmac.compare_digest(token, settings.internal_bearer_token):
            return
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="GATEKEEPER_AUTH_INVALID_BEARER_TOKEN",
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="GATEKEEPER_AUTH_MISSING_CREDENTIALS",
    )
