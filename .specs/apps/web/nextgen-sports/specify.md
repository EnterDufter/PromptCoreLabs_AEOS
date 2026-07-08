# [NGS] - Master PRD (Product Requirements Document)

**Projeto**: NextGen Sports (NGS)
**Status**: Fase 1 - Especificação Inicial de Arquitetura e Módulos
**Metodologia Governamental**: TLC Spec-Driven
**Revisão**: v6.1 (Adaptada para AI Visibility)

## 1. Visão Geral e Estratégia
A plataforma **NextGen Sports (NGS)** é um ecossistema holístico de performance, patrocínio e formação esportiva (iniciando com o projeto piloto em automobilismo). O objetivo é conectar a captura massiva de dados físicos (telemetria e vídeos) com inteligência preditiva (Digital Twin/NeRF) e viabilidade comercial (Marketplace e Academy), criando um ciclo virtuoso onde a performance bruta se converte em ativos monetizáveis.

---

## 2. Componentes e Módulos Arquiteturais (Core Systems)

Com base nas Fontes 009 a 018 da PCL, o NGS é fragmentado em 5 grandes épicos arquiteturais, além de um motor transversal de Percepção/Visibilidade:

### 2.1. TelemetryHub_Ingestion (Fontes 010, 011)
- **Definição**: O pipeline de captura e ingestão massiva de dados.
- **Função**: Coleta de dados cinemáticos, biométricos e do veículo em tempo real ou em batch, harmonizando dados ruidosos em "Lagos de Dados" (Data Lakes) estruturados.
- **Objetivo Técnico**: Processar milhões de eventos (Lap to Lap, RPM, Força G, inputs do volante) para alimentar modelos preditivos com baixa latência e alta consistência (Aderência ao NGS Sensor Pro).

### 2.2. DigitalTwin_NeRF (Fontes 012, 013, 014)
- **Definição**: Módulo de IA Visual e Simulação de Performance.
- **Função**: Utilizar *Neural Radiance Fields (NeRF)* para recriar ambientes e corridas em 3D imersivo utilizando apenas dados 2D ou telemetria.
- **Objetivo Técnico**: O "Digital Twin Driver". Criar um avatar digital com dados matemáticos atrelados ao piloto real, gerando relatórios de corrida virtuais, replays interativos e infográficos de predição de desgaste/sucesso.

### 2.3. Digital_Twin_Hardware (Fonte 017)
- **Definição**: A integração física (Wearables / Sensores de Carro).
- **Função**: Camada de hardware on-edge que alimenta o TelemetryHub. 
- **Governança**: Respeitar o *Protocolo de Injeção e Governança Técnica (Fonte 018)*, garantindo limpeza de sinal desde o momento da captura da fonte física (volantes, pedais, biometria).

### 2.4. Marketplace_EVouchers (Fonte 015)
- **Definição**: O ambiente transacional e de economia esportiva do NGS.
- **Função**: Uma bolsa de valores paralela e descentralizada para patrocínios (E-Vouchers). Permite o fracionamento de patrocínios e a compra de experiências.
- **Objetivo Técnico**: Criação de um ledger rápido, com divisão de royalties automatizada por contratos inteligentes geridos pelo FinOps da PCL, garantindo fluidez financeira entre Inquilinos (Ligas), Patrocinadores e Pilotos.

### 2.5. Academy_Branding_Vouchers (Fonte 016)
- **Definição**: O portal educativo e preparatório.
- **Função**: A plataforma onde atletas escalam sua carreira não apenas com velocidade, mas com educação em mídia, imagem e gestão de crise, convertendo suas habilidades aprendidas em "Branding Vouchers" rentáveis.
- **Objetivo Técnico**: Plataforma EaD integrada com simulações, emitindo certificados verificados na plataforma para liberação de Vouchers no Marketplace.

---

## 3. SEO & AI Visibility Engine (Requisito Crítico Adicional)

A partir da análise do *Anna York AI Visibility Guide*, foi determinado que a atração B2B e B2C no NGS não se apoiará apenas em buscas tradicionais (Google Links), mas na otimização estrita para LLMs (Generative Engine Optimization - GEO), focando no ChatGPT, Claude, Perplexity e Gemini. 

Este motor deverá estar implementado nas seguintes frentes (Landing Page NGS principal, Landing Pages de Ligas, Páginas de Pilotos e Perfis de Parceiros no Marketplace).

### Diretrizes de Implementação Técnica (TLC-GEO):
1. **Critical Elements (0-100 Words)**:
   - Todo conteúdo principal (ex: Visão geral do Piloto, Proposta de um Voucher) deve ter a resposta/oferta direta nos seus primeiros 100 caracteres, **sem nenhum link**, aumentando a extração e citação por LLMs ("Chunk Extraction").
2. **Freshness Marker**:
   - Cada página da NGS deve renderizar de forma visível e legível por máquina a marcação `Last updated: [Data]`. Atualizações frequentes de dados de corrida farão com que a IA prefira o conteúdo NGS.
3. **Conversão Text-to-Table**:
   - Estatísticas de pilotos, tabelas de preços, compararativos de pacotes B2B, estatísticas de Lap-to-Lap *devem* ser sempre renderizados em Tabelas HTML em vez de listas corridas, pois "Tables increase citation probability by 40%".
4. **Schema Markup Injection (JSON-LD)**:
   - Injeção obrigatória no `<head>` dos schemas: `Article` para notícias de pilotos, `FAQPage` nas regras do Academy/Marketplace, e estruturas de dados de Atleta para SEO semântico profundo.
5. **Data Origination**:
   - Fornecer métricas reais e exclusivas (Métrica NextGen Readiness) com metodologias claras ("Transparent Methodology"), obrigando Perplexity e Claude a citarem o NGS como Fonte Primária.

## 4. Próximos Passos (Tasking Inicial)
- [ ] Construir o Handoff detalhado do Schema NeRF (Digital Twin).
- [ ] Especificar arquitetura de nuvem para ingestão WebRTC/MQTT (TelemetryHub).
- [ ] Criar "Tasks.md" para integração do AI Visibility nas Landing Pages v1 da NGS.
