# Glossário de Termos & Taxonomia — PCL AEOS

==================================================
DICIONÁRIO DE TERMOS TÉCNICOS DA ARQUITETURA
==================================================

| Termo | Definição no Ecossistema PCL AEOS |
|---|---|
| **AEOS** | AI Engineering Operating System — O sistema operacional de engenharia para gestão de agentes e software. |
| **Cortex Visual Engine** | Motor de renderização visual interativa desenvolvido na persona Cortex para compilação de diagramas HTML standalone com SVG inline. |
| **Cortex** | Persona especializada em inteligência de sistemas e visualização arquitetural do PCL AEOS. |
| **EBITDA Shield** | Mecanismo de prompt caching e roteamento de custos no AI Gateway OmniRoute para otimização do uso de tokens. |
| **Execution Cell** | Unidade atômica de execução e log de tarefas processadas por um agente de IA no runtime. |
| **Harness** | Ambiente de desenvolvimento e execução contido no Docker Compose (`pcl-db`, `pcl-omniroute`, `pcl-paperclip`). |
| **Living Architecture** | Conceito de documentação viva e dinâmica onde diagramas e especificações evoluem em tempo real com o código. |
| **OmniRoute** | AI Gateway e proxy de inferência unificado (porta `:20130`) com fallback dinâmico entre modelos locais e nuvem. |
| **PaperClip** | Dashboard web de orquestração visual dos 15 papéis de agentes do PCL AEOS (porta `:3100`). |
| **PGVector** | Extensão de banco de dados vetorial para PostgreSQL 17 usada no `pcl-db` para buscas por cosseno em RAG. |
| **Stage Gates** | A suíte de 5 portas de aprovação sequenciais (Specify, Design, Tasks, Execute/QA, Signoff) da metodologia TLC v3. |
| **TLC Spec-Driven** | Metodologia de desenvolvimento orientada a especificações (`specify.md`, `design.md`, `tasks.md`, `validate.md`). |
| **Zero Secret Leak** | Política de segurança perimetral que proíbe a presença de segredos ou chaves sensíveis em código, logs ou diagramas. |
| **Coprocessador Laya** | Motor de inferência reflexa ultrarrápida (porta `:20140`, CPU INT8, <15ms) consumindo 0 MB de VRAM da GPU para classificação imediata de intenções e blindagem de custos. |
| **Memória Tripartida** | Arquitetura de persistência e RAG isolada no schema `memory.*` do PostgreSQL 17, dividida em chunks vetoriais (`document_chunks`), afirmações atômicas (`claims`) e recibos de prova (`evidence_receipts`). |
| **Claims Atômicas** | Afirmações conceituais e operacionais atômicas catalogadas com status e Tiers de confiança PCL (100 a 40), blindando os agentes contra alucinações. |
| **Evidence Receipts** | Recibos imutáveis com hashes criptográficos SHA-256 e commits que comprovam a origem documental e a linha exata de cada claim. |
| **Deterministic Staleness Daemon** | Sentinela que audita os 220 claims em 0,2s através de Git hook (`post-commit`) com custo computacional de 0 tokens de nuvem. |
| **Paperclip Agent Harness** | Sandbox de execução segura com confinamento Gate 3 (tool-call gating) e ponto de parada humana mandatória no Gate 4 antes de ações de risco. |
| **Reconciliação Canônica** | Algoritmo determinístico de arbitragem que resolve conflitos entre especificações e código utilizando a hierarquia de autoridade da verdade PCL. |
| **RTO Homologado (7.18s)** | Recovery Time Objective atestado em Stage Gate 4 para restauração completa da memória e base de dados a partir de snapshot frio AES-256 no Cloudflare R2. |

