# Parecer de Blindagem Regulatória, LGPD & Propriedade Intelectual — Next Gen Sports (NGS)

**Data:** 2026-11-20  
**Responsável:** Lex Compliance (Compliance, Jurídico, GovTech, AI Academy & PeopleOps — PCL)  
**Fase:** Fase 2 — Análise Especializada (Zero Código Novo)  
**Fontes Auditadas:**
- `discovery/01-parque-santo-andre/RELATORIO_PARQUE_TECNOLOGICO.md`
- `discovery/04-assets-mockups/RELATORIO_MOCKUPS_INTENCAO.md`
- `discovery/05-legado-audit/RELATORIO_LEGADO_E_PLATAFORMA_ANTIGA.md`

---

## 1. Resumo Executivo & Matriz de Riscos Bloqueadores

O pré-projeto **Next Gen Sports (NGS)** apresenta proposta de valor consistente como rede social especializada de performance e prova de talento (`Proof of Talent` + `Readiness Score`), mas encontra-se em **estágio pré-MVP com débitos críticos de blindagem jurídica (`IPRL`: 1 Sim / 7 Não)** que podem inviabilizar pilotos reais, parcerias institucionais no Parque Tecnológico de Santo André ou exposição pública da marca caso não sejam endereçados antes da execução.

| Frente Analisada | Nível de Risco Atual | Impacto no MVP (60 dias) | Decisão / Ação Imediata |
|---|---|---|---|
| **1. LGPD para Menores (Kart/Jovens)** | **Alto (Bloqueador para piloto real)** | Não trava protótipo com dados simulados, mas **bloqueia qualquer piloto com atletas reais < 18 anos**. | Implementar consentimento parental verificável, *Privacy by Default* e vetar dados biométricos/saúde no MVP. |
| **2. Propriedade Intelectual & Marcas** | **Alto (Bloqueador de escala/exposição)** | Risco de colidência para `NGS` (sem busca no INPI) e perda de novidade (*prior art*) por falta de NDAs. | Busca imediata no INPI (`Next Gen Sports` / `NGS`), abandono definitivo de `Supera`, NDAs + Cessão de PI antes do Parque. |
| **3. White Label (FeedHive)** | **Médio-Alto** | Risco de *lock-in*, descasamento de SLA e transferência internacional irregular de dados de menores. | Usar apenas como **motor de distribuição externa desacoplado**, sem trafegar dados sensíveis ou de menores no ambiente terceiro. |
| **4. Lei de Incentivo ao Esporte (LIE)** | **Médio-Alto** | Startup com fins lucrativos não pode ser proponente; risco de glosa/responsabilidade se IA atestar documentos. | **Manter `Impact / Incentive OS` fora do MVP**; restringir Fase 1 a repositório de evidências para proponentes sem fins lucrativos. |
| **5. CVM / AML (`Capital Hub / Token Hub`)** | **Crítico (Bloqueador Regulatório)** | Oferta pública de tokens/direitos de atletas configura valor mobiliário (CIC) sem registro + exige PLD/KYC + conflito com menores. | **Isolar e remover integralmente do MVP e do pitch de curto prazo**; postergar para fase futura via parceiro regulado (RCVM 88). |

---

## 2. Análise Detalhada por Frente Regulatória

### 2.1 LGPD para Menores de Idade (Atletas Jovens / Kart)

**Contexto identificado:** O piloto inicial em automobilismo/kart envolve diretamente crianças (< 12 anos) e adolescentes (12 a 18 anos). A arquitetura prevê `Portal do Atleta`, `Evidence Layer` (vídeos, súmulas, fotos), `Telemetry Hub`, `Wearables` (futuro), `Readiness Score` (0–1000) e exposição na `Talent Network` e `Mídia-Kit Dinâmico`.

**Requisitos obrigatórios de conformidade (LGPD Art. 14, ECA e Enunciado CD/ANPD nº 1/2023):**
1. **Melhor Interesse como Critério Soberano:** Todo tratamento de dados de crianças e adolescentes deve observar o melhor interesse do menor (Art. 14, *caput*), sendo ilícita qualquer exploração comercial predatória ou gamificação que induza exposição excessiva para obtenção de patrocínio.
2. **Consentimento Parental Verificável (Art. 14, § 1º e § 5º):**
   - **Crianças (< 12 anos):** Exige consentimento **específico e em destaque** de pelo menos um dos pais ou responsável legal, com **esforço razoável de verificação** da identidade do responsável (ex.: vínculo de conta do responsável + validação de CPF/e-mail/assinatura eletrônica simples). Um simples *checkbox* autodeclarado ("sou maior / tenho autorização") **não atende à lei**.
   - **Adolescentes (12 a 18 anos):** Embora o Art. 14 permita bases legais além do consentimento quando alinhadas ao melhor interesse, para **exposição pública de perfil (`Talent Network`), uso de imagem e intermediação comercial/patrocínio**, é obrigatória a **assistência/autorização expressa do responsável legal**.
3. **Minimização de Dados Biométricos, Saúde e Telemetria (Art. 5º, II e Art. 11):**
   - Dados de *wearables* (frequência cardíaca, recuperação, sono, biometria) e avaliação física (`Motor do Corpo`) são **dados pessoais sensíveis**. **Recomendação:** Proibir a coleta de dados biométricos/saúde no MVP da rede social; manter apenas **telemetria de pista não-sensível** (tempos de volta, traçado, setor) e evidências esportivas estritamente necessárias.
   - Aplicar **Privacy by Default**: perfis de atletas menores devem nascer **privados/restritos** por padrão, exigindo opt-in granular do responsável para visibilidade a *scouts* ou marcas.
4. **Explicabilidade Algorítmica (`Readiness Score` — Art. 20):**
   - A diretriz dos relatórios de que *"todo score deve ser explicável e baseado em evidências"* é requisito legal. O algoritmo não pode operar como caixa-preta que rotule ou exclua jovens atletas sem transparência de critérios e direito à revisão humana.
5. **Guarda Segura, Retenção e Moderação:**
   - Implementar controle de acesso baseado em papéis (RBAC) com **segregação estrita por tenant** (ligas/academias não podem cruzar dados de menores de outros tenants sem autorização), trilha de auditoria de acessos de terceiros (*scouts*/marcas), moderação prévia de mídia e rotina de expurgo/anonimização imediata em caso de revogação do consentimento parental.

---

### 2.2 Propriedade Intelectual & Marcas (INPI + Patente de Modelo de Utilidade)

**Situação Marcária Atual (baseada na Fase 1):**
- **Supera:** **Reprovada / Risco Muito Alto (Abandonar definitivamente).** Congestionamento registral (RPIs 2097, 2101) e comercial severo no Brasil (*Método Supera*, *Supera Sports*, *Supera para Atletas*, *Supera Sport* em MT/SP) e mercado hispânico (*Centros Supera*), com domínios principais ocupados.
- **Saga:** **Risco Médio-Alto (Uso não recomendado como marca principal).** Colidências relevantes (`saga.com.br` da Escola SAGA, *SAGA Ativa*, *sagasport.com.br*, *Copa Saga*). Viável apenas em cenário condicional com assinatura/submarca após busca formal no INPI.
- **Next Gen Sports (NGS):** **Marca vigente, porém pendente de validação registral (`IPRL-2` em aberto).** Toda a linha V1.7 e `SOURCE_OF_TRUTH.md` adota `Next Gen Sports | Powered by PromptCore Labs`, mas **não foi realizada busca de anterioridade no INPI**. Por combinar termos comuns em inglês ("Next Gen" + "Sports"), há risco real de anterioridades ou exigência de distintividade nas classes de interesse:
  - **Classe 35:** Gestão de negócios, marketplace, intermediação de patrocínios;
  - **Classe 41:** Educação, treinamento esportivo (`NGS Academy`), organização de ligas/competições;
  - **Classe 42:** SaaS, plataforma tecnológica, inteligência artificial.
- **Contingência:** Manter em reserva os nomes indicados para eventual substituição (*Brio*, *Fibra* ou expressão distintiva) caso a busca no INPI bloqueie `Next Gen Sports` / `NGS`.
- **Fronteira de Identidade:** Manter separação absoluta entre `Next Gen Sports (NGS)` e `Project.OS`, e usar `PromptCore Labs (PCL)` exclusivamente como *engine* habilitadora (`Powered by PromptCore Labs`).

**Patente de Modelo de Utilidade (MU) & Risco de *Prior Art* (Lei nº 9.279/96 — LPI):**
1. **Risco Iminente de *Prior Art* (Perda de Novidade):**
   - Conforme a LPI (Art. 11), qualquer divulgação pública da solução técnica (apresentações abertas no Parque Tecnológico, landing pages com detalhes arquiteturais, vídeos de mockups explicando fluxos inventivos, repositórios públicos) **antes do depósito no INPI** integra o **estado da técnica (*prior art*)** e pode inviabilizar a patenteabilidade. Embora o Brasil preveja período de graça de 12 meses (Art. 12), diversos países (como a Europa) não o adotam.
2. **O que é efetivamente protegível:**
   - **Software puro e métodos de negócio em si não são patenteáveis no Brasil** (LPI Art. 10, I e V). Uma eventual **Patente de Modelo de Utilidade ou Invenção** só se sustenta se houver **solução técnica com efeito técnico concreto** (ex.: arquitetura específica de acoplamento físico/hardware de telemetria em kart + processamento *edge* com ganho funcional mensurável).
   - O **código-fonte** da plataforma é protegido por **Direito Autoral / Registro de Programa de Computador no INPI** (Lei nº 9.609/98).
   - Metodologias de `Readiness Score`, *prompts* e regras de negócio são protegidos por **Segredo Industrial**, contratos de confidencialidade e propriedade intelectual.
3. **Ações Obrigatórias Antes de Avançar:**
   - Executar **busca formal de anterioridade e viabilidade no INPI** para `Next Gen Sports` / `NGS` (classes 35, 41, 42) e protocolo prioritário;
   - Formalizar **NDAs (Acordos de Confidencialidade)** e **Termos de Cessão de PI** com todos os colaboradores, parceiros técnicos e interlocutores externos (sanando o status `IPRL`: 1 Sim / 7 Não) antes de compartilhar diagramas detalhados no Parque Tecnológico.

---

### 2.3 Contrato White Label (FeedHive)

**Contexto identificado:** O `RELATORIO_MOCKUPS_INTENCAO.md` demonstra que o **FeedHive Agency / White Label** (~US$ 299/mês ou ~US$ 239/mês anual; limite de até 500 contas sociais e 100 workspaces) **não é uma rede social proprietária**, funcionando apenas como ferramenta de agendamento, reciclagem e aprovação de posts para redes sociais externas (Instagram, LinkedIn, YouTube, X).

**Riscos contratuais, operacionais e de LGPD:**
1. **Risco de *Lock-in* e Limite de Escala:**
   - O teto do plano (100 workspaces / 500 contas sociais) é incompatível com crescimento B2B2C de múltiplas ligas e centenas de atletas. Além disso, alterações unilaterais de preço, termos de API ou descontinuação do produto White Label pelo fornecedor expõem a NGS a ruptura operacional perante clientes pagantes.
   - **Mitigação:** Construir camada de abstração própria na NGS (desacoplamento arquitetural) e nunca armazenar dados mestres do atleta ou histórico do `Evidence Layer` exclusivamente dentro do fornecedor.
2. **Propriedade dos Dados e Uso para IA de Terceiros:**
   - Termos padrão de plataformas SaaS frequentemente concedem licença ampla ao fornecedor sobre conteúdos publicados e metadados para melhoria de seus próprios modelos de IA.
   - **Mitigação:** Exigir garantia contratual de **propriedade integral dos dados pela NGS/usuários**, portabilidade em formato aberto e *opt-out* / proibição de treinamento de IA terceira com dados da base NGS.
3. **Descasamento de SLA (*SLA Mismatch*):**
   - Ligas e patrocinadores cobrarão da NGS disponibilidade e pontualidade na ativação de campanhas em dias de prova. Planos *self-service* White Label raramente oferecem SLA financeiro ou suporte dedicado compatível com contratos B2B corporativos. A NGS deve limitar sua responsabilidade contratual perante ligas ao desempenho de APIs de terceiros (*force majeure* / indisponibilidade de redes externas).
4. **Conformidade como Suboperador LGPD & Transferência Internacional:**
   - O FeedHive atuará como **operador/suboperador internacional** (transferência internacional de dados — LGPD Art. 33 e **Resolução CD/ANPD nº 19/2024**).
   - **Regra de ouro:** Exigir **DPA (Data Processing Addendum)** com cláusulas-padrão compatíveis com a ANPD, informar o suboperador na Política de Privacidade e **proibir expressamente o tráfego de dados pessoais de menores ou dados sensíveis de saúde/biometria pelo FeedHive** — trafegar apenas peças de mídia finalizadas e previamente aprovadas pelos responsáveis/atletas.

---

### 2.4 LIE — Lei de Incentivo ao Esporte (Lei nº 11.438/2006 e Decreto nº 6.180/2007)

**Contexto identificado:** O módulo `Sponsor Ops / Impact & Incentive OS` prevê *fast-track* documental com IA + *human-in-the-loop* para projetos incentivados. Já a auditoria de legado recomenda não acoplar esse motor completo no MVP da rede social.

**Requisitos de Governança Documental e Prestação de Contas:**
1. **Legitimidade do Proponente (Barreira Societária):**
   - Pela Lei nº 11.438/2006, **apenas pessoas jurídicas de direito privado sem fins lucrativos** (associações, institutos, federações, clubes sociais) com **no mínimo 1 ano de funcionamento** e finalidade esportiva no estatuto podem apresentar projetos ao Ministério do Esporte (MESP).
   - Uma startup/sociedade empresária com fins lucrativos (como a NGS) **não pode ser proponente nem captar recursos da LIE diretamente**. Sua atuação legítima limita-se ao papel de **fornecedora de tecnologia/serviços** contratada pelo proponente, dentro de rubricas previamente aprovadas e com preços compatíveis com o mercado.
2. **Trilha de Auditoria e Prestação de Contas (SLIE / Transferegov):**
   - Qualquer módulo voltado à LIE exige governança documental rigorosa: (i) aprovação prévia do projeto e plano de trabalho no MESP, (ii) **conta bancária específica e vinculada** para captação e movimentação, (iii) emissão de **recibos de mecenato/patrocínio** no padrão oficial, (iv) comprovação de execução física e financeira (notas fiscais, extratos, certidões negativas — CND Federal, FGTS, CNDT — listas de presença e evidências fotográficas/audiovisuais), e (v) **controle estrito de conflito de interesses / partes relacionadas** na contratação de fornecedores.
3. **Risco da Automação ("Fast-Track com IA"):**
   - A IA não pode emitir declarações, atestar execução ou protocolar documentos sem revisão técnica/jurídica humana. Erros documentais ou divergências na prestação de contas acarretam **reprovação de contas, devolução integral dos recursos corrigidos, multas e inabilitação dos proponentes por 2 a 5 anos**, além de eventual responsabilização por improbidade/fraude.
4. **Recomendação de Escopo:** Manter o `Impact / Incentive OS` **fora do MVP**. Na Fase 1, o `Evidence Layer` deve apenas estruturar **evidências esportivas auditáveis** (datas, treinos, resultados, presença) que possam ser exportadas como insumo para entidades proponentes parceiras.

---

### 2.5 CVM / AML — Parecer de Risco para `Capital Hub` e `Token Hub`

**Contexto identificado:** Os mockups (`02 - NGS Academy` e `06 - Mockup NGS`) preveem `Token Hub` e `Capital Hub`, nos quais o `Readiness Score` verificado e `Data Room/KYC` habilitariam rodadas de captação e marketplace de ativos esportivos.

**Análise de Risco Regulatório (CVM, Banco Central e PLD/FT):**
1. **Caracterização como Valor Mobiliário (Lei nº 6.385/76, Art. 2º, IX & Parecer de Orientação CVM nº 40/2022):**
   - A emissão ou intermediação de tokens ou contratos que confiram ao investidor expectativa de retorno financeiro atrelada à carreira do atleta, prêmios futuros, *revenue share* de patrocínios ou direitos econômicos esportivos caracteriza **Contrato de Investimento Coletivo (CIC)** — logo, **valor mobiliário sob jurisdição da CVM**.
   - Realizar oferta pública sem registro na CVM ou fora das hipóteses de dispensa (como o **Crowdfunding de Investimento regulado pela Resolução CVM nº 88/2022**, que exige plataforma autorizada e limites estritos de captação) configura **oferta irregular**, sujeita a *stop order*, processo administrativo sancionador, multas severas e **crime contra o mercado de capitais** (Art. 27-E da Lei 6.385/76).
2. **Regulação de Ativos Virtuais (Lei nº 14.478/2022):**
   - Caso haja custódia, intermediação ou negociação de criptoativos (*tokens*), incide o Marco Legal dos Criptoativos sob regulação do Banco Central, exigindo autorização específica de Prestadora de Serviços de Ativos Virtuais (VASP), governança patrimonial e segregação de recursos.
3. **Obrigações Pesadas de AML / PLD-FT (Lei nº 9.613/1998 e Resolução CVM nº 50/2021):**
   - Operar `Capital Hub / Token Hub` transforma a plataforma em sujeito obrigado a políticas formais de **Prevenção à Lavagem de Dinheiro e Financiamento ao Terrorismo (PLD/FT)**: KYC/KYB completo, verificação de Pessoas Politicamente Expostas (PEP), monitoramento contínuo de operações atípicas, comunicação ao COAF e guarda de registros por no mínimo 5 anos.
4. **Agravante com Menores de Idade (Lei Geral do Esporte nº 14.597/2023):**
   - A captação ou tokenização de direitos econômicos/receitas futuras envolvendo **atletas menores de 18 anos** esbarra em restrições severas de proteção ao menor, nulidade de atos de disposição patrimonial sem autorização judicial/parental e altíssimo risco reputacional e trabalhista-desportivo.

**Veredito Categórico (CVM / AML):**
- **ISOLAR E REMOVER INTEGRALMENTE `Capital Hub` E `Token Hub` DO MVP.**
- Manter essas frentes fora do protótipo de 60 dias, fora do escopo inicial de engenharia e fora de promessas comerciais no Parque Tecnológico. Qualquer retomada futura deverá ocorrer apenas em fase pós-escala, **exclusivamente via parceiro regulado (plataforma autorizada na RCVM 88 ou instituição regulada)** e restrita a atletas maiores de idade ou veículos empresariais devidamente estruturados.

---

## 3. Plano de Ação Imediato (Pré-Requisitos para Fase 3 e Piloto)

1. **[Bloqueador PI] Busca INPI & NDAs:** Executar busca formal de anterioridade para `Next Gen Sports` / `NGS` (classes 35, 41, 42) e firmar **NDAs + Termos de Cessão de PI** antes de novas agendas técnicas com terceiros no Parque Tecnológico.
2. **[Bloqueador Escopo] Descomissionar `Capital Hub / Token Hub` e `LIE` do MVP:** Remover telas/promessas de tokenização, captação regulada e fast-track de incentivo fiscal do escopo da Fase 1 (60 dias).
3. **[Bloqueador Piloto Real] Arquitetura LGPD Menores:** Definir no SDD/PRD da nova fase: (a) fluxo de **consentimento parental verificável**, (b) **Privacy by Default** para perfis < 18 anos, (c) **vedação de dados biométricos/saúde** no MVP, e (d) **proibição de tráfego de dados de menores no FeedHive White Label**.
4. **[Contratual] Desacoplamento White Label:** Estruturar eventual uso do FeedHive apenas como conector externo de publicação de mídia aprovada, com DPA (Resolução ANPD nº 19/2024) e camada de abstração que evite *lock-in*.
