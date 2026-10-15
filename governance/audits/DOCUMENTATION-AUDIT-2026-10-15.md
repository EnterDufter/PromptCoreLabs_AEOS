# Auditoria documental do PCL AEOS

**Data:** 15 de outubro de 2026  
**Repositório:** `EnterDufter/PromptCoreLabs_AEOS`, branch `master`  
**Conclusão:** documentação útil como visão arquitetural, mas ainda inconsistente para servir como fonte operacional única ou como prova suficiente das homologações publicadas.

## Escopo e método

- Comparei o checkout local com o `master` público. Ambos estavam no commit `7764976672696c19cabfeec19c17ec4b31331a0a`; o blob local de `README.md` também coincide com o remoto.
- Inventariei 911 arquivos Markdown versionados e examinei em detalhe os documentos centrais de arquitetura, Foundation, governança, Bootstrap, memória, ADRs e homologação.
- Verifiquei 23.510 referências internas Markdown nos arquivos versionados. O rastreador detectou 1.531 destinos sem resolução: seis no material AEOS de primeira parte e 1.525 no subtree `OmniRoute`. Os seis casos de primeira parte abaixo foram conferidos manualmente. No OmniRoute, confirmei o padrão de caminho quebrado em links de idioma; não revisei semanticamente cada documento desse projeto incorporado.
- A pasta local também contém diretórios de repositórios separados que aparecem como não versionados: `.agents/skills/cloudflare/`, `external-references/mira-animator/` e `projects/PromptCoreLabs_AEOS_Dashboard/`. Eles não fazem parte do snapshot publicado de `master`. O README local do Dashboard declara “PCL AEOS v3.0.4 PROD”, portanto não deve ser apresentado como versão publicada do AEOS sem esclarecer a fronteira entre projetos.
- A revisão foi estática. Não executei as suítes de teste, os scripts de backup/restauração ou o portal interativo; os resultados citados nos documentos são tratados como afirmações do repositório, não como resultados reproduzidos nesta auditoria.

## Achados prioritários

### P1 — Documentos normativos centrais ainda são instruções de redação

`governance/stage-gates.md`, `governance/decision-authority.md`, `governance/roles.md` e `governance/policies.md` contêm instruções como “Definir”, “Explicar” e “Criar uma matriz semelhante”, embora se apresentem como documentos oficiais. Em particular, o Stage Gates não fixa gates operacionais com responsáveis e critérios aprováveis; a matriz de autoridade é solicitada como tarefa futura. `foundation/FOUNDATION.md`, `foundation/governance/standards.md`, `foundation/governance/compliance.md` e `bootstrap/environment/setup.md` também mantêm sinais de conteúdo por completar.

**Impacto:** outros documentos alegam gates homologados, aprovação humana e controles de compliance sem uma definição normativa completa e coerente que permita a um operador aplicar essas regras de forma reproduzível.

**Ação recomendada:** concluir ou marcar explicitamente esses arquivos como rascunhos; definir uma fonte normativa para autoridades, papéis, gates, critérios, evidências e tratamento de reprovação; só então alinhar diagramas, templates e relatórios.

### P1 — O laudo não prova sozinho os resultados quantitativos que anuncia

`governance/audits/STAGE-GATES-HOMOLOGATION-v2.md` declara aprovação de 100%, testes verdes e restauração em 7,18 segundos. Porém, `scripts/tests/test_phase4_validation.py` só impõe limite de 900 segundos para o restore; imprime uma frase com limite de 15 segundos e aceita até 600 MB de VRAM, não zero. O teste não fixa 7,18 segundos como critério nem vincula o resultado publicado a uma execução identificável.

Além disso, `scripts/backup/restore-aeos-tripartido.ps1` usa uma chave padrão de placeholder quando `BACKUP_ENCRYPTION_KEY` não está definida; quando OpenSSL não está disponível, copia o arquivo cifrado como se fosse o dump descriptografado; e o bloco `catch` apenas registra erro sem definir explicitamente um código de saída não zero. Esses caminhos tornam insuficiente a evidência apresentada para afirmar que a restauração cifrada foi concluída e cronometrada como descrito.

**Impacto:** RTO, integridade pós-restore e a garantia de criptografia não são comprovados pelo código de validação versionado tal como está. Este achado é uma análise estática; nenhum restore foi executado.

**Ação recomendada:** tratar os valores como resultados alegados até existir um relatório de execução rastreável por commit, ambiente, artefato de backup, comando, saída e medição. Fazer o caminho de restore falhar explicitamente quando faltar chave, OpenSSL ou qualquer etapa obrigatória.

### P1 — Alegações de conformidade e segurança excedem as evidências documentadas

O laudo cita ISO 42001 e ISO 27001 e conclui que o ecossistema está pronto para produção. Não encontrei no próprio laudo escopo de auditoria, matriz de controles, evidências por controle, tratamento de não conformidades ou identificação de uma auditoria externa. A política Zero Trust também usa garantias absolutas (“garantia absoluta” / “Zero Secret Leak”) sem um procedimento de verificação demonstrado no documento.

**Ação recomendada:** diferenciar claramente uma autoavaliação técnica de uma certificação ou auditoria independente; declarar escopo, versão, critérios e evidências e substituir garantias absolutas por controles verificáveis e seus limites.

## Achados de consistência e navegação

### P2 — A arquitetura não tem um inventário canônico coerente

`README.md` anuncia uma taxonomia de 14 diretórios, enquanto a árvore versionada contém 25 diretórios de primeiro nível. `foundation/FOUNDATION.md` lista oito módulos oficiais, incluindo `examples/` (ausente na raiz); `architecture/modules.md` define 13 módulos e diz que a implementação documental de Bootstrap ocorrerá posteriormente, embora Bootstrap já tenha documentação própria. As hierarquias também divergem: a Foundation coloca Runtime antes de Knowledge; `architecture/modules.md` e outros fluxos usam ordem diferente.

**Ação recomendada:** manter um inventário único com distinção entre módulos conceituais, diretórios físicos, componentes externos e material legado; atualizar README, Foundation e diagramas a partir dele.

### P2 — A numeração dos Stage Gates não possui uma correspondência explícita

O README descreve TLC v3 com Gates 1–5; o laudo formal enumera Gates 0–4; os documentos de memória e runtime falam de execução confinada ao Gate 3 e revisão humana no Gate 4. A linha do laudo “Autonomia Agêntica (Gate 3)” dentro do Gate 4 amplia a ambiguidade.

**Ação recomendada:** publicar uma tabela normativa de mapeamento entre fases do workflow AEOS, gates TLC e gates da homologação cognitiva, com nomes e autoridades, e referenciar essa tabela em todos os documentos.

### P2 — Números publicados misturam metas, resultados de execuções e definições diferentes

- RTO: 7,18 s no README/laudo, 4 s no ADR-006 e até 15 min como SLA.
- Laya: abaixo de 15 ms no README, abaixo de 35 ms na matriz do Gate 3 do laudo, mas 53,32 ms no exemplo de detecção de conflito do mesmo laudo; alvo abaixo de 40 ms no ADR-0005/especificação.
- VRAM: “0 MB” como invariante, enquanto o laudo menciona 7 MB de uso do sistema e o teste aceita menos de 600 MB.
- Embeddings: 768D como padrão, mas o ERD do README registra “768 / 1536”.
- Claims: 220 ativas no README contra 52 confiáveis no laudo; podem ser populações distintas, mas não há definições junto aos indicadores.

O README e ADR-006 também descrevem custos de nuvem como `$0.00/mês` sem explicitar limites de free tier, tráfego, retenção, contas e serviços incluídos.

**Ação recomendada:** criar um registro de indicadores com definição, tipo (meta ou medição), equipamento/versão, método, amostra, data, evidência e limites. Explicar populações e condições de custo em vez de condensá-las em valores absolutos.

### P2 — Há referências internas quebradas e caminhos locais que não servem no GitHub

Casos de primeira parte verificados:

- `README.md:67` aponta “Operating Model” para `ADR-005`, caminho inexistente na raiz e título que não corresponde ao ADR de monetização em `docs/adr/`.
- `projects/Living Architecture PCL AEOS/docs/c4-model/README.md:11–14` aponta para quatro especificações Markdown ausentes (`l1-context.md` a `l4-code-specs.md`).
- `specs/pcl-aeos-evolution/spec-pcl-aeos-temporal-graph-rag-and-reconciliation.md:62` aponta para `ADR-008`; o arquivo versionado chama-se `ADR-0008-docker-volume-persistence-governance.md`.
- Há 43 ocorrências `file:///c:/PromptCore_Labs/...` em 18 arquivos versionados. São caminhos da máquina local e não navegam para os arquivos no GitHub.

No material incorporado de `OmniRoute`, encontrei referências de idioma que apontam, por exemplo, para `docs/i18n/pt-BR/ARCHITECTURE.md`, enquanto o arquivo disponível está em `docs/i18n/pt-BR/docs/ARCHITECTURE.md`; também há referências a `docs/new-features/` ausente. Esses casos explicam a maior parte dos destinos não resolvidos do subtree.

**Ação recomendada:** substituir caminhos locais por links relativos ao repositório, corrigir nomes e rótulos, restaurar ou remover as quatro especificações ausentes e executar verificador de links em CI para os documentos próprios e incorporados.

### P2 — A autoridade decisória de um ADR conflita com a regra “human-in-the-loop”

`projects/Living Architecture PCL AEOS/docs/adrs/ADR-006-tripartite-memory-drp-cloudflare.md` lista “Arquitetura PCL AEOS & Cortex Intelligence” como decisores. A Foundation declara que agentes/provedores não possuem autoridade arquitetural e a governança define aprovação humana. Se “Cortex Intelligence” significa agente ou sistema de IA, o registro contradiz a própria regra; se significa outro papel, ele não está identificado como autoridade humana.

**Ação recomendada:** registrar o decisor humano pelo papel e nome; separar recomendação/parecer do agente da decisão aprovada.

### P2 — O mecanismo de proveniência não equivale a assinatura verificável

O laudo chama o campo final de “Assinatura Digital / Git Hash”. A tag `v2.0.0-cognitive-memory-sovereign` aponta para o commit `4909c394...`, anterior ao `master` atual `7764976...`; tag e commit retornam como não assinados/verificados pelo GitHub, e a branch `master` não está protegida. O hash permite localizar conteúdo, mas por si só não comprova autoria, aprovação ou imutabilidade do branch.

**Ação recomendada:** fixar o laudo a um commit e a uma execução; manter tags/release verificáveis e aplicar controles de proteção/aprovação compatíveis com a alegação de auditoria.

## Acabamento editorial

- O README começa como v2.0, mas termina com “v1.0 Sovereign”.
- A imagem de `DIAG-DEV-01` inclui um `<img>` cujo `src` é o HTML interativo antes do thumbnail PNG, produzindo uma referência de imagem inválida.
- O Dashboard local não versionado se declara “PCL AEOS v3.0.4 PROD” e repete alegações ISO. Separar claramente versão do produto AEOS, versão do Dashboard e estado de publicação.

## Plano recomendado

1. Marcar como rascunho ou concluir primeiro Foundation, Governance e Bootstrap, definindo a autoridade e o mapa único de Stage Gates.
2. Requalificar o laudo como auto-homologação interna até que as evidências possam ser reproduzidas e vinculadas a commit, ambiente e execução; corrigir o caminho de restore antes de voltar a afirmar o RTO.
3. Consolidar inventário de módulos e indicadores, incluindo versões, limites de custo e ambiente medido.
4. Corrigir links próprios, remover `file:///` e integrar verificação automática de links; tratar documentação de OmniRoute em seu limite de fornecedor/projeto.
5. Delimitar no README o que é AEOS versionado, o que é sistema externo e o que existe apenas em repositórios aninhados locais.

**Estado da auditoria:** findings documentados; nenhuma documentação preexistente foi alterada e nenhuma suíte de testes ou rotina operacional foi executada.
