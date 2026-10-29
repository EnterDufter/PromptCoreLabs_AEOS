# Reauditoria documental do PCL AEOS — 17 de outubro de 2026

**Iniciativa:** Evolução Arquitetural do PCL AEOS  
**Escopo:** checkout local `C:\PromptCore_Labs`  
**Branch / HEAD observado:** `master` / `2c3f4c76455669a433abc16b85326130691395a0` (`origin/master` no início da revisão)  
**Estado do checkout:** mudanças locais não commitadas e novos arquivos não rastreados; por isso, o estado auditado difere do HEAD e do remoto.  
**Parecer:** as alterações tratam corretamente diversos achados anteriores, sobretudo no pin de download e na observabilidade do Laya, no loopback do Compose e na separação explícita de métricas. Ainda assim, a declaração de Foundation Ready não está sustentada pelo estado verificável: permanecem defeitos no benchmark e em claims derivados, lacunas de segurança por defaults, duplicidade normativa, artefatos não versionados e inconsistências internas no estado/certificado.

## Resumo executivo

O trabalho recente é uma melhoria importante, não apenas cosmética. O download do modelo passou a usar revisão imutável e SHA-256; o Laya lê labels do config, expõe modo degradado, contadores e erros de fallback; há probes de readiness; as portas publicadas no Compose passaram a usar loopback por padrão; o README principal atenua comparações de mercado e corrige parte das métricas; e a matriz de governança foi criada na raiz `governance/`.

O fechamento, contudo, foi declarado antes de a documentação e os artefatos convergirem. A nova matriz normativa (`governance/normative-hierarchy.md`) está **não rastreada** e seu diagrama inclui o próprio `PCL-AEOS-NORM-01` no Nível 2, apesar do cabeçalho tratá-lo como fonte suprema. `governance/policies.md` e outros documentos ainda contêm instruções de redação. O `.env.example` e os fallbacks do Compose mantêm senhas previsíveis. O dataset chamado “Holdout Cego” está junto dos rótulos no arquivo de dados, o protocolo não calibra o limiar a partir do conjunto Dev, e o benchmark aceita e reporta resultado sem exigir modo neural. O README ainda conserva valores antigos de recall e latência e descreve supersessão automática.

> **Conclusão de readiness:** a revisão confirma avanço técnico e documental, mas **não confirma Foundation Ready nem o encerramento integral das Fases 1–5**. O certificado aponta o commit `b0b83df...`, enquanto o HEAD local é `2c3f4c...` e contém três commits posteriores, além de mudanças não commitadas. Não há no histórico desta conversa aprovação humana explícita para a homologação datada de 17/10. Essa aprovação precisa ser um evento comprovável do processo, não um texto produzido pelo próprio artefato que certifica a aprovação.

## Escopo, método e limites

- Inventário local de 925 arquivos Markdown rastreados; a revisão aprofundada cobriu os artefatos centrais alterados e as fontes de governança, benchmark, claims, Compose, Laya, readiness e STATE. Não li semanticamente todos os documentos dos subtrees de terceiros OmniRoute/PaperClip.
- Inspecionei diffs, estado Git, código, arquivos de configuração e links/referências relevantes. A conclusão distingue afirmações de arquivos locais de conteúdo presente no HEAD publicado.
- Não executei o benchmark, testes, Compose, downloads, containers ou chamadas ao serviço. Não confirmei que métricas ou healthchecks descritos foram obtidos na configuração hoje visível. Logo, “verificado em protocolo controlado” permanece uma afirmação documental, não uma reprodução desta auditoria.
- Não li arquivos `.env` com possíveis segredos. Revisei apenas `.env.example` e as expressões/defaults do Compose.
- O Laya MCP não está conectado como ferramenta disponível nesta sessão; a inspeção foi estática. O método NLI não é usado como árbitro da auditoria: ele não substitui a verificação de proveniência e autoridade.

## Correções confirmadas desde a revisão de 16 de outubro

1. **Provisionamento do modelo:** `download_model.py` fixa um commit do Hugging Face e verifica tamanho e SHA-256 ao baixar. A revisão imutável está declarada no manifest local.
2. **Observabilidade do Laya:** `get_health_status()` distingue `healthy` de `degraded`, expõe modo, contadores e motivo do fallback; existem `/ready` e `/readiness` com opção `LAYA_REQUIRE_NEURAL`.
3. **Governança de inferência:** `evaluate_binary` recebeu threshold e opção `allow_abstain`; o resultado NLI é descrito como sensor consultivo na norma/benchmark.
4. **Rede do Compose:** bindings publicados mudaram para `127.0.0.1` por padrão, reduzindo exposição remota acidental; a topologia de PaperClip foi corrigida para a porta 3100.
5. **Claims de mercado:** uma parte das comparações cloud/7B foi rotulada como projeção teórica, e os erros estatísticos aparecem com mais transparência.

Essas são melhorias reais no conteúdo local. Ainda não são prova de que o deploy usa o modelo correto, que as configurações são seguras em execução ou que o benchmark foi reproduzido.

## Achados prioritários

### P1 — O baseline de homologação não corresponde ao estado revisado nem está publicado

O certificado e o README do projeto registram `b0b83df...` como HEAD homologado. O HEAD atual é `2c3f4c...`, e `git status` mostra mudanças em 20 arquivos, além de novos arquivos não rastreados, incluindo `governance/normative-hierarchy.md`, `.env.example`, o dataset `services/pcl-laya/data/reconciliation_dataset.json` e `services/pcl-laya/models/nli-minilm/manifest.json`. O relatório de auditoria anterior também continua não rastreado. Portanto, as correções centrais e os artefatos que o certificado cita não fazem parte do commit declarado como homologado; parte deles nem integra o índice Git local.

O estado do projeto afirma que todas as cinco fases foram concluídas e que o Gate G-04 foi homologado, mas no corpo do mesmo `STATE.md` a Fase 4 consta como próxima e a Fase 5 como pendente. O STATE também conserva histórico contraditório sobre velocidade, alcance e status. A homologação precisa apontar para um commit imutável que inclua as alterações e os artefatos necessários, e o registro de aprovação deve identificar aprovador, data e escopo verificáveis.

**Ação:** corrigir o STATE para uma única etapa verdadeira; versionar somente os arquivos de projeto intencionais após revisão; registrar o hash do baseline final; não usar o certificado atual como autorização operacional até uma aprovação explícita do sponsor e aceitação dos critérios.

### P1 — A matriz normativa nova ainda contradiz a si própria e documentos de governança seguem como rascunho

`governance/normative-hierarchy.md` agora está na localização correta e contém RACI mais claro. Mas seu cabeçalho a declara fonte suprema em `governance/`, ao passo que o diagrama da seção 2 inclui “PCL-AEOS-NORM-01” no Nível 2 junto a `specs/`. Isso reintroduz a circularidade de autoridade. A cópia em `projects/pcl-aeos-harmonization/design/normative-hierarchy.md` declara ser espelho não primário, mas ainda mantém referências `file:///c:/PromptCore_Labs/...`, o fluxo antigo, a hierarquia antiga e coloca o documento no Nível 2. Não pode permanecer aparentemente vigente e com links locais.

Além disso, buscas estáticas ainda encontraram texto instrucional de elaboração em fontes de governança: `policies.md` (“Criar...”, “Explicar...”); `stage-gates.md` (“Explicar...”), `roles.md` e `decision-authority.md` (“Explicar/Criar...”), e `governance.md`. Há políticas de segurança com status de “fonte soberana” sem que todo o conteúdo esteja efetivamente formulado como política aprovada. O documento de maior autoridade não torna automaticamente completos os subordinados.

**Ação:** retirar o próprio NORM-01 do nível de especificações e especificar explicitamente como documentos de governança se relacionam; declarar a cópia de `projects/` como `SUPERSEDIDA` e substituir URLs `file:///` por referência relativa; concluir ou marcar formalmente como rascunhos os documentos de políticas/papéis/gates que mantêm placeholders.

### P1 — O Compose ainda tem credenciais padrão previsíveis, apesar do uso de variáveis

As portas default em loopback são um avanço. Porém, o Compose contém fallback para `POSTGRES_PASSWORD:-paperclip` e `OMNIROUTE_INITIAL_PASSWORD:-admin`; se o `.env` faltar ou estiver incompleto, a configuração degrada para credenciais conhecidas. O `.env.example` também distribui valores de exemplo que parecem segredos concretos (`paperclip_secure_password_2026_change_me`, `admin_secure_omniroute_2026`, `paperclip-secret-auth-key-2026-secure`) e instrui a troca, mas não obriga isso. A parametrização isolada não é gestão segura de segredos.

O bind de Laya em `127.0.0.1` evita exposição externa por padrão, mas o endpoint continua sem autenticação; a opção de publicar em outro bind pode ampliar esse risco. O Dockerfile agora consulta `/ready`, mas `LAYA_REQUIRE_NEURAL` está desligado por padrão tanto no Compose quanto no `.env.example`; nesse modo, a probe pode passar mesmo quando o serviço está degradado em fallback.

**Ação:** remover defaults de senha e exigir variáveis não vazias/fortes com falha fechada; usar placeholders claramente não utilizáveis em `.env.example`; documentar rotação e armazenamento local; confirmar qual probe o Dockerfile usa e escolher conscientemente a política para modo degradado. Separar bind loopback local de acesso via Tailscale, sem publicar a API anonimamente na interface de rede.

### P1 — A afirmação de teste “holdout cego” e calibração do benchmark não corresponde ao protocolo implementado

O dataset de 60 pares e os rótulos Dev/Holdout estão juntos em `services/pcl-laya/data/reconciliation_dataset.json`. Esse arquivo está não rastreado no momento, mas o desenho coloca os labels do holdout no mesmo arquivo acessível pelo script, portanto o conjunto não é cego. O script calcula métricas por subset, porém fixa `threshold=0.60`; não deriva/calibra o limiar com o Dev e depois o congela antes de avaliar Holdout. Chamar Dev de “calibração” e Holdout de “cego” superestima a separação metodológica.

O script verifica `/health` e imprime `status`/`engine_mode`, mas não interrompe a execução se `status` for `degraded` nem exige `engine_mode == neural_onnx`. As chamadas registram previsões e latência apenas em memória; o relatório salvo contém agregados, sem resultados por caso/probabilidades brutas, comando, hardware, CPU quota/thread count e ambiente de dependências. As métricas podem, portanto, refletir fallback sem que o benchmark falhe, embora o laudo diga modo neural. Há ainda uma inconsistência entre o argumento do script (threads configuráveis, default 2) e “throughput por core” sem comprovação da quota de um core.

Os 60 rótulos continuam sem protocolo documentado de origem, anotadores, adjudicação, cobertura e controle de ambiguidades. A amostra é útil como smoke/ensaio interno inicial, mas pequena, autoformulada e com facts sobre o próprio sistema. A execução offline é “controlada” apenas em um sentido operacional; não estabelece validade científica ou generalização.

**Ação:** chamar resultado de ensaio interno; retirar o rótulo “cego” ou manter os labels em artefato separado, não disponível durante o ajuste; calibrar threshold só em Dev e congelá-lo antes do Holdout; falhar em modo degradado; persistir saída por amostra e metadados da execução; obter anotação independente e expandir variedade de idiomas, paráfrases, neutralidade, temporalidade e conflitos parciais.

### P1 — A identidade criptográfica é verificada no provisionamento, mas não na carga de runtime

O script de download valida SHA-256 e tamanho dos artefatos antes de aceitar/download, o que resolve grande parte do achado anterior. Já `classifier.py` lê o hash declarado no `manifest.json`, mas não recalcula o SHA-256 do ONNX/tokenizer/config ao inicializar nem valida o status/commit/revisão do manifest. A telemetria então pode anunciar hash “verificado” sem haver verificação de runtime. O manifest também é gerado em cada provisionamento e a data `verified_at` muda, portanto deve ser tratado como registro de build, não uma assinatura independente.

**Ação:** validar artefatos no início do processo, ou provar a verificação na etapa de build e amarrar a imagem/container ao digest imutável; expor hash apenas com status de verificação preciso (`download_verified`, `runtime_verified`, etc.). O laudo deve identificar o digest da imagem e o snapshot do checkout efetivamente testado.

### P1 — Claims antigos e diagramas continuam em conflito com as métricas atualizadas e com a autoridade humana

No README raiz, o resumo principal relata 93,3% de especificidade e 70% de recall, mas a seção de memória e a legenda `DIAG-LAYA-01` ainda afirmam 93,3% de recall, cerca de 22 ms e “supersessão automática”. Na tabela comparativa também permanece `93.33%` como recall, embora a coluna agora diga 63,3% de especificidade, em contradição com o resultado 93,33% de especificidade/70% de recall. O mesmo diagrama não foi reconciliado à nova regra de sensor consultivo e autoridade humana.

O benchmark apresenta média consolidada de 23,91 ms, P50 22,51 e P95 41,63 ms, mas alguns pontos do README dizem 22,33, 22,3 ou 22 ms sem contexto. P95 excede a meta frequentemente citada de 35 ms; portanto, a média não demonstra que essa meta seja cumprida em 95% das chamadas. O claims register ainda traz a latência antiga de 0,014 ms como “benchmark MCP” sem separar IPC de inferência ONNX.

**Ação:** gerar todos os claims e legendas a partir de uma fonte de métricas única; publicar média, P50 e P95 com cenário, subset e método; distinguir latência de inferência, API e MCP; atualizar o texto de supersessão para exigir autorização humana; esclarecer se `<35 ms` é target para média, percentil ou cada chamada.

### P1 — “Foundation Ready” e aprovação de sponsor são declarações sem baseline/evidência suficientes

`foundation-readiness.md` passou a listar saneamentos e evidências, mas auto-homologar o Gate G-04 não é evidência independente de cumprimento. O certificado aponta para `b0b83df...`; alterações posteriores estão no HEAD `2c3f4...` e em working tree sujo. O artefato afirma aprovação do “Patrocinador Humano Soberano” sem assinatura, registro de decisão ou aprovação explícita observável na conversa. A contagem de “P1 integralmente resolvidos” também não pode ser aceita enquanto os itens acima persistem.

**Ação:** manter o status “declaração do projeto — aguardando revisão independente/aprovação” até que requisitos, critérios, evidências, baseline e aceite humano estejam alinhados. Auditoria de documentação não deve conceder autorização para abrir projetos estratégicos em nome do usuário.

## Oportunidades adicionais

| Área | Observação e próximo refinamento |
|---|---|
| Estado do projeto | Unificar o topo e a seção “Próximo passo” do STATE; remover afirmações de completion contraditórias; converter o histórico antigo em fatos datados e distinguíveis de status atual. |
| Nome da iniciativa | O usuário escolheu **Evolução Arquitetural do PCL AEOS**, mas cabeçalhos, ID `PCL-AEOS-HARM` e slug ainda dizem “Harmonização”. Atualizar a nomenclatura visível e definir se o slug antigo será mantido como caminho estável/compatibilidade. |
| Reprodutibilidade | O benchmark grava em caminho absoluto `C:\PromptCore_Labs\...`; usar caminho relativo ao script e emitir um novo arquivo por run com identificador, sem sobrescrever laudos anteriores. |
| Critérios operacionais | Falta explicitar limites de payload, comportamento para input truncado em 128 tokens, concorrência, timeouts, erros recuperáveis e tratamento de neutralidade/abstenção. |
| Confiança e calibração | A existência de threshold e `allow_abstain` é avanço, mas os scores softmax ainda não são probabilidades calibradas. `evaluate_choice` e `evaluate_score` continuam produzindo confidence por heurística/floor; não usar esses valores como grau de certeza sem calibração separada. |
| CI e prevenção de deriva | Automatizar verificação de links/anchors, placeholders em governance, consistência do norm ID, claims que divergem do benchmark, metadados de evidência, ausência de segredos e correspondência Compose/arquitetura/portas. |
| Limite do scan semântico | Laya pode apontar pares suspeitos, mas a revisão por precedência e evidência deve continuar humana. Nenhum “scan limpo” isolado comprova ausência de contradições em 925 Markdown. |

## Avaliação pelas mesmas dimensões

| Dimensão | Parecer nesta revisão | Tendência |
|---|---|---|
| Clareza/apresentação | Melhor, com claims ainda inconsistentes em seções e diagramas | Melhorou |
| Arquitetura e fronteiras | Compose e mapa físico convergem melhor; governança ainda duplica uma cópia obsoleta | Melhorou parcialmente |
| Autoridade normativa | Raiz apropriada criada localmente, mas autocontraditória, não rastreada e coexistindo com espelho antigo | Melhorou, não fechou |
| Métricas e evidências | Mais transparentes e com erro declarado; split/calibração, raw outputs e reprodutibilidade não sustentam homologação | Melhorou, não homologado |
| Laya semântico | Implementação e telemetria mais observáveis; hashes não são verificados pela carga runtime e benchmark não exige neural | Melhorou substancialmente |
| Segurança operacional | Bind loopback é melhora, mas defaults de senha previsíveis persistem | Melhorou parcialmente |
| Stage Gates/readiness | Certificate/STATE divergem e assentam em baseline antigo; aceite humano não demonstrado | Não confirmado |
| Continuidade | Registros abundantes, porém a própria continuidade está contraditória e novos artefatos não estão no Git | Insuficiente para handoff confiável |

## Parecer final e próximos passos

Os ajustes foram relevantes e aproximam o PCL AEOS de uma documentação mais profissional e operacional. Em particular, pinagem e checksums no download, health degradado, porta local e calibração de claims demonstram resposta direta ao relatório anterior.

**Não recomendo manter a declaração “Foundation Ready — sem pendências” neste estado auditado.** Para uma próxima revisão curta, priorize: (1) estabilizar e versionar um único baseline; (2) alinhar STATE, certificado e etapa real; (3) corrigir credenciais default, a hierarquia NORM-01 e os placeholders de governança; (4) consertar os claims/diagramas antigos; (5) reclassificar “holdout cego” e tornar o benchmark falhar em modo degradado, sem alegar validação independente; (6) só então submeter o Gate G-04 a aprovação humana explícita e registrar essa aprovação.

Esta auditoria não modifica nem aprova alterações operacionais. O resultado é um parecer do checkout local observado em 2026-10-17.
