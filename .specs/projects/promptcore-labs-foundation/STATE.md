# Project State & Decisions (PCL)

## Current Status: HARNESS CONSOLIDATION
Estabilizando a infraestrutura de fallback agêntico e proteção de EBITDA.

## 🛰️ Harness Fallback Logic (EBITDA Shield)
1. **TIER-1 (High Logic)**: Claude 3.5 Sonnet / Gemini 3.1 Pro (Arquitetura e SPECs).
2. **TIER-2 (Fast Execution)**: Gemini 3 Flash (Coding, UI e Tasks curtas).
3. **TIER-3 (Local/Zero Cost)**: Qwen3-30B / Gemma 3-4B (Logs, Auditoria e Processamento massivo).

## Key Decisions
- **DEC-001**: ADOPTED TLC Spec-Driven as mandatory methodology for all PCL developments.
- **DEC-002**: IMPLEMENTED Docker persistence for OmniRoute and PaperClip.
- **DEC-003**: ENFORCED Private Repository policy for all PCL and NGS code.
- **DEC-004**: DEFINED Sources 008a and 008b as the unique Pillars of Context (discarding 001 for technical execution).

## Deferred Ideas
- [ ] Integration with n8n for workflow automation (EBITDA Shield Phase 2).
- [ ] Automated daily backup to encrypted local drive.

## Blockers
- None.

## Active Todos
- [ ] Criar Bridge `host.docker.internal` no OmniRoute para acesso aos modelos locais.
- [ ] Configurar endpoint do PaperClip para apontar para o OmniRoute Gateway.
- [ ] Testar redundância: Se Gemini falhar, OmniRoute deve chamar o Local automaticamente.

## 🖇️ PaperClip: Boas Práticas (PCL Standard)
- **Soberania**: Nunca exponha dados do `companies/` em modelos Cloud sem anonimização prévia.
- **Persistence**: Sempre rode o PaperClip via Docker com o volume `./PaperClip-Companies` mapeado.
- **Skills**: Novas Skills devem seguir o padrão `tlc-spec-driven` documentado nas `.specs/`.
