---
title: "Task Breakdown (Full SDD Gate G-03): Ordem 3 — Marco M1 + MVP Laya Gatekeeper"
spec_id: "SPEC-PCL-AEOS-ORDEM3-M1-GATEKEEPER"
status: "Completed"
created_at: "2026-11-22"
---

# Checklist de Execução (Ordem 3)

- [x] **T0. Checkpoint Git da Ordem 2:** Commit e push seguro na branch `master` (`adbd072`) de todos os artefatos do Marco M0 + `pcl-laya` v2.0 (`PROAA-14`).
- [x] **T1. Frente A — Backend Marco M1 (`server/aeosBackendApp.ts`):**
  - [x] Implementar hash/verificação de senha Scrypt (`scrypt:v1:<salt>:<hash>`) e emissão de cookie `HttpOnly` (`pcl_cockpit_session`).
  - [x] Implementar endpoints OAuth 2.0 / 2.1 PKCE S256 (`/api/aeos/auth/oauth/pkce-init` e `/api/aeos/auth/oauth/exchange`) para Google, Microsoft, GitHub e LinkedIn.
  - [x] Implementar bloqueio físico do 3º dispositivo (`HTTP 409 Conflict`) em `/api/aeos/auth/login` e `/api/aeos/auth/oauth/exchange`, além de listagem/revogação em tempo real (`/api/aeos/auth/sessions`, `/api/aeos/auth/sessions/revoke`, `/api/aeos/auth/sessions/resolve-conflict`, `/api/aeos/auth/logout`).
  - [x] Implementar trava anti-trial-hopping (`POST /api/aeos/entitlements/start-trial`) com bloqueio `HTTP 403` e auditoria encadeada SHA-256.
- [x] **T2. Frente A — Frontend Integration & Testes (`src/services/auth/authService.ts` + `tests/integration/backendApi.test.ts`):**
  - [x] Integrar `authService.ts` com geração real de `code_verifier`/`code_challenge` (S256) e sincronização com `/api/aeos/auth/*` sem alterar o layout visual de `:3001`.
  - [x] Expandir `tests/integration/backendApi.test.ts` cobrindo Scrypt + `HttpOnly` cookie, PKCE S256 (sucesso e rejeição `401`), bloqueio `409` do 3º dispositivo + revogação, e trava anti-trial-hopping `403`.
- [x] **T3. Frente B — Microsserviço `services/laya-gatekeeper/` (`PROAA-15` & `PROAA-16`):**
  - [x] Criar `pyproject.toml`, `Dockerfile`, `policies/iso42001_baseline.yaml` e `policies/reflex_thresholds.yaml`.
  - [x] Criar `app/config.py`, `app/schemas/contracts.py`, `app/core/auth.py` (HMAC-SHA256 + Bearer), `app/core/audit.py` (*No Black-Box Score* com `[REDACTED:<TYPE>]` e UUIDv7) e `app/core/state_store.py`.
  - [x] Criar `app/layers/l1_deterministic.py` (`< 1 ms`), `app/layers/l2_laya.py` (Laya CPU `0 MB VRAM`), `app/engines/aegis.py` (`fail-closed`), `app/engines/reflex.py` (`fail-safe`) e `app/main.py`.
- [x] **T4. Frente B — Suíte de Testes Adversariais, Unitários e Benchmark p95 (< 30 ms):**
  - [x] Implementar e executar `tests/adversarial/test_prompt_injection.py`, `test_pii_secrets_leak.py`, `test_forced_loop.py` (100% PASS).
  - [x] Implementar e executar `tests/unit/test_fallbacks.py` e `test_audit_sanitization.py` (100% PASS).
  - [x] Implementar e executar `tests/benchmarks/test_latency_p95.py` (`L1 p95 = 0.0200 ms < 1.0 ms`, `E2E p95 = 0.127 ms < 30.0 ms`, `0 MB VRAM`).
- [x] **T5. Validação Final Gate G-04:**
  - [x] Validar `npm run test:unit` (15/15 PASS), `npm run test:api` (11/11 PASS) e `npm run build` com **Exit Code 0**.
  - [x] Atualizar subgrafos do `pcl-codegraph` e documentar resultados em `.specs/ordem-3-m1-gatekeeper/validate.md` e `walkthrough.md`.
