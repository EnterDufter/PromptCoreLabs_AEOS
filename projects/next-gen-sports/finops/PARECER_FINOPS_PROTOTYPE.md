# Parecer de Validação FinOps — Protótipo Onda 1 (Gate Hiperfoco 60 Dias)

**Projeto:** Next Gen Sports (NGS) — Onda 1 (Hub Central + 5 Telas)  
**Responsável:** Ledger FinOps (`V5 Dados/BI, V9 Pricing & FinOps, V14 E-Commerce`)  
**Data:** 2026-11-21  
**Referências Auditadas:**
- `C:\PromptCore_Labs\projects\next-gen-sports\finops\MODELAGEM_TCO_3_CENARIOS.md`
- `C:\PromptCore_Labs\projects\next-gen-sports\.specs\specify.md` (`v2.1.0-canonical`)

---

## 1. Parecer Objetivo (`finops-laya-guard` / EBITDA Shield)

**Veredito:** **`PASS` (APROVADO PARA EXECUÇÃO DA ONDA 1)**

A arquitetura definida para o protótipo navegável (`Vite + React + TypeScript + Tailwind CSS`, build estático local com dados mockados tipados) está **100% aderente** ao gate do **Plano Hiperfoco 60 Dias** e às regras do **EBITDA Shield**:

| Critério FinOps | Estado Validado | Impacto Financeiro |
|---|---|---|
| **Infraestrutura / Backend** | Zero backend pago (dados mockados tipados locais; eventual preview estático em tier gratuito) | **`$0,00 / R$ 0,00`** |
| **APIs Externas & LLMs** | Zero chamadas a APIs pagas, sem runtime LLM (simulações determinísticas no frontend) | **`$0,00 / R$ 0,00`** |
| **Licenças White Label** | Licença FeedHive Agency (`US$ 299/mês`) **não contratada** nesta etapa | **`$0,00 / R$ 0,00`** |
| **Hardware & Wearables** | Pausados até o software faturar (zero aquisição/integração física na Onda 1) | **`$0,00 / R$ 0,00`** |
| **Teto Hiperfoco 60 Dias** | Esforço enxuto de protótipo + validação com 5+ personas sem comprometer o CAPEX do Cenário B (`R$ 69.500`) | **Dentro do teto `< R$ 5.000`** |

### Guardrails Obrigatórios para a Construção (Onda 1)
1. **Zero chaves/SDKs pagos no bundle:** Não incluir SDKs de LLMs (OpenAI/Anthropic/Gemini), gateways de pagamento ativos, banco gerenciado pago ou integrações reais com APIs de telemetria/redes sociais.
2. **Simulação determinística:** Qualquer fluxo de *Gerador de Mídia-Kit* ou *Insights* no protótipo deve operar exclusivamente sobre JSON mockado tipado e regras locais determinísticas.
3. **Trava de CAPEX (`Gate Pós-Hiperfoco`):** O CAPEX de produção do **Cenário B Híbrido (`R$ 69.500`)** permanece **bloqueado** até a conclusão dos testes com as 5+ personas e coleta de sinais objetivos de *willingness-to-pay* (conforme `specify.md` Seção 6).

---

## 2. Métricas de FinOps Recomendadas para Exibição no Protótipo

Em alinhamento com o **RNF-04** (máximo de 3 blocos primários por viewport, sem poluição visual) e com o **isolamento regulatório** da Seção 5 do `specify.md` (**sem** `Token Hub`, `Capital Hub` ou `LIE`), recomenda-se exibir apenas métricas financeiras operacionais e de retorno em duas telas:

### 2.1 Módulo `Gestão de Ligas` (Visão B2B — `Liga Esportiva`)
1. **Ocupação & Mix do Cluster (`Atletas Ativos / Capacidade` e `% Pro`):** Ex.: `40 atletas vinculados (38 Base / 2 Pro — 5% conversão)`. Demonstra na prática a mecânica de **subsídio cruzado** (cada liga viabiliza atletas em formação gratuita).
2. **Custo Efetivo por Atleta Engajado:** Indicador simples comparando a mensalidade simulada da liga (`R$ 490/mês`) pelo total de atletas ativos com evidências publicadas no mês (ex.: `R$ 12,25/atleta ativo`).
3. **Taxa de Homologação de Evidências (%):** Mede o aproveitamento da liga na geração de `Artefatos / Evidências` que alimentam o `Readiness Score (0–100)` e justificam a retenção B2B.

### 2.2 Módulo `Sponsorship` (`Sponsor Ops` — Visão Patrocinador & Atleta)
1. **Execução Orçamentária de Contrapartidas (`Comprometido vs. Entregue`):** Barra/KPI no funil mostrando valor patrocinado vs. percentual já comprovado por evidências reais no `Proof of Talent` (ex.: `R$ 12.000 | 75% entregue em evidências`).
2. **Custo por Evidência Validada (`CPE`):** Valor investido dividido pelo número de entregas auditáveis publicadas pelo atleta/liga (substitui métricas de vaidade por retorno mensurável).
3. **Valor de Mídia Estimado (`EMV` simulado no Mídia-Kit Dinâmico):** Estimativa conservadora de alcance/retorno de exposição das ativações do patrocinador, ancorando o ROI comercial sem tocar em instrumentos financeiros ou incentivos fiscais congelados.

---

## 3. Conformidade de Escopo e Terminologia
- **Módulos congelados respeitados:** Nenhuma métrica, botão ou fluxo de `Token Hub`, `Capital Hub` ou `LIE` incluído nas recomendações.
- **Vocabulário canônico:** Alinhado a `specify.md` (`Painel Central NGS`, `Liga Esportiva`, `Portal do Atleta`, `Artefato / Evidência`, `Protótipo / Experiência demonstrável`).
- **Saneamento de referências:** Verificado e livre de quaisquer menções excluídas por diretriz de governança.
