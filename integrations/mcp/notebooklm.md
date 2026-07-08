==================================================
OBJETIVO
==================================================

Documentar a integração entre o PromptCoreLabs_AEOS e o NotebookLM via servidor MCP (Model Context Protocol).

O NotebookLM atua como o cérebro de auditoria semântica do ecossistema, permitindo que agentes e Execution Providers consultem bases de conhecimento curadas diretamente durante as sessões de trabalho.

==================================================
PAPEL DO NOTEBOOKLM NO AEOS
==================================================

O NotebookLM é utilizado para:

• Auditoria de Conhecimento: verificar se um novo documento ou decisão está alinhado com o conhecimento já existente e indexado nos notebooks do ecossistema.

• Consulta Semântica de Contexto: durante uma sessão de trabalho, o Execution Provider pode consultar o NotebookLM para recuperar definições, histórico de decisões e padrões sem carregar grandes arquivos de documentação no prompt.

• Base de Knowledge Externo: qualquer documentação de terceiros, PDFs de referência ou artigos relevantes são indexados no NotebookLM para enriquecer as consultas dos agentes.

==================================================
CONFIGURAÇÃO DO MCP SERVER
==================================================

O NotebookLM MCP Server é configurado no ambiente do Execution Provider como um servidor de ferramentas de contexto.

Pré-requisitos:
• Conta Google com acesso ao NotebookLM (notebooklm.google.com).
• Servidor MCP instalado e configurado no ambiente local.
• Autenticação OAuth configurada com as credenciais de serviço do Google.

Configuração Mínima Esperada (exemplo estrutural):
• Nome do servidor: notebooklm-mcp-server
• Ferramentas disponíveis:
  - notebook_query: consulta semântica em um notebook específico.
  - notebook_list: lista os notebooks disponíveis na conta.
  - notebook_add_text: adiciona um trecho de texto como fonte ao notebook.
  - notebook_add_url: indexa uma URL como fonte ao notebook.

==================================================
NOTEBOOKS DE REFERÊNCIA
==================================================

Os seguintes notebooks do NotebookLM são utilizados ativamente no ecossistema:

• AEOS Foundation — indexa todos os documentos da Foundation e Governance.
• AEOS Knowledge — indexa playbooks, padrões e catálogos do módulo knowledge/.
• PCL Infra Stack — indexa a documentação técnica da infraestrutura local.

==================================================
POLÍTICA DE USO
==================================================

• Dados sensíveis de clientes (PaperClip-Companies) NUNCA devem ser indexados no NotebookLM.

• Qualquer novo documento da Foundation deve ser sincronizado com o notebook AEOS Foundation após seu merge na branch master.

==================================================
FONTES DE REFERÊNCIA
==================================================

integrations/mcp/README.md

knowledge/catalog/tools-catalog.md

foundation/governance/compliance.md
