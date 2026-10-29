# 📄 Product Requirements Document (PRD) — PCL AEOS v3.0.4 PROD
**Cognitive Engineering Substrate**  
*Documento de Requisitos de Produto — Linha de Base Normativa de Engenharia*  
**Autor:** Eduardo Machado (Principal Systems & AI Architect | Founder, PromptCore Labs)  
**Co-Autor:** Antigravity IDE (Agentic Engineering Pair)  
**Versão Oficial:** v3.0.4 PROD  
**Design System Canônico:** `C:\PromptCore_Labs\legacy\liquid_glass_bento_grid_system.html`  
**Status:** Linha de Base Normativa Consolidada & Não-Suprimida  

---

## 1. Visão Executiva & Definição Canônica

O **PCL AEOS (PromptCore Labs Artificial Intelligence Engineering Operation System)** é o substrato soberano, desacoplado e autônomo de engenharia de inteligência artificial da PromptCore Labs.

Ele opera como o núcleo central de inteligência corporativa, orquestração agêntica de missão crítica e governança ativa de artefatos. A plataforma garante liberdade total para o usuário configurar, orquestrar e alternar entre **quaisquer provedores de modelos** — sejam modelos proprietários na nuvem (OpenAI, Anthropic, Google AI Studio) ou infraestruturas locais/privadas open-source (Ollama com Gemma-3, LM Studio com Qwen 2.5 Coder 7B) via protocolo MCP (Model Context Protocol).

### 1.1. Propósito e Amplitude Operacional
- **Engenharia de Governança e Inteligência Agêntica**: Gestão de *Skills*, *Guardrails*, regras de negócio corporativas, roteamento dinâmico via OmniRoute (:20130) e agentes especializados (Cortex, Laya).
- **Geração e Orquestração de Artefatos Multifuncionais**: Construção, validação e auditoria de artefatos jurídicos (conformidade NR1/LGPD), estratégias comerciais, materiais de RevOps (Modelo Bowtie) e documentações de engenharia de sistemas.
- **Desenvolvimento End-to-End e Automação**: Engenharia completa de aplicações web, ecossistemas distribuídos, aplicativos mobile, sistemas de informação e fluxos de automação soberana.
- **Headless Storage / Bring Your Own Storage (BYOS)**: Atuação como orquestrador e visualizador soberano com custódia final delegada à infraestrutura de nuvem do próprio cliente (Google Workspace e Microsoft 365).

### 1.2. Diferencial Estratégico frente ao Mercado (Superação do Jumpad.ai)
Enquanto concorrentes como Jumpad.ai atuam como buscadores RAG estáticos e passivos, amarrados a nuvens de terceiros com custos imprevisíveis por token, o **PCL AEOS** entrega:
- **Soberania Absoluta & $0.00 Local Runtime**: Execução nativa de inferência e triagem em CPU local (0 MB GPU VRAM) via micro-classificador Laya (~22ms) e MiniLM local.
- **Ciclo de Vida Bidirecional**: Capacidade ativa de ler, compilar, auditar e **despachar/gravar ativamente** artefatos no Google Drive e OneDrive corporativos.
- **Transparência Operacional Ininterrupta**: A ausência de um resultado imediato nunca gera interface congelada; cada etapa de processamento é comunicada em tempo real.

---

## 2. Personas & Casos de Uso

### 2.1. C-Level / Diretor Executivo & Jurídico (Business Persona)
- **Objetivo**: Consultar bases de conhecimento corporativo, validar minutas contratuais, auditar conformidade LGPD / ISO 27001 e gerar memorandos estratégicos sem atrito técnico.
- **Requisito de Experiência**: Interface limpa, espaçosa, com tipografia editorial, ausência de poluição de métricas DevOps no fluxo principal, chips de citação precisa de fontes originais e visualização in-context de documentos.

### 2.2. Arquiteto de Sistemas, Engenheiro de Software & DevOps (Technical Persona)
- **Objetivo**: Construir e depurar pipelines distribuídos, inspecionar DAGs de microsserviços, auditar hashes criptográficos SHA-256 e acionar rollbacks compensatórios via Saga Pattern.
- **Requisito de Experiência**: Acesso instantâneo e não-bloqueante ao **Cortex Canvas DAG**, telemetria em milissegundos de cada nó em execução, trilha cognitiva dos agentes e monitoramento em tempo real do **Circuit Breaker**.

---

## 3. Design System Canônico de Referência: `liquid_glass_bento_grid_system.html`

O design system adotado como ponto de partida canônico é o especificado no arquivo de referência [`C:\PromptCore_Labs\legacy\liquid_glass_bento_grid_system.html`](file:///C:/PromptCore_Labs/legacy/liquid_glass_bento_grid_system.html), incorporando a arquitetura de **Bento Grid & Spatial Glass UI** com as seguintes adaptações estritas:

1. **Atenuação Radical do Movimento Físico**:
   - A fórmula original de tilt 3D no arquivo legado dividia as coordenadas do mouse por 45, gerando inclinações de até 8° que causavam sensação de instabilidade e náusea.
   - **Novo Padrão PCL AEOS**: O movimento físico dos cards é atenuado para uma micro-elevação tátil estável (máximo de 1° a 1.5° de inclinação ou elevação suave de 2px no hover), garantindo sobriedade e firmeza de nível industrial.
2. **Refração Dinâmica de Luz através do Vidro Translúcido**:
   - Conforme o usuário move o cursor pela tela, as variáveis CSS `--mouse-x` e `--mouse-y` atualizam gradientes radiais internos nos pseudo-elementos dos cartões (`.liquid-glass-card::before`). A luz se movimenta e refrata organicamente pela superfície vítrea sem deslocar o layout.
3. **Chipset PCL Substrato**:
   - Padrão vetorial sutil de trilhas de silício e circuito impresso com 3% a 4% de opacidade integrado ao fundo dos elementos vítreos, reagindo à passagem do brilho da refração de luz.
4. **Classes Canônicas Incorporadas**:
   - `.liquid-glass-card`: Vidro com `backdrop-filter: blur(28px) saturate(210%)` e bordas refrativas duplas.
   - `.liquid-glass-pill`: Pílulas de controle com efeito *Specular Light Sweep* em 60°.
   - `.glass-well`: Painéis rebaixados com sombra refrativa interna.
   - `.glass-peg`: Pinos de fixação vítreos nos cantos dos módulos.
   - Modos Claro (`#FFFFFF` / `#F8FAFC`) e Escuro (`#090A0F` / `#0F172A`) nativos.

---

## 4. Requisitos Funcionais Detalhados (FR)

### FR-01: Multi-Provedor Universal & Roteamento Dinâmico (OmniRoute)
- Liberdade irrestrita para configurar, orquestrar e alternar entre modelos proprietários na nuvem (OpenAI, Anthropic Claude 3.5 Sonnet, Google AI Studio Gemini 1.5 Pro) e modelos locais open-source (Ollama com Gemma-3, LM Studio com Qwen 2.5 Coder 7B) via protocolo MCP.
- Operação base do micro-roteador Laya consumindo **0 MB GPU VRAM** e com latência <= 35ms em CPU convencional.

### FR-02: Headless Storage & Bring Your Own Storage (BYOS) Bidirecional
- Atuação do PCL AEOS como orquestrador, validador e despachante soberano de artefatos:
  - **Zero-Bin Custody Efêmero**: Os arquivos binários originais do cliente são lidos em stream de memória RAM transitória, vetorizados pelo Laya + MiniLM para o PGVector e imediatamente expurgados da memória.
  - **Atestação e Integridade SHA-256**: Cada versão gerada recebe carimbo imutável no PostgreSQL local com rastreabilidade ISO 27001 e ISO 42001.
  - **Despacho e Gravação Ativa**: O PCL AEOS é capaz de gravar e publicar ativamente o arquivo final de volta no **Google Drive (Google Workspace)** ou **Microsoft OneDrive (M365)** da organização.
  - **Detecção de Staleness Instantânea**: Monitoramento de `ETag` para identificar alterações externas em menos de 50ms.
  - **Herança de Permissões (ACL Passthrough)**: Respeito estrito às permissões corporativas do usuário logado via SSO/OAuth2.

### FR-03: PCL Sovereign Drawer (Painel Lateral de Artefatos & Cortex Canvas)
- Painel lateral flutuante e persistente sobreposto ao workspace (ancorado firmemente à direita, sem deslocamento errático pela tela).
- Redimensionamento horizontal suave via arrasto (`col-resize`) entre 380px e 850px, com persistência da largura em `localStorage`.
- Controles de fechamento explícitos:
  - Botão `[× Fechar]` de alto contraste.
  - Botão `[Recolher →]` que minimiza o painel mantendo uma aba lateral.
  - Suporte ao atalho global de teclado `Escape` e clique no backdrop.
- **Seletor de Modo Duplo no Topo do Drawer**:
  - `Modo Documento`: Visualização in-context com opções de 1 clique (Imprimir PDF, Salvar .md, Abrir no Google Docs/Word Online ↗ e Publicar no Drive corporativo).
  - `Modo Cortex Canvas DAG`: Exibição do grafo orientado de arquitetura em tempo real.
- **Adaptação Mobile Responsiva (< 768px)**:
  - Elimina a divisão horizontal de tela e abre o Drawer como uma *Full-Screen Sheet* limpa com gesto de arraste para fechar.

### FR-04: Cortex Canvas DAG Live Telemetry & Trilha Cognitiva
- Renderização visual das etapas da *Cortex Engine Architecture Review* via grafos orientados (DAG):
  1. *Input Ingestion & Multimodal Parsing*
  2. *PII Guard & LGPD Sanitizer*
  3. *Laya + MiniLM Semantic Retrieval*
  4. *OmniRoute Engine Execution*
  5. *Stage Gates TLC v3 Verification*
  6. *SHA-256 Audit Trail Registration*
- **Telemetria de Nós em Milissegundos**: Cada nó exibe badge de estado (`pending`, `active`, `completed`, `compensating`), latência exata em ms e contador de execução.
- **Descolisão da Badge de Zoom**: Margem de resguardo de zoom (`pr-14`) garantindo resguardo de 56px da margem direita para eliminar qualquer sobreposição com a aba recolhida de status.

### FR-05: Left Sidebar Tier 1 (Padrão Provedores Globais)
- Eliminação total de siglas soltas cortadas (`CR`, `AR`, `DE`).
- Substituição por ícones geométricos modernos do Google Fonts (*Material Symbols*):
  - 🏛️ `auto_stories` — Biblioteca de Conhecimento
  - 📁 `folder_open` — Projetos da Squad
  - 📄 `article` — Artefatos & Relatórios
  - ⚡ `psychology` — Agentes & Habilidades
  - 🔌 `extension` — Conexões & Plugins
- Colapso fluido em barra de 64px com *tooltips flutuantes táteis* instantâneos ao passar o mouse.
- Acordeão de conversas agrupado temporalmente (*Hoje*, *Ontem*, *Últimos 7 dias*, *30 dias*).

### FR-06: Super-Composer & Token Aqua Orb (Física Apple OS X)
- Reposicionamento dos chips de atalhos rápidos (`PresetChips`) para **abaixo do campo de digitação**, eliminando qualquer colisão com o histórico do chat.
- **Componente `TokenAquaOrb`**:
  - *Repouso*: Esfera vítrea tridimensional (16px × 16px) com ponto de reflexo especular superior estilo Apple Aqua OS X.
  - *On-Hover*: Expansão elástica com mola CSS para figura oblonga (115px) exibindo `14.2k / 128k (11%)`.
  - *Leave*: Contração fluida de volta à esfera vítrea.
  - *Glow Temporal Dinâmico*:
    - 🟢 Janela Segura (< 70%): Esmeralda vítreo estático com brilho suave estável.
    - 🟡 Alerta de Contexto (70% - 90%): Âmbar vítreo com pulso luminoso oscilando a cada **5 segundos exatos**.
    - 🔴 Limite Crítico (> 90%): Rubi vítreo com pulso luminoso oscilando a cada **2 segundos exatos**.

### FR-07: Identidade Oficial de Marca & Header Limpo
- Aplicação do logotipo oficial transparente localizado em `C:\PromptCore_Labs\assets\PCL_Logo_Transparente.png`, eliminando o bloco preto genérico `[PCL]`.
- Remoção do seletor de idiomas `PT | EN | ES` da barra principal do Header e migração para dentro do dropdown do perfil do usuário e modal de configurações gerais.
- Exibição de um único selo de confiança elegante e discreto: `● Enclave Soberano Ativo • 100% Privado`.

### FR-08: Segurança de Sessão Estrita (Strict 2 Devices Guard) & ISO
- Bloqueio automático da 3ª sessão concorrente de um mesmo usuário com alerta de segurança de sessão.
- Trilha de auditoria imutável no PostgreSQL com conformidade estrita às normas ISO 27001 e ISO 42001.

---

## 5. Princípios de Transparência Operacional Ininterrupta

A premissa basilar do PCL AEOS é que **a ausência de um resultado imediato nunca deve ser interpretada como ausência de atividade ou congelamento da interface**:
- **Shimmer Skeletons Proporcionais**: Exibidos instantaneamente ao enviar um comando.
- **Trilha Cognitiva Inline**: Mensagens sutis indicando o raciocínio em tempo real do agente orquestrador (*"Laya NLI sintetizando matriz semântica (22ms)..."*).
- **Indicadores Percentuais e Etapas Claras**: Comunicação contínua da etapa em execução tanto no chat quanto no Cortex Canvas DAG.
- **Botão de Acompanhamento em Tempo Real**: Sempre que uma tarefa longa for iniciada, o chat oferece o botão `[Acompanhar no Cortex Canvas ➔]`.

---

## 6. Tríade de Resiliência Distribuída: Especificação Funcional

Para assegurar que o PCL AEOS opere ininterruptamente em ambientes de missão crítica sem perda de contexto, duplo faturamento de tokens ou congelamento de tela:

### FR-RES-01: Idempotência Determinística via Token SHA-256
- **Comportamento**: Toda ação iniciada pelo usuário (envio de prompt, solicitação de artefato, transição de nó no Canvas) gera uma chave única baseada em `HMAC-SHA256(SessionID + Action + Payload + TimeWindow)`.
- **Proteção Contra Duplo Clique**: Se o usuário disparar cliques repetidos no botão de envio, a UI não re-submete a requisição; o botão entra em estado visual de feedback imediato enquanto a primeira chamada é processada.
- **Reconexão WebSocket / Rede**: Se a conexão oscilar e for reestabelecida, o cliente envia a chave de idempotência; o servidor retoma o stream existente sem duplicar mensagens no histórico.
- **Critério de Aceite**: Zero mensagens duplicadas no chat sob testes de stress de 10 cliques simultâneos; zero reprocessamento de nós no backend para o mesmo token.

### FR-RES-02: Saga Pattern com Compensação Automática e Checkpoints
- **Comportamento**: Pipelines compostos por múltiplos agentes (Ingestão ➔ PII Guard ➔ Roteamento LLM ➔ Persistência ➔ Despacho Cloud BYOS) são tratados como transações distribuídas coordenadas pelo `SagaOrchestrator`.
- **Compensação em Falha de Nuvem**: Se o envio para a nuvem externa (ex: Google Drive corporativo) falhar por token expirado ou quota esgotada:
  1. A transação não aborta de forma destrutiva;
  2. O último checkpoint seguro (artefato local com hash SHA-256 atestado) é preservado no Enclave Local;
  3. No **Cortex Canvas**, o nó correspondente transiciona visualmente para a cor âmbar com a badge `Compensated / Checkpoint Salvo`;
  4. O chat informa com cordialidade o ocorrido e oferece o botão de ação rápida: `[Reconectar Provedor e Reenviar ➔]`.
- **Critério de Aceite**: Em caso de falha em qualquer nó downstream, o usuário nunca perde o trabalho já produzido; os artefatos parciais são mantidos no Enclave Soberano.

### FR-RES-03: Circuit Breaker Reativo com Fallback Soberano $0.00
- **Comportamento**: Monitora a taxa de erro e latência dos provedores de IA upstream (OpenAI, Anthropic, Google Cloud).
- **Mecanismo de Disparo**: Ao detectar 3 falhas consecutivas (erros 5xx ou timeout superior a 15s), o circuito transiciona de `CLOSED` para `OPEN`.
- **Transição Transparente para Ollama Local**:
  - As requisições são automaticamente desviadas para o servidor Ollama local (executando em CPU os modelos Gemma-3 ou Qwen 2.5 Coder 7B a 0 MB de VRAM);
  - A interface exibe uma badge translúcida discreta no topo do composer: `⚡ Fallback Soberano Local Ativado • $0.00 USD • Operação Ininterrupta`;
  - Após 30 segundos de resfriamento, o circuito entra em `HALF-OPEN` enviando uma sonda canário; caso a nuvem upstream responda com sucesso, o circuito se fecha automaticamente.
- **Critério de Aceite**: Nenhum travamento de tela ou mensagem de "Erro 500" exibida ao usuário; continuidade ininterrupta de resposta em < 2 segundos via inferência local.

---

## 7. Requisitos Não Funcionais (NFR)

| Código | Métrica | Especificação |
| :--- | :--- | :--- |
| **NFR-01** | **Latência Laya CPU** | <= 35ms em processador convencional sem necessidade de GPU. |
| **NFR-02** | **Core Web Vitals** | LCP < 1.2s, CLS = 0.00, INP < 50ms. |
| **NFR-03** | **Responsividade** | Adaptação ergonômica de 360px a 3840px (Desktop ultrawide e Mobile touch). |
| **NFR-04** | **Acessibilidade** | Contraste mínimo WCAG 2.1 AAA (>= 7:1 para leitura e >= 4.5:1 para controles). |
| **NFR-05** | **Zero VRAM Leak** | 0 MB de consumo de GPU VRAM para a camada de governança e roteamento local. |
