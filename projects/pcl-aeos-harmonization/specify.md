# Especificação — Harmonização do PCL AEOS

**ID:** PCL-AEOS-HARM-SPEC | **Etapa:** SPECIFY | **Status:** Proposta submetida à revisão humana  
**Data:** 2026-10-15 | **Baseline:** 7764976672696c19cabfeec19c17ec4b31331a0a

## 1. Objetivo

Definir os resultados exigidos e critérios de aceite para evoluir o AEOS de um conjunto significativo, mas divergente, de documentos e componentes para um sistema de arquitetura e conhecimento com autoridade explícita, evidência reproduzível, fronteiras claras e reconciliação contínua.

## 2. Escopo

### Dentro do escopo

- Inventariar documentos, fontes, diagramas, módulos, diretórios, workflows, métricas, evidências, ADRs, automações e cópias locais/remotas.
- Classificar autoridade, ciclo de vida, escopo, owner, localização canônica, público, versão e supersessão.
- Propor arquitetura canônica e mapa de módulos, workflows e fronteiras.
- Definir precedência entre políticas, padrões, arquitetura, ADRs, procedimentos, templates e materiais informativos.
- Completar governança: decisores humanos, papéis, responsabilidades, exceções, políticas e Stage Gates.
- Harmonizar nomes, diretórios, diagramas, workflows, artefatos, links e vocabulário.
- Criar registro de claims, métricas, metas, medições, custos, condições e evidências.
- Definir homologação técnica, avaliação independente, tratamento de falha e limites de alegações.
- Projetar reconciliação de conhecimento e detecção de deriva, após aprovação de design.
- Preparar prontidão fundacional sem iniciar os produtos estratégicos.

### Fora do escopo

- Construir a plataforma conversacional de transformação de ideias em projetos executáveis.
- Construir o produto multissistema para ingestão e reconciliação de corpora reais.
- Dar a agentes autoridade para aprovar arquitetura ou política.
- Declarar certificação ISO sem auditoria competente.
- Reescrever, mover ou apagar fontes antes de inventário, decisão de autoridade, migração reversível e aprovação humana.
- Tratar repositórios públicos, cópias locais, diretórios aninhados ou documentos de terceiros como core automaticamente.
- Executar restores, testes operacionais, releases, alterar serviços ou controles Git sem autorização e evidências apropriadas.

## 3. Terminologia e estados

**Fonte normativa:** artefato aprovado que impõe requisitos em escopo definido. **Fonte informativa:** contexto sem autoridade normativa. **Fonte canônica:** localização única da informação vigente. **Cópia derivada:** espelho cujo original e sincronização são conhecidos. **Conflito:** afirmações incompatíveis por significado, escopo, unidade, versão, tempo ou autoridade. **Claim:** afirmação verificável associada a fonte, escopo, estado e evidência. **Homologação:** decisão humana registrada sobre critérios definidos para versão e escopo identificados.

Estados candidatos de claim: proposto, meta, medido, alegado-não-reproduzido, não-verificado, reprovado, superado, retirado. Os nomes finais exigem aprovação. Rascunhos, propostas, alegações e exemplos não são normas ou resultados confirmados.

## 4. Requisitos e critérios de aceite

| ID | Requisito | Critério de aceite |
|---|---|---|
| HARM-FR-001 | Inventariar fontes e documentos. | Cada item tem ID, caminho/URI, origem/revisão, classe, autoridade, estado, owner/papel, assunto, relações com duplicatas e decisão pendente; exclusões têm justificativa. |
| HARM-FR-002 | Estabelecer hierarquia de autoridade. | Norma aprovada define precedência, resolução de conflitos, autoridade humana, delegação, exceções, recurso e registro; não há duas fontes supremas no mesmo escopo. |
| HARM-FR-003 | Aprovar arquitetura canônica. | Inventário aprovado distingue módulos conceituais, diretórios físicos, serviços, ferramentas, fontes externas e legado; diagramas primários têm owner e mesma revisão. |
| HARM-FR-004 | Definir fronteiras. | Cada repo/componente é core, satélite, experimento, legado, dependência/submódulo, espelho ou relacionado, com owner, versão, licença, sincronização e autoridade. |
| HARM-FR-005 | Normatizar governança e gates. | Fonte aprovada define objetivo, entradas, critérios, responsável, autoridade aprovadora, evidências, saída, falha, exceção e retorno; TLC e gates históricos têm mapeamento explícito. |
| HARM-FR-006 | Harmonizar módulos e artefatos. | Documentos primários concordam em nomes, responsabilidades, interfaces, sequência e caminhos; duplicatas têm decisão e apontadores. |
| HARM-FR-007 | Rastrear indicadores e claims. | Cada claim prioritário define unidade, população, tipo (meta/medição/SLA), método, ambiente, versão, amostra, data, tolerância, owner, evidência, validade e estado. |
| HARM-FR-008 | Substanciar homologações. | Cada homologação identifica escopo, baseline, critérios versionados, ambiente, procedimento, logs, artefatos, resultados, limitações, não conformidades, executor e revisor humano. |
| HARM-FR-009 | Calibrar alegações de conformidade. | Autoavaliação, auditoria independente e certificação são estados distintos; claims absolutos têm prova e escopo adequados ou são limitados/retirados. |
| HARM-FR-010 | Corrigir navegação. | Links first-party passam por verificador; caminhos locais são removidos de conteúdo portável e exceções externas são documentadas. |
| HARM-FR-011 | Reconciliar conhecimento. | Processo preserva proveniência, detecta duplicata/conflito sem apagar escopo, propõe resolução pela autoridade e exige arbitragem humana em conflito material. |
| HARM-FR-012 | Prevenir deriva. | Mudanças normativas têm owner, revisão, impacto, aprovação e atualização de derivados; verificações detectam links, metadados e claims incompletos. |
| HARM-FR-013 | Garantir continuidade. | README, STATE e CONTINUATION guardam premissas, decisões, artefatos, baseline, evidências, bloqueios e próxima ação, suficientes para uma nova sessão. |
| HARM-FR-014 | Criar readiness fundacional. | Checklist objetivo e decisão humana explícita liberam projetos dependentes; concluir este plano não basta para declarar prontidão. |

## 5. Requisitos não funcionais e segurança

| ID | Requisito | Critério de aceite |
|---|---|---|
| HARM-NFR-001 | Auditabilidade ponta a ponta. | Claim → fonte → critério → evidência → revisão → decisão é navegável por IDs. |
| HARM-NFR-002 | Reprodutibilidade proporcional ao risco. | Critérios críticos podem ser repetidos com ambiente e instruções registrados ou têm impedimento declarado. |
| HARM-NFR-003 | Mínimo privilégio. | Agentes podem inventariar/propor; autoridade humana aprova normas, exceções e conflitos materiais. |
| HARM-NFR-004 | Proveniência e integridade. | Fontes externas registram origem/revisão/licença quando conhecida; hash não é apresentado isoladamente como prova de autoria/aprovação. |
| HARM-NFR-005 | Privacidade. | Minimização de dados, ausência de segredos, acesso mínimo, retenção e tratamento de fontes como conteúdo não confiável. |
| HARM-NFR-006 | Portabilidade. | Documentos essenciais são Markdown legível e links relativos/estáveis; continuidade não depende de chat ou licença. |
| HARM-NFR-007 | Sustentabilidade. | Controles recorrentes têm owner, frequência, custo/limite, sinal de falha e procedimento corretivo. |
| HARM-NFR-008 | Evolução compatível. | Normas têm status, vigência, histórico e migração; legado não é apagado silenciosamente. |
| HARM-NFR-009 | Linguagem calibrada. | Metas, SLAs, medições, exemplos e hipóteses são rotulados e limitados. |
| HARM-NFR-010 | Não regressão. | Nova fonte concorrente exige decisão, precedência e plano de sincronização. |

## 6. Baseline e limitações

A auditoria de origem é [DOCUMENTATION-AUDIT-2026-10-15.md](../../governance/audits/DOCUMENTATION-AUDIT-2026-10-15.md). Foi revisão estática: achados não equivalem a validação operacional. O snapshot local era commit 7764976672696c19cabfeec19c17ec4b31331a0a, coincidente com o master público no momento; reconferir antes da execução.

As contagens de 911 Markdown e 1.531 destinos internos sem resolução valem para aquele snapshot e método. Seis links first-party foram confirmados manualmente; 1.525 casos OmniRoute mostram padrões de localização, mas não tiveram revisão semântica individual. Claims de RTO, latência, VRAM, custo, volume de claims e conformidade permanecem alegações até verificação conforme critérios aprovados.

## 7. Dependências e restrições

- TLC exige aprovação explícita entre SPECIFY, DESIGN, TASKS e EXECUTE.
- Sponsor, owners de domínio e revisor independente ainda precisam ser identificados.
- Acesso, escopo, licença e sensibilidade de cada fonte serão confirmados no inventário.
- Migração requer análise de impacto, apontadores e reversibilidade.
- Segurança, restore, privacidade e claims financeiros podem exigir especialistas diferentes.
- Esforço e orçamento ainda não estimados.
- Esta pasta é o registro do projeto; a localização da documentação normativa final do AEOS é decisão pendente, evitando duplicação.

## 8. Decisões pendentes

| ID | Questão | Proposta para avaliação | Autoridade |
|---|---|---|---|
| HARM-DEC-001 | Raiz normativa da governança | Índice único aprovado e documentos subordinados por assunto. | Sponsor |
| HARM-DEC-002 | Precedência documental | Política > padrão > ADR dentro do escopo > procedimento > guia/template > relatório/exemplo. Formalizar exceções. | Sponsor |
| HARM-DEC-003 | Nomes e critérios de gates | Definir sem perpetuar numeração conflitante; mapear TLC, AEOS e homologação. | Sponsor |
| HARM-DEC-004 | Fronteiras de Dashboard/satélites | Classificar cada repositório com seu owner; não inferir autoridade pela versão declarada. | Owners |
| HARM-DEC-005 | Localização da norma final | Selecionar uma fonte canônica no core e manter esta pasta como histórico de projeto. | Sponsor |
| HARM-DEC-006 | Evidência dos indicadores | Distinguir meta, SLA e medição e definir dados mínimos por claim. | Owners/revisor |
| HARM-DEC-007 | Liberação dos projetos futuros | Readiness objetiva e aprovação explícita. | Sponsor |

## 9. Aprovação

Aprovar esta SPECIFY autoriza preparar DESIGN. Não autoriza alteração de documentos AEOS, migração, execução, publicação, release ou início dos projetos estratégicos.

**Aprovação:** pendente do patrocinador humano.  
**Próxima etapa:** DESIGN somente após aprovação explícita.
