| Campo | Valor |
|---|---|
| ID | ADR-0001 |
| Título | Memory Module Segregation from Knowledge |
| Status | Accepted |
| Data | 2026-07-08 |
| Autor | Antigravity (Google DeepMind) — sessão colaborativa |
| Aprovador | Usuário (PromptCore Labs) |

---

==================================================
1. CONTEXTO
==================================================

Durante o processo de consolidação da Foundation v1.0, o ecossistema AEOS possuía um único módulo implícito de "conhecimento" sem distinção entre conhecimento explícito e legível por humanos (documentação, playbooks, padrões) e conhecimento computacional persistente (índices vetoriais, embeddings, contexto de sessão de agentes).

O mapa arquitetural inicial referenciava apenas um bloco genérico de "conhecimento" sem separação formal de responsabilidades.

==================================================
2. PROBLEMA
==================================================

A ausência de separação explícita entre conhecimento documentado (estático, legível por humanos) e memória computacional persistente (dinâmica, legível por máquinas) gerava os seguintes riscos:

• Agentes poderiam misturar padrões de acesso de leitura de documentação com operações de leitura e escrita de índices vetoriais, criando acoplamento indesejado.

• A escolha de tecnologia de armazenamento vetorial (pgvector, Qdrant) seria desnecessariamente imposta ao módulo de documentação.

• A governança de atualização diferia: documentação é atualizada por humanos via commits Git; memória é atualizada por agentes em tempo de execução.

==================================================
3. ALTERNATIVAS CONSIDERADAS
==================================================

Alternativa A — Módulo único `knowledge/`
• Prós: estrutura mais simples com menos diretórios.
• Contras: mistura responsabilidades de natureza, ciclo de atualização e tecnologia fundamentalmente diferentes.

Alternativa B — Módulos separados `knowledge/` e `memory/`
• Prós: separação clara de responsabilidades; permite evolução independente de tecnologias; alinha com o princípio de baixo acoplamento.
• Contras: adiciona um diretório ao repositório.

==================================================
4. DECISÃO
==================================================

Adotar a Alternativa B: criar os módulos `knowledge/` e `memory/` como módulos independentes e complementares no ecossistema.

==================================================
5. JUSTIFICATIVA
==================================================

Esta decisão está alinhada com o princípio arquitetural de **Alta Coesão e Baixo Acoplamento** definido em `architecture/principles.md` e com o princípio de **Independência Tecnológica** da Foundation: memória vetorial pode mudar de pgvector para Qdrant ou outro provedor sem impactar a estrutura documental do knowledge.

==================================================
6. CONSEQUÊNCIAS
==================================================

Positivas:
• Agentes podem consumir knowledge (leitura de documentos) sem acesso ao módulo de memória computacional.
• As tecnologias de RAG e embedding podem evoluir sem impactar a documentação estática.
• A Governance de atualização de cada módulo é distinta e clara.

Negativas / Trade-offs:
• Um diretório adicional no repositório.
• Agentes e Execution Providers precisam entender a distinção entre os dois módulos.

==================================================
7. PLANO DE REVERSÃO
==================================================

Caso se decida reverter esta decisão e unificar os módulos, criar um novo ADR (ADR-0005 ou posterior) declarando ADR-0001 como Superseded, migrar os arquivos de `memory/` para `knowledge/memory/` e atualizar todos os documentos que referenciam o caminho de `memory/`.

==================================================
8. IMPACTO ARQUITETURAL
==================================================

• `architecture/modules.md` — definição dos dois módulos.
• `architecture/architecture-map.md` — atualizado para exibir Knowledge e Memory como módulos paralelos convergindo para Agents.
• `architecture/repository-structure.md` — listagem de ambos os módulos.
• `memory/README.md` — criado.

==================================================
9. DOCUMENTOS RELACIONADOS
==================================================

• architecture/modules.md
• architecture/principles.md
• memory/README.md
• knowledge/README.md
