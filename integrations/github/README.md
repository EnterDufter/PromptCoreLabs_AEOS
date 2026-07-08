==================================================
OBJETIVO
==================================================

Definir o papel e as diretrizes de integração entre o PromptCoreLabs_AEOS e o GitHub como plataforma de versionamento e controle colaborativo de código.

==================================================
PAPEL DO GITHUB NO AEOS
==================================================

O GitHub é o repositório físico de toda a estrutura documental e de código do ecossistema. Ele serve como:

• Fonte de verdade versionada: todo artefato documentado, desde a Foundation até os projetos ativos, existe primeiro como arquivo no repositório do GitHub.

• Gatilho de Sincronização de RAG: commits aceitos na branch master são o gatilho oficial para atualizar os índices da base de memória vetorial (memory/rag/).

• Auditoria de histórico: o git log é um registro permanente e imutável de quem alterou o quê e quando.

==================================================
DOCUMENTOS DISPONÍVEIS
==================================================

• repository-conventions.md
  Convenções oficiais de nomenclatura de branches, formato de mensagens de commit e protocolo de pull requests.

==================================================
FONTES DE REFERÊNCIA
==================================================

integrations/README.md

memory/rag/indexing-rules.md
