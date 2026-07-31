# Glossário de Termos & Taxonomia — PCL AEOS

==================================================
DICIONÁRIO DE TERMOS TÉCNICOS DA ARQUITETURA
==================================================

| Termo | Definição no Ecossistema PCL AEOS |
|---|---|
| **AEOS** | AI Engineering Operating System — O sistema operacional de engenharia para gestão de agentes e software. |
| **Archify Engine** | Motor de renderização visual interativa desenvolvido na persona Cortex para compilação de diagramas HTML standalone com SVG inline. |
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
