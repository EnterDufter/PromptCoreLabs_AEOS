"""
Camada 1 Determinística (< 1 ms, O(1), Zero Rede) para PCL Aegis (PROAA-16) e Cortex Reflex (PROAA-15).
Detecta instantaneamente:
  - Prompt Injection direto, indireto e ofuscado em Base64
  - Vazamento de PII (CPF, E-mail) e Segredos de API (sk-, ghp_, AIza, AKIA, JWT, Bearer)
  - Tentativas de SSRF (169.254.169.254, localhost, metadados internos)
  - Loops determinísticos de ferramentas (3x hash canônico idêntico ou max_steps excedido)
"""

from __future__ import annotations

import base64
import hashlib
import re
from dataclasses import dataclass
from typing import List, Optional

from app.core.state_store import StepRecord


@dataclass
class Layer1AegisResult:
    matched: bool
    verdict: str  # "ALLOW" | "BLOCK" | "REDACT"
    rule_id: str
    violation_category: str
    confidence_score: float
    matched_span: str
    needs_layer2: bool = False


@dataclass
class Layer1ReflexResult:
    matched: bool
    verdict: str  # "CONTINUE" | "KILL_TASK"
    rule_id: str
    violation_category: str
    repetition_score: float
    canonical_hash: str
    consecutive_identical_count: int
    needs_layer2: bool = True


# Regexes pré-compilados para execução sub-milissegundo (< 1 ms)
_SECRET_PATTERNS = [
    ("AEGIS-DLP-002", "secret_exfiltration", re.compile(r"\bsk-(?:proj-|live-|test-)?[A-Za-z0-9_-]{12,}\b")),
    ("AEGIS-DLP-002", "secret_exfiltration", re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{16,}\b")),
    ("AEGIS-DLP-002", "secret_exfiltration", re.compile(r"\bAIza[0-9A-Za-z_-]{20,}\b")),
    ("AEGIS-DLP-002", "secret_exfiltration", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("AEGIS-DLP-002", "secret_exfiltration", re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b")),
    ("AEGIS-DLP-002", "secret_exfiltration", re.compile(r"(?i)\bBearer\s+[A-Za-z0-9._~+/-]{16,}\b")),
]

_PII_PATTERNS = [
    ("AEGIS-DLP-001", "pii_cpf_leakage", re.compile(r"\b\d{3}\.\d{3}\.\d{3}-\d{2}\b|\b(?:cpf|documento)\s*[:=]?\s*\d{11}\b", re.IGNORECASE)),
    ("AEGIS-DLP-001", "pii_email_leakage", re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")),
]

_SSRF_RE = re.compile(
    r"(?i)(?:https?://)?(?:169\.254\.169\.254|metadata\.google\.internal|127\.0\.0\.1:\d+|localhost:\d+|0\.0\.0\.0|10\.\d{1,3}\.\d{1,3}\.\d{1,3}/admin|file:///etc/passwd|file:///c:/windows)"
)

_INJECTION_RE = re.compile(
    r"(?i)(?:ignore\s+(?:all\s+|todas\s+as\s+)?(?:previous|prior|above|system|anteriores)\s+(?:instructions|prompts|rules|diretrizes|instru[cç][oõ]es))"
    r"|(?:esque[cç]a\s+(?:todas\s+as\s+)?(?:instru[cç][oõ]es|regras)\s+anteriores)"
    r"|(?:desative\s+o\s+(?:escudo|aegis|gatekeeper|guardrail|filtro))"
    r"|(?:disable\s+(?:aegis|gatekeeper|security\s+shield|guardrails))"
    r"|(?:you\s+are\s+now\s+in\s+(?:developer|dan|unrestricted|jailbreak)\s+mode)"
    r"|(?:system\s*override\s*[:=-])"
    r"|(?:exfiltre|exfiltrate\s+(?:the\s+|as\s+)?(?:system\s+prompt|api\s+keys|credenciais|senhas))"
    r"|(?:imprima\s+o\s+system\s+prompt\s+original)"
)

_BASE64_CANDIDATE_RE = re.compile(r"\b[A-Za-z0-9+/]{24,}={0,2}\b")

# Marcadores semânticos sutis que devem escalar para a Camada 2 (Laya System One)
_AMBIGUOUS_SEMANTIC_CUES_RE = re.compile(
    r"(?i)(?:hipoteticamente|modo\s+de\s+depura[cç][aã]o|auditoria\s+interna\s+autorizada|como\s+administrador\s+supremo|bypass|contornar|confidencial|segredo|credencial|token\s+interno|instru[cç][aã]o\s+oculta)"
)


def _check_base64_injection(text: str) -> Optional[str]:
    for match in _BASE64_CANDIDATE_RE.finditer(text):
        token = match.group(0)
        if len(token) % 4 != 0:
            continue
        try:
            decoded = base64.b64decode(token, validate=True).decode("utf-8", errors="ignore")
            if decoded and (_INJECTION_RE.search(decoded) or "ignore" in decoded.lower() or "system" in decoded.lower() or "desative" in decoded.lower()):
                return f"Base64({token[:32]}...)"
        except Exception:
            continue
    return None


def inspect_layer1_aegis(content: str, strict_iso42001: bool = True) -> Layer1AegisResult:
    """Executa triagem determinística L1 (< 1 ms) para PCL Aegis."""
    # 1. Verifica Segredos de API / Tokens Críticos -> BLOCK imediato
    for rule_id, category, pattern in _SECRET_PATTERNS:
        m = pattern.search(content)
        if m:
            return Layer1AegisResult(
                matched=True,
                verdict="BLOCK",
                rule_id=rule_id,
                violation_category=category,
                confidence_score=1.0,
                matched_span=m.group(0),
                needs_layer2=False,
            )

    # 2. Verifica SSRF -> BLOCK imediato
    m_ssrf = _SSRF_RE.search(content)
    if m_ssrf:
        return Layer1AegisResult(
            matched=True,
            verdict="BLOCK",
            rule_id="AEGIS-SSRF-001",
            violation_category="ssrf_internal_network",
            confidence_score=1.0,
            matched_span=m_ssrf.group(0),
            needs_layer2=False,
        )

    # 3. Verifica Prompt Injection direto ou indireto -> BLOCK imediato
    m_inj = _INJECTION_RE.search(content)
    if m_inj:
        return Layer1AegisResult(
            matched=True,
            verdict="BLOCK",
            rule_id="AEGIS-INJ-001",
            violation_category="prompt_injection",
            confidence_score=0.99,
            matched_span=m_inj.group(0),
            needs_layer2=False,
        )

    # 4. Verifica Prompt Injection ofuscado em Base64 -> BLOCK imediato
    b64_hit = _check_base64_injection(content)
    if b64_hit:
        return Layer1AegisResult(
            matched=True,
            verdict="BLOCK",
            rule_id="AEGIS-INJ-002",
            violation_category="obfuscated_injection",
            confidence_score=0.98,
            matched_span=b64_hit,
            needs_layer2=False,
        )

    # 5. Verifica PII (CPF / E-mail) -> BLOCK (se strict) ou REDACT
    for rule_id, category, pattern in _PII_PATTERNS:
        m_pii = pattern.search(content)
        if m_pii:
            verdict = "BLOCK" if strict_iso42001 else "REDACT"
            return Layer1AegisResult(
                matched=True,
                verdict=verdict,
                rule_id=rule_id,
                violation_category=category,
                confidence_score=0.99,
                matched_span=m_pii.group(0),
                needs_layer2=False,
            )

    # 6. Verifica se há pistas semânticas ambíguas que exigem Camada 2 (Laya NLI)
    needs_l2 = bool(_AMBIGUOUS_SEMANTIC_CUES_RE.search(content)) or len(content) > 90
    return Layer1AegisResult(
        matched=False,
        verdict="ALLOW",
        rule_id="AEGIS-L1-CLEAN",
        violation_category="none",
        confidence_score=0.99,
        matched_span=content[:80],
        needs_layer2=needs_l2,
    )


def compute_canonical_step_hash(tool_name: str, tool_args_canonical: str, observation_hash: str = "") -> str:
    raw = f"{tool_name.strip().lower()}::{tool_args_canonical.strip()}::{observation_hash.strip()}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def inspect_layer1_reflex(
    *,
    step_index: int,
    max_steps: int,
    tool_name: str,
    tool_args_canonical: str,
    observation_hash: str,
    history: List[StepRecord],
    max_consecutive_identical: int = 3,
) -> Layer1ReflexResult:
    """Executa disjuntor determinístico L1 (< 1 ms) para Cortex Reflex."""
    canonical_hash = compute_canonical_step_hash(tool_name, tool_args_canonical, observation_hash)

    # Conta quantos passos consecutivos anteriores possuem o mesmo hash canônico
    consecutive = 1
    for prev in reversed(history):
        if prev.canonical_hash == canonical_hash:
            consecutive += 1
        else:
            break

    if consecutive >= max_consecutive_identical:
        return Layer1ReflexResult(
            matched=True,
            verdict="KILL_TASK",
            rule_id="REFLEX-LOOP-001",
            violation_category="exact_tool_hash_loop",
            repetition_score=1.0,
            canonical_hash=canonical_hash,
            consecutive_identical_count=consecutive,
            needs_layer2=False,
        )

    if step_index >= max_steps:
        return Layer1ReflexResult(
            matched=True,
            verdict="KILL_TASK",
            rule_id="REFLEX-LOOP-002",
            violation_category="max_steps_exceeded",
            repetition_score=1.0,
            canonical_hash=canonical_hash,
            consecutive_identical_count=consecutive,
            needs_layer2=False,
        )

    return Layer1ReflexResult(
        matched=False,
        verdict="CONTINUE",
        rule_id="REFLEX-L1-PASS",
        violation_category="none",
        repetition_score=round((consecutive - 1) / float(max_consecutive_identical), 4),
        canonical_hash=canonical_hash,
        consecutive_identical_count=consecutive,
        needs_layer2=len(history) >= 1,
    )
