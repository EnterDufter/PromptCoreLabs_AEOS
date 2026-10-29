# Registro Calibrado de Métricas, Claims e Homologações

**ID:** `PCL-AEOS-CLAIM-01` | **Versão:** 1.0.0 | **Etapa:** DESIGN / CLAIMS  
**Projeto:** [Harmonização do PCL AEOS](..) (`PCL-AEOS-HARM`)  
**Autoridade:** Patrocinador Humano (User)  
**Data-Base:** 2026-10-15  
**Conformidade:** `HARM-DEC-006`, `HARM-FR-007`, `HARM-FR-008`, `HARM-FR-009`  

---

## 1. Princípio de Calibração e Rastreabilidade

Para sanar as divergências identificadas na auditoria documental de 2026-10-15 sem interromper a evolução da plataforma, toda métrica e afirmação operacional do PCL AEOS passa a ser explicitamente classificada em uma das seguintes categorias:

1. **`TARGET (Requisito de Engenharia)`**: Meta de design almejada pela arquitetura para novos componentes e releases.
2. **`SLA (Nível de Serviço Operacional)`**: Limite formal de tolerância máxima para operações em ambiente real.
3. **`BASELINE HISTÓRICO (Medição em Laboratório)`**: Resultado empírico obtido em execução pontual sob hardware, carga e dados específicos registrados.
4. **`LIMITAÇÃO DE CONFORMIDADE`**: Delimitação honesta do escopo de conformidade (diferenciando autoavaliação interna de certificação externa independente).

---

## 2. Reconciliação dos Claims Críticos da Auditoria

A tabela abaixo reconcilia e resolve definitivamente as 7 divergências identificadas na auditoria documental:

| Métrica / Claim | Divergência Histórica | Classificação Canônica | Valor Canônico Aprovado | Justificativa Técnica e Rastreabilidade |
| :--- | :--- | :---: | :---: | :--- |
| **RTO (Recovery Time Objective)** | 4 s vs. 7,18 s vs. 15 min | **SLA:** 15 min<br/>**Target:** < 10 s<br/>**Baseline:** 7,18 s | **SLA Máximo: 15 min**<br/>**Medição Histórica: 7,18 s** | O SLA contratual de recuperação do cluster PostgreSQL/DRP é de até 15 minutos. O tempo de 7,18s foi um baseline pontual obtido em script de teste local de restore. |
| **Latência do Laya (CPU)** | <15ms vs. <35ms vs. <40ms vs. 53ms | **Target:** < 35 ms<br/>**Benchmark MCP:** 0,014 ms | **Target: < 35 ms em CPU**<br/>(MCP stdio: ~0,014 ms) | A especificação exige decisões tipadas não-autoregressivas abaixo de 35ms em CPU. O benchmark do MCP local atingiu média de 0,014ms em lote de 50 claims. |
| **Alocação de VRAM do Laya** | "0 MB" vs. 7 MB vs. 600 MB | **Invariante:** 0 MB VRAM<br/>**Target RAM:** < 150 MB | **0 MB de VRAM (Zero GPU)** | O motor `CPUExecutionProvider` opera exclusivamente em memória RAM da CPU, preservando 100% da VRAM da GPU para modelos LLM/SLM. |
| **Dimensão de Embeddings PGVector** | 768 vs. 1536 dimensões | **Canônico Local:** 768<br/>**Opcional Cloud:** 1536 | **Padrão Canônico: 768**<br/>(all-MiniLM / nomic) | O padrão de soberania local do PCL AEOS adota 768 dimensões. Dimensões de 1536 são tratadas como extensões para provedores externos (ex.: OpenAI). |
| **Custo de Operação Cloud** | "$0.00" vs. Custos de API | **Modo Soberano:** $0.00<br/>**Modo Híbrido:** Variável | **$0.00 no Modo Local/Soberano** | Quando o AEOS opera 100% com Ollama, LM Studio e Laya em hardware próprio, o custo de inferência cloud é $0.00. Chamadas cloud via OmniRoute dependem da chave do usuário. |
| **Volume de Claims Normativos** | 220 claims vs. 52 claims | **Inventário:** 220 brutos<br/>**Prioritários:** 52 canônicos | **52 Claims Canônicos Prioritários** | Os 220 claims catalogados representam todas as menções em documentos legados. O conjunto consolidado de trabalho foi filtrado em 52 claims estruturais. |
| **Laya Neural NLI (Semântica)** | "Risco Zero / 100% Prevenção" vs. "Falsos Positivos" | **Ensaio Controlado (Dev + Holdout Cego)** | **Acurácia: 81,67%<br/>Especificidade: 93,33%<br/>Recall: 70,00%<br/>Precisão: 91,30%** | Avaliação em dataset canônico de 60 amostras (30 Dev / 30 Holdout) com desintoxicação de prefixos e threshold calibrado (0.60). Latência média de 23,9ms em CPU (0 MB VRAM). Atua estritamente como sensor consultivo, sem autoridade irrevogável autônoma para supersessão de memória. |
| **Projeções de Mercado (Cloud/7B)** | "Benchmark Científico Concorrente" vs. Estimativa | **Modelagem Teórica / Projeção** | **Hipótese de Dimensionamento** | Valores de latência (~1.350ms, ~480ms) e custo ($0.003) são estimativas teóricas adotadas para cálculo de economia potencial, não ensaio empírico controlado. |
| **Declaração de Zero Trust e ISO** | "Certificado ISO" vs. Autoavaliação | **Status:** Arquitetura Alinhada (Autoavaliação) | **Arquitetura Alinhada aos Princípios** | O PCL AEOS implementa princípios de isolamento Zero Trust e controles inspirados em normas ISO, mas **não possui certificação externa emitida por entidade credenciadora**. |

---

## 3. Diretriz para Documentos Derivados

A partir da vigência deste registro:
* Nenhum documento do repositório pode citar a medição de 7,18s de RTO como se fosse uma garantia contratual sem mencionar o SLA de 15 minutos.
* Toda citação à latência do Laya deve referenciar a meta de design `< 35ms` ou os laudos de benchmark registrados.
* Nenhum documento pode alegar "risco zero de alucinação", "superioridade científica homologada" ou "certificação ISO/IEC 42001" para o classificador probabilístico Laya.
* As comparações com nuvem ou modelos 7B devem ser rotuladas como projeções teóricas hipotéticas para dimensionamento arquitetural.
* Toda alegação de Zero Trust deve vir acompanhada da ressalva de conformidade arquitetural interna.
