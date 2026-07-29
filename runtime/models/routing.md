==================================================
OBJETIVO
==================================================

Descrever o funcionamento lógico, as regras de roteamento e a estratégia EBITDA Shield implementados pelo OmniRoute (AI Gateway) do PromptCoreLabs_AEOS / PCL Cortex.

==================================================
OMNIROUTE (AI GATEWAY CENTRAL)
==================================================

O OmniRoute atua como o ponto único de entrada para todas as chamadas de IA originadas por agentes de software ou Execution Providers.

• Localização física: container `pcl-omniroute` na porta `20130`.
• Objetivo: interceptar chamadas, aplicar limites de tokens, registrar telemetria de consumo e rotear requisições para a melhor IA disponível.

==================================================
HIERARQUIA DE ROTAS (TIERS)
==================================================

O tráfego de requisições de IA é dividido em três camadas de custo e capacidade intelectual:

1. TIER-1 (High Logic)
   • Modelos Primários: Claude 3.5 Sonnet / Gemini 3.1 Pro (Cloud).
   • Casos de uso: análise de arquitetura, validação de especificações (specify.md), tomada de decisões estruturais e design de sistemas complexos.
   • Foco: precisão máxima e raciocínio profundo.

2. TIER-2 (Fast Execution)
   • Modelos Primários: Gemini 3 Flash / GPT-4o-mini (Cloud).
   • Casos de uso: escrita rápida de código fonte pelo Builder, criação de layouts UI básicos, refatoração de código pontual e preenchimento de checklists.
   • Foco: velocidade e economia de tokens em contextos curtos.

3. TIER-3 (Local Zero Cost / Cloud Fast Fallback)
   • Modelos Primários Locais: Qwen3-Coder-30B (LM Studio) / Gemma 3 4B (Ollama) (Local).
   • Fallback Primário Cloud Fast: Gemini 3 Flash / GPT-4o-mini (Cloud).
   • Diretriz de Fallback: Quando o ambiente local (LM Studio / Ollama) estiver inativo ou indisponível, o TIER-3 redireciona automaticamente para o Cloud Fast (Gemini 3 Flash / GPT-4o-mini), mantendo altíssima velocidade e baixo custo de tokens.
   • Casos de uso: triagem de micro-loop (Trivial Gate), coleta de evidências de micro-loop, formatação e rotulação de logs, auditoria adversária do agente QA (`reviewer-qa.md`).
   • Foco: latência ultra-baixa, custo mínimo de tokens e continuidade operacional.

==================================================
ESTRATÉGIA EBITDA SHIELD
==================================================

O EBITDA Shield é o algoritmo de otimização de custo que rege o roteamento:

• Se uma tarefa é classificada como de baixa complexidade cognitiva ou micro-loop, ela é forçada para o TIER-3 (Local ou Cloud Fast Fallback) ou TIER-2 (Flash).
• Nenhuma chamada deve atingir o TIER-1 a menos que o tipo de agente (ex: Architect/Planner em etapa Specify/Design) o exija explicitamente.
• Limitação de Contexto: o OmniRoute limpa redundâncias de prompts de histórico (heartbeats) antes de despachar a chamada para modelos Cloud cobrados por token.

==================================================
LÓGICA DE FALLBACK AUTOMÁTICO
==================================================

O OmniRoute gerencia falhas de conexão de forma transparente para as aplicações:

1. Se TIER-1 (Cloud High Logic) falhar (limite de requisições, erro 503, falta de créditos):
   ↓
   OmniRoute redireciona automaticamente para TIER-2 (Cloud Fast) ou TIER-3.

2. Se TIER-3 (Local LM Studio/Ollama) estiver inativo/desconectado:
   ↓
   OmniRoute redireciona automaticamente para o Fallback Primário Cloud Fast (Gemini 3 Flash / GPT-4o-mini).
   ↓
   A requisição é completada sem interrupção do agente de execução.

==================================================
FONTES DE REFERÊNCIA
==================================================

PCL_INFRA_STACK_v2.md

knowledge/patterns/pcl-cortex-micro-loop.md

runtime/harness/overview.md
