"""Ring Buffer Thread-Safe em Memória para Histórico de Passos do Cortex Reflex (PROAA-15)."""

from __future__ import annotations

import threading
from collections import deque
from dataclasses import dataclass
from typing import Deque, Dict, List


@dataclass
class StepRecord:
    step_index: int
    tool_name: str
    tool_args_canonical: str
    canonical_hash: str
    thought_summary: str
    observation_hash: str


class ReflexStateStore:
    """Mantém janela deslizante dos últimos N passos por (tenant_id, session_id)."""

    def __init__(self, window_size: int = 8) -> None:
        self._window_size = window_size
        self._lock = threading.Lock()
        self._sessions: Dict[str, Deque[StepRecord]] = {}

    def _key(self, tenant_id: str, session_id: str) -> str:
        return f"{tenant_id}::{session_id}"

    def get_history(self, tenant_id: str, session_id: str) -> List[StepRecord]:
        key = self._key(tenant_id, session_id)
        with self._lock:
            buf = self._sessions.get(key)
            return list(buf) if buf else []

    def record_step(self, tenant_id: str, session_id: str, step: StepRecord) -> List[StepRecord]:
        key = self._key(tenant_id, session_id)
        with self._lock:
            if key not in self._sessions:
                self._sessions[key] = deque(maxlen=self._window_size)
            self._sessions[key].append(step)
            return list(self._sessions[key])

    def clear_session(self, tenant_id: str, session_id: str) -> None:
        key = self._key(tenant_id, session_id)
        with self._lock:
            self._sessions.pop(key, None)

    def clear_all(self) -> None:
        with self._lock:
            self._sessions.clear()


state_store = ReflexStateStore(window_size=8)
