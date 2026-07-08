# TLC Spec-Driven v3 - SPECIFY

**Aplicacao**: PromptCore Labs Website  
**Tipo**: Web  
**Saida**: `C:\PromptCore_Labs\.specs\apps\web\promptcore-labs-website\specify.md`  
**Status**: Aguardando aprovacao do usuario  
**Data**: 2026-06-30  
**Etapa TLC**: SPECIFY  

## 1. Controle de Escopo

### 1.1 Objetivo

Especificar os requisitos da aplicacao web institucional da PromptCore Labs antes de qualquer decisao de design, tasking ou implementacao.

A aplicacao deve comunicar a PromptCore Labs como empresa de IA aplicada, automacao e arquitetura operacional para startups, empresas e ecossistemas de inovacao, com foco em clareza, autoridade, SEO, GEO / AI Visibility e conversao qualificada.

### 1.2 Fontes de Verdade

- `C:\PromptCore_Labs\PromptCoreLabs_Landing_Page\README.md`
- `C:\PromptCore_Labs\PromptCoreLabs_Landing_Page\docs\05-arquitetura-da-landing.md`
- `C:\PromptCore_Labs\PromptCoreLabs_Landing_Page\docs\07-requisitos-tecnicos-seo-geo.md`
- `C:\PromptCore_Labs\PromptCoreLabs_Landing_Page\docs\09-roadmap-e-evolucao.md`
- `C:\PromptCore_Labs\PCL_INFRA_STACK_v2.md`
- `C:\PromptCore_Labs\.specs\projects\promptcore-labs-foundation\CREATIVE_FLOW_HARMONIZATION_v2.0.md`

Observacao: este documento foi preservado como especificacao do app web `promptcore-labs-website`. A especificacao base da metodologia TLC Spec-Driven v3 fica separada em `C:\PromptCore_Labs\.specs\methodology\tlc-spec-driven-v3\specify.md`.

### 1.3 Dentro do Escopo

- Landing page institucional de pagina unica.
- Navegacao por ancoras.
- Apresentacao clara da PromptCore Labs.
- Apresentacao do Project.OS como plataforma da PromptCore Labs.
- Secoes institucionais, servicos, educacao, autoridade, conteudos futuros, FAQ, CTA e footer.
- SEO tecnico basico.
- GEO / AI Visibility.
- Dados estruturados basicos.
- Contato funcional por link, e-mail, formulario externo ou mecanismo simples aprovado posteriormente.
- Preparacao para evolucao futura sem criar complexidade prematura.

### 1.4 Fora do Escopo Nesta Etapa

- Codigo.
- Design visual, wireframes, layouts finais ou escolha de componentes visuais.
- `design.md`, `tasks.md`, backlog tecnico ou plano de execucao.
- Backend robusto.
- Banco de dados proprio.
- Autenticacao.
- Area logada.
- CMS.
- Blog completo.
- Dashboards reais.
- Integracoes complexas de CRM, analytics, automacao ou IA.
- Metricas inventadas, depoimentos ficticios ou cases nao validados.

## 2. Requisitos Funcionais

| ID | Requisito | Criterios de Aceite |
|---|---|---|
| PCL-WEB-FR-001 | A aplicacao deve apresentar a PromptCore Labs no primeiro bloco da pagina. | O visitante deve entender em ate 5 segundos que a PCL atua com IA aplicada, automacao e arquitetura operacional para startups, empresas e ecossistemas de inovacao. |
| PCL-WEB-FR-002 | A aplicacao deve ter navegacao por ancoras para as secoes principais. | O usuario deve conseguir acessar Inicio, O que fazemos, Project.OS, Servicos, Conteudos e Contato sem trocar de pagina. |
| PCL-WEB-FR-003 | A aplicacao deve explicar o problema central que a PCL resolve. | A pagina deve comunicar dores como processos dispersos, dados fragmentados, IA sem contexto, automacoes frageis, baixa rastreabilidade e dificuldade de escalar. |
| PCL-WEB-FR-004 | A aplicacao deve apresentar as frentes de atuacao da PCL. | Devem existir blocos claros para Consultoria & Arquitetura, Plataformas & Produtos e Educacao & Aceleracao. |
| PCL-WEB-FR-005 | A aplicacao deve identificar os publicos atendidos. | Deve ficar claro que a PCL atende startups, hubs, parques tecnologicos, universidades e empresas em transformacao. |
| PCL-WEB-FR-006 | A aplicacao deve explicar a abordagem metodologica da PCL. | A pagina deve apresentar engenharia de contexto, engenharia de harness, human-in-the-loop e governanca cognitiva de forma compreensivel. |
| PCL-WEB-FR-007 | A aplicacao deve apresentar o Project.OS. | O Project.OS deve ser definido como plataforma da PCL para gestao inteligente de projetos, editais, evidencias, indicadores e ecossistemas de inovacao. |
| PCL-WEB-FR-008 | A aplicacao deve apresentar servicos institucionais. | Devem ser descritos diagnostico de maturidade, arquitetura de CRM/dados/automacao, engenharia de contexto/agentes, plataformas/produtos digitais e educacao/advisory. |
| PCL-WEB-FR-009 | A aplicacao deve apresentar a frente de educacao e labs. | A pagina deve comunicar trilhas, workshops, mentorias ou programas sobre IA aplicada, engenharia de contexto, automacao, CRM, RevOps e governanca cognitiva. |
| PCL-WEB-FR-010 | A aplicacao deve criar autoridade sem promessas falsas. | A pagina deve usar experiencia real e areas de conhecimento, sem inventar clientes, numeros, depoimentos ou cases. |
| PCL-WEB-FR-011 | A aplicacao deve incluir uma area de conteudos futuros. | A pagina deve indicar temas editoriais de SEO/GEO como engenharia de contexto, engenharia de harness, governanca cognitiva e Project.OS. |
| PCL-WEB-FR-012 | A aplicacao deve incluir FAQ indexavel. | A FAQ deve responder perguntas sobre PCL, publico, servicos, diferencial, Project.OS e papel humano no uso de IA. |
| PCL-WEB-FR-013 | A aplicacao deve oferecer CTA de contato. | Deve existir pelo menos um caminho funcional para iniciar conversa com a PCL. |
| PCL-WEB-FR-014 | A aplicacao deve ter footer institucional. | O footer deve conter assinatura da PCL, definicao curta, links de navegacao, contato e informacoes institucionais basicas. |
| PCL-WEB-FR-015 | A aplicacao deve estar preparada para expansao futura. | A estrutura conceitual deve permitir evoluir para paginas como `/project-os`, `/servicos`, `/sobre`, `/conteudos`, `/cursos`, `/plataformas` e `/contato`. |

## 3. Requisitos Nao Funcionais

| ID | Requisito | Criterios de Aceite |
|---|---|---|
| PCL-WEB-NFR-001 | A aplicacao deve ser responsiva. | A experiencia deve ser adequada em mobile, tablet e desktop. |
| PCL-WEB-NFR-002 | A aplicacao deve priorizar performance. | A meta inicial e Lighthouse Performance acima de 90, LCP abaixo de 2.5s e CLS proximo de zero em condicoes normais. |
| PCL-WEB-NFR-003 | A aplicacao deve ser acessivel. | A meta inicial e Lighthouse Accessibility acima de 90, com HTML semantico, foco visivel, contraste adequado e navegacao por teclado. |
| PCL-WEB-NFR-004 | A aplicacao deve ser indexavel. | Conteudo principal, FAQ e definicoes institucionais devem estar em HTML textual, nao presos em imagens. |
| PCL-WEB-NFR-005 | A aplicacao deve ter SEO basico. | Deve conter title, meta description, canonical, Open Graph, Twitter Card, sitemap, robots e headings semanticos. |
| PCL-WEB-NFR-006 | A aplicacao deve atender GEO / AI Visibility. | Deve responder claramente quem e a PCL, o que faz, para quem faz, como faz, por que e diferente e o que e Project.OS. |
| PCL-WEB-NFR-007 | A aplicacao deve ser simples de manter. | Conteudo institucional e dados repetitivos devem ser organizados de forma rastreavel e atualizavel. |
| PCL-WEB-NFR-008 | A aplicacao deve evitar complexidade prematura. | Nao deve exigir backend, banco, autenticacao, CMS ou integracoes complexas para entregar a primeira versao. |
| PCL-WEB-NFR-009 | A aplicacao deve preservar tom institucional. | A linguagem deve transmitir clareza, autoridade, seguranca, governanca e maturidade tecnica sem hype vazio. |
| PCL-WEB-NFR-010 | A aplicacao deve suportar deploy estatico. | A primeira versao deve poder ser publicada como site estatico sempre que as funcionalidades aprovadas permitirem. |

## 4. Arquitetura de Software

### 4.1 Visao Conceitual

```text
Usuario
  -> Aplicacao web institucional
  -> Conteudo estruturado e indexavel
  -> CTA de contato
  -> Canal de relacionamento definido posteriormente
```

### 4.2 Modulos Conceituais

| ID | Modulo | Responsabilidade |
|---|---|---|
| PCL-WEB-ARCH-001 | Shell institucional | Prover estrutura geral da pagina, navegacao e footer. |
| PCL-WEB-ARCH-002 | Conteudo estrategico | Centralizar textos, listas, FAQ, servicos, publicos e capacidades do Project.OS. |
| PCL-WEB-ARCH-003 | Secoes de apresentacao | Organizar a narrativa institucional em blocos independentes e rastreaveis. |
| PCL-WEB-ARCH-004 | SEO/GEO | Expor metadados, dados estruturados, sitemap, robots e conteudo citavel. |
| PCL-WEB-ARCH-005 | Contato/conversao | Direcionar visitantes qualificados para conversa com a PCL. |
| PCL-WEB-ARCH-006 | Assets publicos | Disponibilizar imagens, icones, logos e Open Graph aprovados. |

### 4.3 Restricoes Arquiteturais

- A primeira versao deve favorecer renderizacao estatica.
- A aplicacao nao deve depender de estado de usuario autenticado.
- A aplicacao nao deve exigir banco de dados proprio.
- A aplicacao nao deve introduzir servicos de terceiros sem necessidade aprovada.
- Futuras integracoes de formulario, CRM ou analytics devem usar variaveis de ambiente e configuracao externa.

### 4.4 Decisoes Pendentes Para Aprovacao Futura

- Dominio oficial.
- Canal de contato inicial: `mailto`, formulario externo, HubSpot, Google Sheets, Supabase ou outro.
- Ferramenta de analytics: Vercel Analytics, Google Analytics, Plausible, PostHog, HubSpot ou nenhuma na primeira publicacao.
- Logo final e identidade visual definitiva.
- URLs oficiais de redes sociais.

## 5. Arquitetura de Dados

### 5.1 Entidades de Conteudo

| ID | Entidade | Campos Esperados |
|---|---|---|
| PCL-WEB-DATA-001 | NavigationItem | label, href |
| PCL-WEB-DATA-002 | TrustPillar | title, text |
| PCL-WEB-DATA-003 | PainPoint | title, text |
| PCL-WEB-DATA-004 | Service | title, text, result |
| PCL-WEB-DATA-005 | Audience | title, text, gain |
| PCL-WEB-DATA-006 | ApproachPillar | title, text |
| PCL-WEB-DATA-007 | ProjectOSCapability | label |
| PCL-WEB-DATA-008 | EducationTheme | label |
| PCL-WEB-DATA-009 | AuthorityPillar | label |
| PCL-WEB-DATA-010 | FutureContentTopic | title |
| PCL-WEB-DATA-011 | FAQItem | question, answer |
| PCL-WEB-DATA-012 | Metadata | title, description, canonical, openGraph, twitterCard |
| PCL-WEB-DATA-013 | StructuredData | Organization, WebSite, FAQPage |

### 5.2 Dados de Contato

Caso exista formulario em fase futura, os dados minimos previstos sao:

| Campo | Obrigatorio | Observacao |
|---|---|---|
| Nome | Sim | Identificacao do lead. |
| E-mail | Sim | Canal de retorno. |
| Organizacao | Opcional | Ajuda qualificacao comercial. |
| Tipo de organizacao | Opcional | Startup, empresa, hub, universidade, aceleradora, instituicao publica/fomento ou outro. |
| Mensagem | Sim | Contexto da demanda. |
| Consentimento de contato | Sim, se houver formulario | Necessario para contato ativo. |

### 5.3 Retencao e Persistencia

- Na primeira versao, a aplicacao nao deve persistir dados sensiveis localmente.
- Se houver formulario integrado, a persistencia deve ocorrer apenas no destino aprovado.
- Dados pessoais devem ser minimizados e coletados somente quando houver finalidade clara.

## 6. Criterios de Seguranca

| ID | Criterio | Aceite |
|---|---|---|
| PCL-WEB-SEC-001 | HTTPS obrigatorio em producao. | A publicacao final deve ocorrer apenas em ambiente com HTTPS ativo. |
| PCL-WEB-SEC-002 | Segredos nao podem ficar no front-end. | Nenhuma chave de API, token ou segredo deve ser exposto em codigo cliente ou arquivos publicos. |
| PCL-WEB-SEC-003 | Integracoes devem usar variaveis de ambiente. | Qualquer endpoint, chave ou configuracao sensivel deve ser externa ao codigo versionado. |
| PCL-WEB-SEC-004 | Formularios devem validar entradas. | Se houver formulario, campos devem ser validados no cliente e no servidor ou servico receptor. |
| PCL-WEB-SEC-005 | Protecao contra spam deve ser prevista. | Se houver formulario publico, deve haver estrategia contra abuso, como honeypot, rate limit, captcha leve ou protecao equivalente. |
| PCL-WEB-SEC-006 | Scripts de terceiros devem ser minimizados. | Analytics, embeds e pixels so devem ser adicionados quando aprovados e necessarios. |
| PCL-WEB-SEC-007 | Headers basicos de seguranca devem ser avaliados. | Deve-se prever CSP, X-Frame-Options, Referrer-Policy e Permissions-Policy quando compatibilidade permitir. |
| PCL-WEB-SEC-008 | Repositorios devem permanecer privados. | O padrao PCL exige protecao de IP, codigo e segredos em repositorios privados. |
| PCL-WEB-SEC-009 | Dados pessoais devem seguir minimizacao. | A landing deve coletar apenas dados necessarios para contato qualificado. |
| PCL-WEB-SEC-010 | Nao inventar prova social. | Evita risco reputacional e juridico por clientes, cases, resultados ou metricas nao validados. |

## 7. Criterios de Qualidade

| ID | Criterio | Aceite |
|---|---|---|
| PCL-WEB-QUAL-001 | Clareza de proposta. | Pessoas externas devem entender o que e a PCL no primeiro scroll. |
| PCL-WEB-QUAL-002 | Coerencia narrativa. | Todas as secoes devem reforcar IA aplicada, automacao, arquitetura operacional, governanca e human-in-the-loop. |
| PCL-WEB-QUAL-003 | Consistencia editorial. | A linguagem deve ser objetiva, institucional, premium e sem exagero promocional. |
| PCL-WEB-QUAL-004 | Rastreabilidade TLC. | Requisitos devem manter IDs estaveis para futura ligacao com design, tasks e validacao. |
| PCL-WEB-QUAL-005 | SEO tecnico. | Lighthouse SEO alvo acima de 90 e metadados basicos presentes. |
| PCL-WEB-QUAL-006 | Acessibilidade. | Lighthouse Accessibility alvo acima de 90 e navegacao por teclado funcional. |
| PCL-WEB-QUAL-007 | Performance. | Lighthouse Performance alvo acima de 90 e ausencia de dependencias pesadas desnecessarias. |
| PCL-WEB-QUAL-008 | Responsividade. | Layout e conteudo devem funcionar em larguras mobile e desktop sem sobreposicoes ou cortes de texto. |
| PCL-WEB-QUAL-009 | GEO / AI Visibility. | A pagina deve conter definicoes diretas e citaveis de PCL, Project.OS e abordagem metodologica. |
| PCL-WEB-QUAL-010 | Manutenibilidade. | Alteracoes de conteudo frequentes nao devem exigir refatoracao estrutural. |
| PCL-WEB-QUAL-011 | Build verificavel. | Em etapa futura de execucao, a aplicacao deve passar em typecheck e build de producao. |
| PCL-WEB-QUAL-012 | Sem escopo oculto. | Qualquer expansao para blog, CMS, CRM, auth, banco ou area logada deve voltar para nova etapa SPECIFY. |

## 8. Regras de Validacao Para Proxima Etapa

Antes de avancar para DESIGN, o usuario deve aprovar explicitamente:

- Escopo web como alvo correto.
- Requisitos funcionais.
- Requisitos nao funcionais.
- Arquitetura de software conceitual.
- Arquitetura de dados.
- Criterios de seguranca.
- Criterios de qualidade.
- Decisoes pendentes que devem permanecer abertas.

## 9. Estado Atual

Esta especificacao esta pronta para revisao.

**Nao avancar para DESIGN, TASKS ou EXECUTE sem aprovacao explicita do usuario.**
