==================================================
OBJETIVO
==================================================

Estabelecer as diretrizes de processamento, segmentação (chunking) e indexação de documentos do PromptCoreLabs_AEOS para inserção na base de memória vetorial.

Estas regras devem ser seguidas por qualquer agente indexador ou script de sincronização de RAG.

==================================================
1. ESCOPO DE INDEXAÇÃO
==================================================

O que DEVE ser indexado na base vetorial:
• Todos os arquivos da Foundation (foundation/, architecture/, governance/).
• Todos os arquivos do Bootstrap (bootstrap/).
• Todos os playbooks, padrões e catálogos (knowledge/).
• Especificações ativas de projetos (.specs/projects/).

O que NÃO DEVE ser indexado:
• Pastas de dependências (node_modules/).
• Código fonte de terceiros ou bibliotecas externas.
• Arquivos temporários (.tmp/, .git/).
• Arquivos de configuração pessoal (.env, segredos, chaves SSH).

==================================================
2. ESTRATÉGIA DE SEGMENTAÇÃO (CHUNKING)
==================================================

Para garantir que a recuperação semântica mantenha o sentido do contexto original:

• Tamanho do Chunk: 800 a 1200 caracteres (aproximadamente 200 a 300 tokens).
• Sobreposição (Overlap): 150 a 200 caracteres.
• Divisor Inteligente: os chunks devem respeitar quebras de seção representadas por delimitadores de linha (`===`) ou cabeçalhos Markdown (`#`, `##`, `###`), evitando cortar parágrafos importantes no meio.

==================================================
3. ESTRUTURA DE METADADOS OBRIGATÓRIA
==================================================

Cada vetor inserido no pgvector deve estar associado a um payload JSON contendo os seguintes metadados estruturados:

```json
{
  "source_file": "caminho/relativo/do/arquivo.md",
  "section": "título da seção ou cabeçalho correspondente",
  "last_modified": "timestamp no formato ISO 8601",
  "taxonomy": "tag de taxonomia do projeto (ex: PCL, AEOS)",
  "layer": "camada arquitetural (ex: Foundation, Bootstrap, Knowledge)",
  "sha_commit": "hash do commit git correspondente à versão do arquivo"
}
```

==================================================
4. SINCRO-LIFECYCLE (ATUALIZAÇÃO DE BASES)
==================================================

• Gatilho de Sincronização: a atualização da memória RAG ocorre após commits aprovados na branch master do repositório privado.

• Atualização Incremental: o indexador deve comparar o hash de arquivo (SHA-256) ou o hash git para atualizar na base apenas as fatias de arquivos que foram modificadas no último commit, economizando recursos computacionais e chamadas de APIs de embeddings.

==================================================
FONTES DE REFERÊNCIA
==================================================

foundation/governance/standards.md

architecture/repository-structure.md

memory/rag/vector-infrastructure.md
