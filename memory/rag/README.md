==================================================
OBJETIVO
==================================================

Definir o propósito, arquitetura conceitual e diretrizes operacionais de Recuperação Aumentada de Geração (RAG) no PromptCoreLabs_AEOS.

O RAG permite aos agentes recuperar conhecimento e contexto relevante do repositório em tempo real para tomada de decisões, reduzindo consumo de tokens e evitando alucinações.

==================================================
COMO O RAG OPERA NO AEOS
==================================================

O RAG do AEOS atua interceptando as necessidades de contexto dos agentes durante a execução:

[ Repositório Git (Knowledge/Docs) ]
                │
                ▼ (Indexador)
[ Banco Vetorial / Índices Locais ]
                │
                ▼ (Busca Semântica por Similaridade)
[ Contexto Relevante Extraído ] ──► [ Injetado no Prompt do Agente ] ──► [ LLM Gateway ]

Diferente de sistemas RAG tradicionais que expõem toda a base a APIs externas de nuvem, o RAG do AEOS prioriza indexadores e bancos vetoriais locais para manter a segurança do IP da PromptCore Labs.

==================================================
ARQUIVOS DO SUBMÓDULO
==================================================

• vector-infrastructure.md
  Especificações técnicas dos bancos de dados vetoriais locais (ex: PGVector no Docker local) e gerenciados.

• indexing-rules.md
  Regras de fragmentação (chunking), metadados obrigatórios e ciclo de atualização da memória vetorial.

==================================================
PRINCÍPIOS OPERACIONAIS DO RAG
==================================================

• Integridade da Fonte de Verdade: as bases de RAG devem ser atualizadas automaticamente a cada novo commit aceito na branch master ou a cada mudança de Stage Gate aprovada.

• Filtragem Baseada em Papel (Role-Based Retrieval): agentes Builders não devem receber informações fora do escopo do projeto ativo; arquitetos possuem acesso amplo ao RAG do repositório todo.

• Caching Semântico: requisições idênticas feitas pelos agentes devem ser resolvidas localmente na memória vetorial para otimizar tempo de resposta e consumo de tokens.

==================================================
FONTES DE REFERÊNCIA
==================================================

memory/README.md

foundation/governance/standards.md
