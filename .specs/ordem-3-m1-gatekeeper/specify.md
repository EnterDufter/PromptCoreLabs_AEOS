---
title: "Specification (Full SDD Gate G-01): Ordem 3 — Marco M1 (Identidade Real & Anti-Abuso) + MVP Laya Gatekeeper (PROAA-15 & PROAA-16)"
spec_id: "SPEC-PCL-AEOS-ORDEM3-M1-GATEKEEPER"
system_scope: "PCL Cockpit (:3001) + services/laya-gatekeeper (:20160)"
kernel_version: "v3.6.0"
status: "Approved"
created_at: "2026-11-22"
author: "Cortex Architecture Persona & PromptCore Labs"
normative_ref: "PCL-AEOS-NORM-01"
---

# 1. Contexto & Objetivo Executivo (Ordem 3 — Rota Full SDD Nível 4–5)

A **Ordem 3** da sequência harmonizada do **PCL AEOS / PCL Cockpit v3.6** materializa duas frentes críticas de segurança, identidade e proteção cognitiva/financeira sobre a fundação do Marco M0 (SQL 003) e do `pcl-laya` v2.0 (`PROAA-14`):

1. **Frente A — Marco M1 (Identidade Real, OAuth2 PKCE, Bloqueio Físico do 3º Dispositivo & Trava Anti-Trial-Hopping):**
   - Evolui a autenticação do PCL Cockpit (`server/aeosBackendApp.ts` + `src/services/auth/authService.ts`) para criptografia real de senhas com **Scrypt** (`crypto.scryptSync` + `crypto.timingSafeEqual`, compatível com credenciais Argon2id/Scrypt na tabela `cockpit.user_credentials`), emissão de cookie de sessão **`HttpOnly; SameSite=Lax; Path=/`**, e fluxo **OAuth 2.0 / 2.1 PKCE (RFC 7636 S256)** para **Google**, **Microsoft**, **GitHub** e **LinkedIn**.
   - Impõe no backend o **bloqueio físico do 3º dispositivo simultâneo** (`HTTP 409 Conflict` quando `activeSessions >= 2`), exigindo revogação explícita em tempo real de uma sessão existente antes de admitir o novo dispositivo, com registro na trilha criptográfica encadeada `cockpit.audit_chain_sha256`.
   - Implementa a **trava anti-trial-hopping** sobre a SQL 003 (`cockpit.tenants` e `cockpit.entitlements`), vinculando um hash determinístico (`trial_fingerprint_sha256` = domínio corporativo + device fingerprint + `moduleKey`) para impedir reinicialização ou rotação abusiva do período `trial_14d`.

2. **Frente B — MVP Gatekeeper (`PROAA-15` Cortex Reflex + `PROAA-16` PCL Aegis™):**
   - Materializa a especificação `SPEC_LAYA_SECURITY_FINOPS_GATEKEEPER.md` no microsserviço `services/laya-gatekeeper/` como **Sidecar Out-of-Band FastAPI** na porta `:20160` (`0 MB VRAM` na GPU dedicada RTX 3050, `100% CPUExecutionProvider`).
   - **Autenticação M2M Zero-Trust:** Validação obrigatória via `X-Gatekeeper-Signature` (HMAC-SHA256 sobre `timestamp.raw_body`) ou Bearer token interno (`HTTP 401` em caso de ausência ou assinatura inválida).
   - **Arquitetura em Duas Camadas (Two-Tier Defense):**
     - **Camada 1 Determinística (`< 1 ms`):** Regex/Entropia para PII (CPF, E-mail), Segredos de API (`sk-`, `ghp_`, `AIza`, `Bearer`, JWT), SSRF (IPs internos / metadata cloud), Prompt Injection direto/indireto/ofuscado em Base64, e hash canônico de chamadas de ferramenta (`max_steps` e `max_consecutive_identical_hashes = 3`).
     - **Camada 2 Semântica (`~15–25 ms` em CPU via Laya System One):** NLI/Entailment para detecção de injection semântico, vazamento contextual e loops semânticos entre passos consecutivos (`step_N` vs `step_N-1`, `step_N-2`).
   - **Fallbacks Explícitos por Domínio:**
     - **PCL Aegis™ (`fail-closed`):** Se a Camada 2 exceder timeout (`> 25 ms`) ou estiver indisponível após Camada 1 inconclusiva, retorna `BLOCK` (ou `HITL_REQUIRED` quando `strict_iso42001=True`).
     - **Cortex Reflex (`fail-safe`):** Se a Camada 2 falhar, aplica o disjuntor determinístico da Camada 1 (`KILL_TASK` ao atingir `max_steps` ou `3` hashes idênticos; caso contrário `CONTINUE` com `fallback_applied=True`).
   - **Auditoria ISO/IEC 42001 (*No Black-Box Score*):** Todo veredito gera registro JSONL com `event_id` (UUIDv7), `rule_or_hypothesis_id`, `confidence_score`, `payload_sha256` e `extractive_span_sanitized` (mascarando PII/segredos como `[REDACTED:<TYPE>]` e truncando em `<= 120` caracteres, garantindo **0% de PII em texto claro**).

---

# 2. Critérios de Aceite (Acceptance Criteria)

- **AC-M1-01 (Scrypt + HttpOnly Cookie):** Login por e-mail/senha valida hash Scrypt real em `server/aeosBackendApp.ts`, emite header `Set-Cookie: pcl_cockpit_session=<token>; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800` e registra evento na cadeia SHA-256.
- **AC-M1-02 (OAuth2 PKCE S256):** Os 4 provedores (`google`, `microsoft`, `github`, `linkedin`) executam handshake PKCE RFC 7636 (`code_challenge_method=S256`); um `code_verifier` inválido ou adulterado é rejeitado com `HTTP 401`.
- **AC-M1-03 (Bloqueio Físico do 3º Dispositivo):** Com 2 sessões ativas, a tentativa de login de um 3º `deviceFingerprint` recebe `HTTP 409 Conflict` (`requiresDeviceLimitResolution: true`) até que uma sessão ativa seja revogada via `/api/aeos/auth/sessions/resolve-conflict`.
- **AC-M1-04 (Trava Anti-Trial-Hopping):** Tentativa de reiniciar ou duplicar `trial_14d` para o mesmo `moduleKey` / domínio / device fingerprint recebe `HTTP 403 Forbidden` (`errorCode: 'ANTI_TRIAL_HOPPING_LOCK'`) e trilha `SECURITY_TRIAL_HOPPING_BLOCKED`.
- **AC-GK-01 (Latência p95 < 30 ms e L1 < 1 ms):** Benchmark com 200 requisições mistas no `services/laya-gatekeeper` comprova `p95 < 30 ms` end-to-end e `< 1 ms` na Camada 1 determinística (`0 MB VRAM`).
- **AC-GK-02 (Eficácia Aegis & Reflex):** 100% de bloqueio na suíte adversarial de Prompt Injection, PII/Secrets e SSRF; interrupção em `<= 3` repetições no Cortex Reflex.
- **AC-GK-03 (Resiliência Fail-Closed / Fail-Safe & Sanitização ISO 42001):** Testes unitários comprovam `fail-closed` no Aegis, `fail-safe` no Reflex, `401` sem assinatura HMAC-SHA256 válida e `0` ocorrências de PII/segredos em claro nos logs JSONL.
- **AC-BUILD-01 (Zero Regressão Visual & Exit Code 0):** `npm run build`, `npm run test:unit` e `npm run test:api` no Cockpit passam com **Exit Code 0** e 100% de preservação visual em `:3001`.
