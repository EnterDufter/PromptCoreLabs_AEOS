# Reauditoria documental do PCL AEOS

**Data:** 16 de outubro de 2026  
**Escopo:** checkout local em C:\PromptCore_Labs  
**Branch / HEAD observado:** master / 158156429cbe88a408331e22d0ceced3d5b77163  
**Parecer:** houve evolução substancial de apresentação e organização, mas a documentação e algumas afirmações operacionais ainda não sustentam uma declaração independente de Foundation Ready.

## Resumo executivo

Em relação à auditoria de 15 de outubro, o AEOS está **mais legível, mais bem apresentado e mais explícito sobre a hierarquia pretendida**. O README foi reestruturado, os links first-party mais visíveis foram corrigidos, há uma matriz normativa, um mapa de arquitetura/fronteiras e um registro para separar SLA, meta e baseline histórico. A configuração do OmniRoute agora declara integração com Laya, e existe servidor MCP, skill e material de onboarding para ele.

Essas mudanças são progresso real. No entanto, a nova documentação por vezes converte propostas e resultados de scripts em declarações de aprovação operacional. A fonte normativa recém-criada está dentro de uma pasta que a própria hierarquia classifica como informativa; a implementação do Laya é um conjunto de heurísticas textuais, não o classificador semântico/ONNX descrito; a reconciliação pode promover e superseder claims automaticamente com base nessa detecção; e o Compose mantém autenticação desabilitada e credenciais fixas. Permanecem também instruções de elaboração em documentos centrais.

**Conclusão:** a documentação parece mais profissional na superfície e a arquitetura pretendida está mais fácil de entender. Ainda não está suficientemente coerente e segura para ser tratada como uma fundação normativa já homologada. Recomendo substituir o estado “Foundation Ready” por “Foundation Ready declarado — reauditoria encontrou impedimentos”, até que os achados P1 abaixo sejam corrigidos ou aceitos formalmente pelo patrocinador.

## Escopo, método e limites

- O HEAD local observado é 158156429cbe88a408331e22d0ceced3d5b77163, na branch master. O relatório anterior usava 7764976672696c19cabfeec19c17ec4b31331a0a. Esta reauditoria foi local; não atualizei refs nem comparei o HEAD atual ao GitHub remoto.
- Git lista 922 arquivos Markdown versionados no checkout. 664 pertencem ao subtree OmniRoute. Fiz inventário estático do conjunto e leitura aprofundada das fontes centrais de governança, arquitetura, claims, Laya, memória e Compose; não revisei semanticamente cada documento de terceiros do OmniRoute.
- O diretório projects/Guia Pratico PCL AEOS está presente localmente como conteúdo não versionado. Seu HTML foi inspecionado como uma fonte local de apresentação; ele não integra o snapshot rastreado do repositório.
- Não executei suites de teste, benchmark, ingestão, reconciliação, servidor MCP, serviços Docker ou restore. A API Docker não estava acessível neste ambiente. Resultados de execução são avaliados pela rastreabilidade do código e do relato, não como reprodução independente.
- A verificação de whitespace em diffs acusa várias linhas com espaços finais; muitos parecem ser quebras de linha Markdown intencionais, portanto não os trato como achado substantivo. A verificação completa de links não foi reexecutada nesta reauditoria.

## Melhorias confirmadas

1. **README e portal:** a introdução agora oferece caminhos de leitura para públicos diferentes e uma navegação mais clara. O portal apresenta diagramas, seções e descrição de componentes mais coesas.
2. **Links e portabilidade:** o link do Operating Model, referências C4 e referência do ADR no spec receberam correções. A busca estática não encontrou caminhos file:// ativos em documentos first-party correntes; as menções restantes estão em registros históricos da auditoria/estado. Isso é progresso, mas não substitui a verificação integral dos destinos e anchors.
3. **Calibração declarada:** o novo registro diferencia target, SLA, baseline histórico e limite de conformidade. O relatório anterior foi requalificado como autoavaliação técnica interna, sem alegar certificação ISO externa.
4. **Arquitetura pretendida:** o novo artefato tenta separar core, satélites e dependências; torna visíveis as interfaces MCP/REST de Laya e a intenção de integrar OmniRoute.
5. **Continuidade:** há mais material de estado, claims e readiness no projeto de harmonização, facilitando localizar a intenção e o histórico.

## Achados prioritários

### P1 — Fonte normativa canônica em localização que a própria hierarquia rebaixa

O documento PCL-AEOS-NORM-01 declara-se a raiz normativa, mas está em projects/pcl-aeos-harmonization/design/normative-hierarchy.md. A seção 2 da própria matriz coloca READMEs locais, materiais informativos e projetos sob o nível 5, sem força normativa. Ao mesmo tempo, inclui PCL-AEOS-NORM-01 no nível 2, cuja localização canônica é specs/. A autoridade do documento depende, portanto, de uma exceção que não está declarada como exceção de localização nem resolvida na hierarquia.

A regra também diz que Políticas precedem Specs, mas governance/policies.md se declara subordinado à matriz e ainda contém instruções de elaboração. Isso cria uma precedência circular na prática: a fonte de nível mais alto está incompleta, e a matriz que tenta resolver a lacuna está num local classificado como não normativo.

**Impacto:** não é determinístico para um leitor externo qual documento está vigente nem por que uma proposta em projects sobrepõe o nível 1 da hierarquia.

**Correção prioritária:** mover ou publicar a fonte normativa em uma localização compatível com a própria taxonomia; registrar formalmente status, vigência, aprovação e regra de transição; preencher a fonte de políticas de nível 1; remover a exceção circular.

### P1 — Laya anunciado como classificador semântico, mas implementado como heurísticas textuais

services/pcl-laya/src/classifier.py implementa busca de substrings, interseção de palavras e uma lista curta de pares fixos. Não carrega nem invoca um modelo ONNX ou encoder, apesar de onnxruntime estar nas dependências e o ADR/spec/skill descreverem um classificador ModernBERT/INT8 ou semântico. A resposta de health é estática e não verifica o modelo, dependências ou saúde real. Os valores de confidence são constantes ou derivados da sobreposição lexical e não estão calibrados por avaliação.

O benchmark em scripts/tests/benchmark_laya_mcp.py cronometra essa rotina textual e compara o tempo com uma hipótese fixa de 1.200 ms por chamada LLM. Os 50 exemplos não têm rótulos esperados, cálculo de precisão/recall, matriz de confusão nem comparação com uma chamada real equivalente. Assim, ele mede a velocidade de uma heurística em amostras pequenas, mas não demonstra qualidade semântica, ganho de 84.000x sobre um modelo medido, economia de tokens ou aptidão para decidir conflitos.

O teste de handshake imprime sucesso, mas não contém assertions suficientes para provar que todas as ferramentas e respostas esperadas foram entregues. A documentação declara benchmark e protocolo homologados além do que esses scripts demonstram.

**Impacto:** Laya não deve ser tratado como árbitro semântico, filtro de segurança, autorizador de ferramentas ou verificador de verdade. Falsos negativos/positivos podem contaminar RAG, bloquear conteúdo válido ou aprovar conteúdo contraditório.

**Correção prioritária:** renomear e limitar provisoriamente a capacidade ao comportamento real (heurística lexical experimental); retirar autoridade e promessas de guardrail; manter decisões consultivas; reconciliar a implementação com a especificação de modelo antes de anunciar classificação semântica. A evidência futura pode ser coletada nos projetos, conforme a prioridade de velocidade do patrocinador.

### P1 — Reconciliação da memória promove e supersede claims automaticamente usando sinais fracos

scripts/memory/claim_extractor.py atribui autoridade pelo caminho — por exemplo, qualquer arquivo sob governance/ recebe tier máximo — sem verificar status, aprovação, vigência ou autoridade específica. A proveniência do modelo é inferida procurando palavras como “claude”, “gpt-4” ou “gemini” no conteúdo; isso não prova qual autor/modelo produziu o documento. Claims extraídos são gravados diretamente com status TRUSTED.

scripts/memory/reconciliation_engine.py consulta Laya com uma pergunta genérica que não aciona o ramo específico de contradição do classificador. Se o fallback é usado, ele compara uma pequena lista fixa de termos, inclusive pares que podem coexistir legitimamente. Se um conflito for encontrado, a função supersede automaticamente o claim de tier inferior. O score de autoridade por caminho não é equivalente à precedência aprovada na matriz normativa, e não existe verificação de escopo, temporalidade ou equivalência semântica antes da promoção.

scripts/memory/staleness_verifier.py detecta mudança de hash e marca o claim como STALE; isso é detecção de deriva de arquivo, não correção automática do conteúdo ou validação de que o claim ficou semanticamente obsoleto. A expressão “memória autocorretiva” é, portanto, excessiva para a capacidade demonstrada no código atual.

**Impacto:** o fluxo atual pode transformar uma extração não revisada em verdade confiável e apagar a condição de conflito de uma fonte pelo simples tier do caminho. Isso contradiz a regra humana para arbitragem material.

**Correção prioritária:** claims entram como candidatos não confiáveis; tier deve derivar do registro normativo e estado do documento, não só do caminho; detecção automatizada apenas abre conflito; supersessão/reconciliação material exige aprovação humana. Até isso existir, descrever memória como “staleness sinalizado por hash e reconciliação experimental assistida”.

### P1 — Harness Docker continua com controles que contradizem as políticas declaradas

docker-compose.aeos.yml define POSTGRES_PASSWORD como paperclip, expõe a porta 5432 no host, define INITIAL_PASSWORD=admin e AUTH_DISABLED=1/SKIP_LOGIN=1/REQUIRE_LOGIN=false no OmniRoute e usa um valor fixo de API key local para o PaperClip. A matriz de arquitetura descreve limites de rede e a documentação reivindica isolamento e práticas Zero Trust. Os controles efetivos do Compose não sustentam essas afirmações e podem expor serviços sem autenticação, dependendo das interfaces e regras do host.

**Correção prioritária:** não usar esse Compose para acesso remoto ou dados sensíveis no estado atual; desabilitar defaults inseguros, exigir segredos fora do YAML versionado, limitar bind de portas, documentar perfil local de desenvolvimento separado do perfil seguro e alinhar as alegações de segurança ao controle efetivo.

### P1 — “Foundation Ready” não está demonstrado pelo checklist nem pelo estado do repositório

projects/pcl-aeos-harmonization/foundation-readiness.md declara sucesso e liberação dos dois projetos estratégicos, mas o checklist não cobre de forma verificável todos os critérios FR/NFR da própria SPECIFY, incluindo inventário completo, reconciliação de conhecimento e controles permanentes de deriva. Itens marcados como aprovado apontam para documentos e uma verificação pelo mesmo Laya que não tem validade semântica demonstrada.

O certificado fixa commit 7764976672696c19cabfeec19c17ec4b31331a0a, enquanto o HEAD observado é 158156429cbe88a408331e22d0ceced3d5b77163. STATE.md cita ainda outro baseline (4feb6391d4e7b415a773aee10f635aafe115e5a2). Não há um único baseline consistente entre estado, certificado e checkout auditado. O estado diz “publicado no GitHub”, mas esta auditoria não verificou o remoto.

**Impacto:** a afirmação Foundation Ready e a autorização derivada são mais fortes que a evidência e o escopo efetivamente registrados.

**Correção prioritária:** alterar o status para “declarado, pendente de reauditoria”, fixar o baseline corrente, completar a matriz FR/NFR → artefato → método → estado e separar aprovação declarada de verificação independente. Isso não obriga reproduzir todos os benchmarks agora: claims podem permanecer históricos/não verificados e evidência operacional pode ser acumulada nos projetos futuros.

### P1 — RACI e aplicação automática de precedência misturam autoridade e triagem

Na tabela RACI de normative-hierarchy.md, Laya aparece como A/R na triagem automática. A legenda define A como responsável final/accountable, enquanto a regra geral atribui a autoridade soberana ao patrocinador. Na seção de conflitos, a ferramenta detecta e o agente aplica automaticamente a precedência entre níveis; só conflitos no mesmo nível são encaminhados ao patrocinador. Como o detector atual é lexical e as fontes podem divergir por escopo, tempo ou definição, a precedência por nível pode resolver o conflito errado sem revisão humana.

**Correção prioritária:** reservar A/accountable por decisão normativa a uma pessoa/papel humano; distinguir detecção, proposta de precedência e arbitragem. Automatizar apenas conflitos mecânicos de baixo risco quando os metadados e escopo forem inequívocos.

## Achados adicionais

### P2 — Boundary Register incompleto e divergente do runtime

canonical-architecture.md afirma classificar cada pasta, mas a tabela cobre apenas uma seleção de diretórios e não classifica vários domínios de primeiro nível. Registra Dashboard/ na porta 8080 como satélite, enquanto docker-compose.aeos.yml não define serviço Dashboard e expõe PaperClip na porta 3100. A presença de um projeto local de Dashboard não estabelece que ele seja componente oficial do core. O mapa conceitual e o runtime devem ser distinguidos e reconciliados.

O guia local projects/Guia Pratico PCL AEOS também é um artefato não versionado e contém outra superfície de claims e instruções. Ele precisa ser registrado como rascunho/local, publicado em repositório com status claro ou explicitamente excluído do material oficial.

### P2 — Registro de claims melhora a taxonomia, mas não é ainda um registro rastreável

claims-register.md resolve por narrativa sete grupos de divergências, mas as linhas não têm IDs estáveis por claim, links para fonte específica, execução/artefato, owner, amostra, data da medição, estado de verificação ou condições completas. 7,18 s é chamado baseline histórico sem execução identificada no registro. O SLA de 15 minutos é chamado contratual sem referência ao contrato. 52 prioritários/220 brutos não têm lista ou consulta que permita reproduzir as populações.

A distinção de target/SLA/baseline é profissional e útil; manter os números como históricos ou metas é aceitável para harmonização rápida, desde que não se chame isso de comprovação ou homologação.

### P2 — Instruções de redação ainda aparecem em fontes centrais

Após as alterações, permanecem marcadores explícitos como “Explicar que”, “Explicar explicitamente”, “Criar as seguintes políticas oficiais” e “Criar uma matriz semelhante” em governance/stage-gates.md, governance/roles.md, governance/policies.md e governance/decision-authority.md. governance/governance.md também contém instruções do mesmo tipo. Há seções completadas e banners que apontam para a matriz, mas não substituem esses trechos nem declaram formalmente os arquivos como supersedidos. foundation/governance/standards.md e foundation/governance/compliance.md também continuam merecendo revisão.

### P2 — A higienização de links é um conversor de lista fixa, não uma proteção recorrente

scripts/maintenance/sanitize_relative_links.py contém caminhos absolutos C:\PromptCore_Labs e uma lista estática de 21 arquivos. Ele transforma destinos, mas não valida se os destinos resultantes existem, os anchors resolvem ou novas referências locais serão introduzidas. O problema de portabilidade parece ter melhorado no conjunto examinado, mas prevenção de regressão ainda não está configurada como verificação geral em CI.

## Avaliação por dimensão

| Dimensão | Avaliação | Comentário |
|---|---|---|
| Apresentação e navegação | Melhorou bastante | README e portal são mais didáticos; faltam validar todos os links. |
| Arquitetura declarada | Melhorou, com ressalvas | Há mapas e classes, mas fronteira física/runtime e a lista de componentes não fecham. |
| Autoridade normativa | Insuficiente | Fonte canônica contradiz sua própria taxonomia de localização e policies permanecem incompletas. |
| Rastreabilidade de métricas | Parcial | Tipos foram separados; faltam identificadores e proveniência verificável. |
| Reconciliação de conhecimento | Não pronta para autoridade automática | Implementação textual heurística atribui confiança e pode superseder claims. |
| Segurança operacional | Insuficiente para exposição/rede | Defaults do Compose contradizem autenticação, soberania e Zero Trust alegados. |
| Readiness | Não confirmada por esta auditoria | O certificado está desatualizado e não cobre os critérios com evidência independente. |

## Ordem recomendada para uma harmonização rápida

1. Reclassificar o Laya atual como heurística experimental/advisory e remover sua autoridade sobre gates, segurança e supersessão de claims.
2. Corrigir a contradição de localização/status da fonte normativa e completar a regra de precedência com um documento de nível 1 efetivamente operacional.
3. Colocar o Compose em perfil seguro: retirar autenticação desabilitada e credenciais fixas, limitar exposição de portas e separar desenvolvimento local de operação protegida.
4. Corrigir o estado Foundation Ready e os baselines; declarar como não verificados os benchmarks e resultados que não têm dossiê rastreável. A coleta pode ocorrer nos projetos futuros.
5. Completar o Boundary Register incluindo todas as pastas/componente relevantes e esclarecer Dashboard versus PaperClip e componentes externos.
6. Remover ou formalmente superseder os prompts residuais nos documentos normativos centrais.
7. Transformar o sanitizador de links em verificação que falhe quando novas referências locais ou destinos inválidos forem introduzidos.

## Resposta à pergunta “está mais adequado e profissional?”

**Sim, houve uma melhora clara de organização, apresentação e intenção arquitetural. Ainda não está profissionalmente pronto para ser apresentado como fundação já homologada.** O principal risco agora não é falta de texto: é o texto declarar mais autoridade, semântica, segurança e readiness do que a localização normativa, a implementação e a rastreabilidade sustentam.

Este parecer avalia o snapshot local observado em 16/10/2026. A classificação poderá mudar quando os P1 forem corrigidos; não é necessário atrasar a harmonização para reexecutar todos os históricos, desde que sejam rotulados como não verificados e a nova fundação não dependa deles como prova.
