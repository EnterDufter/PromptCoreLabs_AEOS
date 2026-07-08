==================================================
OBJETIVO
==================================================

Definir e catalogar os Model Context Protocol (MCP) Servers integrados ao ecossistema PromptCoreLabs_AEOS.

Os servidores MCP são pontes que permitem que Execution Providers (ex: Antigravity, Cursor, Claude Code) interajam com serviços externos de forma estruturada durante as sessões de trabalho.

==================================================
O QUE É UM MCP SERVER
==================================================

Um MCP Server é uma extensão de capacidade de Execution Providers que implementa o protocolo MCP (Model Context Protocol). Ele expõe ferramentas específicas que um agente de IA pode invocar diretamente durante a execução para:

• Ler e escrever em serviços externos (ex: Google Drive, NotebookLM).
• Executar ações em sistemas de terceiros sem sair do contexto de trabalho.
• Buscar e injetar conhecimento externo nos prompts de forma estruturada.

==================================================
SERVIDORES MCP ATIVOS
==================================================

• notebooklm.md
  Servidor MCP para integração com o NotebookLM como base de conhecimento semântico e ferramenta de auditoria.

==================================================
COMO ADICIONAR UM NOVO MCP SERVER
==================================================

1. Documente o novo servidor neste diretório com um arquivo descritivo.
2. Adicione-o ao catálogo de ferramentas em knowledge/catalog/tools-catalog.md.
3. Registre no bootstrap/environment/setup.md a instrução de configuração.

==================================================
FONTES DE REFERÊNCIA
==================================================

integrations/README.md

knowledge/catalog/tools-catalog.md
