==================================================
OBJETIVO
==================================================

Definir o propósito e o funcionamento da camada de Modelos (Models) no Runtime do PromptCoreLabs_AEOS.

Esta camada abstrai o acesso a modelos de linguagem (LLM) comerciais e locais, garantindo independência de fornecedor e mitigando custos de API.

==================================================
PRINCÍPIOS DA CAMADA DE MODELOS
==================================================

1. Independência Total
   Nenhum componente ou agente do AEOS está acoplado a um modelo ou fabricante específico. A substituição de modelos ocorre de forma puramente declarativa no Gateway de IA.

2. Roteamento Inteligente (EBITDA Shield)
   A execução prioriza modelos locais e de baixo custo (Flash) para tarefas repetitivas, delegando tarefas complexas de raciocínio a modelos maiores da nuvem somente quando estritamente necessário.

3. Redundância e Fallback
   Se um provedor de nuvem falhar ou ficar indisponível, as requisições devem ser automaticamente direcionadas para modelos locais alternativos.

==================================================
ESTRUTURA DE DOCUMENTOS
==================================================

• routing.md
  Mapeamento lógico de roteamento de modelos de IA, controle de custos e regras de hierarquia de tiers no OmniRoute.

• local-models.md
  Guia de configuração e uso de LM Studio e Ollama para servir modelos open-source na máquina host local.

==================================================
FONTES DE REFERÊNCIA
==================================================

runtime/README.md

PCL_INFRA_STACK_v2.md
