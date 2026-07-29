==================================================
OBJETIVO
==================================================

Definir o propósito e as diretrizes para a criação, documentação e aplicação de Padrões (Patterns) no PromptCoreLabs_AEOS.

Padrões são soluções de design reutilizáveis e estruturadas para problemas recorrentes de arquitetura, documentação e organização lógica.

==================================================
O QUE É UM PATTERN
==================================================

Diferente de um Standard (que define obrigatoriedades de nível técnico) e de um Playbook (que prescreve um passo a passo operacional), o Pattern define a estrutura e o formato de um conceito ou de um documento:

"Qual a anatomia correta e a especificação de estrutura que este tipo de artefato deve possuir?"

O uso de Patterns garante:

• Consistência estrutural em toda a documentação.
• Facilidade de parsing de documentos por agentes de IA.
• Padronização de tomada de decisões e disciplina operacional dos agentes.

==================================================
LISTA DE PADRÕES ATIVOS
==================================================

Os padrões ativos neste diretório são:

• pcl-cortex-micro-loop.md
  Padrão de micro-execução e disciplina operacional do PCL Cortex (Trivial Gate, Bounded Retries, Surgical Edits, Auditoria Adversária).

• tlc-spec-driven.md
  Anatomia, campos obrigatórios e estrutura de arquivos para a metodologia baseada em especificações.

• adr-pattern.md
  Template, convenção de nomenclatura e estrutura detalhada para o registro de decisões de arquitetura.

==================================================
DIRETRIZES DE EVOLUÇÃO
==================================================

Novos padrões devem ser propostos sempre que um formato de documento ou estrutura de design se repetir mais de duas vezes no repositório.

Qualquer novo padrão deve ser documentado de forma clara, contendo:
1. Anatomia do documento/estrutura.
2. Campos e metadados obrigatórios.
3. Exemplos reais de aplicação.

==================================================
FONTES DE REFERÊNCIA
==================================================

knowledge/README.md

foundation/governance/standards.md
