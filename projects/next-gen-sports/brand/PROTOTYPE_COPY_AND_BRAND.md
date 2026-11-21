# Guia Prático de Brand & Copy — Protótipo Navegável NGS (Onda 1)

**Projeto:** Next Gen Sports (NGS) — Protótipo Navegável (Onda 1: Hub Central + 5 Telas)  
**Responsável:** Pulse Brand (`UX/CX, Brand DNA, SEO/GEO & Conteúdo`)  
**Destino de Uso:** Consumo direto pelo `Builder UI` no código do protótipo  
**Data:** 2026-11-21  

---

## 1. Brand DNA, Tokens Visuais & Regras Zero AI Slop

### 1.1 Paleta Canônica SportTech
| Token | Hex | Uso Obrigatório |
|---|---|---|
| `deep-navy` | `#031B33` | Sidebar, cabeçalhos de destaque escuro, selos institucionais |
| `royal-blue` | `#0D47A1` | Ações primárias (CTAs), links ativos, abas selecionadas |
| `telemetry-cyan` | `#17B3B3` | Dados de telemetria, badges de evolução, acentos de gráfico e corte do `S` |
| `canvas-light` | `#FAFAFB` | Fundo principal da aplicação (clareza editorial e leitura de métricas) |
| `surface-white` | `#FFFFFF` | Cards do feed, painéis e modais |
| `border-subtle` | `#D9E3EA` | Divisórias finas e contorno de cards |
| `graphite-text` | `#263238` | Texto principal |
| `success-emerald` | `#0E9F6E` | PBs, aprovações, status `Pronto para Patrocínio` (`Score > 70`) |
| `warning-amber` | `#F59E0B` | Atenção, pendências de evidência ou autorização |
| `danger-coral` | `#EF4444` | Alertas críticos ou bloqueios |

### 1.2 Tipografia & Escalas
- **Display, Títulos & Números de Score:** `Sora` (`600` SemiBold / `700` Bold)
- **Corpo, Feed, Labels & Tabelas:** `Inter` (`400` Regular / `500` Medium / `600` SemiBold)
- **Escalas Numéricas Oficiais (Sem Conflito):**
  - **Readiness Score:** `0–100` (ex.: `84/100` — *Muito Bom*)
  - **Academy LMS:** `0–1000 XP` (ex.: `780/1000 XP` — *Nível 7*)

### 1.3 Vocabulário Canônico & Tom de Voz
- **Tom:** Técnico-esportivo, direto, encorajador com base em fatos e evidências. **Proibido** jargão genérico de IA (*"revolucionário", "potencialize sua jornada", "IA mágica"*).
- **Substituições Obrigatórias:**
  - *Freelancer* → **Especialista de Performance**
  - *Serviço / Produto* → **Setup de Performance / Kit de Performance**
  - *Loja* → **Vitrine de Parceiro**
  - *Cupom* → **Voucher de Desenvolvimento**
  - *Documento / Comprovante* → **Artefato / Evidência**
  - *`Driver`* → Usar **apenas** dentro do módulo de automobilismo (ex.: `Digital Twin Driver`). No restante da plataforma, usar **Atleta** (ou **Piloto/Atleta** quando contextualizado em kart).

### 1.4 Lista Negra Absoluta (Proibido no Código e Dados Mockados)
- **PROIBIDO:** Nenhuma menção a parceiros externos excluídos de escopo, nomes reais da equipe/personas antigas, incentivos fiscais ou hubs financeiros/tokenização.

---

## 2. Personas Fictícias Limpas (Base de Dados Mockados)

| Papel | Nome Fictício Limpo | Dados de Contexto |
|---|---|---|
| **Atleta Principal (Kart)** | **Gabriel Almeida** | 16 anos • Kart • Graduados • São Paulo - SP • Readiness `84/100` • Academy `780/1000 XP` • `1.240` seguidores • `380` conexões |
| **Responsável Legal** | **Renata Almeida** | Mãe e responsável legal de Gabriel Almeida • Consentimento LGPD ativo para exibição pública e contato de patrocínio |
| **Atleta Secundário (Multiesporte)** | **Marina Costa** | 17 anos • Basquete • Sub-18 • Campinas - SP • Readiness `88/100` • Academy `820/1000 XP` |
| **Atleta Secundário (Kart)** | **Felipe Rossi** | 18 anos • Kart • Graduados • São Caetano do Sul - SP • Readiness `79/100` • Academy `640/1000 XP` |
| **Liga Esportiva** | **Liga Paulista de Kart** | Selo `Oficial` • Operador: **Carlos Menezes** • White-Label ativo • Etapa atual: Etapa 4 — Interlagos |
| **Especialista (Físico)** | **Mariana Silva** | Preparadora Física • Especialidade: Resistência e Pescoço/Core para Kart • São Paulo - SP |
| **Especialista (Pista/Telemetria)** | **Rafael Martins** | Chefe de Equipe & Coach de Telemetria • Análise de Traçado e Frenagem |
| **Patrocinador / Marca** | **PowerUp Brasil** | Analista: **Juliana Prado** • Categoria: Hidratação & Performance • Filtro ativo: `Readiness Score > 70` |

---

## 3. Seletor Rápido de Ator (Actor Switcher)

Componente no topo ou cabeçalho da sidebar para alternar a visão do protótipo em 1 clique:

| Ator | Rótulo do Botão | Subtítulo / Contexto Exibido | Comportamento de UX / Microcopy |
|---|---|---|---|
| **Atleta** | `Atleta` | `Gabriel Almeida • Kart Graduados` | Habilita composer de publicação, painel Readiness/Academy e envio de evidências. |
| **Liga** | `Liga` | `Liga Paulista de Kart • Operador` | Destaca Gestão de Ligas, publicação de comunicados `[Oficial]` e distribuição White Label. |
| **Patrocinador** | `Patrocinador` | `PowerUp Brasil • Scouting & Cotas` | Destaca Talent Network, filtro `Score > 70` no Sponsorship e envio de propostas. |
| **Responsável Legal** | `Responsável Legal` | `Renata Almeida • Tutora LGPD` | Exibe banner de governança: *"Você gerencia autorizações de imagem, visibilidade pública e propostas comerciais para Gabriel Almeida (16 anos)."* |

---

## 4. Hub Central — Rede Social Especializada (Layout 3 Colunas)

### 4.1 Topbar
- **Logo:** `NGS | NEXT GEN SPORTS`
- **Placeholder da Busca:** `Buscar atletas, ligas, especialistas ou marcas...`
- **Menu Principal:** `Hub Central` | `Ligas` | `Portal do Atleta` | `Talent Network` | `Sponsorship` | `Commerce Hub`
- **Badge Discreto:** `PCL Inside`

### 4.2 Coluna Esquerda (Cartão de Identidade do Ator Ativo)
- **Nome:** `Gabriel Almeida` *(com selo verificado azul)*
- **Subtítulo:** `Kart • Graduados` / `São Paulo - SP`
- **Bloco de Score:**
  - `Readiness Score`: **`84`** (`/100` • `Muito Bom`)
  - `Academy LMS`: **`780 / 1000 XP`** (`Nível 7`)
- **Métricas Sociais:** `1.240 Seguidores` • `380 Conexões`
- **Atalhos Rápidos:** `Meu Perfil Público` • `Digital Twin Driver` • `Mídia-Kit` • `Minhas Ligas`
- **Rodapé:** `Powered by PromptCore Labs`

### 4.3 Coluna Central (Composer, Filtros & Feed)
- **Composer (`Criar publicação`):**
  - Placeholder: `Compartilhe um treino, telemetria, conquista ou bastidor...`
  - Chips de anexo: `Foto/Vídeo` | `Telemetria` | `Conquista` | `Evidência`
  - CTA primário: `Publicar`
- **Abas de Filtro:** `Tudo` | `Seguindo` | `Provas & PBs` | `Oportunidades`
- **Posts Iniciais Realistas (Zero AI Slop):**
  1. **Post PB / Telemetria (`Gabriel Almeida` • `há 2h • Interlagos`):**
     - Texto: *"Novo recorde pessoal no Setor 2 hoje nos treinos da Copa SP! Ajuste no ponto de frenagem da curva 4 reduziu a perda de saída."*
     - Card de Telemetria: `Setor 2: -0.38s` | `Consistência: 94%` | `Digital Twin Driver: Validado`
     - Ações: `48 Endossos` • `12 Comentários` • `Compartilhar` *(ação secundária: `Agendar nas redes externas`)*
     - Comentário em destaque (`Rafael Martins • Coach de Telemetria`): *"Excelente evolução na entrada de curva e retomada limpa no S2."*
  2. **Post Oficial de Liga (`Liga Paulista de Kart [Oficial]` • `há 5h`):**
     - Texto: *"Inscrições abertas para a Etapa 4 em Interlagos — vagas limitadas para a categoria Graduados!"*
     - Card CTA: `ETAPA 4 — INTERLAGOS` • `Sáb, 28 Mai • 08h00` • Botão: `Inscrever-se na Etapa`
     - Rodapé: `18 interações` • `4 comentários`
  3. **Post Conquista Academy (`Marina Costa • Basquete Sub-18` • `há 1 dia • Campinas`):**
     - Texto: *"Concluí a trilha 'Rotina Pré-Jogo e Controle Emocional' na NGS Academy com evidência validada. +60 XP no meu histórico."*
     - Badge desbloqueado: `Mente Afinada • Pilar Mental` (`Academy 820/1000 XP`)
     - Ações: `34 Endossos` • `7 Comentários` • `Compartilhar`
  4. **Post Oportunidade (`PowerUp Brasil [Patrocinador]` • `há 1 dia`):**
     - Texto: *"Buscamos 3 atletas entre 15 e 20 anos em SP com Readiness Score acima de 70 para cota de apoio na temporada de inverno."*
     - Card CTA: `Cota Apoio Regional • Readiness > 70` • Botão: `Ver Requisitos`

### 4.4 Coluna Direita (Descoberta & Agenda)
- **Bloco 1 — `Sugestões para conectar`:**
  - `Mariana Silva` — `Especialista • Preparadora Física` (`+ Conectar`)
  - `Felipe Rossi` — `Atleta • Kart Graduados` (`+ Conectar`)
  - `PowerUp Brasil` — `Patrocinador • Hidratação` (`+ Conectar`)
- **Bloco 2 — `Em alta na NGS` (Hashtags Limpas):**
  - `#CopaSPKart`
  - `#Readiness80Plus`
  - `#DigitalTwin`
  - `#ProofOfTalent`
  - `#KartGraduados`
- **Bloco 3 — `Próximos Eventos`:**
  - `MAI 22` — `Treino Técnico • Interlagos`
  - `MAI 24` — `Avaliação Física • NGS Lab`
  - `MAI 28` — `Etapa 4 • Liga Paulista de Kart`

---

## 5. Microcopy & Estrutura das 5 Telas da Onda 1

### Tela 1 — Gestão de Ligas (`/ligas`)
- **Título (`<h1>`):** `Gestão de Ligas`
- **Subtítulo:** `Operação esportiva, homologação de resultados e distribuição White Label.`
- **KPIs (máx. 3–4 cards):** `Ligas Ativas: 12` | `Etapas no Mês: 18` | `Atletas Homologados: 1.420` | `Taxa de Check-in: 94%`
- **Abas:** `Visão Geral` | `Eventos & Etapas` | `Inscritos & Check-in` | `Grid & Resultados` | `Distribuição Social`
- **Microcopy da Tabela/Etapa:**
  - `Etapa 4 — Interlagos (Graduados)` • Status: `Inscrições Abertas` • Vagas: `34/40` • CTA: `Gerenciar Etapa`
  - Bloco de Distribuição White Label: *"Publique resultados homologados e cards de pódio automaticamente nos canais da liga."* • CTA: `Preparar Post da Etapa`

### Tela 2 — Portal do Piloto / Atleta (`/atleta`)
- **Título (`<h1>`):** `Portal do Atleta` *(exibe subtítulo `Modo Piloto • Kart Graduados` quando o ator for Gabriel Almeida)*
- **Subtítulo:** `Prontidão esportiva, evolução na Academy e evidências auditáveis.`
- **Bloco 1 — `Readiness Score (0–100)`:**
  - Nota atual: **`84 / 100`** (`+5 pts nos últimos 30 dias` • Status: `Pronto para Patrocínio`)
  - 5 Pilares: `Técnico: 85` | `Físico: 90` | `Mental: 88` | `Consistência: 86` | `Equipamento: 72`
  - Microcopy explicável: *"Score calculado por evidências validadas de pista, avaliações físicas e regularidade."*
- **Bloco 2 — `NGS Academy LMS (0–1000)`:**
  - Progresso: **`780 / 1000 XP`** (`Nível 7 • Faltam 220 XP para o Nível 8`)
  - Trilha ativa: `Setup e Segurança de Equipamento` (`2/3 módulos concluídos`) • CTA: `Enviar Evidência Prática`
  - Badges conquistados: `Maestro da Pilotagem` | `Pulso de Aço` | `Mente Afinada`
- **Bloco 3 — `Módulo Automobilismo: Digital Twin Driver`:**
  - Circuito: `Interlagos • 4,309 km` | Melhor Volta: `0:52.18` | Delta S2: `-0.38s`
  - Insight objetivo: *"Frenagem antecipada na Curva 4 estabilizou a saída do Setor 2."*

### Tela 3 — Commerce Hub (`/commerce`)
- **Título (`<h1>`):** `Commerce Hub`
- **Subtítulo:** `Especialistas, setups e kits recomendados a partir dos seus gaps de prontidão.`
- **Banner Contextual (Gap-Driven):** *"Seu pilar **Equipamento (72/100)** está abaixo da sua média. Veja setups e especialistas para equilibrar seu Readiness Score."*
- **Abas:** `Recomendados por Gap` | `Especialistas de Performance` | `Setups de Performance` | `Kits de Performance`
- **Cards de Exemplo:**
  - `Rafael Martins • Especialista de Performance` — `Setup de Telemetria & Análise de Volta (1h)` • `R$ 280` • CTA: `Solicitar Neural Briefing`
  - `Mariana Silva • Especialista de Performance` — `Avaliação Física Específica para Pilotos` • `R$ 220` • CTA: `Agendar Avaliação`
  - `Kit de Performance • Telemetria Base + Suporte` — `Voucher de Desenvolvimento aplicável` • `R$ 490` • CTA: `Simular Pacote`
- **Aviso Fiscal Conceitual (Obrigatório no Resumo):**
  > *"Este pacote reúne produtos e serviços. Documentos fiscais são emitidos separadamente conforme a natureza de cada item (protótipo conceitual)."*

### Tela 4 — Sponsorship (`/sponsorship`)
- **Título (`<h1>`):** `Sponsorship`
- **Subtítulo:** `Conexão direta entre marcas e atletas com prontidão comprovada por dados.`
- **Trava / Filtro Padrão Obrigatório:** Badge ativo: `Filtro de Elegibilidade: Readiness Score > 70` *(exibe apenas atletas e ligas com Score acima de 70 e evidências validadas)*.
- **Abas:** `Oportunidades Abertas` | `Pipeline de Patrocinadores` | `Mídia-Kit Dinâmico` | `Contrapartidas`
- **Cards do Pipeline / Oportunidades:**
  - `PowerUp Brasil` — `Cota Apoio Regional (Sudeste)` • Requisito: `Readiness > 70 + 2 posts/mês de ativação` • Estágio: `Em Avaliação` • CTA: `Enviar Mídia-Kit Auditável`
  - `NextWear Sport` — `Fornecimento de Uniforme & Kit` • Requisito: `Readiness > 75 + Presença em Liga Oficial` • Estágio: `Qualificada` • CTA: `Ver Contrapartidas`
- **Bloco de Contrapartidas:** *"Acompanhe entregas de mídia e aprovações de marca antes da publicação nas redes externas."*
- *(Nota: Escopo limpo — focado exclusivamente em cotas diretas, mídia-kit e contrapartidas de marca.)*

### Tela 5 — Talent Network (`/talentos`)
- **Título (`<h1>`):** `Talent Network`
- **Subtítulo:** `Descoberta, comparação e scouting de talentos com histórico verificável.`
- **Barra de Filtros:** `Modalidade (Todas, Kart, Basquete, Futebol, Natação)` | `Readiness Mínimo (70+, 80+, 90+)` | `Região` | `Busca por nome`
- **Cards de Atletas (Lista Principal):**
  - `Marina Costa` • `Basquete • Sub-18 • Campinas, SP` • `Readiness: 88/100` • `Academy: 820/1000 XP` • Tag: `Pronta para Scouting` • Botões: `Ver Perfil` | `Comparar` | `+ Scouting Board`
  - `Gabriel Almeida` • `Kart • Graduados • São Paulo, SP` • `Readiness: 84/100` • `Academy: 780/1000 XP` • Tag: `Alta Consistência` • Botões: `Ver Perfil` | `Comparar` | `+ Scouting Board`
  - `Felipe Rossi` • `Kart • Graduados • São Caetano do Sul, SP` • `Readiness: 79/100` • `Academy: 640/1000 XP` • Tag: `Em Evolução` • Botões: `Ver Perfil` | `Comparar` | `+ Scouting Board`
- **Painel Lateral (`Scouting Board`):**
  - Lista curta de atletas salvos pelo patrocinador/olheiro + mini comparativo dos 5 pilares (`Técnico, Físico, Mental, Consistência, Equipamento`) + CTA `Convidar para Proposta`.