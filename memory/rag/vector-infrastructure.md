==================================================
OBJETIVO
==================================================

Definir as especificações técnicas da infraestrutura de banco de dados vetorial local e em nuvem aprovada para o PromptCoreLabs_AEOS.

==================================================
1. BANCO VETORIAL PRINCIPAL: PGVECTOR (LOCAL)
==================================================

Para garantir a soberania de dados e manter compatibilidade com o Harness Engineering, o banco vetorial principal é integrado à base PostgreSQL do ecossistema.

Especificações:
• Container Docker: pcl-db
• Base de Dados: PostgreSQL v17-alpine
• Extensão Vetorial: pgvector (instalada e ativada por padrão na imagem de banco de dados).
• Porta de Conexão: 5432 (local)
• Driver recomendado: pg (NodeJS/Python) com suporte nativo a vetores de similaridade de cosseno.

Prós da Escolha:
• Unificação de dados operacionais e vetoriais em um único container persistente.
• Baixo overhead de recursos e isolamento total no ambiente host do desenvolvedor.

==================================================
2. BANCO VETORIAL ALTERNATIVO: QDRANT (CONTAINERIZADO)
==================================================

Caso o projeto necessite de busca semântica em grande escala com índices de grafos HNSW de alta performance:

• Serviço: qdrant/qdrant (imagem Docker oficial).
• Porta Padrão: 6333 (API REST / gRPC).
• Configuração: Adicionar o serviço ao arquivo docker-compose.yml do Harness caso o módulo RAG seja ativado para projetos massivos de RAG.

==================================================
3. MODELOS DE EMBEDDINGS APROVADOS
==================================================

Para converter textos em vetores, as seguintes opções são autorizadas:

Opção Local (Custo Zero e Privacidade):
• Servidor: Ollama (host local na porta 11434)
• Modelo: nomic-embed-text (ou similar aprovado pela governança).
• Dimensões do vetor: 768.

Opção Cloud (Alta Precisão):
• Provedor: Google Vertex AI (API Gecko) / OpenAI text-embedding-3-small.
• Dimensões: 768 ou 1536.
• Rota: Interceptado pelo OmniRoute Gateway para controle de custos de tokens.

==================================================
CONTROLE DE ACESSO E CONEXÃO
==================================================

• A conexão do contêiner de agentes (ex: PaperClip) com a base vetorial local utiliza a string de conexão interna:
  postgresql://paperclip:paperclip@db:5432/paperclip

• Chaves e chaves de API dos provedores de embeddings cloud não devem ser escritas no código fonte do indexador, devendo ser injetadas exclusivamente via variáveis de ambiente no container `omniroute` ou `paperclip`.

==================================================
FONTES DE REFERÊNCIA
==================================================

docker-compose.yml

runtime/harness/overview.md

PCL_INFRA_STACK_v2.md
