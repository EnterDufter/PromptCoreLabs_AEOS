# Relatório de Benchmark e Arquitetura de UX/UI: Jumpad.ai

**Projeto de Referência:** PCL AEOS

**Data da Análise:** Outubro de 2026

**Finalidade:** Mapeamento funcional, análise de governança/compliance e diretrizes de experiência do usuário (UX/UI) para superação dos requisitos no PCL AEOS.

## 1. Visão Geral e Posicionamento Estratégico

O **Jumpad.ai** posiciona-se não apenas como um assistente de IA, mas como uma **Camada de Inteligência Operacional Corporativa (Enterprise Cognition Layer)**. A narrativa de produto da empresa combate o paradigma de que *"IA é só um chat"*, transformando interações soltas em memória corporativa segura, auditável e acionável.

### 1.1. Tese de Valor e Filosofia no-code

* **Sem Dependência Técnica:** Permite que qualquer usuário autorizado crie agentes, automatize fluxos e conecte sistemas legados ou SaaS sem conhecimento de programação.

* **Transformação Organizacional:**

  * *Times viram Co-inteligentes:* Otimização da tomada de decisão diária.

  * *Empresas se tornam Answerable:* Acesso imediato a dados corporativos estruturados e não estruturados.

  * *Reuniões viram Conhecimento:* Indexação e extração contínua de inteligência de áudio/vídeo.

  * *Decisões ganham Precisão:* Redução do erro humano fundamentado em contexto em tempo real.

### 1.2. Discurso de Governança e Compliance (Mitigação dos 3 Grandes Riscos)

A estrutura do Jumpad aborda frontalmente os gargalos de *Shadow AI* e regulação corporativa (como **LGPD**, **EU AI Act** e exigências de conselhos de administração/board):

1. **Liability sem dono (Incerteza Jurídica e Regulatória):**

   * *O problema:* Respostas erradas de IA ou vazamentos de dados que embasam decisões corporativas sem rastreabilidade de responsabilidade (*"ninguém sabe quem responde"*).

   * *Impacto do mercado citado:* Empresas com alto uso de Shadow AI registram custo médio de violação **US\$ 670 mil mais alto** (IBM Cost of Data Breach Report, 2025).

   * *Solução:* Trilha de auditoria completa (*audit trail*), logs de interação por usuário e agente, permitindo responsabilização precisa.

2. **Custo sem atribuição (Descontrole Financeiro):**

   * *O problema:* Consumo pulverizado de APIs de LLM entre diferentes contas, ferramentas e modelos sem atribuição por centro de custo, projeto ou agente.

   * *Solução:* Atribuição granular de custo por interação, por usuário, por agente e por departamento em tempo real.

3. **Lock-in de Modelo (Independência de Infraestrutura):**

   * *O problema:* Conhecimento e automações indexados e aprisionados ao ecossistema de um único provedor de nuvem ou LLM.

   * *Solução:* Atuação como camada orquestradora independente de LLMs e clouds. O patrimônio cognitivo pertence à empresa, não ao modelo.

## 2. Detalhamento Mapeado das Funcionalidades

### Módulo 1: Interface Conversacional Unificada (Chat & Context Hub)

* **Atribuição Instantânea via `@` Mentions:**

  * No campo de prompt (*"Como eu posso ajudar você?"*), ao digitar `@`, abre-se um menu dropdown suspenso de conexões e aplicativos corporativos.

  * *Sistemas mapeados nas telas:* Google BigQuery, SAP, Google Sheets, HubSpot, Salesforce, Twenty, Jira, Google Agenda, Gmail.

  * *Experiência de uso:* Permite realizar perguntas unificadas (ex: *"Quais clientes estão com pagamentos em atraso este mês? @SAP @Twenty"*), disparando chamadas paralelas de API às ferramentas e unificando o resultado no chat.

* **Seletor Avançado Multimodelo (*Model Selector*):**

  * *Abordagem baseada em Nível de Raciocínio:* **Ultra** (avançado), **Avançado** (tarefas complexas), **Padrão** (dia a dia), **Rápido** (respostas simples) e **Auto modelo** (roteamento inteligente automático pela IA).

  * *Abordagem por Provedor/Modelo:* Acesso direto a múltiplos fornecedores de LLM no mesmo campo:

    * *Anthropic:* Sonnet 4.6, Claude-sonnet-4-5.

    * *xAI:* Grok 4.7, Grok 4.5.

    * *Alibaba/Qwen:* Qwen3.8-Max.

    * *OpenAI:* gpt-4.1-nano, GPT-5.6 Sol.

    * *Outros/Google:* Fable 5.1, Gemini Pro.

* **Ações Operacionais Inline:**

  * O chat não entrega apenas texto. Ele exibe cards interativos de dados (ex: lista de empresas inadimplentes com valores e dias de atraso: *Empresa Alfa Ltda R\$48.300/32 dias*, *Grupo Beta S.A R\$127.800/18 dias*, *Comércio Gama R\$23.100/45 dias*).

  * Executa comandos encadeados direto no chat, como: *"Gostei! Agende uma reunião quarta às 09h para tratar deste assunto com @Mariana Souza @Google Agenda"*. O sistema exibe o status *"Agendando reunião..."* e conclui sem que o usuário saia do fluxo.

### Módulo 2: Central de Reuniões e Conhecimento (*Meeting Intelligence*)

* **Organização em Pastas por Área:**

  * Estruturação visual de chamadas gravadas por contexto (*Vendas, Contabilidade, Roadmap, C-Level*).

* **Processamento e Síntese de Chamadas:**

  * Exibição de metadados da reunião (plataforma ex: Google Meet, data, duração ex: 22 min, avatar dos participantes).

  * **Resumo Estruturado por IA:** Análise automática de tópicos, métricas financeiras discutidas (ex: retorno de renda variável, variação do CDI, posições em IPCA+) e sugestão automática de "Próximos Passos".

* **Atalhos Contextuais de Perguntas (*Me pergunte sobre essa reunião*):**

  * Sugestões de pílulas clicáveis de dúvidas frequentes sobre o áudio: *"Quais ativos ficaram abaixo do benchmark?"*, *"Por que reduzir renda variável?"*, *"Quanto aumentar em IPCA+?"*, *"Qual a exposição cambial atual?"*, *"Quem precisa de revisão individual?"*.

* **Disparo de Ações a partir da Reunião:**

  * Prompt direto no rodapé da gravação: *"Gere um relatório de risco e envie o resumo desta reunião por e-mail para @Juliana Castro pelo @Gmail"*.

  * Feedback visual de processamento (*"Gerando relatório..."* ➔ *"E-mail enviado"* com card de confirmação verde).

### Módulo 3: Ecossistema de Agentes Especializados (*Agent Marketplace & Builder*)

* **Biblioteca de Agentes Especializados:**

  * Separados por **Destaques** e categorias **By Jumpad**: *Atendimento ao Cliente, Analista Financeiro, Assistente de Crédito, Qualificador de Leads, Redator de Conteúdo SEO, Análise de Concorrentes, Criador de Sequências de E-mail, Planejador de Redes Sociais, Sintetizador de Pesquisas com Usuários, Gerador de Propostas, Especialista em Voz da Marca, Priorizador de Funcionalidades, Gerador de Textos para Anúncios*.

* **Ficha Técnica e Parâmetros do Agente (*Sobre o Agente*):**

  * **Instruções (System Prompt):** Definição clara do papel, escopo e regras do agente (ex: *"Você é um Agente Assistente de Crédito especializado em análise e concessão de crédito..."*).

  * **Apps Integrados:** Exibição dos ícones das ferramentas autorizadas que o agente pode ler/escrever (Calendar, HubSpot, BigQuery, Sheets, Jira, Salesforce).

  * **Visibilidade/Permissões:** Controle de quem pode acessar no workspace (*Disponível para: Todos / Grupos / Privado*).

* **Início Zero-Prompt ("O agente já sabe"):**

  * Ao abrir o chat de um agente específico, o sistema exibe opções prontas em cards de atalho baseadas no conhecimento interno do agente (ex: *"Quais clientes estão em atraso há mais de 30 dias?"*, *"Gerar relatório de risco da carteira ativa"*, *"Priorizar cobranças desta semana"*).

### Módulo 4: Automação e Orquestração Visual de Processos (*Flows Engine*)

* **Gestão de Fluxos no-code (*Flows*):**

  * Organização por abas (*Todos, Meus flows, Compartilhados comigo*) com cards informando última atualização, avatares dos membros com acesso e ícones dos sistemas envolvidos.

  * Exemplos de fluxos: *Acompanhamento de pagamentos em atraso, Fluxo de aprovação de faturas, Convite para encontros, Qualificação de leads, Acompanhamento de onboarding, Lembrete de renovação de contratos, Escalonamento de chamados, Alerta de estoque baixo*.

* **Editor Gráfico Canvas de Nós (Workflow Canvas):**

  * Construção visual em blocos conectados da esquerda para a direita:
    `[Gatilho: Webhook]` ➔ `[Agente: Analisar pagamento]` ➔ `[Condição: Requer cobrança?]` ➔ *(Sim)* ➔ `[Ação: Gmail / Enviar e-mail]` **OU** *(Não)* ➔ `[Ação: Criar nota interna]`.

* **Execução em Tempo Real e Monitoramento Visual:**

  * Botão de teste/execução (*"Executar"*).

  * Durante o processamento, os blocos acendem com uma borda verde e um indicador check ($\checkmark$), permitindo auditoria visual exata de onde o fluxo está passando.

* **Inspeção de Variáveis e Templates Dinâmicos:**

  * Painel lateral de inspeção dos nós, exibindo entradas/saídas com tags dinâmicas no e-mail (ex: `Olá, {{Cliente}}! A fatura nº [Número] no valor de [Valor] venceu em [Data]...`), permitindo visualização prévia dos dados antes do disparo.

### Módulo 5: Governança, Compliance e Gestão Financeira de IA (*AI Budget & Governance*)

Esta é a funcionalidade central de diferenciação corporativa do Jumpad.ai, dividida nas visões **Visão Geral**, **Orçamento** e **Atividade**:

```
[ Painel de Controle Orçamentário de IA ]
├── Visão Geral de Métricas
│   ├── Orçamento Utilizado (% e valor $): ex. 34% ($4,362.55 de $19,200.00)
│   ├── Gasto Diário Médio: ex. $174.50 / dia
│   └── Projeção do Mês: ex. $5,235.05 no ritmo atual
├── Visões Multidimensionais de Custos
│   ├── Gastos por Provedor (Anthropic, Qwen, Grok, OpenAI)
│   ├── Gastos por Modelo (Grok 4.7, Grok 4.5, Qwen3.8-Max, gpt-4.1-nano, claude-sonnet-4-5)
│   ├── Gastos por Módulo da Plataforma (Chat, Flows, Reuniões, Outros)
│   ├── Gastos por Departamento (Tech, Design, Sales, Marketing, R&D)
│   └── Gastos por Usuário Individual (Foto, Nome, E-mail, $ Consumido / $ Limite)
└── Teto de Gastos e Trava de Segurança (Budget Control)
    ├── Limite Mensal Editável (Slider e Input Numérico, ex: $19,200.00)
    ├── Notificação de Limite para Admins (Toggle)
    └── Habilitar Budget Control (Toggle de bloqueio automático de uso)

```

#### Detalhes do Acompanhamento Granular de Alocação (Telas Específicas Mapeadas):

1. **Painel de Alocação por Departamento:**

   * Exibe o total geral da empresa: **US\$ 19.200,00/mês**.

   * Resumo Financeiro: *Alocado: US\$ 14.400,00* | *Gasto este mês: US\$ 4.362,55* | *Disponível sem alocação: US\$ 4.800,00*.

   * Tabela por equipe com contagem de usuários, barra de progresso individual e ações de edição/exclusão:

     * *Jumpad Core (36 usuários):* US\$ 312,00 / US$ 780,00

     * *Tech (54 usuários):* US\$ 1.212,50 / US$ 2.879,00

     * *Sales (36 usuários):* US\$ 1.534,95 / US$ 2.184,00

     * *Founders (12 usuários):* US\$ 1.034,20 / US$ 3.120,00

     * *Product (30 usuários):* US\$ 387,60 / US$ 1.248,00

     * *Design (30 usuários):* US\$ 186,90 / US$ 998,00

     * *R&D (18 usuários):* US\$ 158,40 / US$ 390,00

     * *Marketing (24 usuários):* US\$ 142,60 / US$ 281,00

     * *Operação (42 usuários):* US\$ 2.054,40 / US$ 3.120,00

2. **Drill-down de Alocação Individual (Nível Usuário):**

   * Ao expandir um departamento (ex: *Tech - 54 usuários*), a interface abre a lista completa de colaboradores associados:

     * *Lucas Ferraz (`lucas.ferraz@jumpad.ai`):* US\$ 26.0 / US$ 42 (Barra de consumo em \~60%)

     * *Mariana Couto (`mariana.couto@jumpad.ai`):* US\$ 35.1 / US$ 78

     * *Diego Rocha (`diego.rocha@jumpad.ai`):* US\$ 70.2 / US$ 90

     * *Fernanda Lima (`fernanda.lima@jumpad.ai`):* US\$ 13.9 / US$ 42

     * *Otávio Brandão (`otavio.brandao@jumpad.ai`):* US\$ 336.0 / US$ 600

     * *Paula Siqueira (`paula.siqueira@jumpad.ai`):* US\$ 63.9 / US$ 90

     * *Renato Vasconcelos (`renato.vasconcelos@jumpad.ai`):* US\$ 96.0 / US$ 240

     * *Sofia Mendonça (`sofia.mendonca@jumpad.ai`):* US\$ 204.0 / US$ 240

   * *Mecanismo de Bloqueio:* Caso o limite individual seja atingido e a trava de segurança esteja ativada, o usuário tem a execução de chamadas à IA bloqueada imediatamente, prevenindo estouros de orçamento indesejados.

## 3. Análise da Experiência do Usuário (UX/UI) do Jumpad.ai

### PONTOS FORTES DE UX/UI:

1. **Estética Minimalista e "Canvas Limpo":** Uso ostensivo de espaço em branco, bordas arredondadas e suavidade em tons neutros, transmitindo leveza apesar da alta complexidade técnica nos bastidores.

2. **Contextualização com Pílulas e Ícones de Aplicação:** O uso visual dos logos dos aplicativos (SAP, Gmail, Salesforce, Twenty) dentro da caixa de texto e nas listas torna a leitura e a auditoria instantâneas.

3. **Feedback Micro-interativo Contínuo:** Status transparentes em tempo real durante processamentos longos (*"Pensou por 3 segundos"*, *"Buscando pagamentos..."*, *"Chamando ferramenta"*, *"Gerando relatório..."*).

4. **Combinação de Linguagem Natural com Controles de Slider/Toggle:** Para configuração de governança e orçamentos, o sistema oferece tanto controles visuais (sliders de limite de gasto) quanto entradas diretas de texto e tabelas filtráveis.

## 4. Matriz de Requisitos e Oportunidades de Melhoria para o PCL AEOS

Para garantir que o **PCL AEOS** entregue uma solução equivalente e **superior** ao Jumpad.ai, estruturamos o seguinte comparativo funcional e de UX:

| **Módulo / Funcionalidade** | **Padrão do Jumpad.ai** | **Proposta de Melhoria Superior no PCL AEOS** | 
| **Interface de Chat** | Menção de apps via `@` e seletor manual/automático de LLMs. | **Autocompletar Inteligente Avançado & Multi-contexto:** Permitir `@` para apps e simultaneamente `#` para documentos/bases de conhecimento internas específicas na mesma frase. | 
| **Execução de Ações** | Exibe cards com confirmação e botões de atalho. | **Preview Dinâmico Editável:** Antes de enviar o e-mail ou criar o compromisso na agenda, abrir um mini-editor inline para o usuário revisar/ajustar a mensagem com um clique sem precisar reenviar prompts. | 
| **Reuniões e Conhecimento** | Gravações com resumo, tags de perguntas e envio de resumos por e-mail. | **Cross-Meeting Intelligence:** Permitir fazer perguntas comparativas entre múltiplas reuniões (ex: *"Compare o que a equipe de Vendas prometeu em Julho com o que o C-Level aprovou em Agosto"*). | 
| **Agentes de IA** | Marketplace estático de agentes com seleção por card. | **Agentes Colaborativos (Multi-Agent Swarm):** Permitir convocar mais de um agente no mesmo chat (ex: `@AnalistaFinanceiro e @EspecialistaJuridico avaliem este contrato`). | 
| **Automação (Flows)** | Canvas visual de nós com monitoramento passo a passo. | **Geração de Flow por Voz/Prompt:** Além do drag-and-drop, permitir criar a estrutura inicial do fluxo digitando em linguagem natural (ex: *"Crie um fluxo que leia webhooks do CRM e avise no Slack"*). | 
| **Governança & Custos** | Teto orçamentário por dep/usuário, com bloqueio rígido e dashboards por modelo. | **Previsão Preditiva com Alerta Proativo e Sugestão de Otimização:** O PCL AEOS pode sugerir a troca automática de modelos caros por modelos mais econômicos para tarefas simples (ex: *"Você economizará US\$ 420/mês se migrar seus prompts de resumo para o GPT-4o-mini"*). | 
| **Compliance & Audit Trail** | Conformidade com LGPD e EU AI Act citada em LP. | **Painel Dedicado de Compliance e Sensibilidade de Dados:** Exibição de um log com tags de mascaramento de PII (dados pessoais/financeiros sensíveis que foram anonimizados antes do envio para a LLM). | 

## 5. Conclusão e Próximos Passos para o PCL AEOS

O **Jumpad.ai** prova que o mercado corporativo busca plataformas que unam **simplicidade de chat com controle rigoroso de governança**. A chave do sucesso de UX/UI demonstrada no vídeo é a **invisibilidade da complexidade**: o usuário final apenas conversa e vê o trabalho ser feito, enquanto a equipe de TI/Financeiro mantém controle absoluto sobre cada centavo e cada dado transmitido.

Com este mapeamento detalhado, a equipe de produto e design do **PCL AEOS** possui todos os requisitos funcionais e de experiência necessários para construir uma plataforma de classe mundial que atenda os mesmos pilares e os supere nos pontos de atrito identificados.

```

---

### Resumo do Relatório
O arquivo `.md` foi gerado com a consolidação completa de:
1. **Posicionamento e Compliance:** Análise dos três grandes riscos (Liability, Custo e Lock-in) com métricas de mercado do estudo da IBM.
2. **Relatório Detalhado das 5 Dimensões Funcionais:** Chat Unificado (`@` Mentions), Central de Reuniões, Ecossistema de Agentes, Visual Flows Canvas e Painel de Governança/Orçamento.
3. **Mapeamento Orçamentário Exato:** Inclusão de todos os valores de alocação por departamento e usuário conforme extraído das capturas.
4. **Matriz de Requisitos para o PCL AEOS:** Mapeamento de funcionalidades essenciais (*baseline*) e oportunidades diretas de diferenciação para tornar a UX/UI do PCL AEOS superior à do Jumpad.ai.

Se precisar de mais detalhamento para algum módulo em específico do PCL AEOS, basta me avisar!

```