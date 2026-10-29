# Reauditoria documental do PCL AEOS — revisão 2

**Data:** 16 de outubro de 2026  
**Escopo:** checkout local em `C:\PromptCore_Labs`  
**Branch / HEAD observado:** `master` / `b0b83df2c82d0fff4a616b216c498959937c4cf3`  
**Parecer:** houve avanço técnico material no Laya, incluindo modelo ONNX local, mas a nova capacidade ainda não está demonstrada com validação metodologicamente rastreável. Os impedimentos de governança, segurança e prontidão encontrados na auditoria anterior permanecem.

## Resumo executivo

O Laya deixou de ser somente heurístico: `services/pcl-laya/src/classifier.py` agora carrega um cross-encoder NLI ONNX quando os artefatos e dependências estão disponíveis, força `CPUExecutionProvider`, expõe classes NLI e mantém fallback simbólico. O modelo e tokenizer estão presentes no checkout, e o serviço tem interfaces REST/MCP. Isso resolve a divergência anterior entre “classificador semântico” documentado e ausência de inferência neural no código.

Essa melhoria não sustenta, por si só, os números de precisão ou a aprovação científica publicados. O benchmark novo usa 60 exemplos escritos no próprio script, sem proveniência ou validação independente dos rótulos; compara uma pergunta textual (“contradiz ou gera conflito com: …”) em vez de submeter a hipótese diretamente ao endpoint NLI; e coteja o resultado com tempos, custos e capacidades de modelos concorrentes fixados como constantes, sem medições equivalentes. O laudo extrapola esses resultados para “estado da arte”, risco zero de alucinação, prevenção de corrupção e conformidade ISO. Essas conclusões vão além do que o procedimento mede.

**Conclusão:** o Laya avançou de forma real e promissora, mas o ecossistema ainda não pode ser considerado fundação documental e operacional homologada. A prioridade agora é reduzir claims não sustentados, tornar a inicialização observável/reprodutível, fechar riscos de segurança já documentados e resolver a autoridade normativa e o estado contraditório de readiness.

## Escopo, método e limites

- A revisão foi feita no checkout local, sem atualizar ou comparar refs do GitHub remoto. O HEAD informado acima é o estado local observado.
- O inventário contém 925 arquivos Markdown rastreados. Fiz inspeção estática da documentação central de governança, arquitetura, claims, readiness, estado do projeto, Compose e Laya, além de revisão do novo benchmark e do provisionamento do modelo. O subtree de terceiros OmniRoute/PaperClip foi inventariado, mas não revisado semanticamente arquivo a arquivo.
- Não executei testes, benchmark, containers, restore ou chamadas ao serviço. Portanto, as métricas atuais do laudo não foram reproduzidas de forma independente. A revisão do benchmark avalia o desenho do script e a consistência das afirmações geradas.
- `model.onnx` está presente localmente, mas é excluído pelo `.gitignore` (`*.onnx`) e não está rastreado pelo Git. Não confirmei seu hash nem sua procedência. O script Docker tenta buscá-lo do branch mutável `main` no Hugging Face, sem pin de revisão nem checksum.
- O diretório local não versionado `projects/Guia Pratico PCL AEOS/` e arquivos de trabalho em `scratch/` continuam fora da documentação rastreada; devem ser classificados antes de serem tratados como conteúdo oficial.

## Evoluções confirmadas

1. **Inferência neural presente no código:** `ONNXNLIEngine` localiza `model.onnx` e `tokenizer.json`, inicializa ONNX Runtime exclusivamente com `CPUExecutionProvider`, executa tokenização do par e produz scores de contradição, entailment e neutralidade.
2. **Provisionamento integrado ao build:** o Dockerfile inclui dependências ONNX/Tokenizer e executa `scripts/download_model.py`. Há fallback simbólico se o modelo ou runtime falhar.
3. **Interface ampliada:** REST oferece modos binary, NLI, choice, score e batch; existe servidor MCP local. As respostas NLI incluem o modo efetivamente usado, o que pode ajudar na rastreabilidade por chamada.
4. **Documentação técnica específica:** há README/config do modelo, um benchmark novo e referências ao Laya neural no README principal e no portal.

## Achados prioritários

### P1 — Benchmark não demonstra validade semântica independente

`scripts/tests/benchmark_laya_neural_nli.py` contém 60 pares próprios, com 30 “conflitos” e 30 “coerentes”. Não há citação de dataset externo, processo de anotação, revisores, adjudicação, conjunto holdout, critérios para casos ambíguos ou artefato de rótulos versionado separadamente. Muitos exemplos são afirmativas fortes e contrárias; o conjunto não demonstra cobertura de paráfrases difíceis, negação, conflito parcial, temporalidade, proveniência, idioma ou casos realmente ambíguos. Alguns exemplos referem-se a fatos sobre o próprio AEOS sem evidência anexada, de modo que a expectativa rotulada pode simplesmente codificar uma alegação documental não verificada.

Além disso, a função do benchmark chama `/evaluate/binary` com a query `contradiz ou gera conflito com: {hypothesis}`. O método `evaluate_binary` passa `state` e essa frase interrogativa como o par NLI. Isso não equivale a passar a hipótese diretamente a `/evaluate/nli` e não constitui, sem justificativa e avaliação, uma definição estável de tarefa de contradição. Os resultados também são afetados pelo roteamento textual por palavras (“contradiz”, “conflito”), e o relatório não registra `engine_mode` por amostra; logo, não prova que todas as inferências medidas vieram do ONNX, em vez de fallback.

O resumo ainda diz que os conflitos foram “prevenidos antes de corromper a base”, mas o script só classifica respostas: ele não grava nem tenta reconciliar memória. A formulação deve ser substituída por uma descrição do teste de classificação offline.

**Ação:** publicar o dataset com proveniência e critérios de anotação, dividir desenvolvimento/teste, avaliar casos em português e inglês com revisores independentes, chamar o contrato NLI que corresponda à tarefa, registrar modo/modelo/hash/latência por amostra e relatar intervalos de confiança e erros. Até lá, classificar os números como resultado exploratório interno, não como homologação ou evidência de prevenção operacional.

### P1 — Benchmark comparativo e alegações científicas não são reproduzíveis

Os baselines de latência (1.350 ms cloud, 480 ms local 7B), custo de US$ 0,003/chamada, VRAM de 6.144 MB e throughput concorrente são valores fixos no script ou no relatório. Não foram medidos com a mesma tarefa, equipamento, carga, configuração, modelo, rede ou política de repetição. O cálculo de economia anual multiplica esses pressupostos por 500 mil chamadas. A tabela não constitui comparação experimental controlada.

O laudo chama o resultado de “estado da arte”, “distinção científica”, “risco ZERO de alucinação” e “auditabilidade ... sob normas ISO/IEC 27001 e 42001”. Um classificador probabilístico pode errar; não há teste para sustentar risco zero, superioridade sobre o estado da arte nem conformidade/certificação ISO. O F1 é um valor matemático calculado sobre o conjunto interno; “equilíbrio matemático perfeito” não é uma interpretação apropriada. No próprio resultado reportado, 11 dos 30 exemplos coerentes foram falsos positivos (especificidade 63,33%), o que precisa aparecer como limitação operacional destacada.

**Ação:** remover linguagem de certificação e superioridade, registrar hardware/software, hash e configuração, separar medição de projeção, comparar sistemas equivalentes e rotular todas as estimativas como hipóteses até medição independente. Exibir falsos positivos/falsos negativos e seus exemplos, não apenas recall.

### P1 — Artefato neural não é pinado nem rastreável para builds reproduzíveis

`download_model.py` busca `config.json`, `tokenizer.json` e `model.onnx` em URLs de Hugging Face com `main`, sem revisão imutável, checksum ou assinatura verificada. `model.onnx` é ignorado pelo Git, embora esteja presente neste checkout. Assim, outro clone/build pode resolver bytes diferentes e o atual não registra a identidade criptográfica do modelo. O código também fixa o mapeamento de labels em vez de ler/verificar a configuração baixada.

**Ação:** fixar revisão do repositório e SHA-256 de cada artefato; validar tamanho/hash antes de aceitar arquivos existentes ou baixados; emitir esses identificadores no health/telemetria e em relatórios. Tratar dependência de rede e licença/proveniência como itens do processo de release.

### P1 — Saúde reportada como saudável mesmo quando o neural não está carregado

`main.py` retorna `status: healthy` e anuncia modelo/CPU independentemente de `engine_mode` ou `is_ready`. Falha de download, dependência ausente ou erro de inicialização pode deixar o serviço no fallback simbólico enquanto o health check e o Docker HEALTHCHECK continuam verdes. O fallback também pode ocorrer silenciosamente em qualquer exceção de inferência; a exceção não é registrada e a resposta do fallback não indica a causa.

**Ação:** distinguir readiness/degraded/healthy, reportar modelo e provedor efetivamente ativos, falhar readiness se o modo neural for requisito do deploy, contar/logar fallback e validar limites de entrada, dependências e caminho do modelo.

### P1 — Conversão das probabilidades em confiança não está calibrada; algumas saídas são semanticamente frágeis

O código chama softmax “calibrado”, mas apenas normaliza logits; não há calibração de confiabilidade. `evaluate_binary` pode classificar como conflito qualquer resultado cujo rótulo máximo seja contradiction, mesmo abaixo do limiar indicado; quando não é conflito, confiança é `1 - contradiction`, sem distinguir neutralidade de entailment. A resposta genérica transforma NLI em boolean sem especificar uma hipótese declarativa clara. `evaluate_choice` monta `{query} -> {option}` e normaliza probabilidades como se fossem comparáveis; limita a confiança a pelo menos 0,75 mesmo quando scores são baixos/iguais. `evaluate_score` chama a saída entailment de score e confiança derivada sem calibração.

**Ação:** definir contratos separados para NLI, detecção binária, escolha e score; usar hipóteses formuladas e limiares por tarefa; incluir classe `abstain/uncertain`; calibrar no conjunto de validação e documentar falsos positivos/falsos negativos antes de permitir qualquer mutação automática de memória. A normalização softmax não deve ser descrita como calibração.

### P1 — Riscos de segurança e conflitos normativos anteriores continuam abertos

`docker-compose.aeos.yml` ainda fixa senha PostgreSQL (`paperclip`), senha inicial (`admin`), desativa autenticação e publica as portas do banco, OmniRoute, PaperClip e Laya no host. Isso conflita com as afirmações de Zero Trust e com os limites de rede descritos na arquitetura. O acesso anônimo à API Laya também expõe o classificador sem autenticação no mapeamento atual.

A matriz normativa `projects/pcl-aeos-harmonization/design/normative-hierarchy.md` ainda se declara fonte canônica, embora a própria hierarquia rebaixe `projects/` a material informativo/histórico. `governance/policies.md` permanece incompleta. O RACI ainda atribui ao Laya A/R em triagem e o procedimento prevê precedência automática, embora o patrocinador seja apresentado como autoridade soberana. O certificado Foundation Ready continua declarando aprovação integral no baseline antigo; STATE tem hashes distintos e status contraditórios, apesar da reauditoria anterior ter negado confirmação independente.

**Ação:** corrigir primeiro os padrões de credenciais/exposição/autenticação; publicar a norma na localização que sua própria regra reconhece; preencher e aprovar políticas; alinhar RACI e precedência para que detecção não se converta automaticamente em decisão; invalidar ou reemitir o certificado apenas após fechar critérios e estabelecer baseline explícito.

## Oportunidades de melhoria adicionais

| Área | Oportunidade concreta |
|---|---|
| Protocolo e limites | Definir limite de caracteres/tokens, comportamento para texto vazio/longo, timeout, concorrência, tamanho de lote e versão de schema. `max_length=128` implica truncamento silencioso. |
| Robustez | Evitar captura ampla e silenciosa de exceções; disponibilizar diagnóstico sem expor conteúdo sensível. Validar que as entradas ONNX correspondem ao grafo do modelo exportado. |
| Testes de aceitação | Criar asserts para carregar o artefato fixado, confirmar provider ativo, mapear labels, exercitar pares rotulados e provar a degradação quando ONNX não está disponível. Estes testes ainda não foram executados nesta auditoria. |
| Memória e governança | Manter Laya como sinal consultivo; exigir proveniência, nível de autoridade e aprovação humana para supersessão material. A probabilidade de contradição não decide qual fonte está correta. |
| Evidências futuras | Cada execução deve registrar versão de código, revisão/hash do modelo, modo neural/fallback, conjunto/versão, parâmetros, resultados brutos agregados, hardware e responsável, protegendo textos confidenciais. |
| Docs e fronteiras | Atualizar mapa de fronteiras e README com runtime efetivo, separar “capacidade implementada” de “capacidade homologada” e classificar guia local/scratch. O dashboard na porta 8080 continua divergente do Compose, que publica PaperClip na 3100. |
| Reconciliação contínua | Adicionar verificador recorrente para links/anchors, arquivos de autoridade, claims sem evidência, status de documentos, configuração Compose vs diagramas e alterações de artefatos/modelos em CI. |

## Avaliação pelas mesmas dimensões

| Dimensão | Avaliação atual | Mudança desde a auditoria anterior |
|---|---|---|
| Apresentação e navegação | Melhor, com novos materiais de Laya | README/portal agora fazem claims mais fortes do que as evidências sustentam. |
| Arquitetura declarada | Parcial | Laya neural está no código; fronteiras e topologia ainda divergem do Compose. |
| Autoridade normativa | Insuficiente | Contradição de localização e policies incompletas não foram resolvidas. |
| Métricas e evidências | Insuficiente para homologação | Há dataset e resultados, porém sem anotação independente e com baselines comparativos presumidos. |
| Classificação semântica Laya | Implementada como capacidade, não homologada | ONNX NLI real substitui as heurísticas como motor primário quando disponível; fallback e roteamento continuam, e health não distingue o modo degradado. |
| Reconciliação de conhecimento | Não pronta para autoridade automática | NLI pode sinalizar relação entre textos; não determina autoridade, verdade ou supersessão correta. |
| Segurança operacional | Insuficiente | Credenciais fixas, auth desligada e portas expostas persistem. |
| Readiness | Não confirmada | Certificado e STATE ainda afirmam Foundation Ready sobre baseline anterior sem cobrir os achados P1. |

## Sequência recomendada

1. Suspender claims “científico/estado da arte/risco zero/ISO” e marcar benchmark como exploratório até validação independente.
2. Fixar e verificar os artefatos do modelo; fazer health/readiness refletir o modo realmente carregado e registrar fallback.
3. Definir protocolo NLI e critérios de decisão, executar avaliação rotulada independente e não permitir que NLI altere autoridade/superseda memória sozinho.
4. Fechar exposição e credenciais no Compose e reconciliar o runtime com diagramas e fronteiras.
5. Resolver fonte normativa, políticas, RACI, registro de claims e o conflito entre certificado, STATE e HEAD; só então rever Foundation Ready.
6. Instituir verificações recorrentes de deriva documental e evidência por release.

## Parecer final

O novo motor semântico é um avanço substancial sobre a versão anterior e confirma que o Laya já contém uma implementação neural real no checkout. A documentação, porém, passou a superestimar o grau de validação dessa implementação. O sistema está **mais capaz**, mas não está ainda **comprovado, governado ou pronto para servir como árbitro automático de reconciliação**. As oportunidades mais importantes são a integridade metodológica do benchmark, a reprodução e identidade do modelo, a honestidade do health/fallback, a segurança do Compose e a resolução da fonte normativa e do status de readiness.
