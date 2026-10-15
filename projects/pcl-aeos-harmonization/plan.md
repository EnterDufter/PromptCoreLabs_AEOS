# Plano de ação — Harmonização do PCL AEOS

**Versão:** 0.1.0 — proposta | **Data-base:** 2026-10-15  
**Estado:** planejamento; não é autorização para alterar o AEOS.

## Estratégia e pontos de decisão

Fazer primeiro o inventário e a autoridade; depois aprovar modelo normativo e arquitetura; reconciliar conteúdo e evidências; automatizar controles; homologar a fundação; só então avaliar projetos dependentes. Itens sem prova permanecem não verificados, com owner e risco.

As fases abaixo não são os Stage Gates atuais do AEOS. PD-01 a PD-08 são pontos provisórios deste projeto para evitar confusão com gates existentes. A numeração oficial só será definida e aprovada no design.

| Fase | Resultado | Dependência | Ponto de decisão |
|---|---|---|---|
| 0. Mandato e baseline | Sponsor, escopo e snapshots identificados. | SPECIFY aprovada | PD-01 autoriza inventário |
| 1. Inventário e triagem | Catálogo, conflitos e fronteiras preliminares. | Fase 0 | PD-02 valida cobertura |
| 2. Governança normativa | Autoridade, papéis, precedência, políticas e gates propostos. | Fase 1 | PD-03 aprova design normativo |
| 3. Arquitetura e fronteiras | Mapa canônico de módulos, workflows, diretórios e repos. | Fases 1–2 | PD-04 aprova arquitetura/ADRs |
| 4. Claims e homologação | Métricas, critérios e evidências rastreáveis. | Fases 2–3 | PD-05 aceita provas ou suspende claims |
| 5. Reconciliação e migração | Conflitos resolvidos; documentos atualizados em lotes reversíveis. | Fases 2–4 | PD-06 aprova lotes |
| 6. Prevenção de deriva | Verificações e owners recorrentes. | Fases 3–5 | PD-07 aceita controles |
| 7. Readiness e release | Revisão independente, dívida residual, decisão humana. | Todas | PD-08 libera ou não a fundação |

Não fazer migração destrutiva antes de autoridade, arquitetura e plano reversível aprovados.

## Fase 0 — Mandato, baseline e preparação

**Trabalho:** obter aprovação da SPECIFY; identificar sponsor, owner do AEOS, owners de domínio e revisor independente; fixar snapshots por caminho, URL, branch/tag/commit e data; inventariar fontes candidatas (core, projects, .specs, .agents, governance, foundation, bootstrap, architecture, docs, ADRs, workflows, scripts, relatórios, Dashboard e subtrees externos); classificar versionado, não versionado, ignorado, aninhado ou externo; registrar sensibilidade, licença, acesso e custo sem copiar segredos.

**Entregáveis:** termo de abertura, mapa provisório de autoridade, registro de fontes/snapshots, regras de inclusão e plano de evidências.

**PD-01 aceite:** autoridades e revisor identificados; escopo/exclusões aceitos; baseline reproduzível; itens locais não confundidos com releases publicados.

## Fase 1 — Inventário documental e triagem

**Trabalho:** catalogar Markdown, diagramas, dados estruturados, workflows, scripts, CI, ADRs, templates, relatórios, evidências e releases. Para cada item registrar DOC-ID, título, localização, repo/revisão, owner, classe de fronteira, assunto, autoridade alegada/confirmada, status, público, dependências, links, idioma, sensibilidade, hash quando aplicável e duplicatas. Detectar conflitos de nomes, gates, arquitetura, métricas, controles, versões, links e autoridade. Classificar erro, diferença de escopo/tempo, meta versus medição, conflito de autoridade, omissão, falta de prova e problema editorial. Graduação de risco deverá ser aprovada e considerar impacto, segurança, abrangência e reversibilidade. Reexaminar links first-party e distinguir conteúdo OmniRoute com regra própria. Confirmar owner dos itens não versionados, inclusive Dashboard.

**Entregáveis:** catálogo com cobertura/exclusões; matriz de fonte × assunto × autoridade; Conflict Register com CONFLICT-ID, fontes, impacto, opções, owner e arbitragem; mapa de links/dívida; resumo de risco.

**PD-02 aceite:** cobertura contabilizada contra snapshot; método/limitações declarados; conflitos críticos têm owner e rota de decisão; revisor reproduz contagens ou registra diferenças.

## Fase 2 — Fonte normativa, governança e autoridade

**Trabalho:** desenhar índice de fontes normativas e precedência por assunto. Hipótese para avaliar: política aprovada > padrão aprovado > ADR aprovado no escopo > procedimento > guia/template > relatório/exemplo. Definir exceções e resolver conflito entre política e ADR. Identificar autoridade humana final, owners, revisores, operadores e papel de agentes; IA pode localizar e propor, nunca aprovar ou arbitrar conflito de alto impacto. Criar RACI para requisitos, arquitetura, exceções, evidências, homologação, release e aposentadoria documental. Especificar estados documentais, metadados, versão, owner, aprovador, vigência, revisão, idioma, histórico, mirrors e retenção. Normatizar gates com objetivo, entradas, critérios, autoridade, evidência, saída, reprovação, exceção, rollback e reentrada. Mapear TLC, gates AEOS e homologações sem correspondência baseada apenas em nomes. Definir processo de conflito: detecção, classificação, contenção, owner/prazo, decisão, migração, histórico e recurso. Separar autoavaliação, auditoria independente, readiness e certificação.

**Entregáveis:** documento-raiz de governança e índice normativo; authority matrix/RACI; ciclo documental; padrão de gates/mapeamento; política de conflitos, claims e exceções; ADRs candidatos em estado proposto.

**PD-03 aceite:** autoridade humana identificada por função crítica; uma simulação de conflito produz decisão determinística e registrada; gates operacionais sem instruções em aberto; aprovação do sponsor.

## Fase 3 — Arquitetura canônica e fronteiras

**Trabalho:** manter quatro mapas distintos: arquitetura conceitual, contratos de módulos, layout do repo, topologia de runtime/deploy. Catálogo de módulos terá ID, nome, propósito, responsabilidades, interfaces, dependências, owner, nível conceitual/implementado/proposto, localização e versão. Classificar diretórios como core, docs, exemplo, ferramenta, produto, legado, vendor/submodule, mirror, projeto independente ou gerado. Definir limites de OmniRoute, Cortex, Dashboard, projetos, external-references e repos aninhados; registrar owner, repo canônico, versão/commit, licença, mudança, sync, interfaces e autoridade. Reconciliar contagens sem misturar níveis. Identificar ciclos, duplicatas e itens sem owner. Criar glossário, aliases e convenções. Produzir mapa antes/depois para diagramas e páginas, com redirect e rollback. Criar ADRs individuais, explicitando opções, consequências e autoridade.

**Entregáveis:** arquitetura canônica em níveis; catálogo de módulos; mapa de diretórios; boundary register; glossário; ADRs; plano de referência/migração.

**PD-04 aceite:** itens críticos têm classe e owner; módulos conceituais não são confundidos com pastas; dependências externas têm origem e versão; documentos compartilham baseline; owners e sponsor aprovam.

## Fase 4 — Métricas, claims, evidências e homologação

**Schema mínimo:** METRIC-ID/CLAIM-ID; enunciado; população; unidade; tipo (meta, SLA, baseline ou medição); fonte normativa; versão de código/instrumento; ambiente/hardware; input e amostra; método/comando; data; resultado/incerteza; limites; log/artefato; hash/referência; revisor; status; validade e próxima revisão.

**Trabalho:** reconciliar divergências da auditoria sem escolher valor por preferência: RTO 7,18 s/4 s/SLA 15 min; latência Laya <15/<35/<40 ms e amostra de 53,32 ms; VRAM “0 MB”/7 MB/limite 600 MB; embeddings 768/1536; claims 220/52; custo cloud $0.00. Distinguir métricas, populações, períodos, targets, SLAs e execuções. Definir tolerância, repetição, carga, hardware, método e tratamento de falha. Fazer revisão de segurança do restore e especificar comportamento fail-closed para falta de chave/OpenSSL, descriptografia incompleta, integridade, exit code e validação pós-restore. Submeter correção de código e execução a fluxo TLC separado. Vincular homologações a commit, critérios versionados, ambiente, entradas, logs e revisor; distinguir auto-homologação de revisão independente. Reclassificar relatório histórico como alegado até reprodução. Mapear ISO/Zero Trust a escopo e evidências; sem prova adequada, limitar linguagem. Abrir processo de não conformidade com severidade, owner, causa, correção, reteste e aceite residual.

**Entregáveis:** registro de claims e métricas; protocolo de homologação; dossiês de evidência; claims não reproduzidos/reprovados/superados; não conformidades e correções propostas.

**PD-05 aceite:** nenhum claim crítico parece comprovado sem prova; critério é repetível ou limitação aceita pela autoridade; hash/texto de teste não substitui execução; linguagem de conformidade corresponde ao trabalho feito.

## Fase 5 — Reconciliação e migração documental

Executar lotes pequenos: congelar revisão/hash; confirmar autoridade e conflitos; preparar diff antes/depois e rastreabilidade; rodar verificações; obter revisão de owner e aprovação; integrar preservando histórico, redirects e README apontador; atualizar inventário e STATE; reverter se critério falhar e registrar incidente.

**Ordem sugerida:** (1) Foundation/governança/Bootstrap; (2) arquitetura, README, módulos e diagramas; (3) métricas, testes e homologação; (4) templates, workflows e memória; (5) links, caminhos locais e materiais externos conforme acordo.

**Entregáveis:** lotes revisáveis, matriz de rastreabilidade, supersessões/redirects, log de decisões e inventário atualizado.

**PD-06 aceite:** cada lote tem aprovação, critério e rollback; nada apagado sem decisão; nenhuma norma duplicada ativa sem precedência e sync definidos.

## Fase 6 — Reconciliação de conhecimento e prevenção de deriva

**Capacidade mínima a projetar:** registro de fonte com owner/URI/revisão/permissões; proveniência até afirmação e trecho; normalização terminológica que preserva diferenças semânticas e temporais; detecção de duplicatas e conflitos por escopo, versão, população, autoridade e data; resolução conforme hierarquia; saída como proposta rastreável com limitações; aprovação humana de conflito material e mudança normativa; log append-only de decisão e replay por versão de regra/fonte; controle de acesso, redação, segregação e retenção; métricas de cobertura de proveniência, conflitos pendentes, falsos positivos validados e tempo de resolução.

**Controles recorrentes a projetar:** verificador Markdown/anchors; metadados, owners, datas e IDs; lint de instruções de rascunho em normas; claims sem evidência/unidade/validade; árvore de repos/submodules; referências supersedidas; relatório de reconciliação em CI/release; revisão periódica por risco.

**Entregáveis:** processo operacional aprovado, design técnico posterior, política de sync/origem, backlog de automação com custo/owner, resposta a deriva e pacote de auditoria por release.

**PD-07 aceite:** mudança normativa sem revisão/aprovação é bloqueada ou sinalizada; saídas mantêm proveniência; conflito material nunca se funde automaticamente; controles têm owner, frequência e procedimento de falha.

## Fase 7 — Homologação fundacional e readiness

**Checklist proposto:** normas aprovadas e sem instruções por completar; autoridade e exceções aplicáveis; arquitetura/fronteiras validadas; métricas definidas e claims sem prova retirados ou marcados; homologações rastreáveis; links e controles ativos; riscos críticos fechados ou formalmente aceitos; reconciliação avaliada em corpus controlado; owners/custo/manutenção/rollback definidos; release e baseline identificáveis; STATE/handoff atualizados.

**Entregáveis:** relatório independente, não conformidades e aceite residual, decisão humana Foundation Ready / Not Ready / Ready with Conditions, release e índice de normas vigentes.

**PD-08:** sponsor declara escopo, versão, condições, limites e projetos liberados. Readiness não significa segurança absoluta, certificação ISO ou produção irrestrita.

## Fronteira dos projetos estratégicos

### Produto A — ideias em projetos executáveis

Visão futura: interface conversacional orientada à engenharia, arquitetura viva e execução assistida; múltiplos modelos/provedores locais (LLM, SLM, Laya sujeito a definição), soberania, privacidade, auditabilidade, baixo custo e isolamento (Docker/Tailscale a avaliar). Gate: PD-08 e projeto TLC separado, com ameaça, dados, provedores e execução aprovados. Este plano não escolhe tecnologia.

### Produto B — conhecimento multissistema

Esta iniciativa trata da governança, proveniência, processo e design de reconciliação. Ingestão de corpora reais e produto multi-ferramenta ficam em projeto separado após PD-08. Exigir corpus autorizado, critérios de avaliação, licença, privacidade e retenção.

## Responsabilidades propostas (nomes pendentes)

| Atividade | Sponsor | Owner de domínio | Operador/agente | Revisor |
|---|---|---|---|---|
| Aprovar norma/arquitetura | A | C | R, proposta | C |
| Manter fonte canônica | A | R | R autorizado | C |
| Reconciliar fontes | A em conflito alto | R | detectar/propor | C/R |
| Homologar | A, aceita | R | executar/registrar | verificar |
| Readiness/release | A | C | preparar pacote | C/R |

A=autoridade final; R=responsável; C=consultado. É proposta, não RACI vigente. Acúmulo de papéis exige registrar risco de independência.

## Work packages iniciais

| WP | Trabalho | Prioridade | Saída |
|---|---|---:|---|
| WP-00 | Aprovar spec, sponsor, papéis e baseline | P0 | PD-01 |
| WP-01 | Inventário e classificação das fontes | P0 | Catálogo |
| WP-02 | Registrar conflitos da auditoria | P0 | Conflict Register |
| WP-03 | Hierarquia normativa e authority matrix | P0 | Governance Design |
| WP-04 | Stage Gates e mapa TLC/AEOS | P0 | Gate Standard |
| WP-05 | Arquitetura modular e fronteiras | P1 | Canonical Architecture |
| WP-06 | Registro de claims/métricas/evidências | P0 | Evidence Registry |
| WP-07 | Homologação e não conformidades | P0 | Qualification Standard |
| WP-08 | Migrar governança/arquitetura em lotes | P1 | Canonical Docs |
| WP-09 | Qualificar claims históricos | P1 | Evidence Dossiers |
| WP-10 | Links, metadados, lint e CI | P1 | Guardrails |
| WP-11 | Design da reconciliação de conhecimento | P1 | Reconciliation Design |
| WP-12 | Revisão, release e readiness | P0 | PD-08 package |

Prioridades e esforço devem ser revistos após inventário.

## Indicadores do projeto

- Cobertura do inventário = catalogados ÷ encontrados no snapshot.
- Cobertura de autoridade = famílias com fonte/owner/aprovador confirmados ÷ famílias normativas em escopo.
- Proveniência = claims prioritários com fonte e evidência/estado ÷ claims prioritários.
- Conflitos altos sem owner: meta zero no release; conflito aberto requer contenção, prazo e aceite formal.
- Regressões após release: medir; estabelecer baseline antes de meta.
- Tempo/custo por lote: medir com contexto antes de estipular objetivo.
- Reprodutibilidade: calcular entre claims prioritários reproduzíveis e reportar os não verificados separadamente.

## Riscos e respostas

| Risco | Resposta |
|---|---|
| Universo extenso, incluindo 911 Markdown e vendor | Escopo por fronteira/risco; vendor com regra própria; dimensionar após inventário. |
| Migrar antes de definir autoridade | Congelar baseline, aprovar hierarquia e usar lotes reversíveis. |
| Misturar meta, SLA e resultado | Registro de claims com estados e execução ligada à versão. |
| Automação fundir conflito incorretamente | IA/CI propõe; arbitragem humana para conflito material. |
| Fonte local parecer release | Registrar repo, origem, commit, owner e status. |
| Um operador aprovar o próprio trabalho | Sponsor/owner/revisor e independência explícitos. |
| Evidência conter dados sensíveis | Minimização, redação, controle de acesso e retenção. |
| Corrigir restore apenas na documentação | Separar plano da implementação e teste; fluxo TLC próprio. |
| Continuidade depender do chat/licença | Atualizar STATE/handoff em cada unidade. |
| Plano tornar-se norma concorrente | Marcar tudo como proposta; a norma aprovada fica em fonte única. |

## Regras de execução

1. Seguir TLC: aprovar SPECIFY antes de DESIGN, DESIGN antes de TASKS e TASKS antes de execução sistêmica.
2. O pedido atual autoriza criar e registrar o plano, não suas propostas como normas.
3. Cada sessão trabalha um lote revisável e atualiza STATE.
4. Antes de alterar o AEOS, declarar arquivos, autoridade, diff, rollback e validação.
5. Não executar restore, release, publicação, assinatura ou mudar serviços por inferência.
6. Falta de evidência significa não verificado, nunca aprovado.
7. Preservar histórico; superseder com decisão e apontadores.
8. Propostas permanecem separadas das decisões aprovadas.

**Próximo passo:** revisar e aprovar (ou corrigir) specify.md. Após aprovação, preparar DESIGN; após aprovação do DESIGN, detalhar TASKS.
