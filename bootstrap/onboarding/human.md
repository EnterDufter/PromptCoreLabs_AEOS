==================================================
OBJETIVO
==================================================

Inicializar seres humanos — Product Owners, Arquitetos, Engenheiros, Gestores e qualquer colaborador — para que contribuam dentro do PromptCoreLabs_AEOS de acordo com seus princípios e governança.

==================================================
COMO COMEÇAR
==================================================

Passo 1 — Entender o que é o AEOS

O PromptCoreLabs_AEOS (AI Engineering Operating System) é uma plataforma arquitetural para governar projetos de engenharia assistida por Inteligência Artificial.

Ele não é um framework.
Ele não é uma IDE.
Ele não é um agente.
Ele não é um modelo LLM.

O AEOS é um sistema operacional de engenharia para IA.

Passo 2 — Ler a Foundation

A Foundation é a Fonte Oficial de Verdade do ecossistema.

Leitura obrigatória:

• foundation/FOUNDATION.md — documento constitucional
• architecture/principles.md — princípios permanentes
• architecture/modules.md — decomposição arquitetural
• architecture/repository-structure.md — estrutura do repositório

Passo 3 — Ler a Governance

A Governance define como o AEOS evolui de forma disciplinada.

Leitura obrigatória:

• governance/governance.md — constituição da governança
• governance/roles.md — papéis e responsabilidades
• governance/decision-authority.md — quem decide o quê
• governance/policies.md — políticas operacionais
• governance/stage-gates.md — critérios de avanço entre fases
• foundation/governance/compliance.md — conformidade
• foundation/governance/standards.md — padrões obrigatórios

==================================================
COMO CONTRIBUIR
==================================================

Toda contribuição dentro do AEOS deve respeitar o seguinte fluxo:

1. Verificar alinhamento com os princípios arquiteturais.
2. Registrar a decisão como ADR se impactar a arquitetura.
3. Seguir a metodologia TLC Spec-Driven v3 para iniciativas de desenvolvimento.
4. Obter aprovação antes de implementar qualquer mudança significativa.
5. Garantir rastreabilidade de todo artefato produzido.

==================================================
PAPÉIS HUMANOS NO AEOS
==================================================

Arquiteto

Define e protege a integridade arquitetural do ecossistema.
Aprova ADRs.
Garante que a Foundation permaneça estável.

Product Owner

Define prioridades de evolução da plataforma.
Aprova especificações.
Autoriza mudanças de stage gate.

Engenheiro

Implementa artefatos dentro das especificações aprovadas.
Utiliza Execution Providers sob a governança do AEOS.
Reporta desvios e bloqueios.

Auditor

Verifica conformidade com a Foundation e os Standards.
Registra não conformidades.
Propõe planos de remediação.

Consulte governance/roles.md para a definição completa de todos os papéis.

==================================================
COMO REGISTRAR DECISÕES ARQUITETURAIS
==================================================

Qualquer decisão que impacte:

• a arquitetura;
• os princípios;
• os módulos;
• a governança;
• os padrões;

deve ser registrada por meio de um Architecture Decision Record (ADR).

O processo de ADR está definido em:

architecture/adr-process.md

==================================================
COMO INICIAR UM NOVO PROJETO
==================================================

Antes de iniciar qualquer projeto dentro do AEOS, leia:

bootstrap/project/new-project.md

==================================================
REGRAS FUNDAMENTAIS PARA HUMANOS
==================================================

• A Foundation não é negociável. Mudanças exigem ADR.

• Execution Providers são ferramentas. A autoridade arquitetural é humana.

• Documentação faz parte do produto. Não é opcional.

• Rastreabilidade é obrigatória. Toda decisão deve ter origem registrada.

• Aprovação precede implementação. Nenhum código vai para produção sem especificação aprovada.

• Evolução é bem-vinda. Mas jamais a custo de instabilidade arquitetural.

==================================================
FONTES DE LEITURA RECOMENDADAS
==================================================

Para entender a visão de longo prazo:

architecture/vision.md

Para entender o ciclo de vida das iniciativas:

architecture/lifecycle.md

Para entender o mapa arquitetural completo:

architecture/architecture-map.md

Para entender o glossário oficial:

architecture/glossary.md
